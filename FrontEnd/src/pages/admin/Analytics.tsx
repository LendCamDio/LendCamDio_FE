import { useEffect, useState } from "react";
import {
  DollarSign,
  Users,
  Package,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
} from "lucide-react";
import api from "@/services/api";
import { ANALYTICS_ENDPOINTS } from "@/constants/endpoints";

interface AnalyticsData {
  totalRevenue: number;
  totalUsers: number;
  totalEquipment: number;
  totalRentals: number;
  activeRentals: number;
  completedRentals: number;
  pendingRentals: number;
  cancelledRentals: number;
  totalCustomers: number;
  totalSuppliers: number;
  activeSuppliers: number;
  verifiedSuppliers: number;
  totalOrders: number;
  completedOrders: number;
  averageRentalValue: number;
  equipmentUtilization: number;
  completionRate: number;
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(ANALYTICS_ENDPOINTS.GET);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-600">Failed to load analytics</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Analytics & Statistics
        </h1>
        <p className="text-gray-600 mt-2">
          Comprehensive overview of your business performance
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</h3>
          <p className="text-green-100 text-sm mt-1">Total Revenue</p>
        </div>

        {/* Total Users */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold">{data.totalUsers}</h3>
          <p className="text-blue-100 text-sm mt-1">
            {data.totalCustomers} customers, {data.totalSuppliers} suppliers
          </p>
        </div>

        {/* Total Equipment */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8" />
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold">{data.totalEquipment}</h3>
          <p className="text-purple-100 text-sm mt-1">{data.equipmentUtilization}% utilization</p>
        </div>

        {/* Active Rentals */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
            <div className="text-sm font-medium">
              {data.activeRentals} Active
            </div>
          </div>
          <h3 className="text-2xl font-bold">{data.totalRentals}</h3>
          <p className="text-orange-100 text-sm mt-1">{data.completionRate}% completion rate</p>
        </div>
      </div>

      {/* Rental Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-500">Active</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{data.activeRentals}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-6 h-6 text-yellow-600" />
            <span className="text-sm font-medium text-gray-500">Pending</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{data.pendingRentals}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium text-gray-500">Completed</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{data.completedRentals}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-6 h-6 text-red-600" />
            <span className="text-sm font-medium text-gray-500">Cancelled</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{data.cancelledRentals}</div>
        </div>
      </div>

      {/* Charts and Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Supplier Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Supplier Overview
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">
                  Total Suppliers
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {data.totalSuppliers}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">
                  Active Suppliers
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {data.activeSuppliers}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">
                  Verified Suppliers
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {data.verifiedSuppliers} ({data.totalSuppliers > 0 ? ((data.verifiedSuppliers / data.totalSuppliers) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Order Performance
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Total Orders</p>
                <p className="text-sm text-gray-500">All time</p>
              </div>
              <span className="text-2xl font-bold text-gray-900">{data.totalOrders}</span>
            </div>
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Completed Orders</p>
                <p className="text-sm text-gray-500">Successfully fulfilled</p>
              </div>
              <span className="text-2xl font-bold text-green-600">{data.completedOrders}</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <div>
                <p className="font-medium text-gray-900">Avg. Rental Value</p>
                <p className="text-sm text-gray-500">Per transaction</p>
              </div>
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency(data.averageRentalValue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rental Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Performance Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Completion Rate */}
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {data.completionRate}%
            </div>
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-xs text-gray-500 mt-1">
              {data.completedRentals} of {data.totalRentals} completed
            </p>
          </div>

          {/* Average Rental Value */}
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {formatCurrency(data.averageRentalValue)}
            </div>
            <p className="text-sm text-gray-600">Avg. Rental Value</p>
            <p className="text-xs text-gray-500 mt-1">Per transaction</p>
          </div>

          {/* Equipment Utilization */}
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {data.equipmentUtilization}%
            </div>
            <p className="text-sm text-gray-600">Equipment Utilization</p>
            <p className="text-xs text-gray-500 mt-1">
              {data.activeRentals} of {data.totalEquipment} in use
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
