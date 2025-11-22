import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  UserCog,
  CheckCircle,
  Ban,
  Info,
  ShieldCheck,
  ShieldX,
  Award,
} from "lucide-react";
import { isAxiosError } from "axios";
import api from "@/services/api";
import { USER_ENDPOINTS, SUPPLIER_ENDPOINTS } from "@/constants/endpoints";
import { UserRole, UserStatus, VerificationStatus } from "@/types/entity.type";
import type { UserInfo, SupplierDto } from "@/types/entity.type";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import UserDetailModal from "@/components/admin/UserDetailModal";
import UserRoleModal from "@/components/admin/UserRoleModal";
import SupplierVerificationModal from "@/components/admin/SupplierVerificationModal";

const UserManagement = () => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<UserInfo[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [statusMutationId, setStatusMutationId] = useState<string | null>(null);
  const [supplierDataMap, setSupplierDataMap] = useState<Record<string, SupplierDto>>({});

  // Modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [userToUpdateRole, setUserToUpdateRole] = useState<UserInfo | null>(null);

  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [selectedSupplierUserId, setSelectedSupplierUserId] = useState<string | null>(null);

  const pageSize = 10;
  const showToast = useUniqueToast();

  const roleOptions = useMemo(() => Object.values(UserRole).filter(v => typeof v === 'number') as UserRole[], []);
  const statusOptions = useMemo(
    () => Object.values(UserStatus).filter(v => typeof v === 'number') as UserStatus[],
    []
  );

  const normalizeRole = (val?: unknown): UserRole => {
    if (val === undefined || val === null) return UserRole.CUSTOMER;
    if (typeof val === "number") {
      return val as UserRole;
    }
    // Handle string values from backend (if any)
    const s = String(val).toLowerCase();
    if (s === "admin") return UserRole.ADMIN;
    if (s === "supplier") return UserRole.SUPPLIER;
    return UserRole.CUSTOMER;
  };

  const normalizeStatus = (val?: unknown): UserStatus => {
    if (val === undefined || val === null) return UserStatus.ACTIVE;
    if (typeof val === "number") {
      return val as UserStatus;
    }
    // Handle string values from backend (if any)
    const s = String(val).toLowerCase();
    if (s === "inactive") return UserStatus.INACTIVE;
    return UserStatus.ACTIVE;
  };

  const getRoleLabel = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN: return "Admin";
      case UserRole.SUPPLIER: return "Supplier";
      case UserRole.CUSTOMER: return "Customer";
      default: return "Customer";
    }
  };

  const getStatusLabel = (status: UserStatus): string => {
    switch (status) {
      case UserStatus.ACTIVE: return "Active";
      case UserStatus.INACTIVE: return "Inactive";
      default: return "Active";
    }
  };

  const getVerificationStatusLabel = (status: VerificationStatus): string => {
    switch (status) {
      case VerificationStatus.Pending:
        return "Pending";
      case VerificationStatus.Verified:
        return "Verified";
      case VerificationStatus.Rejected:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const getVerificationStatusColor = (status: VerificationStatus): string => {
    switch (status) {
      case VerificationStatus.Pending:
        return "bg-yellow-100 text-yellow-800";
      case VerificationStatus.Verified:
        return "bg-green-100 text-green-800";
      case VerificationStatus.Rejected:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (userId: string) => {
    setSelectedUserId(userId);
    setDetailModalOpen(true);
  };

  const openRoleModal = (user: UserInfo) => {
    setUserToUpdateRole(user);
    setRoleModalOpen(true);
  };

  const handleRoleUpdateSuccess = () => {
    // Refresh list to show updated role
    fetchUsers(currentPage);
    // Also update search results if active
    if (hasSearched && searchResults) {
      executeSearch(searchTerm);
    }
  };

  const openVerificationModal = (userId: string) => {
    setSelectedSupplierUserId(userId);
    setVerificationModalOpen(true);
  };

  const handleVerificationSuccess = () => {
    // Refresh supplier data
    fetchUsers(currentPage);
    if (hasSearched && searchResults) {
      executeSearch(searchTerm);
    }
  };

  const statusBadgeClass: Record<UserStatus, string> = {
    [UserStatus.ACTIVE]: "bg-green-100 text-green-800",
    [UserStatus.INACTIVE]: "bg-gray-200 text-gray-700",
  };

  const fetchUsers = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const response = await api.get(USER_ENDPOINTS.LIST, {
          params: { page, pageSize },
        });

        const responseData = response.data?.data;
        let items: UserInfo[] = [];
        let total = 0;
        let pages = 1;
        let current = page;

        if (Array.isArray(responseData)) {
          items = responseData;
          total = responseData.length;
        } else if (responseData?.items && Array.isArray(responseData.items)) {
          items = responseData.items;
          total = responseData.total ?? responseData.items.length;
          pages = responseData.pages ?? 1;
          current = responseData.page ?? page;
        } else {
          console.error("Unexpected data structure:", responseData);
        }

        setUsers(items);
        setTotalUsers(total);
        setTotalPages(Math.max(pages, 1));
        setCurrentPage(Math.max(current, 1));

        // Fetch supplier data for all users with Supplier role
        fetchSupplierDataForUsers(items);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  const fetchSupplierDataForUsers = async (userList: UserInfo[]) => {
    const supplierUsers = userList.filter(
      (u) => normalizeRole(u.role) === UserRole.SUPPLIER
    );

    const supplierPromises = supplierUsers.map(async (user) => {
      try {
        const response = await api.get(SUPPLIER_ENDPOINTS.BY_USER_ID(user.userId));
        return { userId: user.userId, data: response.data?.data as SupplierDto };
      } catch (error) {
        console.error(`Error fetching supplier data for user ${user.userId}:`, error);
        return { userId: user.userId, data: null };
      }
    });

    const results = await Promise.all(supplierPromises);
    const newMap: Record<string, SupplierDto> = {};
    results.forEach((result) => {
      if (result.data) {
        newMap[result.userId] = result.data;
      }
    });
    setSupplierDataMap(newMap);
  };

  const executeSearch = useCallback(
    async (term: string) => {
      setSearchLoading(true);
      setSearchError(null);
      try {
        const response = await api.get(USER_ENDPOINTS.SEARCH, {
          params: { email: term },
        });

        const userData = response.data?.data;
        if (userData) {
          setSearchResults([userData]);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 404) {
            setSearchResults([]);
            setSearchError("No user found with that email address.");
          } else if (error.response?.status === 400) {
            setSearchResults([]);
            setSearchError("Please enter a valid email address.");
          } else {
            setSearchResults([]);
            setSearchError("Unable to search users right now.");
          }
        } else {
          setSearchResults([]);
          setSearchError("Unable to search users right now.");
        }
      } finally {
        setSearchLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  useEffect(() => {
    const trimmed = searchTerm.trim();

    if (!trimmed) {
      setSearchResults(null);
      setHasSearched(false);
      setSearchError(null);
      return;
    }

    if (trimmed.length < 3) {
      setSearchResults(null);
      setHasSearched(false);
      setSearchError(null);
      return;
    }

    setHasSearched(true);
    const handler = window.setTimeout(() => {
      executeSearch(trimmed);
    }, 500);

    return () => window.clearTimeout(handler);
  }, [searchTerm, executeSearch]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
    fetchUsers(page);
  };

  const statusValueForApi: Record<UserStatus, number> = {
    [UserStatus.ACTIVE]: 0,
    [UserStatus.INACTIVE]: 1,
  };

  const handleStatusUpdate = async (userId: string, nextStatus: UserStatus) => {
    try {
      setStatusMutationId(userId);
      await api.put(USER_ENDPOINTS.UPDATE_STATUS(userId), {
        status: statusValueForApi[nextStatus],
      });

      const updateStatusLocally = (list: UserInfo[] | null) =>
        list?.map((user) =>
          user.userId === userId ? { ...user, status: nextStatus } : user
        ) ?? null;

      setUsers((prev) =>
        prev.map((user) =>
          user.userId === userId ? { ...user, status: nextStatus } : user
        )
      );
      setSearchResults((prev) => updateStatusLocally(prev));

      showToast(
        nextStatus === UserStatus.ACTIVE
          ? "User activated successfully."
          : "User deactivated successfully.",
        "success"
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      showToast("Failed to update user status. Please try again.", "error");
    } finally {
      setStatusMutationId(null);
    }
  };

  const handleVerifyUser = async (userId: string, verified: boolean) => {
    try {
      await api.patch(`/api/users/${userId}/verify`, { isVerified: verified });

      // Update locally
      setUsers((prev) =>
        prev.map((user) =>
          user.userId === userId ? { ...user, isVerified: verified } : user
        )
      );
      setSearchResults((prev) =>
        prev?.map((user) =>
          user.userId === userId ? { ...user, isVerified: verified } : user
        ) ?? null
      );

      showToast(
        verified
          ? "User verified successfully."
          : "User unverified successfully.",
        "success"
      );
    } catch (error) {
      console.error("Error updating user verification:", error);
      showToast("Failed to update user verification. Please try again.", "error");
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString();
  };

  const baseUsers = useMemo(() => {
    if (hasSearched && searchResults !== null) {
      return searchResults;
    }
    return users;
  }, [hasSearched, searchResults, users]);

  const filteredUsers = useMemo(() => {
    return baseUsers.filter((user) => {
      const normalizedRole = normalizeRole(user.role);
      const normalizedStatus = normalizeStatus(user.status);

      const roleMatches = roleFilter === "all" || normalizedRole === roleFilter;
      const statusMatches =
        statusFilter === "all" || normalizedStatus === statusFilter;

      return roleMatches && statusMatches;
    });
  }, [baseUsers, roleFilter, statusFilter]);

  const isEmptyResult = filteredUsers.length === 0;
  const isSearching = hasSearched && Boolean(searchTerm.trim());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage all registered users</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="w-full md:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by email (min. 3 characters)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchLoading && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  Searching...
                </span>
              )}
            </div>
            {searchError && (
              <p className="mt-1 text-xs text-red-600">{searchError}</p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="flex flex-col w-full md:w-48">
              <label className="text-xs font-medium text-gray-500 uppercase mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value === "all"
                      ? "all"
                      : (Number(e.target.value) as UserStatus)
                  )
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col w-full md:w-48">
              <label className="text-xs font-medium text-gray-500 uppercase mb-1">
                Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(
                    e.target.value === "all"
                      ? "all"
                      : (Number(e.target.value) as UserRole)
                  )
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All roles</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {getRoleLabel(role)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isEmptyResult ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-6 text-center text-sm text-gray-500"
                  >
                    {isSearching
                      ? "No users matched your search."
                      : "No users available."}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const normalizedRole = normalizeRole(user.role);
                  const normalizedStatus = normalizeStatus(user.status);
                  const supplierData = supplierDataMap[user.userId];
                  const isSupplier = normalizedRole === UserRole.SUPPLIER;

                  return (
                    <tr key={user.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.phone || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${normalizedRole === UserRole.ADMIN
                            ? "bg-red-100 text-red-800"
                            : normalizedRole === UserRole.SUPPLIER
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {getRoleLabel(normalizedRole)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadgeClass[normalizedStatus]
                              }`}
                          >
                            {getStatusLabel(normalizedStatus)}
                          </span>
                          {user.isVerified && (
                            <span
                              className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                              title="Email Verified"
                            >
                              ✓ Verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isSupplier && supplierData ? (
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getVerificationStatusColor(
                              supplierData.verificationStatus
                            )}`}
                          >
                            {getVerificationStatusLabel(supplierData.verificationStatus)}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(user.userId)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View user details"
                          >
                            <Info className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openRoleModal(user)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Change Role"
                          >
                            <UserCog className="w-5 h-5" />
                          </button>
                          {isSupplier && (
                            <button
                              onClick={() => openVerificationModal(user.userId)}
                              className="text-amber-600 hover:text-amber-900"
                              title="Manage supplier verification"
                            >
                              <Award className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleVerifyUser(user.userId, !user.isVerified)}
                            className={`${user.isVerified
                              ? "text-orange-600 hover:text-orange-900"
                              : "text-emerald-600 hover:text-emerald-900"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            title={user.isVerified ? "Unverify user" : "Verify user"}
                          >
                            {user.isVerified ? (
                              <ShieldX className="w-5 h-5" />
                            ) : (
                              <ShieldCheck className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(user.userId, UserStatus.ACTIVE)
                            }
                            disabled={
                              normalizedStatus === UserStatus.ACTIVE ||
                              statusMutationId === user.userId
                            }
                            className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Set user as active"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                user.userId,
                                UserStatus.INACTIVE
                              )
                            }
                            disabled={
                              normalizedStatus === UserStatus.INACTIVE ||
                              statusMutationId === user.userId
                            }
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Set user as inactive"
                          >
                            <Ban className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {!isSearching && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 text-sm text-gray-600">
            <div>
              Showing page {currentPage} of {totalPages} ({totalUsers} users total)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Modals */}
      <UserDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        userId={selectedUserId}
      />

      <UserRoleModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        user={userToUpdateRole}
        onSuccess={handleRoleUpdateSuccess}
      />

      <SupplierVerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        userId={selectedSupplierUserId}
        onSuccess={handleVerificationSuccess}
      />
    </div>
  );
};

export default UserManagement;
