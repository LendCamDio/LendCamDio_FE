import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import {
  getAllCampaigns,
  getPendingCampaigns,
  approveCampaign,
} from "@/services/adCampaign.service";
import type { AdCampaign, ApproveAdCampaignRequest } from "@/types/adCampaign.type";
import { AdCampaignStatus, AdPackageType } from "@/types/adCampaign.type";
import { toast } from "sonner";
/* icons removed to avoid unused imports */

type FilterType = "all" | "pending" | "active" | "rejected" | "expired";
type PackageTypeFilter = "all" | "fastAdPush" | "fastAdPushUpgrade";
type SortOrder = "asc" | "desc";

export default function AdManagement() {
  const { token } = useAuth();
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterType>("all");
  const [filterPackageType, setFilterPackageType] =
    useState<PackageTypeFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Approval modal state
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(
    null
  );
  const [approvalData, setApprovalData] = useState<ApproveAdCampaignRequest>({
    approved: true,
    priority: 1,
    rejectionReason: "",
  });

  useEffect(() => {
    fetchCampaigns();
  }, [filterStatus]);

  const fetchCampaigns = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response =
        filterStatus === "pending"
          ? await getPendingCampaigns(token)
          : await getAllCampaigns(token);

      if (response.success && response.data) {
        setCampaigns(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (campaign: AdCampaign, approved: boolean) => {
    setSelectedCampaign(campaign);
    setApprovalData({
      approved,
      priority: approved ? 1 : undefined,
      rejectionReason: "",
    });
    setApprovalModalOpen(true);
  };

  const submitApproval = async () => {
    if (!selectedCampaign || !token) return;

    try {
      const response = await approveCampaign(
        selectedCampaign.campaignId,
        approvalData,
        token
      );

      if (response.success) {
        toast.success(
          approvalData.approved
            ? "Campaign approved successfully"
            : "Campaign rejected"
        );
        setApprovalModalOpen(false);
        fetchCampaigns();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update campaign");
    }
  };

  // status rendering uses campaign.statusName when available; fallback to enum name

  const filteredCampaigns = campaigns
    .filter((c) => {
      if (filterStatus !== "all" && filterStatus !== "pending") {
        const statusMap: Record<FilterType, AdCampaignStatus | null> = {
          all: null,
          pending: AdCampaignStatus.PendingApproval,
          active: AdCampaignStatus.Active,
          rejected: AdCampaignStatus.Rejected,
          expired: AdCampaignStatus.Expired,
        };
        if (statusMap[filterStatus] !== null && c.status !== statusMap[filterStatus])
          return false;
      }
      if (filterPackageType !== "all") {
        if (
          filterPackageType === "fastAdPush" &&
          c.packageType !== AdPackageType.FastAdPush
        )
          return false;
        if (
          filterPackageType === "fastAdPushUpgrade" &&
          c.packageType !== AdPackageType.FastAdPushUpgrade
        )
          return false;
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Ad Campaign Management</h3>
          <p className="card-subtitle">Manage and approve ad campaigns from suppliers</p>
        </div>

        <div className="card-body">
          {/* Filters using basic HTML controls to avoid missing ui package imports */}
          <div className="flex gap-4 mb-4">
                <div>
                  <label className="form-label">Status</label>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as FilterType)} className="form-select">
                <option value="all">All</option>
                <option value="pending">Pending Approval</option>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="form-label">Package</label>
              <select value={filterPackageType} onChange={(e) => setFilterPackageType(e.target.value as PackageTypeFilter)} className="form-select">
                <option value="all">All</option>
                <option value="fastAdPush">Fast Ad Push</option>
                <option value="fastAdPushUpgrade">Fast Ad Push Upgrade</option>
              </select>
            </div>

            <div className="ml-auto">
              <button className="btn btn-outline" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>{sortOrder === "asc" ? "Oldest First" : "Newest First"}</button>
            </div>
          </div>

          {/* Campaign list */}
          {loading ? (
            <div>Loading campaigns...</div>
          ) : filteredCampaigns.length === 0 ? (
            <div>No campaigns found</div>
          ) : (
            <table className="table table-hover w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Supplier</th>
                  <th>Package</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Duration</th>
                  <th>Analytics</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.campaignId}>
                    <td>{campaign.title}</td>
                    <td>
                      <div>{campaign.companyName}</div>
                      <div className="text-xs text-muted">{campaign.supplierName}</div>
                    </td>
                    <td>{campaign.packageName}</td>
                    <td>{campaign.statusName}</td>
                    <td>{new Date(campaign.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div>{new Date(campaign.startDate).toLocaleDateString()}</div>
                      <div className="text-muted">to {new Date(campaign.endDate).toLocaleDateString()}</div>
                    </td>
                    <td>
                      <div>👁️ {campaign.viewCount}</div>
                      <div>🖱️ {campaign.clickCount}</div>
                    </td>
                    <td>
                      <button onClick={() => handleApprove(campaign, true)} className="btn btn-ghost">View</button>
                      {campaign.status === (AdCampaignStatus as any).PendingApproval && (
                        <>
                          <button onClick={() => handleApprove(campaign, true)} className="btn btn-success">Approve</button>
                          <button onClick={() => handleApprove(campaign, false)} className="btn btn-danger">Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Approval modal (simple bootstrap-like modal) */}
      {approvalModalOpen && selectedCampaign && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{approvalData.approved ? "Approve" : "Reject"} Campaign</h5>
                <button className="btn-close" onClick={() => setApprovalModalOpen(false)} />
              </div>
              <div className="modal-body">
                <p><strong>Campaign:</strong> {selectedCampaign.title}</p>
                <p><strong>Supplier:</strong> {selectedCampaign.companyName}</p>

                {approvalData.approved ? (
                  <div>
                    <label className="form-label">Priority</label>
                    <input type="number" min={1} className="form-control" value={approvalData.priority} onChange={(e) => setApprovalData({ ...approvalData, priority: parseInt(e.target.value) || 1 })} />
                  </div>
                ) : (
                  <div>
                    <label className="form-label">Rejection Reason</label>
                    <textarea className="form-control" rows={3} value={approvalData.rejectionReason} onChange={(e) => setApprovalData({ ...approvalData, rejectionReason: e.target.value })} />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setApprovalModalOpen(false)}>Cancel</button>
                <button className={`btn ${approvalData.approved ? "btn-success" : "btn-danger"}`} onClick={submitApproval}>{approvalData.approved ? "Approve" : "Reject"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
