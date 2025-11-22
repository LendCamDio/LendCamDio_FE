import { useEffect, useState } from "react";
import {
  getActiveAdsByPosition,
  trackAdView,
  trackAdClick,
} from "@/services/adCampaign.service";
import type { AdCampaignPublic } from "@/types/adCampaign.type";
import { AdPosition } from "@/types/adCampaign.type";
import { X } from "lucide-react";

type AdBannerProps = {
  position: AdPosition;
  className?: string;
  showCloseButton?: boolean;
};

export default function AdBanner({
  position,
  className = "",
  showCloseButton = false,
}: AdBannerProps) {
  const [ads, setAds] = useState<AdCampaignPublic[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [viewTracked, setViewTracked] = useState(false);

  useEffect(() => {
    fetchAds();
  }, [position]);

  useEffect(() => {
    if (ads.length > 0 && !viewTracked) {
      trackView(ads[currentAdIndex].campaignId);
      setViewTracked(true);
    }
  }, [ads, currentAdIndex]);

  // Auto-rotate ads every 10 seconds if multiple ads
  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => {
        const nextIndex = (prev + 1) % ads.length;
        setViewTracked(false); // Reset to track view for next ad
        return nextIndex;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [ads]);

  const fetchAds = async () => {
    try {
      const response = await getActiveAdsByPosition(position);
      if (response.success && response.data) {
        setAds(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    }
  };

  const trackView = async (campaignId: string) => {
    try {
      await trackAdView(campaignId);
    } catch (error) {
      console.error("Failed to track ad view:", error);
    }
  };

  const handleClick = async (ad: AdCampaignPublic) => {
    try {
      await trackAdClick(ad.campaignId);
      window.open(ad.targetUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Failed to track ad click:", error);
      // Still open the link even if tracking fails
      window.open(ad.targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || ads.length === 0) return null;

  const currentAd = ads[currentAdIndex];

  return (
    <div className={`relative ${className}`}>
      {showCloseButton && (
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
          aria-label="Close ad"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div
        onClick={() => handleClick(currentAd)}
        className="cursor-pointer group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
      >
        {currentAd.imageUrl ? (
          <div className="relative">
            <img
              src={currentAd.imageUrl}
              alt={currentAd.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-ad.png";
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-white font-semibold text-lg">
                {currentAd.title}
              </h3>
              {currentAd.companyName && (
                <p className="text-white/80 text-sm">{currentAd.companyName}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white">
            <h3 className="font-bold text-xl mb-2">{currentAd.title}</h3>
            {currentAd.description && (
              <p className="text-sm opacity-90 line-clamp-2">
                {currentAd.description}
              </p>
            )}
            {currentAd.companyName && (
              <p className="text-sm mt-2 opacity-75">{currentAd.companyName}</p>
            )}
          </div>
        )}
      </div>

      {/* Ad indicator dots */}
      {ads.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentAdIndex(index);
                setViewTracked(false);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentAdIndex
                  ? "bg-blue-600 w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`View ad ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Sponsored label */}
      <div className="text-xs text-gray-500 text-center mt-1">Sponsored</div>
    </div>
  );
}
