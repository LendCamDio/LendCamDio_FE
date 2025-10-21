import { motion } from "framer-motion";
import BookingFilter from "../common/Filter/BookingFilter";
import SortDropdown from "../common/Dropdown/SortDropdown";

enum RentalStatus {
  PENDING = "Pending",
  ACTIVE = "Active",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}
interface Tab {
  id: string;
  label: string;
  count: number;
}
interface BookingTabsProps {
  tabs: Tab[];
  activeTab: RentalStatus | "all";
  setActiveTab: (tab: string | "all") => void;
  onSort: (sortBy: string) => void;
  sortOptions: { label: string; value: string }[];
}

const BookingTabs = ({
  tabs,
  activeTab,
  setActiveTab,
  onSort,
  sortOptions,
}: BookingTabsProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="filter-section animate-fadeInUp"
    >
      <div className="container">
        <div className="filter-controls">
          {/* Tabs */}
          <BookingFilter
            items={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          {/* Filter Button */}
          <div className="filter-group">
            <h5>Bộ lọc</h5>
            <SortDropdown options={sortOptions} onSort={onSort} />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default BookingTabs;
