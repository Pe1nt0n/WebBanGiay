/**
 * SGU SNEAKER - LOGIC CHI TIẾT SẢN PHẨM (PRODUCT DETAIL PAGE)
 * Thành viên 2 - Barem II.2
 */

// DỮ LIỆU ĐỘNG TỪ BỘ KHỞI TẠO DÙNG CHUNG (SGU_CORE)
let currentProduct = null;
let currentSelectedSize = 40;

window.onload = function() {
    initProductDetail();
    initHeaderUserState();
    updateCartCounter();
};

function initHeaderUserState() {
    const user = (window.SGU_CORE && SGU_CORE.getCurrentUser) ? SGU_CORE.getCurrentUser() : null;
    const container = document.getElementById('header-user-status');
    if (!container) return;
    if (user) {
        container.innerHTML = `
            <div class="chip" style="background:#f0fdf4; border-color:#bbf7d0; color:#166534; padding:8px 14px; font-weight:700;">
                👤 ${user.name}
            </div>
        `;
    } else {
        container.innerHTML = `
            <a href="index.html#login" class="chip" style="background:#eff6ff; border-color:#bfdbfe; color:#1d4ed8; padding:8px 14px; font-weight:700;">
                🔑 Đăng nhập
            </a>
        `;
    }
}

// TỰ ĐỘNG ĐỌC SẢN PHẨM TỪ QUERY STRING (?id=SP002) VÀ SGU_CORE
function initProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') || 'SP001';

    if (window.SGU_CORE && SGU_CORE.getProductById) {
        currentProduct = SGU_CORE.getProductById(id);
    }

    if (!currentProduct) {
        currentProduct = {
            id: 'SP001',
            name: 'Nike Air Max Red 2025 - Special Edition',
            brand: 'Nike',
            category: 'Giày Sneaker',
            catCode: 'LOAI01',
            price: 2450000,
            oldPrice: 2900000,
            stock: 18,
            sizes: [38, 39, 40, 41, 42, 43, 44],
            tag: 'HOT',
            reviews: 128,
            rating: 4.9,
            desc: 'Thiết kế đệm khí Air Max nâng cấp êm ái vượt trội, bảo vệ khớp gót chân tối đa. Vải dệt Flyknit thoáng khí cao cấp cùng đế cao su đúc chống trượt.',
            img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'
        };
    }

    const p = currentProduct;

    // Đổ dữ liệu thông tin chi tiết
    const titleEl = document.getElementById('detail-title');
    const bcNameEl = document.getElementById('bc-name');
    const brandEl = document.getElementById('detail-brand');
    const specBrandEl = document.getElementById('spec-brand');
    const skuEl = document.getElementById('detail-sku');
    const bcCatEl = document.getElementById('bc-category');
    const priceEl = document.getElementById('detail-price');
    const oldPriceEl = document.getElementById('detail-old-price');
    const descEl = document.getElementById('detail-desc');
    const imgEl = document.getElementById('main-shoe-img');

    if (titleEl) titleEl.innerText = p.name;
    if (bcNameEl) bcNameEl.innerText = p.name;
    if (brandEl) brandEl.innerText = p.brand;
    if (specBrandEl) specBrandEl.innerText = p.brand;
    if (skuEl) skuEl.innerText = p.id;
    if (bcCatEl) bcCatEl.innerText = p.category;
    if (priceEl && window.SGU_CORE) priceEl.innerText = SGU_CORE.formatVND(p.price);
    if (oldPriceEl && window.SGU_CORE) oldPriceEl.innerText = SGU_CORE.formatVND(p.oldPrice || (p.price * 1.2));
    if (descEl) descEl.innerText = p.desc;
    if (imgEl) imgEl.src = p.img;

    // Tình trạng tồn kho (Rubric I.8)
    const stockEl = document.getElementById('detail-stock-status');
    if (stockEl) {
        if (p.stock <= 0) {
            stockEl.innerHTML = '<span style="color:var(--primary); font-weight:700;">❌ Tạm hết hàng</span>';
        } else if (p.stock < 5) {
            stockEl.innerHTML = `<span style="color:var(--accent); font-weight:700;">⚠️ Sắp hết (Chỉ còn ${p.stock} đôi!)</span>`;
        } else {
            stockEl.innerHTML = `<span style="color:var(--success); font-weight:700;">● Còn hàng (${p.stock} sản phẩm sẵn có)</span>`;
        }
    }

    // Render kích cỡ size động
    const sizes = p.sizes && p.sizes.length > 0 ? p.sizes : [38, 39, 40, 41, 42, 43, 44];
    currentSelectedSize = sizes.includes(40) ? 40 : sizes[0];
    const sizeContainer = document.getElementById('size-chips-box');
    if (sizeContainer) {
        sizeContainer.innerHTML = sizes.map(s => `
            <button class="chip ${s === currentSelectedSize ? 'selected' : ''}" onclick="selectSize(this, ${s})">${s}</button>
        `).join('');
    }

    // Render sản phẩm liên quan
    renderRelatedProducts(p);
}

// RENDER SẢN PHẨM LIÊN QUAN TỪ SGU_CORE
function renderRelatedProducts(currentProd) {
    const grid = document.getElementById('related-products-grid');
    if (!grid || !window.SGU_CORE) return;

    const allProds = SGU_CORE.getProducts();
    let related = allProds.filter(p => p.id !== currentProd.id && (p.catCode === currentProd.catCode || p.category === currentProd.category || p.brand === currentProd.brand));
    
    // Nếu không đủ 4 sản phẩm, bổ sung thêm các sản phẩm khác
    if (related.length < 4) {
        const rest = allProds.filter(p => p.id !== currentProd.id && !related.some(r => r.id === p.id));
        related = related.concat(rest);
    }
    related = related.slice(0, 4);

    grid.innerHTML = related.map(item => `
        <div class="product-card">
            <div class="card-img-box">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div>
                <div style="font-size:12px; color:var(--gray); font-weight:700; text-transform:uppercase;">${item.brand || 'SGU'}</div>
                <h4 style="font-size:14px; margin: 4px 0 8px; font-weight:700; height:38px; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${item.name}</h4>
                <div style="font-weight:800; color:var(--primary); font-size:15px;">${SGU_CORE.formatVND(item.price)}</div>
            </div>
            <a href="product-detail.html?id=${item.id}" class="chip" style="text-align:center; margin-top:12px; display:block;">Xem Chi Tiết</a>
        </div>
    `).join('');
}

function selectSize(btn, sizeVal) {
    document.querySelectorAll('#size-chips-box .chip').forEach(c => c.classList.remove('selected'));
    btn.classList.add('selected');
    currentSelectedSize = sizeVal;
    showToast(`Đã chọn kích cỡ Size ${sizeVal}`, 'success');
}

function changeQty(delta) {
    const input = document.getElementById('qty-input');
    if (!input) return;
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    const max = currentProduct ? currentProduct.stock : 20;
    if (val > max) {
        showToast(`Kho hiện chỉ còn tối đa ${max} sản phẩm!`, 'warning');
        val = max;
    }
    input.value = val;
}

function switchDetailTab(tabId, el) {
    document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.tab-title').forEach(t => t.classList.remove('active'));
    const target = document.getElementById(tabId);
    if (target) target.style.display = 'block';
    if (el) el.classList.add('active');
}

function openSizeGuide() {
    const modal = document.getElementById('modal-size-guide');
    if (modal) modal.style.display = 'flex';
}
function closeSizeGuide() {
    const modal = document.getElementById('modal-size-guide');
    if (modal) modal.style.display = 'none';
}

// THÊM VÀO GIỎ HÀNG (KIỂM TRA ĐĂNG NHẬP & TỒN KHO - RUBRIC I.2, II.1, II.2)
function addToCartDetailed() {
    if (!window.SGU_CORE) return;

    // 1. Kiểm tra đăng nhập
    const currentUser = SGU_CORE.getCurrentUser();
    if (!currentUser) {
        showToast('Vui lòng đăng nhập tại Trang Chủ để thêm sản phẩm vào giỏ hàng!', 'warning');
        setTimeout(() => {
            window.location.href = 'index.html#login';
        }, 1500);
        return;
    }

    // 2. Kiểm tra tài khoản có bị khóa không
    if (currentUser.isLocked) {
        showToast('Tài khoản của bạn đã bị KHÓA bởi Quản trị viên! Vui lòng liên hệ CSKH.', 'danger');
        return;
    }

    // 3. Kiểm tra số lượng tồn kho
    const p = currentProduct;
    if (p.stock <= 0) {
        showToast('Sản phẩm này tạm thời đã hết hàng trong kho!', 'warning');
        return;
    }

    const qtyInput = document.getElementById('qty-input');
    const qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;
    if (qty > p.stock) {
        showToast(`Số lượng đặt (${qty}) vượt quá tồn kho (${p.stock})!`, 'warning');
        return;
    }

    // 4. Lưu giỏ hàng vào SGU_CORE
    let cart = SGU_CORE.getCart();
    const existing = cart.find(i => i.code === p.id && i.size === currentSelectedSize);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({
            name: p.name,
            price: p.price,
            code: p.id,
            img: p.img,
            size: currentSelectedSize,
            qty: qty
        });
    }

    SGU_CORE.saveCart(cart);
    updateCartCounter();
    showToast(`Đã thêm ${qty} đôi "${p.name} (Size ${currentSelectedSize})" vào giỏ hàng!`, 'success');
}

function buyNowDetailed() {
    const currentUser = (window.SGU_CORE && SGU_CORE.getCurrentUser) ? SGU_CORE.getCurrentUser() : null;
    if (!currentUser) {
        showToast('Vui lòng đăng nhập tại Trang Chủ để tiếp tục mua sắm!', 'warning');
        setTimeout(() => {
            window.location.href = 'index.html#login';
        }, 1500);
        return;
    }
    addToCartDetailed();
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 600);
}

function updateCartCounter() {
    const counter = document.getElementById('cart-counter');
    if (!counter) return;
    const user = (window.SGU_CORE && SGU_CORE.getCurrentUser) ? SGU_CORE.getCurrentUser() : null;
    if (!user) {
        counter.innerText = '0';
        return;
    }
    if (window.SGU_CORE && SGU_CORE.getCartCount) {
        counter.innerText = SGU_CORE.getCartCount();
    }
}

function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? '✅' : (type === 'warning' ? '⚠️' : '❌');
    toast.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
