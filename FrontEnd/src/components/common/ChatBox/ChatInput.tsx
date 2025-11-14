// ChatInput.tsx
import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({
  onSendMessage,
  isLoading,
}: {
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
}) {
  const [text, setText] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        aria-label="Nhập tin nhắn"
        placeholder="Nhập tin nhắn..."
        className="flex-1 px-4 py-2 border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-blue-100"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isLoading}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
        aria-label="Gửi"
      >
        <Send size={16} />
      </button>
    </form>
  );
}
