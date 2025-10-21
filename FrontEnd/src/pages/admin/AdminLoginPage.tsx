// pages/Admin-login.tsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faSignInAlt,
  faShieldAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import { useAuth } from "@/hooks/auth/useAuth";
import { loginWithEmail, loginWithGoogle } from "@/services/authService";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { loginSchema, type LoginSchema } from "@/utils/validations/LoginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/Form/FormField";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const showToast = useUniqueToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    mode: "onBlur",
    delayError: 400,
    resolver: zodResolver(loginSchema),
  });

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (credentialResponse.credential) {
      setLoading(true);
      showToast("Processing admin login...", "info");
      const result = await loginWithGoogle(
        credentialResponse.credential,
        "Admin"
      );

      if (result.success && result.data) {
        login(result.data.token, false);
        showToast("Admin login successful", "success");
        navigate("/admin");
      } else {
        const errorMessage = result.error?.message || "Login failed";
        showToast(errorMessage, "error");
      }
      setLoading(false);
    }
  };

  const handleAdminLogin = async (data: LoginSchema) => {
    setLoading(true);
    showToast("Đang xử lý đăng nhập admin...", "info");

    // Gửi userType: "Admin" lên server
    const result = await loginWithEmail(data.email, data.password, "Admin");

    if (result.success && result.data) {
      login(result.data.token, false);
      showToast("Đăng nhập admin thành công", "success");
      navigate("/admin"); // Chuyển hướng đến admin dashboard
    } else {
      const errorMessage = result.error?.message || "Đăng nhập thất bại";
      showToast(errorMessage, "error");
    }
    setLoading(false);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 border border-gray-100">
          {/* Admin Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4 shadow-sm">
              <FontAwesomeIcon
                icon={faShieldAlt}
                className="text-blue-800 text-2xl"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Cổng đăng nhập quản trị viên
            </h1>
            <p className="text-gray-600 text-sm">
              Đăng nhập an toàn cho quản trị viên hệ thống
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit(handleAdminLogin)}
            className="space-y-5"
            noValidate
          >
            {/* Email Field */}
            <FormField
              label="Email Address"
              error={errors.email}
              classNameLabel="block text-sm font-medium text-gray-700 mb-2"
            >
              <div className="relative">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-3 top-4 text-gray-500"
                />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm outline-none"
                />
              </div>
            </FormField>

            {/* Password Field */}
            <FormField
              label="Password"
              error={errors.password}
              classNameLabel="block text-sm font-medium text-gray-700 mb-2"
            >
              <div className="relative">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-3 top-4 text-gray-500"
                />
                <input
                  {...register("password")}
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm outline-none"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </FormField>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <a
                href="#"
                className="text-blue-700 hover:text-blue-800 font-medium"
              >
                Quên mật khẩu?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white font-medium py-2.5 rounded-md flex items-center justify-center gap-2 transition duration-200 shadow-sm"
            >
              <FontAwesomeIcon icon={faSignInAlt} />
              {loading || isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
            </button>

            <div className="flex items-center justify-between mb-4">
              <div className="w-5/12 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-500">Or</span>
              <div className="w-5/12 h-px bg-gray-200"></div>
            </div>

            <GoogleLogin
              theme="outline"
              text="signin_with"
              shape="rectangular"
              locale="vi"
              onSuccess={handleGoogleSuccess}
              onError={() => showToast("Google authentication failed", "error")}
            />
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-50 border-l-4 border-amber-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="text-amber-500 h-5 w-5"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  <strong className="font-medium">Cảnh báo:</strong> Đây là một
                  điểm truy cập quản trị hạn chế. Các nỗ lực truy cập trái phép
                  sẽ được ghi lại và báo cáo.
                </p>
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-gray-600 hover:text-blue-700 font-medium"
            >
              ← Quay lại trang chính
            </a>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-xs text-gray-400">© 2025 System Administration</p>
        </div>
      </div>
    </div>
  );
}
