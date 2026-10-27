/**
 * SGU SNEAKER - LOGIC GIỎ HÀNG, ĐẶT HÀNG & LỊCH SỬ ĐƠN (CART PAGE)
 * Thành viên 3 - Barem II.3 & II.4
 */

// DỮ LIỆU ĐỒNG BỘ QUA SGU_CORE (SHARED DATA CORE)
let currentUser = null;
let cartItems = [];
let allOrders = [];

window.addEventListener('DOMContentLoaded', () => {
    initUserData();
    loadCartData();
    loadOrdersData();
});

function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : (type === 'warning' ? '⚠️' : '❌');
    toast.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function initUserData() {
    if (window.SGU_CORE && SGU_CORE.getCurrentUser) {
        currentUser = SGU_CORE.getCurrentUser();
    } else {
        currentUser = JSON.parse(localStorage.getItem('sgu_user'));
    }

    const usernameEl = document.getElementById('cart-username');
    const histNameEl = document.getElementById('user-history-name');
    const addrDefaultEl = document.getElementById('addr-default-text');
    const logoutBtn = document.getElementById('cart-logout-btn');
    const loginBtn = document.getElementById('cart-login-btn');

    if (!currentUser) {
        if (usernameEl) usernameEl.innerText = 'Khách (Chưa đăng nhập)';
        if (histNameEl) histNameEl.innerText = 'Khách vãng lai';
        if (addrDefaultEl) {
            addrDefaultEl.innerHTML = `
                <em>Chưa có thông tin mặc định. Vui lòng chọn "Nhập địa chỉ mới" bên dưới hoặc đăng nhập tại Trang Chủ.</em>
            `;
        }
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'inline-flex';
        selectAddressMode('new');
        return;
    }

    if (usernameEl) usernameEl.innerText = currentUser.name;
    if (histNameEl) histNameEl.innerText = currentUser.name;
    if (addrDefaultEl) {
        addrDefaultEl.innerHTML = `
            ${currentUser.name} • ${currentUser.phone || '0909123456'}<br>
            ${currentUser.address || '273 An Dương Vương, Q.5, TP.HCM'}
        `;
    }

    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (loginBtn) loginBtn.style.display = 'none';
}

function handleCartLogout() {
    if (window.SGU_CORE && SGU_CORE.setCurrentUser) {
        SGU_CORE.setCurrentUser(null);
    } else {
        localStorage.removeItem('sgu_user');
        localStorage.setItem('sgu_cart', JSON.stringify([]));
    }
    showToast('Đã đăng xuất tài khoản! Đang chuyển về Trang Chủ...', 'warning');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function loadCartData() {
    if (window.SGU_CORE && SGU_CORE.getCart) {
        cartItems = SGU_CORE.getCart();
    } else {
        cartItems = JSON.parse(localStorage.getItem('sgu_cart')) || [];
    }
    renderCartList();
}

function loadOrdersData() {
    if (window.SGU_CORE && SGU_CORE.getOrders) {
        allOrders = SGU_CORE.getOrders();
    } else {
        allOrders = JSON.parse(localStorage.getItem('sgu_orders')) || [];
    }
    renderOrderHistory(allOrders);
}

function switchCheckoutTab(tabId, btn) {
    document.querySelectorAll('.tab-pane').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.step-btn').forEach(b => b.classList.remove('active'));
    const target = document.getElementById(tabId);
    if (target) target.style.display = 'block';
    if (btn) btn.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================================
// 1. RENDER & QUẢN LÝ SẢN PHẨM TRONG GIỎ HÀNG (MỤC II.3)
// ==========================================================
function renderCartList() {
    const container = document.getElementById('cart-items-list');
    if (!container) return;

    if (cartItems.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 48px 20px; background: #f8fafc; border-radius: var(--radius-md); border: 1px dashed var(--border);">
                <div style="font-size: 52px; margin-bottom: 12px;">🛒👟</div>
                <h4 style="font-size: 18px; margin-bottom: 6px; font-weight:800; color: var(--secondary);">Giỏ hàng của bạn đang trống!</h4>
                <p style="color: var(--gray); font-size: 14px; margin-bottom: 22px;">Hãy khám phá các mẫu Sneaker & Running mới nhất để thêm vào giỏ.</p>
                <a href="index.html" class="btn-primary" style="display:inline-flex; align-items:center; gap:8px; padding:11px 26px; font-size:14.5px;">← Khám phá cửa hàng ngay</a>
            </div>
        `;
        calculateTotal();
        return;
    }

    container.innerHTML = cartItems.map((item, idx) => `
        <div class="cart-item">
            <div class="cart-item-img">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div style="flex: 1; min-width: 0;">
                <div class="item-name">${item.name}</div>
                <div class="item-meta">
                    <span>Mã: <strong>${item.code}</strong></span>
                    <span>|</span>
                    <label style="font-weight:600; color:var(--gray); font-size:12.5px;">Size:</label>
                    <select class="cart-size-select" onchange="changeCartItemSize(${idx}, this.value)" title="Đổi kích cỡ giày">
                        ${generateSizeOptions(item.code, item.size || 40)}
                    </select>
                </div>
                <div class="item-price">${(window.SGU_CORE && SGU_CORE.formatVND) ? SGU_CORE.formatVND(item.price) : Number(item.price).toLocaleString('vi-VN') + ' ₫'}</div>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="changeQty(${idx}, -1)" title="Giảm 1">-</button>
                <input type="text" class="qty-input" value="${item.qty}" readonly>
                <button class="qty-btn" onclick="changeQty(${idx}, 1)" title="Tăng 1">+</button>
                <button class="btn-remove" onclick="removeCartItem(${idx})" title="Xóa khỏi giỏ">Xóa</button>
            </div>
        </div>
    `).join('');

    calculateTotal();
}

function generateSizeOptions(prodCode, currentSize) {
    const prod = (window.SGU_CORE && SGU_CORE.getProductById) ? SGU_CORE.getProductById(prodCode) : null;
    const sizes = (prod && prod.sizes && prod.sizes.length > 0) ? prod.sizes : [38, 39, 40, 41, 42, 43, 44];
    const sizeStock = (prod && prod.sizeStock) ? prod.sizeStock : {};

    return sizes.map(s => {
        const inStock = sizeStock[s] !== undefined ? sizeStock[s] > 0 : true;
        const isSelected = Number(s) === Number(currentSize);
        return `
            <option value="${s}" ${isSelected ? 'selected' : ''}>
                Size ${s} ${(!inStock && !isSelected) ? '(Hết)' : ''}
            </option>
        `;
    }).join('');
}

function changeCartItemSize(index, newSize) {
    const numSize = parseInt(newSize);
    if (window.SGU_CORE && SGU_CORE.updateCartItemSize) {
        SGU_CORE.updateCartItemSize(index, numSize);
        cartItems = SGU_CORE.getCart();
    } else {
        if (cartItems[index]) {
            cartItems[index].size = numSize;
            saveCartState();
        }
    }
    renderCartList();
    showToast(`Đã chuyển sản phẩm sang Size ${numSize}!`, 'success');
}

function changeQty(index, change) {
    if (!cartItems[index]) return;

    if (change > 0) {
        const item = cartItems[index];
        const prod = (window.SGU_CORE && SGU_CORE.getProductById) ? SGU_CORE.getProductById(item.code || item.id) : null;
        if (prod) {
            const sizeStock = prod.sizeStock || {};
            const avail = sizeStock[item.size] !== undefined ? sizeStock[item.size] : prod.stock;
            if (item.qty + change > avail) {
                showToast(`Kho chỉ còn tối đa ${avail} sản phẩm cho Size ${item.size}!`, 'warning');
                return;
            }
        }
    }

    cartItems[index].qty += change;
    if (cartItems[index].qty <= 0) {
        removeCartItem(index);
        return;
    }
    saveCartState();
    renderCartList();
}

function removeCartItem(index) {
    const removed = cartItems.splice(index, 1);
    saveCartState();
    renderCartList();
    if (removed && removed[0]) {
        showToast(`Đã xóa "${removed[0].name}" khỏi giỏ hàng!`, 'warning');
    }
}

function clearCart() {
    if (cartItems.length === 0) return;
    if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
        cartItems = [];
        saveCartState();
        renderCartList();
        showToast('Đã xóa toàn bộ giỏ hàng!', 'warning');
    }
}

function saveCartState() {
    if (window.SGU_CORE && SGU_CORE.saveCart) {
        SGU_CORE.saveCart(cartItems);
    } else {
        localStorage.setItem('sgu_cart', JSON.stringify(cartItems));
    }
}

function calculateTotal() {
    let total = 0;
    let qty = 0;
    cartItems.forEach(i => {
        total += (Number(i.price) || 0) * (Number(i.qty) || 1);
        qty += (Number(i.qty) || 1);
    });
    const formatted = total.toLocaleString('vi-VN') + ' ₫';
    const sumQtyEl = document.getElementById('summary-qty');
    const subtotalEl = document.getElementById('summary-subtotal');
    const finalEl = document.getElementById('summary-final');

    if (sumQtyEl) sumQtyEl.innerText = qty;
    if (subtotalEl) subtotalEl.innerText = formatted;
    if (finalEl) finalEl.innerText = formatted;
    return total;
}

// ==========================================================
// 2. CHỌN ĐỊA CHỈ & PHƯƠNG THỨC THANH TOÁN (MỤC II.3)
// ==========================================================
function selectAddressMode(mode) {
    const addrDef = document.getElementById('card-addr-default');
    const addrNew = document.getElementById('card-addr-new');
    const newForm = document.getElementById('new-address-form');

    if (addrDef) addrDef.classList.toggle('selected', mode === 'default');
    if (addrNew) addrNew.classList.toggle('selected', mode === 'new');
    if (newForm) newForm.style.display = mode === 'new' ? 'block' : 'none';
}

function selectPaymentMethod(mode) {
    const payCod = document.getElementById('pay-card-cod');
    const payBank = document.getElementById('pay-card-bank');
    const bankBox = document.getElementById('bank-box');

    if (payCod) payCod.classList.toggle('selected', mode === 'COD');
    if (payBank) payBank.classList.toggle('selected', mode === 'BANK');
    if (bankBox) bankBox.style.display = mode === 'BANK' ? 'block' : 'none';
}

// ==========================================================
// 3. XÁC NHẬN ĐẶT HÀNG -> TAB 2 & CẬP NHẬT KHO (MỤC II.3 & I.8)
// ==========================================================
function handlePlaceOrder() {
    if (cartItems.length === 0) {
        showToast('Giỏ hàng của bạn đang trống! Hãy chọn mua ít nhất 1 đôi giày.', 'warning');
        return;
    }

    // Kiểm tra trạng thái tài khoản
    if (currentUser && currentUser.isLocked) {
        showToast('Tài khoản của bạn đã bị KHÓA bởi Quản trị viên! Không thể đặt hàng.', 'danger');
        return;
    }

    const addrRadio = document.querySelector('input[name="addr_mode"]:checked');
    const addrMode = addrRadio ? addrRadio.value : 'default';
    let finalRecipient = currentUser ? currentUser.name : 'Khách vãng lai';
    let finalPhone = currentUser ? currentUser.phone : '0909123456';
    let finalAddress = `${finalRecipient} (${finalPhone}) - ${currentUser ? currentUser.address : '273 An Dương Vương, Q.5, TP.HCM'}`;

    if (addrMode === 'new') {
        const name = document.getElementById('new-name').value.trim();
        const phone = document.getElementById('new-phone').value.trim();
        const street = document.getElementById('new-street').value.trim();
        const district = document.getElementById('new-district').value;
        const city = document.getElementById('new-city').value;
        const note = document.getElementById('new-note').value.trim();

        if (!name || !phone || !street) {
            showToast('Vui lòng nhập đầy đủ thông tin Họ tên, SĐT và Địa chỉ mới!', 'warning');
            return;
        }
        finalRecipient = name;
        finalPhone = phone;
        finalAddress = `${name} (${phone}) - ${street}, ${district}, ${city}${note ? ' [Ghi chú: ' + note + ']' : ''}`;
    }

    const payRadio = document.querySelector('input[name="pay_mode"]:checked');
    const payMode = payRadio ? payRadio.value : 'COD';
    const payText = payMode === 'COD' 
        ? 'Tiền mặt khi nhận hàng (COD)' 
        : 'Chuyển khoản VietQR 24/7';

    const orderId = '#DH2025-' + Math.floor(100 + Math.random() * 900);
    const today = new Date().toLocaleDateString('vi-VN');
    const totalStr = calculateTotal().toLocaleString('vi-VN') + ' ₫';
    const cartItemsSnapshot = JSON.parse(JSON.stringify(cartItems));

    // Cập nhật thông tin vào Tab 2 (Xem lại đơn đặt hàng vừa đặt)
    const confOrderIdEl = document.getElementById('confirm-order-id');
    const confIdEl = document.getElementById('conf-id');
    const confDateEl = document.getElementById('conf-date');
    const confAddrEl = document.getElementById('conf-addr');
    const confPayEl = document.getElementById('conf-payment');
    const confTotalEl = document.getElementById('conf-total');
    const confTableEl = document.getElementById('confirm-items-table');

    if (confOrderIdEl) confOrderIdEl.innerText = orderId;
    if (confIdEl) confIdEl.innerText = orderId;
    if (confDateEl) confDateEl.innerText = today;
    if (confAddrEl) confAddrEl.innerText = finalAddress;
    if (confPayEl) confPayEl.innerText = payText;
    if (confTotalEl) confTotalEl.innerText = totalStr;

    if (confTableEl) {
        confTableEl.innerHTML = cartItemsSnapshot.map(i => `
            <tr>
                <td><strong>${i.name}</strong></td>
                <td>Size ${i.size || 40}</td>
                <td>${Number(i.price).toLocaleString('vi-VN')} ₫</td>
                <td>${i.qty}</td>
                <td><strong>${(Number(i.price) * Number(i.qty)).toLocaleString('vi-VN')} ₫</strong></td>
            </tr>
        `).join('');
    }

    // Tự động trừ tồn kho sản phẩm trong hệ thống (Rubric I.8 Báo cáo tồn kho)
    if (window.SGU_CORE && SGU_CORE.getProducts) {
        const prods = SGU_CORE.getProducts();
        cartItemsSnapshot.forEach(item => {
            const found = prods.find(p => p.id === item.code);
            if (found) {
                found.stock = Math.max(0, (found.stock || 0) - item.qty);
                found.stockExport = (found.stockExport || 0) + item.qty;
                if (found.sizeStock && found.sizeStock[item.size] !== undefined) {
                    found.sizeStock[item.size] = Math.max(0, found.sizeStock[item.size] - item.qty);
                }
            }
        });
        SGU_CORE.saveProducts(prods);
    }

    // Lưu đơn hàng mới vào SGU_CORE
    const newOrder = {
        id: orderId,
        cust: finalRecipient,
        custEmail: currentUser ? currentUser.email : 'guest@sgu.vn',
        phone: finalPhone,
        date: today,
        items: cartItemsSnapshot.map(i => `${i.name} (Size ${i.size || 40} x${i.qty})`).join(', '),
        itemsList: cartItemsSnapshot,
        address: finalAddress,
        payment: payText,
        total: totalStr,
        status: 'Mới đặt'
    };

    allOrders.unshift(newOrder);
    if (window.SGU_CORE && SGU_CORE.saveOrders) {
        SGU_CORE.saveOrders(allOrders);
    } else {
        localStorage.setItem('sgu_orders', JSON.stringify(allOrders));
    }

    // Xóa rỗng giỏ sau khi đặt thành công
    cartItems = [];
    saveCartState();
    renderCartList();

    // Cập nhật lại lịch sử đơn hàng ở Tab 3
    renderOrderHistory(allOrders);

    showToast('🎉 Đặt hàng thành công! Đang chuyển đến hóa đơn chi tiết...', 'success');
    setTimeout(() => {
        switchCheckoutTab('tab-2', document.getElementById('btn-tab-2'));
    }, 600);
}

// ==========================================================
// 4. LỊCH SỬ ĐƠN HÀNG, LỌC & XEM CHI TIẾT (MỤC II.4)
// ==========================================================
function renderOrderHistory(ordersList) {
    const table = document.getElementById('orders-history-table');
    if (!table) return;

    // Lọc theo người dùng đang đăng nhập (hoặc hiển thị các đơn mẫu nếu là tài khoản mặc định)
    let userOrders = ordersList.filter(o => {
        if (!currentUser) return true;
        return !o.custEmail || o.custEmail === currentUser.email || o.cust === currentUser.name || o.cust === 'Nguyễn Văn A';
    });

    if (userOrders.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center; padding:30px; color:var(--gray);">
                    Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                </td>
            </tr>
        `;
        return;
    }

    table.innerHTML = userOrders.map(ord => {
        const canCancel = ord.status === 'Mới đặt';
        return `
            <tr>
                <td><strong>${ord.id}</strong></td>
                <td>${ord.date}</td>
                <td style="max-width:240px; font-size:13px;">${ord.items}</td>
                <td style="max-width:200px; font-size:12.5px;">${ord.address}</td>
                <td style="font-size:12.5px;">${ord.payment}</td>
                <td><strong style="color:var(--primary); font-size:14.5px;">${ord.total}</strong></td>
                <td><span class="status-badge ${getBadgeStatusClass(ord.status)}">${ord.status}</span></td>
                <td>
                    <div style="display:flex; gap:6px;">
                        <button class="btn-outline" style="padding:5px 9px; font-size:12px;" onclick="viewHistoryDetail('${ord.id}')">👁️ Xem</button>
                        ${canCancel ? `<button class="btn-outline" style="padding:5px 9px; font-size:12px; color:var(--primary); border-color:var(--primary-light);" onclick="cancelOrderCustomer('${ord.id}')">❌ Hủy</button>` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function getBadgeStatusClass(status) {
    if (status === 'Đã giao') return 'status-done';
    if (status === 'Hủy') return 'status-cancel';
    if (status === 'Đã xử lý') return 'status-pending';
    return 'status-new';
}

// BỘ LỌC ĐƠN HÀNG NÂNG CAO (MỤC II.4)
function filterCustomerOrders() {
    const keyword = document.getElementById('history-filter-keyword').value.trim().toLowerCase();
    const status = document.getElementById('history-filter-status').value;
    const fromVal = document.getElementById('history-filter-from') ? document.getElementById('history-filter-from').value : '';
    const toVal = document.getElementById('history-filter-to') ? document.getElementById('history-filter-to').value : '';

    const fromDate = fromVal ? new Date(fromVal) : null;
    const toDate = toVal ? new Date(toVal + 'T23:59:59') : null;

    const filtered = allOrders.filter(ord => {
        const matchKeyword = !keyword || ord.id.toLowerCase().includes(keyword) || ord.items.toLowerCase().includes(keyword);
        const matchStatus = (status === 'ALL') || (ord.status === status);

        let matchDate = true;
        if (fromDate || toDate) {
            let ordDate = null;
            if (ord.date) {
                const parts = ord.date.split('/');
                if (parts.length === 3) {
                    ordDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                } else {
                    ordDate = new Date(ord.date);
                }
            }
            if (ordDate && !isNaN(ordDate.getTime())) {
                if (fromDate && ordDate < fromDate) matchDate = false;
                if (toDate && ordDate > toDate) matchDate = false;
            }
        }

        return matchKeyword && matchStatus && matchDate;
    });

    renderOrderHistory(filtered);
}

function resetHistoryFilters() {
    document.getElementById('history-filter-keyword').value = '';
    document.getElementById('history-filter-status').value = 'ALL';
    const fromEl = document.getElementById('history-filter-from');
    const toEl = document.getElementById('history-filter-to');
    if (fromEl) fromEl.value = '';
    if (toEl) toEl.value = '';
    renderOrderHistory(allOrders);
}

// XEM CHI TIẾT HÓA ĐƠN TRONG MODAL
function viewHistoryDetail(orderId) {
    const ord = allOrders.find(o => o.id === orderId);
    if (!ord) return;

    document.getElementById('hist-modal-id').innerText = ord.id;
    document.getElementById('hist-modal-cust').innerText = ord.cust || (currentUser ? currentUser.name : 'Khách hàng');
    document.getElementById('hist-modal-phone').innerText = ord.phone || (currentUser ? currentUser.phone : '0909123456');
    document.getElementById('hist-modal-date').innerText = ord.date;
    document.getElementById('hist-modal-payment').innerText = ord.payment;
    document.getElementById('hist-modal-address').innerText = ord.address;
    document.getElementById('hist-modal-total').innerText = ord.total;

    const statusEl = document.getElementById('hist-modal-status');
    statusEl.innerText = ord.status;
    statusEl.className = 'status-badge ' + getBadgeStatusClass(ord.status);

    const itemsBox = document.getElementById('hist-modal-items');
    if (ord.itemsList && ord.itemsList.length > 0) {
        itemsBox.innerHTML = `
            <table style="width:100%; font-size:13px;">
                <tr style="background:#f1f5f9; font-weight:700;">
                    <td style="padding:8px 12px;">Sản phẩm</td>
                    <td style="padding:8px 12px;">Size</td>
                    <td style="padding:8px 12px;">Đơn giá</td>
                    <td style="padding:8px 12px;">SL</td>
                    <td style="padding:8px 12px; text-align:right;">Thành tiền</td>
                </tr>
                ${ord.itemsList.map(i => `
                    <tr>
                        <td style="padding:8px 12px;"><strong>${i.name}</strong></td>
                        <td style="padding:8px 12px;">Size ${i.size || 40}</td>
                        <td style="padding:8px 12px;">${Number(i.price).toLocaleString('vi-VN')} ₫</td>
                        <td style="padding:8px 12px;">${i.qty}</td>
                        <td style="padding:8px 12px; text-align:right;"><strong>${(Number(i.price) * Number(i.qty)).toLocaleString('vi-VN')} ₫</strong></td>
                    </tr>
                `).join('')}
            </table>
        `;
    } else {
        itemsBox.innerHTML = `
            <div style="padding:12px 16px; font-size:13.5px; color:#475569;">
                ${ord.items}
            </div>
        `;
    }

    document.getElementById('modal-history-detail').style.display = 'flex';
}

// HỦY ĐƠN HÀNG (MỤC II.4)
function cancelOrderCustomer(orderId) {
    if (!confirm(`Bạn có chắc muốn hủy đơn hàng ${orderId} không?`)) return;

    const ord = allOrders.find(o => o.id === orderId);
    if (!ord) return;

    ord.status = 'Hủy';
    if (window.SGU_CORE && SGU_CORE.saveOrders) {
        SGU_CORE.saveOrders(allOrders);
    } else {
        localStorage.setItem('sgu_orders', JSON.stringify(allOrders));
    }

    // Hoàn lại tồn kho cho sản phẩm nếu có
    if (ord.itemsList && window.SGU_CORE && SGU_CORE.getProducts) {
        const prods = SGU_CORE.getProducts();
        ord.itemsList.forEach(item => {
            const p = prods.find(x => x.id === item.code);
            if (p) {
                p.stock += (Number(item.qty) || 1);
                p.stockExport = Math.max(0, (p.stockExport || 0) - item.qty);
            }
        });
        SGU_CORE.saveProducts(prods);
    }

    renderOrderHistory(allOrders);
    showToast(`Đã hủy thành công đơn hàng ${orderId}!`, 'warning');
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}
