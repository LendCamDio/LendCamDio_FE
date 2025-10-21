import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faUserPlus,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { registerWithGoogle, registerWithEmail } from "../services/authService";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import { useAuth } from "@/hooks/auth/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterSchema,
} from "@/utils/validations/RegisterSchema";
import { FormField } from "@/components/ui/Form/FormField";
export default function RegisterPage() {
  const { user } = useAuth();
  const showToast = useUniqueToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>(
    {}
  );

  if (user) {
    navigate("/");
  }
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterSchema>({
    mode: "onChange",
    resolver: zodResolver(registerSchema),
  });

  const togglePassword = (fieldId: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  // In Register.tsx
  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (credentialResponse.credential) {
      const result = await registerWithGoogle(credentialResponse.credential);

      if (result.success && result.data) {
        showToast("Đăng ký thành công", "success");
        navigate("/auth/login");
      } else {
        const errorMessage = result.error?.message || "Đăng ký thất bại";
        showToast(errorMessage, "error");
      }
    }
    reset();
  };
  const handleRegister = async (data: RegisterSchema) => {
    showToast("Đang xử lý...", "info");
    const result = await registerWithEmail({
      fullName: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone || "",
      role: "Customer",
    });
    if (result.success && result.data) {
      showToast("Đăng ký thành công", "success");
      navigate("/auth/login");
    } else {
      const errorMessage = result.error?.message || "Đăng ký thất bại";
      showToast(errorMessage, "error");
    }
    reset();
  };

  useEffect(() => {
    if (user) {
      // User is already logged in, redirect to home or dashboard
      navigate("/");
      showToast("You're already logged in", "info");
    }
  }, [user, navigate, showToast]);

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
          <div className="col-12">
            <button type="button" className={`btn user-type-btn active`}>
              <FontAwesomeIcon icon={faUser} />
              <small>Khách hàng</small>
            </button>
          </div>
        </div>
      </div>

      {/* Register Form */}
      <div className="auth-form">
        <div className="auth-header">
          <h2 className="animate-fade-in-up">Đăng ký khách hàng</h2>
          <p className="animate-fade-in-up">
            Tạo tài khoản để đặt lịch studio và thuê thiết bị"
          </p>
        </div>

        <form noValidate onSubmit={handleSubmit(handleRegister)}>
          <FormField
            label="Họ tên"
            error={errors.name}
            classNameField="form-group"
            classNameLabel="form-label"
          >
            <div className="input-group">
              <FontAwesomeIcon icon={faUser} />
              <input {...register("name")} placeholder="Nhập họ tên của bạn" />
            </div>
          </FormField>

          <FormField
            label="Email"
            error={errors.email}
            classNameField="form-group"
            classNameLabel="form-label"
          >
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
            label="Số điện thoại"
            error={errors.phone}
            classNameField="form-group"
            classNameLabel="form-label"
          >
            <div className="input-group">
              <FontAwesomeIcon icon={faPhone} />
              <input
                {...register("phone")}
                type="tel"
                placeholder="Nhập số điện thoại"
              />
            </div>
          </FormField>

          <FormField
            label="Mật khẩu"
            error={errors.password}
            classNameField="form-group"
            classNameLabel="form-label"
          >
            <div className="input-group">
              <FontAwesomeIcon icon={faLock} />
              <input
                {...register("password")}
                type={showPassword.registerPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => {
                  togglePassword("registerPassword");
                }}
              >
                <FontAwesomeIcon
                  icon={showPassword.registerPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>
          </FormField>

          <FormField
            label="Xác nhận mật khẩu"
            error={errors.confirmPassword}
            classNameField="form-group"
            classNameLabel="form-label"
          >
            <div className="input-group">
              <FontAwesomeIcon icon={faLock} />
              <input
                {...register("confirmPassword")}
                type={showPassword.confirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => {
                  togglePassword("confirmPassword");
                }}
              >
                <FontAwesomeIcon
                  icon={showPassword.confirmPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>
          </FormField>

          <div className="form-options">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="agreeTerms"
                {...register("agreeToTerms")}
              />
              <label htmlFor="agreeTerms">
                <FormField
                  label=""
                  error={errors.agreeToTerms}
                  classNameField="inline-block m-0 p-0"
                  classNameLabel="m-0 p-0"
                >
                  <p>
                    Tôi đồng ý với{" "}
                    <a
                      href="#"
                      className="text-[var(--primary-color)] underline"
                    >
                      Điều khoản sử dụng
                    </a>{" "}
                    và{" "}
                    <a
                      href="#"
                      className="text-[var(--primary-color)] underline"
                    >
                      Chính sách bảo mật
                    </a>
                  </p>
                </FormField>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary auth-btn"
            disabled={isSubmitting}
          >
            <FontAwesomeIcon icon={faUserPlus} />
            {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <div className="auth-divider">
          <span>Hoặc</span>
        </div>

        <div className="social-login">
          <GoogleLogin
            text="signup_with"
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log("Login Failed");
            }}
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
