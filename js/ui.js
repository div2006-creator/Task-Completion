const formatPrice = (v) => "₹" + Number(v).toLocaleString("en-IN");

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function highlightMatch(text, query) {
  const safeText = escapeHtml(text);
  if (!query) return safeText;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return safeText;
  return `${escapeHtml(text.slice(0, idx))}<mark>${escapeHtml(text.slice(idx, idx + query.length))}</mark>${escapeHtml(text.slice(idx + query.length))}`;
}

const renderStars = (rating) => `⭐ ${rating.toFixed(1)}`;

function renderProductGrid(products, container) {
  if (!products.length) {
    container.innerHTML = `<p class="empty-state">No products found.</p>`;
    return;
  }
  container.innerHTML = products.map((p) => `
    <div class="product-card">
      <div class="product-card__body">
        <h3 class="product-card__name">${escapeHtml(p.name)}</h3>
        <p class="product-card__brand">${escapeHtml(p.brand)}</p>
        <p class="product-card__price">${formatPrice(p.price)}</p>
        <p class="product-card__rating">${renderStars(p.rating)} &middot; ${p.reviews} reviews</p>
        <button class="btn btn--view" data-product-id="${p.id}">View Product</button>
      </div>
    </div>
  `).join("");
}

function renderRecentlyViewed(container, emptyEl) {
  const ids = RecentlyViewed.getHistory();
  const allProducts = getAllProducts();
  emptyEl.hidden = ids.length > 0;
  container.innerHTML = ids
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean)
    .map((p) => `<button class="history-chip" data-product-id="${p.id}">${escapeHtml(p.name)}</button>`)
    .join("");
}

function renderSuggestions(listEl, products, query, selectedIndex) {
  if (!query.trim()) return (listEl.hidden = true);
  listEl.hidden = false;
  if (!products.length) {
    listEl.innerHTML = `<li class="suggestion suggestion--empty">No products found.</li>`;
    return;
  }
  listEl.innerHTML = products.map((p, i) => `
    <li class="suggestion${i === selectedIndex ? " suggestion--active" : ""}" data-product-id="${p.id}" role="option">
      ${highlightMatch(p.name, query)} <span class="suggestion__brand">${escapeHtml(p.brand)}</span>
    </li>
  `).join("");
}

function renderModal(modalEl, product) {
  modalEl.querySelector(".modal__title").textContent = product.name;
  modalEl.querySelector(".modal__brand").textContent = product.brand;
  modalEl.querySelector(".modal__price").textContent = formatPrice(product.price);
  modalEl.querySelector(".modal__rating").textContent = `${renderStars(product.rating)} · ${product.reviews} reviews · ${product.stock} in stock`;
  modalEl.querySelector(".modal__specs").innerHTML = Object.entries(product.specifications || {})
    .map(([k, v]) => `<li><strong>${escapeHtml(k)}:</strong> ${escapeHtml(String(v))}</li>`)
    .join("");
  modalEl.hidden = false;
}