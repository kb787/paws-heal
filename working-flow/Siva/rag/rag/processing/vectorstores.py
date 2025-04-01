import os
import tiktoken
from Siva.rag.rag.models import Models
from Siva.rag.rag.settings import logger
from llama_index.core import Settings
from Siva.rag.rag.processing.database import DatabaseConnector
from pymongo.operations import SearchIndexModel
from llama_index.core.callbacks import TokenCountingHandler
from llama_index.core import VectorStoreIndex, StorageContext
# from llama_index.vector_stores.mongodb import MongoDBAtlasVectorSearch
from langchain.vectorstores import MongoDBAtlasVectorSearch

class VectorStoreManager:
    """
    A class for managing vector stores in a database.

    Methods
    -------
    create_vector_store_index(name: str) -> SearchIndexModel
        Creates a vector search index for a vector store in MongoDB Atlas.

    add_to_vector_store(db_name: str, collection_name: str, index_name: str, documents: list) -> VectorStoreIndex
        Adds documents to an existing vector store in the database.

    get_vector_store(db_name: str, collection_name: str, index_name: str) -> VectorStoreIndex
        Retrieves an existing vector store from the database.

    delete_vector_store_collection(db_name: str, collection_name: str)
        Deletes an existing vector store from the database.

    delete_document(db_name: str, collection_name: str, file_name: str)
        Deletes a single document from an existing vector store from the database.

    update_document(db_name: str, collection_name: str, file_name: str, document: list)
        Updates a single document in an existing vector store in the database.
    """

    def __init__(self, URI: str):
        """
        Initializes the VectorStoreManager with a MongoDB client.
        """
        self.URI = URI
        db = DatabaseConnector("mongodb", URI)
        self.client = db.client
        self.models = Models()
        Settings.llm = self.models.azure_llm
        Settings.embed_model = self.models.embed_model
        os.environ["ALLOW_RESET"] = "TRUE"

    @classmethod
    def _create_vector_store_index(self, name: str) -> SearchIndexModel:
        """
        Creates a vector search index for a vector store in MongoDB Atlas.

        Returns
        -------
        SearchIndexModel
            The created search index model.
        """
        try:
            search_index_model = SearchIndexModel(
                definition={
                "mappings": {
                    "dynamic": True,
                        "fields": [
                        {
                            "type": "vector",
                            "path": "embedding",
                            "numDimensions": 1536,
                            "similarity": "cosine"
                        },
                        {
                            "type": "filter",
                            "path": "metadata.page_label"
                        }
                    ]
                }
                },
                name=name,
                type="vectorSearch",
            )
            logger.info("Vector search index created successfully.")
            return search_index_model
        except Exception as e:
            logger.error(f"Error creating vector index: {e}")

    def create_vector_store(self, db_name: str, collection_name: str, documents: list) -> MongoDBAtlasVectorSearch:
        """
        Creates a vector store in MongoDB Atlas from a list of documents.

        Parameters
        ----------
        db_name : str
            The name of the database.
        collection_name : str
            The name of the collection.
        documents : list
            A list of documents to index.

        Returns
        -------
        VectorStoreIndex
            The created vector store index.

        Raises
        ------
        ValueError
            If the documents list is empty.
        Exception
            If there is an error creating the vector store.
        """
        if not documents:
            raise ValueError("The documents list cannot be empty.")
        
        try:
            index = self._create_vector_store_index(collection_name)
            MONGODB_COLLECTION = self.client[db_name][collection_name]
            vector_search = MongoDBAtlasVectorSearch.from_documents(
                documents=documents,
                embedding=self.models.embed_model,
                collection=MONGODB_COLLECTION,
                index_name=collection_name,
            )
            logger.info("Vector store created successfully")
            return vector_search
        except Exception as e:
            logger.error(f"Error creating vector store: {e}")
            raise

    def add_to_vector_store(self, db_name: str, collection_name: str, documents: list):
        """
        Adds documents to an existing vector store in MongoDB Atlas.

        Parameters
        ----------
        db_name : str
            The name of the database.
        collection_name : str
            The name of the collection.
        documents : list
            A list of documents to index.

        Returns
        -------
        VectorStoreIndex
            The updated vector store index.

        Raises
        ------
        ValueError
            If the documents list is empty.
        Exception
            If there is an error adding documents.
        """
        if not documents:
            raise ValueError("The documents list cannot be empty.")

        try:
            MONGODB_COLLECTION = self.client[db_name][collection_name]
            vector_search = MongoDBAtlasVectorSearch.from_documents(
                documents=documents,
                embedding=self.models.embed_model,
                collection=MONGODB_COLLECTION,
                index_name=collection_name,
            )
            logger.info("Documents added successfully")
        except Exception as e:
            logger.error(f"Error adding documents: {e}")
            raise

    def _get_vector_store(self, db_name: str, collection_name: str) -> MongoDBAtlasVectorSearch:
        """
        Retrieves an existing vector store from MongoDB Atlas.

        Parameters
        ----------
        db_name : str
            The name of the database.
        collection_name : str
            The name of the collection.

        Returns
        -------
        VectorStoreIndex
            The retrieved vector store index.

        Raises
        ------
        Exception
            If there is an error retrieving the vector store.
        """
        try:
            vectorstore = MongoDBAtlasVectorSearch.from_connection_string(
                self.URI,
                db_name + "." + collection_name,
                self.models.embed_model,
                index_name=collection_name,
            )
            logger.info("Vector store retrieved successfully")
            return vectorstore
        except Exception as e:
            logger.error(f"Error retrieving vector store: {e}")
            raise

    def delete_vector_store_collection(self, db_name: str, collection_name: str):
        """
        Deletes an existing vector store from MongoDB Atlas.

        Parameters
        ----------
        db_name : str
            The name of the database.
        collection_name : str
            The name of the collection.

        Raises
        ------
        Exception
            If there is an error deleting the vector store.
        """
        try:
            db = self.client[db_name]
            db.drop_collection(collection_name)
            logger.info("Vector store deleted successfully")
        except Exception as e:
            logger.error(f"Error deleting vector store: {e}")
            raise

    def delete_document(self, db_name: str, collection_name: str, file_name: str):
        """
        Deletes a single document from an existing vector store from MongoDB Atlas.

        Parameters
        ----------
        db_name : str
            The name of the database.
        collection_name : str
            The name of the collection.
        file_name : str
            The name of the document.

        Raises
        ------
        Exception
            If there is an error deleting the document.
        """
        try:
            db = self.client[db_name]
            condition = {'file_name': file_name}
            collection = db[collection_name]
            result = collection.delete_many(condition)
            logger.info(f"{result.deleted_count} documents associated with {file_name} have been deleted.")
        except Exception as e:
            logger.error(f"Error deleting document: {e}")
            raise

    def update_document(self, db_name: str, collection_name: str, file_name: str, document: list):
        """
        Updates a single document in an existing vector store in MongoDB Atlas.

        Parameters
        ----------
        db_name : str
            The name of the database.
        collection_name : str
            The name of the collection.
        file_name : str
            The name of the document.
        document : list
            The updated document.

        Raises
        ------
        Exception
            If there is an error updating the document.
        """
        try:
            db = self.client[db_name]
            condition = {'file_name': file_name}
            collection = db[collection_name]
            collection.delete_many(condition)
            self.add_to_vector_store(db_name, collection_name, collection_name, document)
            logger.info(f"Document {file_name} has been updated.")
        except Exception as e:
            logger.error(f"Error updating document: {e}")
            raise