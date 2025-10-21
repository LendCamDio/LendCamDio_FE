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

// public enum MembershipLevel { Basic, Silver, Gold, Platinum }
// public enum CustomerStatus { Active, Inactive }
// public enum UserRole { Customer, Supplier, Admin }
export enum MembershipLevel {
  BASIC = "Basic",
  SILVER = "Silver",
  GOLD = "Gold",
  PLATINUM = "Platinum",
}
export enum UserStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}
export enum UserRole {
  CUSTOMER = "Customer",
  SUPPLIER = "Supplier",
  ADMIN = "Admin",
}

export type UserInfo = {
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  occupation?: string;
  incomeLevel?: string;
  dateOfBirth?: string;
  createdAt: string;
  role?: UserRole;
};

export type ChangePasswordRequestDto = {
  currentPassword: string;
  newPassword: string;
};

export type UpdateUserStatusRequestDto = {
  status: UserStatus;
};

export type UserResponse = ApiResponse<UserInfo>;
export type UpdateUserRequestDto = {
  fullName?: string;
  address?: string;
  phone?: string;
  dateOfBirth?: string;
  occupation?: string;
  incomeLevel?: string;
};
export type UpdateUserResponse = ApiResponse<PaginatedData<UserInfo>>;

export type CustomerDto = {
  customerId: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  membershipLevel: MembershipLevel;
  loyaltyPoints: number;
  status: UserStatus;
  totalRentals: number;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
};

export type CustomerResponse = ApiResponse<PaginatedData<CustomerDto>>;
export type UpdateCustomerRequestDto = {
  membershipLevel?: MembershipLevel;
  loyaltyPoints?: number;
  address?: string;
  status?: UserStatus;
};
export type CreateCustomerRequestDto = {
  userId: string;
  membershipLevel: MembershipLevel;
  loyaltyPoints: number;
  address?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
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
  price?: number;
  dailyPrice?: number;
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
export interface AIMessage {
  response: string;
  Recommendations?: RecommendationResponse[];
  Explanation?: string;
  Warning?: string;
}

export interface EquipmentRecommendation {
  Recommendations: RecommendationResponse[];
  Explanation: string;
  Warning: string;
  //  public List<RecommendationResponseDto> Recommendations { get; set; } = new();
  //  public string Explanation { get; set; } = string.Empty;
  //  public string Warning { get; set; } = string.Empty;
}

export type AIResponse = ApiResponse<AIMessage>;
// #endregion

export interface RecommendationResponse {
  RecId: string;
  CustomerId: string;
  EquipmentId: string;
  Score: number;
  GeneratedAt: string;
  Status: number;
  CustomerName: string;
  EquipmentName: string;
  EquipmentDescription: string;
  CategoryId: string;
  CategoryName: string;
  CreatedAt: string;
  CreatedBy?: string;
  UpdatedAt?: string;
  UpdatedBy?: string;
}

// Base Payment entity (matches C# Payment model exactly)
export interface Payment {
  paymentId: string; // Guid
  rentalId: string; // Guid
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string | null; // DateTime?
  refundReason?: string | null;
  createdAt: string; // DateTime
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;

  // Navigation property
  rental?: Rental;
}

// Response DTO with additional computed fields
export interface PaymentResponseDto extends Payment {
  // Additional info from joins/computed fields
  rentalStatusText: string;
  customerName: string;
  equipmentName: string;
}

export interface CreatePaymentRequestDto {
  rentalId: string; // Guid
  amount: number;
  method: PaymentMethod;
  paidAt?: string | null; // optional DateTime
  refundReason?: string | null; // optional from C# model
}

export interface UpdatePaymentRequestDto {
  refundReason?: string | null;
  status?: PaymentStatus | null;
  paidAt?: string | null;
}

export type PaymentMethod = "VNPay" | "Cash" | "PayOS";

export type PaymentStatus =
  | "Pending"
  | "Paid"
  | "Failed"
  | "Refunded"
  | "Deleted";

export type PaymentResponse = ApiResponse<PaginatedData<PaymentResponseDto>>;
// export type PaymentUpdateResponse = ApiResponse<PaymentResponseDto>;
// export type PaymentCreateResponse = ApiResponse<PaymentResponseDto>;

// export type RentalStatus = "Pending" | "Active" | "Completed" | "Cancelled";
export enum RentalStatus {
  PENDING = "Pending",
  ACTIVE = "Active",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}
export const RentalStatusType = ["Pending", "Active", "Completed", "Cancelled"];

// export type ContractStatus = "Draft" | "Signed" | "Terminated";
export enum ContractStatus {
  DRAFT = "Draft",
  SIGNED = "Signed",
  TERMINATED = "Terminated",
}

export interface RentalResponseDto {
  rentalId: string;
  customerId: string;
  customerName: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImageUrl?: string | null;

  startDate: string;
  endDate: string;

  totalPrice: number;
  deposit: number;
  insuranceFee: number;
  notes?: string | null;

  status: number;
  hasContract: boolean;
  contractStatus?: ContractStatus | null;

  createdAt: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
}

// ==========================
// 🧱 RENTAL ENTITY
// ==========================

export interface Rental {
  rentalId: string;
  customerId: string;
  equipmentId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  notes?: string | null;
  deposit: number;
  insuranceFee: number;

  status: RentalStatus;

  createdAt: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;

  contract?: RentalContract | null;
  payments?: PaymentMethod[] | null; // reference nếu bạn import từ payment.type
}

// ==========================
// 📄 RENTAL CONTRACT ENTITY
// ==========================
export interface RentalContract {
  contractId: string;
  rentalId: string;
  contractDetail: string;
  signedAt?: string | null;
  insurancePolicyNumber: string;
  insuranceProvider: string;
  fileUrl?: string | null;
  status: ContractStatus;

  createdAt: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
}

export type RentalResponse = ApiResponse<PaginatedData<RentalResponseDto>>;
export type CreateRentalRequestDto = {
  customerId: string;
  equipmentId: string;
  startDate: string;
  endDate: string;
  notes?: string | null;
};
export type RentalCreateResponse = ApiResponse<object>;
export type RentalUpdateRequestDto = {
  startDate: string;
  endDate: string;
  totalPrice: number;
  notes?: string | null;
  deposit: number;
  insuranceFee: number;
  status: RentalStatus;
};
export type RentalUpdateResponse = ApiResponse<object>;
