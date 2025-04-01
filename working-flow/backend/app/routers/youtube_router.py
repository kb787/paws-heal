from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.services.youtube_service import process_youtube_channel

router = APIRouter()


class ChannelHandleRequest(BaseModel):
    channel_handle: str


@router.post("/process-channel/")
async def process_channel(request: ChannelHandleRequest):
    """
    Endpoint to process a YouTube channel.

    Args:
        request (ChannelHandleRequest): Channel handle to process

    Returns:
        dict: Processing result message

    Raises:
        HTTPException: For various processing errors
    """
    try:
        message = process_youtube_channel(request.channel_handle)
        return {"message": message}
    except ValueError as ve:
        # Handle specific value errors (e.g., no videos found)
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        # Catch-all for unexpected errors
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
