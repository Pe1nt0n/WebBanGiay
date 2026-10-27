# 👟 SGU SNEAKER - Website Cửa Hàng Giày Thể Thao & Thời Trang Trực Tuyến

> **SGU SNEAKER** là giải pháp website thương mại điện tử chuyên nghiệp cung cấp các dòng giày Sneaker, giày chạy bộ và giày thể thao chính hãng. Hệ thống được xây dựng hoàn toàn bằng công nghệ Front-End thuần (HTML5, CSS3, Vanilla JavaScript, LocalStorage), hỗ trợ đầy đủ luồng trải nghiệm mua sắm hiện đại cho khách hàng và bảng điều khiển quản trị toàn diện cho chủ cửa hàng.

---

## 🌟 Tính Năng Nổi Bật

### 1. Phân Hệ Khách Hàng (Customer Storefront)
* **Trang chủ & Khám phá sản phẩm (`index.html`)**:
  - Banner giới thiệu thương hiệu tối giản, hiện đại, không gian hình ảnh trực quan.
  - Tìm kiếm nhanh tức thì theo tên giày và thương hiệu (hỗ trợ tìm kiếm không dấu).
  - Bộ lọc nâng cao đa tiêu chí kết hợp:
    - Lọc theo phân loại sản phẩm động.
    - Lọc theo thương hiệu sản xuất động (Nike, Adidas, Jordan, Puma, Clarks).
    - Lọc theo khoảng giá linh hoạt kèm các nút chips chọn nhanh (`Dưới 1.5 triệu`, `1.5 - 2.5 triệu`, `Trên 2.5 triệu`).
    - Lọc nhanh theo kích cỡ giày (Size EU 38 -> 44).
  - Sắp xếp sản phẩm linh hoạt (Nổi bật nhất, Giá tăng dần, Giá giảm dần, Đánh giá cao nhất, Tên A-Z).
  - Phân trang hiển thị sản phẩm mượt mà (6 sản phẩm/trang), nút bấm responsive chống rớt dòng.
  - Popup Xem Nhanh (Quick View) cho phép chọn size, kiểm tra tồn kho và thêm nhanh vào giỏ hàng ngay tại trang chủ.
  - Hệ thống xác thực: Đăng ký thành viên, Đăng nhập, Xem & Chỉnh sửa hồ sơ cá nhân.
  - Footer thương mại 3 cột sang trọng, liên kết nhanh chính sách và thông tin cửa hàng thực tế.

* **Chi tiết sản phẩm chuyên sâu (`product-detail.html`)**:
  - Thư viện ảnh gallery độ nét cao, hỗ trợ chuyển đổi thumbnail và phóng to chi tiết.
  - Quản lý kích cỡ giày thông minh:
    - Tự động nhận diện tồn kho của từng size.
    - Size nào hết hàng (`stock = 0`) được **làm mờ, gạch chéo** và gắn nhãn cảnh báo **`Hết`** ở góc, chặn khách đặt hàng size đã hết.
    - Tự động hiển thị số lượng tồn kho khả dụng thời gian thực khi chọn size (`✅ Còn X đôi trong kho`).
    - Tự động khóa nút mua nếu toàn bộ các size của sản phẩm đều hết hàng.
  - Tích hợp popup Bảng hướng dẫn chọn size giày chuẩn form chân (Size Guide).
  - Tùy chọn "Thêm vào giỏ hàng" hoặc "Mua ngay" chuyển thẳng đến trang thanh toán.
  - Hệ thống Tabs chuyên sâu:
    - *Mô tả & Công nghệ:* Thông tin đệm khí, độ bám, chất liệu Flyknit.
    - *Thông số kỹ thuật:* Thương hiệu, chất liệu, trọng lượng, xuất xứ.
    - *Đánh giá khách hàng:* Xem nhận xét thật và gửi đánh giá kèm xếp hạng sao (lưu trữ trực tiếp vào LocalStorage).

* **Giỏ hàng & Quy trình Đặt hàng (`cart.html`)**:
  - Quy trình 3 bước trực quan: *1. Giỏ Hàng & Thanh Toán → 2. Xem Lại Đơn Đặt Hàng → 3. Lịch Sử Các Đơn Hàng*.
  - Quản lý giỏ hàng: Tăng/giảm số lượng, xóa từng món hoặc làm rỗng giỏ hàng.
  - Hệ thống Voucher giảm giá: Hỗ trợ nhập mã hoặc click nhanh các voucher ưu đãi (`GIAM10`, `SNEAKER50K`, `FREESHIP`).
  - Lựa chọn địa chỉ giao hàng linh hoạt: Sử dụng địa chỉ mặc định hoặc nhập địa chỉ mới khi nhận hàng.
  - Phương thức thanh toán phong phú:
    - Thanh toán khi nhận hàng (**COD**).
    - Chuyển khoản ngân hàng qua mã **VietQR** động (tự động tạo mã QR chính xác theo tổng tiền đơn hàng).
  - Tra cứu tiến độ đơn hàng và xem chi tiết từng món đồ trong đơn cũ.
  - Cho phép hủy đơn hàng nếu đơn vẫn ở trạng thái *Chờ xác nhận*, tự động hoàn trả số lượng vào kho.
  - **Tính năng In hóa đơn bán hàng (`🖨️ In Hóa Đơn`)**: Hỗ trợ in hoặc xuất file PDF hóa đơn bán lẻ chuẩn A4 theo định dạng `@media print`.

---

### 2. Phân Hệ Quản Trị Viên (Admin Dashboard)
* **Cổng quản trị bảo mật riêng biệt (`admin.html`)**:
  - Giao diện quản trị tách biệt, hỗ trợ khóa màn hình nhanh và lưu phiên làm việc an toàn bằng `SessionStorage`.
* **Bảng điều khiển & Thống kê KPI thời gian thực**:
  - Theo dõi Doanh thu dự kiến, Đơn hàng mới cần xử lý, Tổng số mẫu giày đang bán và Cảnh báo sản phẩm sắp hết hàng.
* **Quản lý Danh mục & Loại giày**:
  - Bảng danh mục trực quan kèm số lượng sản phẩm thuộc từng loại.
  - Thêm mới phân loại giày.
  - Chỉnh sửa thông tin loại giày: Ô mã loại tự động khóa (`readonly`) để bảo vệ ID khóa chính, nút bấm chuyển thành `💾 Cập Nhật Loại` kèm nút `Hủy`.
  - Khi đổi tên loại, hệ thống **tự động cập nhật tên danh mục cho toàn bộ sản phẩm con** trong kho.
  - Tạm ẩn / Hiển thị lại loại sản phẩm: Khi tạm ẩn, trang bán hàng sẽ tự động ẩn danh mục đó để khách không nhìn thấy.
  - Hệ thống thông báo chống spam (tối đa 3 toast cùng lúc).
* **Quản lý Sản phẩm**:
  - Thêm sản phẩm mới với tính năng tải ảnh từ máy tính (FileReader Base64) hoặc nhập link ảnh online.
  - Quản lý số lượng tồn kho chi tiết cho từng size (từ size 38 đến 44).
  - Chỉnh sửa thông tin, giá vốn, % lợi nhuận, giá bán hoặc xóa sản phẩm.
* **Quản lý Đơn đặt hàng**:
  - Danh sách đơn hàng từ khách với đầy đủ thông tin: Mã đơn, Khách hàng, SĐT, Ngày đặt, Phương thức thanh toán, Trạng thái.
  - Duyệt đơn hàng: Chuyển đổi trạng thái từ *Chờ xử lý* sang *Đang giao*, *Đã hoàn thành* hoặc *Hủy đơn*.
  - Xem chi tiết đơn hàng và bấm **`🖨️ In Hóa Đơn / Phiếu Xuất Kho`** chuẩn in ấn.
* **Quản lý Khách hàng**:
  - Danh sách tài khoản thành viên, số đơn hàng đã mua và trạng thái hoạt động.
  - Khóa / Mở khóa tài khoản khách hàng.
* **Báo cáo & Thống kê**:
  - Biểu đồ doanh thu trực quan vẽ bằng HTML5 Canvas chart.
  - Lọc báo cáo theo khoảng thời gian và xuất báo cáo.

---

## 🛠️ Công Nghệ Sử Dụng

| Thành phần | Công nghệ / Kỹ thuật |
| :--- | :--- |
| **Cấu trúc** | HTML5 Semantic Tags (`header`, `main`, `section`, `article`, `footer`, `nav`, `aside`) |
| **Giao diện** | CSS3 Modern (CSS Grid, Flexbox, CSS Custom Properties, Keyframe Animations, `@media print`) |
| **Xử lý Logic** | JavaScript thuần (Vanilla ES6+), module hóa rõ ràng, không phụ thuộc thư viện thứ 3 |
| **Cơ sở dữ liệu** | HTML5 `LocalStorage` & `SessionStorage` (đồng bộ dữ liệu thời gian thực giữa 4 trang) |
| **Font chữ** | Google Fonts ([Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)) |
| **Tương thích** | Chạy 100% Offline (chạy trực tiếp qua giao thức `file:///` trên mọi trình duyệt Chrome, Edge, Firefox, Safari) |

---

## 📁 Cấu Trúc Thư Mục Chuẩn Hóa

```text
DoAnWeb/
├── index.html                   # [Trang 1] Cửa hàng & Danh mục sản phẩm
├── product-detail.html          # [Trang 2] Chi tiết sản phẩm chuyên sâu & Đánh giá
├── cart.html                    # [Trang 3] Giỏ hàng, Thanh toán VietQR & Lịch sử đơn
├── admin.html                   # [Trang 4] Bảng điều khiển quản trị toàn diện
│
├── assets/
│   ├── css/
│   │   ├── common.css           # Biến màu, typography, header, footer, toast, in ấn chung
│   │   ├── index.css            # Stylesheets cho Trang chủ, bộ lọc, hero banner, phân trang
│   │   ├── product-detail.css   # Stylesheets cho Gallery ảnh, size chips hết hàng, bảng size
│   │   ├── cart.css             # Stylesheets cho Giỏ hàng, thanh toán VietQR & in hóa đơn
│   │   └── admin.css            # Stylesheets cho Dashboard, bảng quản lý & phiếu xuất kho
│   │
│   ├── images/
│   │   ├── hero-shoe.jpg        # Ảnh banner chính của cửa hàng
│   │   └── products/            # Ảnh 12 sản phẩm giày chính hãng (sp001.jpg -> sp012.jpg)
│   │
│   └── js/
│       ├── init-data.js         # Dữ liệu mẫu khởi tạo & API lõi SGU_CORE LocalStorage
│       ├── index.js             # Logic Trang chủ: tìm kiếm, bộ lọc đa năng, phân trang, quick view
│       ├── product-detail.js    # Logic Chi tiết SP: tồn kho từng size, gallery, đánh giá
│       ├── cart.js              # Logic Giỏ hàng: voucher, VietQR/COD, lịch sử & in hóa đơn
│       ├── admin-master.js      # [TV3] Logic Quản trị 1: Auth, User, Loại SP, Quản lý sản phẩm & Gallery
│       └── admin-sales.js       # [TV4] Logic Quản trị 2: Nhập hàng, Giá bán, Đơn hàng, Tồn kho & Báo cáo
│
├── .gitignore                   # Bộ lọc bỏ qua tệp tin rác của hệ điều hành
└── README.md                    # Tài liệu giới thiệu tổng quan dự án
```

---

## 🚀 Hướng Dẫn Trải Nghiệm Dự Án

### 1. Khởi chạy trực tiếp (Không cần cài đặt bất kỳ công cụ nào)
1. Tải về hoặc clone repository về máy tính:
   ```bash
   git clone https://github.com/Pe1nt0n/WebBanGiay.git
   ```
2. Mở trực tiếp tệp `index.html` bằng bất kỳ trình duyệt web nào (Google Chrome, Microsoft Edge, Mozilla Firefox,...).

### 2. Tài khoản dùng thử sẵn có

* **Tài khoản Khách hàng mẫu**:
  - Email: `nguyenvana@gmail.com` | Mật khẩu: `123456` *(Tên: Nguyễn Văn A)*
  - Email: `tranthib@gmail.com` | Mật khẩu: `123456` *(Tên: Trần Thị Bích)*

* **Tài khoản Quản trị Admin**:
  - Đường dẫn: Mở file `admin.html` (hoặc click nút *"🔐 Cổng Quản Trị Admin"* trên thanh điều hướng).
  - Tên đăng nhập: `admin` | Mật khẩu: `admin123`
