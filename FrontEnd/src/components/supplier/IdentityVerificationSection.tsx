    import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import api from "@/services/api";
import axios from "axios";
import { Loader2, Save, User, Edit, IdCard } from "lucide-react";
import { IDENTITY_VERIFICATION_ENDPOINTS } from "@/constants/endpoints";
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

interface IdentityVerificationSectionProps {
  showToast?: (message: string, type: "success" | "error") => void;
}

export default function IdentityVerificationSection({ showToast }: IdentityVerificationSectionProps) {
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

  const displayToast = (message: string, type: "success" | "error") => {
    if (showToast) {
      showToast(message, type);
    } else {
      if (type === "success") {
        toast.success(message);
      } else {
        toast.error(message);
      }
    }
  };

  // Fetch existing identity verification data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get<IdentityVerificationResponse>(
          IDENTITY_VERIFICATION_ENDPOINTS.GET_ME
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
          } else if (error.response?.status !== 401) {
            // 401 is handled by interceptor
            console.error("Error fetching identity verification:", error);
            displayToast("Failed to load identity verification", "error");
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

      if (existingData) {
        // Update existing data
        const updateDto: UpdateIdentityVerificationRequestDto = data;
        await api.put(
          IDENTITY_VERIFICATION_ENDPOINTS.UPDATE(existingData.identityVerificationId),
          updateDto
        );
        displayToast("Identity verification updated successfully", "success");
      } else {
        // Create new data
        const createDto: CreateIdentityVerificationRequestDto = data;
        const response = await api.post<IdentityVerificationResponse>(
          IDENTITY_VERIFICATION_ENDPOINTS.CREATE,
          createDto
        );
        if (response.data.success && response.data.data) {
          setExistingData(response.data.data);
        }
        displayToast("Identity verification created successfully", "success");
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving identity verification:", error);
      // 401 is handled by interceptor
      displayToast("Failed to save identity verification", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <IdCard className="w-5 h-5" />
            Identity Verification (CCCD)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your Vietnamese Citizen ID information
          </p>
        </div>
        {!isEditing && !loading && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      {loading && !existingData ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("fullName")}
                disabled={!isEditing || loading}
                placeholder="Enter full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("dateOfBirth")}
                disabled={!isEditing || loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth.message}</p>
              )}
            </div>

            {/* Sex */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sex <span className="text-red-500">*</span>
              </label>
              <select
                value={sexValue}
                onChange={(e) => setValue("sex", parseInt(e.target.value) as Sex)}
                disabled={!isEditing || loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value={Sex.MALE}>Male</option>
                <option value={Sex.FEMALE}>Female</option>
                <option value={Sex.OTHER}>Other</option>
              </select>
              {errors.sex && (
                <p className="text-sm text-red-500 mt-1">{errors.sex.message}</p>
              )}
            </div>

            {/* Place of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Place of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("placeOfBirth")}
                disabled={!isEditing || loading}
                placeholder="Enter place of birth"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {errors.placeOfBirth && (
                <p className="text-sm text-red-500 mt-1">{errors.placeOfBirth.message}</p>
              )}
            </div>

            {/* Place of Residence */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Place of Residence <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("placeOfResidence")}
                disabled={!isEditing || loading}
                placeholder="Enter place of residence"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {errors.placeOfResidence && (
                <p className="text-sm text-red-500 mt-1">{errors.placeOfResidence.message}</p>
              )}
            </div>

            {/* Citizen ID (CCCD) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Citizen ID (CCCD) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={12}
                {...register("citizenId")}
                disabled={!isEditing || loading}
                placeholder="Enter 12-digit Citizen ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-mono"
              />
              {errors.citizenId && (
                <p className="text-sm text-red-500 mt-1">{errors.citizenId.message}</p>
              )}
            </div>

            {/* Provided Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provided Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("providedDate")}
                disabled={!isEditing || loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {errors.providedDate && (
                <p className="text-sm text-red-500 mt-1">{errors.providedDate.message}</p>
              )}
            </div>

            {/* Provider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("provider")}
                disabled={!isEditing || loading}
                placeholder="Enter provider"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {errors.provider && (
                <p className="text-sm text-red-500 mt-1">{errors.provider.message}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
              {existingData && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    reset({
                      fullName: existingData.fullName,
                      dateOfBirth: existingData.dateOfBirth.split("T")[0],
                      sex: existingData.sex,
                      placeOfBirth: existingData.placeOfBirth,
                      placeOfResidence: existingData.placeOfResidence,
                      providedDate: existingData.providedDate.split("T")[0],
                      provider: existingData.provider,
                    });
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
