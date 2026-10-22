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
        name: 'Nike Air Max Red 2025 - Special Edition',
        category: 'Giày Sneaker',
        brand: 'Nike',
        price: 2450000,
        oldPrice: 2900000,
        sizes: [38, 39, 40, 41, 42, 43, 44],
        rating: 5,
        reviews: 128,
        tag: 'HOT',
        img: './assets/images/products/sp001.jpg',
        desc: 'Thiết kế túi đệm khí Air Max trứ danh, vải lưới Flyknit co giãn thoáng khí tối đa, đế ngoài cao su rãnh Waffle chống trơn trượt.'
    },
    {
        id: 'SP002',
        name: 'Adidas Ultraboost Light Pro - Bọt Boost',
        category: 'Giày Chạy Bộ',
        brand: 'Adidas',
        price: 1890000,
        oldPrice: 2400000,
        sizes: [39, 40, 41, 42, 43],
        rating: 5,
        reviews: 95,
        tag: 'NEW',
        img: './assets/images/products/sp002.jpg',
        desc: 'Hạt đệm Boost siêu hoàn trả năng lượng trong từng sải chân, thân giày Primeknit ôm chân êm ái, thích hợp marathon và chạy hàng ngày.'
    },
    {
        id: 'SP003',
        name: 'Air Jordan 1 Retro High Chicago - Da Thật',
        category: 'Giày Sneaker',
        brand: 'Jordan',
        price: 3200000,
        oldPrice: 3800000,
        sizes: [40, 41, 42, 43, 44],
        rating: 5,
        reviews: 215,
        tag: 'SALE',
        img: './assets/images/products/sp003.jpg',
        desc: 'Biểu tượng giày bóng rổ đường phố bất tử. Chất liệu da cao cấp, cổ cao tôn dáng, đế Air êm ái không thể thiếu cho Sneakerhead.'
    },
    {
        id: 'SP004',
        name: 'Nike Mercurial Vapor 15 Elite FG - Cỏ Tự Nhiên',
        category: 'Giày Đá Bóng',
        brand: 'Nike',
        price: 2700000,
        oldPrice: 3200000,
        sizes: [39, 40, 41, 42, 43],
        rating: 5,
        reviews: 64,
        tag: 'HOT',
        img: './assets/images/products/sp004.jpg',
        desc: 'Được thiết kế cho các tiền đạo tốc độ. Đệm Zoom Air 3/4 chiều dài bám sân dính bóng, cảm giác bóng thật chân tuyệt đối.'
    },
    {
        id: 'SP005',
        name: 'Puma Velocity Nitro 2 Running - Siêu Êm',
        category: 'Giày Chạy Bộ',
        brand: 'Puma',
        price: 1550000,
        oldPrice: 1950000,
        sizes: [38, 39, 40, 41, 42],
        rating: 5,
        reviews: 82,
        tag: 'NEW',
        img: './assets/images/products/sp005.jpg',
        desc: 'Công nghệ bọt đệm Nitro siêu nhẹ và đàn hồi phản hồi lực cực nhạy, phù hợp cho việc luyện tập chạy cự ly hàng ngày.'
    },
    {
        id: 'SP006',
        name: 'Giày Tây Oxford Nam Da Bò Ý Clarks Craft',
        category: 'Giày Tây Nam',
        brand: 'Clarks',
        price: 2100000,
        oldPrice: 2600000,
        sizes: [39, 40, 41, 42, 43],
        rating: 5,
        reviews: 41,
        tag: 'NEW',
        img: './assets/images/products/sp006.jpg',
        desc: 'Chế tác thủ công từ da bò lớp một nhập khẩu Italy bóng mịn, đường may viền kín tinh xảo dành cho quý ông công sở.'
    },
    {
        id: 'SP007',
        name: 'Nike Dunk Low Retro Panda - Phối Màu Đen Trắng',
        category: 'Giày Sneaker',
        brand: 'Nike',
        price: 2300000,
        oldPrice: 2750000,
        sizes: [38, 39, 40, 41, 42, 43],
        rating: 5,
        reviews: 310,
        tag: 'HOT',
        img: './assets/images/products/sp007.jpg',
        desc: 'Cơn sốt đường phố với phối màu đen trắng kinh điển dễ dàng phối đồ với mọi phong cách từ học sinh tới đi làm.'
    },
    {
        id: 'SP008',
        name: 'Adidas Predator Elite FT FG - Kiểm Soát Bóng',
        category: 'Giày Đá Bóng',
        brand: 'Adidas',
        price: 2950000,
        oldPrice: 3500000,
        sizes: [40, 41, 42, 43],
        rating: 5,
        reviews: 73,
        tag: 'SALE',
        img: './assets/images/products/sp008.jpg',
        desc: 'Gai cao su Strikeskin hỗ trợ xoáy bóng hoàn hảo cùng khung đế Controlframe 2.0 tạo độ ổn định khi đổi hướng bứt tốc.'
    },
    {
        id: 'SP009',
        name: 'Nike Pegasus 40 FlyEase - Chạy Bộ Đa Năng',
        category: 'Giày Chạy Bộ',
        brand: 'Nike',
        price: 2835000,
        oldPrice: 3400000,
        sizes: [39, 40, 41, 42, 43],
        rating: 5,
        reviews: 88,
        tag: 'HOT',
        img: './assets/images/products/sp009.jpg',
        desc: 'Dòng giày chạy bộ huyền thoại của Nike với công nghệ đệm kép Zoom Air ở mũi và gót chân. Thân giày FlyEase có khóa kéo tiện lợi, bứt tốc êm ái bền bỉ.'
    },
    {
        id: 'SP010',
        name: 'Giày Tây Loafer Da Bóng Clarks Penny - Quý Ông Lịch Lãm',
        category: 'Giày Tây Nam',
        brand: 'Clarks',
        price: 1790000,
        oldPrice: 2200000,
        sizes: [39, 40, 41, 42],
        rating: 5,
        reviews: 35,
        tag: 'SALE',
        img: './assets/images/products/sp010.jpg',
        desc: 'Thiết kế giày lười Penny Loafer tiện lợi, da bò nguyên tấm đánh xi bóng bẩy, lót giày êm ái thoáng khí suốt ngày dài công sở.'
    },
    {
        id: 'SP011',
        name: 'Puma RS-X Triple White - Phong Cách Chunky',
        category: 'Giày Sneaker',
        brand: 'Puma',
        price: 1680000,
        oldPrice: 2100000,
        sizes: [38, 39, 40, 41, 42, 43],
        rating: 5,
        reviews: 58,
        tag: 'NEW',
        img: './assets/images/products/sp011.jpg',
        desc: 'Phong cách Chunky Sneaker hầm hố và năng động. Hệ thống đệm Running System độc quyền của Puma tạo cảm giác êm ái đàn hồi.'
    },
    {
        id: 'SP012',
        name: 'Adidas Adizero Boston 12 Pro - Luyện Tập Tốc Độ',
        category: 'Giày Chạy Bộ',
        brand: 'Adidas',
        price: 2580000,
        oldPrice: 3100000,
        sizes: [39, 40, 41, 42, 43],
        rating: 5,
        reviews: 79,
        tag: 'HOT',
        img: './assets/images/products/sp012.jpg',
        desc: 'Thanh sợi thủy tinh Energyrods 2.0 hạn chế tiêu hao năng lượng, kết hợp hai lớp đệm Lightstrike Pro và Lightstrike 2.0 siêu bền.'
    }
];

// STATE QUẢN LÝ BỘ LỌC VÀ PHÂN TRANG
let filteredProducts = [...productsData];
let currentPage = 1;
const itemsPerPage = 6;
let selectedCategory = 'Tất cả';
let selectedSize = 'ALL';

// QUẢN LÝ ĐĂNG NHẬP (Mục II.1)
let currentUser = (window.SGU_CORE && SGU_CORE.getCurrentUser) 
    ? SGU_CORE.getCurrentUser() 
    : JSON.parse(localStorage.getItem('sgu_user'));

window.addEventListener('DOMContentLoaded', () => {
    initUserState();
    renderCategoryMenu();
    renderBrandFilterList();
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
    initSearchAutocomplete();
});

// TOAST NOTIFICATION THAY CHO ALERT
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : (type === 'warning' ? '⚠️' : '❌');
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// KHỞI TẠO TRẠNG THÁI TÀI KHOẢN (Mục II.1)
function initUserState() {
    currentUser = (window.SGU_CORE && SGU_CORE.getCurrentUser) 
        ? SGU_CORE.getCurrentUser() 
        : JSON.parse(localStorage.getItem('sgu_user'));

    const guestBox = document.getElementById('user-guest');
    const loggedBox = document.getElementById('user-logged-in');
    const displayUser = document.getElementById('display-username');
    const avatarInit = document.getElementById('avatar-initial');

    if (currentUser) {
        if (guestBox) guestBox.style.display = 'none';
        if (loggedBox) loggedBox.style.display = 'flex';
        if (displayUser) displayUser.innerText = currentUser.name;
        if (avatarInit) avatarInit.innerText = currentUser.name.charAt(0).toUpperCase();

        // Tải thông tin vào form Hồ sơ
        const pName = document.getElementById('prof-name');
        const pEmail = document.getElementById('prof-email');
        const pPhone = document.getElementById('prof-phone');
        const pAddress = document.getElementById('prof-address');
        if (pName) pName.value = currentUser.name || '';
        if (pEmail) pEmail.value = currentUser.email || '';
        if (pPhone) pPhone.value = currentUser.phone || '';
        if (pAddress) pAddress.value = currentUser.address || '';
    } else {
        if (guestBox) guestBox.style.display = 'flex';
        if (loggedBox) loggedBox.style.display = 'none';
    }
}

// ĐĂNG NHẬP (Mục II.1)
function handleLogin() {
    const email = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();

    if (!email || !pass) {
        showToast('Vui lòng nhập đầy đủ Email và Mật khẩu!', 'warning');
        return;
    }

    const users = (window.SGU_CORE && SGU_CORE.getUsers) 
        ? SGU_CORE.getUsers() 
        : (JSON.parse(localStorage.getItem('sgu_users')) || []);

    const user = users.find(u => (u.email === email || u.id === email) && u.pass === pass);

    if (!user) {
        showToast('Sai tài khoản hoặc mật khẩu! Vui lòng thử lại.', 'warning');
        return;
    }

    if (user.isLocked) {
        showToast('Tài khoản này đã bị KHÓA bởi Quản trị viên!', 'warning');
        return;
    }

    currentUser = user;
    if (window.SGU_CORE && SGU_CORE.setCurrentUser) {
        SGU_CORE.setCurrentUser(user);
    } else {
        localStorage.setItem('sgu_user', JSON.stringify(user));
    }

    closeModal('modal-login');
    initUserState();
    updateCartBadge();
    showToast(`Đăng nhập thành công! Chào mừng ${user.name}`, 'success');
}

// ĐĂNG KÝ (Mục II.1)
function handleRegister() {
    const name = document.getElementById('reg-fullname').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const address = document.getElementById('reg-address').value.trim();
    const pass = document.getElementById('reg-password').value.trim();

    if (!name || !phone || !address || !pass) {
        showToast('Vui lòng điền đầy đủ các thông tin bắt buộc (*)!', 'warning');
        return;
    }

    const users = (window.SGU_CORE && SGU_CORE.getUsers) 
        ? SGU_CORE.getUsers() 
        : (JSON.parse(localStorage.getItem('sgu_users')) || []);

    const autoEmail = 'user_' + Date.now().toString().slice(-4) + '@gmail.com';
    const newUser = {
        id: 'KH' + String(users.length + 1).padStart(3, '0'),
        name: name,
        email: autoEmail,
        pass: pass,
        phone: phone,
        address: address,
        isLocked: false
    };

    users.push(newUser);
    if (window.SGU_CORE && SGU_CORE.saveUsers) {
        SGU_CORE.saveUsers(users);
        SGU_CORE.setCurrentUser(newUser);
    } else {
        localStorage.setItem('sgu_users', JSON.stringify(users));
        localStorage.setItem('sgu_user', JSON.stringify(newUser));
    }

    currentUser = newUser;
    closeModal('modal-register');
    initUserState();
    updateCartBadge();
    showToast(`Đăng ký thành công! Đã tự động đăng nhập tài khoản: ${newUser.name}`, 'success');
}

// ĐĂNG XUẤT (Mục II.1)
function handleLogout() {
    if (window.SGU_CORE && SGU_CORE.setCurrentUser) {
        SGU_CORE.setCurrentUser(null);
    } else {
        localStorage.removeItem('sgu_user');
        localStorage.setItem('sgu_cart', JSON.stringify([]));
    }
    currentUser = null;
    initUserState();
    updateCartBadge();
    showToast('Đã đăng xuất khỏi tài khoản!', 'warning');
}

// CẬP NHẬT HỒ SƠ (Mục II.1)
function handleUpdateProfile() {
    if (!currentUser) return;
    const name = document.getElementById('prof-name').value.trim();
    const phone = document.getElementById('prof-phone').value.trim();
    const address = document.getElementById('prof-address').value.trim();

    if (!name || !phone || !address) {
        showToast('Vui lòng không để trống thông tin cá nhân!', 'warning');
        return;
    }

    currentUser.name = name;
    currentUser.phone = phone;
    currentUser.address = address;

    if (window.SGU_CORE && SGU_CORE.setCurrentUser) {
        SGU_CORE.setCurrentUser(currentUser);
    } else {
        localStorage.setItem('sgu_user', JSON.stringify(currentUser));
    }

    initUserState();
    closeModal('modal-profile');
    showToast('Cập nhật hồ sơ thông tin cá nhân thành công!', 'success');
}

// RENDER MENU DANH MỤC ĐỘNG TỪ SGU_CORE
function renderCategoryMenu() {
    const container = document.getElementById('category-menu');
    const select = document.getElementById('adv-category');
    if (!container || !window.SGU_CORE) return;
    const cats = SGU_CORE.getCategories().filter(c => c.active !== false);
    const prods = productsData;

    container.innerHTML = `
        <li class="category-item ${selectedCategory === 'Tất cả' ? 'active' : ''}" data-cat="Tất cả" onclick="filterByCategory('Tất cả', this)">
            <span>Tất cả sản phẩm</span>
            <span class="cat-badge" id="count-all">${prods.length}</span>
        </li>
        ${cats.map(c => {
            const count = prods.filter(p => p.catCode === c.code || p.category === c.name).length;
            return `
                <li class="category-item ${selectedCategory === c.name ? 'active' : ''}" data-cat="${c.name}" onclick="filterByCategory('${c.name}', this)">
                    <span>${c.name}</span>
                    <span class="cat-badge">${count}</span>
                </li>
            `;
        }).join('')}
    `;

    if (select) {
        select.innerHTML = `
            <option value="Tất cả">-- Tất cả loại --</option>
            ${cats.map(c => `<option value="${c.name}" ${selectedCategory === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
        `;
    }
}

// RENDER BỘ LỌC THƯƠNG HIỆU ĐỘNG TỪ DANH SÁCH SẢN PHẨM HIỆN CÓ
function renderBrandFilterList() {
    const container = document.getElementById('brand-filter-list');
    if (!container) return;

    // Các thương hiệu tiêu chuẩn + thương hiệu mới do Admin thêm
    const defaultBrands = ['Nike', 'Adidas', 'Jordan', 'Puma', 'Clarks'];
    const prods = (window.SGU_CORE && SGU_CORE.getProducts) ? SGU_CORE.getProducts() : productsData;
    const prodBrands = (prods || []).map(p => p.brand).filter(Boolean);
    const uniqueBrands = Array.from(new Set([...defaultBrands, ...prodBrands]));

    // Lưu lại trạng thái checkbox đang chọn nếu có
    const checkedBoxes = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value);
    const hasAnyCheckboxes = document.querySelectorAll('input[name="brand"]').length > 0;

    container.innerHTML = uniqueBrands.map(b => {
        const isChecked = hasAnyCheckboxes ? checkedBoxes.includes(b) : true;
        return `
            <label class="brand-label">
                <input type="checkbox" name="brand" value="${b}" ${isChecked ? 'checked' : ''} onchange="applyFilters()"> ${b}
            </label>
        `;
    }).join('');
}

// BỘ LỌC VÀ TÌM KIẾM SẢN PHẨM (Mục II.2)
function filterByCategory(cat, element) {
    document.querySelectorAll('#category-menu .category-item').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');
    selectedCategory = cat;
    const advCat = document.getElementById('adv-category');
    if (advCat) advCat.value = cat === 'Tất cả' ? 'Tất cả' : cat;
    applyFilters();
}

function toggleSizeFilter(btn, size) {
    document.querySelectorAll('.size-grid .size-chip').forEach(c => c.classList.remove('selected'));
    btn.classList.add('selected');
    selectedSize = size;
    applyFilters();
}

function handleBasicSearch() {
    const keyword = document.getElementById('basic-search-input').value.trim();
    document.getElementById('adv-name').value = keyword;
    applyFilters();
}

function applyFilters() {
    const keyword = document.getElementById('adv-name').value.trim();
    const cat = document.getElementById('adv-category').value;
    const minPrice = parseInt(document.getElementById('adv-min-price').value) || 0;
    const maxPrice = parseInt(document.getElementById('adv-max-price').value) || 999999999;

    // Chuẩn hóa tiếng Việt không dấu để tìm kiếm thông minh
    const norm = (s) => (window.SGU_CORE && SGU_CORE.removeVietnameseTones) ? SGU_CORE.removeVietnameseTones(s) : (s || '').toLowerCase();
    const normKey = norm(keyword);

    // Lấy danh sách thương hiệu được tích chọn
    const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value);
    const allBrandBoxes = document.querySelectorAll('input[name="brand"]');
    const allOrNone = selectedBrands.length === 0 || selectedBrands.length === allBrandBoxes.length;

    filteredProducts = productsData.filter(prod => {
        const matchKeyword = !normKey || norm(prod.name).includes(normKey) || norm(prod.desc).includes(normKey) || norm(prod.brand).includes(normKey);
        const matchCategory = (cat === 'Tất cả') || (prod.category === cat);
        const matchBrand = allOrNone || selectedBrands.includes(prod.brand);
        const matchPrice = (prod.price >= minPrice && prod.price <= maxPrice);
        const matchSize = (selectedSize === 'ALL') || (prod.sizes && prod.sizes.includes(parseInt(selectedSize)));

        return matchKeyword && matchCategory && matchBrand && matchPrice && matchSize;
    });

    handleSortChange(false);
    currentPage = 1;
    renderProducts();
    renderPagination();
}

function setQuickPriceRange(min, max, chipEl) {
    const minInput = document.getElementById('adv-min-price');
    const maxInput = document.getElementById('adv-max-price');
    
    // Xóa active trên tất cả chips
    document.querySelectorAll('#quick-price-chips .price-chip').forEach(c => c.classList.remove('active'));

    if (min === null && max === null) {
        if (minInput) minInput.value = '';
        if (maxInput) maxInput.value = '';
    } else {
        if (minInput) minInput.value = min || '';
        if (maxInput) maxInput.value = (max === 999999999) ? '' : (max || '');
    }

    if (chipEl) chipEl.classList.add('active');
    applyFilters();
}

function resetAllFilters() {
    document.getElementById('adv-name').value = '';
    document.getElementById('basic-search-input').value = '';
    document.getElementById('adv-category').value = 'Tất cả';
    document.getElementById('adv-min-price').value = '';
    document.getElementById('adv-max-price').value = '';
    document.querySelectorAll('#quick-price-chips .price-chip').forEach(c => c.classList.remove('active'));
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
        currentPage = 1;
        renderProducts();
        renderPagination();
    }
}

// RENDER DANH SÁCH SẢN PHẨM (Mục II.2)
function renderProducts() {
    const grid = document.getElementById('product-grid');
    const visibleCountLabel = document.getElementById('visible-count');
    const viewTitle = document.getElementById('current-view-title');

    viewTitle.innerText = selectedCategory === 'Tất cả' 
        ? 'Tất Cả Sản Phẩm Giày' 
        : `Bộ Sưu Tập: ${selectedCategory}`;

    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: #fff; border-radius: var(--radius-md); border: 1px solid var(--border);">
                <div style="font-size: 52px; margin-bottom: 12px;">👟🔍</div>
                <h3 style="font-size: 18px; font-weight: 700; color: var(--secondary);">Không tìm thấy sản phẩm giày phù hợp!</h3>
                <p style="color: var(--gray); font-size: 14px; margin-top: 6px;">Vui lòng thử điều chỉnh lại mức giá, loại sản phẩm hoặc từ khóa tìm kiếm.</p>
                <button class="btn-primary" style="margin-top: 18px; padding: 10px 20px;" onclick="resetAllFilters()">Đặt Lại Bộ Lọc</button>
            </div>
        `;
        visibleCountLabel.innerText = '0';
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProducts = filteredProducts.slice(startIndex, endIndex);

    visibleCountLabel.innerText = pageProducts.length;

    grid.innerHTML = pageProducts.map(p => {
        const isWish = (window.SGU_CORE && SGU_CORE.isWishlisted) ? SGU_CORE.isWishlisted(p.id) : false;
        return `
        <div class="product-card" onclick="openProductDetailById('${p.id}')">
            <div class="card-img-wrap">
                <span class="card-tag ${p.tag ? p.tag.toLowerCase() : 'new'}">${p.tag || 'NEW'}</span>
                <button type="button" class="btn-wishlist-card ${isWish ? 'active' : ''}" onclick="event.stopPropagation(); handleToggleWishlist('${p.id}')" title="${isWish ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}">
                    ${isWish ? '❤️' : '🤍'}
                </button>
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                <button type="button" class="btn-quick-view" onclick="event.stopPropagation(); openProductDetailById('${p.id}')">
                    👁️ Xem Chi Tiết
                </button>
            </div>
            <div class="card-body">
                <div class="card-brand">${p.brand}</div>
                <h3 class="card-title" title="${p.name}">${p.name}</h3>
                
                <div class="card-rating">
                    <span class="stars">⭐⭐⭐⭐⭐</span>
                    <span class="rating-num">(${p.reviews || 90})</span>
                </div>

                <div class="card-price-row">
                    <div>
                        <span class="current-price">${(window.SGU_CORE && SGU_CORE.formatVND) ? SGU_CORE.formatVND(p.price) : Number(p.price).toLocaleString('vi-VN') + ' ₫'}</span>
                        ${p.oldPrice ? `<span class="old-price">${(window.SGU_CORE && SGU_CORE.formatVND) ? SGU_CORE.formatVND(p.oldPrice) : Number(p.oldPrice).toLocaleString('vi-VN') + ' ₫'}</span>` : ''}
                    </div>
                </div>

                <div class="card-footer-action">
                    <button type="button" class="btn-add-cart-sm" onclick="event.stopPropagation(); openQuickSizeModal('${p.id}')">
                        🛒 Chọn mua
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// PHÂN TRANG (Mục II.2)
function renderPagination() {
    const box = document.getElementById('pagination-box');
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    if (totalPages <= 1) {
        box.innerHTML = '';
        return;
    }

    let html = `
        <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">
            ‹ Trước
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button class="page-btn ${currentPage === i ? 'active' : ''}" onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }

    html += `
        <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">
            Sau ›
        </button>
    `;

    box.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    renderProducts();
    renderPagination();
    window.scrollTo({ top: 380, behavior: 'smooth' });
}

// 3. XEM CHI TIẾT SẢN PHẨM (Mục II.2 - CHUYỂN HƯỚNG TỚI TRANG product-detail.html)
function openProductDetailById(id) {
    window.location.href = 'product-detail.html?id=' + encodeURIComponent(id);
}

// 4. GIỎ HÀNG (Mục II.3 - RÀNG BUỘC PHẢI ĐĂNG NHẬP MỚI DÙNG ĐƯỢC GIỎ HÀNG)
function addToCart(name, price, code, img) {
    if (!currentUser) {
        showToast('Khách hàng phải Đăng nhập trước khi chọn mua và sử dụng giỏ hàng!', 'warning');
        openModal('modal-login');
        return;
    }

    let cart = (window.SGU_CORE && SGU_CORE.getCart) ? SGU_CORE.getCart() : (JSON.parse(localStorage.getItem('sgu_cart')) || []);
    const existing = cart.find(item => item.code === code && item.size === 40);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            code: code,
            name: name,
            price: price,
            size: 40,
            qty: 1,
            img: img
        });
    }

    if (window.SGU_CORE && SGU_CORE.saveCart) {
        SGU_CORE.saveCart(cart);
    } else {
        localStorage.setItem('sgu_cart', JSON.stringify(cart));
    }

    updateCartBadge();
    showToast(`Đã thêm "${name}" (Size 40) vào giỏ hàng!`, 'success');
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

// ==========================================================================
// TÍNH NĂNG NÂNG CẤP MỚI (SEARCH AUTOCOMPLETE, WISHLIST, QUICK SIZE PICKER)
// ==========================================================================

// 1. SEARCH AUTOCOMPLETE / LIVE SEARCH DROPDOWN
function initSearchAutocomplete() {
    const searchInput = document.getElementById('basic-search-input');
    const autoBox = document.getElementById('search-autocomplete-box');
    if (!searchInput || !autoBox) return;

    let debounceTimer = null;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();

        if (query.length < 2) {
            autoBox.style.display = 'none';
            autoBox.innerHTML = '';
            return;
        }

        debounceTimer = setTimeout(() => {
            const norm = (s) => (window.SGU_CORE && SGU_CORE.removeVietnameseTones) ? SGU_CORE.removeVietnameseTones(s) : (s || '').toLowerCase();
            const normQuery = norm(query);

            const prods = (window.SGU_CORE && SGU_CORE.getProducts) ? SGU_CORE.getProducts().filter(p => p.active !== false) : productsData;
            const matches = prods.filter(p => norm(p.name).includes(normQuery) || norm(p.brand).includes(normQuery) || norm(p.category).includes(normQuery)).slice(0, 5);

            if (matches.length === 0) {
                autoBox.innerHTML = `<div class="autocomplete-empty">Không tìm thấy sản phẩm phù hợp với "${query}"</div>`;
                autoBox.style.display = 'block';
                return;
            }

            autoBox.innerHTML = matches.map(p => `
                <div class="autocomplete-item" onclick="openProductDetailById('${p.id}')">
                    <img src="${p.img}" alt="${p.name}" class="autocomplete-thumb">
                    <div class="autocomplete-info">
                        <div class="autocomplete-title">${p.name}</div>
                        <div class="autocomplete-meta">
                            <span class="autocomplete-brand">${p.brand}</span>
                            <span class="autocomplete-price">${(window.SGU_CORE && SGU_CORE.formatVND) ? SGU_CORE.formatVND(p.price) : Number(p.price).toLocaleString('vi-VN') + ' ₫'}</span>
                        </div>
                    </div>
                </div>
            `).join('');
            autoBox.style.display = 'block';
        }, 180);
    });

    // Ẩn khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !autoBox.contains(e.target)) {
            autoBox.style.display = 'none';
        }
    });

    // Ẩn khi nhấn ESC
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            autoBox.style.display = 'none';
        }
    });
}

// 2. WISHLIST TOGGLE (❤️ / 🤍)
function handleToggleWishlist(prodId) {
    if (!window.SGU_CORE || !SGU_CORE.toggleWishlist) return;
    const isAdded = SGU_CORE.toggleWishlist(prodId);
    showToast(isAdded ? 'Đã thêm sản phẩm vào danh sách Yêu thích ❤️' : 'Đã xóa sản phẩm khỏi Yêu thích 🤍', isAdded ? 'success' : 'warning');
    renderProducts();
}

// 3. QUICK SIZE PICKER MODAL STATE & ACTIONS
let quickModalProduct = null;
let quickModalSelectedSize = null;

function openQuickSizeModal(prodId) {
    if (!currentUser) {
        showToast('Khách hàng phải Đăng nhập trước khi chọn mua và sử dụng giỏ hàng!', 'warning');
        openModal('modal-login');
        return;
    }

    const prods = (window.SGU_CORE && SGU_CORE.getProducts) ? SGU_CORE.getProducts() : productsData;
    const p = prods.find(item => item.id === prodId);
    if (!p) return;

    quickModalProduct = p;
    const sizes = p.sizes && p.sizes.length > 0 ? p.sizes : [38, 39, 40, 41, 42, 43, 44];
    const sizeStock = p.sizeStock || {};

    const imgEl = document.getElementById('quick-modal-img');
    const brandEl = document.getElementById('quick-modal-brand');
    const titleEl = document.getElementById('quick-modal-title');
    const priceEl = document.getElementById('quick-modal-price');

    if (imgEl) imgEl.src = p.img;
    if (brandEl) brandEl.innerText = p.brand;
    if (titleEl) titleEl.innerText = p.name;
    if (priceEl) priceEl.innerText = (window.SGU_CORE && SGU_CORE.formatVND) ? SGU_CORE.formatVND(p.price) : Number(p.price).toLocaleString('vi-VN') + ' ₫';

    // Chọn size còn hàng đầu tiên
    const firstInStock = sizes.find(s => (sizeStock[s] !== undefined ? sizeStock[s] > 0 : true));
    quickModalSelectedSize = firstInStock !== undefined ? firstInStock : sizes[0];

    renderQuickModalSizes();
    updateQuickModalStockInfo();
    openModal('modal-quick-size');
}

function renderQuickModalSizes() {
    const container = document.getElementById('quick-modal-sizes');
    if (!container || !quickModalProduct) return;

    const sizes = quickModalProduct.sizes && quickModalProduct.sizes.length > 0 ? quickModalProduct.sizes : [38, 39, 40, 41, 42, 43, 44];
    const sizeStock = quickModalProduct.sizeStock || {};

    container.innerHTML = sizes.map(s => {
        const inStock = sizeStock[s] !== undefined ? sizeStock[s] > 0 : true;
        const isSelected = s === quickModalSelectedSize;
        return `
            <button type="button" class="size-chip-btn ${isSelected ? 'selected' : ''} ${!inStock ? 'out-of-stock' : ''}" 
                ${!inStock ? 'disabled title="Hết size này"' : `onclick="selectQuickSize(${s})"`}>
                ${s}
            </button>
        `;
    }).join('');
}

function selectQuickSize(size) {
    quickModalSelectedSize = size;
    renderQuickModalSizes();
    updateQuickModalStockInfo();
}

function updateQuickModalStockInfo() {
    const tag = document.getElementById('quick-modal-stock-tag');
    const desc = document.getElementById('quick-modal-stock-desc');
    const btn = document.getElementById('quick-modal-btn-confirm');
    if (!quickModalProduct) return;

    const sizeStock = quickModalProduct.sizeStock || {};
    const stock = sizeStock[quickModalSelectedSize] !== undefined ? sizeStock[quickModalSelectedSize] : quickModalProduct.stock;

    if (stock <= 0) {
        if (tag) {
            tag.className = 'size-stock-badge out-stock';
            tag.innerText = 'Hết size';
        }
        if (desc) desc.innerHTML = `❌ Size ${quickModalSelectedSize} hiện tại đã <strong>tạm hết hàng</strong> trong kho. Vui lòng chọn size khác!`;
        if (btn) btn.disabled = true;
    } else if (stock <= 3) {
        if (tag) {
            tag.className = 'size-stock-badge low-stock';
            tag.innerText = `Sắp hết (Còn ${stock})`;
        }
        if (desc) desc.innerHTML = `⚠️ Size ${quickModalSelectedSize}: Chỉ còn <strong>${stock} đôi</strong> sẵn có trong kho. Đặt sớm kẻo hết!`;
        if (btn) btn.disabled = false;
    } else {
        if (tag) {
            tag.className = 'size-stock-badge in-stock';
            tag.innerText = `Còn ${stock} đôi`;
        }
        if (desc) desc.innerHTML = `✅ Size ${quickModalSelectedSize}: Còn <strong>${stock} đôi</strong> sẵn sàng giao hàng ngay.`;
        if (btn) btn.disabled = false;
    }
}

function confirmQuickAddToCart() {
    if (!quickModalProduct || !quickModalSelectedSize) return;

    const p = quickModalProduct;
    const size = quickModalSelectedSize;

    let cart = (window.SGU_CORE && SGU_CORE.getCart) ? SGU_CORE.getCart() : (JSON.parse(localStorage.getItem('sgu_cart')) || []);
    const existing = cart.find(item => item.code === p.id && item.size === size);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            code: p.id,
            name: p.name,
            price: p.price,
            size: size,
            qty: 1,
            img: p.img
        });
    }

    if (window.SGU_CORE && SGU_CORE.saveCart) {
        SGU_CORE.saveCart(cart);
    } else {
        localStorage.setItem('sgu_cart', JSON.stringify(cart));
    }

    closeModal('modal-quick-size');
    updateCartBadge();
    showToast(`Đã thêm "${p.name}" (Size ${size}) vào giỏ hàng!`, 'success');
}
