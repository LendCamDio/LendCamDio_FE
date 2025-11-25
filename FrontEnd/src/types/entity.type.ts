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

// Backend enums: MembershipLevel { Basic=0, Silver=1, Gold=2, Platinum=3 }
// Backend enums: CustomerStatus { Active=0, Inactive=1 }
// Backend enums: UserRole { Customer=0, Supplier=1, Admin=2 }
// Backend enums: UserStatus { Active=0, Inactive=1 }
export enum MembershipLevel {
  BASIC = 0,
  SILVER = 1,
  GOLD = 2,
  PLATINUM = 3,
}
export enum UserStatus {
  ACTIVE = 0,
  INACTIVE = 1,
}
export enum UserRole {
  CUSTOMER = 0,
  SUPPLIER = 1,
  ADMIN = 2,
}

export enum Sex {
  MALE = 0,
  FEMALE = 1,
  OTHER = 2,
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
  role?: UserRole | string; // Can be integer enum or string from backend
  status?: UserStatus; // Integer enum from backend
  isVerified?: boolean;
};

export type UserDetailInfo = UserInfo & {
  avatarUrl?: string;
  isVerified?: boolean;
  address?: string;
  emailVerificationToken?: string | null;
  emailVerificationTokenExpiry?: string | null;
  passwordResetToken?: string | null;
  passwordResetTokenExpiry?: string | null;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
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

// Backend enums: SupplierStatus { Active=0, Inactive=1 }
// VerificationStatus { Pending=0, Verified=1, Rejected=2 }
export enum SupplierStatus {
  Active = 0,
  Inactive = 1,
}

export enum VerificationStatus {
  Pending = 0,
  Verified = 1,
  Rejected = 2,
}

export type SupplierDto = {
  supplierId: string;
  userId: string;
  companyName: string;
  address?: string;
  phone?: string;
  rating: number;
  verificationStatus: VerificationStatus;
  status: SupplierStatus;
  fullName: string;
  email: string;
  equipmentCount: number;
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
export enum EquipmentType {
  ForRent = 0,
  ForSale = 1,
}

export enum EquipmentCondition {
  New,
  Good,
  Used,
  Damaged,
}
export enum EquipmentStatus {
  Active = 0,
  Inactive = 1,
}

export type Equipment = {
  equipmentId: string;
  supplierId: string;
  supplierName: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  type: EquipmentType; // ForRent or ForSale
  stockQuantity: number;
  price?: number; // Only for ForSale
  dailyPrice?: number; // Only for ForRent
  depositAmount: number;
  insuranceRequired: boolean;
  condition: EquipmentCondition;
  availability: boolean;
  status: EquipmentStatus;
  imageId: string;
  imageUrl: string;
  rating?: number;
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
export type SingleEquipmentResponse = ApiResponse<Equipment>;

export type UploadEquipmentImageRequest = {
  equipmentId: string;
  imageFile: File;
  type: number;
  isPrimary: boolean;
};

export type UploadEquipmentImageResponse = ApiResponse<{
  imageId: string;
  equipmentId: string;
  imageUrl: string;
}>;

export type CreateEquipmentRequestDto = {
  name: string;
  description: string;
  categoryId: string;
  supplierId?: string | null;
  stockQuantity: number;
  dailyPrice?: number | null;
  price?: number | null;
  depositAmount: number;
  insuranceRequired: boolean;
  condition: EquipmentCondition;
  availability?: boolean;
};

export type UpdateEquipmentRequestDto = {
  name: string;
  description: string;
  categoryId: string;
  supplierId?: string | null;
  stockQuantity: number;
  dailyPrice?: number | null;
  price?: number | null;
  depositAmount: number;
  insuranceRequired: boolean;
  condition: EquipmentCondition;
  availability?: boolean;
};

export type CreateEquipmentResponse = ApiResponse<{
  supplierId: string;
  categoryId: string;
  name: string;
}>;

export type UpdateEquipmentResponse = ApiResponse<{
  equipmentId: string;
  message: string;
}>;
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
  success?: boolean;
  data?: AIMessageData;
  response: string;
  customerId?: string;
  savedToDatabase?: boolean;
  message?: string;
  timestamp?: string;
}
export interface AIMessageData {
  explanation?: string;
  recommendations?: RecommendationResponse[];
  warning?: string;
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

  // PayOS-specific fields
  payOsOrderCode?: number | null;
  payOsPaymentLinkId?: string | null;

  // Navigation property
  rental?: Rental;
}

// Response DTO with additional computed fields
export interface PaymentResponseDto extends Payment {
  // PayOS checkout URL (if payment link was created)
  payOsCheckoutUrl?: string | null;

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

export interface CreatePayOSPaymentRequestDto {
  paymentId: string; // Guid
}

export interface PayOSPaymentLinkResponseDto {
  paymentId: string;
  checkoutUrl: string;
  orderCode: number;
  paymentLinkId: string;
  amount: number;
  message: string;
}

export interface PayOSPaymentInfoResponseDto {
  orderCode: number;
  amount: number;
  status: string;
  paymentLinkId: string;
  checkoutUrl: string;
  qrCode?: string;
  createdAt: string;
  paidAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

// Backend expects enum values: VNPay=0, Cash=1, PayOS=2
export enum PaymentMethod {
  VNPay = 0,
  Cash = 1,
  PayOS = 2,
}

// Backend expects enum values: Pending=0, Paid=1, Failed=2, Refunded=3, Deleted=4
export enum PaymentStatus {
  Pending = 0,
  Paid = 1,
  Failed = 2,
  Refunded = 3,
  Deleted = 4,
}

export type PaymentResponse = ApiResponse<PaginatedData<PaymentResponseDto>>;

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

// #region Identity Verification Types
export type IdentityVerificationDto = {
  identityVerificationId: string;
  userId: string;
  fullName: string;
  dateOfBirth: string;
  sex: Sex;
  placeOfBirth: string;
  placeOfResidence: string;
  citizenId: string;
  providedDate: string;
  provider: string;
  createdAt: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
};

export type CreateIdentityVerificationRequestDto = {
  fullName: string;
  dateOfBirth: string;
  sex: Sex;
  placeOfBirth: string;
  placeOfResidence: string;
  citizenId: string;
  providedDate: string;
  provider: string;
};

export type UpdateIdentityVerificationRequestDto = {
  fullName?: string;
  dateOfBirth?: string;
  sex?: Sex;
  placeOfBirth?: string;
  placeOfResidence?: string;
  citizenId?: string;
  providedDate?: string;
  provider?: string;
};

export type IdentityVerificationResponse = ApiResponse<IdentityVerificationDto>;
// #endregion
