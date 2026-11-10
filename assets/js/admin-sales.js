/**
 * SGU SNEAKER - JAVASCRIPT QUẢN TRỊ 2: NGHIỆP VỤ BÁN HÀNG & KHO BÃI (OPERATIONS, SALES & INVENTORY)
 * Học phần: Lập trình Web và Ứng dụng - Đại học Sài Gòn (SGU)
 * 
 * CÁC CHỨC NĂNG CHÍNH:
 * 1. Quản lý Nhập hàng: Tìm kiếm phiếu nhập, Thêm phiếu (ngày, giá, số lượng), Sửa & Hoàn thành phiếu nhập
 * 2. Quản lý Giá bán & Lợi nhuận: Tra cứu giá vốn / lợi nhuận / giá bán, Cập nhật % lợi nhuận đơn lẻ & hàng loạt theo loại
 * 3. Quản lý Đơn đặt hàng: Lọc đơn theo thời gian & trạng thái, Đổi trạng thái (Mới đặt -> Đã xử lý -> Đã giao -> Hủy), Xem chi tiết & In hóa đơn
 * 4. Quản lý Tồn kho & Cảnh báo: Tra cứu tồn theo loại, Cảnh báo giày nguy cấp (< 5 đôi), Nhập nhanh từ cảnh báo, Báo cáo Nhập-Xuất-Tồn & Xuất CSV
 */

// ==========================================================
// 1. QUẢN LÝ NHẬP HÀNG (MỤC I.5)
// ==========================================================

let editingImportId = null;

function loadAdminImports(customList) {
    const table = document.getElementById('imports-table-body');
    if (!table || !window.SGU_CORE) return;
    const imports = customList || SGU_CORE.getImports();

    if (imports.length === 0) {
        table.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--gray);">Không tìm thấy phiếu nhập hàng nào phù hợp với bộ lọc.</td></tr>`;
        return;
    }

    table.innerHTML = imports.map(imp => {
        let sizeSummaryHtml = '';
        if (imp.sizeBreakdown) {
            const sizeEntries = Object.entries(imp.sizeBreakdown).filter(([_, qty]) => Number(qty) > 0);
            if (sizeEntries.length > 0) {
                sizeSummaryHtml = `
                    <div style="margin-top:4px; font-size:11.5px; color:#475569; display:flex; gap:4px; flex-wrap:wrap;">
                        <span style="font-weight:700;">Size nhập:</span>
                        ${sizeEntries.map(([s, q]) => `<span style="background:#f1f5f9; padding:1px 5px; border-radius:3px; border:1px solid #cbd5e1; font-weight:600;">${s}(+${q})</span>`).join('')}
                    </div>
                `;
            }
        }

        return `
        <tr id="imp-row-${imp.id}">
            <td><strong>${imp.id}</strong></td>
            <td>${imp.date}</td>
            <td>
                <strong>${imp.items}</strong>
                ${sizeSummaryHtml}
            </td>
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
    `}).join('');
}

function filterAdminImports() {
    if (!window.SGU_CORE) return;
    const imports = SGU_CORE.getImports();
    const keyword = (document.getElementById('import-filter-keyword')?.value || '').trim().toLowerCase();
    const dateVal = document.getElementById('import-filter-date')?.value;

    const filtered = imports.filter(imp => {
        const matchKeyword = !keyword || imp.id.toLowerCase().includes(keyword) || (imp.items && imp.items.toLowerCase().includes(keyword));

        let matchDate = true;
        if (dateVal) {
            let impDateStr = imp.date || '';
            if (impDateStr.includes('/')) {
                const parts = impDateStr.split('/');
                if (parts.length === 3) {
                    impDateStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                }
            }
            if (impDateStr !== dateVal) matchDate = false;
        }

        return matchKeyword && matchDate;
    });

    loadAdminImports(filtered);
}

function resetAdminImportFilters() {
    const kw = document.getElementById('import-filter-keyword');
    const dt = document.getElementById('import-filter-date');
    if (kw) kw.value = '';
    if (dt) dt.value = '';
    loadAdminImports();
    if (typeof showToast === 'function') showToast('Đã đặt lại bộ lọc phiếu nhập hàng!', 'success');
}

function openImportModal(mode, id, defaultProdId = null, defaultQty = null) {
    editingImportId = (mode === 'edit') ? id : null;
    document.getElementById('imp-edit-id').value = editingImportId || '';
    document.getElementById('modal-imp-title').innerText = (mode === 'edit') 
        ? `✏️ Sửa Phiếu Nhập ${id} (Chưa hoàn thành)` 
        : '➕ Thêm Phiếu Nhập Hàng Mới';

    // Đổ danh sách sản phẩm giày vào thẻ select
    const select = document.getElementById('imp-prod-select');
    if (select && window.SGU_CORE) {
        const prods = SGU_CORE.getProducts();
        select.innerHTML = prods.map(p => `<option value="${p.id}">${p.id} - ${p.name} (${p.category})</option>`).join('');
    }

    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('imp-date');
    const priceInput = document.getElementById('imp-price');

    let targetProdId = defaultProdId || (select ? select.value : 'SP001');
    let existingBreakdown = null;

    if (mode === 'edit' && id && window.SGU_CORE) {
        const imports = SGU_CORE.getImports();
        const found = imports.find(x => x.id === id);
        if (found) {
            if (dateInput) dateInput.value = found.date || today;
            if (priceInput) priceInput.value = found.unitCost || 1800000;
            if (select && found.prodId) {
                select.value = found.prodId;
                targetProdId = found.prodId;
            }
            existingBreakdown = found.sizeBreakdown || null;
        }
    } else {
        if (dateInput) dateInput.value = today;
        if (select && defaultProdId) select.value = defaultProdId;
        const prods = SGU_CORE.getProducts();
        const prod = prods.find(p => p.id === targetProdId);
        if (priceInput) priceInput.value = prod ? (prod.costPrice || 1800000) : 1800000;
    }

    renderImportSizeInputs(targetProdId, existingBreakdown, defaultQty);
    calculateImportTotals();
    document.getElementById('modal-import').style.display = 'flex';
}

// RENDER Ô NHẬP SỐ LƯỢNG CHO TỪNG SIZE
function renderImportSizeInputs(prodId, existingBreakdown = null, defaultTotalQty = null) {
    const container = document.getElementById('import-size-inputs-grid');
    if (!container || !window.SGU_CORE) return;

    const prods = SGU_CORE.getProducts();
    const prod = prods.find(p => p.id === prodId) || prods[0];
    if (!prod) return;

    const sizes = prod.sizes || [38, 39, 40, 41, 42, 43, 44];
    const currentSizeStock = prod.sizeStock || {};

    let initialAllocations = {};
    if (existingBreakdown) {
        initialAllocations = { ...existingBreakdown };
    } else if (defaultTotalQty && defaultTotalQty > 0) {
        const base = Math.floor(defaultTotalQty / sizes.length);
        let rem = defaultTotalQty % sizes.length;
        sizes.forEach(s => {
            initialAllocations[s] = base + (rem > 0 ? 1 : 0);
            rem--;
        });
    } else {
        // Mặc định đề xuất 2 đôi cho mỗi size
        sizes.forEach(s => {
            initialAllocations[s] = 2;
        });
    }

    container.innerHTML = sizes.map(s => {
        const curStock = currentSizeStock[s] !== undefined ? currentSizeStock[s] : 0;
        const alloc = initialAllocations[s] !== undefined ? initialAllocations[s] : 0;
        const isOutOfStock = curStock === 0;
        const isLow = curStock > 0 && curStock <= 2;

        return `
            <div style="background:#fff; border:1px solid #cbd5e1; border-radius:6px; padding:8px 10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <span style="font-weight:700; font-size:13px;">Size ${s}</span>
                    <span style="font-size:11px; font-weight:600; ${isOutOfStock ? 'color:#dc2626;' : (isLow ? 'color:#d97706;' : 'color:#64748b;')}">
                        (Hiện: ${curStock})
                    </span>
                </div>
                <div style="display:flex; align-items:center; gap:4px;">
                    <span style="font-size:12px; font-weight:700; color:#10b981;">+</span>
                    <input type="number" min="0" max="500" class="form-control imp-size-input" data-size="${s}" value="${alloc}" style="padding:4px; font-size:13px; font-weight:700; text-align:center;" oninput="calculateImportTotals()">
                    <span style="font-size:11px; color:var(--gray);">đôi</span>
                </div>
            </div>
        `;
    }).join('');

    calculateImportTotals();
}

function calculateImportTotals() {
    const sizeInputs = document.querySelectorAll('.imp-size-input');
    let totalQty = 0;
    sizeInputs.forEach(inp => {
        totalQty += Math.max(0, parseInt(inp.value) || 0);
    });

    const priceInput = document.getElementById('imp-price');
    const unitPrice = Math.max(0, parseInt(priceInput ? priceInput.value : 0) || 0);
    const totalCost = totalQty * unitPrice;

    const qtyDisplay = document.getElementById('import-total-qty-display');
    const costDisplay = document.getElementById('import-total-cost-display');
    const hiddenQty = document.getElementById('imp-qty');

    if (qtyDisplay) qtyDisplay.innerText = `${totalQty} đôi`;
    if (costDisplay) costDisplay.innerText = (window.SGU_CORE && SGU_CORE.formatVND) ? SGU_CORE.formatVND(totalCost) : `${totalCost.toLocaleString('vi-VN')} ₫`;
    if (hiddenQty) hiddenQty.value = totalQty;
}

function distributeImportQtyEqually() {
    const sizeInputs = document.querySelectorAll('.imp-size-input');
    if (sizeInputs.length === 0) return;
    const count = sizeInputs.length;
    sizeInputs.forEach(inp => {
        inp.value = 2;
    });
    calculateImportTotals();
    if (typeof showToast === 'function') showToast(`Đã chia đều 2 đôi cho mỗi size (Tổng: ${count * 2} đôi)!`, 'info');
}

function onImportProductSelectChange() {
    const select = document.getElementById('imp-prod-select');
    if (!select || !window.SGU_CORE) return;
    const prodId = select.value;
    const prods = SGU_CORE.getProducts();
    const prod = prods.find(p => p.id === prodId);
    if (prod) {
        const priceInput = document.getElementById('imp-price');
        if (priceInput) priceInput.value = prod.costPrice || 1500000;
    }
    renderImportSizeInputs(prodId);
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

    const sizeInputs = document.querySelectorAll('.imp-size-input');
    const sizeBreakdown = {};
    let totalQty = 0;
    sizeInputs.forEach(inp => {
        const s = parseInt(inp.getAttribute('data-size'));
        const q = Math.max(0, parseInt(inp.value) || 0);
        sizeBreakdown[s] = q;
        totalQty += q;
    });

    if (totalQty <= 0) {
        showToast('Tổng số lượng nhập phải lớn hơn 0! Vui lòng nhập số lượng cho ít nhất 1 size.', 'warning');
        return;
    }

    const total = price * totalQty;
    const totalStr = SGU_CORE.formatVND(total);

    if (editingImportId) {
        const target = imports.find(x => x.id === editingImportId);
        if (target) {
            target.date = dateVal;
            target.items = `${prod ? prod.name : 'Giày Sneaker'} (x${totalQty} đôi)`;
            target.total = totalStr;
            target.unitCost = price;
            target.qty = totalQty;
            target.prodId = prodId;
            target.sizeBreakdown = sizeBreakdown;
        }
        if (typeof showToast === 'function') showToast(`Đã cập nhật thành công phiếu nhập ${editingImportId}!`, 'success');
    } else {
        const newId = 'PN' + String(imports.length + 1).padStart(3, '0');
        imports.unshift({
            id: newId,
            date: dateVal,
            items: `${prod ? prod.name : 'Giày Sneaker'} (x${totalQty} đôi)`,
            total: totalStr,
            status: 'Chưa hoàn thành',
            canEdit: true,
            unitCost: price,
            qty: totalQty,
            prodId: prodId,
            sizeBreakdown: sizeBreakdown
        });
        if (typeof showToast === 'function') showToast(`Đã tạo mới phiếu nhập ${newId} ở trạng thái Chưa hoàn thành!`, 'success');
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
        if (targetProd.costPrice && imp.unitCost) {
            targetProd.costPrice = imp.unitCost;
        }

        if (targetProd.sizeStock) {
            if (imp.sizeBreakdown && Object.keys(imp.sizeBreakdown).length > 0) {
                // Cộng chính xác số lượng nhập của từng size
                Object.entries(imp.sizeBreakdown).forEach(([s, q]) => {
                    const numQ = Number(q) || 0;
                    targetProd.sizeStock[s] = (targetProd.sizeStock[s] || 0) + numQ;
                });
            } else {
                // Phân bổ đều và phân bổ số dư chính xác 100%
                const sizes = Object.keys(targetProd.sizeStock);
                if (sizes.length > 0) {
                    const base = Math.floor(addQty / sizes.length);
                    let rem = addQty % sizes.length;
                    sizes.forEach(s => {
                        targetProd.sizeStock[s] = (targetProd.sizeStock[s] || 0) + base + (rem > 0 ? 1 : 0);
                        rem--;
                    });
                }
            }
        }
        SGU_CORE.saveProducts(prods);
    }

    loadAdminImports();
    loadAdminInventory();
    if (typeof loadAdminPricing === 'function') loadAdminPricing();
    if (typeof updateAdminKPIs === 'function') updateAdminKPIs();
    if (typeof showToast === 'function') showToast(`Đã hoàn thành phiếu nhập ${id}, khóa tính năng sửa và cộng tồn kho thành công!`, 'success');
}

// ==========================================================
// 2. THIẾT LẬP GIÁ BÁN & LỢI NHUẬN (MỤC I.6)
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
    p.oldPrice = Math.round(newPrice * 1.15);
    SGU_CORE.saveProducts(prods);

    if (typeof loadAdminProducts === 'function') loadAdminProducts();
    if (typeof showToast === 'function') showToast(`Đã lưu giá bán mới cho ${p.id} (${p.name}): ${SGU_CORE.formatVND(newPrice)} (Lợi nhuận: ${percent}%)!`, 'success');
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
    if (typeof loadAdminProducts === 'function') loadAdminProducts();
    if (typeof showToast === 'function') showToast(`Đã cập nhật tỉ lệ lợi nhuận ${percent}% cho ${count} sản phẩm thuộc loại "${cat}"!`, 'success');
}

// ==========================================================
// 3. QUẢN LÝ ĐƠN HÀNG (MỤC I.7)
// ==========================================================

function loadAdminOrders(customList) {
    const table = document.getElementById('admin-orders-table');
    if (!table || !window.SGU_CORE) return;
    const allOrders = SGU_CORE.getOrders();
    const orders = customList || allOrders;

    if (orders.length === 0) {
        table.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--gray);">Không tìm thấy đơn hàng nào phù hợp với bộ lọc.</td></tr>`;
        return;
    }

    table.innerHTML = orders.map((ord) => {
        const originalIndex = allOrders.findIndex(o => o.id === ord.id);
        const idx = originalIndex !== -1 ? originalIndex : 0;
        return `
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
    `}).join('');
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
    if (typeof updateAdminKPIs === 'function') updateAdminKPIs();
    if (typeof showToast === 'function') showToast(`Đã cập nhật đơn ${orders[idx].id} thành "${val}"!`, 'success');
}

function filterAdminOrders() {
    if (!window.SGU_CORE) return;
    const orders = SGU_CORE.getOrders();
    const status = document.getElementById('order-filter-status')?.value || 'ALL';
    const keyword = (document.getElementById('order-filter-keyword')?.value || '').trim().toLowerCase();
    const fromVal = document.getElementById('order-filter-from')?.value;
    const toVal = document.getElementById('order-filter-to')?.value;

    const fromDate = fromVal ? new Date(fromVal) : null;
    const toDate = toVal ? new Date(toVal + 'T23:59:59') : null;

    const filtered = orders.filter(ord => {
        const matchStatus = (status === 'ALL') || (ord.status === status);
        const matchKeyword = !keyword || ord.id.toLowerCase().includes(keyword) || (ord.cust && ord.cust.toLowerCase().includes(keyword));

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

        return matchStatus && matchKeyword && matchDate;
    });

    loadAdminOrders(filtered);
}

function resetAdminOrderFilters() {
    const kw = document.getElementById('order-filter-keyword');
    const st = document.getElementById('order-filter-status');
    const fromEl = document.getElementById('order-filter-from');
    const toEl = document.getElementById('order-filter-to');
    if (kw) kw.value = '';
    if (st) st.value = 'ALL';
    if (fromEl) fromEl.value = '';
    if (toEl) toEl.value = '';
    loadAdminOrders();
    if (typeof showToast === 'function') showToast('Đã đặt lại bộ lọc đơn hàng!', 'success');
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

function printInvoice() {
    window.print();
}

// ==========================================================
// 4. BÁO CÁO TỒN KHO & CẢNH BÁO TỒN THẤP (MỤC I.8)
// ==========================================================

let currentEditingSizeStockProdId = null;

function loadAdminInventory(customList) {
    const table = document.getElementById('inventory-table-body');
    if (!table || !window.SGU_CORE) return;
    const prods = customList || SGU_CORE.getProducts();

    if (prods.length === 0) {
        table.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px; color:var(--gray);">Không tìm thấy sản phẩm tồn kho phù hợp với điều kiện lọc.</td></tr>`;
        return;
    }

    table.innerHTML = prods.map(p => {
        const isCritical = p.stock < 5;
        const sizes = p.sizes || [38, 39, 40, 41, 42, 43, 44];
        const sizeStock = p.sizeStock || {};

        const sizeBadgesHtml = sizes.map(s => {
            const qty = sizeStock[s] !== undefined ? sizeStock[s] : 0;
            const isZero = qty === 0;
            const isLow = qty > 0 && qty <= 2;
            return `
                <span style="display:inline-flex; align-items:center; gap:2px; padding:2px 6px; font-size:11.5px; border-radius:4px; font-weight:700; ${isZero ? 'background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;' : (isLow ? 'background:#fef3c7; color:#d97706; border:1px solid #fcd34d;' : 'background:#f1f5f9; color:#1e293b; border:1px solid #e2e8f0;')}" title="Size ${s}: ${qty} đôi">
                    <span>${s}:</span><strong style="${isZero ? 'color:#b91c1c;' : ''}">${qty}</strong>
                </span>
            `;
        }).join('');

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
                    <div style="display:flex; gap:4px; flex-wrap:wrap; max-width:240px;">
                        ${sizeBadgesHtml}
                    </div>
                </td>
                <td>
                    <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-start;">
                        ${isCritical ? `
                            <span class="badge badge-danger">⚠️ Tồn kho nguy cấp</span>
                        ` : `
                            <span class="badge badge-done">Đủ hàng</span>
                        `}
                        <div style="display:flex; gap:5px; flex-wrap:wrap;">
                            <button class="btn btn-dark" style="padding:4px 8px; font-size:11px;" onclick="openEditSizeStockModal('${p.id}')" title="Kiểm kê & điều chỉnh tồn theo từng size">✏️ Sửa size</button>
                            ${isCritical ? `
                                <button class="btn btn-warning" style="padding:4px 8px; font-size:11px;" onclick="quickImportProduct('${p.name}', 20)">+ Nhập hàng</button>
                            ` : ''}
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// MỞ MODAL ĐIỀU CHỈNH SỐ LƯỢNG TỒN CHO TỪNG SIZE
function openEditSizeStockModal(prodId) {
    if (!window.SGU_CORE) return;
    const prods = SGU_CORE.getProducts();
    const prod = prods.find(p => p.id === prodId);
    if (!prod) return;

    currentEditingSizeStockProdId = prodId;
    const titleEl = document.getElementById('size-stock-modal-title');
    const subtitleEl = document.getElementById('size-stock-modal-subtitle');
    const idInput = document.getElementById('size-stock-prod-id');
    if (titleEl) titleEl.innerText = `👟 Tồn kho theo size: ${prod.id}`;
    if (subtitleEl) subtitleEl.innerText = `${prod.name} (Phân loại: ${prod.category})`;
    if (idInput) idInput.value = prodId;

    const sizes = prod.sizes || [38, 39, 40, 41, 42, 43, 44];
    const sizeStock = prod.sizeStock || {};

    const container = document.getElementById('size-stock-inputs-container');
    if (container) {
        container.innerHTML = sizes.map(s => {
            const qty = sizeStock[s] !== undefined ? sizeStock[s] : 0;
            return `
                <div style="background: #fff; border: 1.5px solid var(--border); border-radius: 8px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between;">
                    <label style="font-size: 14px; font-weight: 700; color: var(--dark);">Size ${s}:</label>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <input type="number" min="0" max="999" class="form-control size-stock-input" data-size="${s}" value="${qty}" style="width: 75px; text-align: center; font-weight: 700;" oninput="recalculateSizeStockTotal()">
                        <span style="font-size: 12px; color: var(--gray);">đôi</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    recalculateSizeStockTotal();
    const modal = document.getElementById('modal-size-stock');
    if (modal) modal.style.display = 'flex';
}

function recalculateSizeStockTotal() {
    const inputs = document.querySelectorAll('.size-stock-input');
    let total = 0;
    inputs.forEach(inp => {
        total += Math.max(0, parseInt(inp.value) || 0);
    });
    const totalEl = document.getElementById('size-stock-total-display');
    if (totalEl) totalEl.innerText = `${total} đôi`;
}

function saveSizeStockModal() {
    if (!window.SGU_CORE || !currentEditingSizeStockProdId) return;
    const prods = SGU_CORE.getProducts();
    const prod = prods.find(p => p.id === currentEditingSizeStockProdId);
    if (!prod) return;

    const inputs = document.querySelectorAll('.size-stock-input');
    const newSizeStock = {};
    let totalStock = 0;

    inputs.forEach(inp => {
        const size = parseInt(inp.getAttribute('data-size'));
        const qty = Math.max(0, parseInt(inp.value) || 0);
        newSizeStock[size] = qty;
        totalStock += qty;
    });

    prod.sizeStock = newSizeStock;
    prod.stock = totalStock;

    SGU_CORE.saveProducts(prods);

    closeModal('modal-size-stock');
    loadAdminInventory();
    if (typeof loadAdminProducts === 'function') loadAdminProducts();
    if (typeof updateAdminKPIs === 'function') updateAdminKPIs();

    showToast(`Đã cập nhật tồn kho theo size cho "${prod.name}" (Tổng tồn: ${totalStock} đôi)!`, 'success');
}

function filterAdminInventory() {
    if (!window.SGU_CORE) return;
    const prods = SGU_CORE.getProducts();
    const cat = document.getElementById('inventory-filter-cat')?.value || 'ALL';
    const status = document.getElementById('inventory-filter-status')?.value || 'ALL';
    const keyword = (document.getElementById('inventory-filter-keyword')?.value || '').trim().toLowerCase();

    const filtered = prods.filter(p => {
        const matchCat = (cat === 'ALL') || (p.category === cat);
        const matchKeyword = !keyword || p.id.toLowerCase().includes(keyword) || p.name.toLowerCase().includes(keyword);
        const matchStatus = (status === 'ALL') 
            || (status === 'critical' && (p.stock < 5))
            || (status === 'normal' && (p.stock >= 5));
        return matchCat && matchKeyword && matchStatus;
    });

    loadAdminInventory(filtered);
}

function resetAdminInventoryFilters() {
    const cat = document.getElementById('inventory-filter-cat');
    const status = document.getElementById('inventory-filter-status');
    const kw = document.getElementById('inventory-filter-keyword');
    if (cat) cat.value = 'ALL';
    if (status) status.value = 'ALL';
    if (kw) kw.value = '';
    loadAdminInventory();
    if (typeof showToast === 'function') showToast('Đã đặt lại bộ lọc tồn kho!', 'success');
}

function quickImportProduct(prodName, qty) {
    if (typeof switchAdminTab === 'function') {
        switchAdminTab('tab-imports', document.getElementById('nav-imports'));
    }
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
    if (typeof showToast === 'function') showToast(`Đã nạp sẵn sản phẩm "${prodName}" vào phiếu nhập (+${qty} đôi)!`, 'success');
}

function exportInventoryReport() {
    if (!window.SGU_CORE) return;
    const prods = SGU_CORE.getProducts();
    const today = new Date().toLocaleDateString('vi-VN');

    let csvContent = '\uFEFF'; // UTF-8 BOM cho Microsoft Excel tiếng Việt
    csvContent += 'BÁO CÁO TỒN KHO SẢN PHẨM - SGU SNEAKER STORE\n';
    csvContent += `Ngày xuất báo cáo: ${today}\n\n`;
    csvContent += 'Mã SP,Tên sản phẩm giày,Phân loại,Tồn đầu kỳ,Tổng nhập,Tổng xuất,Tồn hiện tại,Chi tiết từng size,Tình trạng\n';

    prods.forEach(p => {
        const status = (p.stock < 5) ? 'Nguy cấp' : 'Đủ hàng';
        const sizes = p.sizes || [38, 39, 40, 41, 42, 43, 44];
        const sizeStock = p.sizeStock || {};
        const sizeDetails = sizes.map(s => `Size ${s}: ${sizeStock[s] !== undefined ? sizeStock[s] : 0} đôi`).join(' | ');
        csvContent += `"${p.id}","${p.name}","${p.category}",${p.stockInitial || 10},${p.stockImport || 0},${p.stockExport || 0},${p.stock},"${sizeDetails}","${status}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bao_Cao_Ton_Kho_SGU_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (typeof showToast === 'function') showToast('🎉 Đã xuất file CSV báo cáo tồn kho thành công!', 'success');
}

// ==========================================================
// 5. KHỞI CHẠY CÁC MODULE BÁN HÀNG & KHO BÃI
// ==========================================================

function loadAdminSalesModules() {
    loadAdminImports();
    loadAdminPricing();
    loadAdminOrders();
    loadAdminInventory();
}

window.addEventListener('DOMContentLoaded', function() {
    loadAdminSalesModules();

    // Hỗ trợ chuyển tab qua URL Hash
    const hash = window.location.hash;
    if (hash === '#imports') {
        if (typeof switchAdminTab === 'function') switchAdminTab('tab-imports', document.getElementById('nav-imports'));
    } else if (hash === '#pricing') {
        if (typeof switchAdminTab === 'function') switchAdminTab('tab-pricing', document.getElementById('nav-pricing'));
    } else if (hash === '#orders') {
        if (typeof switchAdminTab === 'function') switchAdminTab('tab-orders', document.getElementById('nav-orders'));
    } else if (hash === '#inventory') {
        if (typeof switchAdminTab === 'function') switchAdminTab('tab-inventory', document.getElementById('nav-inventory'));
    }
});
