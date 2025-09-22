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
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const NAV_ITEMS = [
  { name: "Trang chủ", to: "/", icon: faHome },
  { name: "Đặt lịch Studio", to: "/studio-booking", icon: faCalendar },
  { name: "Thuê máy ảnh", to: "/camera-rental", icon: faCamera },
  { name: "Sản phẩm", to: "/products", icon: faBox },
  { name: "Lịch của tôi", to: "/my-booking", icon: faCalendarCheck },
  { name: "Liên hệ", to: "/contact", icon: faEnvelope },
  { name: "Giỏ hàng", to: "/cart", icon: faShoppingCart },
];

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container-nav mx-auto flex justify-between items-center py-4">
        <NavLink
          style={{ backgroundColor: "red" }}
          to="/"
          end
          className="navbar-brand text-blue-600 hover:scale-101 transition"
        >
          <img src="/vite.svg" alt="Logo" /> LendCamDio
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
          <NavLink
            to="/auth/login"
            className="navbar-nav navbar-link login-btn-nav"
          >
            <FontAwesomeIcon icon={faUser} />
            <span className="nav-text">Login</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
