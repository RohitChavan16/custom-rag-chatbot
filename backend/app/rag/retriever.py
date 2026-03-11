from langchain.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from .vector_store import get_vector_store

def ingest_documents(file_path):

    loader = TextLoader(file_path)
    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )

    chunks = splitter.split_documents(docs)

    vector_db = get_vector_store()
    vector_db.add_documents(chunks)