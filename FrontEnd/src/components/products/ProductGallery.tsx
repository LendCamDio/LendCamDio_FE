import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { ImageDialog } from "@/components/ui/Dialog";
import defPic from "@/assets/defaultPic1.jpg";

interface ProductGalleryProps {
  images?: string[];
  categoryName?: string;
  productName?: string;
}

export const ProductGallery = ({
  images = [],
  categoryName,
  productName,
}: ProductGalleryProps) => {
  const [isImgDialogOpen, setIsImgDialogOpen] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const safeImages = images.length > 0 ? images : Array(5).fill(defPic);

  // Badge gradient theo category
  const badgeGradient = (() => {
    const map: Record<string, string> = {
      Camera: "from-blue-500 to-indigo-600",
      "Ống kính": "from-purple-500 to-pink-500",
      Lens: "from-purple-400 to-violet-600",
      Studio: "from-rose-400 to-red-500",
    };
    return map[categoryName ?? ""] || "from-gray-500 to-gray-700";
  })();

  return (
    <div className="w-full lg:w-full md:w-1/2 space-y-4">
      <div className="hidden">
        {/* Image Dialog */}
        <ImageDialog
          isOpen={isImgDialogOpen}
          onClose={() => setIsImgDialogOpen(false)}
          imageUrl={safeImages[currentImageIndex]}
          alt={productName}
        />
      </div>

      {/* Main Swiper */}
      <div
        className="relative rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer"
        onClick={() => setIsImgDialogOpen(true)}
      >
        <Swiper
          onSwiper={setMainSwiper}
          modules={[Navigation, Thumbs]}
          spaceBetween={10}
          thumbs={{ swiper: thumbsSwiper }}
          onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
          className="rounded-lg"
        >
          {safeImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`${productName || "Ảnh sản phẩm"} ${index + 1}`}
                className="object-cover w-full h-[400px] sm:h-[500px]"
                onError={(e) => ((e.target as HTMLImageElement).src = defPic)}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Category Badge */}
        {categoryName && (
          <span
            className={`
              absolute top-3 left-3 z-10 
              text-white text-xs font-semibold 
              px-3 py-1 rounded-full 
              bg-gradient-to-r ${badgeGradient}`}
          >
            <FontAwesomeIcon icon={faCamera} className="mr-1" />
            {categoryName}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      <Swiper
        onSwiper={setThumbsSwiper}
        modules={[Navigation, Thumbs]}
        slidesPerView={5}
        spaceBetween={10}
        watchSlidesProgress
        navigation
        breakpoints={{
          320: { slidesPerView: 3 },
          640: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
        className="mt-2"
      >
        {safeImages.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`${productName || "thumb"} ${index}`}
              onClick={() => {
                mainSwiper?.slideTo(index);
                setCurrentImageIndex(index);
              }}
              className={`cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                currentImageIndex === index
                  ? "border-blue-500"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onError={(e) => ((e.target as HTMLImageElement).src = defPic)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
