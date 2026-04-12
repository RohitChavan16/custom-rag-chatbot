import type { ChatSession } from "../../types/chat";
import type { AuthenticatedUser } from "../../types/auth";

interface Props {
  activeSessionId: string | null;
  isOpen: boolean;
  sessions: ChatSession[];
  user: AuthenticatedUser;
  onClose: () => void;
  onLogout: () => void;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
}

const formatRelativeDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recent";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
};

const ChatSidebar = ({
  activeSessionId,
  isOpen,
  sessions,
  user,
  onClose,
  onLogout,
  onNewChat,
  onSelectSession
}: Props) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 cursor-pointer bg-slate-950/60 backdrop-blur-sm transition lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`chat-sidebar fixed inset-y-0 left-0 z-40 flex w-[19rem] flex-col border-r border-white/10 bg-slate-950/95 px-4 py-4 backdrop-blur-xl transition-transform duration-300 lg:static lg:z-0 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-cyan-300/70">
              Custom RAG
            </p>
            <h2 className="text-xl font-semibold text-white">Conversations</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            x
          </button>
        </div>

        <button
          type="button"
          onClick={onNewChat}
          className="mb-5 cursor-pointer rounded-2xl border border-cyan-400/30 bg-cyan-400/12 px-4 py-3 text-left text-sm font-medium text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-400/20"
        >
          New chat
        </button>

        <div className="flex-1 overflow-y-auto pr-1">
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
            Recent sessions
          </div>

          <div className="space-y-2">
            {sessions.length > 0 ? (
              sessions.map((session) => {
                const isActive = session.id === activeSessionId;

                return (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => onSelectSession(session.id)}
                    className={`w-full cursor-pointer rounded-2xl border px-3 py-3 text-left transition ${
                      isActive
                        ? "border-cyan-400/50 bg-cyan-400/12 shadow-[0_0_0_1px_rgba(34,211,238,0.08)]"
                        : "border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="truncate text-sm font-medium text-white">{session.title}</div>
                    <div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{session.preview}</div>
                    <div className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-slate-500">
                      {formatRelativeDate(session.updatedAt)}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-5 text-sm leading-6 text-slate-400">
                Your past chats will appear here once you start asking questions.
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <div className="text-sm font-medium text-white">{user.name}</div>
          <div className="mt-1 text-xs text-slate-400">{user.email}</div>
          <div className="mt-3 flex items-center justify-between">
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-slate-300">
              {user.provider}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="cursor-pointer text-sm font-medium text-rose-200 transition hover:text-rose-100"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
