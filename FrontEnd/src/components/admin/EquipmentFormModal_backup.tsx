import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Upload } from "lucide-react";
import type { Equipment } from "@/types/entity.type";
import { useActiveEquipCategories } from "@/hooks/equipment/useEquipCategory";
import api from "@/services/api";
import { SUPPLIER_ENDPOINTS } from "@/constants/endpoints";

interface EquipmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EquipmentFormData) => Promise<void>;
  equipment?: Equipment | null;
  mode: "create" | "edit";
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
  imageFile?: File | null; // Changed from imageUrl to imageFile
}

interface Supplier {
  supplierId: string;
  name: string;
}

const EquipmentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  equipment,
  mode,
}: EquipmentFormModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EquipmentFormData>({
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
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");

  const steps = [
    { number: 1, title: "Basic Info", description: "Equipment details" },
    { number: 2, title: "Pricing", description: "Price & deposit" },
    { number: 3, title: "Image", description: "Upload image" },
  ];

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
          setSuppliers(response.data.data.items || []);
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    if (isOpen) {
      fetchSuppliers();
    }
  }, [isOpen]);

  // Lock body scroll when modal is open - Using CSS class approach
  useEffect(() => {
    if (isOpen) {
      // Calculate scrollbar width
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Add CSS class and set scrollbar width variable
      document.body.classList.add("modal-open");
      document.body.style.setProperty(
        "--scrollbar-width",
        `${scrollbarWidth}px`
      );

      return () => {
        // Remove class and variable when modal closes
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
        imageFile: null, // Don't load file for edit mode
      });
      setImagePreview(equipment.imageUrl || "");
    } else if (mode === "create") {
      // Reset form for create mode
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
    }
  }, [equipment, mode, isOpen]);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Save file to formData
    setFormData({ ...formData, imageFile: file });
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setFormData({ ...formData, imageFile: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
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
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white rounded-t-xl flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "create" ? "Add New Equipment" : "Edit Equipment"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {mode === "create"
                ? "Fill in the details to add a new equipment"
                : "Update equipment information"}
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
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
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

        {/* Form - Scrollable */}
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
                  Supplier{" "}
                  <span className="text-gray-400">
                    (Optional - defaults to LendCamdio)
                  </span>
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
                      : "LendCamdio (Default)"}
                  </option>
                  {suppliers.map((supplier) => (
                    <option
                      key={supplier.supplierId}
                      value={supplier.supplierId}
                    >
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-blue-50 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded"></span>
                Pricing & Stock
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.dailyPrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dailyPrice: parseFloat(e.target.value) || undefined,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || undefined,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit Amount ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.depositAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      depositAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                />
              </div>
            </div>

            {/* Condition & Image Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Equipment Image
                </label>
                <div className="space-y-2">
                  {imagePreview ? (
                    <div className="relative w-full h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-all bg-gray-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500">
                          Click to upload image
                        </p>
                        <p className="text-xs text-gray-400">
                          PNG, JPG (MAX. 5MB)
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

          {/* Footer - Fixed */}
          <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex-shrink-0">
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
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : mode === "create" ? (
                "Create Equipment"
              ) : (
                "Update Equipment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Use portal to render modal at document.body level
  return createPortal(modalContent, document.body);
};

export default EquipmentFormModal;
