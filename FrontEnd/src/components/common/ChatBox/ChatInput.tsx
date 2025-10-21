import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText.trim());
    setInputText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      id="chatbox-input-row"
      className="flex border-t border-gray-200 bg-white"
    >
      <input
        id="chatbox-input"
        type="text"
        placeholder="Nhập câu hỏi..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="flex-1 p-3 text-base outline-none bg-transparent text-[var(--text-dark)] placeholder-[var(--text-light)]"
      />
      <button
        type="submit"
        id="chatbox-send"
        disabled={isLoading}
        className="bg-[var(--primary-color)] text-white px-5 
        flex items-center justify-center transition-colors 
        hover:bg-[var(--secondary-color)] disabled:opacity-70
        focus:ring-2"
      >
        <Send size={18} />
      </button>
    </form>
  );
};

export default ChatInput;
