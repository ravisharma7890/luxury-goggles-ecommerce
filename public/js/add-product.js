const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/admin/login";
}

$("#saveProductBtn").click(function () {
  $("#msg").text("");

  const product = {
    name: $("#name").val().trim(),
    price: Number($("#price").val()),
    brand: $("#brand").val().trim(),
    category: $("#category").val().trim(),
    stock: Number($("#stock").val()),
    description: $("#description").val().trim(),
    image: $("#image").val().trim()
  };

  if (!product.name || !product.price) {
    $("#msg").css("color", "red").text("Name and Price are required");
    return;
  }

  $.ajax({
    url: API_URL + "/products",
    method: "POST",
    headers: {
      Authorization: "Bearer " + token
    },
    contentType: "application/json",
    data: JSON.stringify(product),

    success: function () {
      $("#msg").css("color", "green").text("Product added successfully");
      setTimeout(() => {
        window.location.href = "/admin/products";
      }, 800);
    },

    error: function (err) {
      $("#msg")
        .css("color", "red")
        .text(err.responseJSON?.message || "Failed to add product");
    }
  });
});
