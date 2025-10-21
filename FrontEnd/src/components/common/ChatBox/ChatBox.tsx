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

  // Fetch chat history
  const { data } = useGetRecommendations(user?.id || "");
  data?.data?.Recommendations?.length && console.log(data.data.Recommendations);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { mutate: chatMutation, isPending: isPendingChat } = useChatting();
  // Gửi tin nhắn và nhận phản hồi
  const handleSend = (message: string) => {
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
        } else {
          console.error("Response from AI:", response);
        }
      },
      onError: (error: any) => {
        console.error("Lỗi khi gửi tin nhắn:", error);
      },
    });
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
            <div
              id="chatbox-header"
              className="flex justify-between items-center"
            >
              {/* <h2>Trợ lý AI</h2> */}
              <div className="chatbox-header-info">
                <div className="chatbox-header-icon">
                  <MessageCircle size={18} />
                </div>
                <div className="chatbox-header-text">
                  <h3 className="font-semibold text-sm">Trợ lý AI</h3>
                  <p className="text-xs opacity-90">Hỗ trợ 24/7</p>
                </div>
              </div>
              <div className="chatbox-header-actions">
                <motion.button
                  onClick={() => setIsExpand(!isExpand)}
                  aria-label="Expand chat"
                  whileTap={{ scale: 0.9 }}
                >
                  {isExpand ? <Minimize size={18} /> : <Expand size={18} />}
                </motion.button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsExpand(false);
                  }}
                  className=""
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <ChatMessage
              messages={messages}
              isPendingChat={isPendingChat}
              send={handleSend}
            />

            {/* Input */}
            <ChatInput onSendMessage={handleSend} isLoading={isPendingChat} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      {!isExpand && (
        <motion.button
          id="chatbox-toggle"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className="absolute bottom-0 right-0 w-[60px] h-[60px] 
          rounded-full text-white border-0 cursor-pointer 
          flex items-center justify-center p-0 outline-none pointer-events-auto 
          bg-gradient-to-tr from-[var(--primary-color)] to-[var(--secondary-color)] 
          shadow-[0_6px_24px_rgba(59,130,246,0.18)] 
          transition-all animate-float"
        >
          {!isOpen ? <MessageCircle size={28} /> : <X size={28} />}
        </motion.button>
      )}
    </div>
  );
};

export default ChatBoxContent;
