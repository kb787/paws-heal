import os
import re
import logging
import json
from googleapiclient.discovery import build
from youtube_transcript_api import YouTubeTranscriptApi
from langchain_core.document_loaders.base import BaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import AzureOpenAIEmbeddings
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from langchain.schema import Document
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import logging
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Access credentials from environment variables
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
OPENAI_API_VERSION = os.getenv("AOAI_TE3S_VERSION")
OPENAI_BASE_URL = os.getenv("AOAI_TE3S_BASE_URL")
OPENAI_API_KEY = os.getenv("AOAI_TE3S_KEY")
MONGO_URI = os.getenv("ATLAS_CONNECTION_STRING")
DB_NAME = "SIH"
COLLECTION_NAME = "transcripts"
INDEX_NAME = "transcripts"

# Directory paths
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
TRANSCRIPTS_DIR = os.path.join(ROOT_DIR, "Transcripts")
# Ensure Transcripts directory exists
os.makedirs(TRANSCRIPTS_DIR, exist_ok=True)

# FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React's localhost port
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Pydantic model to handle incoming requests for the YouTube channel handle
class YouTubeChannelRequest(BaseModel):
    channel_handle: str


# Function to preprocess text
def preprocess(text):
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"[।॥]", ".", text)
    return text


# Class to load documents
class TextLoader(BaseLoader):
    def __init__(self, file_path: str):
        self.file_path = file_path

    def lazy_load(self):
        if os.path.isdir(self.file_path):  # Check if file_path is a directory
            for file_name in os.listdir(self.file_path):
                full_path = os.path.join(self.file_path, file_name)
                if os.path.isfile(full_path) and file_name.endswith(".txt"):
                    with open(full_path, encoding="utf-8") as file:
                        text = file.read()
                        yield Document(
                            page_content=text, metadata={"file_path": full_path}
                        )

    def load(self):
        return list(self.lazy_load())


# Function to save transcript to text file
def save_transcript_to_txt(transcript, output_file):
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        for entry in transcript:
            timestamp = (
                f"{int(entry['start'] // 60):02d}:{int(entry['start'] % 60):02d}"
            )
            f.write(f"{timestamp}: {entry['text']}\n")


# Fetch video URLs from channel handle
def get_video_urls_by_handle(handle):
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

            page_token = response.get("nextPageToken", None)
            if not page_token:
                break

        return video_urls
    except Exception as e:
        logging.error(f"Error fetching video URLs: {e}")
        return []


# Fetch transcript for a video
def fetch_youtube_transcript(video_id):
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        try:
            transcript = transcript_list.find_transcript(["en"])
            return transcript.fetch()
        except Exception:
            generated_transcripts = [t for t in transcript_list if t.is_generated]
            if generated_transcripts:
                return generated_transcripts[0].fetch()
            else:
                raise ValueError("No transcripts available.")
    except Exception as e:
        logging.error(f"Error fetching transcript for video {video_id}: {e}")
        return None


# Function to load and split the transcripts
def load_and_split_transcripts(transcript_directory: str):
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

        logging.info(f"Loaded {len(documents)} documents from {transcript_directory}")
        return documents
    except Exception as e:
        logging.error(f"Error loading documents from directory: {e}")
        raise


# Generate and store embeddings in MongoDB
def create_vector_store(documents, db_name, collection_name, index_name):
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
        logging.info("Documents added successfully in the Vector Database")
        return vector_search
    except Exception as e:
        logging.error(f"Error creating vector store: {e}")
        raise


# FastAPI route to process the YouTube channel
@app.post("/process_channel/")
async def process_youtube_channel(request: YouTubeChannelRequest):
    channel_handle = request.channel_handle

    # Fetch video URLs
    video_data = get_video_urls_by_handle(channel_handle)
    if not video_data:
        raise HTTPException(status_code=404, detail="No video URLs fetched.")

    # Fetch and save transcripts
    for video in video_data:
        video_id = video["VideoID"]
        logging.info(f"Processing video: {video['URL']}")
        transcript = fetch_youtube_transcript(video_id)
        if transcript:
            # Preprocess transcript
            for entry in transcript:
                entry["text"] = preprocess(entry["text"])

            save_transcript_to_txt(
                transcript, os.path.join(TRANSCRIPTS_DIR, f"transcript_{video_id}.txt")
            )
        else:
            logging.warning(f"Transcript not available for video {video_id}")

    # Load and split transcripts
    documents = load_and_split_transcripts(TRANSCRIPTS_DIR)

    # Generate and store embeddings
    create_vector_store(
        documents,
        db_name=DB_NAME,
        collection_name=COLLECTION_NAME,
        index_name=INDEX_NAME,
    )

    return {"message": "Loaded  {len(documents)} of documents from the channel."}


# Run the FastAPI server with uvicorn (command)
# uvicorn youtube_tool:app --reload



# SCRAPE CODE -->

# import os
# import logging
# import asyncio
# import nltk
# from multiprocessing import Process, Queue
# from scrapy.crawler import CrawlerProcess
# from scrapy.utils.project import get_project_settings
# from scrapy_project.spiders.my_spider import MySpider
# from langchain_community.document_loaders import UnstructuredMarkdownLoader
# from langchain_openai import AzureOpenAIEmbeddings
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_community.vectorstores import MongoDBAtlasVectorSearch
# from pymongo import MongoClient
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Output directories
# OUTPUT_DIR = "output/Docs"
# MD_DIR = os.path.join(OUTPUT_DIR, "md")
# CRAWLED_URLS_DIR = os.path.join(OUTPUT_DIR, "crawled_urls")


# # Ensure output directories exist
# os.makedirs(MD_DIR, exist_ok=True)
# os.makedirs(CRAWLED_URLS_DIR, exist_ok=True)

# # Embedding model and MongoDB configurations
# embed_model = AzureOpenAIEmbeddings(
#     openai_api_version=os.getenv("AOAI_TE3S_VERSION"),
#     base_url=os.getenv("AOAI_TE3S_BASE_URL"),
#     openai_api_key=os.getenv("AOAI_TE3S_KEY"),
# )
# MONGO_URI = os.getenv("ATLAS_CONNECTION_STRING")
# DB_NAME = "SIH"
# COLLECTION_NAME = "pdfs"
# INDEX_NAME = "pdfs"


# def save_markdown(self, url, markdown_content, html_content):

#     file_name = os.path.join(MD_DIR, f"{urlparse(url).netloc}.md")
#     try:
#         with open(file_name, "w", encoding="utf-8") as f:
#             f.write(f"URL: {url}\n")
#             f.write(f"Title: {self.get_page_title(html_content)}\n")
#             f.write(f"Content:\n{markdown_content}\n")
#     except Exception as e:
#         self.logger.error(f"Failed to save markdown for {url}: {str(e)}")


# async def process_md_and_embed():
#     """Load Markdown files, generate embeddings, and store them in the vector DB."""
#     try:
#         nltk_data_path = os.path.join(os.getcwd(), "nltk_data")
#         os.makedirs(nltk_data_path, exist_ok=True)
#         nltk.data.path.append(nltk_data_path)
#         nltk.download("punkt", download_dir=nltk_data_path)
#         nltk.download("punkt_tab", download_dir=nltk_data_path)
#         nltk.download("averaged_perceptron_tagger_eng", download_dir=nltk_data_path)

#         nltk.data.path.append(nltk_data_path)
#         logger.info(f"Using NLTK data paths: {nltk.data.path}")

#         md_files = [
#             os.path.join(MD_DIR, file)
#             for file in os.listdir(MD_DIR)
#             if file.endswith(".md")
#         ]
#         documents = []

#         # Load Markdown files
#         for md_file in md_files:
#             loader = UnstructuredMarkdownLoader(md_file)
#             md_docs = loader.load()
#             for doc in md_docs:
#                 doc.metadata["source_type"] = "Markdown"
#                 doc.metadata["file_name"] = os.path.basename(md_file)
#             documents.extend(md_docs)

#             text_splitter = RecursiveCharacterTextSplitter(
#                 chunk_size=500, chunk_overlap=100
#             )
#         documents = text_splitter.split_documents(documents)

#         # If documents are available, create vector store
#         if documents:
#             # create_vector_store_from_documents(COLLECTION_NAME, INDEX_NAME, documents)
#             print("Success")
#     except Exception as e:
#         logger.error(f"Error processing Markdown files: {e}")
#         raise


# # Function to create vector store from documents
# def create_vector_store_from_documents(
#     collection_name: str, index_name: str, documents: list
# ):
#     """Generate embeddings and store in the vector database."""
#     if not documents:
#         raise ValueError("No documents provided for embedding.")

#     try:
#         client = MongoClient(MONGO_URI)
#         collection = client[DB_NAME][collection_name]
#         vector_search = MongoDBAtlasVectorSearch(
#             embedding=embed_model,
#             collection=collection,
#             index_name=index_name,
#             relevance_score_fn="cosine",
#         )

#         vector_search.add_documents(documents)
#         logger.info(
#             f"Successfully added {len(documents)} documents to the vector store."
#         )
#     except Exception as e:
#         logger.error(f"Error adding documents to vector store: {e}")
#         raise


# # Function to get output files
# def get_output_files():
#     """Returns the list of output files (Markdown and crawled URLs)."""
#     md_files = [
#         os.path.join(MD_DIR, file)
#         for file in os.listdir(MD_DIR)
#         if file.endswith(".md")
#     ]
#     crawled_files = [
#         os.path.join(CRAWLED_URLS_DIR, file) for file in os.listdir(CRAWLED_URLS_DIR)
#     ]
#     return {"markdown_files": md_files, "crawled_url_files": crawled_files}


# # Function to run the Scrapy spider
# def run_spider_process(
#     spider, start_urls, depth_limit, exclude_domains, exclude_keywords, mode, queue
# ):
#     """Runs the Scrapy spider process."""
#     process = CrawlerProcess(get_project_settings())
#     process.crawl(
#         spider,
#         start_urls=start_urls,
#         depth_limit=depth_limit,
#         excluded_domains=exclude_domains,
#         excluded_keywords=exclude_keywords,
#         mode=mode,
#         output_dir=OUTPUT_DIR,
#     )
#     process.start()
#     queue.put("Spider finished")


# # Function to handle asynchronous spider execution
# async def run_spider(
#     spider,
#     start_urls,
#     depth_limit=None,
#     exclude_domains=None,
#     exclude_keywords=None,
#     mode="scrape",
# ):
#     """Runs the Scrapy spider in a separate process and waits for it to complete."""
#     queue = Queue()
#     process = Process(
#         target=run_spider_process,
#         args=(
#             spider,
#             start_urls,
#             depth_limit,
#             exclude_domains,
#             exclude_keywords,
#             mode,
#             queue,
#         ),
#     )
#     process.start()
#     result = await asyncio.get_event_loop().run_in_executor(None, queue.get)
#     process.join()

#     # If mode is 'scrape', process the Markdown files
#     if mode == "scrape":
#         await process_md_and_embed()
#     return result


# import os
# import logging
# import asyncio
# from multiprocessing import Process, Queue
# from scrapy.crawler import CrawlerProcess
# from scrapy.utils.project import get_project_settings
# from scrapy_project.spiders.my_spider import MySpider

# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# OUTPUT_DIR = "output/Docs"

# MD_DIR = os.path.join(OUTPUT_DIR, "md")
# CRAWLED_URLS_DIR = os.path.join(OUTPUT_DIR, "crawled_urls")

# # Ensure output directories exist
# os.makedirs(MD_DIR, exist_ok=True)
# os.makedirs(CRAWLED_URLS_DIR, exist_ok=True)


# def run_spider_process(
#     spider, start_urls, depth_limit, exclude_domains, exclude_keywords, mode, queue
# ):
#     """Runs the Scrapy spider process."""
#     process = CrawlerProcess(get_project_settings())
#     process.crawl(
#         spider,
#         start_urls=start_urls,
#         depth_limit=depth_limit,
#         excluded_domains=exclude_domains,
#         excluded_keywords=exclude_keywords,
#         mode=mode,
#         output_dir=OUTPUT_DIR,
#     )
#     process.start()
#     queue.put("Spider finished")


# async def run_spider(
#     spider,
#     start_urls,
#     depth_limit=None,
#     exclude_domains=None,
#     exclude_keywords=None,
#     mode="scrape",
# ):
#     """Runs the Scrapy spider in a separate process and waits for it to complete."""
#     queue = Queue()
#     process = Process(
#         target=run_spider_process,
#         args=(
#             spider,
#             start_urls,
#             depth_limit,
#             exclude_domains,
#             exclude_keywords,
#             mode,
#             queue,
#         ),
#     )
#     process.start()
#     result = await asyncio.get_event_loop().run_in_executor(None, queue.get)
#     process.join()
#     return result


# def get_output_files():
#     """Returns the list of output files (Markdown and crawled URLs)."""
#     md_files = [os.path.join(MD_DIR, file) for file in os.listdir(MD_DIR)]
#     crawled_files = [
#         os.path.join(CRAWLED_URLS_DIR, file) for file in os.listdir(CRAWLED_URLS_DIR)
#     ]
#     return {"markdown_files": md_files, "crawled_url_files": crawled_files}

