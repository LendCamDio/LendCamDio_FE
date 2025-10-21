import { useMutation, useQuery } from "@tanstack/react-query";
import { changePassword, verifyEmail } from "@/services/authService";
import type { ApiResponse } from "@/types/entity.type";

// ============================
// 🔒 CHANGE PASSWORD HOOK
// ============================

export const useChangePassword = () => {
  return useMutation<
    ApiResponse<object>,
    Error,
    { oldPassword: string; newPassword: string }
  >({
    mutationFn: async ({ oldPassword, newPassword }) => {
      const res = await changePassword({ oldPassword, newPassword });
      if (!res.success)
        throw new Error(res.error?.message || "Đổi mật khẩu thất bại");
      return res;
    },
    onSuccess: () => {
      console.log("Password changed successfully");
    },
    onError: (error) => {
      console.error(error.message || "Đổi mật khẩu thất bại");
    },
  });
};

// ============================
// ✉️ VERIFY EMAIL HOOK
// ============================

export const useVerifyEmail = (email: string, token: string) => {
  return useQuery({
    queryKey: ["verifyEmail"],
    queryFn: () => verifyEmail(email, token),
    enabled: Boolean(email && token),
    retry: 1,
    refetchOnWindowFocus: false, // don't refetch when window regains focus
  });
};
