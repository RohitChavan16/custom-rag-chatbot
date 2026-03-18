import axios from "axios";
import type { ChatResponse } from "../types/chat";

const API_URL = "http://127.0.0.1:8000/api/chat";

export type AskQuestionResult = {
  data: ChatResponse;
  durationMs: number;
};

export const askQuestion = async (question: string): Promise<AskQuestionResult> => {
  const start = Date.now();

  const response = await axios.post<ChatResponse>(API_URL, {
    question,
  });

  return {
    data: response.data,
    durationMs: Date.now() - start
  };
};
