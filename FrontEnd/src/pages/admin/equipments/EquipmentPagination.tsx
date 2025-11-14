import type { Equipment } from "@/types/entity.type";

type Props = {
  searchTerm: string;
  filterCategory: string;
  equipments: Equipment[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  onClickPage: (page: number) => void;
};

const EquipmentPagination = ({
  searchTerm,
  filterCategory,
  equipments,
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  onClickPage,
}: Props) => {
  return (
    <div className="mt-6 bg-white rounded-lg shadow-md px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Pagination Info */}
        <div className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-semibold">
            {(currentPage - 1) * pageSize + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold">
            {Math.min(currentPage * pageSize, totalCount)}
          </span>{" "}
          of <span className="font-semibold">{totalCount}</span> results
          {(searchTerm || filterCategory !== "all") && (
            <span className="text-gray-500">
              {" "}
              (filtered from {equipments.length} in this page)
            </span>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => onClickPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 border border-gray-300 rounded-lg bg-white font-medium">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => onClickPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentPagination;
