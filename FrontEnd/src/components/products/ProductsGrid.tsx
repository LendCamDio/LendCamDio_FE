import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "../common/Loading/Loading";
import ProductCard from "./ProductCard";
import type { Equipment } from "@/types/entity.type";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const ProductsGrid = ({
  products,
  isLoading,
}: {
  products: Equipment[];
  isLoading: boolean;
}) => {
  // console.log("ProductsGrid render with products:", products);
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-6">
        <Loading size="lg" text="Đang tải sản phẩm..." />
        <Loading size="lg" text="Đang tải sản phẩm..." />
        <Loading size="lg" text="Đang tải sản phẩm..." />
      </div>
    );
  }
  console.log("Rendering ProductsGrid with products:", products);

  return (
    <div className="flex justify-center flex-col items-center w-full">
      {products.length === 0 && isLoading === false && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-6xl text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-white"
        >
          <FontAwesomeIcon
            icon={faSearch}
            size="4x"
            className="text-[var(--primary-color)] mb-6"
          />
          <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-2">
            Không tìm thấy sản phẩm phù hợp
          </h3>
          <p className="text-[var(--text-light)]">
            Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với tiêu chí
            của bạn.
          </p>
        </motion.div>
      )}
      <div className="grid in-[100px]:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {products.length > 0 &&
          products.map((product) => (
            <ProductCard key={product.equipmentId} equipment={product} />
          ))}
      </div>
    </div>
  );
};

export default ProductsGrid;
