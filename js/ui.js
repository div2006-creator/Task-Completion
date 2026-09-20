

function formatPrice(value) {
  return "₹" + Number(value).toLocaleString("en-IN");
}

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
  const before = escapeHtml(text.slice(0, idx));
  const match = escapeHtml(text.slice(idx, idx + query.length));
  const after = escapeHtml(text.slice(idx + query.length));
  return `${before}<mark>${match}</mark>${after}`;
}

function renderStars(rating) {
  return `⭐ ${rating.toFixed(1)}`;
}

function renderProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <div class="product-card__body">
      <h3 class="product-card__name">${escapeHtml(product.name)}</h3>
      <p class="product-card__brand">${escapeHtml(product.brand)}</p>
      <p class="product-card__price">${formatPrice(product.price)}</p>
      <p class="product-card__rating">${renderStars(product.rating)} &middot; ${product.reviews} reviews</p>
      <button class="btn btn--view" data-product-id="${product.id}">View Product</button>
    </div>
  `;
  return card;
}

function renderProductGrid(products, container) {
  container.innerHTML = "";
  if (!products.length) {
    container.innerHTML = `<p class="empty-state">No products found.</p>`;
    return;
  }
  const fragment = document.createDocumentFragment();
  products.forEach((p) => fragment.appendChild(renderProductCard(p)));
  container.appendChild(fragment);
}

function renderRecentlyViewed(container, emptyEl) {
  const ids = RecentlyViewed.getHistory();
  container.innerHTML = "";

  if (!ids.length) {
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;

  const fragment = document.createDocumentFragment();
  ids.forEach((id) => {
    const product = getAllProducts().find((p) => p.id === id);
    if (!product) return;
    const chip = document.createElement("button");
    chip.className = "history-chip";
    chip.dataset.productId = product.id;
    chip.textContent = product.name;
    fragment.appendChild(chip);
  });
  container.appendChild(fragment);
}

function renderSuggestions(listEl, products, query, selectedIndex) {
  listEl.innerHTML = "";

  if (!query.trim()) {
    listEl.hidden = true;
    return;
  }

  if (!products.length) {
    listEl.hidden = false;
    listEl.innerHTML = `<li class="suggestion suggestion--empty">No products found.</li>`;
    return;
  }

  listEl.hidden = false;
  products.forEach((product, i) => {
    const li = document.createElement("li");
    li.className = "suggestion" + (i === selectedIndex ? " suggestion--active" : "");
    li.dataset.productId = product.id;
    li.setAttribute("role", "option");
    li.innerHTML = `${highlightMatch(product.name, query)} <span class="suggestion__brand">${escapeHtml(product.brand)}</span>`;
    listEl.appendChild(li);
  });
}

function renderModal(modalEl, product) {
  modalEl.querySelector(".modal__title").textContent = product.name;
  modalEl.querySelector(".modal__brand").textContent = product.brand;
  modalEl.querySelector(".modal__price").textContent = formatPrice(product.price);
  modalEl.querySelector(".modal__rating").textContent = `${renderStars(product.rating)} · ${product.reviews} reviews · ${product.stock} in stock`;

  const specsEl = modalEl.querySelector(".modal__specs");
  specsEl.innerHTML = "";
  Object.entries(product.specifications || {}).forEach(([key, value]) => {
    const row = document.createElement("li");
    row.innerHTML = `<strong>${escapeHtml(key)}:</strong> ${escapeHtml(String(value))}`;
    specsEl.appendChild(row);
  });

  modalEl.hidden = false;
}