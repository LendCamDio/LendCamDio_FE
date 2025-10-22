import defPic from "../../assets/defaultPic.jpg";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useState } from "react";

interface CartItem {
  name: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
}

const CartCard = ({
  item,
  index,
  formatCurrency,
  updateQuantity,
  removeItem,
}: {
  item: CartItem;
  index: number;
  formatCurrency: (n: number) => string;
  updateQuantity: (index: number, qty: number) => void;
  removeItem: (index: number) => void;
}) => {
  const [imageSrc, setImageSrc] = useState(defPic);

  // Chạy khi hình ảnh không tải được
  const handleImageError = () => {
    // setLoadingImg(false);
    setImageSrc(defPic);
  };
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="cart-item py-6 flex flex-wrap md:flex-nowrap items-center gap-4"
    >
      <img
        src={imageSrc}
        alt={item.name}
        className="item-image w-24 h-24"
        onError={handleImageError}
      />
      <div className="flex-grow item-details">
        <p className="text-xl text-[var(--text-dark)] font-semibold mb-2">
          {item.name}
        </p>
        <p className="text-sm text-gray-500">
          {item.category || "Chưa có danh mục"}
        </p>
        <p className="item-price">{formatCurrency(item.price)}/ngày</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => updateQuantity(index, item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-50"
        >
          -
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(index, item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-50"
        >
          +
        </button>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-medium">
          {formatCurrency(item.price * item.quantity)}
        </span>
        <motion.button
          whileHover={{ scale: 1.2 }}
          onClick={() => removeItem(index)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <FontAwesomeIcon icon={faTrash} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CartCard;
