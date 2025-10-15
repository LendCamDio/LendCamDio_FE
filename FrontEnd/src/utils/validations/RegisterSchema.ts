import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.email().min(1, "Email không được để trống"),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^(\+84|0)[3|5|7|8|9][0-9]{8}$/.test(val),
        "Số điện thoại không đúng định dạng"
      ),
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    agreeToTerms: z.literal(true, {
      message: "Bạn phải đồng ý với điều khoản",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
