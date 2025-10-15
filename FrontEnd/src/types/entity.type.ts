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

export type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: ApiError;
  pagination?: PaginationInfo;
  timestamp?: string;
  requestId?: string;
  metadata?: Record<string, string>;
  warnings?: string[];
};

export type ApiError = {
  code: number;
  message: string;
  validationErrors?: Record<string, string[]>;
  detailedMessage?: string;
};
// #endregion

// #region Auth Types
export type AuthResponse = {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  user: UserInfo;
};

export type UserInfo = {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  phoneNumber?: string;
  avatar?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  role: "Customer" | "Supplier";
};

export type GoogleAuthRequest = {
  idToken: string;
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
  rating?: ReviewAverage;
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
export type CategoryStatus = "Active" | "Inactive";

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

// #region AI Types
export interface AIResponse {
  success: boolean;
  message: string;
  data?: {
    message?: string;
    recommendations?: Recommendation[];
    ratingId?: string;
    feedback?: string;
  };
  error?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  rating?: number;
  feedback?: string;
}

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}
