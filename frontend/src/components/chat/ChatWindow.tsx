import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage.tsx";
import type { ChatMessage as MessageType } from "../../types/chat";

interface Props {
  messages: MessageType[];
}

const ChatWindow = ({ messages }: Props) => {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 xl:px-6">
      {messages.length === 0 ? (
        <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-white shadow-[0_25px_80px_rgba(2,6,23,0.32)]">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300/80">Start here</p>
          <h2 className="mt-4 text-3xl font-semibold">Ask your documents something meaningful.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Try asking for a summary, a policy detail, a comparison, or a direct answer from your indexed knowledge base. Your recent chats will be saved in the sidebar on this device.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Summarize the key points from the internal manual.",
              "What is the most powerful Atlas compute cluster?",
              "Compare onboarding guidance across our support docs.",
              "List the most important operational constraints I should know."
            ].map((prompt) => (
              <div key={prompt} className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 text-sm leading-6 text-slate-300">
                {prompt}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
};

export default ChatWindow;
