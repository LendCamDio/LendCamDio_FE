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
  status: number;
  createdAt: string;
  images?: EquipmentImage[];
  rating?: ReviewAverage[];
};

export type EquipmentRating = {
  equipmentId: string;
  averageRating: number;
  reviewCount: number;
};

export type EquipmentImage = {
  imageId: string;
  equipmentId: string;
  imageUrl: string;
  type: number;
  isPrimary: boolean;
  status: number;
  createdAt: string;
};

export type EquipmentResponse = ApiResponse<PaginatedData<Equipment>>;
// #endregion

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
