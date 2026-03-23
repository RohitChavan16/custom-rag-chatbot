import { useEffect, useState } from "react";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import type { AuthenticatedUser } from "./types/auth";

const AUTH_STORAGE_KEY = "atlas-auth-user";

const loadStoredUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return storedUser ? (JSON.parse(storedUser) as AuthenticatedUser) : null;
  } catch {
    return null;
  }
};

function App() {
  const [user, setUser] = useState<AuthenticatedUser | null>(loadStoredUser);

  useEffect(() => {
    if (!user) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  if (!user) {
    return <AuthPage onAuthenticate={setUser} />;
  }

  return <ChatPage user={user} onLogout={() => setUser(null)} />;
}

export default App;
