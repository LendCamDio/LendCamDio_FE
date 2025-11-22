import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import {
    getSupplierCampaigns,
    updateCampaign,
    deleteCampaign,
} from "@/services/adCampaign.service";
import type { AdCampaign, UpdateAdCampaignRequest } from "@/types/adCampaign.type";
import { AdCampaignStatus } from "@/types/adCampaign.type";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MyCampaigns = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(null);
    const [editData, setEditData] = useState<UpdateAdCampaignRequest>({
        title: "",
        description: "",
        targetUrl: "",
        imageUrl: "",
    });

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await getSupplierCampaigns(token);
            if (response.success && response.data) {
                setCampaigns(Array.isArray(response.data) ? response.data : []);
            }
        } catch (error) {
            console.error("Failed to fetch campaigns:", error);
            toast.error("Không thể tải danh sách chiến dịch");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (campaign: AdCampaign) => {
        setSelectedCampaign(campaign);
        setEditData({
            title: campaign.title,
            description: campaign.description || "",
            targetUrl: campaign.targetUrl,
            imageUrl: campaign.imageUrl || "",
        });
        setShowEditModal(true);
    };

    const submitEdit = async () => {
        if (!selectedCampaign || !token) return;

        if (!editData.title?.trim() || !editData.targetUrl?.trim()) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        try {
            const response = await updateCampaign(
                selectedCampaign.campaignId,
                editData,
                token
            );
            if (response.success) {
                toast.success("Cập nhật chiến dịch thành công");
                setShowEditModal(false);
                fetchCampaigns();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không thể cập nhật chiến dịch");
        }
    };

    const handleDelete = async (campaignId: string) => {
        if (!token) return;
        if (!confirm("Bạn có chắc chắn muốn xóa chiến dịch này?")) return;

        try {
            const response = await deleteCampaign(campaignId, token);
            if (response.success) {
                toast.success("Đã xóa chiến dịch");
                fetchCampaigns();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không thể xóa chiến dịch");
        }
    };

    const getStatusBadgeStyles = (status: AdCampaignStatus) => {
        switch (status) {
            case AdCampaignStatus.Active:
                return { bg: "bg-green-100", text: "text-green-700", icon: "🟢", label: "Đang chạy" };
            case AdCampaignStatus.PendingApproval:
                return { bg: "bg-yellow-100", text: "text-yellow-700", icon: "⏳", label: "Chờ duyệt" };
            case AdCampaignStatus.Rejected:
                return { bg: "bg-red-100", text: "text-red-700", icon: "🔴", label: "Từ chối" };
            case AdCampaignStatus.Expired:
                return { bg: "bg-gray-100", text: "text-gray-700", icon: "⚫", label: "Hết hạn" };
            case AdCampaignStatus.Paused:
                return { bg: "bg-blue-100", text: "text-blue-700", icon: "⏸️", label: "Tạm dừng" };
            case AdCampaignStatus.Completed:
                return { bg: "bg-purple-100", text: "text-purple-700", icon: "🏁", label: "Hoàn thành" };
            default:
                return { bg: "bg-gray-100", text: "text-gray-700", icon: "⚪", label: "Không xác định" };
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString("vi-VN") + "đ";
    };

    const filteredCampaigns = campaigns.filter((campaign) => {
        if (filterStatus === "all") return true;
        if (filterStatus === "pending")
            return campaign.status === AdCampaignStatus.PendingApproval;
        if (filterStatus === "active")
            return campaign.status === AdCampaignStatus.Active;
        if (filterStatus === "rejected")
            return campaign.status === AdCampaignStatus.Rejected;
        return true;
    });

    const canEdit = (status: AdCampaignStatus) => {
        return (
            status === AdCampaignStatus.PendingApproval ||
            status === AdCampaignStatus.Active
        );
    };

    const canDelete = (status: AdCampaignStatus) => {
        return status === AdCampaignStatus.PendingApproval;
    };

    // Calculate stats
    const stats = {
        total: campaigns.length,
        active: campaigns.filter(c => c.status === AdCampaignStatus.Active).length,
        views: campaigns.reduce((acc, curr) => acc + curr.viewCount, 0),
        clicks: campaigns.reduce((acc, curr) => acc + curr.clickCount, 0),
    };

    return (
        <div className="container-fluid p-4 min-h-screen bg-gray-50/50">
            {/* Header Section */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-4 animate-fade-in-up">
                <div className="d-flex align-items-center gap-3">
                    <div
                        className="d-flex align-items-center justify-content-center rounded-2xl shadow-lg"
                        style={{
                            width: "56px",
                            height: "56px",
                            background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
                        }}
                    >
                        <svg width="28" height="28" fill="white" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.166-.576.296-.59.416-.016.125.234.233.577.271l.932.104c.646.072 1.305.219 1.95.43l.35.114 1.332 3.64c.066.18.128.327.18.433.08.163.176.242.266.245.091.003.19-.076.27-.245.052-.106.114-.253.18-.433l1.332-3.64.35-.115c.645-.21 1.304-.357 1.95-.43l.932-.103c.343-.038.593-.147.577-.272-.014-.12-.212-.25-.59-.416-2.332-1.016-3.888-1.686-4.666-2.01-.378-.157-.63-.157-1.008 0" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="fw-bold mb-1 text-gray-800 text-2xl">Chiến Dịch Của Tôi</h2>
                        <p className="text-muted mb-0">Quản lý và theo dõi hiệu quả quảng cáo</p>
                    </div>
                </div>
                <button
                    className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                    onClick={() => navigate("/supplier/ad-packages")}
                >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                    </svg>
                    Tạo chiến dịch mới
                </button>
            </div>

            {/* Stats Cards */}
            <div className="row mb-5 g-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                {[
                    { label: "Tổng chiến dịch", value: stats.total, icon: "📊", color: "blue" },
                    { label: "Đang hoạt động", value: stats.active, icon: "⚡", color: "green" },
                    { label: "Tổng lượt xem", value: stats.views.toLocaleString(), icon: "👁️", color: "purple" },
                    { label: "Tổng lượt click", value: stats.clicks.toLocaleString(), icon: "🖱️", color: "orange" },
                ].map((stat, index) => (
                    <div key={index} className="col-md-3 col-6">
                        <div className="card border-0 shadow-sm h-100 overflow-hidden hover:shadow-md transition-all">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className={`p-2 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                        <span style={{ fontSize: "1.5rem" }}>{stat.icon}</span>
                                    </div>
                                    <span className={`text-${stat.color}-600 fw-bold bg-${stat.color}-50 px-2 py-1 rounded-lg text-xs`}>
                                        {stat.label === "Đang hoạt động" ? "Active" : "Total"}
                                    </span>
                                </div>
                                <h3 className="fw-bold mb-1 text-gray-800">{stat.value}</h3>
                                <p className="text-muted small mb-0">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="card border-0 shadow-lg rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <div className="card-header bg-white border-b border-gray-100 p-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <h5 className="mb-0 fw-bold text-gray-800">Danh sách chiến dịch</h5>
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-sm text-muted">Lọc theo:</span>
                            <select
                                className="form-select form-select-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                style={{ width: "auto", minWidth: "150px" }}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="pending">⏳ Chờ duyệt</option>
                                <option value="active">🟢 Đang chạy</option>
                                <option value="rejected">🔴 Bị từ chối</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="spinner-border text-primary mb-3" role="status">
                                <span className="visually-hidden">Đang tải...</span>
                            </div>
                            <p className="text-muted">Đang tải dữ liệu...</p>
                        </div>
                    ) : filteredCampaigns.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="mb-4 opacity-50">
                                <svg width="64" height="64" fill="currentColor" className="text-gray-300 mx-auto" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                                </svg>
                            </div>
                            <h5 className="text-gray-600 fw-bold mb-2">Chưa có chiến dịch nào</h5>
                            <p className="text-muted mb-4">
                                {filterStatus === "all"
                                    ? "Bắt đầu tiếp cận khách hàng bằng cách tạo chiến dịch quảng cáo mới."
                                    : "Không tìm thấy chiến dịch phù hợp với bộ lọc."}
                            </p>
                            {filterStatus === "all" && (
                                <button
                                    className="btn btn-outline-primary rounded-full px-4"
                                    onClick={() => navigate("/supplier/ad-packages")}
                                >
                                    Tạo chiến dịch ngay
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0 align-middle">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="ps-4 py-3 text-secondary text-xs uppercase tracking-wider font-semibold">Chiến dịch</th>
                                        <th className="py-3 text-secondary text-xs uppercase tracking-wider font-semibold">Gói & Vị trí</th>
                                        <th className="py-3 text-secondary text-xs uppercase tracking-wider font-semibold">Thời gian</th>
                                        <th className="py-3 text-secondary text-xs uppercase tracking-wider font-semibold">Hiệu quả</th>
                                        <th className="py-3 text-secondary text-xs uppercase tracking-wider font-semibold">Trạng thái</th>
                                        <th className="text-end pe-4 py-3 text-secondary text-xs uppercase tracking-wider font-semibold">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredCampaigns.map((campaign) => {
                                        const statusStyle = getStatusBadgeStyles(campaign.status);
                                        return (
                                            <tr key={campaign.campaignId} className="transition-colors hover:bg-blue-50/30">
                                                <td className="ps-4 py-4">
                                                    <div className="d-flex align-items-center">
                                                        <div className="position-relative flex-shrink-0">
                                                            {campaign.imageUrl ? (
                                                                <img
                                                                    src={campaign.imageUrl}
                                                                    alt=""
                                                                    className="rounded-lg shadow-sm object-cover"
                                                                    width="64"
                                                                    height="64"
                                                                    onError={(e) => {
                                                                        e.currentTarget.style.display = "none";
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="rounded-lg bg-gray-100 d-flex align-items-center justify-content-center text-gray-400" style={{ width: "64px", height: "64px" }}>
                                                                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                                                        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ms-3">
                                                            <div className="fw-bold text-gray-800 mb-1">{campaign.title}</div>
                                                            {campaign.description && (
                                                                <div className="small text-muted text-truncate mb-1" style={{ maxWidth: "250px" }}>
                                                                    {campaign.description}
                                                                </div>
                                                            )}
                                                            <a
                                                                href={campaign.targetUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="small text-primary d-flex align-items-center gap-1 hover:underline"
                                                            >
                                                                <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                                                    <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                                                    <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                                                </svg>
                                                                Link đích
                                                            </a>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="d-flex flex-column">
                                                        <span className="fw-medium text-gray-700">{campaign.packageName}</span>
                                                        <span className="small text-muted">{formatPrice(campaign.amountPaid)}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="small text-gray-600">
                                                        <div className="d-flex align-items-center gap-1 mb-1">
                                                            <span className="text-success">Start:</span> {formatDate(campaign.startDate)}
                                                        </div>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <span className="text-danger">End:</span> {formatDate(campaign.endDate)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="d-flex gap-3">
                                                        <div className="text-center">
                                                            <div className="fw-bold text-gray-800">{campaign.viewCount}</div>
                                                            <div className="text-xs text-muted uppercase">Views</div>
                                                        </div>
                                                        <div className="vr opacity-25"></div>
                                                        <div className="text-center">
                                                            <div className="fw-bold text-gray-800">{campaign.clickCount}</div>
                                                            <div className="text-xs text-muted uppercase">Clicks</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`badge rounded-pill px-3 py-2 ${statusStyle.bg} ${statusStyle.text} border border-opacity-20 d-inline-flex align-items-center gap-1`}>
                                                        {statusStyle.icon} {statusStyle.label}
                                                    </span>
                                                    {campaign.status === AdCampaignStatus.Rejected && campaign.rejectionReason && (
                                                        <div className="mt-1 text-xs text-red-500 max-w-[150px] truncate" title={campaign.rejectionReason}>
                                                            Lý do: {campaign.rejectionReason}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="text-end pe-4 py-4">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        {canEdit(campaign.status) && (
                                                            <button
                                                                className="btn btn-sm btn-light text-primary hover:bg-blue-50 border-0 rounded-lg p-2 transition-all"
                                                                onClick={() => handleEditClick(campaign)}
                                                                title="Chỉnh sửa"
                                                            >
                                                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.378.378-.106 5-2-1-1-5 2z" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                        {canDelete(campaign.status) && (
                                                            <button
                                                                className="btn btn-sm btn-light text-danger hover:bg-red-50 border-0 rounded-lg p-2 transition-all"
                                                                onClick={() => handleDelete(campaign.campaignId)}
                                                                title="Xóa"
                                                            >
                                                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal - Styled */}
            {showEditModal && selectedCampaign && (
                <div
                    className="modal show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-2xl rounded-2xl overflow-hidden">
                            <div className="modal-header bg-white border-b p-4">
                                <h5 className="modal-title fw-bold text-gray-800">Chỉnh sửa chiến dịch</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowEditModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body p-4 bg-gray-50">
                                <div className="card border-0 shadow-sm rounded-xl p-4 bg-white mb-4">
                                    <div className="mb-3">
                                        <label className="form-label text-sm fw-semibold text-gray-700">
                                            Tiêu đề <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 py-2"
                                            value={editData.title}
                                            onChange={(e) =>
                                                setEditData({ ...editData, title: e.target.value })
                                            }
                                            maxLength={200}
                                            placeholder="Nhập tiêu đề hấp dẫn cho quảng cáo..."
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-sm fw-semibold text-gray-700">Mô tả</label>
                                        <textarea
                                            className="form-control rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 py-2"
                                            rows={3}
                                            value={editData.description}
                                            onChange={(e) =>
                                                setEditData({ ...editData, description: e.target.value })
                                            }
                                            maxLength={500}
                                            placeholder="Mô tả chi tiết về dịch vụ hoặc ưu đãi..."
                                        />
                                    </div>
                                </div>

                                <div className="card border-0 shadow-sm rounded-xl p-4 bg-white">
                                    <div className="mb-3">
                                        <label className="form-label text-sm fw-semibold text-gray-700">
                                            URL đích <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-gray-50 border-gray-200 text-gray-500">🔗</span>
                                            <input
                                                type="url"
                                                className="form-control border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 py-2"
                                                value={editData.targetUrl}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, targetUrl: e.target.value })
                                                }
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-sm fw-semibold text-gray-700">URL hình ảnh</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-gray-50 border-gray-200 text-gray-500">🖼️</span>
                                            <input
                                                type="url"
                                                className="form-control border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 py-2"
                                                value={editData.imageUrl}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, imageUrl: e.target.value })
                                                }
                                                placeholder="https://..."
                                            />
                                        </div>
                                        {editData.imageUrl && (
                                            <div className="mt-3 rounded-lg overflow-hidden border border-gray-200" style={{ height: "150px" }}>
                                                <img
                                                    src={editData.imageUrl}
                                                    alt="Preview"
                                                    className="w-100 h-100 object-cover"
                                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedCampaign.status === AdCampaignStatus.PendingApproval && (
                                    <div className="alert alert-warning small mt-4 d-flex align-items-center gap-2 rounded-lg border-amber-200 bg-amber-50 text-amber-800">
                                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                        </svg>
                                        <div>
                                            <strong>Lưu ý:</strong> Sau khi chỉnh sửa, chiến dịch sẽ cần được admin duyệt lại.
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer bg-white border-t p-3">
                                <button
                                    type="button"
                                    className="btn btn-light text-gray-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                                    onClick={submitEdit}
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCampaigns;
