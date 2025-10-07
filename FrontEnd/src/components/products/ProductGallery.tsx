import { useState, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { ImageDialog } from "@/components/ui/Dialog";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  categoryName: string;
}

export const ProductGallery = ({
  images,
  productName,
  categoryName,
}: ProductGalleryProps) => {
  const [isImgDialogOpen, setIsImgDialogOpen] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleMainSwiperInit = useCallback((swiper: SwiperType) => {
    setMainSwiper(swiper);
  }, []);

  const handleThumbsSwiperInit = useCallback((swiper: SwiperType) => {
    setThumbsSwiper(swiper);
  }, []);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setCurrentImageIndex(swiper.activeIndex);
  }, []);

  const handleThumbnailClick = useCallback(
    (index: number) => {
      mainSwiper?.slideTo(index);
      setCurrentImageIndex(index);
    },
    [mainSwiper]
  );

  const thumbsConfig = useMemo(
    () => ({
      swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
    }),
    [thumbsSwiper]
  );

  return (
    <div className="product-detail-gallery col-md-5">
      <div
        className="product-detail-thumbnail"
        onClick={() => setIsImgDialogOpen(true)}
      >
        <ImageDialog
          className="opacity-0"
          isOpen={isImgDialogOpen}
          onClose={() => setIsImgDialogOpen(false)}
          imageUrl={images[currentImageIndex]}
          alt={productName}
        />
        <Swiper
          onSwiper={handleMainSwiperInit}
          modules={[Navigation, Thumbs]}
          spaceBetween={10}
          thumbs={thumbsConfig}
          onSlideChange={handleSlideChange}
          className="rounded-md overflow-hidden"
          watchSlidesProgress={false}
          allowTouchMove={true}
        >
          {images.map((image: string, index: number) => (
            <SwiperSlide key={`main-slide-${index}`}>
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                onClick={() => setIsImgDialogOpen(true)}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <span
          className={`product-detail-thumbnail-badge ${categoryName.toLowerCase()}`}
        >
          <FontAwesomeIcon icon={faCamera} className="me-2" />
          {categoryName}
        </span>
      </div>

      {/* Thumbnail navigation */}
      <div className="product-detail-thumbnails-imgs mt-30">
        <Swiper
          key="thumbs-swiper"
          onSwiper={handleThumbsSwiperInit}
          modules={[Navigation, Thumbs]}
          slidesPerView={4}
          navigation={true}
          watchSlidesProgress={true}
          breakpoints={{
            320: { slidesPerView: 3 },
            640: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
          className="thumbs-swiper"
        >
          {images.map((image: string, index: number) => (
            <SwiperSlide key={`thumb-slide-${index}`}>
              <img
                src={image}
                alt={`${productName} thumb ${index}`}
                onClick={() => handleThumbnailClick(index)}
                className={`transition-all duration-200 cursor-pointer ${
                  currentImageIndex === index
                    ? "active border-2 border-blue-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
