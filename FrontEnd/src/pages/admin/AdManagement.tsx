import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { getAllCampaigns, approveCampaign } from "@/services/adCampaign.service";
import type { AdCampaign, ApproveAdCampaignRequest } from "@/types/adCampaign.type";
import { AdCampaignStatus } from "@/types/adCampaign.type";
import { toast } from "sonner";

const AdManagement = () => {
  const { token } = useAuth();
  const [ads, setAds] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState<AdCampaign | null>(null);
  const [approvalData, setApprovalData] = useState<ApproveAdCampaignRequest>({
    approved: true,
    priority: 1,
    rejectionReason: "",
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await getAllCampaigns(token);
      if (response.success && response.data) {
        setAds(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch ads:", error);
      toast.error("Failed to load ad campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (ad: AdCampaign, approved: boolean) => {
    setSelectedAd(ad);
    setApprovalData({
      approved,
      priority: ad.priority || 1,
      rejectionReason: "",
    });
    setShowApproveModal(true);
  };

  const submitApproval = async () => {
    if (!selectedAd || !token) return;

    if (!approvalData.approved && !approvalData.rejectionReason?.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      const response = await approveCampaign(
        selectedAd.campaignId,
        approvalData,
        token
      );
      if (response.success) {
        toast.success(
          approvalData.approved
            ? "Campaign approved successfully"
            : "Campaign rejected"
        );
        setShowApproveModal(false);
        fetchAds();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update campaign");
    }
  };

  const getStatusBadgeClass = (status: AdCampaignStatus) => {
    switch (status) {
      case AdCampaignStatus.Active:
        return "bg-success";
      case AdCampaignStatus.PendingApproval:
        return "bg-warning";
      case AdCampaignStatus.Rejected:
        return "bg-danger";
      case AdCampaignStatus.Expired:
        return "bg-secondary";
      case AdCampaignStatus.Paused:
        return "bg-info";
      case AdCampaignStatus.Completed:
        return "bg-primary";
      default:
        return "bg-secondary";
    }
  };

  const getPackageBadgeClass = (packageName: string) => {
    return packageName.toLowerCase().includes("upgrade")
      ? "bg-purple-100 text-purple-800"
      : "bg-blue-100 text-blue-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const filteredAds = ads.filter((ad) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "pending")
      return ad.status === AdCampaignStatus.PendingApproval;
    if (filterStatus === "active")
      return ad.status === AdCampaignStatus.Active;
    if (filterStatus === "rejected")
      return ad.status === AdCampaignStatus.Rejected;
    return true;
  });

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4 text-2xl fw-bold">Ad Push Management</h2>

      <div className="card shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h5 className="mb-0 fw-bold">Ad Campaign Requests</h5>
            <div className="d-flex gap-2">
              <select
                className="form-select form-select-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Approval</option>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : filteredAds.length === 0 ? (
            <div className="text-center py-5 text-muted">No campaigns found</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4">Supplier</th>
                    <th>Package</th>
                    <th>Campaign</th>
                    <th>Duration</th>
                    <th>Amount</th>
                    <th>Analytics</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAds.map((ad) => (
                    <tr key={ad.campaignId}>
                      <td className="ps-4">
                        <div>
                          <div className="fw-medium">{ad.supplierName}</div>
                          <div className="small text-muted">
                            {ad.companyName}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getPackageBadgeClass(ad.packageName || "")}`}>
                          {ad.packageName}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {ad.imageUrl && (
                            <img
                              src={ad.imageUrl}
                              alt=""
                              className="rounded me-2"
                              width="40"
                              height="40"
                              style={{ objectFit: "cover" }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          )}
                          <div>
                            <div className="fw-medium">{ad.title}</div>
                            {ad.description && (
                              <div className="small text-muted text-truncate" style={{ maxWidth: "200px" }}>
                                {ad.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          <div>{formatDate(ad.startDate)}</div>
                          <div className="text-muted">
                            {formatDate(ad.endDate)}
                          </div>
                        </div>
                      </td>
                      <td className="fw-medium">
                        ${ad.amountPaid.toFixed(2)}
                      </td>
                      <td>
                        <div className="small">
                          <div>👁️ {ad.viewCount} views</div>
                          <div>🖱️ {ad.clickCount} clicks</div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${getStatusBadgeClass(ad.status)}`}
                        >
                          {ad.statusName}
                        </span>
                        {ad.priority && ad.status === AdCampaignStatus.Active && (
                          <div className="small text-muted mt-1">
                            Priority: {ad.priority}
                          </div>
                        )}
                      </td>
                      <td className="text-end pe-4">
                        {ad.status === AdCampaignStatus.PendingApproval && (
                          <>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleApproveClick(ad, true)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleApproveClick(ad, false)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {ad.status === AdCampaignStatus.Active && (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleApproveClick(ad, true)}
                          >
                            Edit Priority
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {showApproveModal && selectedAd && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {approvalData.approved ? "Approve" : "Reject"} Campaign
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowApproveModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <strong>Campaign:</strong> {selectedAd.title}
                </div>
                <div className="mb-3">
                  <strong>Supplier:</strong> {selectedAd.companyName}
                </div>

                {approvalData.approved ? (
                  <div className="mb-3">
                    <label className="form-label">Priority (lower = higher priority)</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={approvalData.priority}
                      onChange={(e) =>
                        setApprovalData({
                          ...approvalData,
                          priority: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                    <div className="form-text">
                      Ads with lower priority numbers appear first
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <label className="form-label">
                      Rejection Reason <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={approvalData.rejectionReason}
                      onChange={(e) =>
                        setApprovalData({
                          ...approvalData,
                          rejectionReason: e.target.value,
                        })
                      }
                      placeholder="Explain why this campaign is being rejected..."
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowApproveModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn ${approvalData.approved ? "btn-success" : "btn-danger"}`}
                  onClick={submitApproval}
                >
                  {approvalData.approved ? "Approve" : "Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdManagement;
