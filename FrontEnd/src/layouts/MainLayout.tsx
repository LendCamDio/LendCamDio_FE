import Navbar from "../components/common/Navbar/Navbar";
import Footer from "../components/common/Footer/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-sm border-b">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in-up">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-surface border-t border-border">
        <Footer />
      </footer>
    </div>
  );
};

export default MainLayout;
