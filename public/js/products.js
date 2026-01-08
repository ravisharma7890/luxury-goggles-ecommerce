const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/admin/login";
}

// LOAD PRODUCTS
function loadProducts() {
  $.ajax({
    url: API_URL + "/products",
    method: "GET",

    success: function (products) {
      let rows = "";

      if (products.length === 0) {
        rows = `<tr><td colspan="5">No products found</td></tr>`;
      } else {
        products.forEach(p => {
          rows += `
            <tr>
              <td>${p.id}</td>
              <td>${p.name}</td>
              <td>₹${p.price}</td>
              <td>${p.stock}</td>
              <td>
                <a href="/admin/products/edit/${p.id}" class="btn-secondary">
                  Edit
                </a>
                <button class="deleteBtn" data-id="${p.id}">
                  Delete
                </button>
                <button onclick='addToCart({
                    id: ${p.id},
                    name: "${p.name}",
                    price: ${p.price}
                    })'>
                    Add to Cart
                </button>
              </td>
            </tr>
          `;
        });
      }

      $("#productsTable").html(rows);
    },

    error: function () {
      $("#productsTable").html(
        `<tr><td colspan="5">Failed to load products</td></tr>`
      );
    }
  });
}

// DELETE PRODUCT
$(document).on("click", ".deleteBtn", function () {
  const id = $(this).data("id");

  if (!confirm("Delete this product?")) return;

  $.ajax({
    url: API_URL + "/products/" + id,
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token
    },

    success: function () {
      loadProducts();
    },

    error: function (err) {
      alert(err.responseJSON?.message || "Delete failed");
    }
  });
});

function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push({ id, name, price, quantity: 1 });

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}

// INIT
loadProducts();
