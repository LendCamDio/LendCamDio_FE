import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faStore,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faUserPlus,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { registerWithGoogle } from "../services/authService";
import { useUniqueToast } from "@/hooks/useUniqueToast";
import { useAuth } from "@/hooks/auth/useAuth";

export default function RegisterPage() {
  const { login } = useAuth();
  const showToast = useUniqueToast();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"Customer" | "Supplier">("Customer");
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>(
    {}
  );

  const togglePassword = (fieldId: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const selectUserType = (type: "Customer" | "Supplier") => {
    setUserType(type);
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (credentialResponse.credential) {
      try {
        const data = await registerWithGoogle(credentialResponse.credential);
        await login(data.token);
        showToast("Đăng ký thành công", "success");
        navigate("/");
      } catch (err) {
        const msgErr = (err as { response?: { data?: string } }).response
          ?.data as string;
        showToast(msgErr || "Đăng ký thất bại", "error");
      }
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      {/* User Type Selection */}
      <div className="user-type-selection mb-4">
        <div className="text-center mb-3">
          <h3>Chọn loại tài khoản</h3>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            Vui lòng chọn loại tài khoản để đăng nhập
          </p>
        </div>
        <div className="row">
          <div className="col-md-6 flex justify-center">
            <button
              type="button"
              className={`btn user-type-btn ${
                userType === "Customer" ? "active" : ""
              }`}
              onClick={() => selectUserType("Customer")}
            >
              <FontAwesomeIcon icon={faUser} />
              <small>Khách hàng</small>
            </button>
          </div>
          <div className="col-md-6 flex justify-center">
            <button
              type="button"
              className={`btn user-type-btn ${
                userType === "Supplier" ? "active" : ""
              }`}
              onClick={() => selectUserType("Supplier")}
            >
              <FontAwesomeIcon icon={faStore} />
              <small>Chủ studio</small>
            </button>
          </div>
        </div>
      </div>

      {/* Register Form */}
      <div className="auth-form">
        <div className="auth-header">
          <h2
            key={userType} // giúp React hiểu có 2 trạng thái khác nhau
            className="animate-fade-in-up"
          >
            {userType === "Customer"
              ? "Đăng ký khách hàng"
              : "Đăng ký chủ studio"}
          </h2>
          <p key={userType + "-desc"} className="animate-fade-in-up">
            {userType === "Customer"
              ? "Tạo tài khoản để đặt lịch studio và thuê thiết bị"
              : "Tạo tài khoản để quản lý studio của bạn"}
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="registerName" className="form-label">
              Họ và tên
            </label>
            <div className="input-group">
              <FontAwesomeIcon icon={faUser} />
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Nhập họ và tên"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="registerEmail" className="form-label">
              Email
            </label>
            <div className="input-group">
              <FontAwesomeIcon icon={faEnvelope} />
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Nhập email của bạn"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="registerPhone" className="form-label">
              Số điện thoại
            </label>
            <div className="input-group">
              <FontAwesomeIcon icon={faPhone} />
              <input
                type="tel"
                className="form-control"
                name="phone"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="registerPassword" className="form-label">
              Mật khẩu
            </label>
            <div className="input-group">
              <FontAwesomeIcon icon={faLock} />
              <input
                type={showPassword.registerPassword ? "text" : "password"}
                className="form-control"
                name="password"
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePassword("registerPassword")}
              >
                <FontAwesomeIcon
                  icon={showPassword.registerPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Xác nhận mật khẩu
            </label>
            <div className="input-group">
              <FontAwesomeIcon icon={faLock} />
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                className="form-control"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePassword("confirmPassword")}
              >
                <FontAwesomeIcon
                  icon={showPassword.confirmPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>
          </div>

          <div className="form-options">
            <div className="checkbox-group">
              <input type="checkbox" id="agreeTerms" required />
              <label htmlFor="agreeTerms">
                Tôi đồng ý với <a href="#">Điều khoản sử dụng</a> và{" "}
                <a href="#" className="text-[var(--primary-color)] underline">
                  Chính sách bảo mật
                </a>
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary auth-btn">
            <FontAwesomeIcon icon={faUserPlus} /> Đăng ký
          </button>
        </form>

        <div className="auth-divider">
          <span>Hoặc</span>
        </div>

        <div className="social-login">
          <GoogleLogin
            text="signup_with"
            onSuccess={handleGoogleSuccess}
            onError={() => console.log("Login Failed")}
          />
        </div>

        <div className="auth-footer">
          <p>
            Đã có tài khoản?{" "}
            <Link
              to="/auth/login"
              style={{
                color: "#3b82f6",
                textDecoration: "underline",
              }}
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
