from fastapi import FastAPI, HTTPException, Request, APIRouter
from pydantic import BaseModel
from Siva.rag.rag.inference.chat import ChatService

chat_service = ChatService()
router = APIRouter()


class QueryRequest(BaseModel):
    user_query: str


db_name = "SIH"
collection_name = "pdfs"


@router.post("/query")
async def query_endpoint(request: Request, query_request: QueryRequest):
    try:
        # Retrieve user_ip from middleware
        user_ip = request.state.user_ip
        response = None
        # Call the chat service with user_ip
        response = chat_service.chat(
            query_request.user_query, db_name, collection_name, user_ip=user_ip
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
