import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Info, IdCard, CheckCircle, XCircle } from "lucide-react";
import api from "@/services/api";
import { USER_ENDPOINTS, IDENTITY_VERIFICATION_ENDPOINTS } from "@/constants/endpoints";
import { UserRole, UserStatus, Sex } from "@/types/entity.type";
import type { UserDetailInfo, IdentityVerificationDto, IdentityVerificationResponse } from "@/types/entity.type";

type UserDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
};

const UserDetailModal = ({ isOpen, onClose, userId }: UserDetailModalProps) => {
  const [user, setUser] = useState<UserDetailInfo | null>(null);
  const [identityVerification, setIdentityVerification] = useState<IdentityVerificationDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRoleLabel = (role?: UserRole | string): string => {
    if (role === undefined || role === null) return "Customer";
    if (typeof role === "number") {
      switch (role) {
        case UserRole.ADMIN: return "Admin";
        case UserRole.SUPPLIER: return "Supplier";
        case UserRole.CUSTOMER: return "Customer";
        default: return "Customer";
      }
    }
    return String(role);
  };

  const getStatusLabel = (status?: UserStatus): string => {
    if (status === undefined || status === null) return "Active";
    switch (status) {
      case UserStatus.ACTIVE: return "Active";
      case UserStatus.INACTIVE: return "Inactive";
      default: return "Active";
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!userId || !isOpen) return;

      setLoading(true);
      setError(null);
      try {
        // Fetch user details
        const response = await api.get(
          USER_ENDPOINTS.DETAILED_PROFILE_BY_ID(userId)
        );
        const detailData = response.data?.data as UserDetailInfo | undefined;
        if (detailData) {
          setUser(detailData);
        } else {
          setUser(null);
          setError("No detail data available.");
        }

        // Fetch identity verification data
        try {
          const idVerifyResponse = await api.get<IdentityVerificationResponse>(
            `${IDENTITY_VERIFICATION_ENDPOINTS.GET_BY_USER_ID(userId)}`
          );
          if (idVerifyResponse.data?.success && idVerifyResponse.data?.data) {
            setIdentityVerification(idVerifyResponse.data.data);
          } else {
            setIdentityVerification(null);
          }
        } catch (idVerifyError) {
          // 404 is expected if user hasn't submitted identity verification
          setIdentityVerification(null);
        }
      } catch (err) {
        console.error("Error fetching user detail:", err);
        setUser(null);
        setError("Failed to load user details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId, isOpen]);

  if (!isOpen) return null;

  const formatDate = (value?: string) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString();
  };

  const statusBadgeClass: Record<UserStatus, string> = {
    [UserStatus.ACTIVE]: "bg-green-100 text-green-800",
    [UserStatus.INACTIVE]: "bg-gray-200 text-gray-700",
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" />
              User Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Full profile information
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            title="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          ) : user ? (
            <div className="space-y-8">
              {/* Header Info */}
              <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-gray-100">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                  {user.fullName?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {user.fullName}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide rounded-full ${
                        user.role === UserRole.ADMIN
                          ? "bg-red-100 text-red-800"
                          : user.role === UserRole.SUPPLIER
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        statusBadgeClass[user.status ?? UserStatus.ACTIVE]
                      }`}
                    >
                      {getStatusLabel(user.status)}
                    </span>
                    <span className="px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide rounded-full bg-gray-100 text-gray-600">
                      {user.isVerified ? "Verified" : "Email Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <DetailField label="Email" value={user.email} />
                <DetailField label="Phone" value={user.phone} />
                <DetailField label="Occupation" value={user.occupation} />
                <DetailField label="Income Level" value={user.incomeLevel} />
                <DetailField
                  label="Date of Birth"
                  value={formatDate(user.dateOfBirth)}
                />
                <DetailField label="Address" value={user.address} />
                <DetailField
                  label="Created At"
                  value={formatDate(user.createdAt)}
                />
                <DetailField
                  label="Last Updated"
                  value={user.updatedAt ? formatDate(user.updatedAt) : "Never"}
                />
              </div>

              {/* Security Tokens (Admin Only) */}
              {(user.emailVerificationToken || user.passwordResetToken) && (
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    Security Tokens
                  </p>
                  <div className="space-y-2 text-xs font-mono text-gray-600 bg-white p-3 rounded border border-gray-200">
                    {user.emailVerificationToken && (
                      <p className="break-all">
                        <span className="font-semibold text-gray-500">
                          Email Token:
                        </span>{" "}
                        {user.emailVerificationToken}
                      </p>
                    )}
                    {user.passwordResetToken && (
                      <p className="break-all">
                        <span className="font-semibold text-gray-500">
                          Reset Token:
                        </span>{" "}
                        {user.passwordResetToken}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Identity Verification (CCCD) */}
              <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-blue-600" />
                  Identity Verification (CCCD)
                </p>
                {identityVerification ? (
                  <div className="bg-white p-4 rounded border border-blue-200 space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">Verified</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-500">Full Name:</span>
                        <p className="text-gray-900 font-semibold">{identityVerification.fullName}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Citizen ID (CCCD):</span>
                        <p className="text-gray-900 font-mono font-semibold">{identityVerification.citizenId}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Date of Birth:</span>
                        <p className="text-gray-900">{formatDate(identityVerification.dateOfBirth)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Sex:</span>
                        <p className="text-gray-900">
                          {identityVerification.sex === Sex.MALE ? "Male" : 
                           identityVerification.sex === Sex.FEMALE ? "Female" : "Other"}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-500">Place of Birth:</span>
                        <p className="text-gray-900">{identityVerification.placeOfBirth}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-500">Place of Residence:</span>
                        <p className="text-gray-900">{identityVerification.placeOfResidence}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Provided Date:</span>
                        <p className="text-gray-900">{formatDate(identityVerification.providedDate)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Provider:</span>
                        <p className="text-gray-900">{identityVerification.provider}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded border border-gray-200 flex items-center gap-2 text-gray-500">
                    <XCircle className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">No identity verification submitted yet</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              User not found.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

const DetailField = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="group">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1 group-hover:text-blue-600 transition-colors">
      {label}
    </p>
    <p className="text-sm font-medium text-gray-900 break-words">
      {value || "N/A"}
    </p>
  </div>
);

export default UserDetailModal;
