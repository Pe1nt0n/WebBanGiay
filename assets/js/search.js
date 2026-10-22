document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("advancedSearchForm");
  const productGrid = document.getElementById("productGrid");

  if (!form || !productGrid) {
    console.error("Không tìm thấy form hoặc productGrid");
    return;
  }

  const nameInput = document.getElementById("searchName");
  const categorySelect = document.getElementById("searchCategory");
  const brandSelect = document.getElementById("searchBrand");
  const minPriceInput = document.getElementById("minPrice");
  const maxPriceInput = document.getElementById("maxPrice");

  const products = Array.from(productGrid.querySelectorAll(".product-card"));

  const resultCount = document.getElementById("resultCount");
  const emptyMessage = document.getElementById("emptyMessage");

  function normalizeText(text) {
    return (text || "").trim().toLocaleLowerCase("vi");
  }

  function searchProducts() {
    const keyword = normalizeText(nameInput.value);
    const category = normalizeText(categorySelect.value);
    const brand = brandSelect.value.trim().toUpperCase();

    const minText = minPriceInput.value.trim();
    const maxText = maxPriceInput.value.trim();

    const minPrice = minText === "" ? null : Number(minText);
    const maxPrice = maxText === "" ? null : Number(maxText);

    // Kiểm tra giá
    if (
      (minPrice !== null && (!Number.isFinite(minPrice) || minPrice < 0)) ||
      (maxPrice !== null && (!Number.isFinite(maxPrice) || maxPrice < 0))
    ) {
      alert("Vui lòng nhập giá hợp lệ.");
      return;
    }

    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      alert("Giá thấp nhất không được lớn hơn giá cao nhất.");
      return;
    }

    const matchedProducts = products.filter((product) => {
      const name = normalizeText(
        product.dataset.name || product.querySelector("h3")?.textContent,
      );

      const productCategory = normalizeText(product.dataset.category);

      const productBrand = (
        product.dataset.brand ||
        product.querySelector(".brand")?.textContent ||
        ""
      )
        .trim()
        .toUpperCase();

      const priceText = product.dataset.price;
      const price = Number(priceText);

      const validPrice =
        priceText !== undefined &&
        priceText.trim() !== "" &&
        Number.isFinite(price) &&
        price >= 0;

      return (
        validPrice &&
        name.includes(keyword) &&
        (!category || productCategory === category) &&
        (!brand || productBrand === brand) &&
        (minPrice === null || price >= minPrice) &&
        (maxPrice === null || price <= maxPrice)
      );
    });

    // Cập nhật số kết quả
    if (resultCount) {
      resultCount.textContent = `Tìm thấy ${matchedProducts.length} sản phẩm`;
    }

    if (emptyMessage) {
      emptyMessage.hidden = matchedProducts.length > 0;
    }

    // Giao danh sách phù hợp cho phân trang
    if (typeof window.updateProductPagination === "function") {
      window.updateProductPagination(matchedProducts);
    } else {
      console.error("Chưa khởi tạo chức năng phân trang.");
    }

    console.log("Số sản phẩm tìm được:", matchedProducts.length);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    searchProducts();
  });

  form.addEventListener("reset", () => {
    setTimeout(searchProducts, 0);
  });
});
