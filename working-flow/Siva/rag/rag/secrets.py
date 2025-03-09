import os
from dotenv import load_dotenv

load_dotenv()


class Secrets:
    GPT4o_BASE_URL = os.environ.get("AOAI_GPT4o_BASE_URL")
    GPT4o_VERSION = os.environ.get("AOAI_GPT4o_VERSION")
    GPT4o_KEY = os.environ.get("AOAI_GPT4o_KEY")
    GPT4o_MODEL = os.environ.get("AOAI_GPT4o_MODEL")
    AOAI_GPT4o_DEPLOYMENT = os.environ.get("AOAI_GPT4o_DEPLOYMENT")

    TE3S_BASE_URL = os.environ.get("AOAI_TE3S_BASE_URL")
    TE3S_API_KEY = os.environ.get("AOAI_TE3S_KEY")
    TE3S_VERSION = os.environ.get("AOAI_TE3S_VERSION")
    TE3S_MODEL = os.environ.get("AOAI_TE3S_MODEL")
    TE3S_DEPLOYMENT = os.environ.get("AOAI_TE3S_DEPLOYMENT")

    LITELLM_KEY = os.environ.get("LITELLM_KEY")
    LITELLM_BASE_URL = os.environ.get("LITELLM_BASE_URL")

    ATLAS_CONNECTION_STRING = os.environ.get("ATLAS_CONNECTION_STRING")
    REDIS_CONNECTION_STRING = os.environ.get("REDIS_CONNECTION_STRING")


    FILE_UPLOAD_LIMIT = 200
