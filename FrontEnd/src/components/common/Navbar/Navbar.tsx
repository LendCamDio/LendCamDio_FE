import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const NAV_ITEMS = [
  { name: "Home", to: "/" },
  { name: "Products", to: "/products" },
  { name: "About", to: "/about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[color:var(--color-background)] border-b border-[color:var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/vite.svg" alt="LendCamDio Logo" className="h-8 w-8" />
            <span className="font-display font-bold text-lg text-[color:var(--color-text-primary)]">
              LendCamDio
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Other */}
            {NAV_ITEMS.map((item) => (
              <Link key={item.name} to={item.to} className="navTitle">
                {item.name}
              </Link>
            ))}
            {/* Login */}
            <Link to="/auth/login" className="btn-primary ml-4 inline-block">
              Login
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden text-[color:var(--color-text-primary)]"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
          <div className="px-4 py-3 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="block text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-accent)] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
