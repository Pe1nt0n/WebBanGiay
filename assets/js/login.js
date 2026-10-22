document.addEventListener("DOMContentLoaded", function () {
  const loginCard = document.getElementById("loginCard");
  const registerCard = document.getElementById("registerCard");

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  const showRegisterButton = document.getElementById("showRegister");
  const showLoginButton = document.getElementById("showLogin");

  const loginMessage = document.getElementById("loginMessage");
  const registerMessage = document.getElementById("registerMessage");

  // Hiển thị thông báo
  function showMessage(element, message, success = false) {
    if (!element) return;

    element.textContent = message;
    element.classList.toggle("success-message", success);
    element.classList.toggle("error-message", !success);
  }

  // Chuyển giữa đăng nhập và đăng ký

  function showLoginForm() {
    loginCard.classList.remove("hidden");
    registerCard.classList.add("hidden");

    loginForm.reset();
    registerForm.reset();

    showMessage(loginMessage, "");
    showMessage(registerMessage, "");
  }

  function showRegisterForm() {
    loginCard.classList.add("hidden");
    registerCard.classList.remove("hidden");

    loginForm.reset();
    registerForm.reset();

    showMessage(loginMessage, "");
    showMessage(registerMessage, "");
  }

  showRegisterButton.addEventListener("click", showRegisterForm);
  showLoginButton.addEventListener("click", showLoginForm);

  // Nếu người dùng đã đăng nhập, chuyển về đúng trang
  const currentUser = getCurrentUser();

  if (currentUser) {
    window.location.replace(
      currentUser.role === "admin" ? "admin.html" : "user.html",
    );
    return;
  }

  // XỬ LÝ ĐĂNG NHẬP
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const result = loginUser(username, password);

    if (!result.success) {
      showMessage(loginMessage, result.message);
      return;
    }

    if (result.user.role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "user.html";
    }
  });

  // XỬ LÝ ĐĂNG KÝ

  // XỬ LÝ ĐĂNG KÝ
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const username = document.getElementById("newUsername").value.trim();
    const email = document.getElementById("email").value.trim();
    const phoneInput = document.getElementById("phone");
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const password = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (username.length < 4) {
      showMessage(registerMessage, "Tên tài khoản phải có ít nhất 4 ký tự.");
      return;
    }

    if (password.length < 6) {
      showMessage(registerMessage, "Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      showMessage(registerMessage, "Mật khẩu xác nhận không khớp.");
      return;
    }

    const result = registerUser({
      fullName,
      username,
      email,
      phone,
      password,
    });

    if (!result.success) {
      showMessage(registerMessage, result.message);
      return;
    }

    showMessage(registerMessage, result.message, true);
    registerForm.reset();

    setTimeout(() => {
      showLoginForm();

      document.getElementById("username").value = username;
      showMessage(
        loginMessage,
        "Đăng ký thành công! Vui lòng đăng nhập.",
        true,
      );
    }, 800);
  });
});
