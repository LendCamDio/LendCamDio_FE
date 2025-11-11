import { motion } from "framer-motion";
import PageWrapper from "@/components/common/PageTransaction/PageWrapper";
import DashboardSection from "./DashboardSection";

const Dashboard = () => {
  return (
    <PageWrapper>
      <div className="min-page-height bg-[var(--bg-light)]">
        {/* Hero Section */}
        <section className="hero py-8 md:py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-dark)] mb-4">
                Dashboard của bạn
              </h1>
              <p className="text-lg md:text-xl text-[var(--text-light)] max-w-2xl mx-auto">
                Quản lý và theo dõi tất cả hoạt động của bạn
              </p>
            </motion.div>
          </div>
        </section>

        {/* Dashboard Content */}
        <DashboardSection />
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
