/* =========================================================
   Challenge 3 - Recently Viewed Products
   =========================================================

   Feature requirement (recap):
     - Viewing a product moves it to the FRONT of the history
     - A product must never appear twice
     - History is capped at MAX_HISTORY items (5). Viewing a
       6th distinct product evicts the LEAST recently viewed
       one (the item at the tail).

   ---------------------------------------------------------
   Initial (naive) approach
   ---------------------------------------------------------
   Keep a plain array. To view a product:
     1. indexOf(id) to see if it's already there  -> O(n)
     2. splice() it out if found                  -> O(n)
     3. unshift() it onto the front                -> O(n)
   Time per view:  O(n)   (n = history size, capped at 5, so
                    this is technically fine here, but it's
                    the wrong pattern to reach for once history
                    isn't capped so small)
   Space: O(n)

   ---------------------------------------------------------
   Optimized approach (what's implemented below)
   ---------------------------------------------------------
   This is the classic "LRU Cache" pattern:
     - A HashMap (Map<id, node>) for O(1) "have we seen this
       product before?" lookups.
     - A Doubly Linked List to maintain viewing order, so
       moving a node to the front (or evicting the tail) is
       an O(1) pointer rewiring instead of an O(n) array shift.

   Time per view:   O(1) average (Map lookup + pointer moves)
   Space:           O(k) where k = MAX_HISTORY (bounded, so O(1))
   ========================================================= */

const RecentlyViewed = (function () {
  const MAX_HISTORY = 5;

  // --- Doubly linked list node ---
  function Node(productId) {
    this.productId = productId;
    this.prev = null;
    this.next = null;
  }

  // head = most recently viewed, tail = least recently viewed
  let head = null;
  let tail = null;
  let size = 0;
  const map = new Map(); // productId -> Node   (O(1) existence check)

  function detach(node) {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    if (node === head) head = node.next;
    if (node === tail) tail = node.prev;
    node.prev = null;
    node.next = null;
  }

  function attachToFront(node) {
    node.next = head;
    node.prev = null;
    if (head) head.prev = node;
    head = node;
    if (!tail) tail = node;
  }

  function view(productId) {
    const existing = map.get(productId);

    if (existing) {
      // Already in history: just move it to the front. O(1).
      if (existing !== head) {
        detach(existing);
        attachToFront(existing);
      }
      return;
    }

    // New product: create a node and push to the front. O(1).
    const node = new Node(productId);
    map.set(productId, node);
    attachToFront(node);
    size++;

    // Evict the least-recently-viewed item once we exceed the cap.
    if (size > MAX_HISTORY) {
      const evicted = tail;
      detach(evicted);
      map.delete(evicted.productId);
      size--;
    }
  }

  function clear() {
    head = null;
    tail = null;
    size = 0;
    map.clear();
  }

  // Returns ordered array of productIds, most recent first.
  function getHistory() {
    const ids = [];
    let node = head;
    while (node) {
      ids.push(node.productId);
      node = node.next;
    }
    return ids;
  }

  return { view, clear, getHistory, MAX_HISTORY };
})();
