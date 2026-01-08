const API_URL = "http://localhost:5000/api";

// CART from localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length === 0) {
  alert("Cart is empty");
//   window.location.href = "/";
}

// RENDER CART
let total = 0;
let rows = "";

cart.forEach(item => {
  const sub = item.price * item.quantity;
  total += sub;

  rows += `
    <tr>
      <td>${item.name}</td>
      <td>₹${item.price}</td>
      <td>${item.quantity}</td>
      <td>₹${sub}</td>
    </tr>
  `;
});

$("#cartTable").html(rows);
$("#total").text(total);

// PLACE ORDER
$("#placeOrderBtn").click(function () {
  const name = $("#name").val();
  const email = $("#email").val();

  if (!name || !email) {
    $("#msg").css("color", "red").text("Name & Email required");
    return;
  }

  $.ajax({
    url: API_URL + "/orders/create",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      customer_name: name,
      customer_email: email,
      items: cart
    }),
    success: function (res) {
      localStorage.removeItem("cart");
      $("#msg").css("color", "green")
        .text("Order placed successfully. Order ID: " + res.orderId);

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    },
    error: function () {
      $("#msg").css("color", "red").text("Order failed");
    }
  });
});
