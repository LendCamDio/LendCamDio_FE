import {
  faShoppingCart,
  faStar,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  product?: {
    name: string;
    image: string;
    category: string;
    description: string;
    price: number;
    rating: number;
  };
  onAddToCart?: (productName: string) => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
  open,
  onClose,
  product,
  onAddToCart,
}) => {
  if (!open || !product) return null;

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(n);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden animate-fadeIn relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Image Section */}
        <div className="grid md:grid-cols-2">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-72 md:h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 text-sm rounded">
              {product.category}
            </div>
          </div>

          {/* Info Section */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>

              <div className="flex items-center mb-4 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={
                      i < Math.round(product.rating) ? "" : "opacity-30"
                    }
                  />
                ))}
                <span className="ml-2 text-gray-600 text-sm">
                  ({product.rating.toFixed(1)})
                </span>
              </div>

              <div className="text-2xl font-bold text-blue-600 mb-6">
                {formatCurrency(product.price)}/ngày
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onAddToCart?.(product.name)}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full"
              >
                <FontAwesomeIcon icon={faShoppingCart} /> Thêm vào giỏ
              </button>
              <button
                onClick={onClose}
                className="border border-gray-400 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition w-full"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.25s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default ProductDialog;
