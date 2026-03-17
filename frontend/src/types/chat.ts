export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export interface ChatResponse {
  answer: string;
  sources: string[];
  latency: number;
}