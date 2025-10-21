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
  faHeart,
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
  { name: "Giỏ hàng", to: "/customer/cart", icon: faShoppingCart },
];

export default function Navbar() {
  const { token } = useAuth();

  return (
    <nav className="bg-white shadow-md animate-fade-in-down">
      <div className="container-nav mx-auto flex justify-between items-center py-2">
        <NavLink
          to="/"
          end
          className="navbar-brand text-blue-600 cursor-pointer hover:scale-101 transition"
        >
          <img src="/logo_transparent.png" alt="Logo" />
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
              items={[
                { label: "My Profile", to: "/customer/profile", icon: faUser },
                { label: "Settings", to: "/customer/settings", icon: faGear },
                {
                  label: "Orders",
                  to: "/customer/orders",
                  icon: faShoppingBag,
                },
                { label: "Cart", to: "/customer/cart", icon: faShoppingCart },
                { label: "Wishlist", to: "/customer/wishlist", icon: faHeart },
              ]}
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
