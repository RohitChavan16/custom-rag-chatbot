from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import logging
from typing import List
from app.rag.pipeline import ask_question

router = APIRouter()
logger = logging.getLogger(__name__)


class Query(BaseModel):
    question: str = Field(..., min_length=3, max_length=1000)


class ChatResponse(BaseModel):
    answer: str
    sources: List[str]
    latency: float


@router.post("/chat", response_model=ChatResponse)
async def chat(query: Query):

    try:
        logger.info(f"Received question: {query.question}")

        result = ask_question(query.question)

        logger.info("Response generated successfully")

        return result

    except Exception as e:
        logger.exception("RAG pipeline failed")

        raise HTTPException(
            status_code=500,
            detail="RAG pipeline failed"
        )