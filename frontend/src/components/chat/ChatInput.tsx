import { useState } from "react";

interface Props {
  onSend: (question: string) => void;
}

const ChatInput = ({ onSend }: Props) => {

  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) return;

    onSend(question);

    setQuestion("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-3 p-4 border-t border-gray-700"
    >
      <input
        className="flex-1 p-3 rounded bg-gray-800 outline-none"
        placeholder="Ask something..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;