import { useEffect, useState } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
} from "lucide-react";
import api from "@/services/api";
import {
  USER_ENDPOINTS,
  EQUIPMENT_ENDPOINTS,
  RENTAL_ENDPOINTS,
} from "@/constants/endpoints";
import { formatCurrency } from "@/utils/currencyFormatter";

//#region DashboardStats
interface DashboardStats {
  totalUsers: number;
  totalEquipment: number;
  totalRentals: number;
  totalRevenue: number;
  activeRentals: number;
  pendingOrders: number;
}
//#endregion

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalEquipment: 0,
    totalRentals: 0,
    totalRevenue: 0,
    activeRentals: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch users
      const usersRes = await api.get(USER_ENDPOINTS.LIST);
      const userData = usersRes.data?.data;
      const totalUsers = Array.isArray(userData)
        ? userData.length
        : userData?.items?.length || 0;

      // Fetch equipment
      const equipmentRes = await api.get(EQUIPMENT_ENDPOINTS.LIST);
      const totalEquipment = equipmentRes.data?.data?.items?.length || 0;

      // Fetch rentals
      const rentalsRes = await api.get(RENTAL_ENDPOINTS.GET_ALL);
      const totalRentals = rentalsRes.data?.data?.items?.length || 0;

      // Fetch active rentals
      const activeRentalsRes = await api.get(RENTAL_ENDPOINTS.GET_ACTIVE);
      const activeRentals = activeRentalsRes.data?.data?.items?.length || 0;

      setStats({
        totalUsers,
        totalEquipment,
        totalRentals,
        totalRevenue: 0, // Cần API tính revenue
        activeRentals,
        pendingOrders: 0, // Cần API orders
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
      trend: "+20%",
    },
    {
      title: "Equipment",
      value: stats.totalEquipment,
      icon: Package,
      color: "bg-green-500",
      trend: "+20%",
    },
    {
      title: "Active Rentals",
      value: stats.activeRentals,
      icon: Calendar,
      color: "bg-yellow-500",
      trend: "+20%",
    },
    {
      title: "Total Rentals",
      value: stats.totalRentals,
      icon: ShoppingCart,
      color: "bg-purple-500",
      trend: "+20%",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "bg-red-500",
      trend: "+20%",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: "bg-indigo-500",
      trend: "+20%",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">{card.trend}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    vs last month
                  </span>
                </div>
              </div>
              <div className={`${card.color} p-4 rounded-full`}>
                <card.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Rentals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Rentals
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-900">Canon EOS R5</p>
                <p className="text-sm text-gray-500">Customer: John Doe</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-900">Sony A7 III</p>
                <p className="text-sm text-gray-500">Customer: Jane Smith</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                Pending
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Nikon Z6 II</p>
                <p className="text-sm text-gray-500">Customer: Mike Johnson</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
              <Package className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">Add Equipment</p>
              <p className="text-xs text-gray-500">Create new item</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
              <Users className="w-6 h-6 text-green-600 mb-2" />
              <p className="font-medium text-gray-900">Manage Users</p>
              <p className="text-xs text-gray-500">View all users</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
              <Calendar className="w-6 h-6 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900">View Rentals</p>
              <p className="text-xs text-gray-500">Manage bookings</p>
            </button>
            <button className="p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-left">
              <DollarSign className="w-6 h-6 text-red-600 mb-2" />
              <p className="font-medium text-gray-900">View Revenue</p>
              <p className="text-xs text-gray-500">Financial reports</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
