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
    initDetailSearchAutocomplete();
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
            <button class="chip" style="background:#fff1f2; border-color:#fecdd3; color:#be123c; padding:8px 12px; font-weight:700; cursor:pointer;" onclick="handleHeaderLogout()">
                🚪 Đăng xuất
            </button>
        `;
    } else {
        container.innerHTML = `
            <a href="index.html#login" class="chip" style="background:#eff6ff; border-color:#bfdbfe; color:#1d4ed8; padding:8px 14px; font-weight:700;">
                🔑 Đăng nhập
            </a>
        `;
    }
}

function handleHeaderLogout() {
    if (window.SGU_CORE && SGU_CORE.setCurrentUser) {
        SGU_CORE.setCurrentUser(null);
    } else {
        localStorage.removeItem('sgu_user');
        localStorage.setItem('sgu_cart', JSON.stringify([]));
    }
    initHeaderUserState();
    updateCartCounter();
    showToast('Đã đăng xuất khỏi tài khoản!', 'warning');
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
            img: './assets/images/products/sp001.jpg'
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

    // Tình trạng tồn kho tổng quát (Rubric I.8)
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

    // 1. Render dải ảnh nhiều góc chụp (Gallery)
    renderGallery(p);

    // 2. Render kích cỡ size kết hợp kiểm tra tồn kho từng size
    renderSizesWithStock(p);

    // 3. Cập nhật nút Yêu thích (Wishlist)
    updateDetailWishlistUI();

    // 4. Render tab Đánh giá & Nhận xét
    renderReviewsTab(p);

    // 5. Render sản phẩm liên quan
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

// ==========================================================================
// 1. GALLERY HÌNH ẢNH NHIỀU GÓC CHỤP
// ==========================================================================
function renderGallery(p) {
    const box = document.getElementById('gallery-thumbs-box');
    const mainImg = document.getElementById('main-shoe-img');
    if (!box || !mainImg) return;

    const gallery = (p.gallery && p.gallery.length > 0) ? p.gallery : [p.img];
    box.innerHTML = gallery.map((gImg, idx) => `
        <div class="thumb-item ${idx === 0 ? 'active' : ''}" onclick="changeMainGalleryImage(this, '${gImg}')">
            <img src="${gImg}" alt="Góc chụp ${idx + 1}">
        </div>
    `).join('');
}

function changeMainGalleryImage(thumbEl, imgSrc) {
    const mainImg = document.getElementById('main-shoe-img');
    if (mainImg) {
        mainImg.style.opacity = '0.4';
        setTimeout(() => {
            mainImg.src = imgSrc;
            mainImg.style.opacity = '1';
        }, 120);
    }
    document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
    if (thumbEl) thumbEl.classList.add('active');
}

// ==========================================================================
// 2. KÍCH CỠ SIZE & QUẢN LÝ TỒN KHO TỪNG SIZE
// ==========================================================================
function renderSizesWithStock(p) {
    const sizes = p.sizes && p.sizes.length > 0 ? p.sizes : [38, 39, 40, 41, 42, 43, 44];
    const sizeStock = p.sizeStock || {};

    // Tìm size còn hàng đầu tiên
    const firstInStock = sizes.find(s => (sizeStock[s] !== undefined ? sizeStock[s] > 0 : true));
    currentSelectedSize = firstInStock !== undefined ? firstInStock : sizes[0];

    const sizeContainer = document.getElementById('size-chips-box');
    if (sizeContainer) {
        sizeContainer.innerHTML = sizes.map(s => {
            const inStock = sizeStock[s] !== undefined ? sizeStock[s] > 0 : true;
            const isSelected = (s === currentSelectedSize);
            return `
                <button type="button" class="chip ${isSelected ? 'selected' : ''} ${!inStock ? 'out-of-stock' : ''}" 
                    ${!inStock ? 'disabled title="Hết size này"' : `onclick="selectSize(this, ${s})"`}>
                    ${s}
                </button>
            `;
        }).join('');
    }

    updateSizeStockFeedback();
}

function selectSize(btn, sizeVal) {
    document.querySelectorAll('#size-chips-box .chip').forEach(c => c.classList.remove('selected'));
    btn.classList.add('selected');
    currentSelectedSize = sizeVal;
    updateSizeStockFeedback();
    showToast(`Đã chọn kích cỡ Size ${sizeVal}`, 'success');
}

function updateSizeStockFeedback() {
    const feedback = document.getElementById('detail-size-stock-feedback');
    const addBtn = document.querySelector('.btn-add-cart');
    const buyBtn = document.querySelector('.btn-buy-now');
    if (!feedback || !currentProduct) return;

    const sizeStock = currentProduct.sizeStock || {};
    const stock = sizeStock[currentSelectedSize] !== undefined ? sizeStock[currentSelectedSize] : currentProduct.stock;

    if (stock <= 0) {
        feedback.className = 'stock-feedback-box stock-empty';
        feedback.innerHTML = `
            <span class="stock-icon">❌</span>
            <div>
                <strong>Size ${currentSelectedSize} đã tạm hết hàng!</strong>
                <p style="font-size:12px; margin-top:2px; opacity:0.9;">Vui lòng chọn kích cỡ khác hoặc liên hệ để đặt trước.</p>
            </div>
        `;
        if (addBtn) { addBtn.disabled = true; addBtn.style.opacity = '0.5'; addBtn.style.cursor = 'not-allowed'; }
        if (buyBtn) { buyBtn.disabled = true; buyBtn.style.opacity = '0.5'; buyBtn.style.cursor = 'not-allowed'; }
    } else if (stock <= 3) {
        feedback.className = 'stock-feedback-box stock-warning';
        feedback.innerHTML = `
            <span class="stock-icon">⚡</span>
            <div>
                <strong>Chỉ còn ${stock} đôi duy nhất Size ${currentSelectedSize}!</strong>
                <p style="font-size:12px; margin-top:2px; opacity:0.9;">Nhiều người đang xem sản phẩm này. Hãy đặt ngay kẻo hết!</p>
            </div>
        `;
        if (addBtn) { addBtn.disabled = false; addBtn.style.opacity = '1'; addBtn.style.cursor = 'pointer'; }
        if (buyBtn) { buyBtn.disabled = false; buyBtn.style.opacity = '1'; buyBtn.style.cursor = 'pointer'; }
    } else {
        feedback.className = 'stock-feedback-box stock-available';
        feedback.innerHTML = `
            <span class="stock-icon">✅</span>
            <div>
                <strong>Còn hàng trong kho (Còn ${stock} đôi Size ${currentSelectedSize})</strong>
                <p style="font-size:12px; margin-top:2px; opacity:0.9;">Sẵn sàng đóng gói & giao nhanh 2-3 ngày toàn quốc.</p>
            </div>
        `;
        if (addBtn) { addBtn.disabled = false; addBtn.style.opacity = '1'; addBtn.style.cursor = 'pointer'; }
        if (buyBtn) { buyBtn.disabled = false; buyBtn.style.opacity = '1'; buyBtn.style.cursor = 'pointer'; }
    }
}

// ==========================================================================
// 3. NÚT YÊU THÍCH (WISHLIST)
// ==========================================================================
function updateDetailWishlistUI() {
    const btn = document.getElementById('detail-wishlist-btn');
    if (!btn || !currentProduct || !window.SGU_CORE) return;
    const isWish = SGU_CORE.isWishlisted(currentProduct.id);
    btn.className = `btn-wishlist-detail ${isWish ? 'active' : ''}`;
    btn.innerHTML = isWish ? '❤️ Đã yêu thích' : '🤍 Thêm vào yêu thích';
}

function toggleDetailWishlist() {
    if (!currentProduct || !window.SGU_CORE) return;
    const isAdded = SGU_CORE.toggleWishlist(currentProduct.id);
    updateDetailWishlistUI();
    showToast(isAdded ? 'Đã thêm sản phẩm vào danh sách Yêu thích ❤️' : 'Đã xóa khỏi danh sách Yêu thích 🤍', isAdded ? 'success' : 'warning');
}

// ==========================================================================
// 4. TAB ĐÁNH GIÁ KHÁCH HÀNG & GỬI NHẬN XÉT MỚI
// ==========================================================================
let selectedReviewRating = 5;

function setReviewRating(rating) {
    selectedReviewRating = rating;
    document.querySelectorAll('.star-opt').forEach(opt => {
        const r = parseInt(opt.getAttribute('data-rating'));
        if (r <= rating) {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });
    const labels = {
        1: '1/5 Rất thất vọng',
        2: '2/5 Tạm được',
        3: '3/5 Bình thường',
        4: '4/5 Hài lòng',
        5: '5/5 Tuyệt vời'
    };
    const labelEl = document.getElementById('star-rating-label');
    if (labelEl) labelEl.innerText = labels[rating] || `${rating}/5`;
}

function renderReviewsTab(p) {
    const reviews = p.reviewsList || [];
    const count = reviews.length;

    const badgeEl = document.getElementById('tab-reviews-badge');
    const avgScoreEl = document.getElementById('review-avg-score');
    const starsDisplay = document.getElementById('review-stars-display');
    const totalCountEl = document.getElementById('review-total-count');
    const container = document.getElementById('reviews-items-container');
    const authorInput = document.getElementById('review-author');

    // Prefill author from user if logged in
    const user = (window.SGU_CORE && SGU_CORE.getCurrentUser) ? SGU_CORE.getCurrentUser() : null;
    if (authorInput && user && !authorInput.value) {
        authorInput.value = user.name;
    }

    if (badgeEl) badgeEl.innerText = count;

    // Rating stats
    const avg = count > 0 
        ? (reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / count).toFixed(1)
        : (p.rating || 5.0).toFixed(1);

    if (avgScoreEl) avgScoreEl.innerText = avg;
    if (totalCountEl) totalCountEl.innerText = `Dựa trên ${count} nhận xét thực tế từ khách hàng`;

    const starsStr = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));
    if (starsDisplay) starsDisplay.innerText = starsStr;

    // Cập nhật rating ở phần đầu trang
    const topRating = document.getElementById('detail-rating-score');
    const topStars = document.getElementById('detail-stars');
    const topReviewsCount = document.getElementById('detail-reviews-count');
    if (topRating) topRating.innerText = `${avg} / 5`;
    if (topStars) topStars.innerText = '⭐'.repeat(Math.round(avg));
    if (topReviewsCount) topReviewsCount.innerText = `${count} nhận xét`;

    if (!container) return;
    if (count === 0) {
        container.innerHTML = `
            <div style="padding: 24px; text-align: center; color: var(--gray); background: #f8fafc; border-radius: var(--radius-md);">
                Chưa có nhận xét nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!
            </div>
        `;
        return;
    }

    container.innerHTML = reviews.map(r => `
        <div class="review-card-item">
            <div class="review-card-header">
                <div class="review-author-wrap">
                    <div class="review-avatar-circle">${(r.user || 'K').charAt(0).toUpperCase()}</div>
                    <div>
                        <strong style="font-size: 14px; color: var(--secondary);">${r.user || 'Khách hàng'}</strong>
                        <div class="stars" style="font-size: 13px;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
                    </div>
                </div>
                <span class="review-date-text">📅 ${r.date || 'Gần đây'}</span>
            </div>
            <div class="review-text-content">
                ${r.comment}
            </div>
        </div>
    `).join('');
}

function submitProductReview() {
    const authorInput = document.getElementById('review-author');
    const contentInput = document.getElementById('review-content');

    const author = authorInput ? authorInput.value.trim() : '';
    const comment = contentInput ? contentInput.value.trim() : '';

    if (!author) {
        showToast('Vui lòng nhập họ và tên của bạn!', 'warning');
        return;
    }
    if (!comment) {
        showToast('Vui lòng nhập nội dung đánh giá của bạn!', 'warning');
        return;
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    const newReview = {
        user: author,
        rating: selectedReviewRating,
        date: dateStr,
        comment: comment
    };

    if (window.SGU_CORE && SGU_CORE.addReview) {
        const updatedProd = SGU_CORE.addReview(currentProduct.id, newReview);
        if (updatedProd) currentProduct = updatedProd;
    }

    renderReviewsTab(currentProduct);
    if (contentInput) contentInput.value = '';
    showToast('Cảm ơn bạn đã gửi đánh giá cho sản phẩm!', 'success');
}

// ==========================================================================
// 5. SEARCH AUTOCOMPLETE TRÊN HEADER CHI TIẾT
// ==========================================================================
function initDetailSearchAutocomplete() {
    const searchInput = document.getElementById('detail-search-input');
    const autoBox = document.getElementById('detail-autocomplete-box');
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

            const prods = (window.SGU_CORE && SGU_CORE.getProducts) ? SGU_CORE.getProducts().filter(p => p.active !== false) : [];
            const matches = prods.filter(p => norm(p.name).includes(normQuery) || norm(p.brand).includes(normQuery) || norm(p.category).includes(normQuery)).slice(0, 5);

            if (matches.length === 0) {
                autoBox.innerHTML = `<div class="autocomplete-empty">Không tìm thấy sản phẩm "${query}"</div>`;
                autoBox.style.display = 'block';
                return;
            }

            autoBox.innerHTML = matches.map(p => `
                <div class="autocomplete-item" onclick="window.location.href='product-detail.html?id=' + encodeURIComponent('${p.id}')">
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

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !autoBox.contains(e.target)) {
            autoBox.style.display = 'none';
        }
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            autoBox.style.display = 'none';
        }
    });
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
