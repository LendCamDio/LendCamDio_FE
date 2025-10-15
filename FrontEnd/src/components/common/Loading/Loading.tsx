const sizeStyles: Record<string, string> = {
  xs: "w-6 h-6 border-2",
  sm: "w-8 h-8 border-2",
  md: "w-12 h-12 border-4",
  lg: "w-16 h-16 border-4",
};

const colorStyles: Record<string, string> = {
  primary: "border-t-blue-500",
  secondary: "border-t-purple-500",
  success: "border-t-green-500",
  danger: "border-t-red-500",
};

const Loading = ({
  size = "md", // Default size: medium
  color = "primary", // Default color: primary
  text = "Loading...", // Default text
  showText = true, // Default: show text
  height = "auto",
  className = "",
}: {
  size?: keyof typeof sizeStyles;
  color?: keyof typeof colorStyles;
  text?: string;
  showText?: boolean;
  height?: string;
  className?: string;
}) => {
  return (
    <div
      className={`w-full h-[${height}] 
      flex flex-col items-center justify-center 
      animate-fade-in-up ${className}`}
    >
      <div
        className={`
          ${sizeStyles[size] || sizeStyles.md}
          ${colorStyles[color] || colorStyles.primary}
          border rounded-full animate-spin
          border-opacity-25
          relative
        `}
      >
        {/* Inner ring for double-spinner effect */}
        <div
          className={`
            absolute inset-0 
            ${sizeStyles[size] || sizeStyles.md} 
            ${colorStyles[color] || colorStyles.primary}
            border rounded-full animate-spin-slow 
            border-opacity-10 border-t-opacity-50
          `}
        />
      </div>
      {showText && size !== "sm" && (
        <p
          className={`
            mt-4 text-${color || "primary"} 
            font-medium text-${
              size === "sm" ? "sm" : size === "md" ? "base" : "lg"
            }
            animate-pulse
          `}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default Loading;
