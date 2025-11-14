import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatMessage = ({
  messages,
  isPendingChat,
}: {
  messages: Array<{ sender: string; text: string }>;
  isPendingChat: boolean;
}) => {
  return (
    <div className="space-y-4">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`max-w-[85%] px-4 py-2 rounded-2xl shadow-sm
              ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white ml-auto rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }
            `}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
        </div>
      ))}

      {isPendingChat && (
        <div className="mr-auto bg-white border px-3 py-2 rounded-xl shadow-sm">
          <span className="animate-pulse">Đang trả lời...</span>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
