import { useRef } from "react";
import { motion } from "framer-motion";
import type { ChatboxProps } from "@/types/ui/ui.type";
import { MessageCircle } from "lucide-react";
import LoadingDot from "../Loading/LoadingDot";

const ChatMessage = ({ messages, isPendingChat, send }: ChatboxProps) => {
  const endRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "Tôi muốn đặt studio",
    "Cho tôi xem thiết bị",
    "Giá thuê như thế nào?",
    "Thời gian thuê tối thiểu?",
  ];
  return (
    <div
      id="chatbox-messages"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(59, 130, 246, 0.3) transparent",
      }}
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <MessageCircle size={32} className="text-blue-500" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">Xin chào!</h4>
          <p className="text-sm text-gray-600 text-center mb-4">
            Tôi có thể giúp gì cho bạn?
          </p>
          <div className="space-y-2 w-full max-w-xs">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => send(q)}
                className="w-full text-left px-3 py-2 text-sm bg-white hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition"
              >
                💬 {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`chatbox-message custom-scrollbar ${
                msg.sender === "user" ? "user" : "bot"
              } max-w-[80%] break-words px-3 py-2 rounded-2xl`}
            >
              {msg.text}
            </motion.div>
          ))}
          {isPendingChat && <LoadingDot />}
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
};

export default ChatMessage;
