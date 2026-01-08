const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/admin/login";
}

const orderId = window.location.pathname.split("/").pop();

$.ajax({
  url: API_URL + "/orders/" + orderId,
  method: "GET",
  headers: {
    Authorization: "Bearer " + token
  },
  success: function (res) {
    const { order, items } = res;

    $("#orderId").text(order.id);
    $("#customer").text(order.customer_name);
    $("#email").text(order.customer_email || "-");
    $("#status").text(order.status);
    $("#total").text(order.total);

    let rows = "";
    items.forEach(i => {
      rows += `
        <tr>
          <td>${i.product_name}</td>
          <td>₹${i.price}</td>
          <td>${i.quantity}</td>
          <td>₹${i.price * i.quantity}</td>
        </tr>
      `;
    });

    $("#itemsTable").html(rows);
  }
});
