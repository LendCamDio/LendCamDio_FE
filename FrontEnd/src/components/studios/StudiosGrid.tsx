import Loading from "../common/Loading/Loading";
import type { Equipment } from "@/types/entity.type";
import { StudioCard } from "./StudioCard";

const StudiosGrid = ({
  studios,
  isLoading,
}: {
  studios: Equipment[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-6">
        <Loading size="lg" text="Đang tải studios..." />
        <Loading size="lg" text="Đang tải studios..." />
      </div>
    );
  }

  return (
    <div className="row">
      {studios.length > 0 ? (
        studios.map((studio) => (
          <div className="col-md-6 mb-4" key={studio.equipmentId}>
            <StudioCard
              studio={studio}
              classNameImg="card-outstanding-img-top"
            />
          </div>
        ))
      ) : (
        <div className="col-12 text-center text-gray-500">
          Không có studio nào để hiển thị.
        </div>
      )}
    </div>
  );
};

export default StudiosGrid;
