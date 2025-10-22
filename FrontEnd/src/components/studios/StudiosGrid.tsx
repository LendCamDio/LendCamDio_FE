import Loading from "../common/Loading/Loading";
import type { Equipment } from "@/types/entity.type";
import { StudioCard } from "./StudioCard";
import { motion } from "framer-motion";
import { Package } from "lucide-react";

const StudiosGrid = ({
  studios,
  isLoading,
}: {
  studios: Equipment[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="container grid grid-cols-2 gap-6">
        <Loading
          size="lg"
          text="Đang tải studios..."
          width="100%"
          className="card-outstanding-img-top
          transition-all duration-100 animate-pulse
          bg-gradient-to-bl from-[var(--primary-color)] via-gray-200 to-gray-100
          rounded-2xl"
        />
        <Loading
          size="lg"
          text="Đang tải studios..."
          className="card-outstanding-img-top
          transition-all duration-100 animate-pulse
          bg-gradient-to-bl from-[var(--primary-color)] via-gray-200 to-gray-100
          rounded-2xl"
        />
      </div>
    );
  }

  return (
    <div className="container">
      {studios.length === 0 && isLoading === false && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-white"
        >
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-2">
            Không tìm thấy studio nào
          </h3>
          <p className="text-[var(--text-light)]">
            Rất tiếc, chúng tôi không tìm thấy studio nào phù hợp với tiêu chí
            của bạn.
          </p>
        </motion.div>
      )}
      <div className="row">
        {studios.length > 0 &&
          studios.map((studio) => (
            <div className="col-md-6 mb-4" key={studio.equipmentId}>
              <StudioCard
                studio={studio}
                classNameImg="card-outstanding-img-top"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default StudiosGrid;
