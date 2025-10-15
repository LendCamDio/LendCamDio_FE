import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { loginWithGoogle, loginWithEmail } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginSchema } from "@/utils/validations/LoginSchema";
import { FormField } from "@/components/ui/Form/FormField";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/types/index.type";

export default function LoginPage() {
  const { login, logout } = useAuth();
  const showToast = useUniqueToast();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"Customer" | "Supplier">("Customer");
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>(
    {}
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginSchema>({
    mode: "onBlur",
    delayError: 400,
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (credentialResponse.credential) {
      showToast("Đang xử lý đăng nhập...", "info");
      const result = await loginWithGoogle(
        credentialResponse.credential,
        userType
      );

      if (result.success && result.data) {
        const decoded = jwtDecode<JwtPayload>(result.data.token);
        if (
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] !== userType
        ) {
          logout();
          showToast("Vui lòng chọn đúng loại tài khoản", "error", {
            allowSpam: true,
          });
        } else {
          login(result.data.token, false);
          showToast("Đăng nhập thành công", "success");
          navigate("/");
        }
      } else {
        const errorMessage = result.error?.message || "Đăng ký thất bại";
        showToast(errorMessage, "error");
      }
    }
  };

  const handleEmailLogin = async (data: LoginSchema) => {
    showToast("Đang xử lý đăng nhập...", "info");
    const result = await loginWithEmail(data.email, data.password, userType);
    if (result.success && result.data) {
      login(result.data.token, data.rememberMe ? true : false);
      showToast("Đăng nhập thành công", "success");
      navigate("/");
    } else {
      const errorMessage = result.error?.message || "Đăng nhập thất bại";
      showToast(errorMessage, "error");
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

  // Tự động điền email nếu đã nhớ trước đó
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setValue("email", rememberedEmail); // Tự động điền email
      setValue("rememberMe", true); // Tự động check vào ô
    }
  }, [setValue]);

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

        <form onSubmit={handleSubmit(handleEmailLogin)} noValidate>
          <FormField label="Email" error={errors.email} classNameField="mb-4">
            <div className="input-group">
              <FontAwesomeIcon icon={faEnvelope} />
              <input
                {...register("email")}
                type="email"
                placeholder="Nhập email của bạn"
              />
            </div>
          </FormField>

          <FormField
            label="Mật khẩu"
            error={errors.password}
            classNameField="mb-10"
          >
            <div className="input-group">
              <FontAwesomeIcon icon={faLock} />
              <input
                {...register("password")}
                type={showPassword.password ? "text" : "password"}
                placeholder="Nhập mật khẩu"
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
          </FormField>

          <div className="form-options">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="rememberMe"
                {...register("rememberMe")}
              />
              <label htmlFor="rememberMe">Nhớ đăng nhập</label>
            </div>
            <Link to="/auth/forgot-password" className="forgot-password">
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            className="btn-primary auth-btn"
            disabled={isSubmitting}
          >
            <FontAwesomeIcon icon={faSignInAlt} />
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
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
