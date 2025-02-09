import os
import re
import logging
from typing import List, Optional
from googleapiclient.discovery import build
from youtube_transcript_api import YouTubeTranscriptApi
from langchain_core.document_loaders.base import BaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import AzureOpenAIEmbeddings
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
from pymongo import MongoClient
from langchain.schema import Document

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("youtube_tool.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)
# Constants
API_KEY = "AIzaSyC37aXGoNXEJvxQt9SheSYrBADeE_Jx_a0"
ADA_VERSION = "2023-05-15"
ADA_BASE_URL = "https://aas-eastus2-hub386797580333.openai.azure.com/openai/deployments/text-embedding-3-small"
ADA_API_KEY = "c25d0b32155742f3b6b7f4bfa5e57e71"
MONGO_URI = "mongodb+srv://dhruvpatel150204:internship123@cluster0.ec2du.mongodb.net/"
DB_NAME = "SIH"
COLLECTION_NAME = "transcripts"
INDEX_NAME = "transcripts"

# Directory paths
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
TRANSCRIPTS_DIR = os.path.join(ROOT_DIR, "Transcripts")
# Ensure Transcripts directory exists
os.makedirs(TRANSCRIPTS_DIR, exist_ok=True)


# Helper function to preprocess text
def preprocess(text: str) -> str:
    """Preprocesses the transcript text."""
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"[।॥]", ".", text)
    return text


class TextLoader(BaseLoader):
    """Custom TextLoader for loading documents from files."""

    def __init__(self, file_path: str):
        self.file_path = file_path

    def lazy_load(self):
        if os.path.isdir(self.file_path):  # Check if it's a directory
            for file_name in os.listdir(self.file_path):
                full_path = os.path.join(self.file_path, file_name)
                if os.path.isfile(full_path) and file_name.endswith(".txt"):
                    try:
                        with open(full_path, encoding="utf-8") as file:
                            text = file.read()
                            yield Document(
                                page_content=text, metadata={"file_path": full_path}
                            )
                    except Exception as e:
                        logger.error(f"Error reading file {full_path}: {e}")
        else:  # Single file scenario
            try:
                with open(self.file_path, encoding="utf-8") as file:
                    text = file.read()
                    yield Document(
                        page_content=text, metadata={"file_path": self.file_path}
                    )
            except Exception as e:
                logger.error(f"Error reading file {self.file_path}: {e}")

    def load(self) -> List[Document]:
        return list(self.lazy_load())


# Function to save transcript to text file
def save_transcript_to_txt(transcript: List[dict], output_file: str):
    """Saves a transcript to a text file."""
    try:
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, "w", encoding="utf-8") as f:
            for entry in transcript:
                timestamp = (
                    f"{int(entry['start'] // 60):02d}:{int(entry['start'] % 60):02d}"
                )
                f.write(f"{timestamp}: {entry['text']}\n")
        logger.info(f"Transcript saved to {output_file}")
    except Exception as e:
        logger.error(f"Error saving transcript to {output_file}: {e}")


# Fetch video URLs from a YouTube channel handle
def get_video_urls_by_handle(handle: str) -> List[dict]:
    """Fetches video URLs from a YouTube channel handle."""
    try:
        youtube = build("youtube", "v3", developerKey=API_KEY)
        request = youtube.channels().list(part="id", forHandle=handle)
        response = request.execute()

        if "items" in response and response["items"]:
            channel_id = response["items"][0]["id"]
        else:
            raise ValueError(f"No channel found for handle: {handle}")

        video_urls = []
        base_url = "https://www.youtube.com/watch?v="
        page_token = ""

        while True:
            request = youtube.search().list(
                channelId=channel_id,
                part="id",
                order="date",
                maxResults=50,
                pageToken=page_token,
            )
            response = request.execute()

            for item in response.get("items", []):
                if item["id"]["kind"] == "youtube#video":
                    video_urls.append(
                        {
                            "ChannelName": handle.lstrip("@"),
                            "URL": base_url + item["id"]["videoId"],
                            "VideoID": item["id"]["videoId"],
                        }
                    )

            page_token = response.get("nextPageToken")
            if not page_token:
                break

        return video_urls
    except Exception as e:
        logger.error(f"Error fetching video URLs for handle {handle}: {e}")
        return []


# Fetch transcript for a video
def fetch_youtube_transcript(video_id: str) -> Optional[List[dict]]:
    """Fetches a YouTube transcript by video ID."""
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        try:
            return transcript_list.find_transcript(["en"]).fetch()
        except Exception:
            generated_transcripts = [t for t in transcript_list if t.is_generated]
            if generated_transcripts:
                return generated_transcripts[0].fetch()
            else:
                raise ValueError("No transcripts available.")
    except Exception as e:
        logger.error(f"Error fetching transcript for video {video_id}: {e}")
        return None


# Load and split transcripts
def load_and_split_transcripts(transcript_directory: str) -> List[Document]:
    """Loads and splits transcripts into documents."""
    try:
        reader = TextLoader(file_path=transcript_directory)
        documents = reader.load()
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500, chunk_overlap=100
        )
        documents = text_splitter.split_documents(documents)

        for doc in documents:
            file_path = doc.metadata.get("file_path", "")
            transcript_id = os.path.basename(file_path).split("_")[-1].split(".txt")[0]
            doc.metadata["yt_link"] = f"https://www.youtube.com/watch?v={transcript_id}"

        logger.info(
            f"Loaded and split {len(documents)} documents from {transcript_directory}"
        )
        return documents
    except Exception as e:
        logger.error(f"Error loading and splitting transcripts: {e}")
        raise


# Generate and store embeddings in MongoDB
def create_vector_store(
    documents: List[Document], db_name: str, collection_name: str, index_name: str
):
    """Generates and stores embeddings in MongoDB."""
    try:
        client = MongoClient(MONGO_URI)
        db = client[db_name]
        collection = db[collection_name]

        embed_model = AzureOpenAIEmbeddings(
            openai_api_version=ADA_VERSION,
            base_url=ADA_BASE_URL,
            openai_api_key=ADA_API_KEY,
        )

        vector_search = MongoDBAtlasVectorSearch(
            embedding=embed_model,
            collection=collection,
            index_name=index_name,
            relevance_score_fn="cosine",
        )

        vector_search.add_documents(documents)
        logger.info("Vector store created successfully")
    except Exception as e:
        logger.error(f"Error creating vector store: {e}")
        raise


# Process a YouTube channel
def process_youtube_channel(channel_handle: str):
    """Processes a YouTube channel by fetching video URLs, transcripts, and generating embeddings."""
    try:
        # Fetch video URLs
        video_data = get_video_urls_by_handle(channel_handle)
        if not video_data:
            logger.error("No video URLs fetched.")
            return

        # Fetch and save transcripts
        for video in video_data:
            video_id = video["VideoID"]
            logger.info(f"Processing video: {video['URL']}")
            transcript = fetch_youtube_transcript(video_id)
            if transcript:
                for entry in transcript:
                    entry["text"] = preprocess(entry["text"])
                save_transcript_to_txt(
                    transcript,
                    os.path.join(TRANSCRIPTS_DIR, f"transcript_{video_id}.txt"),
                )
            else:
                logger.warning(f"No transcript available for video {video_id}")

        # Load and split transcripts
        documents = load_and_split_transcripts(TRANSCRIPTS_DIR)

        # Generate and store embeddings
        create_vector_store(
            documents,
            db_name=DB_NAME,
            collection_name=COLLECTION_NAME,
            index_name=INDEX_NAME,
        )

    except Exception as e:
        logger.error(f"Error processing YouTube channel {channel_handle}: {e}")


# Run the tool
if __name__ == "__main__":
    process_youtube_channel("@GAILIndiaLimited")  # Replace with your channel handle
