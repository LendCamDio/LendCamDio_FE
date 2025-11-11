import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Upload, ChevronRight, ChevronLeft } from "lucide-react";
import type { Equipment } from "@/types/entity.type";
import { useActiveEquipCategories } from "@/hooks/equipment/useEquipCategory";
import { useUniqueToast } from "@/hooks/notification/useUniqueToast";
import api from "@/services/api";
import {
  SUPPLIER_ENDPOINTS,
  EQUIPMENT_ENDPOINTS,
  EQUIPMENT_IMAGE_ENDPOINTS,
} from "@/constants/endpoints";

interface EquipmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EquipmentFormData) => Promise<void>;
  equipment?: Equipment | null;
  mode: "create" | "edit";
  onSuccess?: () => void; // Add callback for successful create/update
}

export interface EquipmentFormData {
  name: string;
  description: string;
  categoryId: string;
  supplierId: string;
  stockQuantity: number;
  dailyPrice?: number;
  price?: number;
  depositAmount: number;
  insuranceRequired: boolean;
  condition: number | string;
  availability?: boolean;
  imageFile?: File | null;
  equipmentId?: string; // Store created equipment ID
}

interface Supplier {
  supplierId: string;
  companyName: string;
  fullName?: string;
  email?: string;
  status?: number;
}

const EquipmentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  equipment,
  mode,
  onSuccess,
}: EquipmentFormModalProps) => {
  const showToast = useUniqueToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [createdEquipmentId, setCreatedEquipmentId] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState<EquipmentFormData>({
    name: "",
    description: "",
    categoryId: "",
    supplierId: "",
    stockQuantity: 1,
    dailyPrice: undefined,
    price: undefined,
    depositAmount: 0,
    insuranceRequired: false,
    condition: 0,
    availability: true,
    imageFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Steps: Create mode chỉ có 2 steps (backend không trả equipmentId)
  // Edit mode có đủ 3 steps
  const steps =
    mode === "create"
      ? [
          { number: 1, title: "Basic Info", description: "Equipment details" },
          { number: 2, title: "Pricing", description: "Price & deposit" },
        ]
      : [
          { number: 1, title: "Basic Info", description: "Equipment details" },
          { number: 2, title: "Pricing", description: "Price & deposit" },
          { number: 3, title: "Image", description: "Upload image" },
        ];

  const maxSteps = steps.length;

  // Fetch categories using existing hook
  const { data: categoriesData, isLoading: categoriesLoading } =
    useActiveEquipCategories();
  const categories = categoriesData?.data?.items || [];

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await api.get(SUPPLIER_ENDPOINTS.LIST, {
          params: { page: 1, pageSize: 100 },
        });
        if (response.data?.success) {
          const suppliersList = response.data.data.items || [];
          console.log("📋 Fetched suppliers:", suppliersList);
          setSuppliers(suppliersList);
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    if (isOpen) {
      fetchSuppliers();
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.classList.add("modal-open");
      document.body.style.setProperty(
        "--scrollbar-width",
        `${scrollbarWidth}px`
      );

      return () => {
        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("--scrollbar-width");
      };
    }
  }, [isOpen]);

  // Update form when equipment prop changes
  useEffect(() => {
    if (equipment && mode === "edit") {
      setFormData({
        name: equipment.name || "",
        description: equipment.description || "",
        categoryId: equipment.categoryId || "",
        supplierId: equipment.supplierId || "",
        stockQuantity: equipment.stockQuantity || 1,
        dailyPrice: equipment.dailyPrice || 0,
        price: equipment.price || 0,
        depositAmount: equipment.depositAmount || 0,
        insuranceRequired: equipment.insuranceRequired || false,
        condition: equipment.condition || 0,
        availability: equipment.availability ?? true,
        imageFile: null,
      });
      setImagePreview(equipment.imageUrl || "");
      setCurrentStep(1);
      setCreatedEquipmentId(equipment.equipmentId);
    } else if (mode === "create") {
      setFormData({
        name: "",
        description: "",
        categoryId: "",
        supplierId: "",
        stockQuantity: 1,
        dailyPrice: 0,
        price: 0,
        depositAmount: 0,
        insuranceRequired: false,
        condition: 0,
        availability: true,
        imageFile: null,
      });
      setImagePreview("");
      setCurrentStep(1);
      setCreatedEquipmentId(null);
    }
  }, [equipment, mode, isOpen]);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size must be less than 5MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setFormData({ ...formData, imageFile: file });
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setFormData({ ...formData, imageFile: null });
  };

  const handleNext = async () => {
    if (currentStep === 2 && mode === "create" && !createdEquipmentId) {
      // At end of step 2, create equipment directly (no step 3 for create mode)
      // Backend không trả về equipmentId nên không thể upload image riêng
      await handleCreateEquipment();
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCreateEquipment = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!formData.name || !formData.categoryId) {
        showToast(
          "Please fill in all required fields (Name and Category)",
          "error"
        );
        setLoading(false);
        return;
      }

      // Validate pricing - Backend yêu cầu: Either Price or DailyPrice must be provided
      const hasPrice = formData.price && formData.price > 0;
      const hasDailyPrice = formData.dailyPrice && formData.dailyPrice > 0;

      if (!hasPrice && !hasDailyPrice) {
        showToast(
          "Please provide at least one valid price: Either Purchase Price or Daily Price must be greater than 0",
          "error",
          { duration: 3000 }
        );
        setLoading(false);
        return;
      }

      // Prepare payload theo đúng DTO của backend
      const payload: any = {
        name: formData.name,
        description: formData.description || null,
        categoryId: formData.categoryId,
        stockQuantity: formData.stockQuantity,
        depositAmount: formData.depositAmount,
        insuranceRequired: formData.insuranceRequired,
        condition:
          typeof formData.condition === "string"
            ? parseInt(formData.condition)
            : formData.condition,
        availability: formData.availability ?? true,
      };

      // Chỉ gửi price nếu có giá trị hợp lệ
      if (hasPrice) {
        payload.price = formData.price;
      }

      // Chỉ gửi dailyPrice nếu có giá trị hợp lệ
      if (hasDailyPrice) {
        payload.dailyPrice = formData.dailyPrice;
      }

      // SupplierId là optional - chỉ gửi nếu có
      if (formData.supplierId) {
        payload.supplierId = formData.supplierId;
      }

      console.log("📤 Creating equipment with payload:", payload);

      const response = await api.post(EQUIPMENT_ENDPOINTS.CREATE, payload);

      if (response.data?.success) {
        console.log("✅ Equipment created successfully:", response.data);

        // Backend không trả về equipmentId trong response
        // Có 2 options:
        // Option 1: Fetch lại equipment list để lấy ID mới nhất
        // Option 2: Skip image upload và reload page luôn

        showToast("Equipment created successfully!", "success");

        // Nếu có image, cần notify user
        if (formData.imageFile) {
          showToast(
            "Please upload the image manually by editing the equipment after refreshing the list",
            "info",
            { duration: 4000 }
          );
        }

        // Call success callback to refresh list
        if (onSuccess) {
          onSuccess();
        }

        // Close modal after brief delay
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error: any) {
      console.error("❌ Error creating equipment:", error);

      // Xử lý validation errors từ backend (ASP.NET format)
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.entries(errors)
          .map(([field, messages]) => {
            const msgArray = messages as string[];
            return `${field}: ${msgArray.join(", ")}`;
          })
          .join("\n");

        showToast(`Validation Error:\n${errorMessages}`, "error", {
          duration: 5000,
        });
      } else if (error.response?.data?.message) {
        showToast(error.response.data.message, "error", { duration: 4000 });
      } else if (error.response?.data?.title) {
        showToast(error.response.data.title, "error", { duration: 4000 });
      } else {
        showToast(
          "Failed to create equipment. Please check your inputs and try again.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };
  const handleUploadImage = async () => {
    if (!formData.imageFile) {
      // No image to upload, just close
      showToast("No image selected. Equipment saved successfully!", "info");

      // Call success callback to refresh list
      if (onSuccess) {
        onSuccess();
      }

      onClose();
      return;
    }

    const equipmentId = createdEquipmentId || formData.equipmentId;

    console.log("📤 Upload Image Debug:", {
      createdEquipmentId,
      formDataEquipmentId: formData.equipmentId,
      finalEquipmentId: equipmentId,
      hasImageFile: !!formData.imageFile,
    });

    if (!equipmentId) {
      showToast(
        "Equipment ID not found. Please try creating the equipment again.",
        "error",
        { duration: 3000 }
      );
      console.error("❌ Missing equipment ID:", {
        createdEquipmentId,
        formDataEquipmentId: formData.equipmentId,
      });
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("equipmentId", equipmentId);
      formDataToSend.append("file", formData.imageFile);
      formDataToSend.append("type", "0"); // Gallery type
      formDataToSend.append("isPrimary", "true");

      console.log("📤 Uploading image for equipment:", equipmentId);

      const response = await api.post(
        EQUIPMENT_IMAGE_ENDPOINTS.UPLOAD,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.success) {
        showToast("Image uploaded successfully!", "success");

        // Call success callback to refresh list
        if (onSuccess) {
          onSuccess();
        }

        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Equipment created but failed to upload image. You can upload it later by editing the equipment.";
      showToast(errorMessage, "warning", { duration: 4000 });

      // Still refresh list and close
      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If on step 3, upload image
    if (currentStep === 3) {
      await handleUploadImage();
    } else {
      // This shouldn't happen with new flow, but keep as fallback
      setLoading(true);
      try {
        await onSubmit(formData);
        onClose();
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white rounded-t-xl flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "create" ? "Add New Equipment" : "Edit Equipment"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Step {currentStep} of {steps.length}
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Progress */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep === step.number
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : currentStep > step.number
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step.number ? "✓" : step.number}
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-sm font-medium ${
                        currentStep === step.number
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 mb-8 rounded transition-all ${
                      currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Basic Information
                </h3>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Equipment Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="e.g., Canon EOS R5"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    placeholder="Describe the equipment features and specifications..."
                  />
                </div>

                {/* Category & Supplier Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryId: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      disabled={categoriesLoading}
                    >
                      <option value="">
                        {categoriesLoading
                          ? "Loading categories..."
                          : "Select a category"}
                      </option>
                      {categories.map((category: any) => (
                        <option
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Supplier
                    </label>
                    <select
                      value={formData.supplierId}
                      onChange={(e) =>
                        setFormData({ ...formData, supplierId: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      disabled={suppliers.length === 0}
                    >
                      <option value="">
                        {suppliers.length === 0
                          ? "Loading suppliers..."
                          : "LendCamDio (Default)"}
                      </option>
                      {suppliers.map((supplier) => (
                        <option
                          key={supplier.supplierId}
                          value={supplier.supplierId}
                        >
                          {supplier.companyName}
                          {supplier.fullName && ` (${supplier.fullName})`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Stock & Condition */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.stockQuantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stockQuantity: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Condition <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.condition}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          condition: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value={0}>New</option>
                      <option value={1}>Like New</option>
                      <option value={2}>Good</option>
                      <option value={3}>Fair</option>
                      <option value={4}>Poor</option>
                    </select>
                  </div>
                </div>

                {/* Insurance Required */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="insurance"
                    checked={formData.insuranceRequired}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        insuranceRequired: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="insurance"
                    className="ml-3 text-sm font-medium text-gray-700"
                  >
                    Insurance Required for this Equipment
                  </label>
                </div>
              </div>
            )}

            {/* Step 2: Pricing */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Pricing Information
                </h3>

                {/* Pricing requirement notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800 font-medium">
                    ⚠️ At least one price (Daily Price or Purchase Price) must
                    be provided and greater than 0
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Daily Price (VND){" "}
                      <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1000"
                      step="1000"
                      value={formData.dailyPrice || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dailyPrice: parseFloat(e.target.value) || undefined,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      For rental equipment
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Purchase Price (VND){" "}
                      <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1000"
                      step="1000"
                      value={formData.price || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value) || undefined,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      For sale equipment
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deposit Amount (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1000"
                    value={formData.depositAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        depositAmount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Security deposit required from customers
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    💡 Pricing Tips
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Set daily price for rental equipment</li>
                    <li>• Set purchase price if equipment is for sale</li>
                    <li>
                      • You can set both prices if equipment supports both
                      rental and purchase
                    </li>
                    <li>• Deposit protects against damage or loss</li>
                  </ul>
                </div>

                {mode === "create" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-medium text-amber-900 mb-2">
                      📸 About Equipment Image
                    </h4>
                    <p className="text-sm text-amber-700">
                      Image upload will be available after creating the
                      equipment. You can add images by editing the equipment
                      from the equipment list.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Image */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Equipment Image
                </h3>

                <div>
                  {imagePreview ? (
                    <div className="relative w-full h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-all bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="mb-2 text-sm font-medium text-gray-700">
                          Click to upload equipment image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">
                    📸 Image Guidelines
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Use high-quality, well-lit photos</li>
                    <li>• Show equipment from multiple angles if possible</li>
                    <li>• Ensure background is clean and uncluttered</li>
                    <li>
                      • Optional: Can be uploaded after creating equipment
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            {currentStep > 1 && currentStep < maxSteps && (
              <button
                type="button"
                onClick={handlePrevious}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
            )}

            {currentStep < maxSteps ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all ml-auto disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {currentStep === 2 && mode === "create"
                      ? "Creating Equipment..."
                      : "Loading..."}
                  </>
                ) : (
                  <>
                    {currentStep === 2 && mode === "create"
                      ? "Create Equipment"
                      : "Next"}
                    {!(currentStep === 2 && mode === "create") && (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </>
                )}
              </button>
            ) : mode === "create" ? (
              // Không bao giờ đến đây với create mode (chỉ có 2 steps)
              <></>
            ) : (
              // Edit mode - normal submit
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </span>
                  ) : (
                    "Update Equipment"
                  )}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default EquipmentFormModal;
