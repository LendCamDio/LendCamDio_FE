import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/common/PageTransaction/PageWrapper";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  X,
  Loader2,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { toast } from "sonner";
import aiService from "@/services/api/aiService";
import { useUser } from "@/hooks/user/useUser";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  rating?: number;
}

interface RateLimitStatus {
  isAllowed: boolean;
  remainingRequests: number;
  resetTime: string;
  limitType: string;
}

const AiAssistant = () => {
  const { data: user } = useUser();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Xin chào! Tôi là trợ lý AI của LendCamDio. Tôi có thể giúp bạn tìm kiếm thiết bị, tư vấn về sản phẩm, và đề xuất những lựa chọn phù hợp nhất cho nhu cầu của bạn. Bạn cần tôi giúp gì?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitStatus, setRateLimitStatus] =
    useState<RateLimitStatus | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check rate limit on mount
  useEffect(() => {
    if (user?.userId) {
      checkRateLimit();
    }
  }, [user]);

  const checkRateLimit = async () => {
    if (!user?.userId) return;

    try {
      const status = await aiService.checkChatRateLimit(user.userId, 0);
      setRateLimitStatus(status);
    } catch (error) {
      console.error("Failed to check rate limit:", error);
    }
  };
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Check rate limit before sending
    if (rateLimitStatus && !rateLimitStatus.isAllowed) {
      toast.error(
        `Bạn đã hết lượt chat. Vui lòng thử lại sau: ${new Date(
          rateLimitStatus.resetTime
        ).toLocaleTimeString()}`
      );
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Call API to chat with AI
      const response = await aiService.chat(currentInput);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          response.response || "Xin lỗi, tôi không thể trả lời câu hỏi này.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      toast.success("Đã nhận được phản hồi từ AI");

      // Update rate limit status
      await checkRateLimit();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Có lỗi xảy ra. Vui lòng thử lại!";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Chat error:", error);

      // Add error message to chat
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: `⚠️ ${errorMessage}`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRateMessage = async (messageId: string, rating: number) => {
    // Update UI immediately
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, rating } : msg))
    );

    toast.success(
      rating > 0 ? "Cảm ơn phản hồi của bạn!" : "Chúng tôi sẽ cải thiện!"
    );
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        content:
          "Xin chào! Tôi là trợ lý AI của LendCamDio. Bạn cần tôi giúp gì?",
        role: "assistant",
        timestamp: new Date(),
      },
    ]);
    setError(null);
    toast.success("Đã xóa lịch sử chat");
  };

  return (
    <PageWrapper>
      <div className="min-page-height bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Trợ lý AI
                  </h1>
                  <p className="text-gray-600">
                    Hỗ trợ tư vấn và đề xuất thiết bị thông minh
                  </p>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <X className="w-4 h-4" />
                Xóa chat
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                <p className="text-red-800">
                  ⚠️ <strong>Lỗi:</strong> {error}
                </p>
              </div>
            )}
          </motion.div>

          {/* Chat Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Messages Area */}
            <div className="h-[600px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        message.role === "user"
                          ? "bg-blue-500"
                          : "bg-gradient-to-br from-purple-500 to-blue-600"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div
                      className={`flex-1 max-w-[70%] ${
                        message.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-white border border-gray-200 text-gray-900"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.role === "user"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {/* Rating Buttons (for assistant messages) */}
                      {message.role === "assistant" &&
                        message.id !== "welcome" && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleRateMessage(message.id, 1)}
                              className={`p-1 rounded transition ${
                                message.rating === 1
                                  ? "text-green-600 bg-green-50"
                                  : "text-gray-400 hover:text-green-600"
                              }`}
                              title="Hữu ích"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRateMessage(message.id, -1)}
                              className={`p-1 rounded transition ${
                                message.rating === -1
                                  ? "text-red-600 bg-red-50"
                                  : "text-gray-400 hover:text-red-600"
                              }`}
                              title="Không hữu ích"
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex gap-2 items-center">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-gray-600">Đang suy nghĩ...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t bg-white p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  Gửi
                </button>
              </div>

              {/* Quick Questions */}
              <div className="mt-3 flex flex-wrap gap-2">
                <p className="text-xs text-gray-500 w-full mb-1">
                  Câu hỏi gợi ý:
                </p>
                {[
                  "Gợi ý máy ảnh cho người mới",
                  "So sánh Canon vs Sony",
                  "Thiết bị chụp ảnh cưới",
                  "Lens nào tốt nhất cho chân dung?",
                ].map((question) => (
                  <button
                    key={question}
                    onClick={() => setInput(question)}
                    disabled={isLoading}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-4 shadow-md"
            >
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Tư vấn 24/7</h3>
              </div>
              <p className="text-sm text-gray-600">
                Nhận tư vấn tự động mọi lúc mọi nơi
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-4 shadow-md"
            >
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Đề xuất thông minh</h3>
              </div>
              <p className="text-sm text-gray-600">
                AI phân tích và gợi ý sản phẩm phù hợp
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg p-4 shadow-md"
            >
              <div className="flex items-center gap-3 mb-2">
                <ThumbsUp className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold">Học từ phản hồi</h3>
              </div>
              <p className="text-sm text-gray-600">
                Hệ thống học hỏi và cải thiện liên tục
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AiAssistant;
