let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartList = document.getElementById("cartList");
const emptyCart = document.getElementById("emptyCart");
const subTotalEl = document.getElementById("subTotal");
const grandTotalEl = document.getElementById("grandTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

function renderCart() {
  cartList.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    emptyCart.style.display = "block";
    checkoutBtn.style.pointerEvents = "none";
    checkoutBtn.style.opacity = "0.5";
    subTotalEl.innerText = "0";
    grandTotalEl.innerText = "0";
    return;
  }

  emptyCart.style.display = "none";
  checkoutBtn.style.pointerEvents = "auto";
  checkoutBtn.style.opacity = "1";

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    cartList.innerHTML += `
      <div class="cart-item">
        <img src="${item.image || 'https://via.placeholder.com/120'}" />
        <div>
          <h3>${item.name}</h3>
          <p>₹${item.price}</p>
          <div class="qty">Qty: ${item.quantity}</div>
        </div>
        <button class="remove-btn" onclick="removeItem(${index})">
          Remove
        </button>
      </div>
    `;
  });

  subTotalEl.innerText = total;
  grandTotalEl.innerText = total;
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

renderCart();
