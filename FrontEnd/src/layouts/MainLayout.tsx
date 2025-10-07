import Navbar from "../components/common/Navbar/Navbar";
import Footer from "../components/common/Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/common/PageWrapper";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="flex-grow animate-fade-in-up">
        <AnimatePresence mode="wait">
          <PageWrapper key={useLocation().pathname}>
            <Outlet /> {/* Render page content */}
          </PageWrapper>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
