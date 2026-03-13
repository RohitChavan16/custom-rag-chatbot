from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.chat import router

app = FastAPI(
    title="Custom RAG Chatbot",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check():
    return {"status": "running"}

app.include_router(router, prefix="/api")