import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Expand, Minimize } from "lucide-react";
import ChatWindow from "./ChatWindow";
import SuggestionList from "./SuggestionList";
import { useAuth } from "@/hooks/auth/useAuth";

const ChatBox = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [expand, setExpand] = useState(false);

  // const [messages, setMessages] = useState<any[]>([]);
  // const messagesRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatbox"
            id="chatbox-container"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`
              flex flex-col
              rounded-2xl shadow-2xl border border-gray-200
              bg-white backdrop-blur-xl
              transition-all duration-300
              ${
                expand
                  ? "fixed inset-0 sm:inset-12 w-full sm:w-[700px] mx-auto h-[90vh] z-[99999]"
                  : "w-[360px] h-[520px]"
              }
            `}
          >
            {/* Header buttons */}
            <div
              className="flex justify-between items-center px-4 py-3 
              bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Trợ lý AI</h3>
                  <p className="text-[11px] opacity-90">Hỗ trợ 24/7</p>
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setExpand(!expand)}
                  className="p-2 hover:bg-white/20 rounded-lg"
                >
                  {expand ? <Minimize size={18} /> : <Expand size={18} />}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setOpen(false);
                    setExpand(false);
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg"
                >
                  <X size={18} />
                </motion.button>
              </div>
            </div>
            {/* Chat Left */}
            <div className="flex flex-col flex-1 min-w-[320px]">
              <ChatWindow expand={expand} />
            </div>

            {/* Recommendation Sidebar */}
            {expand && (
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-[320px] bg-gray-50 border-l overflow-y-auto"
              >
                <SuggestionList customerId={user?.id || ""} />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      {!expand && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 
                     text-white flex items-center justify-center shadow-xl"
        >
          {open ? <X size={32} /> : <MessageCircle size={32} />}
        </motion.button>
      )}
    </div>
  );
};

export default ChatBox;
