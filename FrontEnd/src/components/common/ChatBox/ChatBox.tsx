// src/components/ChatBox.tsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageCircle } from "lucide-react";
import { useChatting, useGetRecommendations } from "@/hooks/ai/useAIMutaion";
import { useAuth } from "@/hooks/auth/useAuth";

const ChatBox = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [inputFinal, setInputFinal] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoadingChatting, setIsLoadingChatting] = useState(false);

  // Fetch lịch sử chat
  const { data: recommendationsData, isLoading: isLoadingRecommendations } =
    useGetRecommendations(user?.id || ""); // still errorz
  const messages = recommendationsData?.data?.data?.message || [];

  // Auto scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { data: dataChatting, isLoading } = useChatting(inputFinal);

  const handleSend = () => {
    if (!inputText.trim()) return;

    setInputFinal(inputText);

    setIsLoadingChatting(isLoading);
    console.log("res chat:", dataChatting);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div id="chatbox-root">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbox-container"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div id="chatbox-header" className="">
              <span>Trợ lý AI LENSCAMDIO</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-1 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              id="chatbox-messages"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(59, 130, 246, 0.3) transparent",
              }}
            >
              {isLoadingRecommendations ? (
                <div className="text-center text-[var(--text-light)]">
                  Đang tải...
                </div>
              ) : Array.isArray(messages) && messages.length === 0 ? (
                <div className="text-center text-[var(--text-light)] italic">
                  Bắt đầu cuộc trò chuyện!
                </div>
              ) : (
                <div className="space-y-3">
                  {Array.isArray(messages) &&
                    messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`chatbox-message custom-scrollbar  ${
                          msg.sender === "user" ? "user" : "bot"
                        } max-w-[80%] break-words px-3 py-2 rounded-2xl ${
                          msg.sender === "user" ? "user" : "bot"
                        }`}
                      >
                        {msg.text}
                      </motion.div>
                    ))}
                  {recommendationsData?.error && <div>No</div>}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Row */}
            <div
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
                id="chatbox-send"
                onClick={handleSend}
                disabled={isLoadingChatting}
                className="bg-[var(--primary-color)] text-white px-5 
                flex items-center justify-center transition-colors 
                hover:bg-[var(--secondary-color)] disabled:opacity-70
                focus:ring-2 "
              >
                {/* {false ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : ( */}
                <Send size={18} />
                {/* )} */}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        id="chatbox-toggle"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-0 right-0 w-[60px] h-[60px] rounded-full text-white border-0 cursor-pointer flex items-center justify-center p-0 outline-none pointer-events-auto bg-gradient-to-tr from-[var(--primary-color)] to-[var(--secondary-color)] shadow-[0_6px_24px_rgba(59,130,246,0.18)] transition-all animate-float"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
};

export default ChatBox;
