# Quick Classics

Great books, one swipeable idea at a time. A static site: `site/` is the finished output,
deployed by Cloudflare Workers Builds on every push to `main` (see `wrangler.jsonc`).

## Adding a book

Append an entry to `site/data/lessons.json` (the library shows the newest first):

```json
{ "id": "day-2", "label": "Day 2", "title": "…", "author": "…", "year": 1900, "minutes": 7,
  "added": "YYYY-MM-DD", "cards": [ { "k": "story", "t": "Card title", "b": "Card body" } ] }
```

Card kinds (`k`): `story`, `character`, `theme`, `lesson`, `reflect`, and `quote` (adds `"q"`, the quoted line).

## Run locally

```
python -m http.server 8150 --directory site
```
