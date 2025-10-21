import SortDropdown from "@/components/common/Dropdown/SortDropdown";
import Pagination from "@/components/common/Pagination/Pagination";
import ProductsGrid from "@/components/products/ProductsGrid";
import { useEquipmentList } from "@/hooks/equipment/useEquipment";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import { faPlus, faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";
import CategoryFilter from "../../components/common/Filter/CategoryFilter";
import { useEquipCategoryList } from "@/hooks/equipment/useEquipCategory";
import PageWrapper from "@/components/common/PageTransaction/PageWrapper";

const Products = () => {
  const showToast = useUniqueToast();
  const [loadMore, setLoadMore] = useState(false);
  const [loading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [sortBy, setSortBy] = useState("name");
  const [selectedCategory, setSelectedCategory] = useState("all");
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
  const { data, isLoading, error } = useEquipmentList(
    page,
    pageSize,
    selectedCategory,
    searchQuery.trim()
  );

  const sortOptions = [
    { value: "name", label: "Tên A-Z" },
    { value: "price-low", label: "Giá thấp đến cao" },
    { value: "price-high", label: "Giá cao đến thấp" },
    { value: "popular", label: "Phổ biến" },
  ];

  if (errorCat || error) {
    showToast("Đã có lỗi xảy ra khi tải dữ liệu", "error");
    console.error("Error fetching data:", errorCat || error);
  }

  // Sort cho sản phẩm
  const sortedEquips = useMemo(() => {
    if (!data?.data?.items) return [];

    const items = [...data.data.items];
    switch (sortBy) {
      case "name":
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case "price-low":
        return items.sort((a, b) => {
          const priceA = a.dailyPrice ?? a.price;
          const priceB = b.dailyPrice ?? b.price;
          // Xử lý trường hợp item không có giá (đẩy chúng xuống cuối)
          if (priceA == null) return 1;
          if (priceB == null) return -1;
          return priceA - priceB;
        });
      case "price-high":
        return items
          .sort((a, b) => {
            const priceA = a.dailyPrice ?? a.price;
            const priceB = b.dailyPrice ?? b.price;

            // Xử lý trường hợp item không có giá (đẩy chúng xuống cuối)
            if (priceA == null) return 1;
            if (priceB == null) return -1;

            return priceA - priceB;
          })
          .reverse();
      case "popular":
        return items.sort(
          (a, b) =>
            (b.rating?.averageRating || 0) - (a.rating?.averageRating || 0)
        );
      default:
        return items;
    }
  }, [data?.data?.items, sortBy]);

  const handleSort = (sortOption: string) => {
    setSortBy(sortOption);
  };

  const handleLoadMore = () => {
    setLoadMore(true);
  };

  const handlePageChange = (page: number) => {
    const newPage = page;
    setPage(newPage);
  };

  return (
    <PageWrapper animation="fade">
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
                setPage(1);
                setSelectedCategory(cat);
              }}
              listFilteredCategories={categories}
            />
            <div className="filter-group">
              <h5>Sắp xếp</h5>
              <SortDropdown
                options={sortOptions}
                onSort={(sortOpt) => {
                  handleSort(sortOpt);
                }}
                defaultValue="name"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        <div className="ms-64 me-64 mb-8">
          {/* Render your product items here */}
          <ProductsGrid
            products={sortedEquips}
            // products={sampleData}
            isLoading={isLoading}
          />
        </div>
        {/* Load More Button */}
        <div className="text-center mt-5 flex flex-col items-center">
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
                  disabled={isLoading || sortedEquips.length === 0}
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
    </PageWrapper>
  );
};

export default Products;
