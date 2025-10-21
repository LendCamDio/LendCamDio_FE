import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Mail,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import { useVerifyEmail } from "@/hooks/auth/useAuthActions";

type VerificationStatus = "loading" | "success" | "error" | "expired";

const VerifyEmail = () => {
  const showToast = useUniqueToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [countdown, setCountdown] = useState(5);
  const [isResending, setIsResending] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const {
    data: verificationData,
    isLoading,
    isError,
    error,
  } = useVerifyEmail(email || "", token || "");

  useEffect(() => {
    if (isLoading) {
      setStatus("loading");
    } else if (verificationData?.success) {
      console.log("Email verified:", verificationData);
      setStatus("success");
      showToast("Email xác thực thành công!", "success");
    } else if (isError) {
      const message = error?.message || verificationData?.error?.message || "";
      // check if it's an expired token based on message or code
      if (message.includes("expired") || message.includes("hết hạn")) {
        setStatus("expired");
      } else {
        setStatus("error");
      }
      showToast(message || "Xác thực email thất bại", "error");
    }
  }, [isLoading, isError, verificationData, error, showToast]);

  // ✅ Countdown for redirect on success
  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === "success" && countdown === 0) {
      navigate("/auth/login");
    }
  }, [status, countdown, navigate]);

  // ✅ Handle resend (dummy for now)
  const handleResendEmail = async () => {
    if (!email) {
      showToast("Không tìm thấy địa chỉ email", "error");
      return;
    }

    setIsResending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showToast("Email xác thực đã được gửi lại!", "success");
    } catch (err) {
      showToast("Có lỗi xảy ra khi gửi lại email", "error");
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--primary-color)] to-[var(--secondary-color)] mb-6 shadow-glow">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-dark)] mb-3">
              Đang xác thực email...
            </h1>
            <p className="text-[var(--text-light)] text-lg">
              Vui lòng đợi trong giây lát
            </p>
            <div className="mt-8">
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-[var(--primary-color)] rounded-full animate-bounce" />
                <div
                  className="w-3 h-3 bg-[var(--primary-color)] rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-3 h-3 bg-[var(--primary-color)] rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </motion.div>
        );

      case "success":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--success-color)] to-green-400 mb-6 shadow-lg"
            >
              <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
            </motion.div>
            <h1 className="text-3xl font-bold text-[var(--text-dark)] mb-3">
              Xác thực thành công!
            </h1>
            <p className="text-[var(--text-light)] text-lg mb-2">
              Email của bạn đã được xác thực thành công
            </p>
            <p className="text-[var(--text-light)] mb-8">
              Bạn sẽ được chuyển đến trang đăng nhập trong{" "}
              <span className="font-bold text-[var(--primary-color)] text-xl">
                {countdown}
              </span>{" "}
              giây
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="btn-primary px-8 py-3 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
              >
                Đăng nhập ngay
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-white text-[var(--primary-color)] border-2 border-[var(--primary-color)] rounded-lg hover:bg-[var(--bg-light)] transition-all duration-300 font-semibold"
              >
                Về trang chủ
              </motion.button>
            </div>

            {/* Success Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex justify-center gap-2"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0 }}
                  animate={{ y: [-10, 0, -10] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  className="w-2 h-2 bg-[var(--success-color)] rounded-full"
                />
              ))}
            </motion.div>
          </motion.div>
        );

      case "expired":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--warning-color)] to-orange-400 mb-6 shadow-lg">
              <Mail className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-dark)] mb-3">
              Liên kết đã hết hạn
            </h1>
            <p className="text-[var(--text-light)] text-lg mb-8">
              Liên kết xác thực của bạn đã hết hạn hoặc không hợp lệ.
              <br />
              Vui lòng yêu cầu gửi lại email xác thực.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResendEmail}
                disabled={isResending}
                className="btn-primary px-8 py-3 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Gửi lại email
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-white text-[var(--text-dark)] border-2 border-gray-200 rounded-lg hover:bg-[var(--bg-light)] transition-all duration-300 font-semibold"
              >
                Về trang chủ
              </motion.button>
            </div>

            {email && (
              <p className="mt-6 text-sm text-[var(--text-light)]">
                Email sẽ được gửi đến:{" "}
                <span className="font-semibold text-[var(--text-dark)]">
                  {email}
                </span>
              </p>
            )}
          </motion.div>
        );

      case "error":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--error-color)] to-red-400 mb-6 shadow-lg">
              <XCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-dark)] mb-3">
              Xác thực thất bại
            </h1>
            <p className="text-[var(--text-light)] text-lg mb-8">
              Có lỗi xảy ra trong quá trình xác thực email.
              <br />
              Vui lòng thử lại hoặc liên hệ hỗ trợ.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="btn-primary px-8 py-3 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Thử lại
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
                className="px-8 py-3 bg-white text-[var(--text-dark)] border-2 border-gray-200 rounded-lg hover:bg-[var(--bg-light)] transition-all duration-300 font-semibold"
              >
                Đăng ký lại
              </motion.button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-light)] via-white to-blue-50 flex items-center justify-center px-4 py-12">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl"
      >
        {/* Back Button */}
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="mb-6 flex items-center gap-2 text-[var(--text-light)] hover:text-[var(--primary-color)] transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Quay lại trang chủ</span>
          </motion.button>
        </Link>

        <div className="card bg-white rounded-2xl shadow-custom-xl p-8 md:p-12 border border-gray-100">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-[var(--text-light)]">
            Cần hỗ trợ?{" "}
            <Link
              to="/contacts"
              className="text-[var(--primary-color)] hover:text-[var(--secondary-color)] font-semibold transition-colors"
            >
              Liên hệ với chúng tôi
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
