from pymongo import MongoClient
from typing import List, Optional, Any
from llama_index.core.llms import ChatMessage
from llama_index.core.storage.chat_store.base import BaseChatStore
from llama_index.storage.chat_store.azure import AzureChatStore


class MongoChatStore(BaseChatStore):
    """MongoDB-based chat store."""
    client: Any
    db_name: Any
    db: Any
    collection: Any

    def __init__(self, uri: str, db_name: str):
        """Initialize MongoDB connection."""
        super().__init__(uri=uri, db_name=db_name)
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.collection = self.db["chat_store"]

    @classmethod
    def class_name(cls) -> str:
        """Get class name."""
        return "MongoChatStore"

    def set_messages(self, key: str, messages: List[ChatMessage]) -> None:
        """Set messages for a key in MongoDB."""
        self.collection.update_one(
            {"key": key},
            {"$set": {"messages": [msg.dict() if isinstance(msg, ChatMessage) else msg for msg in messages]}},
            upsert=True
        )

    def get_messages(self, key: str) -> List[ChatMessage]:
        """Get messages for a key from MongoDB."""
        result = self.collection.find_one({"key": key})
        return [ChatMessage(**msg) for msg in result["messages"]] if result else []

    def delete_messages(self, key: str) -> Optional[List[ChatMessage]]:
        """Delete messages for a key from MongoDB."""
        result = self.collection.find_one_and_delete({"key": key})
        return [ChatMessage(**msg) for msg in result["messages"]] if result else None

    def delete_message(self, key: str, idx: int) -> Optional[ChatMessage]:
        """Delete specific message for a key from MongoDB."""
        messages = self.get_messages(key)
        if idx < len(messages):
            message = messages[idx]
            self.collection.update_one(
                {"key": key},
                {"$set": {"messages": [msg.dict() if isinstance(msg, ChatMessage) else msg for i, msg in enumerate(messages) if i != idx]}}
            )
            return message
        return None

    def delete_last_message(self, key: str) -> Optional[ChatMessage]:
        """Delete last message for a key from MongoDB."""
        messages = self.get_messages(key)
        if messages:
            return self.delete_message(key, len(messages) - 1)
        return None

    def get_keys(self) -> List[str]:
        """Get all keys from MongoDB."""
        return [doc["key"] for doc in self.collection.find({}, {"key": 1})]

    def add_message(self, key: str, message: ChatMessage) -> None:
        """Add a single message for a key in MongoDB."""
        messages = self.get_messages(key)
        messages.append(message)
        self.set_messages(key, messages)
