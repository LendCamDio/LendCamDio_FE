import Navbar from "../components/common/Navbar/Navbar";
import Footer from "../components/common/Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { ChatBox } from "@/components/common/ChatBox";
import { useEffect } from "react";

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
