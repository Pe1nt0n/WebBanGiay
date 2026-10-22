document.addEventListener("DOMContentLoaded", () => {
  const homeLink = document.getElementById("homeLink");
  const promotionLink = document.getElementById("promotionLink");
  const productList = document.getElementById("productGrid");

  if (!homeLink || !promotionLink || !productList) {
    console.error("Không tìm thấy navbar hoặc danh sách sản phẩm!");
    return;
  }

  // Hiển thị tất cả sản phẩm
  function showAllProducts() {
    productList.querySelectorAll(".product-card").forEach((product) => {
      product.hidden = false;
    });

    homeLink.classList.add("active");
    promotionLink.classList.remove("active");
  }

  // Chỉ hiển thị sản phẩm có khuyến mãi
  function showPromotionProducts() {
    productList.querySelectorAll(".product-card").forEach((product) => {
      product.hidden = product.dataset.sale !== "true";
    });

    homeLink.classList.remove("active");
    promotionLink.classList.add("active");
  }

  homeLink.addEventListener("click", (event) => {
    event.preventDefault();
    showAllProducts();
  });

  promotionLink.addEventListener("click", (event) => {
    event.preventDefault();
    showPromotionProducts();
  });
});
