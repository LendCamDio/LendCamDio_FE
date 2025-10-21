import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Clock,
  StickyNote,
  X,
  MapPin,
  DollarSign,
} from "lucide-react";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import type { CreateRentalRequestDto, Equipment } from "@/types/entity.type";
import { useCreateRental } from "@/hooks/rental/useRental";
import { useAuth } from "@/hooks/auth/useAuth";
import { useCustomerByUserId } from "@/hooks/customer/useCustomer";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  studio: Equipment | null;
}

export function BookingModal({ open, onClose, studio }: BookingModalProps) {
  const { user } = useAuth();
  const showToast = useUniqueToast();
  const [form, setForm] = useState({
    bookingDate: "",
    bookingTime: "",
    duration: "",
    note: "",
  });

  const [price, setPrice] = useState(0);

  const {
    data: customerData,
    isLoading,
    isError,
    error,
  } = useCustomerByUserId(user?.id || "", Boolean(user?.id));
  const { mutate: createRentalMutate, isPending: isSubmitting } =
    useCreateRental();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));

    // Tính giá tạm thời
    if (id === "duration") {
      const hours = Number(value);
      // const dailyPrice = studio
      //   ? studio.dailyPrice
      //     ? studio.dailyPrice / 24
      //     : 0
      //   : 0;
      const hourlyRate = 250000; // 250k/giờ — có thể thay đổi theo DB
      setPrice(hours * hourlyRate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bookingDate || !form.bookingTime || !form.duration) {
      showToast("Vui lòng điền đầy đủ thông tin bắt buộc.", "error", {
        duration: 2000,
        allowSpam: true,
      });
      return;
    }

    // Tính toán startDate và endDate
    const startDateTime = new Date(
      `${form.bookingDate}T${form.bookingTime}:00`
    );
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + Number(form.duration));

    const rentalData: CreateRentalRequestDto = {
      customerId: customerData?.data?.customerId || "unknown",
      equipmentId: studio?.equipmentId || "",
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      notes: form.note || null,
    };

    createRentalMutate(rentalData, {
      onSuccess: () => {
        showToast("Đặt phòng thành công!", "success");
        onClose();
      },
      onError: (error: any) => {
        showToast(
          error?.error?.message || "Có lỗi xảy ra khi tạo booking",
          "error",
          {
            duration: 2000,
            allowSpam: true,
          }
        );
      },
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog.Root open={open} onOpenChange={onClose}>
          <Dialog.Portal>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            </motion.div>

            <Dialog.Content className="fixed top-1/2 left-1/2 w-[95vw] max-w-4xl max-h-[95vh] -translate-x-1/2 -translate-y-1/2 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white rounded-2xl shadow-custom-xl border border-gray-100 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] px-6 py-4 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <Dialog.Title className="text-2xl font-bold mb-1">
                        Đặt lịch Studio
                      </Dialog.Title>
                      <div className="flex items-center gap-2 text-white/90">
                        <MapPin size={16} />
                        <span className="text-sm">{studio?.name}</span>
                      </div>
                    </div>
                    <Dialog.Close asChild>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
                      >
                        <X className="w-6 h-6" />
                      </motion.button>
                    </Dialog.Close>
                  </div>
                </div>
                <Dialog.Description className="sr-only" />

                {/* Body */}
                <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
                  <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Cột trái - Thông tin đặt lịch */}
                      <div className="space-y-6">
                        <div className="p-4 bg-[var(--bg-light)] rounded-xl border-l-4 border-[var(--primary-color)]">
                          <h3 className="text-lg font-bold text-[var(--text-dark)] mb-4 flex items-center gap-2">
                            <CalendarDays
                              className="text-[var(--primary-color)]"
                              size={20}
                            />
                            Thông tin đặt lịch
                          </h3>

                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-semibold text-[var(--text-dark)] mb-2 flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 text-[var(--primary-color)]" />
                                Ngày thuê *
                              </label>
                              <input
                                type="date"
                                id="bookingDate"
                                value={form.bookingDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-[var(--text-dark)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-300"
                                required
                              />
                            </div>

                            <div>
                              <label className="text-sm font-semibold text-[var(--text-dark)] mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[var(--primary-color)]" />
                                Giờ bắt đầu *
                              </label>
                              <select
                                id="bookingTime"
                                value={form.bookingTime}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-[var(--text-dark)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-300"
                                required
                              >
                                <option value="">Chọn giờ bắt đầu</option>
                                {Array.from(
                                  { length: 13 },
                                  (_, i) => 8 + i
                                ).map((h) => (
                                  <option
                                    key={h}
                                    value={`${h
                                      .toString()
                                      .padStart(2, "0")}:00`}
                                  >
                                    {h.toString().padStart(2, "0")}:00
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="text-sm font-semibold text-[var(--text-dark)] mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[var(--primary-color)]" />
                                Thời gian thuê *
                              </label>
                              <select
                                id="duration"
                                value={form.duration}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-[var(--text-dark)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-300"
                                required
                              >
                                <option value="">Chọn thời gian thuê</option>
                                <option value="4">4 giờ - 1,000,000 VNĐ</option>
                                <option value="6">6 giờ - 1,500,000 VNĐ</option>
                                <option value="8">
                                  8 giờ (1 ngày) - 2,000,000 VNĐ
                                </option>
                                <option value="16">
                                  16 giờ (2 ngày) - 4,000,000 VNĐ
                                </option>
                                <option value="24">
                                  24 giờ (3 ngày) - 6,000,000 VNĐ
                                </option>
                              </select>
                            </div>

                            <div>
                              <label className="text-sm font-semibold text-[var(--text-dark)] mb-2 flex items-center gap-2">
                                <StickyNote className="w-4 h-4 text-[var(--primary-color)]" />
                                Ghi chú đặc biệt
                              </label>
                              <textarea
                                id="note"
                                rows={4}
                                value={form.note}
                                onChange={handleChange}
                                placeholder="Concept chụp, yêu cầu đặc biệt, số người tham gia..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-[var(--text-dark)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-all duration-300 resize-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cột phải - Thông tin khách hàng (hiển thị thông tin từ user) */}
                      <div className="space-y-6">
                        <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                          <h3 className="text-lg font-bold text-[var(--text-dark)] mb-4 flex items-center gap-2">
                            <StickyNote className="text-blue-500" size={20} />
                            Thông tin khách hàng
                          </h3>
                          <div className="space-y-4">
                            {isLoading ? (
                              <p>Đang tải thông tin khách hàng...</p>
                            ) : isError ? (
                              <p className="text-red-500">
                                Lỗi:{" "}
                                {error?.message || "Không thể tải thông tin"}
                              </p>
                            ) : (
                              <div className="space-y-2">
                                <p>
                                  <strong>Họ và tên:</strong>{" "}
                                  {customerData?.data?.fullName || "N/A"}
                                </p>
                                <p>
                                  <strong>Email:</strong>{" "}
                                  {customerData?.data?.email || "N/A"}
                                </p>
                                <p>
                                  <strong>Số điện thoại:</strong>{" "}
                                  {customerData?.data?.phone || "N/A"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tổng tiền và Button */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-[var(--bg-light)] to-blue-50 rounded-xl border border-gray-200">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-8 h-8 text-[var(--primary-color)]" />
                          <div>
                            <p className="text-sm text-[var(--text-light)]">
                              Tổng chi phí
                            </p>
                            <p className="text-3xl font-bold text-[var(--primary-color)]">
                              {price.toLocaleString()} VNĐ
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <motion.button
                            type="button"
                            onClick={onClose}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-white text-[var(--text-dark)] border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold"
                          >
                            Hủy bỏ
                          </motion.button>

                          <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                            className="btn btn-primary px-8 py-3 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold flex items-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                />
                                Đang xử lý...
                              </>
                            ) : (
                              "Xác nhận đặt lịch"
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
}
