import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOutAlt,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../hooks/auth/useAuth";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import { twMerge } from "tailwind-merge";

interface DropdownItem {
  label: string;
  to?: string;
  onClick?: () => void;
  icon: IconDefinition;
  className?: string;
}

export default function UserDropdown({ items }: { items: DropdownItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout, user } = useAuth();
  const showToast = useUniqueToast();
  // const userDetail = await

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    showToast("Đăng xuất thành công", "success", "logout-success");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="navbar-nav navbar-link login-btn-nav flex items-center"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FontAwesomeIcon icon={faUserCircle} className="text-lg mr-2" />
        <span className="hidden md:inline">{user?.email.split("@")[0]}</span>
        {/* <span className="hidden md:inline">{user?.fullName}</span> */}
        <span className="ml-1 border-t-4 border-l-4 border-r-4 border-t-current border-l-transparent border-r-transparent"></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-56 mt-2 origin-top-right animate-fadeInDown shadow-custom-lg bg-white rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
            <p className="text-sm font-medium text-white truncate">
              {user?.email}
            </p>
            <p className="text-xs text-white/80">Quyền: {user?.role}</p>
          </div>
          <div className="py-1">
            {items.map((item) => (
              <Link
                to={item.to || "#"}
                key={item.label}
                className={twMerge(
                  "flex items-center px-4 py-2 text-sm text-[var(--text-dark)] hover:bg-[rgba(59,130,246,0.1)] transition-colors duration-200",
                  item.className
                )}
                onClick={() => {
                  setIsOpen(false);
                  item.onClick?.();
                }}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="mr-3 w-4 h-4 text-[var(--primary-color)]"
                />
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 my-1"></div>
            <button
              className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
