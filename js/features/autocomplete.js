/* =========================================================
   Challenge 7 - Product Autocomplete
   =========================================================

   Feature requirement (recap):
     Typing a prefix (e.g. "lap") should instantly suggest
     matching products, searching across product name, brand,
     and tags - highlighted, keyboard-navigable, capped at 5
     results, ordered by relevance.

   ---------------------------------------------------------
   Initial (naive) approach
   ---------------------------------------------------------
   On every keystroke, loop over every product and check
   whether name/brand/tags start with (or contain) the typed
   text.
   Time per keystroke: O(p * L)  (p = number of products,
                        L = avg length of name/brand/tags)
   This is fine for a few dozen products, but re-scans
   everything on every single character typed - it does not
   scale as the catalog grows into the thousands/millions.

   ---------------------------------------------------------
   Optimized approach (what's implemented below)
   ---------------------------------------------------------
   Build a Trie (prefix tree) once, up front, from every
   word that could be typed: each product's name tokens,
   brand, and tags. Every Trie node stores the SET of product
   ids that pass through it, so looking up a prefix is just
   "walk the trie one character at a time" and then read the
   set already sitting at that node - no scanning of the
   product list at query time at all.

   Time to build the trie:  O(p * L)   -- done once, not per keystroke
   Time per keystroke:      O(m)       -- m = length of the typed text
   Space:                   O(p * L)   -- one set-membership per
                                          character of every indexed word
   ========================================================= */

const Autocomplete = (function () {
  const MAX_SUGGESTIONS = 5;

  function TrieNode() {
    this.children = Object.create(null);
    this.productIds = new Set(); // every product reachable through this prefix
  }

  let root = new TrieNode();
  let productsById = new Map();

  function insertWord(word, productId) {
    if (!word) return;
    let node = root;
    const normalized = word.toLowerCase();
    for (const ch of normalized) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
      node.productIds.add(productId);
    }
  }

  /**
   * Builds the trie from a product list. Call once on load.
   * Indexes: full product name, each individual word in the
   * name, the brand, and every tag - so "lap" matches both a
   * product literally named "Laptop" and a tagged "laptop"
   * like "Dell Inspiron 14".
   */
  function buildIndex(products) {
    root = new TrieNode();
    productsById = new Map();

    for (const product of products) {
      productsById.set(product.id, product);

      insertWord(product.name, product.id);
      for (const word of product.name.split(/\s+/)) {
        insertWord(word, product.id);
      }
      insertWord(product.brand, product.id);
      for (const tag of product.tags || []) {
        insertWord(tag, product.id);
      }
    }
  }

  /**
   * Returns up to MAX_SUGGESTIONS products whose name/brand/tag
   * starts with `query`, most relevant first (relevance here =
   * rating * reviews, same popularity signal used elsewhere).
   */
  function search(query) {
    const trimmed = (query || "").trim().toLowerCase();
    if (!trimmed) return [];

    let node = root;
    for (const ch of trimmed) {
      if (!node.children[ch]) return []; // no product has this prefix
      node = node.children[ch];
    }

    const matches = Array.from(node.productIds).map((id) => productsById.get(id));

    matches.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);

    return matches.slice(0, MAX_SUGGESTIONS);
  }

  return { buildIndex, search, MAX_SUGGESTIONS };
})();
