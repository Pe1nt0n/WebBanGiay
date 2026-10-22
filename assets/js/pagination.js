document.addEventListener("DOMContentLoaded", function () {
  const productGrid = document.getElementById("productGrid");
  const pagination = document.getElementById("pagination");

  if (!productGrid || !pagination) return;

  const products = Array.from(productGrid.querySelectorAll(".product-card"));

  const productsPerPage = 9;
  let currentPage = 1;

  // Danh sách sản phẩm phù hợp sau khi tìm kiếm
  let filteredProducts = [...products];

  function renderPage(page = 1) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Không có kết quả
    if (totalPages === 0) {
      currentPage = 1;

      products.forEach((product) => {
        product.hidden = true;
        product.style.display = "none";
      });

      pagination.innerHTML = "";
      return;
    }

    currentPage = Math.max(1, Math.min(page, totalPages));

    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;

    // Hiện đúng sản phẩm thuộc trang hiện tại
    products.forEach((product) => {
      product.hidden = true;
      product.style.display = "none";
    });

    filteredProducts.slice(start, end).forEach((product) => {
      product.hidden = false;
      product.style.display = "";
    });

    renderButtons(totalPages);
  }

  function renderButtons(totalPages) {
    pagination.innerHTML = "";

    function createButton(text, page, disabled = false) {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "page-btn";
      button.textContent = text;
      button.disabled = disabled;

      button.addEventListener("click", () => {
        renderPage(page);
      });

      return button;
    }

    // Nút trang trước
    pagination.appendChild(
      createButton("‹", currentPage - 1, currentPage === 1),
    );

    // Các số trang
    for (let page = 1; page <= totalPages; page++) {
      const button = createButton(String(page), page);

      if (page === currentPage) {
        button.classList.add("active");
        button.setAttribute("aria-current", "page");
      }

      pagination.appendChild(button);
    }

    // Nút trang sau
    pagination.appendChild(
      createButton("›", currentPage + 1, currentPage === totalPages),
    );
  }

  // Hàm để search.js cập nhật danh sách
  window.updateProductPagination = function (matchedProducts) {
    filteredProducts = matchedProducts;
    renderPage(1);
  };

  // Khởi tạo phân trang ban đầu
  renderPage(1);
});
