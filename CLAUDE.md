# Siyahi Poetry

Siyahi ("ink") is Saumitra S. Phatak's static, multilingual poetry archive: 109 original poems (plus ~33 short aphorisms) in Hindi, Marathi, and English, presented as a searchable/browsable website with a separate original "book edition" view.

**Live site:** https://saumitraphatak.github.io/siyahi-poetry/ (GitHub Pages, served from `main` branch root)
**Repo:** https://github.com/saumitraphatak/siyahi-poetry

## Tech stack

Pure static HTML/CSS/JS. No npm, no framework, no build step for the site itself — only a Python content-generation script.

- No package.json, no Node dependency.
- Content pipeline uses `python3` + `beautifulsoup4` (`scripts/build_content.py`).
- Fonts/assets are self-contained (no external CDN dependency observed beyond what's in `<head>` of each HTML file — check there if adding one).

## File structure

```
siyahi-poetry/
├── index.html                      # Main site: browsable archive (language tabs, search, themes, reader)
├── book.html                       # SOURCE OF TRUTH for poem text — original scrolling "book" edition
├── css/styles.css                  # All styling for both index.html and book.html
├── js/
│   ├── app.js                      # Archive UI logic: filtering, search, reader, featured poems, mood paths
│   └── poems-data.js               # GENERATED — window.SIYAHI_DATA payload consumed by app.js
├── scripts/
│   └── build_content.py            # Parses book.html -> writes js/poems-data.js
├── assets/
│   └── siyahi-cover.png            # Original book cover image
├── llms.txt                        # Short llmstxt.org-style index for AI crawlers
├── llms-full.txt                   # Fuller AI-crawler context dump
├── robots.txt                      # Allows general + AI crawlers (GPTBot, ClaudeBot, etc.); points to sitemap
├── sitemap.xml                     # Lists index.html and book.html
├── google8a0c77e6409e4ccc.html     # Google Search Console site-verification file — do not delete/rename
├── README.md                       # Human-facing project overview + setup
└── CLAUDE.md                       # This file
```

## Content pipeline — how `book.html` becomes the live data

`scripts/build_content.py` reads `book.html`, parses each `.poem-block` (via BeautifulSoup), and writes `js/poems-data.js` as a single `window.SIYAHI_DATA = {...}` JSON blob containing:

- `poems`: number, id (`poem-N`), title, subtitle, languages, theme, meaning, searchText, contentHtml, featuredRank
- `aphorisms`: list of short lines (from `.aph-item` elements)
- `themes`: the 6 theme definitions below

Key logic inside the script (edit here, not in generated output):

- **Theme ranges** (by poem number): Ishq 1–44, Dosti 45–52, Rishtey 53–55, Zindagi 56–93, Samaj 94–99, English Verses 100–104.
- **Language sets**: `ENGLISH` and `MARATHI` are explicit hardcoded number sets in the script; anything not in either defaults to Hindi. Poems 54 and 97 are intentionally trilingual/bilingual (hard-coded to always include Hindi too).
- **FEATURED**: an ordered list of poem numbers curated as "editor's picks," surfaced on `index.html`/`book.html`. Order matters — index 0 is the top pick.
- The script hard-fails (`raise RuntimeError`) if the poem count parsed from `book.html` isn't exactly 104 — this is an intentional integrity check, not a bug.

Run it with:

```bash
python3 scripts/build_content.py
```

Requires `beautifulsoup4` (already available via the Anaconda Python on this machine: `/Users/curious/anaconda3/bin/python3`).

## Critical conventions / gotchas

- **Never hand-edit `js/poems-data.js`.** It is fully generated. Any manual edit will be silently clobbered next time the script runs, and risks getting out of sync with `book.html`. Always edit `book.html`, then regenerate.
- **`book.html` is the single source of truth** for poem text, titles, subtitles, and meanings — not `index.html`, not `poems-data.js`.
- **Poem numbers must stay stable.** Shareable links use hash anchors like `#poem-54`; renumbering breaks existing shared links and the `FEATURED` list in `build_content.py`.
- **If you add/remove/renumber a poem**, you likely need to update `ENGLISH`/`MARATHI`/`FEATURED` sets and `THEMES` ranges in `build_content.py` too — they're driven by poem number, not by any marker in `book.html` itself.
- **Preserve Devanagari Unicode exactly** — don't let an editor/tool normalize or mangle Hindi/Marathi text.
- **The poem count is asserted at 104.** If you add or remove poems, the total will change and the script will intentionally throw until the assertion in `build_content.py` is updated.
- **`google8a0c77e6409e4ccc.html`** is a Google Search Console ownership-verification file — leave it in place even though it looks like clutter.
- No build tools, no linter, no tests — verify changes by opening `index.html`/`book.html` directly in a browser and/or running the Python script and checking its stdout ("Wrote 109 poems and N aphorisms...").

## How to make a content change (actual workflow)

1. Edit the poem's text/title/subtitle/meaning directly in `book.html` (find the relevant `.poem-block`).
2. Regenerate the data file:
   ```bash
   python3 scripts/build_content.py
   ```
3. Confirm it printed `Wrote 109 poems and ... aphorisms to .../js/poems-data.js` with no error.
4. Open `index.html` and `book.html` in a browser to spot-check the change (search for the poem, open the reader, check the language tab it appears under).
5. If the change affects language classification, theme, or "featured" status, also update the corresponding set/list at the top of `scripts/build_content.py` before regenerating.
6. Commit both `book.html` and the regenerated `js/poems-data.js` together — never commit one without the other.

## Design intent

- `index.html` is an editorial/archive experience: language tabs (Hindi/Marathi/English), search across titles/text/meanings, theme filter, a focused single-poem reader with prev/next, shareable per-poem links, mood-based discovery paths, a daily aphorism, and a random-poem button.
- `book.html` preserves the original physical-book reading experience as a continuous scroll.
- Visual language: readable serif poetry typography, restrained cream/charcoal/blue/red/green/gold palette, square-ish or gently rounded controls, desktop split view vs. mobile full-screen reader, keyboard-accessible controls with visible focus states.
