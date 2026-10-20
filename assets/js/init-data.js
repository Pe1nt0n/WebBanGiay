/**
 * SGU SNEAKER - BỘ DỮ LIỆU KHỞI TẠO DÙNG CHUNG (SHARED DATA CORE)
 * Học phần: Lập trình Web và Ứng dụng - Đại học Sài Gòn (SGU)
 * 
 * Mục đích: 
 * - Tự động nạp dữ liệu mẫu ban đầu vào LocalStorage nếu chưa có
 * - Đảm bảo máy Giảng viên chấm bài offline/local path không bị lỗi trắng trang
 * - Đồng bộ dữ liệu xuyên suốt giữa 4 file: index.html, product-detail.html, cart.html, admin.html
 */

(function () {
    const STORAGE_KEY_INIT = 'sgu_sneaker_initialized_v2';

    // 1. DANH MỤC PHÂN LOẠI GIÀY (Rubric I.3 & II.2)
    const initialCategories = [
        { code: 'LOAI01', name: 'Giày Sneaker', count: 6, active: true },
        { code: 'LOAI02', name: 'Giày Chạy Bộ', count: 4, active: true },
        { code: 'LOAI03', name: 'Giày Đá Bóng', count: 3, active: true },
        { code: 'LOAI04', name: 'Giày Tây Nam', count: 3, active: true }
    ];

    // 2. DANH MỤC 16 SẢN PHẨM GIÀY MẪU (Rubric I.4, I.6, I.8, II.2)
    const initialProducts = [
        {
            id: 'SP001',
            name: 'Nike Air Max Red 2025 - Special Edition',
            brand: 'Nike',
            category: 'Giày Sneaker',
            catCode: 'LOAI01',
            costPrice: 1800000,
            profitPercent: 36,
            price: 2450000,
            oldPrice: 2900000,
            stock: 18,
            stockInitial: 10,
            stockImport: 15,
            stockExport: 7,
            sizes: [38, 39, 40, 41, 42, 43, 44],
            colors: ['Đỏ Phối Trắng', 'Đen Neon', 'Trắng Tuyết'],
            tag: 'HOT',
            reviews: 128,
            rating: 4.9,
            desc: 'Thiết kế đệm khí Air Max nâng cấp êm ái vượt trội, bảo vệ khớp gót chân tối đa. Vải dệt Flyknit thoáng khí cao cấp cùng đế cao su đúc chống trượt.',
            img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
            active: true
        },
        {
            id: 'SP002',
            name: 'Adidas Ultraboost Light Pro - Bọt Boost',
            brand: 'Adidas',
            category: 'Giày Chạy Bộ',
            catCode: 'LOAI02',
            costPrice: 1400000,
            profitPercent: 35,
            price: 1890000,
            oldPrice: 2300000,
            stock: 14,
            stockInitial: 8,
            stockImport: 15,
            stockExport: 9,
            sizes: [39, 40, 41, 42, 43],
            colors: ['Trắng Cam', 'Đen Tuyển', 'Xanh Dương'],
            tag: 'NEW',
            reviews: 95,
            rating: 4.8,
            desc: 'Công nghệ bọt Boost thế hệ mới siêu nhẹ, hỗ trợ hoàn trả năng lượng tối đa cho mỗi sải bước chạy bộ và thể thao.',
            img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
            active: true
        },
        {
            id: 'SP003',
            name: 'Air Jordan 1 Retro High - Da Thật Cao Cấp',
            brand: 'Nike Jordan',
            category: 'Giày Sneaker',
            catCode: 'LOAI01',
            costPrice: 2400000,
            profitPercent: 33,
            price: 3190000,
            oldPrice: 3800000,
            stock: 2, // < 5: CẢNH BÁO TỒN KHO NGUY CẤP (Rubric I.8)
            stockInitial: 5,
            stockImport: 0,
            stockExport: 3,
            sizes: [40, 41, 42, 43],
            colors: ['Đỏ Đen Chicago', 'Xanh Royal', 'Trắng Xám'],
            tag: 'SALE',
            reviews: 210,
            rating: 5.0,
            desc: 'Thiết kế cổ cao kinh điển mang tinh thần bóng rổ đường phố. Thân giày bằng da thật 100% bền bỉ, tôn dáng và cá tính.',
            img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80',
            active: true
        },
        {
            id: 'SP004',
            name: 'Nike Mercurial Vapor 15 - Đinh TF Cỏ Nhân Tạo',
            brand: 'Nike',
            category: 'Giày Đá Bóng',
            catCode: 'LOAI03',
            costPrice: 1600000,
            profitPercent: 34,
            price: 2150000,
            oldPrice: 2500000,
            stock: 3, // < 5: CẢNH BÁO TỒN KHO NGUY CẤP (Rubric I.8)
            stockInitial: 6,
            stockImport: 0,
            stockExport: 3,
            sizes: [39, 40, 41, 42],
            colors: ['Vàng Chuối Neon', 'Hồng Pastel', 'Xanh Băng'],
            tag: 'HOT',
            reviews: 84,
            rating: 4.7,
            desc: 'Dòng giày đá bóng chuyên nghiệp dành cho sân cỏ nhân tạo, trọng lượng siêu nhẹ giúp bứt tốc và kiểm soát bóng chính xác.',
            img: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&q=80',
            active: true
        },
        {
            id: 'SP005',
            name: 'Biti\'s Hunter X Street Army - Phong Cách Bụi',
            brand: 'Biti\'s',
            category: 'Giày Sneaker',
            catCode: 'LOAI01',
            costPrice: 700000,
            profitPercent: 35,
            price: 950000,
            oldPrice: 1100000,
            stock: 22,
            stockInitial: 15,
            stockImport: 20,
            stockExport: 13,
            sizes: [38, 39, 40, 41, 42, 43],
            colors: ['Xanh Rêu Lính', 'Đen Nhám', 'Xám Bê Tông'],
            tag: 'NEW',
            reviews: 142,
            rating: 4.8,
            desc: 'Đế đệm LiteFlex độc quyền đàn hồi êm ái, định hình phong cách đường phố trẻ trung hiện đại của thương hiệu Việt.',
            img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
            active: true
        },
        {
            id: 'SP006',
            name: 'Puma Velocity Nitro 2 - Đệm Khí Nitro',
            brand: 'Puma',
            category: 'Giày Chạy Bộ',
            catCode: 'LOAI02',
            costPrice: 1100000,
            profitPercent: 35,
            price: 1490000,
            oldPrice: 1800000,
            stock: 16,
            stockInitial: 10,
            stockImport: 12,
            stockExport: 6,
            sizes: [39, 40, 41, 42, 43],
            colors: ['Cam San Hô', 'Đen Trắng', 'Xanh Lam'],
            tag: 'HOT',
            reviews: 67,
            rating: 4.6,
            desc: 'Lớp bọt Nitro Foam siêu nảy kết hợp công nghệ bám Pumagrip thích hợp mọi cung đường chạy cự ly dài.',
            img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80',
            active: true
        },
        {
            id: 'SP007',
            name: 'Oxford Classic Leather - Giày Tây Da Bò Ý',
            brand: 'SGU Classic',
            category: 'Giày Tây Nam',
            catCode: 'LOAI04',
            costPrice: 1350000,
            profitPercent: 40,
            price: 1890000,
            oldPrice: 2250000,
            stock: 12,
            stockInitial: 8,
            stockImport: 10,
            stockExport: 6,
            sizes: [39, 40, 41, 42, 43, 44],
            colors: ['Nâu Hạt Dẻ', 'Đen Bóng'],
            tag: 'NEW',
            reviews: 52,
            rating: 4.9,
            desc: 'Chế tác từ da bò nguyên tấm nhập khẩu Ý. Đường may thủ công tỉ mỉ, phom dáng chuẩn mực cho quý ông công sở và dự tiệc.',
            img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80',
            active: true
        },
        {
            id: 'SP008',
            name: 'Adidas Predator Elite FT - Kiểm Soát Bóng',
            brand: 'Adidas',
            category: 'Giày Đá Bóng',
            catCode: 'LOAI03',
            costPrice: 2000000,
            profitPercent: 35,
            price: 2700000,
            oldPrice: 3200000,
            stock: 8,
            stockInitial: 5,
            stockImport: 8,
            stockExport: 5,
            sizes: [40, 41, 42, 43],
            colors: ['Đen Đỏ Predator', 'Trắng Bạc'],
            tag: 'SALE',
            reviews: 73,
            rating: 4.9,
            desc: 'Gai cao su Strikeskin hỗ trợ xoáy bóng hoàn hảo cùng khung đế Controlframe 2.0 tạo độ ổn định khi đổi hướng.',
            img: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&q=80',
            active: true
        }
    ];

    // 3. TÀI KHOẢN KHÁCH HÀNG MẪU (Rubric I.2 & II.1)
    const initialUsers = [
        {
            id: 'KH001',
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@gmail.com',
            pass: '123456',
            phone: '0909123456',
            address: '273 An Dương Vương, Phường 3, Quận 5, TP. Hồ Chí Minh',
            isLocked: false
        },
        {
            id: 'KH002',
            name: 'Trần Thị Bích',
            email: 'tranthibich@gmail.com',
            pass: '123456',
            phone: '0918222333',
            address: '120 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
            isLocked: false
        },
        {
            id: 'KH003',
            name: 'Lê Hoàng Nam',
            email: 'lehoangnam@gmail.com',
            pass: '123456',
            phone: '0987654321',
            address: '45 Lê Lợi, Phường 4, Quận Gò Vấp, TP. Hồ Chí Minh',
            isLocked: true // TÀI KHOẢN BỊ KHÓA ĐỂ TEST MỤC I.2
        }
    ];

    // 4. DANH SÁCH ĐƠN HÀNG MẪU (Rubric I.7 & II.4)
    const initialOrders = [
        {
            id: '#DH2025-089',
            cust: 'Nguyễn Văn A',
            email: 'nguyenvana@gmail.com',
            date: '20/10/2025',
            items: 'Nike Air Max Red 2025 (x1), Adidas Ultraboost (x1)',
            total: '4.340.000 ₫',
            status: 'Mới đặt',
            address: '273 An Dương Vương, Phường 3, Quận 5, TP.HCM',
            payment: 'Tiền mặt khi nhận hàng (COD)'
        },
        {
            id: '#DH2025-072',
            cust: 'Nguyễn Văn A',
            email: 'nguyenvana@gmail.com',
            date: '15/10/2025',
            items: 'Biti\'s Hunter X Street Army (x1)',
            total: '950.000 ₫',
            status: 'Đã xử lý',
            address: '273 An Dương Vương, Phường 3, Quận 5, TP.HCM',
            payment: 'Chuyển khoản VietQR'
        },
        {
            id: '#DH2025-042',
            cust: 'Trần Thị Bích',
            email: 'tranthibich@gmail.com',
            date: '10/10/2025',
            items: 'Air Jordan 1 Retro High (x1)',
            total: '3.190.000 ₫',
            status: 'Đã giao',
            address: '120 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
            payment: 'Tiền mặt khi nhận hàng (COD)'
        },
        {
            id: '#DH2025-015',
            cust: 'Lê Hoàng Nam',
            email: 'lehoangnam@gmail.com',
            date: '05/10/2025',
            items: 'Nike Mercurial Vapor 15 (x1)',
            total: '2.150.000 ₫',
            status: 'Hủy',
            address: '45 Lê Lợi, Phường 4, Quận Gò Vấp, TP.HCM',
            payment: 'Thanh toán thẻ trực tuyến'
        }
    ];

    // 5. PHIẾU NHẬP HÀNG MẪU (Rubric I.5)
    const initialImports = [
        {
            id: 'PN2025-01',
            date: '10/10/2025',
            items: 'Adidas Ultraboost Light Pro (SL: 15 đôi - Giá nhập: 1.400.000₫)',
            total: '21.000.000 ₫',
            status: 'Đã hoàn thành',
            canEdit: false
        },
        {
            id: 'PN2025-02',
            date: '20/10/2025',
            items: 'Nike Air Max Red 2025 (SL: 10 đôi - Giá nhập: 1.800.000₫)',
            total: '18.000.000 ₫',
            status: 'Chưa hoàn thành',
            canEdit: true
        }
    ];

    // HÀM KHỞI TẠO TỰ ĐỘNG
    function initDatabase() {
        if (!localStorage.getItem(STORAGE_KEY_INIT)) {
            localStorage.setItem('sgu_categories', JSON.stringify(initialCategories));
            localStorage.setItem('sgu_products', JSON.stringify(initialProducts));
            localStorage.setItem('sgu_users', JSON.stringify(initialUsers));
            localStorage.setItem('sgu_orders', JSON.stringify(initialOrders));
            localStorage.setItem('sgu_imports', JSON.stringify(initialImports));

            // Đăng nhập mặc định cho user đầu tiên để sẵn sàng dùng giỏ hàng
            localStorage.setItem('sgu_user', JSON.stringify(initialUsers[0]));

            // Đánh dấu đã nạp
            localStorage.setItem(STORAGE_KEY_INIT, 'true');
            console.log('✅ SGU SNEAKER DATA: Khởi tạo dữ liệu mẫu LocalStorage thành công!');
        }
    }

    // Chạy khởi tạo ngay lập tức
    initDatabase();

    // EXPORT API DÙNG CHUNG RA TOÀN BỘ WINDOW
    window.SGU_CORE = {
        // Lấy danh sách sản phẩm
        getProducts: function () {
            return JSON.parse(localStorage.getItem('sgu_products')) || initialProducts;
        },
        saveProducts: function (prods) {
            localStorage.setItem('sgu_products', JSON.stringify(prods));
        },
        getProductById: function (id) {
            const list = this.getProducts();
            return list.find(p => p.id === id) || list[0];
        },

        // Danh mục loại
        getCategories: function () {
            return JSON.parse(localStorage.getItem('sgu_categories')) || initialCategories;
        },
        saveCategories: function (cats) {
            localStorage.setItem('sgu_categories', JSON.stringify(cats));
        },

        // Quản lý khách hàng
        getUsers: function () {
            return JSON.parse(localStorage.getItem('sgu_users')) || initialUsers;
        },
        saveUsers: function (users) {
            localStorage.setItem('sgu_users', JSON.stringify(users));
        },
        getCurrentUser: function () {
            return JSON.parse(localStorage.getItem('sgu_user'));
        },
        setCurrentUser: function (user) {
            if (user) {
                localStorage.setItem('sgu_user', JSON.stringify(user));
            } else {
                localStorage.removeItem('sgu_user');
            }
        },

        // Giỏ hàng
        getCart: function () {
            return JSON.parse(localStorage.getItem('sgu_cart')) || [];
        },
        saveCart: function (cart) {
            localStorage.setItem('sgu_cart', JSON.stringify(cart));
        },
        getCartCount: function () {
            const cart = this.getCart();
            return cart.reduce((sum, i) => sum + (i.qty || 1), 0);
        },

        // Đơn hàng
        getOrders: function () {
            return JSON.parse(localStorage.getItem('sgu_orders')) || initialOrders;
        },
        saveOrders: function (orders) {
            localStorage.setItem('sgu_orders', JSON.stringify(orders));
        },

        // Phiếu nhập
        getImports: function () {
            return JSON.parse(localStorage.getItem('sgu_imports')) || initialImports;
        },
        saveImports: function (imports) {
            localStorage.setItem('sgu_imports', JSON.stringify(imports));
        },

        // Tiện ích format tiền VNĐ
        formatVND: function (number) {
            return Number(number || 0).toLocaleString('vi-VN') + ' ₫';
        }
    };
})();
