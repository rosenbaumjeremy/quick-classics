"""Check site/data/lessons.json before publishing. Exit 1 with a list of problems if anything is wrong.

Usage: python scripts/check_lessons.py [path]
"""
import json
import re
import sys

KINDS = {"story", "character", "theme", "lesson", "quote", "reflect"}
path = sys.argv[1] if len(sys.argv) > 1 else "site/data/lessons.json"
errors = []

try:
    with open(path, encoding="utf-8") as f:
        lessons = json.load(f)
except Exception as e:  # not valid JSON at all
    print(f"FAIL: {path} does not parse: {e}")
    sys.exit(1)

if not isinstance(lessons, list):
    errors.append("top level must be a list")
    lessons = []

ids = set()
for n, l in enumerate(lessons):
    where = f"entry {n} ({l.get('id', '?')})" if isinstance(l, dict) else f"entry {n}"
    if not isinstance(l, dict):
        errors.append(f"{where}: not an object")
        continue
    for key, typ in [("id", str), ("label", str), ("title", str), ("author", str),
                     ("year", int), ("minutes", int), ("added", str), ("cards", list)]:
        if not isinstance(l.get(key), typ):
            errors.append(f"{where}: '{key}' missing or not {typ.__name__}")
    if l.get("id") in ids:
        errors.append(f"{where}: duplicate id")
    ids.add(l.get("id"))
    if isinstance(l.get("added"), str) and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", l["added"]):
        errors.append(f"{where}: 'added' must be YYYY-MM-DD")
    cards = l.get("cards") if isinstance(l.get("cards"), list) else []
    if len(cards) < 15:
        errors.append(f"{where}: only {len(cards)} cards")
    story = [c for c in cards if isinstance(c, dict) and c.get("k") == "story"]
    if len(story) < 12:
        errors.append(f"{where}: only {len(story)} story cards (need 12-14 for a full summary)")
    short = [c.get("t") for c in story if isinstance(c.get("b"), str) and len(c["b"].split()) < 70]
    if short:
        errors.append(f"{where}: story cards under 70 words: {short}")
    for i, c in enumerate(cards):
        cw = f"{where} card {i}"
        if not isinstance(c, dict):
            errors.append(f"{cw}: not an object")
            continue
        if c.get("k") not in KINDS:
            errors.append(f"{cw}: bad kind {c.get('k')!r}")
        for key in ("t", "b"):
            if not isinstance(c.get(key), str) or not c[key].strip():
                errors.append(f"{cw}: '{key}' missing or empty")
        if c.get("k") == "quote" and not (isinstance(c.get("q"), str) and c["q"].strip()):
            errors.append(f"{cw}: quote card needs 'q'")

if errors:
    print("FAIL:\n  " + "\n  ".join(errors))
    sys.exit(1)
print(f"OK: {len(lessons)} books, {sum(len(l['cards']) for l in lessons)} cards")
