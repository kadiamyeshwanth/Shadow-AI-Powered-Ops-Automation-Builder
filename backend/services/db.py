from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, List
from models.workflow import WorkflowDocument
from config import get_settings
import logging

logger = logging.getLogger(__name__)

_client: Optional[AsyncIOMotorClient] = None


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        settings = get_settings()
        _client = AsyncIOMotorClient(settings.mongodb_uri)
    return _client


def get_collection():
    settings = get_settings()
    return get_client()[settings.db_name]["workflows"]


async def save_workflow(doc: WorkflowDocument) -> str:
    col = get_collection()
    payload = doc.model_dump(mode="json")
    await col.insert_one(payload)
    logger.info(f"Saved workflow {doc.id}")
    return doc.id


async def list_workflows(limit: int = 20) -> List[dict]:
    col = get_collection()
    cursor = col.find({}, {"_id": 0}).sort("created_at", -1).limit(limit)
    return await cursor.to_list(length=limit)


async def get_workflow(workflow_id: str) -> Optional[dict]:
    col = get_collection()
    doc = await col.find_one({"id": workflow_id}, {"_id": 0})
    return doc


async def delete_workflow(workflow_id: str) -> bool:
    col = get_collection()
    result = await col.delete_one({"id": workflow_id})
    return result.deleted_count == 1


async def close_client():
    global _client
    if _client:
        _client.close()
        _client = None
