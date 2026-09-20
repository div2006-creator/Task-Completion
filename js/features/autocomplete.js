const Autocomplete = (function () {
  const MAX_SUGGESTIONS = 5;

  function TrieNode() {
    this.children = Object.create(null);
    this.productIds = new Set();
  }

  let root = new TrieNode();
  let productsById = new Map();

  function insertWord(word, productId) {
    if (!word) return;
    let node = root;
    for (const ch of word.toLowerCase()) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
      node.productIds.add(productId);
    }
  }

  function buildIndex(products) {
    root = new TrieNode();
    productsById = new Map();

    for (const p of products) {
      productsById.set(p.id, p);
      insertWord(p.name, p.id);
      p.name.split(/\s+/).forEach((w) => insertWord(w, p.id));
      insertWord(p.brand, p.id);
      (p.tags || []).forEach((t) => insertWord(t, p.id));
    }
  }

  function search(query) {
    const trimmed = (query || "").trim().toLowerCase();
    if (!trimmed) return [];

    let node = root;
    for (const ch of trimmed) {
      if (!node.children[ch]) return [];
      node = node.children[ch];
    }

    const matches = Array.from(node.productIds).map((id) => productsById.get(id));
    matches.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
    return matches.slice(0, MAX_SUGGESTIONS);
  }

  return { buildIndex, search, MAX_SUGGESTIONS };
})();