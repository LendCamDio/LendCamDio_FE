import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { getAdPackages, purchaseAdPackage } from "@/services/adCampaign.service";
import type { AdPackage, PurchaseAdPackageRequest } from "@/types/adCampaign.type";
import { AdPackageType, AdPosition } from "@/types/adCampaign.type";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AdPackages = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [packages, setPackages] = useState<AdPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<AdPackage | null>(null);
    const [purchaseData, setPurchaseData] = useState<PurchaseAdPackageRequest>({
        packageId: "",
        title: "",
        description: "",
        targetUrl: "",
        imageUrl: "",
        paymentMethod: "VNPay",
    });

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        setLoading(true);
        try {
            const response = await getAdPackages();
            if (response.success && response.data) {
                setPackages(Array.isArray(response.data) ? response.data : []);
            }
        } catch (error) {
            console.error("Failed to fetch packages:", error);
            toast.error("Không thể tải danh sách gói quảng cáo");
        } finally {
            setLoading(false);
        }
    };

    const handlePurchaseClick = (pkg: AdPackage) => {
        setSelectedPackage(pkg);
        setPurchaseData({
            packageId: pkg.packageId,
            title: "",
            description: "",
            targetUrl: "",
            imageUrl: "",
            paymentMethod: "VNPay",
        });
        setShowPurchaseModal(true);
    };

    const submitPurchase = async () => {
        if (!token) {
            toast.error("Vui lòng đăng nhập");
            return;
        }

        if (!purchaseData.title.trim() || !purchaseData.targetUrl.trim()) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        try {
            const response = await purchaseAdPackage(purchaseData, token);
            if (response.success) {
                toast.success("Đã tạo chiến dịch quảng cáo thành công! Đang chờ admin duyệt.");
                setShowPurchaseModal(false);
                navigate("/supplier/my-campaigns");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không thể tạo chiến dịch");
        }
    };

    const getPackageIcon = (type: AdPackageType) => {
        return type === AdPackageType.FastAdPushUpgrade ? "🚀" : "⚡";
    };

    const getPositionName = (position: AdPosition) => {
        switch (position) {
            case AdPosition.HomePageTop:
                return "Đầu trang chủ";
            case AdPosition.SidebarFeatured:
                return "Sidebar nổi bật";
            case AdPosition.CategoryPageTop:
                return "Đầu trang danh mục";
            default:
                return "Không xác định";
        }
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString("vi-VN") + "đ";
    };


    return (
        <div className="container-fluid p-4">
            {/* Header Section */}
            <div className="mb-5 animate-fade-in-up">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, var(--primary-color), var(--accent-color))",
                            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
                        }}
                    >
                        <svg width="24" height="24" fill="white" viewBox="0 0 16 16">
                            <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                            <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="fw-bold mb-1" style={{ fontSize: "2rem", color: "var(--text-dark)" }}>
                            Gói Quảng Cáo
                        </h2>
                        <p className="text-muted mb-0">
                            Chọn gói quảng cáo phù hợp để tăng độ hiển thị cho dịch vụ của bạn
                        </p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p className="text-muted mt-3">Đang tải gói quảng cáo...</p>
                </div>
            ) : packages.length === 0 ? (
                <div
                    className="alert alert-info d-flex align-items-center gap-3"
                    style={{
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                        background: "rgba(59, 130, 246, 0.05)",
                        borderRadius: "12px"
                    }}
                >
                    <svg width="24" height="24" fill="var(--primary-color)" viewBox="0 0 16 16">
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                    </svg>
                    Hiện chưa có gói quảng cáo nào
                </div>
            ) : (
                <div className="row">
                    {packages.map((pkg, index) => (
                        <div
                            key={pkg.packageId}
                            className="col-md-6 col-lg-4 mb-4 animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div
                                className="position-relative h-100 overflow-hidden"
                                style={{
                                    borderRadius: "20px",
                                    background: pkg.type === AdPackageType.FastAdPushUpgrade
                                        ? "linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(245, 158, 11, 0.05))"
                                        : "white",
                                    border: pkg.type === AdPackageType.FastAdPushUpgrade
                                        ? "2px solid transparent"
                                        : "1px solid rgba(0, 0, 0, 0.08)",
                                    backgroundImage: pkg.type === AdPackageType.FastAdPushUpgrade
                                        ? "linear-gradient(white, white), linear-gradient(135deg, var(--primary-color), var(--accent-color))"
                                        : "none",
                                    backgroundOrigin: "border-box",
                                    backgroundClip: "padding-box, border-box",
                                    boxShadow: pkg.type === AdPackageType.FastAdPushUpgrade
                                        ? "0 10px 30px -5px rgba(59, 130, 246, 0.2)"
                                        : "0 4px 12px rgba(0, 0, 0, 0.05)",
                                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                    transform: pkg.type === AdPackageType.FastAdPushUpgrade ? "scale(1.02)" : "scale(1)"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                                    e.currentTarget.style.boxShadow = pkg.type === AdPackageType.FastAdPushUpgrade
                                        ? "0 20px 40px -10px rgba(59, 130, 246, 0.3)"
                                        : "0 12px 28px rgba(0, 0, 0, 0.12)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = pkg.type === AdPackageType.FastAdPushUpgrade ? "translateY(0) scale(1.02)" : "translateY(0) scale(1)";
                                    e.currentTarget.style.boxShadow = pkg.type === AdPackageType.FastAdPushUpgrade
                                        ? "0 10px 30px -5px rgba(59, 130, 246, 0.2)"
                                        : "0 4px 12px rgba(0, 0, 0, 0.05)";
                                }}
                            >
                                {/* Recommended Badge */}
                                {pkg.type === AdPackageType.FastAdPushUpgrade && (
                                    <div
                                        className="position-absolute d-inline-flex align-items-center gap-2 px-3 py-2 fw-semibold"
                                        style={{
                                            top: "-1px",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            background: "linear-gradient(135deg, var(--accent-color), #ff6b6b)",
                                            color: "white",
                                            borderRadius: "0 0 12px 12px",
                                            fontSize: "0.75rem",
                                            boxShadow: "0 4px 12px rgba(245, 158, 11, 0.4)",
                                            letterSpacing: "0.5px"
                                        }}
                                    >
                                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                        ĐƯỢC ĐỀ XUẤT
                                    </div>
                                )}

                                <div className="p-4 d-flex flex-column h-100" style={{ paddingTop: pkg.type === AdPackageType.FastAdPushUpgrade ? "3rem" : "2rem" }}>
                                    {/* Icon & Title */}
                                    <div className="text-center mb-4">
                                        <div
                                            className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                borderRadius: "20px",
                                                background: pkg.type === AdPackageType.FastAdPushUpgrade
                                                    ? "linear-gradient(135deg, var(--primary-color), var(--accent-color))"
                                                    : "linear-gradient(135deg, #e0e7ff, #f0f9ff)",
                                                fontSize: "2.5rem",
                                                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)"
                                            }}
                                        >
                                            {getPackageIcon(pkg.type)}
                                        </div>
                                        <h5 className="fw-bold mb-2" style={{ color: "var(--text-dark)" }}>
                                            {pkg.name}
                                        </h5>
                                        <p className="text-muted small mb-0" style={{ fontSize: "0.85rem" }}>
                                            {pkg.description}
                                        </p>
                                    </div>

                                    {/* Pricing */}
                                    <div
                                        className="text-center mb-4 p-3"
                                        style={{
                                            borderRadius: "12px",
                                            background: pkg.type === AdPackageType.FastAdPushUpgrade
                                                ? "linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(245, 158, 11, 0.05))"
                                                : "rgba(0, 0, 0, 0.02)"
                                        }}
                                    >
                                        <div className="small text-muted mb-1" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                                            Giá chỉ từ
                                        </div>
                                        <div
                                            className="fw-bold mb-0"
                                            style={{
                                                fontSize: "2rem",
                                                background: pkg.type === AdPackageType.FastAdPushUpgrade
                                                    ? "linear-gradient(135deg, var(--primary-color), var(--accent-color))"
                                                    : "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                backgroundClip: "text"
                                            }}
                                        >
                                            {formatPrice(pkg.price)}
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="mb-4 flex-grow-1">
                                        <div className="d-flex align-items-center justify-content-between py-2 px-3 mb-2" style={{ background: "rgba(0, 0, 0, 0.02)", borderRadius: "8px" }}>
                                            <span className="small text-muted d-flex align-items-center gap-2">
                                                <svg width="16" height="16" fill="var(--primary-color)" viewBox="0 0 16 16">
                                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                                                </svg>
                                                Thời gian
                                            </span>
                                            <span className="fw-semibold" style={{ color: "var(--text-dark)" }}>
                                                {pkg.durationDays} ngày
                                            </span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between py-2 px-3 mb-2" style={{ background: "rgba(0, 0, 0, 0.02)", borderRadius: "8px" }}>
                                            <span className="small text-muted d-flex align-items-center gap-2">
                                                <svg width="16" height="16" fill="var(--primary-color)" viewBox="0 0 16 16">
                                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                                                </svg>
                                                Vị trí
                                            </span>
                                            <span className="fw-semibold" style={{ color: "var(--text-dark)", fontSize: "0.85rem" }}>
                                                {getPositionName(pkg.position)}
                                            </span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between py-2 px-3" style={{ background: "rgba(0, 0, 0, 0.02)", borderRadius: "8px" }}>
                                            <span className="small text-muted d-flex align-items-center gap-2">
                                                <svg width="16" height="16" fill="var(--primary-color)" viewBox="0 0 16 16">
                                                    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                                                </svg>
                                                Lượt hiển thị
                                            </span>
                                            <span className="fw-semibold" style={{ color: "var(--text-dark)" }}>
                                                {pkg.maxAdsPerDay}/ngày
                                            </span>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        className="btn w-100 fw-semibold"
                                        style={{
                                            padding: "0.875rem",
                                            borderRadius: "12px",
                                            border: pkg.type === AdPackageType.FastAdPushUpgrade ? "none" : "2px solid var(--primary-color)",
                                            background: pkg.type === AdPackageType.FastAdPushUpgrade
                                                ? "linear-gradient(135deg, var(--primary-color), var(--accent-color))"
                                                : "white",
                                            color: pkg.type === AdPackageType.FastAdPushUpgrade ? "white" : "var(--primary-color)",
                                            boxShadow: pkg.type === AdPackageType.FastAdPushUpgrade
                                                ? "0 4px 15px rgba(59, 130, 246, 0.3)"
                                                : "none",
                                            transition: "all 0.3s ease",
                                            opacity: pkg.isActive ? 1 : 0.6
                                        }}
                                        onClick={() => handlePurchaseClick(pkg)}
                                        disabled={!pkg.isActive}
                                        onMouseEnter={(e) => {
                                            if (pkg.isActive) {
                                                e.currentTarget.style.transform = "translateY(-2px)";
                                                e.currentTarget.style.boxShadow = pkg.type === AdPackageType.FastAdPushUpgrade
                                                    ? "0 6px 20px rgba(59, 130, 246, 0.4)"
                                                    : "0 4px 15px rgba(59, 130, 246, 0.2)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (pkg.isActive) {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = pkg.type === AdPackageType.FastAdPushUpgrade
                                                    ? "0 4px 15px rgba(59, 130, 246, 0.3)"
                                                    : "none";
                                            }
                                        }}
                                    >
                                        {pkg.isActive ? "Mua ngay" : "Không khả dụng"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}


            {/* Purchase Modal */}
            {showPurchaseModal && selectedPackage && (
                <div
                    className="modal show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Tạo chiến dịch quảng cáo - {selectedPackage.name}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowPurchaseModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-info small">
                                    <strong>Lưu ý:</strong> Chiến dịch của bạn sẽ được gửi đến admin để duyệt.
                                    Sau khi được duyệt, quảng cáo sẽ hiển thị ngay lập tức.
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Tiêu đề <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={purchaseData.title}
                                        onChange={(e) =>
                                            setPurchaseData({ ...purchaseData, title: e.target.value })
                                        }
                                        placeholder="Ví dụ: Giảm giá 20% cho thuê máy ảnh cuối tuần"
                                        maxLength={200}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Mô tả</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        value={purchaseData.description}
                                        onChange={(e) =>
                                            setPurchaseData({ ...purchaseData, description: e.target.value })
                                        }
                                        placeholder="Mô tả chi tiết về chiến dịch quảng cáo của bạn"
                                        maxLength={500}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        URL đích <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        value={purchaseData.targetUrl}
                                        onChange={(e) =>
                                            setPurchaseData({ ...purchaseData, targetUrl: e.target.value })
                                        }
                                        placeholder="https://example.com/your-promotion"
                                    />
                                    <div className="form-text">
                                        URL mà người dùng sẽ được chuyển đến khi click vào quảng cáo
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">URL hình ảnh</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        value={purchaseData.imageUrl}
                                        onChange={(e) =>
                                            setPurchaseData({ ...purchaseData, imageUrl: e.target.value })
                                        }
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <div className="form-text">
                                        Hình ảnh quảng cáo (khuyến nghị: 1200x600px)
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Phương thức thanh toán</label>
                                    <select
                                        className="form-select"
                                        value={purchaseData.paymentMethod}
                                        onChange={(e) =>
                                            setPurchaseData({
                                                ...purchaseData,
                                                paymentMethod: e.target.value as "VNPay" | "PayOS",
                                            })
                                        }
                                    >
                                        <option value="VNPay">VNPay</option>
                                        <option value="PayOS">PayOS</option>
                                    </select>
                                </div>

                                <div className="card bg-light">
                                    <div className="card-body">
                                        <h6 className="fw-bold mb-3">Tóm tắt đơn hàng</h6>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Gói:</span>
                                            <span className="fw-medium">{selectedPackage.name}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Thời gian:</span>
                                            <span className="fw-medium">{selectedPackage.durationDays} ngày</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Vị trí:</span>
                                            <span className="fw-medium">
                                                {getPositionName(selectedPackage.position)}
                                            </span>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-between">
                                            <span className="fw-bold">Tổng cộng:</span>
                                            <span className="h5 mb-0 text-primary fw-bold">
                                                {formatPrice(selectedPackage.price)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowPurchaseModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={submitPurchase}
                                >
                                    Tạo chiến dịch
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdPackages;
