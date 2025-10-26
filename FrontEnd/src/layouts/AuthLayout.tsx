import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar/Navbar";
import Footer from "../components/common/Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faChartLine,
  faGift,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col animate-fade-in bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 lg:py-12">
        <section className="login-section">
          <div className="login-container">
            <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-3xl overflow-hidden shadow-2xl">
              {/* Left Column - Image */}
              <motion.div
                className="login-image relative overflow-hidden"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="login-image-content relative h-full">
                  <img
                    src="/Napo-unsplash.jpg"
                    alt="Login"
                    className="w-full h-full object-cover"
                  />
                  <div className="login-image-overlay absolute inset-0 bg-gradient-to-br from-blue-600/90 via-indigo-600/85 to-purple-600/90 flex flex-col justify-center items-start p-8 lg:p-12">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        Chào mừng đến với
                        <br />
                        <span className="text-yellow-300">LendCamDio</span>
                      </h3>
                      <p className="text-lg text-white/90 mb-8">
                        Trải nghiệm dịch vụ chụp ảnh chuyên nghiệp tốt nhất
                      </p>
                    </motion.div>

                    <div className="login-features space-y-4 w-full">
                      {[
                        {
                          icon: faCalendarCheck,
                          text: "Đặt lịch online dễ dàng",
                          delay: 0.4,
                        },
                        {
                          icon: faChartLine,
                          text: "Quản lý booking thuận tiện",
                          delay: 0.5,
                        },
                        {
                          icon: faGift,
                          text: "Tích điểm và ưu đãi độc quyền",
                          delay: 0.6,
                        },
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          className="feature-item flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: feature.delay, duration: 0.5 }}
                          whileHover={{ x: 10 }}
                        >
                          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FontAwesomeIcon
                              icon={feature.icon}
                              className="text-white text-xl"
                            />
                          </div>
                          <span className="text-white font-medium">
                            {feature.text}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-20 left-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl"></div>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Form */}
              <motion.div
                className="login-form-section bg-white p-8 lg:p-12 flex items-center justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="login-form-container w-full max-w-md">
                  <Outlet />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
