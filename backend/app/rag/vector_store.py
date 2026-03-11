from langchain_community.vectorstores import Chroma
from .embeddings import get_embedding_model

def get_vector_store():
    embedding = get_embedding_model()

    vector_db = Chroma(
        persist_directory="backend/data/chroma_db",
        embedding_function=embedding
    )

    return vector_db