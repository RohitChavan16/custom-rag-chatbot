import { useRef, useState } from "react";
import axios from "axios";
import type { ChatMessage } from "../types/chat";
import { askQuestion } from "../services/chatApi";

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState(0);
  const [finalResponseTime, setFinalResponseTime] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);

  const stopTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const sendMessage = async (question: string) => {
    const userMessage: ChatMessage = {
      role: "user",
      text: question
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setResponseTime(0);
    setFinalResponseTime(null);

    const start = Date.now();

    timerRef.current = window.setInterval(() => {
      setResponseTime(Date.now() - start);
    }, 100);

    try {
      const res = await askQuestion(question);

      stopTimer();
      setResponseTime(res.durationMs);
      setFinalResponseTime(res.durationMs);

      const botMessage: ChatMessage = {
        role: "assistant",
        text: res.data.answer
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      stopTimer();

      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.detail ?? error.message
        : "Something went wrong.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: errorMessage
        }
      ]);
    } finally {
      stopTimer();
      setLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    loading,
    responseTime,
    finalResponseTime
  };
};
