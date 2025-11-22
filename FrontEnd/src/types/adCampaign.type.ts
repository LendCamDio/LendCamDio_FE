import type { ApiResponse, PaginatedData } from "./entity.type";

// Ad Campaign Types
export enum AdPackageType {
  FastAdPush = 0,
  FastAdPushUpgrade = 1,
}

export enum AdPosition {
  HomePageTop = 0,
  SidebarFeatured = 1,
  CategoryPageTop = 2,
}

export enum AdCampaignStatus {
  PendingApproval = 0,
  Active = 1,
  Paused = 2,
  Completed = 3,
  Rejected = 4,
  Expired = 5,
}

export type AdPackage = {
  packageId: string;
  name: string;
  description: string;
  type: AdPackageType;
  typeName: string;
  price: number;
  durationDays: number;
  position: AdPosition;
  positionName: string;
  maxAdsPerDay: number;
  isActive: boolean;
  createdAt: string;
};

export type AdCampaign = {
  campaignId: string;
  supplierId: string;
  supplierName?: string;
  companyName?: string;
  packageId: string;
  packageName?: string;
  packageType: AdPackageType;
  title: string;
  description?: string;
  targetUrl: string;
  imageUrl?: string;
  status: AdCampaignStatus;
  statusName: string;
  startDate: string;
  endDate: string;
  priority: number;
  viewCount: number;
  clickCount: number;
  amountPaid: number;
  paidAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
};

export type AdCampaignPublic = {
  campaignId: string;
  title: string;
  description?: string;
  targetUrl: string;
  imageUrl?: string;
  companyName?: string;
};

export type PurchaseAdPackageRequest = {
  packageId: string;
  title: string;
  description?: string;
  targetUrl: string;
  imageUrl?: string;
  paymentMethod: "VNPay" | "PayOS";
};

export type UpdateAdCampaignRequest = {
  title?: string;
  description?: string;
  targetUrl?: string;
  imageUrl?: string;
};

export type ApproveAdCampaignRequest = {
  approved: boolean;
  rejectionReason?: string;
  priority?: number;
};

export type AdPackageResponse = ApiResponse<PaginatedData<AdPackage>>;
export type AdCampaignResponse = ApiResponse<PaginatedData<AdCampaign>>;
export type AdCampaignPublicResponse = ApiResponse<PaginatedData<AdCampaignPublic>>;
export type SingleAdCampaignResponse = ApiResponse<AdCampaign>;
