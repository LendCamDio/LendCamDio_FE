import type { RentalStatus } from "@/types/entity.type";
import { motion } from "framer-motion";

const BookingFilter = ({
  items,
  activeTab,
  setActiveTab,
}: {
  items: {
    id: string;
    label: string;
    count: number;
  }[];
  activeTab: string | RentalStatus;
  setActiveTab: (value: string | RentalStatus) => void;
}) => {
  console.log("Rendering BookingFilter with activeTab:", activeTab);
  console.log("Items:", items);
  return (
    <div className="filter-group">
      <h5>Danh mục</h5>
      <div className="flex gap-3 pb-2">
        {items.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`filter-btn ${activeTab === tab.id ? "active" : ""}`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === tab.id
                  ? "bg-white/20"
                  : "bg-gray-100 text-[var(--text-light)]"
              }`}
            >
              {tab.count}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default BookingFilter;
