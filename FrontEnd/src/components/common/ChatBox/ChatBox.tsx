import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Expand, MessageCircle, Minimize, X } from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useChatting, useGetRecommendations } from "@/hooks/ai/useAIMutaion";
import type { Message } from "@/types/ui/ui.type";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

const ChatBoxContent = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpand, setIsExpand] = useState(false);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch gợi ý AI
  const { data } = useGetRecommendations(user?.id || "");
  if (data?.data?.Recommendations?.length)
    console.log("AI Recommendations:", data.data.Recommendations);

  // Scroll tự động xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { mutate: chatMutation, isPending: isPendingChat } = useChatting();

  // Gửi tin nhắn đến AI
  const handleSend = (message: string) => {
    if (!message.trim()) return;
    const newMessage: Message = { sender: "user", text: message };
    setMessages((prev) => [...prev, newMessage]);

    chatMutation(message, {
      onSuccess: (response) => {
        if (response.success && response.data) {
          const botMessage: Message = {
            sender: "bot",
            text: response.data.response.trim(),
          };
          setMessages((prev) => [...prev, botMessage]);
        }
      },
      onError: (err) => console.error("AI chat error:", err),
    });
  };

  return (
    <div
      id="chatbox-root"
      className="
      fixed bottom-10 right-10 z-[9999] 
      flex flex-col items-end
      animate-[chat-float_3s_ease-in-out_infinite]
      "
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatbox"
            id="chatbox-container"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`flex flex-col bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200 pointer-events-auto
              ${
                isExpand
                  ? "fixed inset-4 sm:inset-12 w-auto h-[90vh] max-w-[100vw] max-h-[95vh] z-[10000]"
                  : "w-[360px] h-[500px]"
              }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 rounded-full p-2">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Trợ lý AI</h3>
                  <p className="text-xs opacity-90">Sẵn sàng hỗ trợ 24/7</p>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setIsExpand(!isExpand)}
                  whileTap={{ scale: 0.9 }}
                  className="hover:bg-white/20 p-1.5 rounded-md transition"
                  aria-label="Expand chat"
                >
                  {isExpand ? <Minimize size={18} /> : <Expand size={18} />}
                </motion.button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsExpand(false);
                  }}
                  className="hover:bg-white/20 p-1.5 rounded-md transition"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              className={`flex-1 overflow-y-auto px-4 py-3 bg-gray-50 ${
                isExpand ? "text-base" : "text-sm"
              }`}
            >
              <ChatMessage
                messages={messages}
                isPendingChat={isPendingChat}
                send={handleSend}
              />
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t bg-white">
              <ChatInput onSendMessage={handleSend} isLoading={isPendingChat} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      {!isExpand && (
        <motion.button
          id="chatbox-toggle"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-[60px] h-[60px] rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
        >
          {!isOpen ? <MessageCircle size={28} /> : <X size={28} />}
        </motion.button>
      )}
    </div>
  );
};

export default ChatBoxContent;
