import { useState } from "react";
import type { ChatMessage } from "../types/chat";
import { askQuestion } from "../services/chatApi";

export const useChat = () => {

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (question: string) => {

    const userMessage: ChatMessage = {
      role: "user",
      text: question
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {

      const res = await askQuestion(question);

      const botMessage: ChatMessage = {
        role: "assistant",
        text: res.answer
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong."
        }
      ]);

    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    loading
  };
};