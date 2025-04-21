import os
import logging
from typing import List, Dict, Optional

import googleapiclient.errors
from googleapiclient.discovery import build
from youtube_transcript_api import (
    YouTubeTranscriptApi,
    TranscriptsDisabled,
    NoTranscriptFound,
)
from langchain_core.document_loaders.base import BaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import AzureOpenAIEmbeddings
from langchain_community.vectorstores import MongoDBAtlasVectorSearch

from pymongo import MongoClient
from dotenv import load_dotenv
from langchain.schema import Document

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("youtube_transcript_loader.log"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configuration constants
TRANSCRIPTS_DIR = "output/Transcripts/"
os.makedirs(TRANSCRIPTS_DIR, exist_ok=True)


class TextLoader(BaseLoader):
    def __init__(self, file_path: str):
        self.file_path = file_path

    def lazy_load(self):
        if os.path.isdir(self.file_path):
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

    def load(self):
        return list(self.lazy_load())


def get_video_urls_by_handle(handle: str):
    """
    Fetch video URLs for a given YouTube channel handle with improved error handling.

    Args:
        handle (str): YouTube channel handle

    Returns:
        List of video URL dictionaries
    """
    try:
        # Validate API key
        YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
        if not YOUTUBE_API_KEY:
            raise ValueError("YouTube API key is missing")

        youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)

        # Fetch channel ID
        channel_request = youtube.channels().list(part="id", forHandle=handle)
        channel_response = channel_request.execute()

        if not channel_response.get("items"):
            logger.warning(f"No channel found for handle: {handle}")
            return []

        channel_id = channel_response["items"][0]["id"]

        video_urls = []
        base_url = "https://www.youtube.com/watch?v="
        page_token = None

        while True:
            try:
                search_request = youtube.search().list(
                    channelId=channel_id,
                    part="id",
                    type="video",
                    order="date",
                    maxResults=50,
                    pageToken=page_token,
                )
                search_response = search_request.execute()

                for item in search_response.get("items", []):
                    video_urls.append(
                        {
                            "ChannelName": handle.lstrip("@"),
                            "URL": base_url + item["id"]["videoId"],
                            "VideoID": item["id"]["videoId"],
                        }
                    )

                page_token = search_response.get("nextPageToken")
                if not page_token:
                    break

            except googleapiclient.errors.HttpError as e:
                logger.error(f"API request error: {e}")
                break

        return video_urls

    except Exception as e:
        logger.error(f"Unexpected error fetching video URLs: {e}")
        raise


def fetch_youtube_transcript(video_id: str):
    """
    Fetch transcript for a YouTube video with robust error handling.

    Args:
        video_id (str): YouTube video ID

    Returns:
        Transcript or None
    """
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # Try fetching English transcript first
        try:
            return transcript_list.find_transcript(["en"]).fetch()
        except Exception:
            # Fallback to auto-generated transcripts in other languages
            for transcript in transcript_list:
                if transcript.is_generated:
                    logger.info(
                        f"Fetching auto-generated transcript in {transcript.language} for video {video_id}."
                    )
                    return transcript.fetch()

            logger.warning(f"No usable transcript available for video: {video_id}")
            return None

    except TranscriptsDisabled:
        logger.warning(f"Transcripts disabled for video: {video_id}")
    except NoTranscriptFound:
        logger.warning(f"No transcripts found for video: {video_id}")
    except Exception as e:
        logger.error(f"Failed to fetch transcript for {video_id}: {e}")

    return None


def save_transcript_to_txt(transcript, output_file: str):
    """
    Save transcript to a text file with improved error handling.

    Args:
        transcript (list): Transcript data
        output_file (str): Path to output file
    """
    try:
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, "w", encoding="utf-8") as f:
            for entry in transcript:
                # Sanitize text to remove potential problematic characters
                cleaned_text = entry["text"].replace("\n", " ").strip()
                f.write(f"{entry['start']}: {cleaned_text}\n")

        logger.info(f"Transcript saved: {output_file}")
    except IOError as e:
        logger.error(f"Error saving transcript to {output_file}: {e}")
        raise


def load_and_split_transcripts(transcript_directory: str):
    """
    Load and split transcripts with improved error handling.

    Args:
        transcript_directory (str): Directory containing transcript files

    Returns:
        List of split documents
    """
    try:
        reader = TextLoader(file_path=transcript_directory)
        documents = reader.load()

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500, chunk_overlap=100
        )
        documents = text_splitter.split_documents(documents)

        for doc in documents:
            file_path = doc.metadata.get("file_path", "")
            transcript_id = file_path.split("transcript_")[-1].split(".txt")[0]
            yt_link = f"https://www.youtube.com/watch?v={transcript_id}"
            doc.metadata["yt_link"] = yt_link

        logger.info(f"Loaded {len(documents)} documents from {transcript_directory}")
        return documents
    except Exception as e:
        logger.error(f"Error loading documents from directory: {e}")
        raise


def create_vector_store(documents, db_name, collection_name, index_name):
    """
    Create vector store with improved error handling and logging.

    Args:
        documents (list): List of documents to store
        db_name (str): MongoDB database name
        collection_name (str): MongoDB collection name
        index_name (str): Vector index name

    Returns:
        Vector search instance
    """
    try:
        # Load credentials from environment variables
        MONGO_URI = os.getenv("ATLAS_CONNECTION_STRING")
        OPENAI_API_VERSION = os.getenv("AOAI_TE3S_VERSION")
        OPENAI_BASE_URL = os.getenv("AOAI_TE3S_BASE_URL")
        OPENAI_API_KEY = os.getenv("AOAI_TE3S_KEY")

        # Validate credentials
        if not all([MONGO_URI, OPENAI_API_VERSION, OPENAI_BASE_URL, OPENAI_API_KEY]):
            raise ValueError("Missing required credentials for vector store")

        client = MongoClient(MONGO_URI)
        db = client[db_name]
        collection = db[collection_name]

        embed_model = AzureOpenAIEmbeddings(
            openai_api_version=OPENAI_API_VERSION,
            base_url=OPENAI_BASE_URL,
            openai_api_key=OPENAI_API_KEY,
        )

        vector_search = MongoDBAtlasVectorSearch(
            embedding=embed_model,
            collection=collection,
            index_name=index_name,
            relevance_score_fn="cosine",
        )

        vector_search.add_documents(documents)
        logger.info("Documents added successfully in the Vector Database")
        return vector_search
    except Exception as e:
        logger.error(f"Error creating vector store: {e}")
        raise


def process_youtube_channel(channel_handle: str):
    """
    Process a YouTube channel with comprehensive error handling.

    Args:
        channel_handle (str): YouTube channel handle

    Returns:
        Processing status message
    """
    try:
        # Fetch video URLs
        video_urls = get_video_urls_by_handle(channel_handle)

        if not video_urls:
            error_msg = f"No videos found for channel: {channel_handle}"
            logger.warning(error_msg)
            raise ValueError(error_msg)

        # Process transcripts
        for video in video_urls:
            transcript = fetch_youtube_transcript(video["VideoID"])
            if transcript:
                transcript_file = os.path.join(
                    TRANSCRIPTS_DIR, f"transcript_{video['VideoID']}.txt"
                )
                save_transcript_to_txt(transcript, transcript_file)

        # Load and create vector store
        documents = load_and_split_transcripts(TRANSCRIPTS_DIR)
        create_vector_store(documents, "SIH", "transcripts", "transcripts")

        return "YouTube processing completed successfully."

    except Exception as e:
        logger.error(f"Channel processing failed: {e}")
        raise
