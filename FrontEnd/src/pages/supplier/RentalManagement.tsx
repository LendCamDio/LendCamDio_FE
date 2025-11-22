import { useState, useEffect } from "react";
import { Package, Calendar, DollarSign, User, CheckCircle, XCircle, Clock, Eye, X } from "lucide-react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import api from "@/services/api";

interface Rental {
    rentalId: string;
    equipmentId: string;
    equipmentName: string;
    equipmentImageUrl?: string;
    customerId: string;
    customerName: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    deposit: number;
    insuranceFee: number;
    status: "Pending" | "Active" | "Completed" | "Cancelled";
    notes?: string;
    hasContract: boolean;
    contractStatus?: string;
}

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
}

export default function RentalManagement() {
    const { user } = useAuth();
    const showToast = useUniqueToast();
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
        totalCount: 0,
    });
    const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        fetchRentals();
    }, [pagination.currentPage, selectedStatus]);

    const fetchRentals = async () => {
        try {
            setLoading(true);

            const userResponse = await api.get(`/api/suppliers/user/${user?.id}`);

            if (!userResponse.data.success || !userResponse.data.data) {
                showToast("Supplier profile not found. Please verify your email or contact administrator.", "error");
                setLoading(false);
                return;
            }

            const supplierId = userResponse.data.data.supplierId;

            const response = await api.get(
                `/api/rentals/supplier/${supplierId}?page=${pagination.currentPage}&pageSize=${pagination.pageSize}`
            );

            let filteredRentals = response.data.data?.items || [];

            if (selectedStatus !== "all") {
                filteredRentals = filteredRentals.filter(
                    (rental: Rental) => rental.status.toLowerCase() === selectedStatus.toLowerCase()
                );
            }

            setRentals(filteredRentals);
            setPagination({
                currentPage: response.data.data?.currentPage || 1,
                totalPages: response.data.data?.totalPages || 1,
                pageSize: response.data.data?.pageSize || 10,
                totalCount: response.data.data?.totalCount || 0,
            });
        } catch (error: any) {
            if (error.response?.status === 404) {
                showToast("Supplier profile not found. Please verify your email or contact administrator.", "error");
            } else {
                showToast("Failed to load rentals", "error");
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveRental = async (rentalId: string) => {
        try {
            await api.patch(`/api/rentals/${rentalId}/approve`);
            showToast("Rental approved successfully", "success");
            fetchRentals();
        } catch (error) {
            showToast("Failed to approve rental", "error");
        }
    };

    const handleCompleteRental = async (rentalId: string) => {
        try {
            await api.patch(`/api/rentals/${rentalId}/complete`);
            showToast("Rental completed successfully", "success");
            fetchRentals();
        } catch (error) {
            showToast("Failed to complete rental", "error");
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            Pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
            Active: { bg: "bg-blue-100", text: "text-blue-800", icon: CheckCircle },
            Completed: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
            Cancelled: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
                <Icon className="w-4 h-4" />
                {status}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Rental Management</h1>
                    <p className="text-gray-600">Manage all equipment rentals for your items</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Rentals</p>
                                <p className="text-2xl font-bold text-gray-900">{pagination.totalCount}</p>
                            </div>
                            <Package className="w-10 h-10 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {rentals.filter((r) => r.status === "Pending").length}
                                </p>
                            </div>
                            <Clock className="w-10 h-10 text-yellow-600" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {rentals.filter((r) => r.status === "Active").length}
                                </p>
                            </div>
                            <CheckCircle className="w-10 h-10 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {rentals.filter((r) => r.status === "Completed").length}
                                </p>
                            </div>
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {rentals.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Rentals Found</h3>
                            <p className="text-gray-500 mb-4">
                                You don't have any rentals yet. Rentals will appear here when customers rent your equipment.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Equipment
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rental Period
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Price
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {rentals.map((rental) => (
                                            <tr key={rental.rentalId} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {rental.equipmentImageUrl && (
                                                            <img
                                                                src={rental.equipmentImageUrl}
                                                                alt={rental.equipmentName}
                                                                className="w-10 h-10 rounded object-cover mr-3"
                                                            />
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-gray-900">{rental.equipmentName}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <User className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span className="text-sm text-gray-900">{rental.customerName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                                        <div className="text-sm">
                                                            <p className="text-gray-900">{formatDate(rental.startDate)}</p>
                                                            <p className="text-gray-500">to {formatDate(rental.endDate)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {formatCurrency(rental.totalPrice)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(rental.status)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedRental(rental);
                                                                setShowDetailModal(true);
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        {rental.status === "Pending" && (
                                                            <button
                                                                onClick={() => handleApproveRental(rental.rentalId)}
                                                                className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                                            >
                                                                Approve
                                                            </button>
                                                        )}
                                                        {rental.status === "Active" && (
                                                            <button
                                                                onClick={() => handleCompleteRental(rental.rentalId)}
                                                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                                            >
                                                                Complete
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {pagination.totalPages > 1 && (
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing page {pagination.currentPage} of {pagination.totalPages}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))
                                            }
                                            disabled={pagination.currentPage === 1}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() =>
                                                setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))
                                            }
                                            disabled={pagination.currentPage === pagination.totalPages}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {showDetailModal && selectedRental && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Rental Details</h2>
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Equipment</p>
                                            <p className="font-medium text-gray-900">{selectedRental.equipmentName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Customer</p>
                                            <p className="font-medium text-gray-900">{selectedRental.customerName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Start Date</p>
                                            <p className="font-medium text-gray-900">{formatDate(selectedRental.startDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">End Date</p>
                                            <p className="font-medium text-gray-900">{formatDate(selectedRental.endDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Price</p>
                                            <p className="font-medium text-gray-900">{formatCurrency(selectedRental.totalPrice)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Deposit</p>
                                            <p className="font-medium text-gray-900">{formatCurrency(selectedRental.deposit)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Insurance Fee</p>
                                            <p className="font-medium text-gray-900">{formatCurrency(selectedRental.insuranceFee)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Status</p>
                                            <div className="mt-1">{getStatusBadge(selectedRental.status)}</div>
                                        </div>
                                    </div>

                                    {selectedRental.notes && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Notes</p>
                                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRental.notes}</p>
                                        </div>
                                    )}

                                    {selectedRental.hasContract && (
                                        <div>
                                            <p className="text-sm text-gray-600">Contract Status</p>
                                            <p className="font-medium text-gray-900">{selectedRental.contractStatus || "N/A"}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
