/* =========================================================
   app.js - entry point. Wires DOM events to the two features
   (Autocomplete, RecentlyViewed) and shared UI renderers.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const products = getAllProducts();

  // Elements
  const gridEl = document.getElementById("product-grid");
  const searchInput = document.getElementById("search-input");
  const suggestionList = document.getElementById("suggestion-list");
  const recentlyViewedList = document.getElementById("recently-viewed-list");
  const recentlyViewedEmpty = document.getElementById("recently-viewed-empty");
  const clearHistoryBtn = document.getElementById("clear-history-btn");
  const modal = document.getElementById("product-modal");
  const modalClose = document.getElementById("modal-close");

  let currentSuggestions = [];
  let selectedIndex = -1;

  // ---------- initial render ----------
  Autocomplete.buildIndex(products);
  renderProductGrid(products, gridEl);
  renderRecentlyViewed(recentlyViewedList, recentlyViewedEmpty);

  // ---------- view product (shared by grid + history chips + suggestions) ----------
  function viewProduct(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) return; // edge case: unknown/removed id

    RecentlyViewed.view(productId);
    renderRecentlyViewed(recentlyViewedList, recentlyViewedEmpty);
    renderModal(modal, product);
  }

  // ---------- product grid: "View Product" (event delegation) ----------
  gridEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-product-id]");
    if (!btn) return;
    viewProduct(btn.dataset.productId);
  });

  // ---------- recently viewed chips ----------
  recentlyViewedList.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-product-id]");
    if (!chip) return;
    viewProduct(chip.dataset.productId);
  });

  clearHistoryBtn.addEventListener("click", () => {
    RecentlyViewed.clear();
    renderRecentlyViewed(recentlyViewedList, recentlyViewedEmpty);
  });

  // ---------- modal ----------
  modalClose.addEventListener("click", () => (modal.hidden = true));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.hidden = true; // click outside content
  });

  // ---------- autocomplete ----------
  function updateSuggestions() {
    const query = searchInput.value;
    currentSuggestions = Autocomplete.search(query);
    selectedIndex = -1;
    renderSuggestions(suggestionList, currentSuggestions, query, selectedIndex);
  }

  searchInput.addEventListener("input", updateSuggestions);

  searchInput.addEventListener("keydown", (e) => {
    if (suggestionList.hidden || !currentSuggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % currentSuggestions.length;
      renderSuggestions(suggestionList, currentSuggestions, searchInput.value, selectedIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
      renderSuggestions(suggestionList, currentSuggestions, searchInput.value, selectedIndex);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const chosen = currentSuggestions[selectedIndex] ?? currentSuggestions[0];
      if (chosen) {
        searchInput.value = chosen.name;
        suggestionList.hidden = true;
        viewProduct(chosen.id);
      }
    } else if (e.key === "Escape") {
      suggestionList.hidden = true;
    }
  });

  suggestionList.addEventListener("click", (e) => {
    const li = e.target.closest("[data-product-id]");
    if (!li) return;
    const product = products.find((p) => p.id === li.dataset.productId);
    if (!product) return;
    searchInput.value = product.name;
    suggestionList.hidden = true;
    viewProduct(product.id);
  });

  // click outside search -> close suggestions
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-box")) {
      suggestionList.hidden = true;
    }
  });
});
