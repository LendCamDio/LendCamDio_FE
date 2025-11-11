# Equipment Services

Các service functions để quản lý Equipment trong hệ thống.

## 📋 Danh sách Functions

### 🔍 Read Operations (Public)

#### `getAvailableEquipments(page, pageSize)`
Lấy danh sách thiết bị **available** (có sẵn để thuê)

**Endpoint**: `GET /api/equipments/available`

**Parameters**:
```typescript
page: number       // Trang hiện tại
pageSize: number   // Số items mỗi trang
```

**Returns**: `Promise<EquipmentResponse>`

**Example**:
```typescript
import { getAvailableEquipments } from "@/services/equipmentService";

const response = await getAvailableEquipments(1, 10);
const equipments = response.data?.items || [];
```

---

#### `getEquipments(page, pageSize)`
Lấy **tất cả** thiết bị (dùng cho Admin)

**Endpoint**: `GET /api/equipments/available`

**Parameters**:
```typescript
page: number
pageSize: number
```

**Returns**: `Promise<EquipmentResponse>`

---

#### `getEquipmentById(id)`
Lấy chi tiết một thiết bị theo ID

**Endpoint**: `GET /api/equipments/{id}`

**Parameters**:
```typescript
id: string  // Equipment ID (GUID)
```

**Returns**: `Promise<SingleEquipmentResponse>`

**Example**:
```typescript
const response = await getEquipmentById("abc-123-def");
const equipment = response.data;
```

---

#### `getEquipmentBySearchName(name, page, pageSize)`
Tìm kiếm thiết bị theo tên

**Endpoint**: `GET /api/equipments/search`

**Parameters**:
```typescript
name: string      // Từ khóa tìm kiếm
page: number
pageSize: number
```

**Returns**: `Promise<EquipmentResponse>`

**Example**:
```typescript
const response = await getEquipmentBySearchName("canon", 1, 10);
```

---

#### `getEquipmentsByCategory(category, page, pageSize)`
Lấy thiết bị theo category

**Endpoint**: `GET /api/equipments/category/{category}`

**Parameters**:
```typescript
category: string  // Category ID
page: number
pageSize: number
```

**Returns**: `Promise<EquipmentResponse>`

---

#### `getAvailableEquipmentsByCategory(category, page, pageSize)`
Lấy thiết bị **available** theo category

**Note**: Filter thêm ở frontend (availability, status, stock)

---

### ✏️ Write Operations (Admin/Supplier Only)

#### `createEquipment(data)` 🔒
Tạo thiết bị mới

**Endpoint**: `POST /api/equipments`

**Authorization**: Admin, Supplier

**Parameters**:
```typescript
data: CreateEquipmentRequestDto = {
  name: string;
  description: string;
  categoryId: string;
  supplierId?: string | null;
  stockQuantity: number;
  dailyPrice?: number | null;    // Giá thuê theo ngày
  price?: number | null;         // Giá mua
  depositAmount: number;         // Tiền đặt cọc
  insuranceRequired: boolean;    // Có yêu cầu bảo hiểm không
  condition: EquipmentCondition; // 0=New, 1=Good, 2=Used, 3=Damaged
  availability?: boolean;        // Mặc định: true
}
```

**Returns**: `Promise<CreateEquipmentResponse>`

**Example**:
```typescript
import { createEquipment } from "@/services/equipmentService";
import { EquipmentCondition } from "@/types/entity.type";

const newEquipment = {
  name: "Canon EOS R5",
  description: "Professional mirrorless camera",
  categoryId: "category-guid-here",
  supplierId: null, // Hoặc supplier-guid
  stockQuantity: 5,
  dailyPrice: 500000,
  price: 95000000,
  depositAmount: 10000000,
  insuranceRequired: true,
  condition: EquipmentCondition.New, // 0
  availability: true,
};

try {
  const response = await createEquipment(newEquipment);
  if (response.success) {
    console.log("Created:", response.data);
  }
} catch (error) {
  console.error("Failed to create:", error);
}
```

---

#### `updateEquipment(id, data)` 🔒
Cập nhật thiết bị

**Endpoint**: `PUT /api/equipments/{id}`

**Authorization**: Admin, Supplier

**Parameters**:
```typescript
id: string
data: UpdateEquipmentRequestDto = {
  // Giống CreateEquipmentRequestDto
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
}
```

**Returns**: `Promise<UpdateEquipmentResponse>`

**Example**:
```typescript
const updatedData = {
  name: "Canon EOS R5 (Updated)",
  description: "Updated description",
  categoryId: "category-guid",
  supplierId: null,
  stockQuantity: 10,
  dailyPrice: 550000,
  price: 95000000,
  depositAmount: 10000000,
  insuranceRequired: true,
  condition: EquipmentCondition.Good,
  availability: true,
};

const response = await updateEquipment("equipment-id-here", updatedData);
```

---

#### `deleteEquipment(id)` 🔒
Xóa thiết bị (soft delete - đánh dấu Inactive)

**Endpoint**: `DELETE /api/equipments/{id}`

**Authorization**: Admin, Supplier

**Parameters**:
```typescript
id: string  // Equipment ID
```

**Returns**: `Promise<ApiResponse<{ equipmentId: string; message: string }>>`

**Example**:
```typescript
const response = await deleteEquipment("equipment-id-here");
if (response.success) {
  console.log("Deleted successfully");
}
```

---

#### `updateEquipmentAvailability(id, availability)` 🔒
Cập nhật trạng thái available

**Endpoint**: `PATCH /api/equipments/{id}/availability`

**Authorization**: Admin, Supplier

**Parameters**:
```typescript
id: string
availability: boolean
```

**Returns**: `Promise<ApiResponse<{ equipmentId: string; availability: boolean; message: string }>>`

**Example**:
```typescript
// Đánh dấu không available
await updateEquipmentAvailability("equipment-id", false);

// Đánh dấu available
await updateEquipmentAvailability("equipment-id", true);
```

---

#### `updateEquipmentStock(id, quantity)` 🔒
Cập nhật số lượng tồn kho

**Endpoint**: `PATCH /api/equipments/{id}/stock`

**Authorization**: Admin, Supplier

**Parameters**:
```typescript
id: string
quantity: number  // >= 0
```

**Returns**: `Promise<ApiResponse<{ equipmentId: string; stockQuantity: number; message: string }>>`

**Example**:
```typescript
// Cập nhật stock về 20
await updateEquipmentStock("equipment-id", 20);
```

---

## 🎯 Use Cases

### 1. Tạo Equipment mới (Admin)
```typescript
import { createEquipment } from "@/services/equipmentService";
import { EquipmentCondition } from "@/types/entity.type";

const handleCreate = async (formData) => {
  try {
    const response = await createEquipment({
      name: formData.name,
      description: formData.description,
      categoryId: formData.categoryId,
      supplierId: formData.supplierId || null,
      stockQuantity: formData.stockQuantity,
      dailyPrice: formData.dailyPrice,
      price: formData.price,
      depositAmount: formData.depositAmount,
      insuranceRequired: formData.insuranceRequired,
      condition: parseInt(formData.condition), // Convert to enum
      availability: true,
    });

    if (response.success) {
      showToast("Equipment created successfully!", "success");
      refetch(); // Refresh list
    }
  } catch (error) {
    showToast("Failed to create equipment", "error");
  }
};
```

### 2. Update Equipment (Admin)
```typescript
import { updateEquipment } from "@/services/equipmentService";

const handleUpdate = async (equipmentId, formData) => {
  try {
    const response = await updateEquipment(equipmentId, {
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
    });

    if (response.success) {
      showToast("Equipment updated successfully!", "success");
      refetch();
    }
  } catch (error) {
    showToast("Failed to update equipment", "error");
  }
};
```

### 3. Delete Equipment (Admin)
```typescript
import { deleteEquipment } from "@/services/equipmentService";

const handleDelete = async (equipmentId) => {
  try {
    const response = await deleteEquipment(equipmentId);
    if (response.success) {
      showToast("Equipment deleted successfully!", "success");
      refetch();
    }
  } catch (error) {
    if (error.response?.status === 404) {
      showToast("Equipment not found", "error");
    } else {
      showToast("Failed to delete equipment", "error");
    }
  }
};
```

---

## 🔑 Authorization

Các operations yêu cầu authentication:
- ✅ **Read operations**: Public (không cần auth)
- 🔒 **Create**: Admin, Supplier
- 🔒 **Update**: Admin, Supplier
- 🔒 **Delete**: Admin, Supplier
- 🔒 **Update Availability**: Admin, Supplier
- 🔒 **Update Stock**: Admin, Supplier

Token được tự động attach qua `api` interceptor.

---

## 📝 Notes

1. **EquipmentCondition Enum**:
   ```typescript
   enum EquipmentCondition {
     New = 0,
     Good = 1,
     Used = 2,
     Damaged = 3
   }
   ```

2. **Soft Delete**: Delete chỉ đánh dấu `status = Inactive`, không xóa vĩnh viễn

3. **Availability vs Status**:
   - `availability`: Có sẵn để cho thuê (true/false)
   - `status`: Active/Inactive (0/1)

4. **Rating**: Tự động fetch từ Review service khi get equipment

5. **Default Supplier**: Nếu `supplierId = null`, backend sẽ gán default supplier (LendCamDio)

---

## ⚠️ Error Handling

```typescript
try {
  const response = await createEquipment(data);
  if (response.success) {
    // Success
  }
} catch (error: any) {
  if (error.response?.status === 401) {
    // Unauthorized
  } else if (error.response?.status === 403) {
    // Forbidden
  } else if (error.response?.status === 400) {
    // Bad Request - validation error
    console.log(error.response?.data?.message);
  } else {
    // Other errors
  }
}
```
