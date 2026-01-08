// const API_URL = "http://localhost:5000/api";
const cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

cart.forEach(i => total += i.price * i.quantity);

$("#payBtn").click(async function () {

  // 1️⃣ Create order in backend
  const orderRes = await $.ajax({
    url: API_URL + "/orders/create",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      customer_name: $("#name").val(),
      customer_email: $("#email").val(),
      items: cart
    })
  });

  const orderId = orderRes.orderId;

  // 2️⃣ Create razorpay order
  const razorRes = await $.ajax({
    url: API_URL + "/payment/create-order",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      orderId,
      amount: total
    })
  });

  const options = {
    key: razorRes.key,
    amount: total * 100,
    currency: "INR",
    order_id: razorRes.order.id,
    handler: function (response) {

      // 3️⃣ Verify payment
      $.ajax({
        url: API_URL + "/payment/verify",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          ...response,
          orderId
        }),
        success: function () {
          alert("Payment successful");
          localStorage.removeItem("cart");
          window.location.href = "/";
        }
      });
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
});
