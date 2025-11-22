import axios from "axios";
import type {
  AdCampaign,
  AdCampaignPublic,
  AdPackage,
  ApproveAdCampaignRequest,
  PurchaseAdPackageRequest,
  UpdateAdCampaignRequest,
} from "@/types/adCampaign.type";
import { AdPosition } from "@/types/adCampaign.type";
import type { ApiResponse } from "@/types/entity.type";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Public endpoints
export const getAdPackages = async (): Promise<ApiResponse<AdPackage[]>> => {
  const response = await axios.get(`${API_URL}/api/ad-campaigns/packages`);
  return response.data;
};

export const getActiveAdsByPosition = async (
  position: AdPosition
): Promise<ApiResponse<AdCampaignPublic[]>> => {
  const response = await axios.get(
    `${API_URL}/api/ad-campaigns/active/${position}`
  );
  return response.data;
};

export const trackAdView = async (
  campaignId: string
): Promise<ApiResponse<null>> => {
  const response = await axios.post(
    `${API_URL}/api/ad-campaigns/${campaignId}/view`
  );
  return response.data;
};

export const trackAdClick = async (
  campaignId: string
): Promise<ApiResponse<null>> => {
  const response = await axios.post(
    `${API_URL}/api/ad-campaigns/${campaignId}/click`
  );
  return response.data;
};

// Supplier endpoints
export const purchaseAdPackage = async (
  data: PurchaseAdPackageRequest,
  token: string
): Promise<ApiResponse<AdCampaign>> => {
  const response = await axios.post(
    `${API_URL}/api/ad-campaigns/purchase`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getSupplierCampaigns = async (
  token: string
): Promise<ApiResponse<AdCampaign[]>> => {
  const response = await axios.get(`${API_URL}/api/ad-campaigns/my-campaigns`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCampaignById = async (
  campaignId: string,
  token: string
): Promise<ApiResponse<AdCampaign>> => {
  const response = await axios.get(
    `${API_URL}/api/ad-campaigns/${campaignId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const updateCampaign = async (
  campaignId: string,
  data: UpdateAdCampaignRequest,
  token: string
): Promise<ApiResponse<AdCampaign>> => {
  const response = await axios.put(
    `${API_URL}/api/ad-campaigns/${campaignId}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const deleteCampaign = async (
  campaignId: string,
  token: string
): Promise<ApiResponse<null>> => {
  const response = await axios.delete(
    `${API_URL}/api/ad-campaigns/${campaignId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Admin endpoints
export const getAllCampaigns = async (
  token: string
): Promise<ApiResponse<AdCampaign[]>> => {
  const response = await axios.get(`${API_URL}/api/ad-campaigns/admin/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getPendingCampaigns = async (
  token: string
): Promise<ApiResponse<AdCampaign[]>> => {
  const response = await axios.get(
    `${API_URL}/api/ad-campaigns/admin/pending`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const approveCampaign = async (
  campaignId: string,
  data: ApproveAdCampaignRequest,
  token: string
): Promise<ApiResponse<AdCampaign>> => {
  const response = await axios.post(
    `${API_URL}/api/ad-campaigns/admin/${campaignId}/approve`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
