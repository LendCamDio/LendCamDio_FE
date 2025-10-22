import { useMemo, useState } from "react";
import CategoryFilter from "../components/common/Filter/CategoryFilter";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import { useEquipCategoryList } from "@/hooks/equipment/useEquipCategory";
import { useEquipmentList } from "@/hooks/equipment/useEquipment";
import Pagination from "@/components/common/Pagination/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import ProductsGrid from "@/components/products/ProductsGrid";
import Loading from "@/components/common/Loading/Loading";

const CameraRental = () => {
  const showToast = useUniqueToast();
  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: dataCat,
    isLoading: isLoadingCat,
    error: errorCat,
  } = useEquipCategoryList(1, 100);
  const categories: { key: string; label: string }[] =
    dataCat?.data?.items.map((cat) => ({
      key: cat.categoryId,
      label: cat.name,
    })) || [];
  const exceptCategory = ["Studio"];
  const filteredCategories = categories.filter(
    (cat) => !exceptCategory.includes(cat.label)
  );

  const { data, isLoading, error } = useEquipmentList(
    page,
    pageSize,
    activeCategory,
    searchQuery.trim()
  );
  // console.log("Equipment data:", data);

  const filteredEquipment = useMemo(() => {
    if (!data?.data?.items) return [];

    const items = [...data.data.items];
    return items;
  }, [data?.data?.items]);

  const handleLoadMore = () => {
    setLoadMore(true);
  };

  const handlePageChange = (page: number) => {
    const newPage = page;
    setPage(newPage);
  };

  if (errorCat || error) {
    showToast("Đã có lỗi xảy ra khi tải dữ liệu", "error");
    console.error("Error fetching data:", errorCat || error);
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="text-center">
            <h1> Thuê máy ảnh & phụ kiện</h1>
            <p>Thiết bị chuyên nghiệp cho mọi nhu cầu chụp ảnh</p>
          </div>
          <div className="search-bar mt-4">
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} />
              <input
                type="text"
                id="searchInput"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section animate-fadeInUp">
        <div className="container">
          <div className="filter-controls">
            <CategoryFilter
              isLoading={isLoadingCat}
              setSelectedCategory={(cat) => {
                setActiveCategory(cat);
                setPage(1);
              }}
              listFilteredCategories={filteredCategories}
            />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section">
        <div className="container">
          <div className="row flex justify-center gap-6">
            <ProductsGrid products={filteredEquipment} isLoading={isLoading} />
          </div>
        </div>
        <div className="text-center mt-5 flex flex-col items-center">
          {!loadMore ? (
            <div className="flex items-center gap-2">
              {isLoading ? (
                <span className="btn btn-outline-primary flex items-center gap-2">
                  <Loading
                    size={"xs"}
                    showText={false}
                    width={"5em"}
                    className="px-2"
                  />
                  Xem sản phẩm
                </span>
              ) : (
                <button
                  className="text-xs py-2 btn-outline-primary flex items-center gap-2"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Xem thêm sản phẩm
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

export default CameraRental;
