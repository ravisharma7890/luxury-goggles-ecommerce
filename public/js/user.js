function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
  // subtle feedback (luxury ≠ loud alerts)
  const btn = event.target;
  const old = btn.innerText;
  btn.innerText = "Added ✓";
  setTimeout(() => (btn.innerText = old), 1200);

}


function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const badge = document.getElementById("cartCount");
  if (!badge) return;

  if (count > 0) {
    badge.innerText = count;
    badge.classList.add("show");
  } else {
    badge.classList.remove("show");
  }
}

// Call on page load
document.addEventListener("DOMContentLoaded", updateCartBadge);
