import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { loginWithGoogle, loginWithEmail } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faStore,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useUniqueToast } from "@/hooks/useUniqueToast";
import { useAuth } from "@/hooks/auth/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const showToast = useUniqueToast();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"Customer" | "Supplier">("Customer");
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (credentialResponse.credential) {
      showToast("Đang xử lý đăng nhập...", "info");
      try {
        const data = await loginWithGoogle(credentialResponse.credential);
        console.log("API response:", data); // Debug log

        if (!data.data.token) {
          throw new Error("No token received from server");
        }

        // Đợi login hoàn thành (token + user được set)
        await login(data.data.token);
        showToast("Đăng nhập thành công", "success");
        navigate("/");
      } catch (err) {
        const msgErr = (err as { response?: { data?: string } }).response
          ?.data as string;
        console.error("Google login failed:", msgErr || err);
        showToast(`Đăng nhập thất bại: ${msgErr || "Unknown error"}`, "error");
      }
    }
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      showToast("Đang xử lý đăng nhập...", "info");
      const data = await loginWithEmail(email, password);
      console.log("API response:", data); // Debug log

      if (!data.token) {
        throw new Error("No token received from server");
      }

      await login(data.token);
      showToast("Đăng nhập thành công", "success");
      navigate("/");
    } catch (err) {
      const msgErr = (err as { response?: { data?: string } }).response
        ?.data as string;
      console.error("Email login failed:", err);
      showToast(`Đăng nhập thất bại: ${msgErr || "Unknown error"}`, "error");
    }
  };

  const togglePassword = (fieldId: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const selectUserType = (type: "Customer" | "Supplier") => {
    setUserType(type);
  };

  return (
    <div className="m-4">
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

      {/* Login Form */}
      <div className="auth-form">
        <div className="auth-header">
          <h2
            key={userType} // giúp React hiểu có 2 trạng thái khác nhau
            className="animate-fade-in-up"
          >
            {userType === "Customer"
              ? "Đăng nhập khách hàng"
              : "Đăng nhập chủ studio"}
          </h2>
          <p key={userType + "-desc"} className="animate-fade-in-up">
            {userType === "Customer"
              ? "Đăng nhập để đặt lịch studio và thuê thiết bị"
              : "Đăng nhập để quản lý studio của bạn"}
          </p>
        </div>

        <form onSubmit={handleEmailLogin}>
          <div className="form-group">
            <label htmlFor="loginEmail" className="form-label">
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
            <label htmlFor="loginPassword" className="form-label">
              Mật khẩu
            </label>
            <div className="input-group">
              <FontAwesomeIcon icon={faLock} />
              <input
                type={showPassword.password ? "text" : "password"}
                className="form-control"
                name="password"
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePassword("password")}
              >
                <FontAwesomeIcon
                  icon={showPassword.password ? faEyeSlash : faEye}
                />
              </button>
            </div>
          </div>

          <div className="form-options">
            <div className="checkbox-group">
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe">Nhớ đăng nhập</label>
            </div>
            <Link to="/auth/forgot-password" className="forgot-password">
              Quên mật khẩu?
            </Link>
          </div>

          <button type="submit" className="btn-primary auth-btn">
            <FontAwesomeIcon icon={faSignInAlt} /> Đăng nhập
          </button>
        </form>

        <div className="auth-divider">
          <span>Hoặc</span>
        </div>

        <div className="social-login">
          <GoogleLogin
            locale="vi"
            onSuccess={handleGoogleSuccess}
            onError={() => console.log("Login Failed")}
          />
        </div>

        <div className="auth-footer">
          <p>
            Chưa có tài khoản?{" "}
            <Link
              to="/auth/register"
              style={{
                color: "#3b82f6",
                textDecoration: "underline",
              }}
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
