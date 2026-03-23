import { motion } from "framer-motion";
import { useMemo, useState } from "react";

interface Props {
  onSend: (question: string) => void;
  loading: boolean;
}

const MAX_MESSAGE_LENGTH = 2000;

const ChatInput = ({ onSend, loading }: Props) => {
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");

  const trimmedQuestion = question.trim();
  const isOverLimit = question.length > MAX_MESSAGE_LENGTH;
  const isDisabled = loading || !trimmedQuestion || isOverLimit;

  const helperText = useMemo(() => {
    if (error) {
      return error;
    }

    if (isOverLimit) {
      return `Message is too long. Keep it under ${MAX_MESSAGE_LENGTH} characters.`;
    }

    if (!trimmedQuestion) {
      return "Enter a clear question to start the conversation.";
    }

    return "Press Enter to send. Use Shift+Enter for a new line.";
  }, [error, isOverLimit, trimmedQuestion]);

  const submit = () => {
    const normalizedQuestion = question.replace(/\r\n/g, "\n").trim();

    if (loading) {
      setError("Please wait for the current response to finish.");
      return;
    }

    if (!normalizedQuestion) {
      setError("Message cannot be empty.");
      return;
    }

    if (normalizedQuestion.length > MAX_MESSAGE_LENGTH) {
      setError(`Message is too long. Keep it under ${MAX_MESSAGE_LENGTH} characters.`);
      return;
    }

    onSend(normalizedQuestion);
    setQuestion("");
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-white/10 bg-slate-950/90 px-4 pb-5 pt-4 backdrop-blur xl:px-6">
      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-3 shadow-[0_20px_60px_rgba(2,6,23,0.4)]">
        <textarea
          rows={1}
          className="max-h-48 min-h-[72px] w-full resize-none bg-transparent px-2 py-2 text-sm leading-7 text-white outline-none placeholder:text-slate-500"
          placeholder="Message Atlas AI..."
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            if (error) {
              setError("");
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />

        <div className="mt-3 flex flex-col gap-3 border-t border-white/8 px-2 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className={`text-xs ${error || isOverLimit ? "text-rose-300" : "text-slate-400"}`}>
            {helperText}
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className={`text-xs ${isOverLimit ? "text-rose-300" : "text-slate-500"}`}>
              {question.length}/{MAX_MESSAGE_LENGTH}
            </span>

            <motion.button
              type="submit"
              disabled={isDisabled}
              aria-disabled={isDisabled}
              aria-busy={loading}
              className={`relative overflow-hidden rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                loading
                  ? "cursor-not-allowed bg-slate-600/90 text-white shadow-[0_0_0_1px_rgba(148,163,184,0.2)]"
                  : isDisabled
                    ? "cursor-not-allowed bg-slate-800 text-slate-500"
                    : "bg-cyan-400 text-slate-950 hover:bg-cyan-300 hover:shadow-[0_12px_32px_rgba(34,211,238,0.28)]"
              }`}
              whileTap={isDisabled ? undefined : { scale: 0.98 }}
            >
              {loading && (
                <motion.span
                  aria-hidden="true"
                  className="chat-send-button-shimmer pointer-events-none absolute inset-0"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                />
              )}

              <span className="relative flex min-w-[106px] items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="chat-send-spinner" aria-hidden="true" />
                    Thinking
                  </>
                ) : (
                  "Send message"
                )}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
