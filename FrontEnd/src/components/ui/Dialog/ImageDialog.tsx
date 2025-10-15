import type { ImageDialogProps } from "@/types/ui.type";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import {
  useCallback,
  // useMemo,
  useState,
} from "react";

export const ImageDialog = ({
  imageUrl,
  imagesUrl,
  alt,
  className,
  isOpen,
  onClose,
}: ImageDialogProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose?.();
  };

  // const handleMainSwiperInit = useCallback((swiper: SwiperType) => {
  //   setMainSwiper(swiper);
  // }, []);

  const handleThumbsSwiperInit = useCallback((swiper: SwiperType) => {
    setThumbsSwiper(swiper);
  }, []);

  // const handleSlideChange = useCallback((swiper: SwiperType) => {
  //   setCurrentImageIndex(swiper.activeIndex);
  // }, []);

  const handleThumbnailClick = useCallback(
    (index: number) => {
      mainSwiper?.slideTo(index);
      setCurrentImageIndex(index);
    },
    [mainSwiper]
  );

  // const thumbsConfig = useMemo(
  //   () => ({
  //     swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
  //   }),
  //   [thumbsSwiper]
  // );

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <img src={imageUrl?.[0]} alt={alt} className={className} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-400 opacity-50" />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 
                -translate-x-1/2 -translate-y-1/2 
                max-w-6xl max-h-[95vh] 
                bg-amber-50
                p-2 rounded-sm shadow-lg"
          >
            <Dialog.Close asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click from propagating to the overlay
                  onClose?.();
                }}
                aria-label="Close image preview"
                className="absolute top-1.8 right-2.5 opacity-70
                    text-[var(--text-light)] transition duration-100
                    hover:text-[var(--text-dark)] hover:scale-105
                    w-fit text-xl font-bold"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </Dialog.Close>
            <Dialog.Title className="flex flex-col items-center justify-center">
              <h2 className="text-lg font-bold">{alt}</h2>
              {Array.isArray(imagesUrl) && imagesUrl.length > 0 ? (
                <div className="mb-2">
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
                    {imagesUrl.map((image: string, index: number) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image}
                          alt={`${alt} ${index + 1}`}
                          className="max-h-[80vh] w-auto mx-auto"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ) : (
                <div className="mb-2">
                  <img
                    src={imageUrl}
                    alt={alt}
                    className="max-h-[80vh] w-auto mx-auto"
                  />
                </div>
              )}
            </Dialog.Title>
            <Dialog.Description className="">
              {/* Thumbnail navigation */}
              {Array.isArray(imagesUrl) && imagesUrl.length > 0 ? (
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
                  {imagesUrl.map((image: string, index: number) => (
                    <SwiperSlide key={`thumb-slide-${index}`}>
                      <img
                        src={image}
                        alt={`${alt} thumb ${index}`}
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
              ) : (
                <div>
                  <p>No additional images available.</p>
                </div>
              )}
            </Dialog.Description>
          </Dialog.Content>
        </motion.div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
