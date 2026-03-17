import logging
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from .vector_store import get_vector_store

logger = logging.getLogger(__name__)

def ingest_documents(file_path: str):

    try:
        logger.info(f"Starting ingestion for file: {file_path}")

        loader = TextLoader(file_path)
        docs = loader.load()

        logger.info(f"Loaded {len(docs)} documents")

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=100
        )

        chunks = splitter.split_documents(docs)

        logger.info(f"Split into {len(chunks)} chunks")

        vector_db = get_vector_store()

        vector_db.add_documents(chunks)

        logger.info("Documents successfully stored in vector DB")

    except Exception as e:
        logger.exception("Document ingestion failed")
        raise