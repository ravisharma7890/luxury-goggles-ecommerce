// 🔐 TOKEN GUARD
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/admin/login";
}

// 🚪 LOGOUT
$("#logoutBtn").click(function () {
  localStorage.removeItem("token");
  window.location.href = "/admin/login";
});
