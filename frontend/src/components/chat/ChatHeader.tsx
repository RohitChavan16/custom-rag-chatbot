interface Props {
  activeTitle: string;
  loading: boolean;
  responseTime: number;
  onToggleSidebar: () => void;
}

const formatLatency = (durationMs: number) => `${(durationMs / 1000).toFixed(1)}s`;

const ChatHeader = ({ activeTitle, loading, responseTime, onToggleSidebar }: Props) => {
  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur xl:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/10 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <span className="flex flex-col gap-1">
            <span className="h-0.5 w-4 rounded-full bg-current" />
            <span className="h-0.5 w-4 rounded-full bg-current" />
            <span className="h-0.5 w-4 rounded-full bg-current" />
          </span>
        </button>

        <div className="min-w-0">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-cyan-300/80">
            Atlas AI Workspace
          </p>
          <h1 className="truncate text-lg font-semibold text-white">{activeTitle}</h1>
        </div>
      </div>

      <div className="hidden items-center gap-3 sm:flex">
        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
          GPT-style UX
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          {loading ? `Thinking ${formatLatency(responseTime)}` : "Ready"}
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
