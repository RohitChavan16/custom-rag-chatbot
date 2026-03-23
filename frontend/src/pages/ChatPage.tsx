import { useEffect, useMemo, useState } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";
import TypingIndicator from "../components/chat/TypingIndicator";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatHeader from "../components/chat/ChatHeader";
import { useChat } from "../hooks/useChat.ts";
import type { ChatSession } from "../types/chat";
import type { AuthenticatedUser } from "../types/auth";

interface Props {
  user: AuthenticatedUser;
  onLogout: () => void;
}

const SESSION_STORAGE_KEY = "atlas-chat-sessions";

const createSessionTitle = (messages: ChatSession["messages"]) => {
  const firstUserMessage = messages.find((message) => message.role === "user")?.text ?? "New chat";
  return firstUserMessage.slice(0, 42) || "New chat";
};

const createSessionPreview = (messages: ChatSession["messages"]) => {
  const latestMessage = [...messages].reverse().find((message) => message.text.trim());
  return latestMessage?.text.slice(0, 90) ?? "No messages yet";
};

const sortSessions = (items: ChatSession[]) =>
  [...items].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

const loadStoredSessions = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedSessions = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (!storedSessions) {
      return [];
    }

    return sortSessions(JSON.parse(storedSessions) as ChatSession[]);
  } catch {
    return [];
  }
};

const ChatPage = ({ user, onLogout }: Props) => {
  const {
    messages,
    sendMessage,
    loading,
    responseTime,
    replaceMessages,
    clearMessages
  } = useChat();
  const [sessions, setSessions] = useState<ChatSession[]>(loadStoredSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeSessionTitle = useMemo(() => {
    if (!messages.length) {
      return "New conversation";
    }

    return createSessionTitle(messages);
  }, [messages]);

  useEffect(() => {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (!messages.length) {
      return;
    }

    const nextSessionId = activeSessionId ?? window.crypto.randomUUID();
    const nextSession: ChatSession = {
      id: nextSessionId,
      title: createSessionTitle(messages),
      preview: createSessionPreview(messages),
      updatedAt: new Date().toISOString(),
      messages
    };

    setActiveSessionId(nextSessionId);
    setSessions((prev) => sortSessions([nextSession, ...prev.filter((session) => session.id !== nextSessionId)]));
  }, [activeSessionId, messages]);

  const handleNewChat = () => {
    if (loading) {
      return;
    }

    setActiveSessionId(null);
    clearMessages();
    setIsSidebarOpen(false);
  };

  const handleSelectSession = (sessionId: string) => {
    if (loading) {
      return;
    }

    const selectedSession = sessions.find((session) => session.id === sessionId);

    if (!selectedSession) {
      return;
    }

    setActiveSessionId(sessionId);
    replaceMessages(selectedSession.messages);
    setIsSidebarOpen(false);
  };

  return (
    <div className="chat-app-shell flex min-h-screen bg-slate-950 text-white">
      <ChatSidebar
        activeSessionId={activeSessionId}
        isOpen={isSidebarOpen}
        sessions={sessions}
        user={user}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={onLogout}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <ChatHeader
          activeTitle={activeSessionTitle}
          loading={loading}
          responseTime={responseTime}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        <ChatWindow messages={messages} />

        {loading && <TypingIndicator />}

        <ChatInput onSend={sendMessage} loading={loading} />
      </div>
    </div>
  );
};

export default ChatPage;
