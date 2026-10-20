/**
 * SGU SNEAKER - BỘ DỮ LIỆU KHỞI TẠO DÙNG CHUNG (SHARED DATA CORE)
 * Học phần: Lập trình Web và Ứng dụng - Đại học Sài Gòn (SGU)
 * 
 * Mục đích: 
 * - Tự động nạp dữ liệu mẫu ban đầu vào LocalStorage nếu chưa có
 * - Đảm bảo máy Giảng viên chấm bài offline/local path không bị lỗi trắng trang
 * - Tích hợp hình ảnh cục bộ từ thư mục ./assets/images/products/
 * - Đồng bộ dữ liệu xuyên suốt giữa 4 file: index.html, product-detail.html, cart.html, admin.html
 */

(function () {
    const STORAGE_KEY_INIT = 'sgu_sneaker_initialized_v7';

    // 1. DANH MỤC PHÂN LOẠI GIÀY (Rubric I.3 & II.2)
    const initialCategories = [
        { code: 'LOAI01', name: 'Giày Sneaker', count: 4, active: true },
        { code: 'LOAI02', name: 'Giày Chạy Bộ', count: 4, active: true },
        { code: 'LOAI03', name: 'Giày Đá Bóng', count: 2, active: true },
        { code: 'LOAI04', name: 'Giày Tây Nam', count: 2, active: true }
    ];

    // 2. DANH MỤC 12 SẢN PHẨM GIÀY MẪU (Rubric I.4, I.6, I.8, II.2)
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
            tag: 'HOT',
            reviews: 128,
            rating: 4.9,
            desc: 'Thiết kế đệm khí Air Max nâng cấp êm ái vượt trội, bảo vệ khớp gót chân tối đa. Vải dệt Flyknit thoáng khí cao cấp cùng đế cao su đúc chống trượt.',
            img: './assets/images/products/sp001.jpg',
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
            oldPrice: 2400000,
            stock: 12,
            stockInitial: 8,
            stockImport: 10,
            stockExport: 6,
            sizes: [39, 40, 41, 42, 43],
            tag: 'NEW',
            reviews: 95,
            rating: 4.8,
            desc: 'Hạt đệm Boost hoàn trả năng lượng tối đa trên từng sải bước. Thân giày Primeknit co giãn 360 độ ôm sát bàn chân, đế ngoài cao su Continental bền bỉ.',
            img: './assets/images/products/sp002.jpg',
            active: true
        },
        {
            id: 'SP003',
            name: 'Air Jordan 1 Retro High Chicago - Da Thật',
            brand: 'Jordan',
            category: 'Giày Sneaker',
            catCode: 'LOAI01',
            costPrice: 2400000,
            profitPercent: 33,
            price: 3200000,
            oldPrice: 3800000,
            stock: 4, // TỒN THẤP ĐỂ TEST CẢNH BÁO TỒN KHO MỤC I.8
            stockInitial: 6,
            stockImport: 4,
            stockExport: 6,
            sizes: [40, 41, 42, 43, 44],
            tag: 'SALE',
            reviews: 215,
            rating: 5.0,
            desc: 'Biểu tượng văn hóa bóng rổ và sneakerhead toàn cầu. Chất liệu da bò tự nhiên cao cấp, phối màu Chicago kinh điển, cổ cao tôn dáng.',
            img: './assets/images/products/sp003.jpg',
            active: true
        },
        {
            id: 'SP004',
            name: 'Nike Mercurial Vapor 15 Elite FG - Cỏ Tự Nhiên',
            brand: 'Nike',
            category: 'Giày Đá Bóng',
            catCode: 'LOAI03',
            costPrice: 1900000,
            profitPercent: 42,
            price: 2700000,
            oldPrice: 3200000,
            stock: 14,
            stockInitial: 10,
            stockImport: 10,
            stockExport: 6,
            sizes: [39, 40, 41, 42, 43],
            tag: 'HOT',
            reviews: 64,
            rating: 4.7,
            desc: 'Tích hợp túi khí Zoom Air chuyên biệt 3/4 chiều dài dành cho bóng đá, tăng tốc bứt phá và độ bám sân vượt trội.',
            img: './assets/images/products/sp004.jpg',
            active: true
        },
        {
            id: 'SP005',
            name: 'Puma Velocity Nitro 2 Running - Siêu Êm',
            brand: 'Puma',
            category: 'Giày Chạy Bộ',
            catCode: 'LOAI02',
            costPrice: 1100000,
            profitPercent: 41,
            price: 1550000,
            oldPrice: 1950000,
            stock: 22,
            stockInitial: 15,
            stockImport: 15,
            stockExport: 8,
            sizes: [38, 39, 40, 41, 42],
            tag: 'NEW',
            reviews: 82,
            rating: 4.6,
            desc: 'Công nghệ bọt đệm Nitro siêu nhẹ và đàn hồi phản hồi lực cực nhạy, thích hợp cho việc tập chạy cự ly từ 5km đến Marathon.',
            img: './assets/images/products/sp005.jpg',
            active: true
        },
        {
            id: 'SP006',
            name: 'Giày Tây Oxford Nam Da Bò Ý Classic SGU',
            brand: 'SGU Classic',
            category: 'Giày Tây Nam',
            catCode: 'LOAI04',
            costPrice: 1500000,
            profitPercent: 40,
            price: 2100000,
            oldPrice: 2600000,
            stock: 3, // TỒN THẤP ĐỂ TEST CẢNH BÁO TỒN KHO MỤC I.8
            stockInitial: 5,
            stockImport: 5,
            stockExport: 7,
            sizes: [39, 40, 41, 42, 43],
            tag: 'NEW',
            reviews: 41,
            rating: 4.8,
            desc: 'Được đóng thủ công từ da bò lớp một nhập khẩu Italy bóng mịn, đế phíp kết hợp cao su chống trượt tạo vẻ lịch lãm sang trọng.',
            img: './assets/images/products/sp006.jpg',
            active: true
        },
        {
            id: 'SP007',
            name: 'Nike Dunk Low Retro Panda - Phối Màu Đen Trắng',
            brand: 'Nike',
            category: 'Giày Sneaker',
            catCode: 'LOAI01',
            costPrice: 1700000,
            profitPercent: 35,
            price: 2300000,
            oldPrice: 2750000,
            stock: 16,
            stockInitial: 10,
            stockImport: 12,
            stockExport: 6,
            sizes: [38, 39, 40, 41, 42, 43],
            tag: 'HOT',
            reviews: 310,
            rating: 4.9,
            desc: 'Cơn sốt đường phố với phối màu đen trắng Black/White kinh điển dễ dàng phối đồ với mọi phong cách.',
            img: './assets/images/products/sp007.jpg',
            active: true
        },
        {
            id: 'SP008',
            name: 'Adidas Predator Elite FT FG - Kiểm Soát Bóng',
            brand: 'Adidas',
            category: 'Giày Đá Bóng',
            catCode: 'LOAI03',
            costPrice: 2200000,
            profitPercent: 34,
            price: 2950000,
            oldPrice: 3500000,
            stock: 9,
            stockInitial: 6,
            stockImport: 8,
            stockExport: 5,
            sizes: [40, 41, 42, 43],
            tag: 'SALE',
            reviews: 73,
            rating: 4.9,
            desc: 'Gai cao su Strikeskin hỗ trợ xoáy bóng hoàn hảo cùng khung đế Controlframe 2.0 tạo độ ổn định khi đổi hướng.',
            img: './assets/images/products/sp008.jpg',
            active: true
        },
        {
            id: 'SP009',
            name: 'Nike Pegasus 40 FlyEase - Chạy Bộ Đa Năng',
            brand: 'Nike',
            category: 'Giày Chạy Bộ',
            catCode: 'LOAI02',
            costPrice: 2100000,
            profitPercent: 35,
            price: 2835000,
            oldPrice: 3400000,
            stock: 12,
            stockInitial: 8,
            stockImport: 10,
            stockExport: 6,
            sizes: [39, 40, 41, 42, 43],
            tag: 'HOT',
            reviews: 88,
            rating: 4.9,
            desc: 'Dòng giày chạy bộ huyền thoại của Nike với công nghệ đệm kép Zoom Air ở mũi và gót chân. Thân giày FlyEase có khóa kéo tiện lợi, bứt tốc êm ái bền bỉ.',
            img: './assets/images/products/sp009.jpg',
            active: true
        },
        {
            id: 'SP010',
            name: 'Giày Tây Loafer Da Bóng Penny - Quý Ông Lịch Lãm',
            brand: 'SGU Classic',
            category: 'Giày Tây Nam',
            catCode: 'LOAI04',
            costPrice: 1300000,
            profitPercent: 38,
            price: 1790000,
            oldPrice: 2200000,
            stock: 11,
            stockInitial: 8,
            stockImport: 8,
            stockExport: 5,
            sizes: [39, 40, 41, 42],
            tag: 'SALE',
            reviews: 35,
            rating: 4.7,
            desc: 'Thiết kế giày lười Penny Loafer tiện lợi, da bò nguyên tấm đánh xi bóng bẩy, lót giày êm ái thoáng khí suốt ngày dài công sở.',
            img: './assets/images/products/sp010.jpg',
            active: true
        },
        {
            id: 'SP011',
            name: 'Puma RS-X Triple White - Phong Cách Chunky',
            brand: 'Puma',
            category: 'Giày Sneaker',
            catCode: 'LOAI01',
            costPrice: 1200000,
            profitPercent: 40,
            price: 1680000,
            oldPrice: 2100000,
            stock: 15,
            stockInitial: 10,
            stockImport: 10,
            stockExport: 5,
            sizes: [38, 39, 40, 41, 42, 43],
            tag: 'NEW',
            reviews: 58,
            rating: 4.7,
            desc: 'Phong cách Chunky Sneaker hầm hố và năng động. Hệ thống đệm Running System độc quyền của Puma tạo cảm giác êm ái đàn hồi.',
            img: './assets/images/products/sp011.jpg',
            active: true
        },
        {
            id: 'SP012',
            name: 'Adidas Adizero Boston 12 Pro - Luyện Tập Tốc Độ',
            brand: 'Adidas',
            category: 'Giày Chạy Bộ',
            catCode: 'LOAI02',
            costPrice: 1900000,
            profitPercent: 36,
            price: 2580000,
            oldPrice: 3100000,
            stock: 13,
            stockInitial: 8,
            stockImport: 10,
            stockExport: 5,
            sizes: [39, 40, 41, 42, 43],
            tag: 'HOT',
            reviews: 79,
            rating: 4.8,
            desc: 'Thanh sợi thủy tinh Energyrods 2.0 hạn chế tiêu hao năng lượng, kết hợp hai lớp đệm Lightstrike Pro và Lightstrike 2.0 siêu bền.',
            img: './assets/images/products/sp012.jpg',
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
            items: 'Nike Air Max Red 2025 (x1), Adidas Ultraboost Light Pro (x1)',
            total: '4.340.000 ₫',
            status: 'Mới đặt',
            address: '273 An Dương Vương, Phường 3, Quận 5, TP.HCM',
            payment: 'Tiền mặt khi nhận hàng (COD)',
            itemsList: [
                { code: 'SP001', name: 'Nike Air Max Red 2025 - Special Edition', price: 2450000, size: 41, qty: 1 },
                { code: 'SP002', name: 'Adidas Ultraboost Light Pro - Bọt Boost', price: 1890000, size: 40, qty: 1 }
            ]
        },
        {
            id: '#DH2025-072',
            cust: 'Nguyễn Văn A',
            email: 'nguyenvana@gmail.com',
            date: '15/10/2025',
            items: 'Puma Velocity Nitro 2 Running (x1)',
            total: '1.550.000 ₫',
            status: 'Đã giao',
            address: '273 An Dương Vương, Phường 3, Quận 5, TP.HCM',
            payment: 'Chuyển khoản VietQR 24/7',
            itemsList: [
                { code: 'SP005', name: 'Puma Velocity Nitro 2 Running - Siêu Êm', price: 1550000, size: 40, qty: 1 }
            ]
        },
        {
            id: '#DH2025-061',
            cust: 'Trần Thị Bích',
            email: 'tranthibich@gmail.com',
            date: '12/10/2025',
            items: 'Air Jordan 1 Retro High Chicago (x1)',
            total: '3.200.000 ₫',
            status: 'Đã xử lý',
            address: '120 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
            payment: 'Tiền mặt khi nhận hàng (COD)',
            itemsList: [
                { code: 'SP003', name: 'Air Jordan 1 Retro High Chicago - Da Thật', price: 3200000, size: 42, qty: 1 }
            ]
        }
    ];

    // 5. DANH MỤC PHIẾU NHẬP HÀNG MẪU (Rubric I.5)
    const initialImports = [
        {
            id: 'PN001',
            date: '18/10/2025',
            items: 'Nike Air Max Red 2025 (x15 đôi)',
            total: '27.000.000 ₫',
            status: 'Đã hoàn thành',
            canEdit: false,
            unitCost: 1800000,
            qty: 15,
            prodId: 'SP001'
        },
        {
            id: 'PN002',
            date: '19/10/2025',
            items: 'Adidas Ultraboost Light Pro (x10 đôi)',
            total: '14.000.000 ₫',
            status: 'Đã hoàn thành',
            canEdit: false,
            unitCost: 1400000,
            qty: 10,
            prodId: 'SP002'
        },
        {
            id: 'PN003',
            date: '20/10/2025',
            items: 'Air Jordan 1 Retro High (x10 đôi)',
            total: '24.000.000 ₫',
            status: 'Chưa hoàn thành',
            canEdit: true,
            unitCost: 2400000,
            qty: 10,
            prodId: 'SP003'
        }
    ];

    // TỰ ĐỘNG KHỞI TẠO NẾU CHƯA CÓ TRONG LOCALSTORAGE
    function initDatabase() {
        if (!localStorage.getItem(STORAGE_KEY_INIT)) {
            localStorage.setItem('sgu_categories', JSON.stringify(initialCategories));
            localStorage.setItem('sgu_products', JSON.stringify(initialProducts));
            localStorage.setItem('sgu_users', JSON.stringify(initialUsers));
            localStorage.setItem('sgu_orders', JSON.stringify(initialOrders));
            localStorage.setItem('sgu_imports', JSON.stringify(initialImports));
            localStorage.setItem('sgu_user', JSON.stringify(initialUsers[0])); // Mặc định đăng nhập user 1
            localStorage.setItem('sgu_cart', JSON.stringify([
                {
                    code: 'SP001',
                    name: 'Nike Air Max Red 2025 - Special Edition',
                    price: 2450000,
                    size: 41,
                    qty: 1,
                    img: './assets/images/products/sp001.jpg'
                }
            ]));
            localStorage.setItem(STORAGE_KEY_INIT, 'true');
            console.log('%c[SGU Sneaker Core] LocalStorage initialized with local assets!', 'color:#10b981; font-weight:bold;');
        }
    }

    initDatabase();

    // EXPORT GLOBAL CORE API CHO TOÀN BỘ WEBSITE
    window.SGU_CORE = {
        // Quản lý sản phẩm
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
                localStorage.setItem('sgu_cart', JSON.stringify([]));
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
            if (!this.getCurrentUser()) return 0;
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
        },

        // Tiện ích chuẩn hóa tiếng Việt không dấu (hỗ trợ search thông minh)
        removeVietnameseTones: function (str) {
            if (!str) return '';
            return str
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D')
                .toLowerCase()
                .trim();
        }
    };
})();
