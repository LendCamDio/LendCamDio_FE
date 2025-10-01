import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar/Navbar";
import Footer from "../components/common/Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in-up">
        <section className="login-section">
          <div className="login-container row">
            {/* Left Column - Image */}
            <div className="col-md-6 login-image">
              <div className="login-image-content">
                <img
                  src="https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Login"
                />
                <div className="login-image-overlay">
                  <h3>Chào mừng đến với LENSCAMDIO</h3>
                  <p>Trải nghiệm dịch vụ chụp ảnh chuyên nghiệp tốt nhất</p>
                  <div className="login-features">
                    <div className="feature-item">
                      <FontAwesomeIcon icon={faUser} />
                      <span>Đặt lịch online dễ dàng</span>
                    </div>
                    <div className="feature-item">
                      <FontAwesomeIcon icon={faUser} />
                      <span>Quản lý booking thuận tiện</span>
                    </div>
                    <div className="feature-item">
                      <FontAwesomeIcon icon={faUser} />
                      <span>Tích điểm và ưu đãi độc quyền</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="col-md-6 login-form-section">
              <div className="login-form-container animate-fade-in-up">
                <Outlet />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
