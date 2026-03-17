import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";
import TypingIndicator from "../components/chat/TypingIndicator";
import { useChat } from "../hooks/useChat.ts";

const ChatPage = () => {

  const { messages, sendMessage, loading } = useChat();

  return (
    <div className="flex flex-col h-screen">

      <header className="text-center py-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">
          Custom RAG Chatbot
        </h1>
      </header>

      <ChatWindow messages={messages} />

      {loading && <TypingIndicator />}

      <ChatInput onSend={sendMessage} />

    </div>
  );
};

export default ChatPage;