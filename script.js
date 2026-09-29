const products = [
  { id: 1, name: 'Mario Party Superstars', category: 'Game', platform: 'Nintendo Switch', price: 49.99, image: 'assets/mario-party-superstars.png', description: 'A colorful party game packed with classic boards and mini-games for friends and family.' },
  { id: 2, name: 'Nintendo Switch Red Controller', category: 'Controller', platform: 'Nintendo Switch', price: 39.99, image: 'assets/red-controller.png', description: 'A bright red controller for comfortable Nintendo Switch play at home or on the go.' },
  { id: 3, name: 'Nintendo Switch Charger', category: 'Accessory', platform: 'Nintendo Switch', price: 24.99, image: 'assets/switch-charger.png', description: 'A wall charger and USB-C cable for powering a Nintendo Switch system.' },
  { id: 4, name: 'Luigi Shirt', category: 'Merchandise', platform: 'Apparel', price: 22.99, image: 'assets/luigi-shirt.png', description: 'A green gaming shirt featuring Luigi and colorful Super Mario-inspired artwork.' },
  { id: 5, name: 'Nintendo $100 Gift Card', category: 'Gift Card', platform: 'Nintendo eShop', price: 100.00, image: 'assets/switch-gift-card.png', description: 'A $100 Nintendo eShop gift card for purchasing digital games and downloadable content.' },
  { id: 6, name: 'Mario Kart 8 Deluxe', category: 'Game', platform: 'Nintendo Switch', price: 59.99, image: 'assets/mario-kart-8.png', description: 'A fast-paced racing game featuring Mario characters, creative tracks, and multiplayer racing.' },
  { id: 7, name: 'Pokémon Violet', category: 'Game', platform: 'Nintendo Switch', price: 54.99, image: 'assets/pokemon-violet.png', description: 'An open-world Pokémon adventure focused on exploration, training, battles, and discovery.' },
  { id: 8, name: 'The Legend of Zelda: Ocarina of Time 3D', category: 'Game', platform: 'Nintendo 3DS', price: 34.99, image: 'assets/zelda.png', description: 'A classic fantasy adventure featuring exploration, puzzles, combat, and the hero Link.' },
  { id: 9, name: 'RGB Gaming Mouse', category: 'Accessory', platform: 'PC', price: 29.99, image: 'assets/gaming-mouse.png', description: 'A wired gaming mouse with programmable buttons and colorful RGB lighting.' },
  { id: 10, name: 'RGB Gaming Headset', category: 'Accessory', platform: 'Multi-platform', price: 44.99, image: 'assets/headset.png', description: 'An over-ear gaming headset with a boom microphone and bright RGB lighting.' }
];

const COUPONS = {
  GALAXY10: { type: 'order', percent: 10, label: '10% off your order' },
  GAME15: { type: 'category', category: 'Game', percent: 15, label: '15% off games' }
};

function money(value) { return `$${value.toFixed(2)}`; }

function loadCart() {
  try { return JSON.parse(localStorage.getItem('gameGalaxyCart')) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem('gameGalaxyCart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = loadCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = count);
}

function addToCart(id) {
  const cart = loadCart();
  const found = cart.find(item => item.id === id);
  if (found) found.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart(cart);
  const product = products.find(p => p.id === id);
  alert(`${product.name} was added to your cart.`);
}

function renderProducts() {
  const container = document.getElementById('productGrid');
  if (!container) return;
  container.innerHTML = '';

  // JavaScript looping mechanism: every product is displayed with a for...of loop.
  for (const product of products) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image-wrap"><img src="${product.image}" alt="${product.name}"></div>
      <div class="product-info">
        <span class="category">${product.category}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="help"><strong>Platform:</strong> ${product.platform}</p>
        <div class="product-meta">
          <span class="price">${money(product.price)}</span>
          <button class="btn" type="button" data-add-id="${product.id}">Add to Cart</button>
        </div>
      </div>`;
    container.appendChild(card);
  }

  container.querySelectorAll('[data-add-id]').forEach(btn => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.addId)));
  });
}

function changeQty(id, amount) {
  const cart = loadCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += amount;
  if (item.qty <= 0) cart.splice(cart.indexOf(item), 1);
  saveCart(cart);
  renderCart();
  renderCheckoutSummary();
}

function removeFromCart(id) {
  const cart = loadCart().filter(item => item.id !== id);
  saveCart(cart);
  renderCart();
  renderCheckoutSummary();
}

function cartSubtotal() {
  return loadCart().reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function renderCart() {
  const list = document.getElementById('cartList');
  const summary = document.getElementById('cartSummary');
  if (!list || !summary) return;
  const cart = loadCart();

  if (!cart.length) {
    list.innerHTML = '<div class="notice">Your cart is empty. Visit the Products page to add items.</div>';
  } else {
    list.innerHTML = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      return `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <h3>${product.name}</h3>
          <p class="help">${money(product.price)} each</p>
          <div class="qty-controls">
            <button type="button" data-decrease="${product.id}">−</button>
            <strong>${item.qty}</strong>
            <button type="button" data-increase="${product.id}">+</button>
          </div>
        </div>
        <div>
          <strong>${money(product.price * item.qty)}</strong><br><br>
          <button class="remove-btn" type="button" data-remove="${product.id}">Remove</button>
        </div>
      </div>`;
    }).join('');
  }

  const subtotal = cartSubtotal();
  summary.innerHTML = `
    <div class="summary-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
    <div class="summary-row"><span>Estimated Shipping</span><strong>${subtotal ? '$5.99' : '$0.00'}</strong></div>
    <div class="summary-row total"><span>Estimated Total</span><strong>${money(subtotal ? subtotal + 5.99 : 0)}</strong></div>`;

  list.querySelectorAll('[data-decrease]').forEach(b => b.onclick = () => changeQty(Number(b.dataset.decrease), -1));
  list.querySelectorAll('[data-increase]').forEach(b => b.onclick = () => changeQty(Number(b.dataset.increase), 1));
  list.querySelectorAll('[data-remove]').forEach(b => b.onclick = () => removeFromCart(Number(b.dataset.remove)));
}

function showFieldError(input, message) {
  const error = document.getElementById(`${input.id}Error`);
  if (error) error.textContent = message;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  return !message;
}

function required(input, label) {
  return showFieldError(input, input.value.trim() ? '' : `${label} is required.`);
}

function validEmail(input) {
  if (!required(input, 'Email Address')) return false;
  return showFieldError(input, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()) ? '' : 'Enter a valid email address.');
}

function validZip(input) {
  if (!required(input, 'ZIP Code')) return false;
  return showFieldError(input, /^\d{5}(-\d{4})?$/.test(input.value.trim()) ? '' : 'Enter a 5-digit ZIP Code (or ZIP+4).');
}

function validPhone(input) {
  if (!required(input, 'Phone Number')) return false;
  const digits = input.value.replace(/\D/g, '');
  return showFieldError(input, digits.length === 10 ? '' : 'Enter a 10-digit phone number.');
}

function validCard(input) {
  if (!required(input, 'Credit Card Number')) return false;
  const digits = input.value.replace(/\D/g, '');
  return showFieldError(input, /^\d{13,19}$/.test(digits) ? '' : 'Enter 13 to 19 digits.');
}

function validExpiration(input) {
  if (!required(input, 'Expiration Date')) return false;
  const match = input.value.trim().match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!match) return showFieldError(input, 'Use MM/YY format.');
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const now = new Date();
  const expires = new Date(year, month, 0, 23, 59, 59);
  return showFieldError(input, expires >= now ? '' : 'Expiration date must be in the future.');
}

function validSecurityCode(input) {
  if (!required(input, 'Security Code')) return false;
  return showFieldError(input, /^\d{3,4}$/.test(input.value.trim()) ? '' : 'Enter a 3- or 4-digit security code.');
}

function validateContactForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const ok = validEmail(form.email) & required(form.message, 'Message');
  const box = document.getElementById('contactSuccess');
  if (ok) {
    box.style.display = 'block';
    box.textContent = 'Thank you! Your message passed validation and is ready to be submitted.';
    form.reset();
  }
}

let activeCoupon = null;

function calculateDiscount() {
  const cart = loadCart();
  if (!activeCoupon) return 0;
  if (activeCoupon.type === 'order') return cartSubtotal() * (activeCoupon.percent / 100);
  if (activeCoupon.type === 'category') {
    return cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      if (product && product.category === activeCoupon.category) {
        return sum + product.price * item.qty * (activeCoupon.percent / 100);
      }
      return sum;
    }, 0);
  }
  return 0;
}

function applyCoupon() {
  const input = document.getElementById('couponCode');
  const message = document.getElementById('couponMessage');
  const code = input.value.trim().toUpperCase();
  if (!code) {
    activeCoupon = null;
    message.textContent = 'Enter a coupon code.';
    message.style.color = '#ffaaa7';
  } else if (COUPONS[code]) {
    activeCoupon = COUPONS[code];
    message.textContent = `Coupon accepted: ${activeCoupon.label}.`;
    message.style.color = '#8df0b2';
  } else {
    activeCoupon = null;
    message.textContent = 'That coupon code does not exist.';
    message.style.color = '#ffaaa7';
  }
  renderCheckoutSummary();
}

function renderCheckoutSummary() {
  const holder = document.getElementById('checkoutSummary');
  if (!holder) return;
  const subtotal = cartSubtotal();
  const shipping = subtotal ? 5.99 : 0;
  const discount = calculateDiscount();
  const total = Math.max(0, subtotal + shipping - discount);
  holder.innerHTML = `
    <div class="summary-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
    <div class="summary-row"><span>Shipping</span><strong>${money(shipping)}</strong></div>
    <div class="summary-row"><span>Discount</span><strong>−${money(discount)}</strong></div>
    <div class="summary-row total"><span>Total</span><strong>${money(total)}</strong></div>`;
}

function validateCheckout(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const checks = [
    required(form.shippingName, 'Full Name'),
    required(form.street, 'Street Address'),
    required(form.city, 'City'),
    required(form.state, 'State'),
    validZip(form.zip),
    validPhone(form.phone),
    required(form.cardholder, 'Cardholder Name'),
    validCard(form.cardNumber),
    validExpiration(form.expiration),
    validSecurityCode(form.securityCode)
  ];
  const success = document.getElementById('checkoutSuccess');
  const error = document.getElementById('checkoutError');
  if (checks.every(Boolean) && loadCart().length) {
    success.style.display = 'block';
    error.style.display = 'none';
    success.textContent = 'All required checkout fields are valid. Demo purchase complete!';
    localStorage.removeItem('gameGalaxyCart');
    activeCoupon = null;
    updateCartCount();
    renderCheckoutSummary();
    form.reset();
  } else {
    success.style.display = 'none';
    error.style.display = 'block';
    error.textContent = loadCart().length ? 'Please correct the highlighted required fields.' : 'Your cart is empty. Add at least one product before checking out.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderProducts();
  renderCart();
  renderCheckoutSummary();

  const contact = document.getElementById('contactForm');
  if (contact) contact.addEventListener('submit', validateContactForm);

  const checkout = document.getElementById('checkoutForm');
  if (checkout) checkout.addEventListener('submit', validateCheckout);

  const couponButton = document.getElementById('applyCoupon');
  if (couponButton) couponButton.addEventListener('click', applyCoupon);
});
