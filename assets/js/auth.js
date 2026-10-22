const USERS_KEY = "shoeStoreUsers";
const SESSION_KEY = "shoeStoreCurrentUser";

// Tài khoản mẫu để kiểm tra giao diện.
// Chỉ dùng cho bài tập frontend, không dùng trong website thật.
const DEMO_USERS = [
  {
    username: "admin",
    password: "admin123",
    fullName: "Quản trị viên",
    email: "admin@shoestore.local",
    role: "admin",
  },
  {
    username: "customer",
    password: "123456",
    fullName: "Khách hàng mẫu",
    email: "customer@shoestore.local",
    role: "customer",
  },
];

// Lấy danh sách tài khoản đã đăng ký trên trình duyệt
function getRegisteredUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

// Tìm tài khoản theo tên đăng nhập
function findUser(username) {
  const normalizedUsername = username.trim().toLowerCase();

  const allUsers = [...DEMO_USERS, ...getRegisteredUsers()];

  return allUsers.find(
    (user) => user.username.toLowerCase() === normalizedUsername,
  );
}

// Đăng ký tài khoản khách hàng

function registerUser({ fullName, username, email, phone, password }) {
  const normalizedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.trim();

  const users = getRegisteredUsers();

  const usernameExists = [...DEMO_USERS, ...users].some(
    (user) => user.username.toLowerCase() === normalizedUsername.toLowerCase(),
  );

  if (usernameExists) {
    return {
      success: false,
      message: "Tên tài khoản đã tồn tại. Vui lòng chọn tên khác.",
    };
  }

  const emailExists = [...DEMO_USERS, ...users].some(
    (user) => user.email.toLowerCase() === normalizedEmail,
  );

  if (emailExists) {
    return {
      success: false,
      message: "Email này đã được sử dụng.",
    };
  }

  const newUser = {
    fullName: fullName.trim(),
    username: normalizedUsername,
    email: normalizedEmail,
    phone: normalizedPhone,
    password,
    role: "customer",
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  return {
    success: true,
    message: "Đăng ký thành công! Bạn có thể đăng nhập.",
  };
}

// Xác thực đăng nhập
function loginUser(username, password) {
  const user = findUser(username);

  if (!user || user.password !== password) {
    return {
      success: false,
      message: "Tên tài khoản hoặc mật khẩu không chính xác.",
    };
  }

  // Không đưa mật khẩu vào thông tin phiên đăng nhập
  const sessionUser = {
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

  return {
    success: true,
    user: sessionUser,
  };
}

// Lấy người đang đăng nhập
function getCurrentUser() {
  try {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

// Đăng xuất
function logoutUser() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.replace("login.html");
}

// Kiểm tra phiên đăng nhập và vai trò
function requireLogin(requiredRole) {
  const user = getCurrentUser();

  if (!user) {
    window.location.replace("login.html");
    return false;
  }

  if (requiredRole && user.role !== requiredRole) {
    const target = user.role === "admin" ? "admin.html" : "user.html";
    window.location.replace(target);
    return false;
  }

  return true;
}
