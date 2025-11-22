import SortDropdown from "@/components/common/Dropdown/SortDropdown";
import Pagination from "@/components/common/Pagination/Pagination";
import ProductsGrid from "@/components/products/ProductsGrid";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";
import CategoryFilter from "../../components/common/Filter/CategoryFilter";
import { useEquipCategoryList } from "@/hooks/equipment/useEquipCategory";
import PageWrapper from "@/components/common/PageTransaction/PageWrapper";
import Loading from "@/components/common/Loading/Loading";
import { useEquipmentList } from "@/hooks/equipment/useEquipmentUser";

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

    // Filter to show only sale equipment (has price, not dailyPrice)
    const saleItems = data.data.items.filter(item => {
      // Must have price (for sale) and should not be primarily a rental item
      const hasPrice = item.price != null && item.price > 0;
      return hasPrice;
    });

    switch (sortBy) {
      case "name":
        return saleItems.sort((a, b) => a.name.localeCompare(b.name));
      case "price-low":
        return saleItems.sort((a, b) => {
          const priceA = a.price!;
          const priceB = b.price!;
          return priceA - priceB;
        });
      case "price-high":
        return saleItems.sort((a, b) => {
          const priceA = a.price!;
          const priceB = b.price!;
          return priceB - priceA;
        });
      case "popular":
        return saleItems.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return saleItems;
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl">
              Mua Sắm Thiết Bị
            </h1>
            <p className="text-sm sm:text-base lg:text-lg mt-2">
              Khám phá thiết bị chụp ảnh chuyên nghiệp để sở hữu
            </p>
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="filter-controls flex-col sm:flex-row">
            <CategoryFilter
              isLoading={isLoadingCat}
              setSelectedCategory={(cat) => {
                setPage(1);
                setSelectedCategory(cat);
              }}
              listFilteredCategories={categories}
            />
            <div className="filter-group w-full sm:w-auto">
              <h5 className="text-sm sm:text-base">Sắp xếp</h5>
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Render your product items here */}
          <ProductsGrid
            products={sortedEquips}
            // products={sampleData}
            isLoading={isLoading}
          />
        </div>
        {/* Load More Button */}
        <div className="text-center mt-8 flex flex-col items-center px-4">
          {!loadMore ? (
            <div className="flex items-center gap-2">
              <button
                className="text-xs sm:text-sm py-2 px-4 sm:px-6 btn-outline-primary flex items-center gap-2"
                onClick={handleLoadMore}
                disabled={isLoading || sortedEquips.length === 0}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loading
                      size={"xs"}
                      showText={false}
                      width={"5em"}
                      className="px-2"
                    />
                    Xem sản phẩm
                  </span>
                ) : (
                  <span className="">
                    <FontAwesomeIcon icon={faPlus} />
                    <span className="ml-2">Xem thêm sản phẩm</span>
                  </span>
                )}
              </button>
            </div>
          ) : (
            <div className="w-full max-w-2xl">
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
