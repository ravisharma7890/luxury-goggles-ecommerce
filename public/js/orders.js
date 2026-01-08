const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/admin/login";
}

function badge(status) {
    if (status === "pending") return "badge badge-pending";
    if (status === "shipped") return "badge badge-shipped";
    return "badge badge-delivered";
}

// LOAD ORDERS
function loadOrders() {
    $.ajax({
        url: API_URL + "/orders",
        method: "GET",
        headers: {
            Authorization: "Bearer " + token
        },
        success: function (orders) {
            let rows = "";

            if (orders.length === 0) {
                rows = `<tr><td colspan="6">No orders found</td></tr>`;
            } else {
                orders.forEach(o => {
                    rows += `
            <tr>
              <td>${o.id}</td>
              <td>${o.customer_name}</td>
              <td>${o.customer_email || "-"}</td>
              <td>₹${o.total}</td>
              <td>
                <select class="statusSelect ${badge(o.status)}"
                        data-id="${o.id}">
                  <option value="pending" ${o.status === "pending" ? "selected" : ""}>Pending</option>
                  <option value="shipped" ${o.status === "shipped" ? "selected" : ""}>Shipped</option>
                  <option value="delivered" ${o.status === "delivered" ? "selected" : ""}>Delivered</option>
                </select>
              </td>
              <td>${new Date(o.created_at).toLocaleString()}</td>
                <td>
                    <a href="/admin/orders/${o.id}" class="btn-secondary">
                    View
                    </a>
                </td>
            </tr>
          `;
                });
            }

            $("#ordersTable").html(rows);
        }
    });
}

// UPDATE STATUS
$(document).on("change", ".statusSelect", function () {
    const id = $(this).data("id");
    const status = $(this).val();

    $.ajax({
        url: API_URL + "/orders/" + id + "/status",
        method: "PUT",
        headers: {
            Authorization: "Bearer " + token
        },
        contentType: "application/json",
        data: JSON.stringify({ status }),
        success: function () {
            loadOrders();
        }
    });
});

loadOrders();
