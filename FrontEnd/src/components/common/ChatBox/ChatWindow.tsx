import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useChatting } from "@/hooks/ai/useAIMutaion";
import type { Message } from "@/types/ui/ui.type";

const ChatWindow = ({ expand }: { expand: boolean }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Xin chào! Tôi là Trợ lý AI của LendCamDio. Tôi có thể giúp gì cho bạn?",
    },
  ]);

  const endRef = useRef<HTMLDivElement | null>(null);
  const { mutate: sendChat, isPending } = useChatting();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (msg: string) => {
    if (!msg.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: msg }]);

    sendChat(msg, {
      onSuccess: (res) => {
        const reply =
          res?.data?.response ||
          "Xin lỗi, tôi không nhận được phản hồi từ máy chủ.";

        setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      },
      onError: () => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Có lỗi xảy ra. Bạn hãy thử lại sau nhé.",
          },
        ]);
      },
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div
        className={`flex-1 overflow-y-auto p-4 ${
          expand ? "text-base" : "text-sm"
        } bg-gray-50`}
      >
        <ChatMessage messages={messages} isPendingChat={isPending} />
        <div ref={endRef} />
      </div>

      <div className="border-t p-3 bg-white">
        <ChatInput onSendMessage={handleSend} isLoading={isPending} />
      </div>
    </div>
  );
};

export default ChatWindow;
