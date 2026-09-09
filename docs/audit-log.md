# Siyahi — Maintenance Audit Log

Recurring daily maintenance pass for the Siyahi poetry site, run by Claude. Each entry: date, what was checked, what (if anything) was fixed, and open suggestions for Saumitra. Read the most recent entries before starting a new pass so checks rotate instead of repeating, and settled calls aren't re-litigated.

Rotation: (a) broken/dead links, (b) typos & spelling, (c) formatting/rendering consistency, (d) stale content (dates, bios, images), (e) technical hygiene (console errors, alt text, CSS/JS refs).

---

## 2026-09-08 — (a) Broken/dead links

**First run — no prior log existed, so this establishes the rotation going forward.**

Checked:
- All internal `href`/`src` references in `index.html`, `book.html`, `stories/index.html`, and all 6 individual story pages — every relative link (css, js, book.html, index.html, story pages, PDFs) resolves to a file that exists on disk.
- All `#poem-N` anchors linked from the stories pages against actual `id="poem-N"` targets in `book.html` — `book.html` has 108 poem blocks (`poem-1`…`poem-108`), all referenced anchors fall in range and exist.
- `index.html` in-page anchors (`#archive`, `#featured`, `#moods`, `#paths`) — all present.
- `sitemap.xml` — lists 8 URLs (home, book, stories index, 6 story pages); all correspond to real files; no orphaned or missing entries.
- `robots.txt` — sitemap URL is correct and reachable.
- External links: `https://www.curious96.com`, the live GitHub Pages site (`https://saumitraphatak.github.io/siyahi-poetry/`), and `https://github.com/saumitraphatak` — spot-checked via fetch, all load successfully.
- `assets/siyahi-collected-poems.pdf` and all 6 files in `stories/pdfs/` — present and linked correctly.
- Searched for `http://` (non-HTTPS) links and empty `href=""`/`src=""` — none found (the one `http://` hit is the standard XML sitemap namespace URI, not a real link).
- Utterances comments widget config (`js/app.js`) — `repo` attribute correctly points to `saumitraphatak/siyahi-poetry`, matching the actual repo.

**Fixed:** Nothing — no broken links found. No changes made to any file.

**Suggestions / open items for Saumitra (not implemented, flagged only):**

1. **`CLAUDE.md` is stale and out of sync with the actual site/code.** It documents 104 poems and 6 themes (theme ranges only go up to 104, "English Verses 100–104" as the last one), and says the content script "hard-fails... if the poem count parsed from `book.html` isn't exactly 104." In reality, the live site, `book.html`, `scripts/build_content.py`, `llms.txt`, and `llms-full.txt` are all already correctly at **108 poems / 7 themes** (the 7th being "Naye Panne — newer poems," poems 105–108, added since `CLAUDE.md` was last refreshed). Only `CLAUDE.md`'s prose is behind — `README.md`, `llms.txt`, and `llms-full.txt` are already accurate at 108/7. Recommend a documentation-only refresh of `CLAUDE.md`'s theme-range table and poem-count references next time the "stale content" rotation comes up (or whenever convenient) — this is exactly the kind of thing the earlier commit "Refresh CLAUDE.md and README.md to match current repo reality" addressed, and it's drifted again.
2. **Cross-site note (informational only, not this repo):** `curious96.com`'s bio copy still says "104 original poems in Hindi, Marathi, and English," which is now behind Siyahi's actual 108-poem count. Out of scope for this task (different repo/site), but flagging since it's a small easy fix whenever that site gets touched.

Nothing was mid-edit / uncommitted when this pass ran (`git status` was clean), so no files were skipped for that reason.

**Next pass should pick:** one of (b) typos & spelling, (c) formatting/rendering consistency, (d) stale content, or (e) technical hygiene — whichever this log shows hasn't been done yet.

---

## 2026-09-09 — (b) Typos & spelling

Checked (English prose only — no changes made to any Hindi/Marathi/English poem verse itself):
- All 108 `poem-meaning` glosses in `book.html`.
- Every `<p>` of framing prose in `stories/index.html` and all 6 individual story pages (kickers, subtitles, byline, glosses, meta descriptions).
- Static UI copy in `index.html` (masthead, section intros, buttons, footer, meta/OG tags, JSON-LD).
- `README.md`, `CLAUDE.md`, `PROJECT_CONTEXT.md`, `llms.txt`, `llms-full.txt`.
- UI strings in `js/app.js` (mood-path titles/subtitles, reading-path titles, button labels).
- Ran pattern searches for common misspellings, doubled words, stray double punctuation, empty `href`/`src`, and US/UK spelling-convention mismatches (the site consistently uses British spelling in prose — "colour," "recognising," "digitised," "moisturised," "traveller," etc.).

Several grep hits turned out to be false positives on inspection and were left alone: reduplicated Hindi/Marathi words that are correct idiom, not typos (`कभी कभी`, `अलग अलग`, `apni apni`, `Roj roj`, `baton baton`, `पाहता पाहता`, `काढता काढता`); "you you" in `proof-of-life.html`, which is the intentional identity-question phrasing ("what exactly makes you you"), repeated deliberately across the meta description, OG description, and subtitle; "S S" in `book.html`, which is just the cover's spaced-out lettering plus the "S S P" initials; the `..` / `..!` punctuation style used throughout many poem lines, which is the author's consistent stylistic device, not a typo; and CSS/JS property names like `color`, `center`, `behavior` (correctly American — required by CSS/JS syntax, unrelated to prose spelling).

**Fixed:** One genuine spelling inconsistency — `book.html`'s meaning gloss for poem 14 used "realization" (American spelling), the only instance of "-ize/-ization" style on the site; everywhere else (colour, recognising, digitised, moisturised, traveller) uses British spelling consistently. Changed to "realisation" to match. Since `book.html` is the source of truth, regenerated `js/poems-data.js` via `python3 scripts/build_content.py` afterward (output: "Wrote 108 poems and 33 aphorisms" — counts unchanged). Verified with `git diff` that only that one word changed in each file, and loaded the regenerated data file in Node to confirm poem-14's meaning field updated correctly and the poem/aphorism/theme counts are all intact (108/33/7). No poem, story, or other prose text was reworded — this was a spelling-convention fix only, not a content or voice edit.

**Suggestions / open items for Saumitra (not implemented, flagged only):**

1. Small code-comment mismatch in `book.html`'s inline script (near the bottom, "PER-CHAPTER AMBIENT COLOUR SHIFT" section): the `ambients` object's inline comments label `part-1` as "Ishq," `part-2` as "Dosti," etc., and `part-7` as "Instagram" — but the actual chapter nav (and the `THEMES` in `build_content.py`) has Part I = Rishtey, Part II = Dosti, Part III = Zindagi, Part IV = Samaj, Part V = English Verses, Part VI = Ishq, Part VII = Naye Panne. The comments are just stale/mislabeled — the actual color-by-id logic is unaffected and works correctly, so this is purely a maintainability nit for whoever edits that block next, not a bug. Left untouched since it's a code comment, not prose/content, and outside today's typo-focused pass.
2. `CLAUDE.md` staleness noted in the 2026-09-08 entry above is still outstanding (104→108 poems, 6→7 themes) — untouched today since that's a different rotation category (stale content).

Nothing was mid-edit / uncommitted from Saumitra's side when this pass ran (`git status` showed only yesterday's still-uncommitted `docs/` addition), so nothing was skipped for that reason.

**Next pass should pick:** one of (c) formatting/rendering consistency, (d) stale content, or (e) technical hygiene.
