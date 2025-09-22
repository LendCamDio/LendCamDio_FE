# 🔗 Routing Checklist – LendCamDio

## 1. Public (không cần login)

* `/` → Trang chủ
* `/auth/login` → Đăng nhập
* `/auth/register` → Đăng ký
* `/studios` → Danh sách studio
* `/studios/:id` → Chi tiết studio
* `/equipments` → Danh sách thiết bị
* `/equipments/:id` → Chi tiết thiết bị
* `/about` → Giới thiệu
* `/contact` → Liên hệ
* `/help` → Trợ giúp

---

## 2. Customer (người thuê)

Prefix: `/customer`

* `/customer/profile` → Hồ sơ cá nhân
* `/customer/bookings` → Danh sách đơn thuê
* `/customer/bookings/:id` → Chi tiết đơn thuê
* `/customer/payments` → Lịch sử thanh toán
* `/customer/favorites` → Danh sách thiết bị/studio đã lưu
* `/customer/recommendations` → Gợi ý thiết bị AI

---

## 3. Supplier (chủ studio / cho thuê thiết bị)

Prefix: `/supplier`

* `/supplier/dashboard` → Dashboard tổng quan
* `/supplier/equipments` → Quản lý thiết bị
* `/supplier/equipments/create` → Đăng thiết bị mới
* `/supplier/equipments/:id/edit` → Chỉnh sửa thiết bị
* `/supplier/bookings` → Danh sách đơn thuê liên quan đến thiết bị/studio của mình
* `/supplier/payments` → Quản lý thanh toán nhận được
* `/supplier/profile` → Hồ sơ nhà cung cấp (studio info, verification)

---

## 4. Admin

Prefix: `/admin`

* `/admin/dashboard` → Dashboard tổng quan
* `/admin/users` → Quản lý user
* `/admin/users/:id` → Chi tiết user
* `/admin/studios` → Quản lý studio
* `/admin/equipments` → Quản lý thiết bị
* `/admin/bookings` → Quản lý đơn thuê
* `/admin/payments` → Quản lý thanh toán
* `/admin/reports` → Báo cáo & thống kê
* `/admin/settings` → Cấu hình hệ thống

---

## 5. Quy tắc bổ sung

* **Consistent**: mọi resource CRUD theo pattern:

  * `/resource` → danh sách
  * `/resource/:id` → chi tiết
  * `/resource/create` → tạo mới
  * `/resource/:id/edit` → chỉnh sửa
* **Role prefix** (`/customer`, `/supplier`, `/admin`) giúp dễ tách layout, phân quyền.
* **SEO-friendly slug**: ngoài `:id` có thể thêm `:slug`.
  Ví dụ: `/studios/:id-:slug` → `/studios/123-studio-quan-1`
