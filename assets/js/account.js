document.addEventListener("DOMContentLoaded", function () {
  const user = getCurrentUser();

  if (!user || user.role !== "customer") {
    window.location.replace("login.html");
    return;
  }

  const accountMenu = document.getElementById("accountMenu");
  const accountButton = document.getElementById("accountButton");
  const accountPopup = document.getElementById("accountPopup");

  const profileView = document.getElementById("profileView");
  const profileForm = document.getElementById("profileForm");

  const editButton = document.getElementById("editProfileButton");
  const cancelButton = document.getElementById("cancelEditButton");
  const logoutButton = document.getElementById("logoutButton");

  const fullNameInput = document.getElementById("editFullName");
  const emailInput = document.getElementById("editEmail");
  const phoneInput = document.getElementById("editPhone");
  const profileMessage = document.getElementById("profileMessage");

  // Lấy bản ghi mới nhất của khách hàng.
  function getLatestUser() {
    const users = getRegisteredUsers();

    return users.find(
      (item) => item.username.toLowerCase() === user.username.toLowerCase(),
    );
  }

  function displayProfile() {
    const latestUser = getLatestUser();

    document.getElementById("accountFullName").textContent =
      latestUser?.fullName || user.fullName || "";

    document.getElementById("accountEmail").textContent =
      latestUser?.email || user.email || "";

    document.getElementById("accountPhone").textContent =
      latestUser?.phone || "Chưa cập nhật";

    fullNameInput.value = latestUser?.fullName || user.fullName || "";
    emailInput.value = latestUser?.email || user.email || "";
    phoneInput.value = latestUser?.phone || "";

    profileMessage.textContent = "";
  }

  displayProfile();

  // Mở/đóng hộp thông tin.
  accountButton.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    accountPopup.classList.toggle("hidden");
    accountButton.setAttribute(
      "aria-expanded",
      String(!accountPopup.classList.contains("hidden")),
    );
  });

  document.addEventListener("click", function (event) {
    if (!accountMenu.contains(event.target)) {
      accountPopup.classList.add("hidden");
      accountButton.setAttribute("aria-expanded", "false");
    }
  });

  // Chuyển sang chế độ sửa.
  editButton.addEventListener("click", function () {
    displayProfile();
    profileView.classList.add("hidden");
    profileForm.classList.remove("hidden");
  });

  // Hủy sửa.
  cancelButton.addEventListener("click", function () {
    profileForm.classList.add("hidden");
    profileView.classList.remove("hidden");
    displayProfile();
  });

  // Lưu hồ sơ.
  profileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const phone = phoneInput.value.trim();

    if (!fullName || !email || !phone) {
      profileMessage.textContent = "Vui lòng điền đầy đủ thông tin.";
      return;
    }

    const users = getRegisteredUsers();

    const index = users.findIndex(
      (item) => item.username.toLowerCase() === user.username.toLowerCase(),
    );

    if (index === -1) {
      profileMessage.textContent =
        "Không tìm thấy tài khoản trong danh sách đăng ký.";
      return;
    }

    // Kiểm tra email có bị tài khoản khác sử dụng không.
    const emailExists = users.some(
      (item, i) => i !== index && item.email.toLowerCase() === email,
    );

    if (emailExists) {
      profileMessage.textContent = "Email này đã được tài khoản khác sử dụng.";
      return;
    }

    // Cập nhật thông tin trong localStorage.
    users[index].fullName = fullName;
    users[index].email = email;
    users[index].phone = phone;

    localStorage.setItem("shoeStoreUsers", JSON.stringify(users));

    // Cập nhật phiên đăng nhập.
    const updatedUser = {
      ...user,
      fullName,
      email,
      phone,
    };

    sessionStorage.setItem("shoeStoreCurrentUser", JSON.stringify(updatedUser));

    Object.assign(user, updatedUser);

    // Cập nhật thông tin hiển thị ngay lập tức.
    document.getElementById("accountFullName").textContent = fullName;
    document.getElementById("accountEmail").textContent = email;
    document.getElementById("accountPhone").textContent = phone;

    // Đóng form sửa và hiện lại hồ sơ.
    profileForm.classList.add("hidden");
    profileView.classList.remove("hidden");

    profileMessage.textContent = "";
  });

  logoutButton.addEventListener("click", logoutUser);
});
