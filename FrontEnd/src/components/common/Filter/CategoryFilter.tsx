import { useState } from "react";
import LoadingDot from "../Loading/LoadingDot";

const CategoryFilter = ({
  isLoading,
  setSelectedCategory,
  listFilteredCategories,
}: {
  isLoading: boolean;
  setSelectedCategory: (cat: string) => void;
  listFilteredCategories: { key: string; label: string }[];
}) => {
  const [activeCategory, setActiveCategory] = useState("all");

  const defaultCategories = [
    { key: "all", label: "Tất cả" },
    { key: "camera", label: "Máy ảnh" },
    { key: "lens", label: "Ống kính" },
    { key: "Something else", label: "Một cái gì đó khác" },
  ];

  const handleClick = (category: string) => {
    setActiveCategory(category);
    setSelectedCategory(category);
  };

  return (
    <div className="filter-group">
      {isLoading ? (
        <div className="filter-buttons">
          <h5>Danh mục</h5>
          <LoadingDot />
        </div>
      ) : (
        <>
          <div className="filter-buttons">
            <h5>Danh mục</h5>
            <button
              className={`filter-btn ${
                activeCategory === "all" ? "active" : ""
              }`}
              onClick={() => handleClick("all")}
            >
              Tất cả
            </button>
            {listFilteredCategories.length === 0 &&
              defaultCategories.slice(1).map((cat) => (
                <button
                  key={cat.key}
                  className={`filter-btn ${
                    activeCategory === cat.label ? "active" : ""
                  }`}
                  onClick={() => handleClick(cat.label)}
                >
                  {cat.label}
                </button>
              ))}
            {listFilteredCategories.length > 0 &&
              listFilteredCategories.map((cat) => (
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
