import type { ChatMessage as MessageType } from "../../types/chat";

interface Props {
  message: MessageType;
}

const ChatMessage = ({ message }: Props) => {

  const isUser = message.role === "user";

  return (
    <div className={`mb-6 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-3xl rounded-[1.6rem] px-4 py-4 text-sm leading-7 shadow-lg shadow-slate-950/20 ${
          isUser
            ? "bg-cyan-400 text-slate-950"
            : "border border-white/10 bg-white/[0.06] text-slate-100 backdrop-blur"
        }`}
      >
        <div className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-current/70">
          {isUser ? "You" : "Atlas AI"}
        </div>
        <div className="whitespace-pre-wrap break-words">{message.text}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
