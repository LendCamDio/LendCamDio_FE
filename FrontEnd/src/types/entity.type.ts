// #region Common Types
export type PaginatedData<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  timestamp: string;
  requestId?: string;
  metadata?: Record<string, string>;
};
// #endregion

// #region Equipment Types
export type Equipment = {
  equipmentId: string;
  supplierId: string;
  supplierName: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  stockQuantity: number;
  dailyPrice: number;
  depositAmount: number;
  insuranceRequired: boolean;
  condition: number;
  availability: boolean;
  status: string;
  imageId: string;
  imageUrl: string;
  rating?: ReviewAverage[];
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
};

export type EquipmentImageStatus = ["Active", "Inactive"] | string;

export type EquipmentImage = {
  imageId: string;
  equipmentId: string;
  imageUrl: string;
  type: number;
  isPrimary: boolean;
  status: EquipmentImageStatus;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
};

export type EquipmentResponse = ApiResponse<PaginatedData<Equipment>>;
// #endregion

// #region Equipment Category Types
export type CategoryStatus = ["Active", "Inactive"] | string;

export type EquipmentCategory = {
  categoryId: string;
  name: string;
  description: string;
  status: CategoryStatus;
  parentId?: string;
  parentName?: string;
  createdAt?: string;
};
export type EquipmentCategoryResponse = ApiResponse<
  PaginatedData<EquipmentCategory>
>;

// #region Review Types
export type Review = {
  reviewId: string;
  customerId: string;
  equipmentId: string;
  rating?: ReviewAverage[];
  comment: string;
  status: number;
  customerName: string;
  equipmentName: string;
  equipmentCategory: string;
  createdAt: string;
};

export type ReviewAverage = {
  equipmentId: string;
  averageRating: number;
};

export type ReviewResponse = ApiResponse<PaginatedData<Review>>;
// #endregion
