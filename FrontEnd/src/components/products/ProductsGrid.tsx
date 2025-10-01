import Loading from "../common/Loading/Loading";
import ProductCard from "./ProductCard";
import type { Equipment } from "@/types/entity.type";

const ProductsGrid = ({
  products,
  isLoading,
}: {
  products: Equipment[];
  isLoading: boolean;
}) => {
  console.log("ProductsGrid render with products:", products);
  if (isLoading) {
    return (
      <>
        <div className="loading">
          <Loading size="md" text="Đang tải sản phẩm..." />
        </div>
        <div className="loading">
          <Loading size="md" text="Đang tải sản phẩm..." />
        </div>
        <div className="loading">
          <Loading size="md" text="Đang tải sản phẩm..." />
        </div>
        <div className="loading">
          <Loading size="md" text="Đang tải sản phẩm..." />
        </div>
      </>
    );
  }

  return (
    <div className="">
      {products.map((product) => (
        <ProductCard key={product.equipmentId} equipment={product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
