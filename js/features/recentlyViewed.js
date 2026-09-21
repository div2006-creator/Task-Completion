const RecentlyViewed = (function () {
  let history = [];
  const MAX_HISTORY = 5;

  return {
    view: (id) => { history = [id, ...history.filter((x) => x !== id)].slice(0, MAX_HISTORY); },
    clear: () => { history = []; },
    getHistory: () => history,
    MAX_HISTORY
  };
})();