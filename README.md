# Đồ Án Cuối Kỳ: Website Bán Giày

> **Học phần:** Lập trình Web và Ứng dụng  
> **Trường:** Đại học Sài Gòn (SGU) - Khoa Công Nghệ Thông Tin  
> **Đề tài:** Xây dựng Website Bán Giày (Clickable Prototype & Giao diện tương tác)

---

## 👥 Thông Tin Nhóm
- **Nhóm:** ...
- **Thành viên:**
  1. `MSSV` - `Họ và Tên` (Trưởng nhóm)
  2. `MSSV` - `Họ và Tên`
  3. `MSSV` - `Họ và Tên`
  4. `MSSV` - `Họ và Tên`

---

## 📁 Cấu Trúc Thư Mục Dự Án (Đề Xuất)

```text
DoAnWeb/
├── admin/                  # Giao diện & chức năng dành cho Quản trị viên
├── assets/
│   ├── css/                # Mã nguồn stylesheets
│   ├── js/                 # Mã nguồn Javascript xử lý logic giao diện / LocalStorage
│   └── images/             # Hình ảnh sản phẩm giày, banner, icons
├── docs/                   # Tài liệu thiết kế (Figma, hình ảnh phác thảo, báo cáo)
├── .gitignore              # Cấu hình bỏ qua file rác khi đẩy lên Git
└── README.md               # Mô tả đề tài & checklist chấm điểm
```

---

## 📋 Checklist Chức Năng Theo Yêu Cầu Chấm Điểm

### I. Giao Diện & Chức Năng Quản Trị - Admin (5.0 Điểm)

- [ ] **1. Giao diện Admin (0.50 đ)**
  - [ ] Trang đăng nhập riêng biệt với khách hàng
  - [ ] Danh mục điều hướng các chức năng quản trị
- [ ] **2. Quản lý người dùng / khách hàng (0.75 đ)**
  - [ ] Hiển thị danh sách thông tin khách hàng (0.25 đ)
  - [ ] Reset mật khẩu khách hàng (0.25 đ)
  - [ ] Khóa / Mở khóa tài khoản khách hàng (0.25 đ)
- [ ] **3. Quản lý loại sản phẩm (0.50 đ)**
  - [ ] Thêm, sửa, xóa / ẩn loại giày (sneaker, boot, sandal, chạy bộ, v.v.)
- [ ] **4. Quản lý danh mục sản phẩm (0.75 đ)**
  - [ ] Thêm sản phẩm (loại, mã, tên, hình ảnh, mô tả, size, màu) (0.25 đ)
  - [ ] Sửa sản phẩm: hiển thị đúng thông tin cũ trước khi sửa (0.25 đ)
  - [ ] Xóa / Ẩn sản phẩm (0.25 đ)
- [ ] **5. Quản lý nhập sản phẩm (0.75 đ)**
  - [ ] Hiển thị & tìm kiếm danh mục phiếu nhập hàng (0.25 đ)
  - [ ] Thêm phiếu nhập (ngày nhập, giá nhập, số lượng từng sản phẩm) (0.25 đ)
  - [ ] Sửa và hoàn thành phiếu nhập (chỉ sửa được trước khi bấm hoàn thành) (0.25 đ)
- [ ] **6. Quản lý giá bán (0.50 đ)**
  - [ ] Hiển thị & nhập/sửa tỉ lệ % lợi nhuận theo loại SP hoặc theo từng SP (0.25 đ)
  - [ ] Tra cứu giá vốn, % lợi nhuận, giá bán sản phẩm (0.25 đ)
- [ ] **7. Quản lý đơn đặt hàng (0.50 đ)**
  - [ ] Tra cứu đơn hàng theo khoảng thời gian đặt hoặc theo trạng thái (0.25 đ)
  - [ ] Xem chi tiết đơn hàng & cập nhật trạng thái (Mới đặt -> Đã xử lý -> Đã giao -> Hủy) (0.25 đ)
- [ ] **8. Quản lý số lượng tồn kho (0.75 đ)**
  - [ ] Tra cứu tồn kho của sản phẩm, theo loại tại một thời điểm (0.25 đ)
  - [ ] Cảnh báo sản phẩm sắp hết hàng (dưới ngưỡng tối thiểu) (0.25 đ)
  - [ ] Báo cáo nhập - xuất - tồn trong khoảng thời gian (0.25 đ)

---

### II. Giao Diện & Chức Năng Khách Hàng - End-User (5.0 Điểm)

- [ ] **1. Quản lý đăng nhập & tài khoản (1.00 đ)**
  - [ ] Đăng ký tài khoản mới (0.25 đ)
  - [ ] Đăng nhập / Đăng xuất (hiển thị tên/thông tin tài khoản đang đăng nhập) (0.25 đ)
  - [ ] Xem & cập nhật thông tin cá nhân (0.50 đ)
- [ ] **2. Hiển thị & Tìm kiếm sản phẩm (1.50 đ)**
  - [ ] Hiển thị danh sách sản phẩm theo loại kèm phân trang (0.50 đ)
  - [ ] Trang chi tiết sản phẩm giày (thương hiệu, kích cỡ, bảng size, chất liệu, mô tả) (0.50 đ)
  - [ ] Tìm kiếm cơ bản theo tên giày (0.25 đ)
  - [ ] Tìm kiếm nâng cao kết hợp nhiều tiêu chí: Tên + Loại + Khoảng giá (kết quả có phân trang) (0.25 đ)
- [ ] **3. Giỏ hàng & Đặt hàng (2.25 đ)**
  - [ ] Ràng buộc: bắt buộc đăng ký/đăng nhập mới dùng được giỏ hàng
  - [ ] Chọn mua từ trang danh sách và trang chi tiết sản phẩm (0.50 đ)
  - [ ] Thêm, bớt số lượng, xóa sản phẩm trong giỏ hàng (0.50 đ)
  - [ ] Nhận hàng: cho phép chọn địa chỉ từ tài khoản hoặc nhập địa chỉ mới (0.50 đ)
  - [ ] Phương thức thanh toán: COD tiền mặt (mặc định), Chuyển khoản, Thẻ trực tuyến (0.50 đ)
  - [ ] Xem lại thông tin đơn hàng sau khi hoàn tất đặt (0.25 đ)
- [ ] **4. Lịch sử mua hàng (0.25 đ)**
  - [ ] Khách hàng xem lại danh sách các đơn hàng đã mua và trạng thái đơn

---

### ⭐ Điểm Cộng Khuyến Khích (Tối đa +2.0 Điểm)

- [ ] **Thiết kế layout giao diện trước bằng công cụ (+1.00 đ):** Có file thiết kế Figma / Adobe XD / Photoshop và đặt vào thư mục `docs/`.
- [ ] **Triển khai Online (+1.00 đ):** Deploy website lên Internet (GitHub Pages, Vercel, Netlify...).

---

## ⚠️ Lưu Ý Sống Còn Khi Nộp Bài & Chấm Điểm
1. **Môi trường chấm:** Giảng viên chấm trực tiếp trên Google Chrome / Firefox bằng cách mở file HTML cục bộ (local path) trên laptop giảng viên.
2. **Quy tắc đường dẫn:** Tuyệt đối dùng **đường dẫn tương đối (relative path)** cho hình ảnh, CSS, JavaScript (ví dụ: `./assets/css/style.css` hoặc `../assets/images/shoe1.png`). Tuyệt đối **không** dùng đường dẫn tuyệt đối ổ đĩa (như `C:/...`, `D:/...`) vì sẽ bị lỗi mất hình/mất CSS khi copy sang máy giảng viên.
3. **Mã hóa ký tự:** Luôn khai báo `<meta charset="UTF-8">` ở tất cả các trang để tránh lỗi hiển thị tiếng Việt.
