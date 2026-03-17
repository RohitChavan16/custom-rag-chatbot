import type { ChatMessage as MessageType } from "../../types/chat";

interface Props {
  message: MessageType;
}

const ChatMessage = ({ message }: Props) => {

  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xl px-4 py-3 rounded-lg ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-gray-700 text-gray-100"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage;