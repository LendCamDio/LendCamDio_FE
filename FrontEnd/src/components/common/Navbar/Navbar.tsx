import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHome,
  faCalendar,
  faCamera,
  faBox,
  faCalendarCheck,
  faEnvelope,
  faShoppingCart,
  faGear,
  faShoppingBag,
  faShieldAlt,
  faChartLine,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "@/hooks/auth/useAuth";
import UserDropdown from "./UserDropdown";

const NAV_ITEMS = [
  { name: "Trang chủ", to: "/", icon: faHome },
  { name: "Đặt lịch Studio", to: "/studios", icon: faCalendar },
  { name: "Thuê máy ảnh", to: "/cameras", icon: faCamera },
  { name: "Sản phẩm", to: "/products", icon: faBox },
  {
    name: "Lịch của tôi",
    to: "/customer/booking-history",
    icon: faCalendarCheck,
  },
  { name: "Liên hệ", to: "/contact", icon: faEnvelope },
  { name: "Giỏ hàng", to: "/cart", icon: faShoppingCart },
];

export default function Navbar() {
  const { token, role } = useAuth();
  const isAdmin = role?.toLowerCase() === "admin";

  return (
    <nav className="bg-white shadow-md animate-fade-in-down">
      <div className="container-nav mx-auto flex justify-between items-center py-2">
        <NavLink
          to="/"
          end
          className="navbar-brand text-blue-600 cursor-pointer hover:scale-101 transition"
        >
          <img src="/logo_byHop-Photoroom.png" alt="Logo" />
        </NavLink>
        <div className="flex navbar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              end
              to={item.to}
              className={`nav-link text-gray-700 hover:text-blue-600 transition nav-link ${
                item.name === "Giỏ hàng" ? "cart-link" : ""
              }`}
            >
              <FontAwesomeIcon icon={item.icon} />
              <span className="nav-text">{item.name}</span>
            </NavLink>
          ))}
          {token ? (
            <UserDropdown
              items={
                isAdmin
                  ? [
                      // Admin dropdown items
                      {
                        label: "Admin Dashboard",
                        to: "/admin/dashboard",
                        icon: faShieldAlt,
                      },
                      {
                        label: "Manage Users",
                        to: "/admin/users",
                        icon: faUsers,
                      },
                      {
                        label: "Analytics",
                        to: "/admin/analytics",
                        icon: faChartLine,
                      },
                      {
                        label: "Customer Profile",
                        to: "/customer/profile",
                        icon: faUser,
                      },
                      {
                        label: "Settings",
                        to: "/customer/settings",
                        icon: faGear,
                      },
                    ]
                  : [
                      // Customer/Supplier dropdown items
                      {
                        label: "My Profile",
                        to: "/customer/profile",
                        icon: faUser,
                      },
                      {
                        label: "Settings",
                        to: "/customer/settings",
                        icon: faGear,
                      },
                      {
                        label: "Orders",
                        to: "/customer/orders",
                        icon: faShoppingBag,
                      },
                      {
                        label: "Cart",
                        to: "/cart",
                        icon: faShoppingCart,
                      },
                    ]
              }
            />
          ) : (
            <NavLink
              to="/auth/login"
              className="navbar-nav navbar-link login-btn-nav"
            >
              <FontAwesomeIcon icon={faUser} />
              <span className="nav-text">Login</span>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
