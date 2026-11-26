import os
import json
import asyncio
import socket
import logging
from typing import Dict, Any, List, Optional
from urllib.parse import urlparse
from datetime import datetime

try:
    import motor.motor_asyncio
    from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
    HAS_MOTOR = True
except ImportError:
    HAS_MOTOR = False
    motor = None
    class ConnectionFailure(Exception): pass
    class ServerSelectionTimeoutError(Exception): pass

from app.config import settings

logger = logging.getLogger("learningpath.database")

class LocalCollection:
    """Async MongoDB-like collection interface backed by a persistent JSON file."""
    def __init__(self, db_store: 'LocalDocumentDB', collection_name: str):
        self.db_store = db_store
        self.name = collection_name

    def _matches_query(self, doc: Dict[str, Any], query: Dict[str, Any]) -> bool:
        if not query:
            return True
        for k, v in query.items():
            if k == "$or" and isinstance(v, list):
                if not any(self._matches_query(doc, cond) for cond in v):
                    return False
                continue
            if isinstance(v, dict):
                # handle operators like $in, $gt, $ne
                doc_val = doc.get(k)
                for op, op_val in v.items():
                    if op == "$in" and doc_val not in op_val:
                        return False
                    elif op == "$ne" and doc_val == op_val:
                        return False
                    elif op == "$gt" and (doc_val is None or doc_val <= op_val):
                        return False
                    elif op == "$gte" and (doc_val is None or doc_val < op_val):
                        return False
            else:
                if doc.get(k) != v:
                    return False
        return True

    async def find_one(self, query: Dict[str, Any], projection: Optional[Dict[str, int]] = None) -> Optional[Dict[str, Any]]:
        docs = self.db_store.data.get(self.name, [])
        for doc in docs:
            if self._matches_query(doc, query):
                res = dict(doc)
                if projection and projection.get("_id") == 0:
                    res.pop("_id", None)
                return res
        return None

    async def find(self, query: Dict[str, Any] = None, sort: Optional[List] = None, limit: Optional[int] = None) -> 'LocalCursor':
        query = query or {}
        docs = self.db_store.data.get(self.name, [])
        matched = [dict(d) for d in docs if self._matches_query(d, query)]
        if sort:
            for field, order in reversed(sort):
                matched.sort(key=lambda x: x.get(field, ""), reverse=(order == -1))
        if limit:
            matched = matched[:limit]
        return LocalCursor(matched)

    async def insert_one(self, document: Dict[str, Any]):
        doc_copy = dict(document)
        if "_id" not in doc_copy:
            import uuid
            doc_copy["_id"] = str(uuid.uuid4())
        if "id" not in doc_copy:
            doc_copy["id"] = doc_copy["_id"]
        if self.name not in self.db_store.data:
            self.db_store.data[self.name] = []
        self.db_store.data[self.name].append(doc_copy)
        self.db_store.save()
        class InsertResult:
            inserted_id = doc_copy["_id"]
        return InsertResult()

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any], upsert: bool = False):
        docs = self.db_store.data.get(self.name, [])
        matched_idx = -1
        for idx, doc in enumerate(docs):
            if self._matches_query(doc, query):
                matched_idx = idx
                break
        
        if matched_idx >= 0:
            doc = docs[matched_idx]
            if "$set" in update:
                for k, v in update["$set"].items():
                    doc[k] = v
            if "$push" in update:
                for k, v in update["$push"].items():
                    if k not in doc or not isinstance(doc[k], list):
                        doc[k] = []
                    doc[k].append(v)
            docs[matched_idx] = doc
            self.db_store.save()
            return True
        elif upsert:
            new_doc = {}
            if "$set" in update:
                new_doc.update(update["$set"])
            for k, v in query.items():
                if not k.startswith("$"):
                    new_doc[k] = v
            await self.insert_one(new_doc)
            return True
        return False

    async def delete_one(self, query: Dict[str, Any]):
        docs = self.db_store.data.get(self.name, [])
        for idx, doc in enumerate(docs):
            if self._matches_query(doc, query):
                del docs[idx]
                self.db_store.save()
                return True
        return False

    async def count_documents(self, query: Dict[str, Any] = None) -> int:
        query = query or {}
        docs = self.db_store.data.get(self.name, [])
        return sum(1 for doc in docs if self._matches_query(doc, query))


class LocalCursor:
    def __init__(self, items: List[Dict[str, Any]]):
        self.items = items

    async def to_list(self, length: Optional[int] = None) -> List[Dict[str, Any]]:
        if length is not None:
            return self.items[:length]
        return self.items

    def __aiter__(self):
        self._iter = iter(self.items)
        return self

    async def __anext__(self):
        try:
            return next(self._iter)
        except StopIteration:
            raise StopAsyncIteration


class LocalDocumentDB:
    """Persistent JSON Document DB to ensure zero dependencies & flawless execution."""
    def __init__(self, file_path: str = "backend/data/local_db.json"):
        self.file_path = file_path
        self.data: Dict[str, List[Dict[str, Any]]] = {}
        self._load()

    def _load(self):
        os.makedirs(os.path.dirname(self.file_path) or ".", exist_ok=True)
        if os.path.exists(self.file_path):
            try:
                with open(self.file_path, "r", encoding="utf-8") as f:
                    self.data = json.load(f)
            except Exception as e:
                logger.error(f"Error loading local db file: {e}")
                self.data = {}
        else:
            self.data = {}

    def save(self):
        try:
            os.makedirs(os.path.dirname(self.file_path) or ".", exist_ok=True)
            with open(self.file_path, "w", encoding="utf-8") as f:
                json.dump(self.data, f, indent=2, default=str)
        except Exception as e:
            logger.error(f"Error saving local db file: {e}")

    def __getitem__(self, collection_name: str) -> LocalCollection:
        return LocalCollection(self, collection_name)

    def get_collection(self, collection_name: str) -> LocalCollection:
        return LocalCollection(self, collection_name)


class DatabaseManager:
    client: Any = None
    db = None
    is_fallback: bool = False

    @classmethod
    async def connect(cls):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))
        os.makedirs(base_dir, exist_ok=True)
        db_path = os.path.join(base_dir, "learningpath_store.json")

        if getattr(settings, "MONGODB_ENABLED", "auto") == "false" or not HAS_MOTOR:
            logger.info("MongoDB disabled or motor package not installed. Using persistent DocumentDB store.")
            cls.db = LocalDocumentDB(db_path)
            cls.is_fallback = True
            return

        has_mongo = False
        try:
            parsed = urlparse(settings.MONGODB_URI)
            host = parsed.hostname or "127.0.0.1"
            port = parsed.port or 27017
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(0.1)
            s.connect((host, port))
            s.close()
            has_mongo = True
        except (PermissionError, OSError, Exception) as socket_err:
            has_mongo = False

        if has_mongo:
            try:
                logger.info(f"Connecting to live MongoDB server at {settings.MONGODB_URI}...")
                client = motor.motor_asyncio.AsyncIOMotorClient(
                    settings.MONGODB_URI,
                    serverSelectionTimeoutMS=500,
                    connectTimeoutMS=500
                )
                await client.admin.command('ping')
                cls.client = client
                cls.db = client[settings.MONGODB_DB_NAME]
                cls.is_fallback = False
                logger.info("Successfully connected to live MongoDB server!")
                return
            except Exception as ex:
                logger.warning(f"MongoDB ping failed: {ex}. Falling back to DocumentDB.")

        # Default persistent document store
        cls.db = LocalDocumentDB(db_path)
        cls.is_fallback = True
        logger.info(f"Persistent DocumentDB active at {db_path}")

    @classmethod
    async def close(cls):
        if cls.client:
            cls.client.close()
            logger.info("Database connection closed.")

    @classmethod
    def get_collection(cls, name: str):
        if cls.db is None:
            # Synchronous lazy init if called before startup
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))
            os.makedirs(base_dir, exist_ok=True)
            db_path = os.path.join(base_dir, "learningpath_store.json")
            cls.db = LocalDocumentDB(db_path)
            cls.is_fallback = True
        return cls.db[name]

db_manager = DatabaseManager
