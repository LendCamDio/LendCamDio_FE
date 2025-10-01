import SortDropdown from "@/components/common/Dropdown/SortDropdown";
import Pagination from "@/components/common/Pagination/Pagination";
import ProductsGrid from "@/components/products/ProductsGrid";
import { useEquipmentList } from "@/hooks/equipment/useEquipment";
import { useUniqueToast } from "@/hooks/useUniqueToast";
import { faPlus, faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const Products = () => {
  const showToast = useUniqueToast();
  const [loadMore, setLoadMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page] = useState(1);
  const [pageSize] = useState(12);
  // const [searchQuery, setSearchQuery] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState("all");
  // const [sortBy, setSortBy] = useState("name");

  const sortOptions = [
    { value: "name", label: "Tên A-Z" },
    { value: "price-low", label: "Giá thấp đến cao" },
    { value: "price-high", label: "Giá cao đến thấp" },
    { value: "popular", label: "Phổ biến" },
  ];

  const handleLoadMore = () => {
    setLoading(true);
    setLoadMore(true);
  };

  const { data, isLoading, error } = useEquipmentList(page, pageSize);
  if (error) showToast("Lỗi tải sản phẩm", "error");
  if (data) console.log("Fetched products:", data);

  const handleSort = () => {
    // let filtered = [...(data?.data.items || [])];
    // // Search filter
    // if (searchQuery) {
    //   filtered = filtered.filter((product) =>
    //     product.name.toLowerCase().includes(searchQuery.toLowerCase())
    //   );
    // }
    // // Category filter
    // if (selectedCategory !== "all") {
    //   filtered = filtered.filter((product) =>
    //     product.categoryName.toLowerCase().includes(selectedCategory)
    //   );
    // }
    // // Sort
    // switch (sortBy) {
    //   case "price-low":
    //     filtered.sort((a, b) => a.dailyPrice - b.dailyPrice);
    //     break;
    //   // ... other cases
    // }
    // return filtered;
  };

  const handlePageChange = (page: number) => {
    showToast(`Chuyển đến trang ${page}`, "info");
    //   const newPage = selectedItem.selected + 1; // Convert 0-based → 1-based
    //   setPage(newPage);
    //   window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="text-center">
            <h1>Sản phẩm & Dịch vụ</h1>
            <p>Khám phá tất cả studio và thiết bị chụp ảnh chuyên nghiệp</p>
          </div>
          <div className="search-bar mt-4">
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} />
              <input
                type="text"
                id="searchInput"
                placeholder="Tìm kiếm sản phẩm..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section animate-fadeInUp">
        <div className="container">
          <div className="filter-controls">
            <div className="filter-group">
              <h5>Danh mục</h5>
              <div className="filter-buttons">
                <button className="filter-btn active" data-filter="all">
                  Tất cả
                </button>
                <button className="filter-btn" data-filter="studio">
                  Studio
                </button>
                <button className="filter-btn" data-filter="camera">
                  Máy ảnh
                </button>
                <button className="filter-btn" data-filter="lens">
                  Ống kính
                </button>
                <button className="filter-btn" data-filter="accessory">
                  Phụ kiện
                </button>
              </div>
            </div>
            <div className="filter-group">
              <h5>Sắp xếp</h5>
              <SortDropdown
                options={sortOptions}
                onSort={handleSort}
                defaultValue="name"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <div className="container">
          <div className="products-grid" id="productsGrid">
            {/* Render your product items here */}
            <ProductsGrid
              products={data?.data.items || []}
              isLoading={isLoading}
            />
          </div>
          {/* Load More Button */}
          <div className="text-center mt-5 flex flex-col items-center">
            {!loadMore ? (
              <button
                className="text-xs py-2 btn-outline-primary"
                id="loadMoreBtn"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin"
                    />
                    <p>Đang tải...</p>
                  </div>
                ) : (
                  <button
                    className="flex items-center gap-2"
                    onClick={handleLoadMore}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Xem thêm sản phẩm
                  </button>
                )}
              </button>
            ) : (
              <div className="w-2xl">
                <Pagination
                  pageSize={pageSize}
                  currentPage={page}
                  pageCount={1}
                  onPageChange={(selectedItem) =>
                    handlePageChange(selectedItem.selected + 1)
                  }
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
