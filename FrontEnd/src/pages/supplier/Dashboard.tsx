import { useAuth } from "@/hooks/auth/useAuth";
import { useAllEquipmentList } from "@/hooks/equipment/useEquipmentAdmin";
import { Package, Plus, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import Loading from "@/components/common/Loading/LoadingCircle";
import { formatCurrency } from "@/utils/currencyFormatter";

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch supplier's equipments
  const { data: equipmentData, isLoading } = useAllEquipmentList(
    1,
    100, // Fetch enough to calculate basic stats
    "all",
    "",
    user?.role === "Supplier" ? user.id : undefined
  );

  const equipments = equipmentData?.data?.items || [];
  const totalEquipments = equipmentData?.data?.total || 0;
  const activeEquipments = equipments.filter((e) => e.status === 0).length;
  const outOfStockEquipments = equipments.filter(
    (e) => e.stockQuantity === 0
  ).length;

  // Calculate average rating across all equipments
  const ratedEquipments = equipments.filter((e) => e.rating && e.rating > 0);
  const averageRating =
    ratedEquipments.length > 0
      ? ratedEquipments.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
        ratedEquipments.length
      : 0;

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.fullName || "Supplier"}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your store today.
          </p>
        </div>
        <Link
          to="/supplier/equipments"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add New Equipment
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Equipment"
          value={totalEquipments}
          icon={<Package className="w-6 h-6 text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="Active Listings"
          value={activeEquipments}
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          color="bg-green-50"
        />
        <StatCard
          title="Average Rating"
          value={averageRating.toFixed(1)}
          icon={<Star className="w-6 h-6 text-yellow-600" />}
          color="bg-yellow-50"
          subtext={`From ${ratedEquipments.length} rated items`}
        />
        <StatCard
          title="Out of Stock"
          value={outOfStockEquipments}
          icon={<Package className="w-6 h-6 text-red-600" />}
          color="bg-red-50"
          textColor="text-red-600"
        />
      </div>

      {/* Recent Equipment Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Recent Equipment</h2>
          <Link
            to="/supplier/equipments"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price/Day</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {equipments.slice(0, 5).map((item) => (
                <tr key={item.equipmentId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-10 h-10 rounded object-cover bg-gray-100"
                      />
                      <span className="truncate max-w-[200px]">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.categoryName}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {item.dailyPrice
                      ? formatCurrency(item.dailyPrice)
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-medium ${
                        item.stockQuantity > 0
                          ? "text-gray-900"
                          : "text-red-600"
                      }`}
                    >
                      {item.stockQuantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 0
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status === 0 ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
              {equipments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No equipment found. Start by adding your first item!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  color,
  textColor = "text-gray-900",
  subtext,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  textColor?: string;
  subtext?: string;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className={`text-2xl font-bold ${textColor}`}>{value}</h3>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
    <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
  </div>
);

export default Dashboard;
