import ollama
import logging
import time
from typing import Dict, List

from .vector_store import get_vector_store

logger = logging.getLogger(__name__)

# Load vector DB once (not per request)
vector_db = get_vector_store()


def ask_question(query: str) -> Dict:
    """
    RAG pipeline for answering questions using retrieved context.
    """

    start_time = time.time()

    try:
        logger.info(f"Starting RAG pipeline for query: {query}")

        # Step 1: Retrieve relevant documents
        docs = vector_db.similarity_search(query, k=3)

        if not docs:
            logger.warning("No documents retrieved from vector DB")

        context = "\n\n".join([doc.page_content for doc in docs])

        sources = [
            doc.metadata.get("source", "unknown")
            for doc in docs
        ]

        logger.info(f"Retrieved {len(docs)} documents")

        # Step 2: Build prompt
        prompt = f"""
You are an AI assistant.

Use ONLY the provided context to answer the question.
If the answer is not in the context, say "I don't know".

Context:
{context}

Question:
{query}

Answer:
"""

        # Step 3: Call LLM
        logger.info("Sending request to Ollama model")

        response = ollama.chat(
            model="mistral",
            messages=[
                {"role": "user", "content": prompt}
            ],
        )

        answer = response["message"]["content"]

        latency = round(time.time() - start_time, 2)

        logger.info(f"RAG pipeline completed in {latency}s")

        return {
            "answer": answer,
            "sources": sources,
            "latency": latency
        }

    except Exception as e:
        logger.error(f"RAG pipeline error: {str(e)}")

        raise RuntimeError("Failed to generate answer")