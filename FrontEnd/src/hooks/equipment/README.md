# Equipment Hooks

Các hooks để quản lý Equipment đã được tách thành 2 file riêng biệt cho mục đích sử dụng khác nhau.

## 📁 Cấu trúc File

```
hooks/equipment/
├── useEquipmentUser.ts    # Hooks cho USER (khách hàng)
├── useEquipmentAdmin.ts   # Hooks cho ADMIN (quản trị)
└── useEquipment.ts        # [DEPRECATED] Re-export để tương thích ngược
```

## 👤 USER Hooks - `useEquipmentUser.ts`

**Dùng cho**: Khách hàng/người dùng thông thường (trang public, trang thuê thiết bị)

### `useEquipmentList()`

Lấy danh sách thiết bị **có sẵn để thuê** (available equipments)

**Lọc tự động**:
- ✅ `availability = true`
- ✅ `status = Active (0)`
- ✅ `stockQuantity > 0`

**Tham số**:
```typescript
useEquipmentList(
  page: number,           // Trang hiện tại
  pageSize: number,       // Số lượng items mỗi trang
  selectedCategory?: string,  // "all" hoặc categoryId
  searchName?: string     // Tên thiết bị để tìm kiếm
)
```

**Ví dụ**:
```typescript
import { useEquipmentList } from "@/hooks/equipment/useEquipmentUser";

// Trong component
const { data, isLoading, error } = useEquipmentList(1, 10, "all");
```

### `useEquipmentDetail()`

Lấy chi tiết một thiết bị theo ID

**Tham số**:
```typescript
useEquipmentDetail(
  id: string,          // ID của thiết bị
  enabled?: boolean    // Có bật query không (mặc định: false)
)
```

**Ví dụ**:
```typescript
import { useEquipmentDetail } from "@/hooks/equipment/useEquipmentUser";

const { data } = useEquipmentDetail("equipment-id-123", true);
```

---

## 🔐 ADMIN Hooks - `useEquipmentAdmin.ts`

**Dùng cho**: Quản trị viên (trang admin dashboard, quản lý thiết bị)

### `useAllEquipmentList()`

Lấy **TẤT CẢ** thiết bị (bao gồm cả không available)

**Không lọc**: Hiển thị tất cả thiết bị bất kể trạng thái, tồn kho, hoặc availability

**Tham số**:
```typescript
useAllEquipmentList(
  page: number,      // Trang hiện tại
  pageSize: number   // Số lượng items mỗi trang
)
```

**Ví dụ**:
```typescript
import { useAllEquipmentList } from "@/hooks/equipment/useEquipmentAdmin";

// Trong admin component
const { data, isLoading, error } = useAllEquipmentList(1, 20);
```

---

### `useCreateEquipment()` 🆕

Hook mutation để tạo thiết bị mới

**Returns**: `UseMutationResult`

**Ví dụ**:
```typescript
import { useCreateEquipment } from "@/hooks/equipment/useEquipmentAdmin";
import { EquipmentCondition } from "@/types/entity.type";

const createMutation = useCreateEquipment();

const handleCreate = async () => {
  try {
    const response = await createMutation.mutateAsync({
      name: "Canon EOS R5",
      description: "Professional camera",
      categoryId: "category-guid",
      supplierId: null,
      stockQuantity: 5,
      dailyPrice: 500000,
      price: 95000000,
      depositAmount: 10000000,
      insuranceRequired: true,
      condition: EquipmentCondition.New,
      availability: true,
    });

    if (response.success) {
      console.log("Created successfully!");
      // Hook tự động refetch via invalidateQueries
    }
  } catch (error) {
    console.error("Failed to create:", error);
  }
};

// Hoặc dùng mutate với callbacks
createMutation.mutate(data, {
  onSuccess: () => console.log("Success!"),
  onError: (error) => console.error(error),
});
```

---

### `useUpdateEquipment()` 🆕

Hook mutation để cập nhật thiết bị

**Returns**: `UseMutationResult`

**Ví dụ**:
```typescript
import { useUpdateEquipment } from "@/hooks/equipment/useEquipmentAdmin";

const updateMutation = useUpdateEquipment();

const handleUpdate = async (equipmentId: string, formData: any) => {
  try {
    const response = await updateMutation.mutateAsync({
      id: equipmentId,
      data: {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        supplierId: formData.supplierId || null,
        stockQuantity: formData.stockQuantity,
        dailyPrice: formData.dailyPrice,
        price: formData.price,
        depositAmount: formData.depositAmount,
        insuranceRequired: formData.insuranceRequired,
        condition: formData.condition,
        availability: formData.availability,
      },
    });

    if (response.success) {
      console.log("Updated successfully!");
      // Hook tự động refetch via invalidateQueries
    }
  } catch (error) {
    console.error("Failed to update:", error);
  }
};
```

---

### `useDeleteEquipment()` 🆕

Hook mutation để xóa thiết bị (soft delete)

**Returns**: `UseMutationResult`

**Ví dụ**:
```typescript
import { useDeleteEquipment } from "@/hooks/equipment/useEquipmentAdmin";

const deleteMutation = useDeleteEquipment();

const handleDelete = async (equipmentId: string) => {
  if (!confirm("Are you sure?")) return;

  try {
    const response = await deleteMutation.mutateAsync(equipmentId);
    
    if (response.success) {
      console.log("Deleted successfully!");
      // Hook tự động refetch via invalidateQueries
    }
  } catch (error) {
    console.error("Failed to delete:", error);
  }
};

// Check loading state
if (deleteMutation.isPending) {
  console.log("Deleting...");
}
```

---

### `useUpdateEquipmentAvailability()` 🆕

Hook mutation để cập nhật trạng thái availability

**Returns**: `UseMutationResult`

**Ví dụ**:
```typescript
import { useUpdateEquipmentAvailability } from "@/hooks/equipment/useEquipmentAdmin";

const availabilityMutation = useUpdateEquipmentAvailability();

const toggleAvailability = async (equipmentId: string, currentAvailability: boolean) => {
  await availabilityMutation.mutateAsync({
    id: equipmentId,
    availability: !currentAvailability,
  });
};
```

---

### `useUpdateEquipmentStock()` 🆕

Hook mutation để cập nhật số lượng tồn kho

**Returns**: `UseMutationResult`

**Ví dụ**:
```typescript
import { useUpdateEquipmentStock } from "@/hooks/equipment/useEquipmentAdmin";

const stockMutation = useUpdateEquipmentStock();

const updateStock = async (equipmentId: string, newQuantity: number) => {
  await stockMutation.mutateAsync({
    id: equipmentId,
    quantity: newQuantity,
  });
};
```

---

## 📋 Bảng so sánh

| Hook | Đối tượng | Lọc Available | Lọc Active | Lọc Stock > 0 | Use Case |
|------|-----------|---------------|------------|---------------|----------|
| `useEquipmentList` | USER | ✅ | ✅ | ✅ | Trang thuê thiết bị |
| `useEquipmentDetail` | USER | ❌ | ❌ | ❌ | Chi tiết thiết bị |
| `useAllEquipmentList` | ADMIN | ❌ | ❌ | ❌ | Quản lý tất cả thiết bị |

---

## 🔄 Migration Guide

### Nếu bạn đang dùng `useEquipment.ts` (old)

**Không cần thay đổi gì** - file cũ vẫn hoạt động bình thường (re-export).

### Nên migrate sang (recommended)

#### Cho USER pages:
```typescript
// ❌ Cũ
import { useEquipmentList, useEquipmentDetail } from "@/hooks/equipment/useEquipment";

// ✅ Mới (rõ ràng hơn)
import { useEquipmentList, useEquipmentDetail } from "@/hooks/equipment/useEquipmentUser";
```

#### Cho ADMIN pages:
```typescript
// ❌ Cũ
import { useAllEquipmentList } from "@/hooks/equipment/useEquipment";

// ✅ Mới (rõ ràng hơn)
import { useAllEquipmentList } from "@/hooks/equipment/useEquipmentAdmin";
```

---

## 📝 Best Practices

1. **USER pages** (Products, CameraRental, StudioBooking):
   - ✅ Dùng `useEquipmentUser.ts`
   - Chỉ hiển thị thiết bị có sẵn để thuê

2. **ADMIN pages** (EquipmentManagement):
   - ✅ Dùng `useEquipmentAdmin.ts`
   - Hiển thị tất cả thiết bị để quản lý

3. **Import rõ ràng**:
   - Import từ file cụ thể thay vì file chung
   - Giúp code dễ hiểu và maintain hơn

---

## 🚀 Query Keys

Để tránh xung đột cache:

```typescript
// USER
["equipments", page, pageSize, category, searchName]
["equipment", id]

// ADMIN
["all-equipments", page, pageSize]
```
