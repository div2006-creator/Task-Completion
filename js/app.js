document.addEventListener("DOMContentLoaded", () => {
  const products = getAllProducts();
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

  Autocomplete.buildIndex(products);
  renderProductGrid(products, gridEl);
  renderRecentlyViewed(recentlyViewedList, recentlyViewedEmpty);

  function viewProduct(id) {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    RecentlyViewed.view(id);
    renderRecentlyViewed(recentlyViewedList, recentlyViewedEmpty);
    renderModal(modal, product);
  }

  gridEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-product-id]");
    if (btn) viewProduct(btn.dataset.productId);
  });

  recentlyViewedList.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-product-id]");
    if (chip) viewProduct(chip.dataset.productId);
  });

  clearHistoryBtn.addEventListener("click", () => {
    RecentlyViewed.clear();
    renderRecentlyViewed(recentlyViewedList, recentlyViewedEmpty);
  });

  modalClose.addEventListener("click", () => (modal.hidden = true));
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.hidden = true; });

  function updateSuggestions() {
    const query = searchInput.value;
    currentSuggestions = Autocomplete.search(query);
    selectedIndex = -1;
    renderSuggestions(suggestionList, currentSuggestions, query, selectedIndex);
  }

  searchInput.addEventListener("input", updateSuggestions);

  searchInput.addEventListener("keydown", (e) => {
    if (suggestionList.hidden || !currentSuggestions.length) return;
    const len = currentSuggestions.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % len;
      renderSuggestions(suggestionList, currentSuggestions, searchInput.value, selectedIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + len) % len;
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
    if (li) {
      const product = products.find((p) => p.id === li.dataset.productId);
      if (product) {
        searchInput.value = product.name;
        suggestionList.hidden = true;
        viewProduct(product.id);
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-box")) suggestionList.hidden = true;
  });
});