import { Outlet, useLocation } from "react-router-dom";
import { lazy, useEffect } from "react";

const Navbar = lazy(() => import("@/components/common/Navbar/Navbar"));
const Footer = lazy(() => import("@/components/common/Footer/Footer"));
const ChatBox = lazy(() => import("@/components/common/ChatBox/ChatBox"));

const MainLayout = () => {
  const location = useLocation();
  useEffect(() => {
    // Luôn thêm kiểm tra typeof window để an toàn trong SSR
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [location.pathname]);
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="flex-grow min-page-height">
        <Outlet /> {/* Render page content */}
      </main>

      <ChatBox />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
