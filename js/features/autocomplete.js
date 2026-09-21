const Autocomplete = (function () {
  let productList = [];
  const MAX_SUGGESTIONS = 5;

  return {
    buildIndex: (products) => { productList = products; },
    search: (query) => {
      const q = (query || "").trim().toLowerCase();
      if (!q) return [];
      return productList
        .filter((p) => [p.name, p.brand, ...(p.tags || [])].some((t) => t.toLowerCase().includes(q)))
        .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
        .slice(0, MAX_SUGGESTIONS);
    },
    MAX_SUGGESTIONS
  };
})();