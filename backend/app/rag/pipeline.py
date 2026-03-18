import logging
import os
import time
from typing import Dict, List

import ollama

from .vector_store import get_vector_store

logger = logging.getLogger(__name__)

# Load vector DB once (not per request)
vector_db = get_vector_store()
DEFAULT_MODEL = os.getenv("OLLAMA_MODEL", "mistral")
ENABLE_CPU_FALLBACK = os.getenv("OLLAMA_CPU_FALLBACK", "true").lower() == "true"


class GenerationError(RuntimeError):
    pass


def _generate_with_ollama(prompt: str) -> str:
    try:
        response = ollama.chat(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "user", "content": prompt}
            ],
        )
        return response["message"]["content"]
    except Exception as exc:
        error_text = str(exc)

        if ENABLE_CPU_FALLBACK and "CUDA error" in error_text:
            logger.warning(
                "Ollama GPU inference failed; retrying on CPU fallback for model '%s'",
                DEFAULT_MODEL
            )
            response = ollama.chat(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                options={"num_gpu": 0},
            )
            return response["message"]["content"]

        if "CUDA error" in error_text:
            raise GenerationError(
                "The local Ollama model crashed on GPU inference. "
                "Try restarting Ollama, switching to CPU mode, or using a smaller model."
            ) from exc

        raise GenerationError(f"Ollama request failed: {error_text}") from exc


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

        answer = _generate_with_ollama(prompt)

        latency = round(time.time() - start_time, 2)

        logger.info(f"RAG pipeline completed in {latency}s")

        return {
            "answer": answer,
            "sources": sources,
            "latency": latency
        }

    except GenerationError:
        raise
    except Exception as e:
        logger.error(f"RAG pipeline error: {str(e)}")

        raise GenerationError("Failed to generate answer") from e
