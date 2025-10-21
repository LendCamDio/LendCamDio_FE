const LoadingDot = ({ size = 2 }: { size?: number }) => {
  return (
    <div className="flex justify-start">
      <div
        className={`bg-white border border-gray-200 px-4 py-2 rounded-2xl rounded-bl-sm`}
      >
        <div className="flex gap-1">
          <span
            className={`w-${size} h-${size} bg-gray-400 rounded-full animate-bounce`}
            style={{ animationDelay: "0ms" }}
          />
          <span
            className={`w-${size} h-${size} bg-gray-400 rounded-full animate-bounce`}
            style={{ animationDelay: "150ms" }}
          />
          <span
            className={`w-${size} h-${size} bg-gray-400 rounded-full animate-bounce`}
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingDot;
