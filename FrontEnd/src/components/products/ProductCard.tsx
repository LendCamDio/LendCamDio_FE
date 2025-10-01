import type { Equipment } from "@/types/entity.type";
import { useNavigate } from "react-router-dom";
import { Rating } from "../common/Rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useUniqueToast } from "@/hooks/useUniqueToast";

const categories = (key: string) => {
  switch (key) {
    case "Cameras":
      return "camera";
    case "Lenses":
      return "Ống kính";
    case "accessory":
      return "Phụ kiện";
    default:
      return key;
  }
};

const ProductCard = ({ equipment }: { equipment: Equipment | null }) => {
  const navigate = useNavigate();
  const showToast = useUniqueToast();
  if (!equipment) return null;

  const handleViewDetails = () => {
    // Navigate to product details page
    showToast("Chức năng đang phát triển", "info", { allowSpam: false });
  };
  const handleAddToFavorites = () => {
    // Add to favorites logic here
    showToast("Chức năng đang phát triển", "info");
  };

  // #region Temporary hardcoded data for demonstration
  // equipment = {
  //   equipmentId: "88888888-8888-8888-8888-888888888888",
  //   supplierId: "d4444444-4444-4444-4444-444444444444",
  //   supplierName: "Pro Studio Rentals",
  //   categoryId: "e5555555-5555-5555-5555-555555555555",
  //   categoryName: "lens",
  //   name: "Canon EOS R5",
  //   description: "High-end mirrorless camera",
  //   stockQuantity: 1,
  //   dailyPrice: 100,
  //   depositAmount: 500,
  //   insuranceRequired: true,
  //   condition: 0,
  //   availability: true,
  //   status: 0,
  //   createdAt: "2025-09-23T03:57:11",
  //   images: [
  //     {
  //       imageId: "99999999-9999-9999-9999-999999999999",
  //       equipmentId: "88888888-8888-8888-8888-888888888888",
  //       imageUrl:
  //         "https://images.pexels.com/photos/10322823/pexels-photo-10322823.jpeg",
  //       type: 0,
  //       isPrimary: true,
  //       status: 0,
  //       createdAt: "2025-09-23T03:57:11",
  //     },
  //   ],
  //   rating: [
  //     {
  //       equipmentId: "88888888-8888-8888-8888-888888888888",
  //       averageRating: 4.8,
  //     },
  //   ],
  // };
  // #endregion

  return (
    <div
      className="product-card"
      data-category={equipment.categoryName}
      data-name={equipment.name}
      data-price={equipment.dailyPrice}
    >
      <div className="product-image">
        <img src={equipment.images?.[0].imageUrl} alt="Studio Modern A" />
        {equipment.categoryName && (
          <div
            className={`product-badge ${categories(
              equipment.categoryName
            ).toLowerCase()}`}
          >
            {categories(equipment.categoryName)}
          </div>
        )}
        <div className="product-actions">
          <button
            className="action-btn"
            title="Xem chi tiết"
            onClick={handleViewDetails}
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            className="action-btn"
            title="Yêu thích"
            onClick={handleAddToFavorites}
          >
            <FontAwesomeIcon icon={faHeart} />
          </button>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-title">{equipment.name}</h3>
        <p className="product-description">{equipment.description}</p>
        <div className="product-rating">
          <Rating
            value={equipment.rating ? equipment.rating[0].averageRating : 0}
          />
        </div>
        <div className="product-price">
          {equipment.dailyPrice.toLocaleString()}đ/ngày
        </div>
        <button
          className="btn-primary product-btn"
          onClick={() => navigate("/studios")}
        >
          Đặt lịch ngay
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
