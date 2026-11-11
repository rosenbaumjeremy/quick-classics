# Quick Classics

Great books, one swipeable idea at a time. A static site: `site/` is the finished output,
deployed by Cloudflare Workers Builds on every push to `main` (see `wrangler.jsonc`).

## Adding a book

Append an entry to `site/data/lessons.json` (the library shows the newest first):

```json
{ "id": "day-2", "label": "Day 2", "title": "…", "author": "…", "year": 1900, "minutes": 7,
  "added": "YYYY-MM-DD", "cards": [ { "k": "story", "t": "Card title", "b": "Card body" } ] }
```

Every deck opens with a `preview` card ("What you'll learn"): `"b"` is a one-line lead-in and
`"pts"` is 3–5 `{"h": label, "d": sentence}` items. Other card kinds (`k`): `story`, `character`, `theme`, `lesson`, `reflect`, and `quote` (adds `"q"`, the quoted line).

## Adding a non-fiction book

Non-fiction has its own shelf (`#nonfiction`) and file, `site/data/nonfiction.json`, so the daily
classics routine never touches it. Entries add a `category` (shown on the tile; used later to split
the shelf into sub-categories) and an optional `subtitle`:

```json
{ "id": "blink", "label": "Book 1", "category": "Psychology", "title": "Blink",
  "subtitle": "The Power of Thinking Without Thinking", "author": "…", "year": 2005, "minutes": 18,
  "added": "YYYY-MM-DD", "cards": [ { "k": "concept", "t": "Card title", "b": "Card body" } ] }
```

Card kinds, in this order: one `preview`, 2–3 `argument` (the book's thesis), then `concept` (key ideas) and
`case` (the studies and stories behind them) interleaved in the book's order, one `quote`
(paraphrased unless the book is public domain), 1–2 `critique` (where the evidence is disputed),
4–8 `lesson`, and a final `reflect`. Argument, concept and case cards run 90–130 words so the
reader understands each idea, not just its name; lessons and critiques 50–100.

`python scripts/check_lessons.py` checks both shelves; ids must be unique across them.

## Run locally

```
python -m http.server 8150 --directory site
```
