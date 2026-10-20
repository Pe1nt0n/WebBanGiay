/**
 * SGU SNEAKER - LOGIC TRANG CHỦ & TÌM KIẾM SẢN PHẨM (INDEX PAGE)
 * Thành viên 1 - Barem II.1 & II.2
 */

// 1. DỮ LIỆU SẢN PHẨM MẪU (ĐỒNG BỘ LOCALSTORAGE QUA SGU_CORE)
const productsData = (window.SGU_CORE && SGU_CORE.getProducts) 
    ? SGU_CORE.getProducts().filter(p => p.active !== false)
    : [
    {
        id: 'SP001',
        name: 'Nike Air Max Red Edition 2025',
        category: 'Giày Sneaker',
        brand: 'Nike',
        price: 2450000,
        oldPrice: 2950000,
        sizes: [39, 40, 41, 42, 43],
        rating: 5,
        reviews: 142,
        tag: 'HOT',
        img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
        desc: 'Thiết kế túi đệm khí Air Max trứ danh, vải lưới Flyknit co giãn thoáng khí tối đa, đế ngoài cao su rãnh Waffle chống trơn trượt.'
    },
    {
        id: 'SP002',
        name: 'Adidas Ultraboost Light Pro',
        category: 'Giày Chạy Bộ',
        brand: 'Adidas',
        price: 1890000,
        oldPrice: 2400000,
        sizes: [39, 40, 41, 42],
        rating: 5,
        reviews: 98,
        tag: 'NEW',
        img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
        desc: 'Hạt đệm Boost siêu hoàn trả năng lượng trong từng sải chân, thân giày Primeknit ôm chân êm ái, thích hợp marathon và chạy hàng ngày.'
    },
    {
        id: 'SP003',
        name: 'Air Jordan 1 Retro High Chicago',
        category: 'Giày Sneaker',
        brand: 'Jordan',
        price: 3200000,
        oldPrice: 3800000,
        sizes: [40, 41, 42, 43, 44],
        rating: 5,
        reviews: 215,
        tag: 'SALE',
        img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80',
        desc: 'Biểu tượng giày bóng rổ đường phố bất tử. Chất liệu da cao cấp, cổ cao tôn dáng, đế Air êm ái không thể thiếu cho Sneakerhead.'
    },
    {
        id: 'SP004',
        name: 'Nike Mercurial Vapor 15 Elite FG',
        category: 'Giày Đá Bóng',
        brand: 'Nike',
        price: 1550000,
        oldPrice: 1950000,
        sizes: [39, 40, 41, 42],
        rating: 4.8,
        reviews: 64,
        tag: 'HOT',
        img: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600&q=80',
        desc: 'Được trang bị bộ đệm Zoom Air 3/4 chiều dài dành riêng cho bóng đá, mặt upper Vaporposite+ bám bóng chuẩn xác khi tăng tốc.'
    },
    {
        id: 'SP005',
        name: 'Puma Velocity Nitro 2 Running',
        category: 'Giày Chạy Bộ',
        brand: 'Puma',
        price: 1250000,
        oldPrice: 1650000,
        sizes: [38, 39, 40, 41, 42],
        rating: 4.7,
        reviews: 43,
        tag: 'SALE',
        img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
        desc: 'Bọt đệm Nitro cao cấp siêu nhẹ phản hồi lực xuất sắc. Đế ngoài PumaGrip bám dính trên mọi bề mặt thời tiết trơn ướt.'
    },
    {
        id: 'SP006',
        name: 'Giày Tây Oxford Nam Da Bò Classic',
        category: 'Giày Tây Nam',
        brand: 'Classic',
        price: 2100000,
        oldPrice: 2600000,
        sizes: [39, 40, 41, 42, 43],
        rating: 4.9,
        reviews: 82,
        tag: 'NEW',
        img: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80',
        desc: 'Chế tác thủ công từ da bò mộc tự nhiên 100%, lót trong êm ái chống hôi chân, đế phíp gỗ khâu chỉ chắc chắn chuẩn phong thái quý ông.'
    },
    {
        id: 'SP007',
        name: 'Nike Dunk Low Retro Panda',
        category: 'Giày Sneaker',
        brand: 'Nike',
        price: 2750000,
        oldPrice: 3100000,
        sizes: [38, 39, 40, 41, 42, 43],
        rating: 5,
        reviews: 310,
        tag: 'HOT',
        img: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&q=80',
        desc: 'Cực phẩm phối màu đen trắng Black/White phối đồ siêu dễ, cổ thấp linh hoạt, đệm xốp nhẹ và đế bám kinh điển.'
    },
    {
        id: 'SP008',
        name: 'Adidas Predator Elite FT FG',
        category: 'Giày Đá Bóng',
        brand: 'Adidas',
        price: 2350000,
        oldPrice: 2800000,
        sizes: [40, 41, 42, 43],
        rating: 4.9,
        reviews: 55,
        tag: 'NEW',
        img: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=600&q=80',
        desc: 'Công nghệ Strikeskin cao su kiểm soát bóng ma thuật cùng lưỡi gà gập cổ điển hỗ trợ sút xoáy và chuyền bóng chính xác.'
    },
    {
        id: 'SP009',
        name: 'Nike ZoomX Vaporfly NEXT% 3',
        category: 'Giày Chạy Bộ',
        brand: 'Nike',
        price: 3650000,
        oldPrice: 4200000,
        sizes: [40, 41, 42, 43],
        rating: 5,
        reviews: 180,
        tag: 'HOT',
        img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80',
        desc: 'Vũ khí phá kỷ lục tốc độ marathon thế giới với đĩa đệm sợi carbon toàn phần kết hợp bọt đệm ZoomX bật nảy đỉnh cao.'
    },
    {
        id: 'SP10',
        name: 'Giày Tây Loafer Da Bóng Penny',
        category: 'Giày Tây Nam',
        brand: 'Classic',
        price: 1750000,
        oldPrice: 2150000,
        sizes: [39, 40, 41, 42],
        rating: 4.8,
        reviews: 39,
        tag: 'SALE',
        img: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80',
        desc: 'Kiểu dáng giày lười xỏ chân tiện lợi, da bò bóng chống bám nước nhẹ, dễ dàng kết hợp âu phục công sở hoặc quần jeans năng động.'
    },
    {
        id: 'SP011',
        name: 'Puma RS-X Triple White Sneaker',
        category: 'Giày Sneaker',
        brand: 'Puma',
        price: 1650000,
        oldPrice: 2100000,
        sizes: [38, 39, 40, 41, 42],
        rating: 4.7,
        reviews: 73,
        tag: 'NEW',
        img: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80',
        desc: 'Thiết kế Chunky hầm hố phá cách, công nghệ Running System hoàn trả êm ái, phối màu trắng tinh khôi năng động.'
    },
    {
        id: 'SP012',
        name: 'Adidas Adizero Boston 12 Pro',
        category: 'Giày Chạy Bộ',
        brand: 'Adidas',
        price: 2200000,
        oldPrice: 2700000,
        sizes: [39, 40, 41, 42, 43],
        rating: 4.9,
        reviews: 91,
        tag: 'SALE',
        img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80',
        desc: 'Kết hợp thanh năng lượng EnergyRods 2.0 bằng sợi thủy tinh và lớp đệm kép Lightstrike Pro siêu bền bỉ cho ngày chạy tốc độ.'
    }
];

// 2. BIẾN TRẠNG THÁI (STATE)
let filteredProducts = [...productsData];
let currentPage = 1;
const itemsPerPage = 6;
let selectedCategory = 'Tất cả';
let selectedSize = 'ALL';
let selectedDetailProduct = null;
let activeDetailSize = 40;

// Quản lý Đăng nhập qua LocalStorage
let currentUser = (window.SGU_CORE && SGU_CORE.getCurrentUser) 
    ? SGU_CORE.getCurrentUser() 
    : JSON.parse(localStorage.getItem('sgu_user')) || null;

// Khởi động trang web
window.addEventListener('DOMContentLoaded', () => {
    initUserState();
    updateCartBadge();

    // Đọc Query params nếu có tìm kiếm từ header các trang khác
    const urlParams = new URLSearchParams(window.location.search);
    const searchQ = urlParams.get('search');
    if (searchQ) {
        const basicInput = document.getElementById('basic-search-input');
        const advInput = document.getElementById('adv-name');
        if (basicInput) basicInput.value = searchQ;
        if (advInput) advInput.value = searchQ;
    }

    // Mở modal đăng nhập nếu có hash #login
    if (window.location.hash === '#login' && !currentUser) {
        openModal('modal-login');
    }

    applyFilters();
});

// TOAST NOTIFICATION THAY CHO ALERT
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : (type === 'warning' ? '⚠️' : '❌');
    toast.innerHTML = `<span style="font-size:18px;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// QUẢN LÝ USER
function initUserState() {
    currentUser = (window.SGU_CORE && SGU_CORE.getCurrentUser) ? SGU_CORE.getCurrentUser() : JSON.parse(localStorage.getItem('sgu_user'));
    const guestEl = document.getElementById('user-guest');
    const loggedEl = document.getElementById('user-logged-in');
    if (!guestEl || !loggedEl) return;

    if (currentUser) {
        guestEl.style.display = 'none';
        loggedEl.style.display = 'flex';
        document.getElementById('display-username').innerText = currentUser.name;
        document.getElementById('avatar-initial').innerText = currentUser.name.charAt(0).toUpperCase();
        const profName = document.getElementById('prof-name');
        const profEmail = document.getElementById('prof-email');
        const profPhone = document.getElementById('prof-phone');
        const profAddress = document.getElementById('prof-address');
        if (profName) profName.value = currentUser.name;
        if (profEmail) profEmail.value = currentUser.email || 'nguyenvana@gmail.com';
        if (profPhone) profPhone.value = currentUser.phone || '0909123456';
        if (profAddress) profAddress.value = currentUser.address || '273 An Dương Vương, Q.5, TP.HCM';
    } else {
        guestEl.style.display = 'flex';
        loggedEl.style.display = 'none';
    }
}

function handleLogin() {
    const userEmail = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    if (!userEmail || !pass) {
        showToast('Vui lòng nhập tài khoản và mật khẩu!', 'warning');
        return;
    }

    // KIỂM TRA TÀI KHOẢN VỚI DANH SÁCH USER (RUBRIC I.2 & II.1)
    const users = (window.SGU_CORE && SGU_CORE.getUsers) ? SGU_CORE.getUsers() : [];
    const found = users.find(u => (u.email.toLowerCase() === userEmail.toLowerCase() || u.name.toLowerCase() === userEmail.toLowerCase()) && u.pass === pass);

    if (found) {
        // RÀNG BUỘC: NẾU BỊ KHÓA BỞI ADMIN THÌ KHÔNG CHO ĐĂNG NHẬP (RUBRIC I.2)
        if (found.isLocked) {
            showToast('Tài khoản của bạn đã bị KHÓA bởi Quản trị viên! Vui lòng liên hệ CSKH.', 'danger');
            return;
        }
        currentUser = found;
    } else {
        // Nếu chưa có trong hệ thống, cho phép tạo session demo
        currentUser = {
            id: 'KH' + Math.floor(100 + Math.random() * 900),
            name: userEmail.includes('@') ? userEmail.split('@')[0] : userEmail,
            email: userEmail,
            phone: '0909123456',
            address: '273 An Dương Vương, Phường 3, Quận 5, TP.HCM',
            isLocked: false
        };
    }

    if (window.SGU_CORE) SGU_CORE.setCurrentUser(currentUser);
    else localStorage.setItem('sgu_user', JSON.stringify(currentUser));

    initUserState();
    updateCartBadge();
    closeModal('modal-login');
    showToast(`Chào mừng ${currentUser.name} quay trở lại! Bạn đã có thể đặt hàng.`, 'success');
}

function handleRegister() {
    const name = document.getElementById('reg-fullname').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const address = document.getElementById('reg-address').value.trim();
    const pass = document.getElementById('reg-password').value.trim();
    if (!name || !phone || !address || !pass) {
        showToast('Vui lòng điền đủ các thông tin đăng ký!', 'warning');
        return;
    }
    if (pass.length < 6) {
        showToast('Mật khẩu đăng ký phải có ít nhất 6 ký tự!', 'warning');
        return;
    }

    const email = name.toLowerCase().replace(/\s+/g, '') + Math.floor(10 + Math.random() * 90) + '@gmail.com';
    const newUser = {
        id: 'KH00' + (Math.floor(Math.random() * 80) + 10),
        name,
        email,
        phone,
        address,
        pass,
        isLocked: false
    };

    // LƯU VÀO DANH SÁCH USERS ĐỂ ADMIN QUẢN LÝ (RUBRIC I.2)
    if (window.SGU_CORE) {
        const users = SGU_CORE.getUsers();
        users.push(newUser);
        SGU_CORE.saveUsers(users);
        SGU_CORE.setCurrentUser(newUser);
    }
    currentUser = newUser;
    localStorage.setItem('sgu_user', JSON.stringify(currentUser));

    initUserState();
    updateCartBadge();
    closeModal('modal-register');
    showToast('Đăng ký tài khoản thành công! Chào mừng bạn đến với SGU Sneaker.', 'success');
}

function handleLogout() {
    currentUser = null;
    if (window.SGU_CORE) {
        SGU_CORE.setCurrentUser(null);
        SGU_CORE.saveCart([]);
    } else {
        localStorage.removeItem('sgu_user');
        localStorage.setItem('sgu_cart', JSON.stringify([]));
    }
    initUserState();
    updateCartBadge();
    showToast('Đã đăng xuất tài khoản thành công.', 'success');
}

function handleUpdateProfile() {
    if (!currentUser) return;
    currentUser.name = document.getElementById('prof-name').value.trim();
    currentUser.email = document.getElementById('prof-email').value.trim();
    currentUser.phone = document.getElementById('prof-phone').value.trim();
    currentUser.address = document.getElementById('prof-address').value.trim();

    if (window.SGU_CORE) {
        SGU_CORE.setCurrentUser(currentUser);
        const users = SGU_CORE.getUsers();
        const idx = users.findIndex(u => u.id === currentUser.id || u.email === currentUser.email);
        if (idx !== -1) {
            users[idx] = { ...users[idx], ...currentUser };
            SGU_CORE.saveUsers(users);
        }
    } else {
        localStorage.setItem('sgu_user', JSON.stringify(currentUser));
    }

    initUserState();
    closeModal('modal-profile');
    showToast('Đã cập nhật thông tin cá nhân mới!', 'success');
}

// BỘ LỌC VÀ TÌM KIẾM SẢN PHẨM (Mục II.2)
function filterByCategory(cat, element) {
    document.querySelectorAll('#category-menu .category-item').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');
    selectedCategory = cat;
    document.getElementById('adv-category').value = cat === 'Tất cả' ? 'Tất cả' : cat;
    applyFilters();
}

function toggleSizeFilter(btn, size) {
    document.querySelectorAll('.size-grid .size-chip').forEach(c => c.classList.remove('selected'));
    btn.classList.add('selected');
    selectedSize = size;
    applyFilters();
}

function handleBasicSearch() {
    const keyword = document.getElementById('basic-search-input').value.trim().toLowerCase();
    document.getElementById('adv-name').value = keyword;
    applyFilters();
}

function applyFilters() {
    const keyword = document.getElementById('adv-name').value.trim().toLowerCase();
    const cat = document.getElementById('adv-category').value;
    const minPrice = parseInt(document.getElementById('adv-min-price').value) || 0;
    const maxPrice = parseInt(document.getElementById('adv-max-price').value) || 999999999;

    // Lấy danh sách thương hiệu được tích chọn
    const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value);

    filteredProducts = productsData.filter(prod => {
        const matchKeyword = prod.name.toLowerCase().includes(keyword) || prod.desc.toLowerCase().includes(keyword);
        const matchCategory = (cat === 'Tất cả') || (prod.category === cat);
        const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(prod.brand);
        const matchPrice = (prod.price >= minPrice && prod.price <= maxPrice);
        const matchSize = (selectedSize === 'ALL') || prod.sizes.includes(parseInt(selectedSize));

        return matchKeyword && matchCategory && matchBrand && matchPrice && matchSize;
    });

    handleSortChange(false);
    currentPage = 1;
    renderProducts();
    renderPagination();
}

function resetAllFilters() {
    document.getElementById('adv-name').value = '';
    document.getElementById('basic-search-input').value = '';
    document.getElementById('adv-category').value = 'Tất cả';
    document.getElementById('adv-min-price').value = '';
    document.getElementById('adv-max-price').value = '';
    document.querySelectorAll('input[name="brand"]').forEach(cb => cb.checked = true);
    document.querySelectorAll('#category-menu .category-item').forEach(el => el.classList.remove('active'));
    const defaultCatEl = document.querySelector('#category-menu .category-item[data-cat="Tất cả"]');
    if (defaultCatEl) defaultCatEl.classList.add('active');
    selectedCategory = 'Tất cả';
    selectedSize = 'ALL';
    applyFilters();
    showToast('Đã đặt lại toàn bộ bộ lọc về mặc định', 'success');
}

// SẮP XẾP SẢN PHẨM
function handleSortChange(shouldRender = true) {
    const sortMode = document.getElementById('sort-order').value;
    if (sortMode === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortMode === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortMode === 'rating') {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    } else if (sortMode === 'name-asc') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (shouldRender) {
        renderProducts();
    }
}

// RENDER DANH SÁCH SẢN PHẨM (CARD UI NÂNG CẤP)
function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    const total = filteredProducts.length;
    document.getElementById('visible-count').innerText = Math.min(itemsPerPage, total);
    document.getElementById('product-count-label').innerHTML = `Hiển thị <strong>${total > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - ${Math.min(currentPage * itemsPerPage, total)}</strong> trên ${total} sản phẩm`;

    if (total === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #fff; border-radius: 12px; border: 1px dashed var(--border);">
                <div style="font-size: 48px; margin-bottom: 12px;">👟</div>
                <h3 style="font-size: 18px; margin-bottom: 8px;">Không tìm thấy mẫu giày nào phù hợp!</h3>
                <p style="color: var(--gray); font-size: 14px; margin-bottom: 16px;">Hãy thử điều chỉnh lại mức giá hoặc từ khóa tìm kiếm.</p>
                <button class="btn-primary" onclick="resetAllFilters()">Xem lại tất cả giày</button>
            </div>
        `;
        return;
    }

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const pageItems = filteredProducts.slice(startIdx, endIdx);

    grid.innerHTML = pageItems.map(prod => `
        <div class="product-card">
            <div class="product-img-box" onclick="openProductDetailById('${prod.id}')">
                <div class="badge-tags">
                    <span class="badge-tag ${prod.tag === 'HOT' ? 'badge-hot' : (prod.tag === 'NEW' ? 'badge-new' : 'badge-sale')}">${prod.tag}</span>
                </div>
                <img src="${prod.img}" alt="${prod.name}" loading="lazy">
            </div>
            <div class="product-content">
                <div>
                    <div class="product-brand">${prod.brand} • ${prod.category}</div>
                    <div class="product-name" onclick="openProductDetailById('${prod.id}')">${prod.name}</div>
                    <div class="rating-box">
                        <span class="stars">⭐⭐⭐⭐⭐</span>
                        <span class="reviews-count">(${prod.reviews})</span>
                    </div>
                    <div class="price-box">
                        <span class="current-price">${prod.price.toLocaleString('vi-VN')} ₫</span>
                        <span class="old-price">${prod.oldPrice.toLocaleString('vi-VN')} ₫</span>
                    </div>
                </div>
                <div class="product-card-actions">
                    <a href="product-detail.html?id=${prod.id}" class="btn-outline" style="font-size: 13px; display:inline-flex; align-items:center; justify-content:center;">Chi tiết ↗</a>
                    <button class="btn-primary" style="font-size: 13px;" onclick="addToCart('${prod.name}', ${prod.price}, '${prod.id}', '${prod.img}')">Chọn mua</button>
                </div>
            </div>
        </div>
    `).join('');
}

// RENDER THANH PHÂN TRANG (Mục II.2)
function renderPagination() {
    const box = document.getElementById('pagination-box');
    if (!box) return;
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (totalPages <= 1) {
        box.innerHTML = '';
        return;
    }

    let html = `<button class="page-btn" ${currentPage === 1 ? 'disabled style="opacity:0.4;"' : ''} onclick="goToPage(${currentPage - 1})">«</button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled style="opacity:0.4;"' : ''} onclick="goToPage(${currentPage + 1})">»</button>`;
    box.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    renderProducts();
    renderPagination();
    window.scrollTo({ top: 400, behavior: 'smooth' });
}

// 3. XEM CHI TIẾT SẢN PHẨM (Mục II.2 - CHUYỂN HƯỚNG TỚI TRANG product-detail.html CỦA THÀNH VIÊN 2)
function openProductDetailById(id) {
    window.location.href = 'product-detail.html?id=' + encodeURIComponent(id);
}

function selectDetailSize(btn, s) {
    document.querySelectorAll('#detail-sizes .size-chip').forEach(c => c.classList.remove('selected'));
    btn.classList.add('selected');
    activeDetailSize = s;
}

// 4. GIỎ HÀNG (Mục II.3 - RÀNG BUỘC PHẢI ĐĂNG NHẬP MỚI DÙNG ĐƯỢC GIỎ HÀNG)
function addToCart(name, price, code, img) {
    if (!currentUser) {
        showToast('Khách hàng phải Đăng nhập trước khi chọn mua và sử dụng giỏ hàng!', 'warning');
        openModal('modal-login');
        return;
    }

    let cart = (window.SGU_CORE && SGU_CORE.getCart) ? SGU_CORE.getCart() : (JSON.parse(localStorage.getItem('sgu_cart')) || []);
    const existing = cart.find(i => i.code === code && i.size === activeDetailSize);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            code: code,
            name: name,
            price: price,
            qty: 1,
            size: activeDetailSize,
            img: img || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80'
        });
    }

    if (window.SGU_CORE) SGU_CORE.saveCart(cart);
    else localStorage.setItem('sgu_cart', JSON.stringify(cart));

    updateCartBadge();
    showToast(`Đã thêm "${name}" (Size ${activeDetailSize}) vào giỏ hàng!`, 'success');
}

function addToCartFromDetail() {
    if (!selectedDetailProduct) return;
    addToCart(selectedDetailProduct.name, selectedDetailProduct.price, selectedDetailProduct.id, selectedDetailProduct.img);
    closeModal('modal-detail');
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    if (!currentUser) {
        badge.innerText = '0';
        return;
    }
    const count = (window.SGU_CORE && SGU_CORE.getCartCount) 
        ? SGU_CORE.getCartCount() 
        : (JSON.parse(localStorage.getItem('sgu_cart')) || []).reduce((acc, curr) => acc + (curr.qty || 1), 0);
    badge.innerText = count;
}

function goToCart() {
    if (!currentUser) {
        showToast('Vui lòng Đăng nhập tài khoản trước khi vào giỏ hàng!', 'warning');
        openModal('modal-login');
        return;
    }
    window.location.href = 'cart.html';
}

// MODAL HELPERS
function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'flex';
}
function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}
