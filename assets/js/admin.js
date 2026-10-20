/**
 * SGU SNEAKER - JAVASCRIPT QUẢN TRỊ ADMIN (ADMIN MODULES LOGIC)
 * Học phần: Lập trình Web và Ứng dụng - Đại học Sài Gòn (SGU)
 * Thành viên 4 phụ trách - Barem I.1 -> I.8
 */

// HỆ THỐNG THÔNG BÁO TOAST
function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✅' : '⚠️'}</span> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// TÌM KIẾM TỨC THÌ TRÊN BẢNG (SEARCH AS YOU TYPE)
function filterTableAsYouType(input, tableBodyId) {
    const query = input.value.toLowerCase().trim();
    const rows = document.querySelectorAll('#' + tableBodyId + ' tr');
    rows.forEach(r => {
        const text = r.innerText.toLowerCase();
        r.style.display = text.includes(query) ? '' : 'none';
    });
}

// XEM TRƯỚC HÌNH ẢNH SẢN PHẨM TRỰC TIẾP TRONG FORM
function previewShoeImage(url) {
    const img = document.getElementById('img-preview-thumb');
    const placeholder = document.getElementById('preview-placeholder');
    if (!img || !placeholder) return;
    if (url && (url.startsWith('http') || url.startsWith('./') || url.startsWith('assets/'))) {
        img.src = url;
        img.style.display = 'block';
        placeholder.style.display = 'none';
    } else {
        img.style.display = 'none';
        placeholder.style.display = 'block';
    }
}

// THAO TÁC NHANH: TẠO PHIẾU NHẬP HÀNG TỪ CẢNH BÁO TỒN KHO
function quickImportProduct(prodName, qty) {
    switchAdminTab('tab-imports', document.getElementById('nav-imports'));
    openImportModal('new');
    const selects = document.querySelectorAll('#modal-import select');
    if (selects.length > 0) {
        for (let opt of selects[0].options) {
            if (opt.text.includes(prodName.split(' - ')[0])) {
                opt.selected = true;
                break;
            }
        }
    }
    const qtyInputs = document.querySelectorAll('#modal-import input[type="number"]');
    if (qtyInputs.length >= 2) {
        qtyInputs[1].value = qty;
    }
    showToast(`Đã nạp sẵn sản phẩm "${prodName}" vào phiếu nhập (+${qty} đôi)!`, 'success');
}

// IN HÓA ĐƠN ĐƠN HÀNG
function printInvoice() {
    window.print();
}

// ĐỒNG BỘ PHIÊN ĐĂNG NHẬP BẰNG SESSIONSTORAGE (KHÔNG BAO GIỜ BỊ HỎI LẠI TRỪ KHI ĐĂNG XUẤT)
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

function logoutAdmin() {
    sessionStorage.removeItem('sgu_admin_auth');
    const loginScreen = document.getElementById('admin-login-screen');
    if (loginScreen) loginScreen.style.display = 'flex';
    showToast('Đã đăng xuất khỏi tài khoản Quản trị!', 'warning');
}

function lockAdminScreen() {
    const loginScreen = document.getElementById('admin-login-screen');
    if (loginScreen) loginScreen.style.display = 'flex';
    showToast('Đã khóa màn hình Quản trị viên!', 'warning');
}

// CHUYỂN TAB TRỰC TIẾP TRONG 1 TRANG DUY NHẤT
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

window.addEventListener('DOMContentLoaded', function() {
    checkAdminSession();
    loadAllAdminModules();

    // Đọc Hash từ URL nếu người dùng bookmark hoặc mở link trực tiếp
    const hash = window.location.hash;
    if (hash === '#cats') switchAdminTab('tab-cats', document.getElementById('nav-cats'));
    else if (hash === '#prods') switchAdminTab('tab-prods', document.getElementById('nav-prods'));
    else if (hash === '#imports') switchAdminTab('tab-imports', document.getElementById('nav-imports'));
    else if (hash === '#pricing') switchAdminTab('tab-pricing', document.getElementById('nav-pricing'));
    else if (hash === '#orders') switchAdminTab('tab-orders', document.getElementById('nav-orders'));
    else if (hash === '#inventory') switchAdminTab('tab-inventory', document.getElementById('nav-inventory'));
});

function loadAllAdminModules() {
    loadAdminUsers();
    loadAdminCategories();
    loadAdminProducts();
    loadAdminImports();
    loadAdminPricing();
    loadAdminOrders();
    loadAdminInventory();
}

// ==========================================================
// 1. QUẢN LÝ KHÁCH HÀNG (MỤC I.2)
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

    // Nếu tài khoản đang được lưu làm sgu_user hiện tại, cập nhật ngay lập tức
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
// 2. QUẢN LÝ LOẠI GIÀY (MỤC I.3)
// ==========================================================
function loadAdminCategories() {
    const table = document.getElementById('cat-table-body');
    if (!table || !window.SGU_CORE) return;
    const cats = SGU_CORE.getCategories();
    const prods = SGU_CORE.getProducts();

    table.innerHTML = cats.map(c => {
        const count = prods.filter(p => p.catCode === c.code || p.category === c.name).length;
        return `
            <tr>
                <td><strong>${c.code}</strong></td>
                <td class="cat-name">${c.name}</td>
                <td>${count} sản phẩm</td>
                <td><span class="badge ${c.active ? 'badge-active' : 'badge-locked'}">${c.active ? 'Đang hiển thị' : 'Tạm ẩn'}</span></td>
                <td>
                    <button class="btn btn-warning" onclick="editCategory('${c.code}', '${c.name}')">✏️ Sửa</button>
                    <button class="btn btn-danger" onclick="toggleHideCategory('${c.code}')">${c.active ? '👁️ Ẩn / Xóa' : '🔓 Hiển thị'}</button>
                </td>
            </tr>
        `;
    }).join('');
}

function editCategory(code, name) {
    document.getElementById('cat-code').value = code;
    document.getElementById('cat-name').value = name;
    showToast(`Đã tải dữ liệu loại "${name}" lên form chỉnh sửa!`, 'success');
}

function saveCategory() {
    const code = document.getElementById('cat-code').value.trim();
    const name = document.getElementById('cat-name').value.trim();
    if (!code || !name) {
        showToast('Vui lòng nhập đầy đủ Mã loại và Tên loại giày!', 'warning');
        return;
    }

    if (!window.SGU_CORE) return;
    const cats = SGU_CORE.getCategories();
    const existing = cats.find(c => c.code.toLowerCase() === code.toLowerCase());
    if (existing) {
        existing.name = name;
    } else {
        cats.push({ code: code, name: name, count: 0, active: true });
    }

    SGU_CORE.saveCategories(cats);
    loadAdminCategories();
    showToast(`Đã lưu thành công loại giày: ${code} - ${name}!`, 'success');
    document.getElementById('cat-code').value = '';
    document.getElementById('cat-name').value = '';
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
// 3. QUẢN LÝ SẢN PHẨM GIÀY (MỤC I.4)
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
            <td>${p.category}</td>
            <td style="max-width:240px; font-size:13px;">${p.desc ? p.desc.substring(0, 65) + '...' : ''}</td>
            <td><span class="badge ${p.active ? 'badge-active' : 'badge-locked'}">${p.active ? 'Đang bán' : 'Đã ẩn'}</span></td>
            <td>
                <button class="btn btn-warning" onclick="openEditProductModal('${p.id}')">✏️ Sửa</button>
                <button class="btn btn-danger" onclick="toggleHideProduct('${p.id}')">${p.active ? '🗑️ Ẩn' : '🔓 Bật'}</button>
            </td>
        </tr>
    `).join('');
}

function openAddProductModal() {
    editingProductId = null;
    document.getElementById('modal-prod-title').innerText = '➕ Thêm sản phẩm giày mới';
    const prods = SGU_CORE ? SGU_CORE.getProducts() : [];
    document.getElementById('prod-code').value = 'SP' + String(prods.length + 1).padStart(3, '0');
    document.getElementById('prod-code').readOnly = false;
    document.getElementById('prod-name').value = '';
    document.getElementById('prod-img').value = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80';
    document.getElementById('prod-desc').value = '';
    previewShoeImage('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80');
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
    document.getElementById('prod-img').value = p.img;
    document.getElementById('prod-desc').value = p.desc || '';
    previewShoeImage(p.img);
    document.getElementById('modal-product').style.display = 'flex';
}

function saveProductModal() {
    const code = document.getElementById('prod-code').value.trim();
    const name = document.getElementById('prod-name').value.trim();
    const cat = document.getElementById('prod-cat').value;
    const img = document.getElementById('prod-img').value.trim();
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
        existing.category = cat;
        existing.img = img;
        existing.desc = desc;
    } else {
        prods.unshift({
            id: code,
            name: name,
            brand: cat.includes('Sneaker') ? 'Nike' : (cat.includes('Chạy') ? 'Adidas' : 'SGU'),
            category: cat,
            catCode: 'LOAI01',
            costPrice: 1500000,
            profitPercent: 35,
            price: 2025000,
            oldPrice: 2400000,
            stock: 15,
            stockInitial: 15,
            stockImport: 0,
            stockExport: 0,
            sizes: [38, 39, 40, 41, 42, 43],
            colors: ['Đen Phối Trắng', 'Trắng Tuyết'],
            tag: 'NEW',
            reviews: 10,
            rating: 5.0,
            desc: desc,
            img: img,
            active: true
        });
    }

    SGU_CORE.saveProducts(prods);
    loadAdminProducts();
    loadAdminPricing();
    loadAdminInventory();
    closeModal('modal-product');
    showToast(`Đã lưu thông tin sản phẩm "${name}" thành công!`, 'success');
}

function toggleHideProduct(id) {
    if (!window.SGU_CORE) return;
    const prods = SGU_CORE.getProducts();
    const p = prods.find(x => x.id === id);
    if (p) {
        p.active = !p.active;
        SGU_CORE.saveProducts(prods);
        loadAdminProducts();
        showToast(`Đã ${p.active ? 'mở hiển thị' : 'ẩn'} sản phẩm ${p.name}!`, p.active ? 'success' : 'warning');
    }
}

// ==========================================================
// 4. QUẢN LÝ NHẬP HÀNG (MỤC I.5)
// ==========================================================
function loadAdminImports() {
    const table = document.getElementById('imports-table-body');
    if (!table || !window.SGU_CORE) return;
    const imports = SGU_CORE.getImports();

    table.innerHTML = imports.map(imp => `
        <tr id="imp-row-${imp.id}">
            <td><strong>${imp.id}</strong></td>
            <td>${imp.date}</td>
            <td>${imp.items}</td>
            <td><strong style="color:var(--primary);">${imp.total}</strong></td>
            <td><span class="badge ${imp.status === 'Đã hoàn thành' ? 'badge-done' : 'badge-pending'}" id="imp-status-${imp.id}">${imp.status}</span></td>
            <td id="imp-actions-${imp.id}">
                ${imp.canEdit ? `
                    <button class="btn btn-warning" onclick="openImportModal('edit', '${imp.id}')">✏️ Sửa phiếu</button>
                    <button class="btn btn-success" onclick="completeImport('${imp.id}')">✅ Hoàn thành</button>
                ` : `
                    <button class="btn btn-disabled" disabled title="Phiếu đã hoàn thành không thể sửa">🔒 Đã khóa sửa</button>
                `}
            </td>
        </tr>
    `).join('');
}

let editingImportId = null;

function openImportModal(mode, id) {
    editingImportId = (mode === 'edit') ? id : null;
    document.getElementById('imp-edit-id').value = editingImportId || '';
    document.getElementById('modal-imp-title').innerText = (mode === 'edit') 
        ? `✏️ Sửa Phiếu Nhập ${id} (Chưa hoàn thành)` 
        : '➕ Thêm Phiếu Nhập Hàng Mới';

    // Đổ danh sách sản phẩm giày vào thẻ select
    const select = document.getElementById('imp-prod-select');
    if (select && window.SGU_CORE) {
        const prods = SGU_CORE.getProducts();
        select.innerHTML = prods.map(p => `<option value="${p.id}">${p.id} - ${p.name}</option>`).join('');
    }

    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('imp-date');
    const priceInput = document.getElementById('imp-price');
    const qtyInput = document.getElementById('imp-qty');

    if (mode === 'edit' && id && window.SGU_CORE) {
        const imports = SGU_CORE.getImports();
        const found = imports.find(x => x.id === id);
        if (found) {
            if (dateInput) dateInput.value = found.date || today;
            if (priceInput) priceInput.value = found.unitCost || 1800000;
            if (qtyInput) qtyInput.value = found.qty || 10;
            if (select && found.prodId) select.value = found.prodId;
        }
    } else {
        if (dateInput) dateInput.value = today;
        if (priceInput) priceInput.value = 1800000;
        if (qtyInput) qtyInput.value = 10;
    }

    document.getElementById('modal-import').style.display = 'flex';
}

function saveImportModal() {
    if (!window.SGU_CORE) return;
    const imports = SGU_CORE.getImports();
    const dateVal = document.getElementById('imp-date').value || new Date().toISOString().split('T')[0];
    const prodSelect = document.getElementById('imp-prod-select');
    const prodId = prodSelect ? prodSelect.value : 'SP001';
    const prods = SGU_CORE.getProducts();
    const prod = prods.find(p => p.id === prodId) || prods[0];
    const price = parseInt(document.getElementById('imp-price').value) || 1800000;
    const qty = parseInt(document.getElementById('imp-qty').value) || 10;
    const total = price * qty;
    const totalStr = SGU_CORE.formatVND(total);

    if (editingImportId) {
        const target = imports.find(x => x.id === editingImportId);
        if (target) {
            target.date = dateVal;
            target.items = `${prod ? prod.name : 'Giày Sneaker'} (x${qty})`;
            target.total = totalStr;
            target.unitCost = price;
            target.qty = qty;
            target.prodId = prodId;
        }
        showToast(`Đã cập nhật thành công phiếu nhập ${editingImportId}!`, 'success');
    } else {
        const newId = 'PN' + String(imports.length + 1).padStart(3, '0');
        imports.unshift({
            id: newId,
            date: dateVal,
            items: `${prod ? prod.name : 'Giày Sneaker'} (x${qty})`,
            total: totalStr,
            status: 'Chưa hoàn thành',
            canEdit: true,
            unitCost: price,
            qty: qty,
            prodId: prodId
        });
        showToast(`Đã tạo mới phiếu nhập ${newId} ở trạng thái Chưa hoàn thành!`, 'success');
    }

    SGU_CORE.saveImports(imports);
    loadAdminImports();
    closeModal('modal-import');
}

function completeImport(id) {
    if (!confirm('Sau khi Hoàn thành phiếu nhập, bạn sẽ KHÔNG THỂ sửa phiếu này nữa và số lượng sẽ được cộng vào kho. Xác nhận hoàn thành?')) {
        return;
    }

    if (!window.SGU_CORE) return;
    const imports = SGU_CORE.getImports();
    const imp = imports.find(x => x.id === id);
    if (!imp) return;

    imp.status = 'Đã hoàn thành';
    imp.canEdit = false;
    SGU_CORE.saveImports(imports);

    // Tự động cộng tồn kho vào sản phẩm
    const prods = SGU_CORE.getProducts();
    const targetProd = imp.prodId ? prods.find(p => p.id === imp.prodId) : prods[0];
    const addQty = imp.qty || 10;
    if (targetProd) {
        targetProd.stock = (targetProd.stock || 0) + addQty;
        targetProd.stockImport = (targetProd.stockImport || 0) + addQty;
        SGU_CORE.saveProducts(prods);
    }

    loadAdminImports();
    loadAdminInventory();
    showToast(`Đã hoàn thành phiếu nhập ${id}, khóa tính năng sửa và cộng tồn kho thành công!`, 'success');
}

// ==========================================================
// 5. THIẾT LẬP GIÁ BÁN & LỢI NHUẬN (MỤC I.6)
// ==========================================================
function loadAdminPricing() {
    const table = document.getElementById('pricing-table-body');
    if (!table || !window.SGU_CORE) return;
    const prods = SGU_CORE.getProducts();

    table.innerHTML = prods.map(p => {
        const cost = p.costPrice || 1500000;
        const profit = p.profitPercent || 35;
        return `
            <tr>
                <td><strong>${p.id}</strong></td>
                <td><strong>${p.name}</strong></td>
                <td>${p.category}</td>
                <td>${SGU_CORE.formatVND(cost)}</td>
                <td>
                    <input type="number" id="profit-val-${p.id}" class="form-control" value="${profit}" style="width:85px; display:inline-block;" oninput="calcPrice(this, ${cost}, 'sell-${p.id}')"> %
                </td>
                <td><strong style="color:var(--primary); font-size:16px;" id="sell-${p.id}">${SGU_CORE.formatVND(p.price)}</strong></td>
                <td><button class="btn btn-primary" onclick="savePricing('${p.id}')">Lưu</button></td>
            </tr>
        `;
    }).join('');
}

function calcPrice(input, cost, targetId) {
    const percent = parseFloat(input.value) || 0;
    const sellPrice = Math.round(cost * (1 + percent / 100));
    const target = document.getElementById(targetId);
    if (target && window.SGU_CORE) {
        target.innerText = SGU_CORE.formatVND(sellPrice);
    }
}

function savePricing(prodId) {
    if (!window.SGU_CORE) return;
    const prods = SGU_CORE.getProducts();
    const p = prods.find(x => x.id === prodId);
    if (!p) return;

    const input = document.getElementById(`profit-val-${p.id}`);
    const percent = parseFloat(input ? input.value : p.profitPercent) || 0;
    const cost = p.costPrice || 1500000;
    const newPrice = Math.round(cost * (1 + percent / 100));

    p.profitPercent = percent;
    p.price = newPrice;
    SGU_CORE.saveProducts(prods);

    showToast(`Đã lưu giá bán mới cho ${p.id} (${p.name}): ${SGU_CORE.formatVND(newPrice)}!`, 'success');
}

function applyBulkProfit() {
    const cat = document.getElementById('bulk-cat-select').value;
    const percent = parseFloat(document.getElementById('bulk-percent-input').value) || 30;

    if (!window.SGU_CORE) return;
    const prods = SGU_CORE.getProducts();
    let count = 0;

    prods.forEach(p => {
        if (cat === 'ALL' || p.category === cat) {
            p.profitPercent = percent;
            p.price = Math.round((p.costPrice || 1500000) * (1 + percent / 100));
            count++;
        }
    });

    SGU_CORE.saveProducts(prods);
    loadAdminPricing();
    loadAdminProducts();
    showToast(`Đã cập nhật tỉ lệ lợi nhuận ${percent}% cho ${count} sản phẩm thuộc loại "${cat}"!`, 'success');
}

// ==========================================================
// 6. QUẢN LÝ ĐƠN HÀNG (MỤC I.7)
// ==========================================================
function loadAdminOrders() {
    const table = document.getElementById('admin-orders-table');
    if (!table || !window.SGU_CORE) return;
    const orders = SGU_CORE.getOrders();

    table.innerHTML = orders.map((ord, idx) => `
        <tr data-status="${ord.status}">
            <td><strong>${ord.id}</strong></td>
            <td><strong>${ord.cust || 'Nguyễn Văn A'}</strong></td>
            <td>${ord.date}</td>
            <td><strong style="color:var(--primary);">${ord.total}</strong></td>
            <td><span class="badge ${getBadgeClass(ord.status)}" id="adm-badge-${idx}">${ord.status}</span></td>
            <td>
                <select class="form-control" style="display:inline-block; width:135px;" onchange="changeOrderStatus(this, ${idx})">
                    <option value="Mới đặt" ${ord.status === 'Mới đặt' ? 'selected' : ''}>Mới đặt</option>
                    <option value="Đã xử lý" ${ord.status === 'Đã xử lý' ? 'selected' : ''}>Đã xử lý</option>
                    <option value="Đã giao" ${ord.status === 'Đã giao' ? 'selected' : ''}>Đã giao</option>
                    <option value="Hủy" ${ord.status === 'Hủy' ? 'selected' : ''}>Hủy</option>
                </select>
                <button class="btn btn-dark" style="margin-left:6px;" onclick="viewOrderDetail(${idx})">👁️ Chi tiết</button>
            </td>
        </tr>
    `).join('');
}

function getBadgeClass(status) {
    if (status === 'Đã giao') return 'badge-done';
    if (status === 'Hủy') return 'badge-danger';
    if (status === 'Đã xử lý') return 'badge-pending';
    return 'badge-info';
}

function changeOrderStatus(selectEl, idx) {
    if (!window.SGU_CORE) return;
    const orders = SGU_CORE.getOrders();
    const val = selectEl.value;
    orders[idx].status = val;
    SGU_CORE.saveOrders(orders);

    const badge = document.getElementById('adm-badge-' + idx);
    if (badge) {
        badge.innerText = val;
        badge.className = 'badge ' + getBadgeClass(val);
    }
    selectEl.closest('tr').dataset.status = val;
    showToast(`Đã cập nhật đơn ${orders[idx].id} thành "${val}"!`, 'success');
}

function filterAdminOrders() {
    const filter = document.getElementById('order-filter-status').value;
    document.querySelectorAll('#admin-orders-table tr').forEach(row => {
        row.style.display = (filter === 'ALL' || row.dataset.status === filter) ? '' : 'none';
    });
}

function viewOrderDetail(idx) {
    if (!window.SGU_CORE) return;
    const orders = SGU_CORE.getOrders();
    const ord = orders[idx];
    if (!ord) return;

    document.getElementById('ord-detail-id').innerText = ord.id;
    document.getElementById('ord-detail-cust').innerText = ord.cust || 'Nguyễn Văn A';
    document.getElementById('ord-detail-addr').innerText = ord.address || '273 An Dương Vương, Q.5, TP.HCM';
    document.getElementById('ord-detail-total').innerText = ord.total;

    const itemsTbody = document.getElementById('ord-detail-items');
    if (ord.itemsList && ord.itemsList.length > 0) {
        itemsTbody.innerHTML = ord.itemsList.map(item => `
            <tr>
                <td><strong>${item.name}</strong> (Size ${item.size || 40})</td>
                <td>${Number(item.price).toLocaleString('vi-VN')} ₫</td>
                <td>${item.qty}</td>
                <td><strong>${(Number(item.price) * Number(item.qty)).toLocaleString('vi-VN')} ₫</strong></td>
            </tr>
        `).join('');
    } else {
        itemsTbody.innerHTML = `
            <tr>
                <td colspan="4">${ord.items}</td>
            </tr>
        `;
    }

    document.getElementById('modal-order-detail').style.display = 'flex';
}

// ==========================================================
// 7. BÁO CÁO TỒN KHO & CẢNH BÁO TỒN THẤP (MỤC I.8)
// ==========================================================
function loadAdminInventory() {
    const table = document.getElementById('inventory-table-body');
    if (!table || !window.SGU_CORE) return;
    const prods = SGU_CORE.getProducts();

    table.innerHTML = prods.map(p => {
        const isCritical = p.stock < 5;
        return `
            <tr style="${isCritical ? 'background: #fff1f2;' : ''}">
                <td><strong>${p.id}</strong></td>
                <td><strong>${p.name}</strong></td>
                <td>${p.category}</td>
                <td>${p.stockInitial || 10}</td>
                <td style="color:#10b981; font-weight:700;">+${p.stockImport || 0}</td>
                <td style="color:#e11d48; font-weight:700;">-${p.stockExport || 0}</td>
                <td><strong style="${isCritical ? 'color:var(--primary); font-size:16px;' : ''}">${p.stock} đôi</strong></td>
                <td>
                    ${isCritical ? `
                        <span class="badge badge-danger">⚠️ Tồn kho nguy cấp</span>
                        <button class="btn btn-warning" style="padding:4px 8px; font-size:11px; margin-left:6px;" onclick="quickImportProduct('${p.name}', 20)">+ Nhập hàng</button>
                    ` : `
                        <span class="badge badge-done">Đủ hàng</span>
                    `}
                </td>
            </tr>
        `;
    }).join('');
}

function closeModal(id) { 
    const el = document.getElementById(id);
    if (el) el.style.display = 'none'; 
}
