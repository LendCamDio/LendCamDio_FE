import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Save, User } from "lucide-react";
import PageWrapper from "@/components/common/PageTransaction/PageWrapper";
import { API_BASE_URL, IDENTITY_VERIFICATION_ENDPOINTS } from "@/constants/endpoints";
import {
  Sex,
  type IdentityVerificationDto,
  type CreateIdentityVerificationRequestDto,
  type UpdateIdentityVerificationRequestDto,
  type IdentityVerificationResponse,
} from "@/types/entity.type";

// Validation schema
const identityVerificationSchema = z.object({
  fullName: z.string().min(1, "Họ và tên không được để trống"),
  dateOfBirth: z.string().min(1, "Ngày sinh không được để trống"),
  sex: z.nativeEnum(Sex),
  placeOfBirth: z.string().min(1, "Quê quán không được để trống"),
  placeOfResidence: z.string().min(1, "Nơi thường trú không được để trống"),
  citizenId: z.string()
    .length(12, "Số CCCD phải chính xác 12 số")
    .regex(/^\d{12}$/, "Số CCCD chỉ được chứa chữ số"),
  providedDate: z.string().min(1, "Ngày cấp không được để trống"),
  provider: z.string().min(1, "Nơi cấp không được để trống"),
});

type IdentityVerificationFormData = z.infer<typeof identityVerificationSchema>;

const IdentityVerification = () => {
  const [loading, setLoading] = useState(false);
  const [existingData, setExistingData] = useState<IdentityVerificationDto | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<IdentityVerificationFormData>({
    resolver: zodResolver(identityVerificationSchema),
    defaultValues: {
      sex: Sex.MALE,
    },
  });

  const sexValue = watch("sex");

  // Fetch existing identity verification data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const response = await axios.get<IdentityVerificationResponse>(
          `${API_BASE_URL}${IDENTITY_VERIFICATION_ENDPOINTS.GET_ME}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success && response.data.data) {
          setExistingData(response.data.data);
          // Populate form with existing data
          reset({
            fullName: response.data.data.fullName,
            dateOfBirth: response.data.data.dateOfBirth.split("T")[0],
            sex: response.data.data.sex,
            placeOfBirth: response.data.data.placeOfBirth,
            placeOfResidence: response.data.data.placeOfResidence,
            citizenId: response.data.data.citizenId,
            providedDate: response.data.data.providedDate.split("T")[0],
            provider: response.data.data.provider,
          });
        } else {
          setIsEditing(true); // No data exists, enable editing
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setIsEditing(true);
          } else if (error.response?.status === 401) {
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
          } else {
            console.error("Error fetching identity verification:", error);
            toast.error("Không thể tải thông tin xác thực");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reset]);

  const onSubmit = async (data: IdentityVerificationFormData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (existingData) {
        // Update existing data
        const updateDto: UpdateIdentityVerificationRequestDto = data;
        await axios.put(
          `${API_BASE_URL}${IDENTITY_VERIFICATION_ENDPOINTS.UPDATE(existingData.identityVerificationId)}`,
          updateDto,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Cập nhật thông tin xác thực thành công!");
      } else {
        // Create new data
        const createDto: CreateIdentityVerificationRequestDto = data;
        const response = await axios.post<IdentityVerificationResponse>(
          `${API_BASE_URL}${IDENTITY_VERIFICATION_ENDPOINTS.CREATE}`,
          createDto,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success && response.data.data) {
          setExistingData(response.data.data);
        }
        toast.success("Tạo thông tin xác thực thành công!");
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving identity verification:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      } else {
        toast.error("Không thể lưu thông tin xác thực");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-6 h-6" />
                <CardTitle>Xác Thực Căn Cước Công Dân</CardTitle>
              </div>
              <CardDescription>
                Quản lý thông tin căn cước công dân của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && !existingData ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="block text-sm font-medium">
                        Họ và Tên *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        {...register("fullName")}
                        disabled={!isEditing || loading}
                        placeholder="Nhập họ và tên"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-500">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-2">
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium">
                        Ngày Sinh *
                      </label>
                      <input
                        id="dateOfBirth"
                        type="date"
                        {...register("dateOfBirth")}
                        disabled={!isEditing || loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                      {errors.dateOfBirth && (
                        <p className="text-sm text-red-500">
                          {errors.dateOfBirth.message}
                        </p>
                      )}
                    </div>

                    {/* Sex */}
                    <div className="space-y-2">
                      <label htmlFor="sex" className="block text-sm font-medium">
                        Giới Tính *
                      </label>
                      <select
                        id="sex"
                        value={sexValue}
                        onChange={(e) => setValue("sex", parseInt(e.target.value) as Sex)}
                        disabled={!isEditing || loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      >
                        <option value={Sex.MALE}>Nam</option>
                        <option value={Sex.FEMALE}>Nữ</option>
                        <option value={Sex.OTHER}>Khác</option>
                      </select>
                      {errors.sex && (
                        <p className="text-sm text-red-500">
                          {errors.sex.message}
                        </p>
                      )}
                    </div>

                    {/* Place of Birth */}
                    <div className="space-y-2">
                      <label htmlFor="placeOfBirth" className="block text-sm font-medium">
                        Quê Quán *
                      </label>
                      <input
                        id="placeOfBirth"
                        type="text"
                        {...register("placeOfBirth")}
                        disabled={!isEditing || loading}
                        placeholder="Nhập quê quán"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                      {errors.placeOfBirth && (
                        <p className="text-sm text-red-500">
                          {errors.placeOfBirth.message}
                        </p>
                      )}
                    </div>

                    {/* Place of Residence */}
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="placeOfResidence" className="block text-sm font-medium">
                        Nơi Thường Trú *
                      </label>
                      <input
                        id="placeOfResidence"
                        type="text"
                        {...register("placeOfResidence")}
                        disabled={!isEditing || loading}
                        placeholder="Nhập nơi thường trú"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                      {errors.placeOfResidence && (
                        <p className="text-sm text-red-500">
                          {errors.placeOfResidence.message}
                        </p>
                      )}
                    </div>

                    {/* Citizen ID (CCCD) */}
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="citizenId" className="block text-sm font-medium">
                        Số Căn Cước Công Dân (CCCD) *
                      </label>
                      <input
                        id="citizenId"
                        type="text"
                        maxLength={12}
                        {...register("citizenId")}
                        disabled={!isEditing || loading}
                        placeholder="Nhập số CCCD (12 số)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 font-mono"
                      />
                      {errors.citizenId && (
                        <p className="text-sm text-red-500">
                          {errors.citizenId.message}
                        </p>
                      )}
                    </div>

                    {/* Provided Date */}
                    <div className="space-y-2">
                      <label htmlFor="providedDate" className="block text-sm font-medium">
                        Ngày Cấp *
                      </label>
                      <input
                        id="providedDate"
                        type="date"
                        {...register("providedDate")}
                        disabled={!isEditing || loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                      {errors.providedDate && (
                        <p className="text-sm text-red-500">
                          {errors.providedDate.message}
                        </p>
                      )}
                    </div>

                    {/* Provider */}
                    <div className="space-y-2">
                      <label htmlFor="provider" className="block text-sm font-medium">
                        Nơi Cấp *
                      </label>
                      <input
                        id="provider"
                        type="text"
                        {...register("provider")}
                        disabled={!isEditing || loading}
                        placeholder="Nhập nơi cấp"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                      {errors.provider && (
                        <p className="text-sm text-red-500">
                          {errors.provider.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end">
                    {!isEditing ? (
                      <Button
                        type="button"
                        onClick={() => setIsEditing(true)}
                      >
                        Chỉnh Sửa
                      </Button>
                    ) : (
                      <>
                        {existingData && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false);
                              reset({
                                fullName: existingData.fullName,
                                dateOfBirth: existingData.dateOfBirth.split("T")[0],
                                sex: existingData.sex,
                                placeOfBirth: existingData.placeOfBirth,
                                placeOfResidence: existingData.placeOfResidence,
                                citizenId: existingData.citizenId,
                                providedDate: existingData.providedDate.split("T")[0],
                                provider: existingData.provider,
                              });
                            }}
                          >
                            Hủy
                          </Button>
                        )}
                        <Button type="submit" disabled={loading}>
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Đang lưu...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Lưu
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default IdentityVerification;
