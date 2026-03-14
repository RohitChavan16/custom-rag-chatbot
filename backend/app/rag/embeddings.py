import logging
from langchain_huggingface import HuggingFaceEmbeddings

logger = logging.getLogger(__name__)

_embedding_model = None


def get_embedding_model():
    global _embedding_model

    if _embedding_model is None:
        logger.info("Loading embedding model (all-MiniLM-L6-v2)")
        _embedding_model = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2"
        )

    return _embedding_model