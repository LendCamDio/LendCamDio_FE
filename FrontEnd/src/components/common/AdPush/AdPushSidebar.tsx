import { useEffect, useState } from "react";
import {
  getActiveAdsByPosition,
  trackAdView,
  trackAdClick,
} from "@/services/adCampaign.service";
import type { AdCampaignPublic } from "@/types/adCampaign.type";
import { AdPosition } from "@/types/adCampaign.type";

const AdPushSidebar = () => {
  const [ads, setAds] = useState<AdCampaignPublic[]>([]);
  const [trackedViews, setTrackedViews] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    // Track views for all visible ads
    ads.forEach((ad) => {
      if (!trackedViews.has(ad.campaignId)) {
        trackView(ad.campaignId);
        setTrackedViews((prev) => new Set(prev).add(ad.campaignId));
      }
    });
  }, [ads]);

  const fetchAds = async () => {
    try {
      const response = await getActiveAdsByPosition(AdPosition.SidebarFeatured);
      if (response.success && response.data) {
        setAds(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch sidebar ads:", error);
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

  return (
    <div className="ad-push-sidebar d-none d-lg-block">
      <div className="sticky-top" style={{ top: "100px", zIndex: 90 }}>
        <h5 className="text-uppercase fw-bold text-muted small mb-3 px-2">
          Sponsored
        </h5>
        <div className="d-flex flex-column gap-3">
          {ads.map((ad) => (
            <div
              key={ad.campaignId}
              onClick={() => handleClick(ad)}
              className="text-decoration-none text-dark group"
              style={{ cursor: "pointer" }}
            >
              <div className="card border-0 shadow-sm overflow-hidden hover:shadow-md transition-all">
                <div className="position-relative">
                  {ad.imageUrl ? (
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="card-img-top object-cover group-hover:scale-105 transition-transform duration-300"
                      style={{ height: "150px", objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
                      }}
                    />
                  ) : (
                    <div
                      className="bg-gradient-to-br from-blue-500 to-purple-500 d-flex align-items-center justify-content-center"
                      style={{ height: "150px" }}
                    >
                      <div className="text-white text-center p-3">
                        <h6 className="fw-bold mb-1">{ad.title}</h6>
                        {ad.description && (
                          <p className="small mb-0 opacity-90 line-clamp-2">
                            {ad.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  <span className="badge bg-light text-dark position-absolute top-2 end-2 small opacity-75">
                    Ad
                  </span>
                </div>
                <div className="card-body p-3">
                  <h6 className="card-title small fw-bold mb-1 line-clamp-2">
                    {ad.title}
                  </h6>
                  {ad.companyName && (
                    <p className="card-text text-primary small mb-0">
                      {ad.companyName}
                    </p>
                  )}
                  {ad.description && ad.imageUrl && (
                    <p className="card-text text-muted small mb-0 mt-1 line-clamp-2">
                      {ad.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdPushSidebar;
