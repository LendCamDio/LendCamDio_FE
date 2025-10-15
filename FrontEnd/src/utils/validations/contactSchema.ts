import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z
    .string()
    .nonempty("Email không được để trống")
    .refine(
      (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Email không đúng định dạng"
    ),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\+84|0)[3|5|7|8|9][0-9]{8}$/.test(val),
      "Số điện thoại không đúng định dạng"
    ),
  subject: z.string().min(3, "Chủ đề quá ngắn"),
  message: z.string().min(10, "Nội dung quá ngắn"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
