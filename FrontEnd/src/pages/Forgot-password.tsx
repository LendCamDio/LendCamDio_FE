import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function ForgotPasswordPage() {
  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle forgot password logic here
    console.log("Forgot password form submitted");
  };

  return (
    <div>
      {/* Forgot Password Form */}
      <div className="auth-form">
        <div className="auth-header">
          <h2>Quên mật khẩu</h2>
          <p>Nhập email để khôi phục mật khẩu</p>
        </div>

        <form onSubmit={handleForgotPassword}>
          <div className="form-group">
            <label htmlFor="forgotEmail" className="form-label">
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

          <button type="submit" className="btn-primary auth-btn">
            <FontAwesomeIcon icon={faPaperPlane} /> Gửi email khôi phục
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Nhớ lại mật khẩu?{" "}
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
