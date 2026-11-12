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
    const icon = type === 'success' ? '✅' : (type === 'info' ? 'ℹ️' : (type === 'danger' ? '❌' : '⚠️'));
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

// Danh sách tài khoản Quản trị hợp lệ
const VALID_ADMIN_ACCOUNTS = [
    { user: 'admin', pass: 'admin123' },
    { user: 'admin_sgu', pass: '123456' }
];

// Kiểm tra phiên làm việc Admin qua sessionStorage
function checkAdminSession() {
    const isAuth = sessionStorage.getItem('sgu_admin_auth') === 'true';
    const loginScreen = document.getElementById('admin-login-screen');
    if (!loginScreen) return;
    if (isAuth) {
        loginScreen.style.display = 'none';
    } else {
        loginScreen.style.display = 'flex';
        const userInput = document.getElementById('admin-user');
        if (userInput) setTimeout(() => userInput.focus(), 150);
    }
}

// Đăng nhập Admin riêng biệt (xác thực tài khoản & mật khẩu chính xác)
function loginAdmin() {
    const userInput = document.getElementById('admin-user');
    const passInput = document.getElementById('admin-pass');
    const user = userInput ? userInput.value.trim() : '';
    const pass = passInput ? passInput.value.trim() : '';

    if (!user && !pass) {
        showToast('Vui lòng nhập tài khoản và mật khẩu Quản trị!', 'warning');
        if (userInput) userInput.focus();
        return;
    }
    if (!user) {
        showToast('Vui lòng nhập tài khoản Quản trị!', 'warning');
        if (userInput) userInput.focus();
        return;
    }
    if (!pass) {
        showToast('Vui lòng nhập mật khẩu Quản trị!', 'warning');
        if (passInput) passInput.focus();
        return;
    }

    const isValid = VALID_ADMIN_ACCOUNTS.some(acc => acc.user === user && acc.pass === pass);
    if (!isValid) {
        showToast('Tài khoản hoặc mật khẩu Quản trị không chính xác!', 'danger');
        if (passInput) {
            passInput.value = '';
            passInput.focus();
        }
        return;
    }

    sessionStorage.setItem('sgu_admin_auth', 'true');
    const loginScreen = document.getElementById('admin-login-screen');
    if (loginScreen) loginScreen.style.display = 'none';

    // Xóa trắng ô nhập sau khi đăng nhập thành công
    if (userInput) userInput.value = '';
    if (passInput) passInput.value = '';

    showToast(`Đăng nhập Quản trị viên thành công! Xin chào ${user}.`, 'success');
}

// Đăng xuất Admin
function logoutAdmin() {
    sessionStorage.removeItem('sgu_admin_auth');
    const loginScreen = document.getElementById('admin-login-screen');
    if (loginScreen) {
        loginScreen.style.display = 'flex';
        const userInput = document.getElementById('admin-user');
        const passInput = document.getElementById('admin-pass');
        if (userInput) userInput.value = '';
        if (passInput) passInput.value = '';
        if (userInput) setTimeout(() => userInput.focus(), 150);
    }
    showToast('Đã đăng xuất khỏi tài khoản Quản trị!', 'warning');
}

// Khóa nhanh màn hình Admin (yêu cầu xác thực lại để tiếp tục)
function lockAdminScreen() {
    sessionStorage.removeItem('sgu_admin_auth');
    const loginScreen = document.getElementById('admin-login-screen');
    if (loginScreen) {
        loginScreen.style.display = 'flex';
        const passInput = document.getElementById('admin-pass');
        if (passInput) {
            passInput.value = '';
            setTimeout(() => passInput.focus(), 150);
        }
    }
    showToast('Đã khóa màn hình Quản trị viên! Vui lòng đăng nhập lại.', 'warning');
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

    if (tabId === "tab-users") {
        loadAdminUsers();
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

        // Đồng bộ nếu tài khoản này đang đăng nhập phiên hiện tại
        const cur = SGU_CORE.getCurrentUser();
        if (cur && (cur.id === userId || cur.email === u.email)) {
            cur.pass = '123456';
            SGU_CORE.setCurrentUser(cur);
        }

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
                    <button class="btn btn-warning" style="padding: 5px 10px; font-size: 12px;" onclick="editCategory('${c.code}', '${safeName}')">✏️ Sửa</button>
                    <button class="btn ${c.active ? 'btn-outline' : 'btn-success'}" style="padding: 5px 10px; font-size: 12px; margin: 0 4px;" onclick="toggleHideCategory('${c.code}')">${c.active ? '👁️ Ẩn' : '🔓 Bật'}</button>
                    <button class="btn btn-danger" style="padding: 5px 10px; font-size: 12px;" onclick="deleteCategory('${c.code}')">🗑️ Xóa</button>
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

function deleteCategory(code) {
    if (!window.SGU_CORE) return;
    const cats = SGU_CORE.getCategories();
    const c = cats.find(x => x.code === code);
    if (!c) return;

    if (cats.length <= 1) {
        showToast('Hệ thống phải có ít nhất 1 phân loại sản phẩm, không thể xóa hết!', 'warning');
        return;
    }

    const prods = SGU_CORE.getProducts();
    const affectedProds = prods.filter(p => p.catCode === c.code || p.category === c.name);
    const count = affectedProds.length;

    if (count > 0) {
        // Tìm phân loại thay thế để tiếp nhận sản phẩm, bảo toàn toàn vẹn dữ liệu
        const fallbackCat = cats.find(x => x.code !== code);
        const confirmMsg = `⚠️ CẢNH BÁO TOÀN VẸN DỮ LIỆU:\n` +
            `Phân loại "${c.name}" (${code}) hiện đang có ${count} sản phẩm giày.\n\n` +
            `Để tránh sản phẩm bị "MỒ CÔI" (mất danh mục), hệ thống sẽ tự động chuyển ${count} sản phẩm này sang phân loại "${fallbackCat.name}".\n\n` +
            `Bạn có đồng ý xóa phân loại này và chuyển sản phẩm không?`;

        if (!confirm(confirmMsg)) {
            return;
        }

        // Tự động chuyển toàn bộ sản phẩm con sang phân loại an toàn
        affectedProds.forEach(p => {
            p.category = fallbackCat.name;
            p.catCode = fallbackCat.code;
        });
        SGU_CORE.saveProducts(prods);
        if (typeof loadAdminProducts === 'function') loadAdminProducts();
        if (typeof loadAdminPricing === 'function') loadAdminPricing();
    } else {
        if (!confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn phân loại "${c.name}" (${code}) khỏi hệ thống không?`)) {
            return;
        }
    }

    const filtered = cats.filter(x => x.code !== code);
    SGU_CORE.saveCategories(filtered);
    loadAdminCategories();
    cancelCategoryEdit();
    showToast(`Đã xóa phân loại "${c.name}". ${count > 0 ? `Đã chuyển an toàn ${count} sản phẩm sang "${cats.find(x => x.code !== code).name}"!` : ''}`, 'success');
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
    if (!img) return;
    const cleanUrl = (url && typeof url === 'string') ? url.trim() : '';
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
        img.src = './assets/images/products/sp001.jpg';
        return;
    }
    if (cleanUrl !== '') {
        img.src = cleanUrl;
    } else {
        img.src = './assets/images/products/sp001.jpg';
    }
}

function onProductImageSelectChange(val) {
    const input = document.getElementById('prod-img');
    if (!input) return;
    if (val !== 'custom') {
        input.value = val;
        previewShoeImage(val);
    } else {
        input.focus();
        input.select();
    }
}

function handleProdImgInput(val) {
    const cleanVal = (val || '').trim();
    if (cleanVal.startsWith('http://') || cleanVal.startsWith('https://')) {
        showToast('Hệ thống chạy 100% Offline, không dùng ảnh mạng! Vui lòng bấm "Chọn ảnh từ máy tính" hoặc dùng ảnh nội bộ.', 'warning');
        const input = document.getElementById('prod-img');
        if (input) input.value = './assets/images/products/sp001.jpg';
        previewShoeImage('./assets/images/products/sp001.jpg');
        return;
    }
    previewShoeImage(cleanVal);
    const select = document.getElementById('prod-img-select');
    if (select) {
        const hasOpt = Array.from(select.options).some(opt => opt.value === cleanVal);
        select.value = hasOpt ? cleanVal : 'custom';
    }
}

function handleSimpleImageUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast('Vui lòng chỉ chọn file hình ảnh (JPG, PNG, WebP)!', 'warning');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const tempImg = new Image();
        tempImg.onload = function() {
            // Tối ưu kích thước ảnh (tối đa 600px, nén jpeg nhẹ ~40KB) để vừa cực nét vừa không lo đầy localStorage
            const canvas = document.createElement('canvas');
            const maxDim = 600;
            let width = tempImg.width;
            let height = tempImg.height;
            if (width > height) {
                if (width > maxDim) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                }
            } else {
                if (height > maxDim) {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(tempImg, 0, 0, width, height);
            const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.85);

            document.getElementById('prod-img').value = optimizedBase64;
            const select = document.getElementById('prod-img-select');
            if (select) select.value = 'custom';
            previewShoeImage(optimizedBase64);
            showToast(`Đã nạp ảnh "${file.name}" từ máy tính thành công!`, 'success');
        };
        tempImg.src = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

let currentEditingGallery = [];

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
            <td><strong style="color:var(--primary); font-size:14px;">${(window.SGU_CORE && SGU_CORE.formatVND) ? SGU_CORE.formatVND(p.price) : Number(p.price || 0).toLocaleString('vi-VN') + ' ₫'}</strong></td>
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

function updateProductCostPricePreview(val) {
    const el = document.getElementById('prod-costprice-preview');
    if (!el) return;
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) {
        el.innerText = '0 ₫';
    } else {
        el.innerText = (window.SGU_CORE && SGU_CORE.formatVND) ? SGU_CORE.formatVND(num) : Number(num).toLocaleString('vi-VN') + ' ₫';
    }
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

    // Reset Giá vốn sản phẩm
    const costPriceInput = document.getElementById('prod-cost-price');
    if (costPriceInput) costPriceInput.value = '1500000';
    updateProductCostPricePreview(1500000);

    // Reset Hình ảnh sản phẩm
    const defaultImg = './assets/images/products/sp001.jpg';
    document.getElementById('prod-img').value = defaultImg;
    const imgSelect = document.getElementById('prod-img-select');
    if (imgSelect) imgSelect.value = defaultImg;
    previewShoeImage(defaultImg);

    document.getElementById('prod-desc').value = '';

    const deleteBtn = document.getElementById('btn-modal-delete-prod');
    if (deleteBtn) deleteBtn.style.display = 'none';

    document.getElementById('modal-product').style.display = 'flex';
}

function openEditProductModal(id) {
    editingProductId = id;
    const prods = SGU_CORE ? SGU_CORE.getProducts() : [];
    const p = prods.find(x => x.id === id);
    if (!p) return;

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

    // Tải hình ảnh sản phẩm & gán vào select/input
    const shoeImg = p.img || './assets/images/products/sp001.jpg';
    document.getElementById('prod-img').value = shoeImg;
    const imgSelect = document.getElementById('prod-img-select');
    if (imgSelect) {
        const hasOpt = Array.from(imgSelect.options).some(opt => opt.value === shoeImg);
        imgSelect.value = hasOpt ? shoeImg : 'custom';
    }
    previewShoeImage(shoeImg);

    document.getElementById('prod-desc').value = p.desc || '';

    const deleteBtn = document.getElementById('btn-modal-delete-prod');
    if (deleteBtn) deleteBtn.style.display = 'inline-block';

    // Tải thông tin giá vốn
    const costPriceInput = document.getElementById('prod-cost-price');
    if (costPriceInput) costPriceInput.value = p.costPrice || 1500000;
    updateProductCostPricePreview(p.costPrice || 1500000);

    document.getElementById('modal-product').style.display = 'flex';
}

function saveProductModal() {
    const code = document.getElementById('prod-code').value.trim();
    const name = document.getElementById('prod-name').value.trim();
    const cat = document.getElementById('prod-cat').value;

    const brandSelect = document.getElementById('prod-brand') ? document.getElementById('prod-brand').value : 'Nike';
    const customBrand = document.getElementById('prod-brand-custom') ? document.getElementById('prod-brand-custom').value.trim() : '';
    const brand = (brandSelect === 'custom') ? (customBrand || 'Khác') : brandSelect;

    const costPriceInput = document.getElementById('prod-cost-price');
    const rawCost = costPriceInput ? parseFloat(costPriceInput.value) : NaN;
    if (isNaN(rawCost) || rawCost <= 0) {
        showToast('Vui lòng nhập giá vốn hợp lệ cho sản phẩm (lớn hơn 0)!', 'warning');
        if (costPriceInput) costPriceInput.focus();
        return;
    }
    const finalCostPrice = Math.round(rawCost);

    const img = document.getElementById('prod-img').value.trim() || './assets/images/products/sp001.jpg';
    if (img.startsWith('http://') || img.startsWith('https://')) {
        showToast('Hệ thống chạy 100% Offline! Vui lòng bấm "Chọn ảnh từ máy tính" hoặc chọn ảnh nội bộ, không dùng ảnh mạng.', 'warning');
        document.getElementById('prod-img').focus();
        return;
    }
    const desc = document.getElementById('prod-desc').value.trim();

    if (!code || !name) {
        showToast('Vui lòng nhập Mã và Tên sản phẩm giày!', 'warning');
        return;
    }

    if (!window.SGU_CORE) return;
    const prods = SGU_CORE.getProducts();
    const existing = prods.find(p => p.id === code);

    if (existing) {
        existing.name = name;
        existing.brand = brand;
        existing.category = cat;
        existing.costPrice = finalCostPrice;
        // Tính lại giá bán theo % lợi nhuận đã thiết lập cho sản phẩm này
        const profit = existing.profitPercent !== undefined ? existing.profitPercent : 35;
        existing.profitPercent = profit;
        existing.price = Math.round(finalCostPrice * (1 + profit / 100));
        existing.oldPrice = Math.round(existing.price * 1.15);
        existing.img = img;
        if (!existing.gallery || !Array.isArray(existing.gallery) || existing.gallery.length === 0) {
            existing.gallery = [img];
        } else {
            existing.gallery[0] = img;
        }
        existing.desc = desc;
    } else {
        const defaultProfit = 35;
        const finalPrice = Math.round(finalCostPrice * (1 + defaultProfit / 100));
        const finalOldPrice = Math.round(finalPrice * 1.15);

        prods.unshift({
            id: code,
            name: name,
            brand: brand,
            category: cat,
            catCode: cat.includes('Sneaker') ? 'LOAI01' : (cat.includes('Chạy') ? 'LOAI02' : (cat.includes('Đá') ? 'LOAI03' : 'LOAI04')),
            costPrice: finalCostPrice,
            profitPercent: defaultProfit,
            price: finalPrice,
            oldPrice: finalOldPrice,
            stock: 15,
            stockInitial: 15,
            stockImport: 0,
            stockExport: 0,
            sizes: [38, 39, 40, 41, 42, 43],
            sizeStock: { 38: 2, 39: 3, 40: 4, 41: 3, 42: 2, 43: 1, 44: 0 },
            gallery: [img],
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
    showToast(`Đã lưu sản phẩm "${name}" thành công với Giá vốn ${SGU_CORE.formatVND(finalCostPrice)}!`, 'success');
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

// Lắng nghe sự kiện storage để đồng bộ dữ liệu theo thời gian thực giữa các tab (Storefront <-> Admin)
window.addEventListener('storage', function (e) {
    if (e.key === 'sgu_users') {
        loadAdminUsers();
    }
    if (e.key === 'sgu_orders') {
        if (typeof loadAdminOrders === 'function') loadAdminOrders();
        updateAdminKPIs();
    }
    if (e.key === 'sgu_products') {
        loadAdminProducts();
        updateAdminKPIs();
    }
});

// Tự động tải lại dữ liệu khi người dùng chuyển tab quay lại trang Admin
window.addEventListener('focus', function () {
    loadAdminUsers();
    updateAdminKPIs();
});
