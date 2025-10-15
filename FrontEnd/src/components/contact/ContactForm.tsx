import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  type ContactFormData,
} from "@/utils/validations/contactSchema";
import { FormField } from "../ui/Form/FormField";

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const scrollToSection = (id: string) => {
    const navbarHeight = 80; // Đúng chiều cao thật của Navbar
    const element = document.getElementById(id);

    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // 3️⃣ Hàm submit
  const onSubmit = async (data: ContactFormData) => {
    console.log("Form gửi:", data);
    // Gửi API
    // await api.post("/contact", data);
    reset();
  };
  return (
    <div className="card-outstanding p-6" id="contact">
      <h4 className="text-2xl font-bold text-[var(--text-dark)] mb-6">
        Gửi tin nhắn cho chúng tôi
      </h4>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* Họ tên */}
        <FormField label="Họ tên" error={errors.name} classNameField="mb-3">
          <input
            {...register("name")}
            className="form-control"
            onClick={() => scrollToSection("contact")}
          />
        </FormField>

        {/* Email */}
        <FormField label="Email" error={errors.email} classNameField="mb-3">
          <input
            {...register("email")}
            className="form-control"
            onClick={() => scrollToSection("contact")}
          />
        </FormField>

        {/* Số điện thoại */}
        <FormField
          label="Số điện thoại (không bắt buộc)"
          error={errors.phone}
          classNameField="mb-3"
        >
          <input
            {...register("phone")}
            className="form-control"
            onClick={() => scrollToSection("contact")}
          />
        </FormField>

        {/* Chủ đề */}
        <FormField label="Chủ đề" error={errors.subject} classNameField="mb-3">
          <input
            type="text"
            {...register("subject")}
            className="form-control"
            onClick={() => scrollToSection("contact")}
            placeholder="Chủ đề liên hệ"
          />
        </FormField>

        {/* Tin nhắn */}
        <FormField
          label="Tin nhắn"
          error={errors.message}
          classNameField="mb-3"
        >
          <textarea
            {...register("message")}
            rows={5}
            className="form-control resize-y h-[5em] max-h-[14em] max-w-[33em]"
            placeholder="Nhập nội dung tin nhắn của bạn..."
            onClick={() => scrollToSection("contact")}
          />
        </FormField>

        {/* Nút gửi */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full mt-2"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
