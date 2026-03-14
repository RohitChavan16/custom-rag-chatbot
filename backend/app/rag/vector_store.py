import logging
from langchain_chroma import Chroma
from .embeddings import get_embedding_model

logger = logging.getLogger(__name__)

_vector_db = None


def get_vector_store():
    global _vector_db

    if _vector_db is None:
        logger.info("Initializing Chroma vector store")

        embedding = get_embedding_model()

        _vector_db = Chroma(
            persist_directory="backend/data/chroma_db",
            embedding_function=embedding
        )

    return _vector_db