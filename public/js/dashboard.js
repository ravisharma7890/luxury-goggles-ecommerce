const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

let ordersChart, revenueChart;

function loadDashboard(range = "week") {
  $.ajax({
    url: API_URL + "/dashboard/stats?range=" + range,
    method: "GET",
    headers: {
      Authorization: "Bearer " + token
    },
    success: function (data) {
      $("#totalOrders").text(data.totalOrders);
      $("#paidOrders").text(data.paidOrders);
      $("#totalRevenue").text(data.totalRevenue);

      // Destroy old charts
      if (ordersChart) ordersChart.destroy();
      if (revenueChart) revenueChart.destroy();

      ordersChart = new Chart($("#ordersChart"), {
        type: "line",
        data: {
          labels: data.ordersByDay.map(d => d.date),
          datasets: [{
            label: "Orders",
            data: data.ordersByDay.map(d => d.count),
            borderColor: "#2563eb",
            fill: false
          }]
        }
      });

      revenueChart = new Chart($("#revenueChart"), {
        type: "bar",
        data: {
          labels: data.revenueByDay.map(d => d.date),
          datasets: [{
            label: "Revenue ₹",
            data: data.revenueByDay.map(d => d.amount),
            backgroundColor: "#10b981"
          }]
        }
      });
    }
  });
}

// Filter button click
$(".filter-btn").click(function () {
  $(".filter-btn").removeClass("active");
  $(this).addClass("active");

  const range = $(this).data("range");
  loadDashboard(range);
});

// Initial load
loadDashboard("week");
