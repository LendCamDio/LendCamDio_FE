import type { ImageDialogProps } from "@/types/ui/ui.type";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useCallback, useState } from "react";
import { Dialog } from "./Dialog";

export const ImageDialog = ({
  imageUrl,
  imagesUrl,
  alt = "Image",
  className,
  isOpen = false,
  onClose = () => {},
}: ImageDialogProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleThumbsSwiperInit = useCallback((swiper: SwiperType) => {
    setThumbsSwiper(swiper);
  }, []);

  const handleThumbnailClick = useCallback(
    (index: number) => {
      mainSwiper?.slideTo(index);
      setCurrentImageIndex(index);
    },
    [mainSwiper]
  );

  // If we have an array of images, use the first one as the default
  const singleImageUrl = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
  // Use imagesUrl if provided, otherwise convert single imageUrl to array
  const images =
    Array.isArray(imagesUrl) && imagesUrl.length > 0
      ? imagesUrl
      : singleImageUrl
      ? [singleImageUrl]
      : [];

  return (
    <>
      {/* Clickable image thumbnail */}
      {!isOpen && (
        <img
          src={singleImageUrl}
          alt={alt}
          className={className}
          onClick={() => onClose()}
          style={{ cursor: "pointer" }}
        />
      )}

      {/* Image Dialog */}
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        position="center"
        contentClassName="max-w-5xl max-h-[90vh] bg-white p-4 rounded-md"
        showCloseButton={true}
      >
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-lg font-bold mb-3">{alt}</h2>

          {/* Main image swiper */}
          {images.length > 0 && (
            <div className="mb-4 w-full">
              <Swiper
                onSwiper={setMainSwiper}
                modules={[Navigation, Thumbs]}
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper }}
                onSlideChange={(swiper) =>
                  setCurrentImageIndex(swiper.activeIndex)
                }
                className="rounded-md overflow-hidden"
              >
                {images.map((image: string, index: number) => (
                  <SwiperSlide key={`main-slide-${index}-${image}`}>
                    <img
                      src={image}
                      alt={`${alt} ${index + 1}`}
                      className="max-h-[80vh] w-auto mx-auto"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {/* Thumbnail navigation */}
          {images.length > 1 && (
            <div className="w-full max-w-3xl mx-auto mt-4">
              <Swiper
                key="thumbs-swiper"
                onSwiper={handleThumbsSwiperInit}
                modules={[Navigation, Thumbs]}
                slidesPerView={4}
                navigation
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
                      alt={`${alt} thumb ${index}`}
                      onClick={() => handleThumbnailClick(index)}
                      className={`transition-all duration-200 cursor-pointer h-16 object-cover ${
                        currentImageIndex === index
                          ? "border-2 border-blue-500"
                          : "border border-gray-300 hover:border-gray-400"
                      }`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};
