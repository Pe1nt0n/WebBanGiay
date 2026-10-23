# 👟 SGU SNEAKER - Website Cửa Hàng Giày Thể Thao Trực Tuyến

> **SGU SNEAKER** là giải pháp website thương mại điện tử chuyên cung cấp các dòng giày Sneaker, giày chạy bộ và giày thể thao. Hệ thống được xây dựng hoàn toàn bằng công nghệ Front-End thuần (HTML5, CSS3, Vanilla JavaScript), hỗ trợ đầy đủ các tính năng mua sắm của khách hàng và bảng điều khiển quản trị toàn diện dành cho chủ cửa hàng.

---

## 🌟 Tính Năng Nổi Bật

### 1. Phân Hệ Khách Hàng (Customer Storefront)
- **Trang chủ & Khám phá sản phẩm (`index.html`)**:
  - Banner trình chiếu hiện đại, các danh mục giày nổi bật (Sneaker, Chạy bộ, Đá bóng, Công sở).
  - Tìm kiếm nhanh tức thì theo tên giày.
  - Bộ lọc nâng cao đa tiêu chí kết hợp: Theo khoảng giá (Dưới 1.5tr, 1.5tr - 2.5tr, Trên 2.5tr), Theo danh mục giày và sắp xếp giá tăng/giảm.
  - Phân trang hiển thị sản phẩm mượt mà.
  - Hệ thống xác thực: Đăng ký, Đăng nhập, Xem & Chỉnh sửa thông tin cá nhân.
- **Chi tiết sản phẩm chuyên sâu (`product-detail.html`)**:
  - Hình ảnh sản phẩm độ phân giải cao.
  - Bảng thông số kỹ thuật (Chất liệu, Công nghệ đệm, Độ bám, Trọng lượng).
  - Lựa chọn kích cỡ giày trực quan (Size 38 - 44), tích hợp bảng hướng dẫn chọn size chuẩn chân.
  - Tự động kiểm tra số lượng tồn kho theo thời gian thực trước khi thêm vào giỏ.
  - Tùy chọn "Thêm vào giỏ hàng" hoặc "Mua ngay" chuyển thẳng đến trang thanh toán.
- **Giỏ hàng & Quy trình Đặt hàng (`cart.html`)**:
  - Quản lý giỏ hàng: Tăng/giảm số lượng, xóa từng món hoặc xóa toàn bộ giỏ.
  - Lựa chọn địa chỉ nhận hàng linh hoạt: Dùng địa chỉ mặc định từ hồ sơ cá nhân hoặc nhập địa chỉ mới.
  - Phương thức thanh toán phong phú: Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng (tích hợp VietQR động), Thẻ thanh toán quốc tế.
  - Xem và in hóa đơn chi tiết ngay sau khi hoàn tất đặt hàng.
- **Tra cứu & Lịch sử đơn hàng**:
  - Khách hàng có thể theo dõi danh sách các đơn đã đặt và tiến độ xử lý (Mới đặt, Đã xử lý, Đã giao, Hủy).
  - Xem lại chi tiết từng món hàng trong đơn cũ.
  - Cho phép hủy đơn hàng nếu đơn vẫn ở trạng thái "Mới đặt", tự động hoàn trả số lượng vào kho.

---

### 2. Phân Hệ Quản Trị Viên (Admin Dashboard)
- **Cổng đăng nhập quản trị riêng biệt (`admin.html`)**:
  - Màn hình bảo mật tách biệt với phân hệ người dùng, hỗ trợ khóa màn hình nhanh và lưu phiên làm việc an toàn.
- **Thống kê KPI thời gian thực**:
  - Tổng doanh thu, Số lượng đơn hàng, Tổng sản phẩm đang kinh doanh và Cảnh báo sản phẩm sắp hết hàng.
- **Quản lý khách hàng**:
  - Danh sách tài khoản khách hàng, trạng thái hoạt động.
  - Khóa / Mở khóa tài khoản khách hàng vi phạm.
  - Reset mật khẩu khách hàng về mặc định nhanh chóng.
- **Quản lý danh mục & Loại giày**:
  - Thêm mới, chỉnh sửa thông tin hoặc ẩn/hiện loại giày.
- **Quản lý sản phẩm**:
  - Thêm sản phẩm mới với ảnh đại diện, danh mục, mô tả chi tiết và xem trước ảnh trực tiếp (Live Preview).
  - Chỉnh sửa thông tin hoặc tạm ẩn sản phẩm ngừng kinh doanh.
- **Quản lý nhập hàng**:
  - Lập phiếu nhập kho (ngày nhập, số lượng, đơn giá vốn).
  - Chỉnh sửa phiếu nhập trước khi xác nhận.
  - Nút "Hoàn thành" phiếu nhập giúp tự động cộng dồn số lượng vào tồn kho thực tế và khóa sửa phiếu.
- **Thiết lập giá bán & % Lợi nhuận**:
  - Thiết lập tỉ lệ lợi nhuận cho từng sản phẩm hoặc áp dụng hàng loạt theo danh mục giày.
  - Tự động tính toán giá bán đề xuất dựa trên giá vốn và % lợi nhuận.
- **Quản lý đơn hàng & In hóa đơn**:
  - Lọc và tìm kiếm đơn theo trạng thái (Mới đặt, Đã xử lý, Đã giao, Hủy).
  - Cập nhật tiến độ đơn hàng và xem chi tiết danh sách sản phẩm khách đã mua.
  - Tích hợp tính năng In hóa đơn chuyên nghiệp theo khổ chuẩn in ấn.
- **Báo cáo tồn kho & Cảnh báo**:
  - Thống kê chi tiết Xuất - Nhập - Tồn của từng mã giày.
  - Tự động đánh dấu đỏ cảnh báo khi tồn kho dưới 5 đôi.
  - Thao tác nhanh 1 chạm: Tạo ngay phiếu nhập hàng từ danh sách cảnh báo tồn thấp.

---

## 🛠️ Công Nghệ Sử Dụng

| Thành phần | Công nghệ / Kỹ thuật |
| :--- | :--- |
| **Cấu trúc** | HTML5 Semantic Tags (`header`, `main`, `section`, `article`, `footer`, `nav`) |
| **Giao diện** | CSS3 Modern (CSS Grid, Flexbox, CSS Variables, Keyframe Animations, Responsive Design) |
| **Xử lý Logic** | JavaScript Thuần (Vanilla ES6+), không phụ thuộc bất kỳ thư viện bên ngoài |
| **Cơ sở dữ liệu** | HTML5 LocalStorage & SessionStorage (đồng bộ dữ liệu thời gian thực giữa 4 trang) |
| **Font chữ** | Google Fonts ([Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)) |
| **Khả năng tương thích** | Hoạt động 100% Offline (chạy trực tiếp qua giao thức `file:///` trên trình duyệt Chrome, Edge, Firefox, Safari) |

---

## 📁 Cấu Trúc Thư Mục Dự Án

```text
DoAnWeb/
├── index.html                   # Giao diện Trang chủ & Khám phá danh mục giày
├── product-detail.html          # Giao diện Chi tiết sản phẩm & Chọn size
├── cart.html                    # Giao diện Giỏ hàng, Thanh toán & Lịch sử mua hàng
├── admin.html                   # Giao diện Bảng điều khiển Quản trị viên
│
├── admin/
│   └── index.html               # Tự động điều hướng nhanh về trang quản trị
│
├── assets/
│   ├── css/
│   │   ├── common.css           # Bảng màu, typography, nút bấm, modal, toast dùng chung
│   │   ├── index.css            # Stylesheets dành riêng cho Trang chủ & Bộ lọc
│   │   ├── product-detail.css   # Stylesheets cho Thư viện ảnh, Bảng size, Thông số
│   │   ├── cart.css             # Stylesheets cho Giỏ hàng, Thanh toán & Hóa đơn
│   │   └── admin.css            # Stylesheets cho Giao diện quản trị & Bản in hóa đơn
│   │
│   └── js/
│       ├── init-data.js         # Bộ dữ liệu mẫu khởi tạo dùng chung (LocalStorage Core)
│       ├── index.js             # Logic xử lý tìm kiếm, lọc, phân trang, đăng nhập/đăng ký
│       ├── product-detail.js    # Logic tải dữ liệu theo ID, kiểm kho, thêm giỏ
│       ├── cart.js              # Logic giỏ hàng, đặt hàng, hủy đơn, lịch sử mua
│       └── admin.js             # Logic 8 phân hệ quản trị cửa hàng
│
└── docs/                        # Tài liệu hướng dẫn & Thiết kế hệ thống
```

---

## 🚀 Hướng Dẫn Trải Nghiệm Dự Án

1. **Khởi chạy trực tiếp (Không cần cài đặt)**:
   - Tải về hoặc clone repository về máy tính:
     ```bash
     git clone https://github.com/Pe1nt0n/WebBanGiay.git
     ```
   - Mở trực tiếp tệp `index.html` bằng bất kỳ trình duyệt web nào (Google Chrome, Microsoft Edge, Mozilla Firefox,...).
2. **Tài khoản dùng thử sẵn có**:
   - **Khách hàng mẫu**:
     - Email: `nguyenvana@gmail.com` | Mật khẩu: `123456`
     - Email: `tranthib@gmail.com` | Mật khẩu: `123456`
   - **Tài khoản Quản trị Admin**:
     - Đường dẫn: Truy cập `admin.html` (hoặc nhấn nút "🔐 Cổng Quản Trị Admin" trên thanh tiêu đề).
     - Tài khoản: `admin_sgu` | Mật khẩu: `admin123`
