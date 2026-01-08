const API_URL = "http://localhost:5000/api";

$("#loginBtn").click(function () {
  const email = $("#email").val();
  const password = $("#password").val();

  $("#error").hide();

  if (!email || !password) {
    $("#error").text("Email and password required").show();
    return;
  }

  $.ajax({
    url: API_URL + "/auth/login",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ email, password }),

    success: function (res) {
      localStorage.setItem("token", res.token);
      window.location.href = "/admin/dashboard";
    },

    error: function (err) {
      $("#error")
        .text(err.responseJSON?.message || "Login failed")
        .show();
    }
  });
});
