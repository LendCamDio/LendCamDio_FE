import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { ImageDialog } from "@/components/ui/Dialog";
import { useLoaderData } from "react-router-dom";
import type { Equipment } from "@/types/index.type";

interface ProductGalleryProps {
  images: string[] | undefined;
}

// Extended type for our component with additional properties
type ExtendedEquipment = Equipment & {
  images?: string[];
  specifications?: Record<string, string>;
};

export const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [isImgDialogOpen, setIsImgDialogOpen] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // console.group("ProductGallery images:", images);
  // console.log("ProductGallery productName:", productName);
  // console.log("ProductGallery categoryName:", categoryName);

  // Dùng data từ loader
  const mockProduct: Equipment = useLoaderData();

  // Mô phỏng dữ liệu chi tiết sản phẩm với hình ảnh và thông số kỹ thuật
  const extendedMockProduct: ExtendedEquipment = {
    ...mockProduct,
    images: [
      ...(images || []),
      "/src/assets/defaultPic1.jpg",
      "/src/assets/defaultPic1.jpg",
      "/src/assets/defaultPic1.jpg",
      "/src/assets/defaultPic1.jpg",
      "/src/assets/defaultPic1.jpg",
      "/src/assets/defaultPic1.jpg",
      "/src/assets/defaultPic1.jpg",
      "/src/assets/defaultPic1.jpg",
    ],
    specifications: {
      resolution: "45.0 MP",
      sensor: "Full-frame CMOS",
      videoRecording: "8K RAW, 4K 120p",
      mount: "RF Mount",
      weight: "738g",
      battery: "LP-E6NH",
    },
  };

  const [product] = useState<ExtendedEquipment>(extendedMockProduct); // Replace with actual API call

  return (
    <div className="product-detail-gallery col-md-5">
      {/* Product Thumbnail */}
      <div
        className="product-detail-thumbnail"
        onClick={() => setIsImgDialogOpen(true)}
      >
        <ImageDialog
          className="opacity-0"
          isOpen={isImgDialogOpen}
          onClose={() => setIsImgDialogOpen(false)}
          imageUrl={product.images?.[currentImageIndex]}
          alt={product.name}
        />
        <Swiper
          onSwiper={setMainSwiper}
          modules={[Navigation, Thumbs]}
          spaceBetween={10}
          thumbs={{ swiper: thumbsSwiper }}
          onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
          className="rounded-md overflow-hidden"
        >
          {product.images?.map((image: string, index: number) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`${product.name} ${index + 1}`}
                onClick={() => setIsImgDialogOpen(true)}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Product badge */}
        <span
          className={`product-detail-thumbnail-badge ${product.categoryName.toLowerCase()}`}
        >
          <FontAwesomeIcon icon={faCamera} className="me-2" />
          {product.categoryName}
        </span>
      </div>

      {/* Thumbnail navigation */}
      <div className="product-detail-thumbnails-imgs mt-30">
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Navigation, Thumbs]}
          slidesPerView={4}
          navigation
          watchSlidesProgress
          breakpoints={{
            320: { slidesPerView: 3 },
            640: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
        >
          {product &&
            product.images &&
            product.images.map((image: string, index: number) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`${product.name} thumb ${index}`}
                  onClick={() => {
                    mainSwiper?.slideTo(index);
                    setCurrentImageIndex(index);
                  }}
                  className={`transition-all duration-200 ${
                    currentImageIndex === index
                      ? "active"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      {/* Dialog */}
    </div>
  );
};
