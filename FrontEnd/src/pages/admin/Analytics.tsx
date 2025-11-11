import { useEffect, useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  Package,
  Calendar,
  Award,
} from "lucide-react";
import api from "@/services/api";
import {
  USER_ENDPOINTS,
  EQUIPMENT_ENDPOINTS,
  RENTAL_ENDPOINTS,
} from "@/constants/endpoints";

interface AnalyticsData {
  totalRevenue: number;
  totalUsers: number;
  totalEquipment: number;
  totalRentals: number;
  activeRentals: number;
  completedRentals: number;
  revenueGrowth: number;
  userGrowth: number;
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalUsers: 0,
    totalEquipment: 0,
    totalRentals: 0,
    activeRentals: 0,
    completedRentals: 0,
    revenueGrowth: 0,
    userGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch all data
      const [usersRes, equipmentRes, rentalsRes, activeRentalsRes] =
        await Promise.all([
          api.get(USER_ENDPOINTS.LIST),
          api.get(EQUIPMENT_ENDPOINTS.LIST),
          api.get(RENTAL_ENDPOINTS.GET_ALL),
          api.get(RENTAL_ENDPOINTS.GET_ACTIVE),
        ]);

      const userData = usersRes.data?.data;
      const totalUsers = Array.isArray(userData)
        ? userData.length
        : userData?.items?.length || 0;

      const totalEquipment = equipmentRes.data?.data?.items?.length || 0;

      const totalRentals = rentalsRes.data?.data?.items?.length || 0;

      const activeRentals = activeRentalsRes.data?.data?.items?.length || 0;

      // Calculate completed rentals (mock for now)
      const completedRentals = Math.floor(totalRentals * 0.7);

      // Calculate mock revenue (you'll need real API endpoint)
      const totalRevenue = totalRentals * 150; // Assuming average $150 per rental

      setData({
        totalRevenue,
        totalUsers,
        totalEquipment,
        totalRentals,
        activeRentals,
        completedRentals,
        revenueGrowth: 23.5, // Mock percentage
        userGrowth: 15.3, // Mock percentage
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
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
            <div className="flex items-center text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />+{data.revenueGrowth}%
            </div>
          </div>
          <h3 className="text-2xl font-bold">
            ${data.totalRevenue.toLocaleString()}
          </h3>
          <p className="text-green-100 text-sm mt-1">Total Revenue</p>
        </div>

        {/* Total Users */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <div className="flex items-center text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />+{data.userGrowth}%
            </div>
          </div>
          <h3 className="text-2xl font-bold">{data.totalUsers}</h3>
          <p className="text-blue-100 text-sm mt-1">Registered Users</p>
        </div>

        {/* Total Equipment */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8" />
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold">{data.totalEquipment}</h3>
          <p className="text-purple-100 text-sm mt-1">Total Equipment</p>
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
          <p className="text-orange-100 text-sm mt-1">Total Rentals</p>
        </div>
      </div>

      {/* Charts and Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Revenue Breakdown
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">
                  Equipment Rentals
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                ${(data.totalRevenue * 0.75).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">
                  Studio Bookings
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                ${(data.totalRevenue * 0.2).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">
                  Other Services
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                ${(data.totalRevenue * 0.05).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Popular Equipment */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Top Performing Equipment
          </h2>
          <div className="space-y-3">
            {[
              { name: "Canon EOS R5", rentals: 45, revenue: 6750 },
              { name: "Sony A7 III", rentals: 38, revenue: 5700 },
              { name: "Nikon Z6 II", rentals: 32, revenue: 4800 },
              { name: "DJI Ronin S", rentals: 28, revenue: 4200 },
              { name: "Godox AD600", rentals: 25, revenue: 3750 },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border-b border-gray-200 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.rentals} rentals
                  </p>
                </div>
                <span className="text-sm font-bold text-green-600">
                  ${item.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rental Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Rental Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Completion Rate */}
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {((data.completedRentals / data.totalRentals) * 100).toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-xs text-gray-500 mt-1">
              {data.completedRentals} of {data.totalRentals} completed
            </p>
          </div>

          {/* Average Rental Value */}
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              $
              {data.totalRentals > 0
                ? Math.round(data.totalRevenue / data.totalRentals)
                : 0}
            </div>
            <p className="text-sm text-gray-600">Avg. Rental Value</p>
            <p className="text-xs text-gray-500 mt-1">Per transaction</p>
          </div>

          {/* Active Utilization */}
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {((data.activeRentals / data.totalEquipment) * 100).toFixed(1)}%
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
