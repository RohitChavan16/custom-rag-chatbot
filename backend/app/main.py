from fastapi import FastAPI
from app.api.chat import router

app = FastAPI()

@app.get("/")
def home():
    return {"message": "RAG chatbot backend running"}

app.include_router(router)