import AdBanner from "./AdBanner";
import { AdPosition } from "@/types/adCampaign.type";

export function HomeTopAdBanner() {
  return (
    <AdBanner
      position={AdPosition.HomePageTop}
      className="w-full aspect-[16/4] max-h-64 mb-6"
      showCloseButton={true}
    />
  );
}

export function SidebarAdBanner() {
  return (
    <div className="sticky top-4">
      <AdBanner
        position={AdPosition.SidebarFeatured}
        className="w-full aspect-square max-w-sm"
        showCloseButton={true}
      />
    </div>
  );
}

export function CategoryTopAdBanner() {
  return (
    <AdBanner
      position={AdPosition.CategoryPageTop}
      className="w-full aspect-[16/4] max-h-64 mb-6"
      showCloseButton={true}
    />
  );
}
