const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/admin/login";
}

const productId = window.location.pathname.split("/").pop();

// LOAD PRODUCT
$.ajax({
  url: API_URL + "/products/" + productId,
  method: "GET",
  success: function (p) {
    $("#name").val(p.name);
    $("#category").val(p.category);
    $("#brand").val(p.brand);
    $("#price").val(p.price);
    $("#stock").val(p.stock);
    $("#image").val(p.image);
    $("#description").val(p.description);
  }
});

// UPDATE PRODUCT
$("#updateBtn").click(function () {
  const product = {
    name: $("#name").val(),
    category: $("#category").val(),
    brand: $("#brand").val(),
    price: Number($("#price").val()),
    stock: Number($("#stock").val()),
    image: $("#image").val(),
    description: $("#description").val()
  };

  $.ajax({
    url: API_URL + "/products/" + productId,
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token
    },
    contentType: "application/json",
    data: JSON.stringify(product),

    success: function () {
      $("#msg").css("color", "green").text("Product updated successfully");
      setTimeout(() => {
        window.location.href = "/admin/products";
      }, 800);
    },

    error: function () {
      $("#msg").css("color", "red").text("Update failed");
    }
  });
});
