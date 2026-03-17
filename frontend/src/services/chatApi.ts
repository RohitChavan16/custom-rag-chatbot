import axios from "axios";
import type { ChatResponse } from "../types/chat";

const API_URL = "http://localhost:8000/api/chat";

export const askQuestion = async (question: string): Promise<ChatResponse> => {
  const response = await axios.post<ChatResponse>(API_URL, {
    question,
  });

  return response.data;
};