#!/usr/bin/env python3
"""Extract the original book into browser-ready structured data."""

import json
import re
from pathlib import Path

from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "book.html"
OUTPUT = ROOT / "js" / "poems-data.js"

ENGLISH = {30, 36, 37, 54, 62, 81, 86, 93, 100, 101, 102, 103, 104}
ENGLISH.update(set())
MARATHI = {38, 47, 53, 54, 57, 58, 80, 82, 97}
MARATHI.update({107, 108})

# Editor's picks — a curated "best of" shelf for first-time visitors.
# Order matters: index 0 is the top pick. Surfaced on index.html and book.html.
FEATURED = [
    105, 106, 107, 108, 18, 45, 54, 53, 101, 42,
]

THEMES = (
    (range(1, 45), "ishq", "Ishq", "Love & longing"),
    (range(45, 53), "dosti", "Dosti", "Friendship"),
    (range(53, 56), "rishtey", "Rishtey", "Family & bonds"),
    (range(56, 94), "zindagi", "Zindagi", "Life & philosophy"),
    (range(94, 100), "samaj", "Samaj", "Society"),
    (range(100, 105), "english-verses", "English Verses", "Identity & reflection"),
    (range(105, 109), "naye-panne", "Naye Panne", "Newer poems"),
)


def theme_for(number):
    for numbers, slug, label, description in THEMES:
        if number in numbers:
            return {
                "slug": slug,
                "label": label,
                "description": description,
            }
    raise ValueError(f"No theme for poem {number}")


def languages_for(number):
    languages = []
    if number not in ENGLISH and number not in MARATHI:
        languages.append("hindi")
    if number in ENGLISH:
        languages.append("english")
    if number in MARATHI:
        languages.append("marathi")
    if number in {54, 97} and "hindi" not in languages:
        languages.insert(0, "hindi")
    return languages


def main():
    soup = BeautifulSoup(SOURCE.read_text(encoding="utf-8"), "html.parser")
    poems = []

    for block in soup.select(".poem-block"):
        number_match = re.search(r"\d+", block.select_one(".poem-num").get_text())
        if not number_match:
            continue

        number = int(number_match.group())
        title = block.select_one(".poem-title").get_text(" ", strip=True)
        subtitle_node = block.select_one(".poem-subtitle")
        subtitle = subtitle_node.get_text(" ", strip=True) if subtitle_node else ""

        content = BeautifulSoup(str(block), "html.parser").select_one(".poem-block")
        for selector in (".poem-num", ".poem-title", ".poem-subtitle", ".poem-rule"):
            node = content.select_one(selector)
            if node:
                node.decompose()

        meaning_node = content.select_one(".poem-meaning")
        meaning = meaning_node.get_text(" ", strip=True) if meaning_node else ""
        search_text = " ".join(block.get_text(" ", strip=True).split())

        poems.append(
            {
                "number": number,
                "id": f"poem-{number}",
                "title": title,
                "subtitle": subtitle,
                "languages": languages_for(number),
                "theme": theme_for(number),
                "meaning": meaning,
                "searchText": search_text,
                "contentHtml": content.decode_contents(),
                "featuredRank": FEATURED.index(number) + 1 if number in FEATURED else None,
            }
        )

    aphorisms = [
        " ".join(node.get_text(" ", strip=True).split())
        for node in soup.select(".aph-item")
    ]

    if len(poems) != 108:
        raise RuntimeError(f"Expected 108 poems, found {len(poems)}")

    payload = {
        "poems": poems,
        "aphorisms": aphorisms,
        "themes": [
            {"slug": slug, "label": label, "description": description}
            for _, slug, label, description in THEMES
        ],
    }
    OUTPUT.write_text(
        "window.SIYAHI_DATA = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(poems)} poems and {len(aphorisms)} aphorisms to {OUTPUT}")


if __name__ == "__main__":
    main()
