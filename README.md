# LendCamDio Frontend

Đây là project frontend chính cho nền tảng cho thuê thiết bị LendCamDio, được xây dựng trên nền tảng React, TypeScript và Vite. Dự án áp dụng kiến trúc component-based hiện đại, được thiết kế để đảm bảo trải nghiệm người dùng tốt nhất, hiệu suất cao và dễ dàng mở rộng.

## Mục lục

- [LendCamDio Frontend](#lendcamdio-frontend)
  - [Mục lục](#mục-lục)
  - [Kiến trúc](#kiến-trúc)
  - [Công nghệ sử dụng](#công-nghệ-sử-dụng)
  - [Tính năng chính](#tính-năng-chính)
  - [Yêu cầu](#yêu-cầu)
  - [Hướng dẫn cài đặt \& Cấu hình](#hướng-dẫn-cài-đặt--cấu-hình)
  - [Khởi chạy dự án](#khởi-chạy-dự-án)
    - [Development Mode](#development-mode)
    - [Production Build](#production-build)
  - [Cấu trúc dự án](#cấu-trúc-dự-án)
  - [Đóng góp](#đóng-góp)
  - [License](#license)
  - [Dự án liên quan](#dự-án-liên-quan)

## Kiến trúc

Dự án được xây dựng theo kiến trúc component-based hiện đại của React, với sự tách biệt rõ ràng các thành phần:

- **Component Layer**: Chứa các thành phần UI có thể tái sử dụng.
- **Pages Layer**: Tổ hợp các component để tạo thành các trang hoàn chỉnh.
- **Routing Layer**: Quản lý điều hướng giữa các trang và phân quyền người dùng.
- **Services Layer**: Chịu trách nhiệm giao tiếp với API và các dịch vụ bên ngoài.
- **Context & Hooks**: Quản lý state toàn cục và cung cấp các hook tái sử dụng.

---

## Công nghệ sử dụng

- **Framework UI**: React (v19)
- **Ngôn ngữ**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM (v7)
- **State Management**: React Query (@tanstack/react-query)
- **Form Handling**: React Hook Form
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **UI Components**:
  - Radix UI components
  - Dialog, Form và các component tùy chỉnh khác
- **Notifications**: Sonner
- **Animations**: Framer Motion
- **Maps Integration**: Google Maps (@react-google-maps/api)
- **Authentication**: Google OAuth (@react-oauth/google)

---

## Tính năng chính

- Giao diện người dùng hiện đại và responsive
- Xác thực người dùng (Đăng nhập, Đăng ký, Quên mật khẩu)
- Phân quyền người dùng (Khách hàng, Nhà cung cấp, Admin)
- Trang chủ với các sản phẩm nổi bật và danh mục
- Tìm kiếm và lọc sản phẩm
- Trang chi tiết sản phẩm với gallery hình ảnh
- Hệ thống đánh giá và nhận xét sản phẩm
- Giỏ hàng và quy trình thanh toán
- Tích hợp bản đồ để hiển thị vị trí studio
- Dashboard cho khách hàng, nhà cung cấp và admin
- Tích hợp AI Assistant cho hỗ trợ khách hàng

---

## Yêu cầu

- Node.js (version 16 hoặc cao hơn)
- npm hoặc yarn
- Tài khoản và API Keys từ:
  - Google Maps API
  - Google Cloud Platform (cho Google Auth)

---

## Hướng dẫn cài đặt & Cấu hình

1. **Clone repository:**
   ```bash
   git clone https://github.com/LendCamDio/LendCamDio-FE.git
   cd LendCamDio-FE/FrontEnd
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   # hoặc
   yarn
   ```

3. **Cấu hình môi trường:**
   Tạo file `.env` trong thư mục gốc dựa trên mẫu sau:
   ```
   VITE_API_URL=http://localhost:7119/api
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

---

## Khởi chạy dự án

### Development Mode

```bash
npm run dev
# hoặc
yarn dev
```

Ứng dụng sẽ được khởi chạy tại địa chỉ http://localhost:5173

### Production Build

```bash
npm run build
npm run preview
# hoặc
yarn build
yarn preview
```

---

## Cấu trúc dự án

- `/src` - Mã nguồn chính
  - `/assets` - Tài nguyên tĩnh (hình ảnh, icons, fonts)
  - `/components` - Các component UI có thể tái sử dụng
    - `/common` - Các component dùng chung (Navbar, Footer, etc.)
    - `/ui` - Các component cơ bản (Button, Form elements, etc.)
    - `/products`, `/studios`, etc. - Components cho từng module cụ thể
  - `/contexts` - React contexts cho quản lý state toàn cục
  - `/hooks` - Custom React hooks
  - `/layouts` - Các layout trang (Main, Admin, Auth, etc.)
  - `/pages` - Các trang trong ứng dụng
  - `/routes` - Cấu hình routing và bảo vệ route
  - `/services` - Các service giao tiếp API
  - `/utils` - Các hàm tiện ích
  - `/types` - TypeScript type definitions

## Đóng góp
Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) để biết chi tiết về quy trình đóng góp và code of conduct.

## License
Dự án này được cấp phép theo giấy phép Apache License 2.0 - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## Dự án liên quan
- [LendCamDio Backend](https://github.com/LendCamDio/LendCamDio-BE.git)