/**
 * SGU SNEAKER - JAVASCRIPT QUẢN TRỊ 1: DỮ LIỆU GỐC & KHÁCH HÀNG (MASTER DATA & USER MANAGEMENT)
 * Học phần: Lập trình Web và Ứng dụng - Đại học Sài Gòn (SGU)
 * 
 * CÁC CHỨC NĂNG CHÍNH:
 * 1. Tiện ích giao diện: Toast notification, Tìm kiếm bảng tức thì, Đóng modal
 * 2. Xác thực & Khung điều khiển Admin: Login riêng, Logout, Khóa màn hình, Điều hướng Tabs
 * 3. Thẻ thống kê KPI tổng quan (Doanh thu, Đơn hàng, Số mẫu, Cảnh báo tồn)
 * 4. Quản lý Người dùng / Khách hàng: Danh sách, Reset mật khẩu, Khóa/Mở khóa tài khoản
 * 5. Quản lý Loại sản phẩm: Danh mục, Thêm/Sửa/Xóa/Ẩn phân loại giày
 * 6. Quản lý Sản phẩm & Bộ ảnh: Thêm/Sửa/Xóa/Ẩn giày, Gallery đa góc chụp, Kho ảnh mẫu
 */

// ==========================================================
// 1. TIỆN ÍCH DÙNG CHUNG GIAO DIỆN
// ==========================================================

// Hệ thống thông báo Toast (Tối đa 3 toast cùng lúc)
function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    while (container.children.length >= 3) {
        container.firstElementChild.remove();
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : (type === 'info' ? 'ℹ️' : '⚠️');
    toast.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

// Tìm kiếm tức thì trên bảng (Search as you type)
function filterTableAsYouType(input, tableBodyId) {
    const query = input.value.toLowerCase().trim();
    const rows = document.querySelectorAll('#' + tableBodyId + ' tr');
    rows.forEach(r => {
        const text = r.innerText.toLowerCase();
        r.style.display = text.includes(query) ? '' : 'none';
    });
}

// Đóng modal theo ID
function closeModal(id) { 
    const el = document.getElementById(id);
    if (el) el.style.display = 'none'; 
}

// ==========================================================
// 2. XÁC THỰC ADMIN & KHUNG DASHBOARD (MỤC I.1)
// ==========================================================

// Kiểm tra phiên làm việc Admin qua sessionStorage
function checkAdminSession() {
    const isAuth = sessionStorage.getItem('sgu_admin_auth') === 'true';
    const loginScreen = document.getElementById('admin-login-screen');
    if (!loginScreen) return;
    if (isAuth) {
        loginScreen.style.display = 'none';
    } else {
        loginScreen.style.display = 'flex';
    }
}

// Đăng nhập Admin riêng biệt (không dùng chung khách)
function loginAdmin() {
    const user = document.getElementById('admin-user').value.trim();
    const pass = document.getElementById('admin-pass').value.trim();
    if (!user || !pass) {
        showToast('Vui lòng nhập tài khoản và mật khẩu!', 'warning');
        return;
    }
    sessionStorage.setItem('sgu_admin_auth', 'true');
    const loginScreen = document.getElementById('admin-login-screen');
    if (loginScreen) loginScreen.style.display = 'none';
    showToast('Đăng nhập Quản trị viên thành công! Phiên làm việc đã kích hoạt.', 'success');
}

// Đăng xuất Admin
function logoutAdmin() {
    sessionStorage.removeItem('sgu_admin_auth');
    const loginScreen = document.getElementById('admin-login-screen');
    if (loginScreen) loginScreen.style.display = 'flex';
    showToast('Đã đăng xuất khỏi tài khoản Quản trị!', 'warning');
}

// Khóa nhanh màn hình Admin
function lockAdminScreen() {
    const loginScreen = document.getElementById('admin-login-screen');
    if (loginScreen) loginScreen.style.display = 'flex';
    showToast('Đã khóa màn hình Quản trị viên!', 'warning');
}

// Chuyển Tab chức năng điều hướng
function switchAdminTab(tabId, navEl) {
    document.querySelectorAll('.admin-tab').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    const target = document.getElementById(tabId);
    if (target) target.style.display = 'block';
    if (navEl) navEl.classList.add('active');

    // Cập nhật hash trên URL
    const mapHash = {
        'tab-users': '#users',
        'tab-cats': '#cats',
        'tab-prods': '#prods',
        'tab-imports': '#imports',
        'tab-pricing': '#pricing',
        'tab-orders': '#orders',
        'tab-inventory': '#inventory'
    };
    if (mapHash[tabId]) {
        history.replaceState(null, null, mapHash[tabId]);
    }
}

// Bộ thẻ KPI thống kê tự động cập nhật từ SGU_CORE
function updateAdminKPIs() {
    if (!window.SGU_CORE) return;
    const orders = SGU_CORE.getOrders();
    const prods = SGU_CORE.getProducts();

    // 1. Doanh thu (tổng đơn không hủy)
    const totalRev = orders
        .filter(o => o.status !== 'Hủy')
        .reduce((sum, o) => {
            const num = parseInt((o.total || '0').replace(/\D/g, '')) || 0;
            return sum + num;
        }, 0);
    const revEl = document.getElementById('kpi-revenue');
    if (revEl) revEl.innerText = SGU_CORE.formatVND(totalRev);

    // 2. Đơn cần xử lý (Mới đặt hoặc Đã xử lý)
    const pendingOrders = orders.filter(o => o.status === 'Mới đặt' || o.status === 'Đã xử lý').length;
    const pendingEl = document.getElementById('kpi-pending-orders');
    if (pendingEl) pendingEl.innerText = `${pendingOrders} đơn mới`;

    const sideOrderBadge = document.getElementById('sidebar-order-count');
    if (sideOrderBadge) {
        sideOrderBadge.innerText = pendingOrders;
        sideOrderBadge.style.display = pendingOrders > 0 ? 'inline-block' : 'none';
    }

    // 3. Mẫu giày đang bán
    const activeProds = prods.filter(p => p.active !== false).length;
    const prodEl = document.getElementById('kpi-total-prods');
    if (prodEl) prodEl.innerText = `${activeProds} mẫu`;

    // 4. Cảnh báo tồn kho (< 5 đôi)
    const lowStockProds = prods.filter(p => (p.stock || 0) < 5).length;
    const lowStockEl = document.getElementById('kpi-low-stock');
    if (lowStockEl) lowStockEl.innerText = `${lowStockProds} mẫu`;

    const sideAlertBadge = document.getElementById('sidebar-alert-count');
    if (sideAlertBadge) {
        sideAlertBadge.innerText = lowStockProds;
        sideAlertBadge.style.display = lowStockProds > 0 ? 'inline-block' : 'none';
    }
}

// ==========================================================
// 3. QUẢN LÝ KHÁCH HÀNG (MỤC I.2)
// ==========================================================

function loadAdminUsers() {
    const table = document.getElementById('user-table-body');
    if (!table || !window.SGU_CORE) return;
    const users = SGU_CORE.getUsers();

    table.innerHTML = users.map(u => `
        <tr id="user-row-${u.id}">
            <td><strong>${u.id}</strong></td>
            <td><strong>${u.name}</strong></td>
            <td>${u.email}</td>
            <td>${u.phone || '0909123456'}</td>
            <td style="max-width:220px; font-size:13px;">${u.address || 'TP.HCM'}</td>
            <td>
                <span class="badge ${u.isLocked ? 'badge-locked' : 'badge-active'}" id="badge-${u.id}">
                    ${u.isLocked ? 'Đã khóa' : 'Đang hoạt động'}
                </span>
            </td>
            <td>
                <button class="btn btn-warning" onclick="resetUserPassword('${u.id}', '${u.name}')">🔑 Reset Pass</button>
                <button class="btn ${u.isLocked ? 'btn-success' : 'btn-danger'}" id="btn-lock-${u.id}" onclick="toggleLock('${u.id}', '${u.name}')">
                    ${u.isLocked ? '🔓 Mở khóa TK' : '🔒 Khóa TK'}
                </button>
            </td>
        </tr>
    `).join('');
}

function resetUserPassword(userId, name) {
    if (!window.SGU_CORE) return;
    const users = SGU_CORE.getUsers();
    const u = users.find(x => x.id === userId);
    if (u) {
        u.pass = '123456';
        SGU_CORE.saveUsers(users);
        showToast(`Đã reset mật khẩu của khách hàng "${name}" về mặc định: 123456`, 'success');
    }
}

function toggleLock(userId, name) {
    if (!window.SGU_CORE) return;
    const users = SGU_CORE.getUsers();
    const u = users.find(x => x.id === userId);
    if (!u) return;

    u.isLocked = !u.isLocked;
    SGU_CORE.saveUsers(users);

    // Nếu tài khoản đang được lưu làm sgu_user hiện tại, cập nhật ngay
    const cur = SGU_CORE.getCurrentUser();
    if (cur && (cur.id === userId || cur.email === u.email)) {
        cur.isLocked = u.isLocked;
        SGU_CORE.setCurrentUser(cur);
    }

    loadAdminUsers();
    if (u.isLocked) {
        showToast(`Đã KHÓA tài khoản của: ${name}! Khách hàng này sẽ không thể đăng nhập bên website người dùng.`, 'warning');
    } else {
        showToast(`Đã MỞ KHÓA tài khoản của: ${name}! Khách hàng đã có thể đăng nhập bình thường.`, 'success');
    }
}

// ==========================================================
// 4. QUẢN LÝ LOẠI GIÀY (MỤC I.3)
// ==========================================================

function loadAdminCategories() {
    const table = document.getElementById('cat-table-body');
    if (!table || !window.SGU_CORE) return;
    const cats = SGU_CORE.getCategories();
    const prods = SGU_CORE.getProducts();

    table.innerHTML = cats.map(c => {
        const count = prods.filter(p => p.catCode === c.code || p.category === c.name).length;
        const safeName = c.name.replace(/'/g, "\\'");
        return `
            <tr>
                <td><strong>${c.code}</strong></td>
                <td class="cat-name">${c.name}</td>
                <td>${count} sản phẩm</td>
                <td><span class="badge ${c.active ? 'badge-active' : 'badge-locked'}">${c.active ? 'Đang hiển thị' : 'Tạm ẩn'}</span></td>
                <td>
                    <button class="btn btn-warning" onclick="editCategory('${c.code}', '${safeName}')">✏️ Sửa</button>
                    <button class="btn btn-danger" onclick="toggleHideCategory('${c.code}')">${c.active ? '👁️ Ẩn / Xóa' : '🔓 Hiển thị'}</button>
                </td>
            </tr>
        `;
    }).join('');

    // Đồng bộ danh sách loại vào dropdown trong Modal Thêm/Sửa sản phẩm
    const prodCatSelect = document.getElementById('prod-cat');
    if (prodCatSelect) {
        const currentVal = prodCatSelect.value;
        prodCatSelect.innerHTML = cats.filter(c => c.active !== false).map(c => 
            `<option value="${c.name}">${c.name}</option>`
        ).join('');
        if (currentVal && Array.from(prodCatSelect.options).some(o => o.value === currentVal)) {
            prodCatSelect.value = currentVal;
        }
    }
}

function editCategory(code, name) {
    const codeInput = document.getElementById('cat-code');
    const nameInput = document.getElementById('cat-name');
    const saveBtn = document.getElementById('btn-save-cat');
    const cancelBtn = document.getElementById('btn-cancel-cat');

    if (codeInput) {
        codeInput.value = code;
        codeInput.readOnly = true;
        codeInput.style.background = '#f1f5f9';
    }
    if (nameInput) {
        nameInput.value = name;
        nameInput.focus();
    }
    if (saveBtn) saveBtn.innerHTML = '💾 Cập Nhật Loại';
    if (cancelBtn) cancelBtn.style.display = 'inline-block';

    showToast(`Đã tải dữ liệu loại "${name}" lên form chỉnh sửa!`, 'info');
}

function cancelCategoryEdit() {
    const codeInput = document.getElementById('cat-code');
    const nameInput = document.getElementById('cat-name');
    const saveBtn = document.getElementById('btn-save-cat');
    const cancelBtn = document.getElementById('btn-cancel-cat');

    if (codeInput) {
        codeInput.value = '';
        codeInput.readOnly = false;
        codeInput.style.background = '';
    }
    if (nameInput) nameInput.value = '';
    if (saveBtn) saveBtn.innerHTML = '+ Lưu Loại Giày';
    if (cancelBtn) cancelBtn.style.display = 'none';
}

function saveCategory() {
    const codeInput = document.getElementById('cat-code');
    const nameInput = document.getElementById('cat-name');
    const code = codeInput ? codeInput.value.trim() : '';
    const name = nameInput ? nameInput.value.trim() : '';

    if (!code || !name) {
        showToast('Vui lòng nhập đầy đủ Mã loại và Tên loại giày!', 'warning');
        return;
    }

    if (!window.SGU_CORE) return;
    const cats = SGU_CORE.getCategories();
    const existingIndex = cats.findIndex(c => c.code.toLowerCase() === code.toLowerCase());
    
    if (existingIndex !== -1) {
        const oldName = cats[existingIndex].name;
        cats[existingIndex].name = name;
        
        // Đồng bộ đổi tên category trong tất cả sản phẩm đang mang mã loại này
        const prods = SGU_CORE.getProducts();
        let updatedCount = 0;
        prods.forEach(p => {
            if (p.catCode === code || p.category === oldName) {
                p.category = name;
                p.catCode = code;
                updatedCount++;
            }
        });
        if (updatedCount > 0) {
            SGU_CORE.saveProducts(prods);
        }
        showToast(`Đã cập nhật loại giày: ${code} - "${name}"!`, 'success');
    } else {
        cats.push({ code: code, name: name, count: 0, active: true });
        showToast(`Đã thêm mới loại giày: ${code} - "${name}"!`, 'success');
    }

    SGU_CORE.saveCategories(cats);
    loadAdminCategories();
    cancelCategoryEdit();
}

function toggleHideCategory(code) {
    if (!window.SGU_CORE) return;
    const cats = SGU_CORE.getCategories();
    const c = cats.find(x => x.code === code);
    if (c) {
        c.active = !c.active;
        SGU_CORE.saveCategories(cats);
        loadAdminCategories();
        showToast(`Đã ${c.active ? 'hiển thị lại' : 'tạm ẩn'} danh mục "${c.name}"!`, c.active ? 'success' : 'warning');
    }
}

// ==========================================================
// 5. BỘ TIỆN ÍCH CHỌN ẢNH VÀ QUẢN LÝ GALLERY SẢN PHẨM
// ==========================================================

const sampleShoeImages = [
    { code: 'SP001', name: 'Nike Air Max Red', img: './assets/images/products/sp001.jpg' },
    { code: 'SP002', name: 'Adidas Ultraboost', img: './assets/images/products/sp002.jpg' },
    { code: 'SP003', name: 'Jordan 1 Chicago', img: './assets/images/products/sp003.jpg' },
    { code: 'SP004', name: 'Nike Mercurial Vapor', img: './assets/images/products/sp004.jpg' },
    { code: 'SP005', name: 'Puma Velocity Nitro', img: './assets/images/products/sp005.jpg' },
    { code: 'SP006', name: 'Oxford Da Bò Ý', img: './assets/images/products/sp006.jpg' },
    { code: 'SP007', name: 'Nike Dunk Panda', img: './assets/images/products/sp007.jpg' },
    { code: 'SP008', name: 'Adidas Predator Elite', img: './assets/images/products/sp008.jpg' },
    { code: 'SP009', name: 'Nike Pegasus 40', img: './assets/images/products/sp009.jpg' },
    { code: 'SP010', name: 'Penny Loafer Da Bóng', img: './assets/images/products/sp010.jpg' },
    { code: 'SP011', name: 'Puma RS-X Triple White', img: './assets/images/products/sp011.jpg' },
    { code: 'SP012', name: 'Adidas Adizero Pro', img: './assets/images/products/sp012.jpg' }
];

function previewShoeImage(url) {
    const img = document.getElementById('img-preview-thumb');
    const placeholder = document.getElementById('preview-placeholder');
    if (!img || !placeholder) return;
    if (url && (url.startsWith('http') || url.startsWith('./') || url.startsWith('assets/') || url.startsWith('data:image/'))) {
        img.src = url;
        img.style.display = 'block';
        placeholder.style.display = 'none';
    } else {
        img.style.display = 'none';
        placeholder.style.display = 'block';
    }
}

function renderSampleGallery() {
    const container = document.getElementById('preset-gallery-items');
    if (!container) return;

    container.innerHTML = sampleShoeImages.map(item => `
        <div class="preset-item" onclick="selectSampleImage('${item.img}')" title="${item.code} - ${item.name}">
            <img src="${item.img}" alt="${item.name}">
            <span>${item.code}</span>
        </div>
    `).join('');
}

function toggleSampleGallery() {
    const card = document.getElementById('sample-gallery-card');
    if (!card) return;
    const isShowing = card.style.display !== 'none';
    card.style.display = isShowing ? 'none' : 'block';
}

function selectSampleImage(imgUrl) {
    const input = document.getElementById('prod-img');
    const oldVal = input ? input.value : '';
    if (input) input.value = imgUrl;
    previewShoeImage(imgUrl);

    if (typeof currentEditingGallery !== 'undefined') {
        if (currentEditingGallery.length === 0) {
            currentEditingGallery.push(imgUrl);
        } else if (currentEditingGallery[0] === oldVal) {
            currentEditingGallery[0] = imgUrl;
        }
        renderAdminGalleryStrip();
    }

    document.querySelectorAll('.preset-item').forEach(el => {
        const itemImg = el.querySelector('img');
        if (itemImg && itemImg.getAttribute('src') === imgUrl) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    showToast('Đã chọn ảnh mẫu giày thành công!', 'success');
}

function handleProductFileUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast('Vui lòng chỉ chọn file hình ảnh (JPG, PNG, WebP)!', 'warning');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showToast('Dung lượng ảnh vượt quá 5MB. Vui lòng chọn ảnh nhẹ hơn!', 'warning');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Url = e.target.result;
        const input = document.getElementById('prod-img');
        const oldVal = input ? input.value : '';
        if (input) input.value = base64Url;
        previewShoeImage(base64Url);

        if (typeof currentEditingGallery !== 'undefined') {
            if (currentEditingGallery.length === 0) {
                currentEditingGallery.push(base64Url);
            } else if (currentEditingGallery[0] === oldVal) {
                currentEditingGallery[0] = base64Url;
            }
            renderAdminGalleryStrip();
        }

        showToast(`Đã tải ảnh "${file.name}" lên từ máy tính!`, 'success');
    };
    reader.readAsDataURL(file);
}

function initImageDragAndDrop() {
    const box = document.getElementById('box-preview-img');
    if (!box) return;

    box.addEventListener('dragover', (e) => {
        e.preventDefault();
        box.style.borderColor = 'var(--primary)';
        box.style.background = '#fff1f2';
    });

    box.addEventListener('dragleave', () => {
        box.style.borderColor = '#cbd5e1';
        box.style.background = '#f8fafc';
    });

    box.addEventListener('drop', (e) => {
        e.preventDefault();
        box.style.borderColor = '#cbd5e1';
        box.style.background = '#f8fafc';
        const file = e.dataTransfer.files && e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                const base64Url = evt.target.result;
                const input = document.getElementById('prod-img');
                const oldVal = input ? input.value : '';
                if (input) input.value = base64Url;
                previewShoeImage(base64Url);

                if (typeof currentEditingGallery !== 'undefined') {
                    if (currentEditingGallery.length === 0) {
                        currentEditingGallery.push(base64Url);
                    } else if (currentEditingGallery[0] === oldVal) {
                        currentEditingGallery[0] = base64Url;
                    }
                    renderAdminGalleryStrip();
                }

                showToast(`Đã thả ảnh "${file.name}" vào sản phẩm!`, 'success');
            };
            reader.readAsDataURL(file);
        }
    });
}

let currentEditingGallery = [];

function renderAdminGalleryStrip() {
    const strip = document.getElementById('admin-gallery-strip');
    if (!strip) return;

    if (!currentEditingGallery || currentEditingGallery.length === 0) {
        strip.innerHTML = '<span style="font-size: 12px; color: var(--gray); font-style: italic;">Chưa có ảnh trong gallery. Ảnh chính ở trên sẽ được dùng làm ảnh đại diện duy nhất.</span>';
        return;
    }

    strip.innerHTML = currentEditingGallery.map((imgUrl, idx) => `
        <div class="admin-gallery-thumb-item" title="Ảnh góc chụp #${idx + 1}">
            <img src="${imgUrl}" alt="Gallery ${idx + 1}" onerror="this.src='./assets/images/products/sp001.jpg'">
            <button type="button" class="btn-remove-gallery" onclick="removeGalleryImage(${idx})" title="Xóa ảnh này khỏi bộ sưu tập">✕</button>
            <span class="badge-main-tag">${idx === 0 ? 'ẢNH 1' : 'ẢNH ' + (idx + 1)}</span>
        </div>
    `).join('');
}

function removeGalleryImage(idx) {
    if (idx >= 0 && idx < currentEditingGallery.length) {
        currentEditingGallery.splice(idx, 1);
        renderAdminGalleryStrip();
        showToast('Đã xóa 1 ảnh khỏi bộ sưu tập gallery!', 'info');
    }
}

function addImageToGallery(imgUrl) {
    if (!imgUrl) return;
    if (currentEditingGallery.includes(imgUrl)) {
        showToast('Ảnh này đã có trong bộ sưu tập!', 'warning');
        return;
    }
    currentEditingGallery.push(imgUrl);
    renderAdminGalleryStrip();
    showToast('Đã thêm 1 ảnh vào bộ sưu tập chi tiết!', 'success');
}

function handleGalleryFileUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast('Vui lòng chỉ chọn file hình ảnh (JPG, PNG, WebP)!', 'warning');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showToast('Dung lượng ảnh vượt quá 5MB. Vui lòng chọn ảnh nhẹ hơn!', 'warning');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        addImageToGallery(e.target.result);
        event.target.value = '';
    };
    reader.readAsDataURL(file);
}

function toggleGalleryPresetPicker() {
    const card = document.getElementById('gallery-preset-picker-card');
    if (!card) return;
    const isShowing = card.style.display !== 'none';
    card.style.display = isShowing ? 'none' : 'block';
    if (!isShowing) {
        renderGalleryPresetPicker();
    }
}

function renderGalleryPresetPicker() {
    const container = document.getElementById('gallery-preset-picker-items');
    if (!container) return;
    container.innerHTML = sampleShoeImages.map(item => `
        <div class="preset-item" onclick="addImageToGallery('${item.img}')" title="Thêm ${item.code} - ${item.name} vào gallery">
            <img src="${item.img}" alt="${item.name}">
            <span>${item.code}</span>
        </div>
    `).join('');
}

// ==========================================================
// 6. QUẢN LÝ SẢN PHẨM GIÀY (MỤC I.4)
// ==========================================================

let editingProductId = null;

function loadAdminProducts() {
    const table = document.getElementById('prod-table-body');
    if (!table || !window.SGU_CORE) return;
    const prods = SGU_CORE.getProducts();

    table.innerHTML = prods.map(p => `
        <tr>
            <td><img src="${p.img}" class="thumb" alt="${p.name}"></td>
            <td><strong>${p.id}</strong></td>
            <td><strong>${p.name}</strong></td>
            <td><span class="badge" style="background:#e0e7ff; color:#3730a3; font-weight:700;">${p.brand || 'Khác'}</span></td>
            <td>${p.category}</td>
            <td style="max-width:200px; font-size:13px; color:var(--gray);">${p.desc ? p.desc.substring(0, 55) + '...' : ''}</td>
            <td><span class="badge ${p.active ? 'badge-active' : 'badge-locked'}">${p.active ? 'Đang bán' : 'Đã ẩn'}</span></td>
            <td style="text-align: center; white-space: nowrap;">
                <button class="btn btn-warning" style="padding: 5px 10px; font-size: 12px;" onclick="openEditProductModal('${p.id}')" title="Chỉnh sửa thông tin">✏️ Sửa</button>
                <button class="btn ${p.active ? 'btn-outline' : 'btn-success'}" style="padding: 5px 10px; font-size: 12px; margin: 0 4px;" onclick="toggleHideProduct('${p.id}')" title="${p.active ? 'Tạm ẩn khỏi trang bán' : 'Bật hiển thị lại'}">
                    ${p.active ? '👁️ Ẩn' : '🔓 Bật'}
                </button>
                <button class="btn btn-danger" style="padding: 5px 10px; font-size: 12px;" onclick="deleteProduct('${p.id}')" title="Xóa vĩnh viễn khỏi hệ thống">🗑️ Xóa</button>
            </td>
        </tr>
    `).join('');
}

function handleBrandSelectChange(val) {
    const customInput = document.getElementById('prod-brand-custom');
    if (!customInput) return;
    if (val === 'custom') {
        customInput.style.display = 'block';
        customInput.focus();
    } else {
        customInput.style.display = 'none';
        customInput.value = '';
    }
}

function openAddProductModal() {
    editingProductId = null;
    document.getElementById('modal-prod-title').innerText = '➕ Thêm sản phẩm giày mới';
    const prods = SGU_CORE ? SGU_CORE.getProducts() : [];
    document.getElementById('prod-code').value = 'SP' + String(prods.length + 1).padStart(3, '0');
    document.getElementById('prod-code').readOnly = false;
    document.getElementById('prod-name').value = '';
    
    // Reset Brand
    const brandSelect = document.getElementById('prod-brand');
    const customBrandInput = document.getElementById('prod-brand-custom');
    if (brandSelect) brandSelect.value = 'Nike';
    if (customBrandInput) {
        customBrandInput.style.display = 'none';
        customBrandInput.value = '';
    }

    document.getElementById('prod-img').value = './assets/images/products/sp001.jpg';
    document.getElementById('prod-desc').value = '';
    previewShoeImage('./assets/images/products/sp001.jpg');

    currentEditingGallery = ['./assets/images/products/sp001.jpg'];
    renderAdminGalleryStrip();
    const galPicker = document.getElementById('gallery-preset-picker-card');
    if (galPicker) galPicker.style.display = 'none';

    const deleteBtn = document.getElementById('btn-modal-delete-prod');
    if (deleteBtn) deleteBtn.style.display = 'none';

    const galleryCard = document.getElementById('sample-gallery-card');
    if (galleryCard) galleryCard.style.display = 'none';

    document.getElementById('modal-product').style.display = 'flex';
}

function openEditProductModal(id) {
    editingProductId = id;
    const prods = SGU_CORE ? SGU_CORE.getProducts() : [];
    const p = prods.find(x => x.id === id);
    if (!p) return;

    const galleryCard = document.getElementById('sample-gallery-card');
    if (galleryCard) galleryCard.style.display = 'none';

    document.querySelectorAll('.preset-item').forEach(el => {
        const itemImg = el.querySelector('img');
        if (itemImg && itemImg.getAttribute('src') === p.img) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    document.getElementById('modal-prod-title').innerText = '✏️ Sửa thông tin sản phẩm: ' + p.id;
    document.getElementById('prod-code').value = p.id;
    document.getElementById('prod-code').readOnly = true;
    document.getElementById('prod-name').value = p.name;
    document.getElementById('prod-cat').value = p.category;

    const brandSelect = document.getElementById('prod-brand');
    const customBrandInput = document.getElementById('prod-brand-custom');
    const standardBrands = ['Nike', 'Adidas', 'Jordan', 'Puma', 'Clarks', 'Converse'];
    
    if (brandSelect) {
        if (standardBrands.includes(p.brand)) {
            brandSelect.value = p.brand;
            if (customBrandInput) {
                customBrandInput.style.display = 'none';
                customBrandInput.value = '';
            }
        } else {
            brandSelect.value = 'custom';
            if (customBrandInput) {
                customBrandInput.style.display = 'block';
                customBrandInput.value = p.brand || '';
            }
        }
    }

    document.getElementById('prod-img').value = p.img;
    document.getElementById('prod-desc').value = p.desc || '';
    previewShoeImage(p.img);

    if (p.gallery && Array.isArray(p.gallery) && p.gallery.length > 0) {
        currentEditingGallery = [...p.gallery];
    } else if (p.img) {
        currentEditingGallery = [p.img];
    } else {
        currentEditingGallery = [];
    }
    renderAdminGalleryStrip();
    const galPicker = document.getElementById('gallery-preset-picker-card');
    if (galPicker) galPicker.style.display = 'none';

    const deleteBtn = document.getElementById('btn-modal-delete-prod');
    if (deleteBtn) deleteBtn.style.display = 'inline-block';

    document.getElementById('modal-product').style.display = 'flex';
}

function saveProductModal() {
    const code = document.getElementById('prod-code').value.trim();
    const name = document.getElementById('prod-name').value.trim();
    const cat = document.getElementById('prod-cat').value;

    const brandSelect = document.getElementById('prod-brand') ? document.getElementById('prod-brand').value : 'Nike';
    const customBrand = document.getElementById('prod-brand-custom') ? document.getElementById('prod-brand-custom').value.trim() : '';
    const brand = (brandSelect === 'custom') ? (customBrand || 'Khác') : brandSelect;

    const img = document.getElementById('prod-img').value.trim();
    const desc = document.getElementById('prod-desc').value.trim();

    if (!code || !name) {
        showToast('Vui lòng nhập Mã và Tên sản phẩm giày!', 'warning');
        return;
    }

    if (!window.SGU_CORE) return;
    const prods = SGU_CORE.getProducts();
    const existing = prods.find(p => p.id === code);

    const finalGallery = (currentEditingGallery && currentEditingGallery.length > 0)
        ? [...currentEditingGallery]
        : (img ? [img] : []);

    if (existing) {
        existing.name = name;
        existing.brand = brand;
        existing.category = cat;
        existing.img = img;
        existing.gallery = finalGallery;
        existing.desc = desc;
    } else {
        prods.unshift({
            id: code,
            name: name,
            brand: brand,
            category: cat,
            catCode: cat.includes('Sneaker') ? 'LOAI01' : (cat.includes('Chạy') ? 'LOAI02' : (cat.includes('Đá') ? 'LOAI03' : 'LOAI04')),
            costPrice: 1500000,
            profitPercent: 35,
            price: 2025000,
            oldPrice: 2400000,
            stock: 15,
            stockInitial: 15,
            stockImport: 0,
            stockExport: 0,
            sizes: [38, 39, 40, 41, 42, 43],
            sizeStock: { 38: 2, 39: 3, 40: 4, 41: 3, 42: 2, 43: 1, 44: 0 },
            gallery: finalGallery,
            reviewsList: [],
            colors: ['Đen Phối Trắng', 'Trắng Tuyết'],
            tag: 'NEW',
            reviews: 0,
            rating: 5.0,
            desc: desc,
            img: img,
            active: true
        });
    }

    SGU_CORE.saveProducts(prods);
    loadAdminProducts();

    // Đồng bộ sang các module định giá & tồn kho (nếu đã nạp)
    if (typeof loadAdminPricing === 'function') loadAdminPricing();
    if (typeof loadAdminInventory === 'function') loadAdminInventory();
    updateAdminKPIs();

    closeModal('modal-product');
    showToast(`Đã lưu sản phẩm "${name}" (Thương hiệu: ${brand}) thành công!`, 'success');
}

function deleteProduct(id) {
    if (!window.SGU_CORE) return;
    const prods = SGU_CORE.getProducts();
    const p = prods.find(x => x.id === id);
    if (!p) return;

    if (confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN sản phẩm "${p.name}" (Mã: ${p.id}) khỏi hệ thống?\n\n⚠️ Thao tác này sẽ xóa sản phẩm khỏi kho và giao diện bán hàng.`)) {
        if (SGU_CORE.deleteProduct) {
            SGU_CORE.deleteProduct(id);
        } else {
            const newProds = prods.filter(x => x.id !== id);
            SGU_CORE.saveProducts(newProds);
        }
        loadAdminProducts();
        if (typeof loadAdminPricing === 'function') loadAdminPricing();
        if (typeof loadAdminInventory === 'function') loadAdminInventory();
        updateAdminKPIs();
        showToast(`Đã xóa vĩnh viễn sản phẩm "${p.name}"!`, 'danger');
    }
}

function deleteCurrentEditingProduct() {
    if (!editingProductId) return;
    const id = editingProductId;
    closeModal('modal-product');
    deleteProduct(id);
}

function toggleHideProduct(id) {
    if (!window.SGU_CORE) return;
    const prods = SGU_CORE.getProducts();
    const p = prods.find(x => x.id === id);
    if (p) {
        p.active = !p.active;
        SGU_CORE.saveProducts(prods);
        loadAdminProducts();
        updateAdminKPIs();
        showToast(`Đã ${p.active ? 'mở hiển thị' : 'ẩn'} sản phẩm ${p.name}!`, p.active ? 'success' : 'warning');
    }
}

// ==========================================================
// 7. KHỞI CHẠY CÁC MODULE DỮ LIỆU GỐC & KHÁCH HÀNG
// ==========================================================

function loadAdminMasterModules() {
    loadAdminUsers();
    loadAdminCategories();
    loadAdminProducts();
    renderSampleGallery();
    initImageDragAndDrop();
}

window.addEventListener('DOMContentLoaded', function() {
    checkAdminSession();
    loadAdminMasterModules();
    updateAdminKPIs();

    // Hỗ trợ chuyển tab qua URL Hash
    const hash = window.location.hash;
    if (hash === '#users') switchAdminTab('tab-users', document.getElementById('nav-users'));
    else if (hash === '#cats') switchAdminTab('tab-cats', document.getElementById('nav-cats'));
    else if (hash === '#prods') switchAdminTab('tab-prods', document.getElementById('nav-prods'));
});
