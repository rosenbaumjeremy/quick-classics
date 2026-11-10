"""Check the site's book data before publishing. Exit 1 with a list of problems if anything is wrong.

Checks site/data/lessons.json (Classics shelf) and site/data/nonfiction.json (Non-Fiction shelf).

Usage: python scripts/check_lessons.py            # both shelves
       python scripts/check_lessons.py <path>     # one file; nonfiction rules if its name says so
"""
import json
import os
import re
import sys

CLASSIC_KINDS = {"story", "character", "theme", "lesson", "quote", "reflect"}
NONFICTION_KINDS = {"argument", "concept", "case", "critique", "lesson", "quote", "reflect"}
LONG_KINDS = {"argument", "concept", "case"}  # non-fiction cards that must explain, not just name

errors = []
ids = set()


def load(path):
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:  # not valid JSON at all
        errors.append(f"{path} does not parse: {e}")
        return []
    if not isinstance(data, list):
        errors.append(f"{path}: top level must be a list")
        return []
    return data


def check_common(l, where, kinds, extra_keys=()):
    for key, typ in [("id", str), ("label", str), ("title", str), ("author", str),
                     ("year", int), ("minutes", int), ("added", str), ("cards", list), *extra_keys]:
        if not isinstance(l.get(key), typ):
            errors.append(f"{where}: '{key}' missing or not {typ.__name__}")
    if l.get("id") in ids:
        errors.append(f"{where}: duplicate id (ids must be unique across both shelves)")
    ids.add(l.get("id"))
    if isinstance(l.get("added"), str) and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", l["added"]):
        errors.append(f"{where}: 'added' must be YYYY-MM-DD")
    cards = l.get("cards") if isinstance(l.get("cards"), list) else []
    if len(cards) < 15:
        errors.append(f"{where}: only {len(cards)} cards")
    for i, c in enumerate(cards):
        cw = f"{where} card {i}"
        if not isinstance(c, dict):
            errors.append(f"{cw}: not an object")
            continue
        if c.get("k") not in kinds:
            errors.append(f"{cw}: bad kind {c.get('k')!r}")
        for key in ("t", "b"):
            if not isinstance(c.get(key), str) or not c[key].strip():
                errors.append(f"{cw}: '{key}' missing or empty")
        if c.get("k") == "quote" and not (isinstance(c.get("q"), str) and c["q"].strip()):
            errors.append(f"{cw}: quote card needs 'q'")
    return [c for c in cards if isinstance(c, dict)]


def check_classics(path):
    lessons = load(path)
    for n, l in enumerate(lessons):
        where = f"{os.path.basename(path)} entry {n} ({l.get('id', '?') if isinstance(l, dict) else '?'})"
        if not isinstance(l, dict):
            errors.append(f"{where}: not an object")
            continue
        cards = check_common(l, where, CLASSIC_KINDS)
        story = [c for c in cards if c.get("k") == "story"]
        if len(story) < 12:
            errors.append(f"{where}: only {len(story)} story cards (need 12-14 for a full summary)")
        short = [c.get("t") for c in story if isinstance(c.get("b"), str) and len(c["b"].split()) < 70]
        if short:
            errors.append(f"{where}: story cards under 70 words: {short}")
    return lessons


def check_nonfiction(path):
    books = load(path)
    for n, l in enumerate(books):
        where = f"{os.path.basename(path)} entry {n} ({l.get('id', '?') if isinstance(l, dict) else '?'})"
        if not isinstance(l, dict):
            errors.append(f"{where}: not an object")
            continue
        cards = check_common(l, where, NONFICTION_KINDS, extra_keys=[("category", str)])
        count = lambda k: sum(1 for c in cards if c.get("k") == k)
        for k, need in [("argument", 2), ("concept", 4), ("case", 4), ("lesson", 4), ("reflect", 1)]:
            if count(k) < need:
                errors.append(f"{where}: only {count(k)} '{k}' cards (need {need}+)")
        short = [c.get("t") for c in cards if c.get("k") in LONG_KINDS
                 and isinstance(c.get("b"), str) and len(c["b"].split()) < 80]
        if short:
            errors.append(f"{where}: argument/concept/case cards under 80 words: {short}")
        thin = [c.get("t") for c in cards if c.get("k") in {"lesson", "critique"}
                and isinstance(c.get("b"), str) and len(c["b"].split()) < 50]
        if thin:
            errors.append(f"{where}: lesson/critique cards under 50 words: {thin}")
    return books


if len(sys.argv) > 1:
    p = sys.argv[1]
    shelves = [(check_nonfiction if "nonfiction" in os.path.basename(p) else check_classics)(p)]
else:
    shelves = [check_classics("site/data/lessons.json")]
    if os.path.exists("site/data/nonfiction.json"):
        shelves.append(check_nonfiction("site/data/nonfiction.json"))

if errors:
    print("FAIL:\n  " + "\n  ".join(errors))
    sys.exit(1)
books = [b for s in shelves for b in s]
print(f"OK: {len(books)} books, {sum(len(b['cards']) for b in books)} cards")
