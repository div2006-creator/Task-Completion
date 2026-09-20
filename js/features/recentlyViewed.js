

const RecentlyViewed = (function () {
  const MAX_HISTORY = 5;

  function Node(productId) {
    this.productId = productId;
    this.prev = null;
    this.next = null;
  }

  let head = null;
  let tail = null;
  let size = 0;
  const map = new Map();

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

      if (existing !== head) {
        detach(existing);
        attachToFront(existing);
      }
      return;
    }

    const node = new Node(productId);
    map.set(productId, node);
    attachToFront(node);
    size++;

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