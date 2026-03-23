export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export interface ChatResponse {
  answer: string;
  sources: string[];
  latency: number;
}

export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  messages: ChatMessage[];
}
