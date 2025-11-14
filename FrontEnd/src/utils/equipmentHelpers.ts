// Helper functions
const getConditionLabel = (condition: number) => {
  const labels = ["New", "Good", "Used", "Damaged"];
  return labels[condition] || "Unknown";
};

const getConditionColor = (condition: number) => {
  const colors = [
    "bg-green-100 text-green-800",
    "bg-blue-100 text-blue-800",
    "bg-yellow-100 text-yellow-800",
    "bg-red-100 text-red-800",
  ];
  return colors[condition] || "bg-gray-100 text-gray-800";
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
export { getConditionLabel, getConditionColor, formatDate };
