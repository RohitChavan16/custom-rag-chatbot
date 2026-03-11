import ollama
from .vector_store import get_vector_store

def ask_question(query):

    vector_db = get_vector_store()

    docs = vector_db.similarity_search(query, k=3)

    context = "\n".join([doc.page_content for doc in docs])

    prompt = f"""
    Answer using the context below.

    Context:
    {context}

    Question:
    {query}
    """

    response = ollama.chat(
        model="mistral",
        messages=[{"role": "user", "content": prompt}]
    )

    return response["message"]["content"]