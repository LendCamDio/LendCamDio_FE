import Loading from "@/components/common/Loading/Loading";
import { useState } from "react";

const CategoryFilter = ({
  isLoading,
  setSelectedCategory,
  listFilteredCategories = [
    { key: "all", label: "Tất cả" },
    { key: "camera", label: "Máy ảnh" },
    { key: "lens", label: "Ống kính" },
    { key: "accessory", label: "Phụ kiện" },
  ],
}: {
  isLoading: boolean;
  setSelectedCategory: (cat: string) => void;
  listFilteredCategories: { key: string; label: string }[];
}) => {
  const [activeCategory, setActiveCategory] = useState("all");

  const handleClick = (category: string) => {
    setActiveCategory(category);
    setSelectedCategory(category);
  };

  return (
    <div className="filter-group">
      {isLoading ? (
        <Loading size="xs" />
      ) : (
        <>
          <h5>Danh mục</h5>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${
                activeCategory === "all" ? "active" : ""
              }`}
              onClick={() => handleClick("all")}
            >
              Tất cả
            </button>
            {listFilteredCategories.map((cat) => (
              <button
                key={cat.key}
                className={`filter-btn ${
                  activeCategory === cat.label ? "active" : ""
                }`}
                onClick={() => handleClick(cat.label)}
              >
                {cat.label === "Cameras"
                  ? "Máy ảnh"
                  : cat.label === "Lenses"
                  ? "Ống kính"
                  : cat.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryFilter;
