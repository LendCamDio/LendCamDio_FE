import Pagination from "@/components/common/Pagination/Pagination";
import StudiosGrid from "@/components/studios/StudiosGrid";
import { useEquipmentList } from "@/hooks/equipment/useEquipment";
import { useUniqueToast } from "@/hooks/useUniqueToast";
import { faPlus, faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const StudioBooking = () => {
  const showToast = useUniqueToast();
  const [loadMore, setLoadMore] = useState(false);
  const [loading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useEquipmentList(
    page,
    pageSize,
    "Studio",
    searchQuery.trim()
  );

  if (error) {
    showToast("Đã có lỗi xảy ra khi tải dữ liệu", "error");
    console.error("Error fetching data:", error);
  }

  const studios = data?.data?.items || [];

  const handleLoadMore = () => {
    setLoadMore(true);
  };

  const handlePageChange = (page: number) => {
    const newPage = page;
    setPage(newPage);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="text-center">
            <h1>Đặt lịch Studio</h1>
            <p>Chọn studio phù hợp cho buổi chụp ảnh của bạn</p>
          </div>
          <div className="search-bar mt-4">
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} />
              <input
                type="text"
                id="searchInput"
                placeholder="Tìm kiếm studio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Studios Grid Section */}
      <section className="section">
        <div className="container">
          <StudiosGrid studios={studios} isLoading={isLoading} />
        </div>

        {/* Load More Button / Pagination */}
        <div
          className="text-center mt-5 flex flex-col items-center"
          hidden={studios.length < pageSize}
        >
          {!loadMore ? (
            <div className="flex items-center gap-2">
              {loading ? (
                <button
                  className="text-xs py-2 btn-outline-primary"
                  id="loadMoreBtn"
                >
                  <div className="text-center mt-5 flex flex-col items-center">
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin"
                    />
                    <p>Đang tải...</p>
                  </div>
                </button>
              ) : (
                <button
                  className="text-xs py-2 btn-outline-primary flex items-center gap-2"
                  onClick={handleLoadMore}
                  disabled={isLoading || studios.length === 0}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Xem thêm studio
                </button>
              )}
            </div>
          ) : (
            <div className="w-2xl">
              <Pagination
                pageSize={pageSize}
                currentPage={page}
                pageCount={data?.data?.pages || 0}
                onPageChange={(selectedItem) =>
                  handlePageChange(selectedItem.selected + 1)
                }
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudioBooking;
