# Complexity Analysis

## Challenge 3 — Recently Viewed Products

**Initial Approach:** plain array; `indexOf` + `splice` + `unshift` per view.
- Time: O(n) per view (n = history size)
- Space: O(n)

**Optimized Approach:** HashMap (`Map<id, node>`) + Doubly Linked List (LRU cache pattern).
- Time: O(1) average per view (map lookup + O(1) pointer rewiring to move a node to the front / evict the tail)
- Space: O(k), k = MAX_HISTORY (bounded at 5) → effectively O(1)

## Challenge 7 — Product Autocomplete

**Initial Approach:** scan every product on every keystroke, checking if name/brand/tags start with the query.
- Time: O(p·L) per keystroke (p = number of products, L = avg field length)
- Space: O(1) extra

**Optimized Approach:** Trie (prefix tree) built once from every product's name tokens, brand, and tags; each node stores the set of product ids reachable through that prefix.
- Build time (once): O(p·L)
- Time per keystroke: O(m) (m = length of the typed query) — no product-list scan at query time
- Space: O(p·L) (one set entry per character of every indexed word)
