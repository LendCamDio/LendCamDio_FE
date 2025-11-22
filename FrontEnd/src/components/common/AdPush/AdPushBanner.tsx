import { useEffect, useState } from "react";
import {
  getActiveAdsByPosition,
  trackAdView,
  trackAdClick,
} from "@/services/adCampaign.service";
import type { AdCampaignPublic } from "@/types/adCampaign.type";
import { AdPosition } from "@/types/adCampaign.type";

const AdPushBanner = () => {
  const [ads, setAds] = useState<AdCampaignPublic[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [viewTracked, setViewTracked] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

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
        setViewTracked(false);
        return nextIndex;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [ads]);

  const fetchAds = async () => {
    try {
      const response = await getActiveAdsByPosition(AdPosition.HomePageTop);
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
      window.open(ad.targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (ads.length === 0) return null;

  const currentAd = ads[currentAdIndex];

  return (
    <div className="ad-push-banner container mt-4 mb-4">
      <div className="row">
        <div className="col-12">
          <div
            onClick={() => handleClick(currentAd)}
            className="position-relative rounded overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
            style={{ cursor: "pointer" }}
          >
            {currentAd.imageUrl ? (
              <img
                src={currentAd.imageUrl}
                alt={currentAd.title}
                className="w-100 object-cover group-hover:scale-105 transition-transform duration-300"
                style={{ height: "250px", objectFit: "cover" }}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
                }}
              />
            ) : (
              <div
                className="w-100 d-flex align-items-center justify-content-center bg-gradient-to-br from-blue-600 to-purple-600"
                style={{ height: "250px" }}
              >
                <div className="text-white text-center p-4">
                  <h2 className="h3 mb-2">{currentAd.title}</h2>
                  {currentAd.description && (
                    <p className="opacity-90">{currentAd.description}</p>
                  )}
                </div>
              </div>
            )}
            <div className="position-absolute bottom-0 start-0 w-100 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
              <h3 className="h5 mb-1 fw-bold">{currentAd.title}</h3>
              {currentAd.description && (
                <p className="small mb-0 opacity-90 line-clamp-2">
                  {currentAd.description}
                </p>
              )}
              {currentAd.companyName && (
                <p className="small mb-0 mt-2 opacity-75">
                  {currentAd.companyName}
                </p>
              )}
            </div>
            <span className="badge bg-warning text-dark position-absolute top-3 end-3">
              Sponsored
            </span>
          </div>

          {/* Ad indicator dots */}
          {ads.length > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-3">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentAdIndex(index);
                    setViewTracked(false);
                  }}
                  className={`rounded-circle border-0 transition-all ${
                    index === currentAdIndex
                      ? "bg-primary"
                      : "bg-secondary opacity-50"
                  }`}
                  style={{
                    width: index === currentAdIndex ? "24px" : "8px",
                    height: "8px",
                    cursor: "pointer",
                  }}
                  aria-label={`View ad ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdPushBanner;
