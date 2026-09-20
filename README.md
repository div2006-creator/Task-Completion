# TechMart — Product Explorer

Implements **Challenge 3 (Recently Viewed Products)** and **Challenge 7 (Product Autocomplete)**
from the eCart DSA + UI challenge set. Total: 80 + 140 = **220 marks** (target was 150+).

## Run it

No build step — just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server
```

## What's implemented

| Challenge | Feature | Data structure used |
|---|---|---|
| 3 | Recently Viewed Products | HashMap + Doubly Linked List (LRU cache pattern), capped at 5 |
| 7 | Product Autocomplete | Trie (prefix tree) over product name / brand / tags |

See `COMPLEXITY.md` for the required time/space complexity write-up (naive vs. optimized)
for each challenge.

## Project structure

```
index.html
css/style.css
js/
  data.js                    ← provided dataset + getAllProducts() flatten helper
  ui.js                      ← shared render helpers (cards, modal, suggestions, history chips)
  app.js                     ← wires DOM events to the two features
  features/
    recentlyViewed.js        ← Challenge 3
    autocomplete.js          ← Challenge 7
```

## Submitting per the assignment's Rule 7 (branch per challenge)

This folder was developed with one commit per challenge so you can recreate the
required branch structure in your own class repo:

```bash
git checkout -b feature/challenge-03
git add js/features/recentlyViewed.js COMPLEXITY.md
git commit -m "Challenge 3: Recently Viewed Products (LRU cache)"
git push -u origin feature/challenge-03
# open a PR

git checkout main
git checkout -b feature/challenge-07
git add js/features/autocomplete.js
git commit -m "Challenge 7: Product Autocomplete (Trie)"
git push -u origin feature/challenge-07
# open a PR
```

(The base scaffold — `index.html`, `css/style.css`, `js/data.js`, `js/ui.js`,
`js/app.js` — goes on `main` before branching, since both features need it.)

## Edge cases handled

- **Recently Viewed:** empty state message, re-viewing an item moves it to front
  instead of duplicating, viewing a 6th distinct product evicts the oldest,
  "Clear history" resets everything.
- **Autocomplete:** empty query shows nothing, no-match query shows an explicit
  "No products found" row, search is case-insensitive, results capped at 5 and
  ranked by popularity (`rating × reviews`), clicking outside the search box
  closes the dropdown, full keyboard navigation (↑/↓/Enter/Esc).
