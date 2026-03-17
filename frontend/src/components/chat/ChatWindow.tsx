import ChatMessage from "./ChatMessage.tsx";
import type { ChatMessage as MessageType } from "../../types/chat";

interface Props {
  messages: MessageType[];
}

const ChatWindow = ({ messages }: Props) => {

  return (
    <div className="flex-1 overflow-y-auto p-6">

      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} />
      ))}

    </div>
  );
};

export default ChatWindow;