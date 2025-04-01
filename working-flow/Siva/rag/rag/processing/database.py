# import redis
import pymongo
# import sqlalchemy
from Siva.rag.rag.settings import logger
from Siva.rag.rag.secrets import Secrets

class DatabaseConnector:
    """
    A class to connect to different types of databases.

    Attributes
    ----------
    client : object
        An instance of the database client, which could be for MongoDB, SQL, etc.
    """

    def __init__(self, db_type: str, URI: str):
        """
        Initializes the DatabaseConnector and establishes a connection
        based on the specified database type.

        Parameters
        ----------
        db_type : str
            The type of database to connect to (e.g., 'mongodb').
            
            Note: Currently only 'mongodb' is supported.
        """
        self.client = None

        if db_type == 'mongodb':
            self.connect_mongodb(URI)
        elif db_type == 'redis':
            self.connect_redis(URI)
        else:
            logger.error(f"Unsupported database type: {db_type}")
            raise ValueError(f"Unsupported database type: {db_type}")

    def connect_mongodb(self, URI: str):
        """
        Connects to MongoDB using the provided URI.

        Parameters
        ----------
        URI : str
            The connection string for MongoDB.

        Raises
        ------
        pymongo.errors.ConnectionFailure
            If there is an error connecting to MongoDB.
        """
        try:
            self.client = pymongo.MongoClient(URI)
            logger.info("Connected to MongoDB")
        except pymongo.errors.ConnectionFailure as e:
            logger.error(f"Error connecting to MongoDB: {e}")
            raise

    def connect_redis(self, URI: str):
        """
        Connects to Redis using the provided URI.

        Parameters
        ----------
        URI : str
            The connection string for Redis.

        Raises
        ------
        pymongo.errors.ConnectionFailure
            If there is an error connecting to Redis.
        """
        try:
            self.client = redis.Redis.from_url(URI)
            logger.info("Connected to Redis")
        except Exception as e:
            logger.error(f"Error connecting to Redis: {e}")
            raise


    # def connect_sql(self):
    #     """
    #     Connects to SQL database using the connection string from Secrets.

    #     Raises
    #     ------
    #     sqlalchemy.exc.OperationalError
    #         If there is an error connecting to the SQL database.
    #     """
    #     try:
    #         engine = sqlalchemy.create_engine(Secrets.SQL_CONNECTION_STRING)
    #         self.client = engine.connect()
    #         logger.info("Connected to SQL database")
    #     except sqlalchemy.exc.OperationalError as e:
    #         logger.error(f"Error connecting to SQL database: {e}")
    #         raise