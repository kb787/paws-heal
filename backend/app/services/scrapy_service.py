import os
import logging
import asyncio
import nltk
from multiprocessing import Process, Queue
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from backend.scrapy_project.spiders.my_spider import MySpider
from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import AzureOpenAIEmbeddings
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Output directories
OUTPUT_DIR = "output/Docs"
MD_DIR = os.path.join(OUTPUT_DIR, "md")
CRAWLED_URLS_DIR = os.path.join(OUTPUT_DIR, "crawled_urls")

# Ensure output directories exist
os.makedirs(MD_DIR, exist_ok=True)
os.makedirs(CRAWLED_URLS_DIR, exist_ok=True)

# Embedding model and MongoDB configurations
embed_model = AzureOpenAIEmbeddings(
    openai_api_version=os.getenv("AOAI_TE3S_VERSION"),
    base_url=os.getenv("AOAI_TE3S_BASE_URL"),
    openai_api_key=os.getenv("AOAI_TE3S_KEY"),
)
MONGO_URI = os.getenv("ATLAS_CONNECTION_STRING")
DB_NAME = "SIH"
COLLECTION_NAME = "pdfs"
INDEX_NAME = "pdfs"


def save_markdown(self, url, markdown_content, html_content):
    file_name = os.path.join(MD_DIR, f"{urlparse(url).netloc}.md")
    try:
        with open(file_name, "w", encoding="utf-8") as f:
            f.write(f"URL: {url}\n")
            f.write(f"Title: {self.get_page_title(html_content)}\n")
            f.write(f"Content:\n{markdown_content}\n")
    except Exception as e:
        self.logger.error(f"Failed to save markdown for {url}: {str(e)}")


async def process_md_and_embed():
    """Load Markdown files, generate embeddings, and store them in the vector DB."""
    try:
        nltk_data_path = os.path.join(os.getcwd(), "nltk_data")
        os.makedirs(nltk_data_path, exist_ok=True)
        nltk.data.path.append(nltk_data_path)
        nltk.download("punkt", download_dir=nltk_data_path)
        nltk.download("punkt_tab", download_dir=nltk_data_path)
        nltk.download("averaged_perceptron_tagger_eng", download_dir=nltk_data_path)

        nltk.data.path.append(nltk_data_path)
        logger.info(f"Using NLTK data paths: {nltk.data.path}")
        md_files = [
            os.path.join(MD_DIR, file)
            for file in os.listdir(MD_DIR)
            if file.endswith(".md")
        ]
        documents = []

        # Load Markdown files
        for md_file in md_files:
            loader = UnstructuredMarkdownLoader(md_file)
            md_docs = loader.load()
            for doc in md_docs:
                doc.metadata["source"] = "Markdown"
                doc.metadata["file_name"] = os.path.basename(md_file)
            documents.extend(md_docs)

        # Split documents for optimal ingestion
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500, chunk_overlap=100
        )
        documents = text_splitter.split_documents(documents)

        # If documents are available, create vector store
        if documents:
            create_vector_store_from_documents(COLLECTION_NAME, INDEX_NAME, documents)

            # Delete processed files after successful ingestion
            for md_file in md_files:
                os.remove(md_file)
                logger.info(f"Deleted processed file: {md_file}")

    except Exception as e:
        logger.error(f"Error processing Markdown files: {e}")
        raise


# Function to create vector store from documents
def create_vector_store_from_documents(
    collection_name: str, index_name: str, documents: list
):
    """Generate embeddings and store in the vector database."""
    if not documents:
        raise ValueError("No documents provided for embedding.")

    try:
        client = MongoClient(MONGO_URI)
        collection = client[DB_NAME][collection_name]
        vector_search = MongoDBAtlasVectorSearch(
            embedding=embed_model,
            collection=collection,
            index_name=index_name,
            relevance_score_fn="cosine",
        )

        vector_search.add_documents(documents)
        logger.info(
            f"Successfully added {len(documents)} documents to the vector store."
        )
    except Exception as e:
        logger.error(f"Error adding documents to vector store: {e}")
        raise


# Function to run the Scrapy spider
def run_spider_process(
    spider, start_urls, depth_limit, exclude_domains, exclude_keywords, mode, queue
):
    """Runs the Scrapy spider process."""
    process = CrawlerProcess(get_project_settings())
    process.crawl(
        spider,
        start_urls=start_urls,
        depth_limit=depth_limit,
        excluded_domains=exclude_domains,
        excluded_keywords=exclude_keywords,
        mode=mode,
        output_dir=OUTPUT_DIR,
    )
    process.start()
    queue.put("Spider finished")


# Function to handle asynchronous spider execution
async def run_spider(
    spider,
    start_urls,
    depth_limit=None,
    exclude_domains=None,
    exclude_keywords=None,
    mode="scrape",
):
    """Runs the Scrapy spider in a separate process and waits for it to complete."""
    queue = Queue()
    process = Process(
        target=run_spider_process,
        args=(
            spider,
            start_urls,
            depth_limit,
            exclude_domains,
            exclude_keywords,
            mode,
            queue,
        ),
    )
    process.start()
    result = await asyncio.get_event_loop().run_in_executor(None, queue.get)
    process.join()

    # If mode is 'scrape', process the Markdown files and embed
    if mode == "scrape":
        await process_md_and_embed()

    return result
