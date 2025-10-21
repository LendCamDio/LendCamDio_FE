import z from "zod";

const profileSchema = z.object({
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bio: z.string().max(500, "Tiểu sử không được vượt quá 500 ký tự").optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải chứa chữ hoa, chữ thường và số"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ProfileSchema = z.infer<typeof profileSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;
export { profileSchema, passwordSchema };
