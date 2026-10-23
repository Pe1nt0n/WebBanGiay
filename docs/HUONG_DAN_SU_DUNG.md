# 👟 SGU SNEAKER - HƯỚNG DẪN SỬ DỤNG VÀ CHẤM ĐIỂM ĐỒ ÁN

> **Dự án:** Website Cửa Hàng Giày Thể Thao & Sneaker Trực Tuyến  
> **Công nghệ:** HTML5, CSS3, Vanilla JavaScript (ES6+), LocalStorage  
> **Sinh viên thực hiện:** SGU Web Project Team  

---

## 🔑 1. THÔNG TIN TÀI KHOẢN TRẢI NGHIỆM

Hệ thống đã chuẩn bị sẵn các tài khoản demo để thầy cô và người dùng trải nghiệm ngay mà không cần đăng ký mới:

### 1.1. Tài khoản Quản trị viên (Admin)
* **Trang quản trị:** Mở file `admin.html` hoặc click liên kết *Cổng Quản trị Admin* ở header/footer.
* **Tên đăng nhập:** `admin`
* **Mật khẩu:** `admin123`
* *(Có hỗ trợ tính năng Khóa màn hình nhanh và Mở khóa bằng chính mật khẩu trên)*.

### 1.2. Tài khoản Khách hàng (User)
* **Tài khoản 1:**
  - Tên đăng nhập / Email: `ngocson` (hoặc `son@sgu.vn`)
  - Mật khẩu: `123456`
  - Họ tên: Lê Ngọc Sơn
* **Tài khoản 2:**
  - Tên đăng nhập / Email: `nguyenvanan` (hoặc `an@sgu.vn`)
  - Mật khẩu: `123456`
  - Họ tên: Nguyễn Văn An

---

## 📂 2. CẤU TRÚC DỰ ÁN CHUẨN HÓA

```text
DoAnWeb/
├── assets/
│   ├── css/
│   │   ├── common.css            # Biến màu, typography, header, footer, toast, in ấn @media print
│   │   ├── index.css             # Giao diện trang chủ, hero banner, bộ lọc, product grid
│   │   ├── product-detail.css    # Giao diện chi tiết, size chips, gallery ảnh, tabs đánh giá
│   │   ├── cart.css              # Giao diện giỏ hàng, bảng thanh toán, voucher, VietQR
│   │   └── admin.css             # Giao diện quản trị, KPI cards, bảng quản lý, modal
│   ├── images/
│   │   ├── hero-shoe.jpg         # Ảnh banner nổi bật
│   │   └── products/             # Ảnh 12 sản phẩm giày chính hãng (sp001 -> sp012)
│   └── js/
│       ├── init-data.js          # Dữ liệu mẫu khởi tạo & hệ thống API lõi SGU_CORE
│       ├── index.js              # Logic trang chủ: bộ lọc đa năng, tìm kiếm, sắp xếp, quick view
│       ├── product-detail.js     # Logic chi tiết SP: tồn kho từng size, gallery, gửi đánh giá
│       ├── cart.js               # Logic giỏ hàng: voucher, thanh toán VietQR/COD, lịch sử & in hóa đơn
│       └── admin.js              # Logic quản trị: KPI, CRUD loại, CRUD giày, duyệt đơn, in hóa đơn
├── docs/
│   └── HUONG_DAN_SU_DUNG.md      # Tài liệu hướng dẫn sử dụng & thông tin tài khoản demo
├── .gitignore                    # Bộ lọc file rác hệ điều hành
├── README.md                     # Tài liệu giới thiệu tổng quan dự án
├── index.html                    # [Trang 1] Cửa hàng & Danh mục sản phẩm
├── product-detail.html           # [Trang 2] Chi tiết sản phẩm chuyên sâu
├── cart.html                     # [Trang 3] Giỏ hàng, Thanh toán & Lịch sử đơn hàng
└── admin.html                    # [Trang 4] Bảng điều khiển quản trị toàn diện
```

---

## 🚀 3. HƯỚNG DẪN TRẢI NGHIỆM CÁC TÍNH NĂNG CHÍNH

### 3.1. Phân hệ Khách hàng (Storefront)
1. **Trang chủ (`index.html`)**:
   - Sử dụng thanh tìm kiếm nhanh để tìm giày theo tên.
   - Sử dụng bộ lọc nâng cao bên trái: lọc theo phân loại, thương hiệu (Nike, Adidas, Jordan, Puma, Clarks), khoảng giá bấm nhanh, chọn size giày.
   - Bấm nút **"Xem Nhanh"** trên thẻ sản phẩm để mở popup xem ảnh, chọn size và thêm vào giỏ.
2. **Chi tiết sản phẩm (`product-detail.html`)**:
   - Chuyển đổi qua lại các ảnh thumbnail trong gallery.
   - Thử click các size khác nhau: hệ thống sẽ hiển thị số lượng tồn kho thực tế của size đó. Các size hết hàng (`stock = 0`) sẽ bị làm mờ, gạch chéo và không cho chọn.
   - Bấm **"📏 Hướng dẫn chọn size"** để xem bảng quy đổi size EU/cm.
   - Bấm tab **"⭐ Đánh Giá Khách Hàng"** để đọc và gửi nhận xét kèm số sao thật vào hệ thống.
3. **Giỏ hàng & Thanh toán (`cart.html`)**:
   - Tăng/giảm số lượng, xóa sản phẩm khỏi giỏ hàng.
   - Nhập hoặc bấm nhanh mã voucher: `GIAM10` (giảm 10%), `SNEAKER50K` (giảm 50.000đ), `FREESHIP` (miễn phí ship).
   - Chọn phương thức thanh toán: **COD** hoặc **VietQR** (tự sinh mã QR chuyển khoản theo tổng tiền).
   - Sau khi đặt hàng thành công, chuyển sang tab **"📦 Lịch Sử Các Đơn Hàng"**:
     - Bấm **"Xem chi tiết"** để xem các món giày trong đơn.
     - Bấm **"🖨️ In Hóa Đơn"** để in hoặc xuất file PDF hóa đơn bán hàng chuẩn A4.
     - Bấm **"Hủy đơn hàng"** (đối với các đơn ở trạng thái *Chờ xác nhận*).

### 3.2. Phân hệ Quản trị (Admin Dashboard)
1. **Dashboard KPI**:
   - Theo dõi doanh thu thực tế, số lượng đơn hàng mới cần duyệt, số mẫu giày và cảnh báo tồn kho.
2. **Quản lý Loại sản phẩm**:
   - Bấm **"✏️ Sửa"** để chỉnh sửa tên loại (mã loại tự động khóa, tên loại mới tự đồng bộ sang toàn bộ sản phẩm con).
   - Bấm **"👁️ Ẩn / Xóa"** để tạm ẩn phân loại khỏi trang khách hàng.
3. **Quản lý Sản phẩm**:
   - Thêm sản phẩm mới với ảnh tải từ máy tính (FileReader) hoặc link URL.
   - Thiết lập số lượng tồn kho chi tiết cho từng size (38 đến 44).
4. **Quản lý Đơn hàng**:
   - Duyệt trạng thái đơn hàng: từ *Chờ xử lý* sang *Đang giao*, *Đã hoàn thành* hoặc *Hủy đơn*.
   - Mở chi tiết đơn hàng và bấm **"🖨️ In Phiếu Xuất Kho / Hóa Đơn"**.
5. **Thống kê & Báo cáo**:
   - Xem biểu đồ doanh thu Canvas chart trực quan, lọc theo khoảng thời gian và xuất báo cáo.
