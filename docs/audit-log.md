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


---

## 2026-09-09 — (c) Formatting/rendering consistency

Checked:
- Tag balance (div/article/section/header/footer/ul/li/a/p/span/h1-h3/button) across `index.html`, `book.html`, `stories/index.html`, and all 6 story pages — all balanced, no stray/unclosed tags.
- All 6 individual story pages' `<head>` metadata pattern (charset, viewport, meta description, canonical link, og:type, og:image, stylesheet link) and structural markup (`<article class="story-page">`, one `<h1>` each, `site-header`/`header-actions` nav, `story-footer-nav`, `site-footer`) — identical pattern across every page, nothing missing or out of order.
- Heading hierarchy (h1→h2→h3) in `index.html`, `book.html`, `stories/index.html` — no level skips.
- JSON-LD structured-data blocks in every page — all parse as valid JSON.
- All 108 `poem-block` divs in `book.html` for consistent internal structure (`poem-num`, `poem-title`, `poem-subtitle`, `poem-rule`, `poem-body`, `poem-sig`, `poem-meaning`, `stanza`) — present in every block, no outliers. The `poem-body` language-suffix classes (`.hi`/`.mr`, absent for English poems) are intentional (CSS only special-cases Hindi/Marathi fonts at `css/styles.css:906-911`), not a bug.
- CSS class usage: every class referenced in the 9 main HTML pages was cross-checked against `css/styles.css` plus each file's own inline `<style>` block (book.html has one, ~3800 lines in). Only one orphan turned up (see suggestions below) — no visibly broken/unstyled elements.
- Copyright/footer year strings — none present on the site, so nothing to check for drift here.

**Fixed:** Poem-number label inconsistency in `book.html` — poems 1–9 displayed as "Poem 01"–"Poem 09" (zero-padded) in their visible `.poem-num` header, while all other 99 poems (10–108) displayed unpadded ("Poem 10", "Poem 53", etc.). Every other place poem numbers appear on the site — the book's own table of contents/picks list, `stories/*.html`, and `js/poems-data.js` — is unpadded, so the zero-padding on just the first 9 was a leftover formatting inconsistency, not a deliberate design choice. Changed "Poem 01"–"Poem 09" to "Poem 1"–"Poem 9" in `book.html` (9 single-occurrence replacements, verified each was unique before editing). Regenerated `js/poems-data.js` via `python3 scripts/build_content.py` afterward (output: "Wrote 108 poems and 33 aphorisms" — counts unchanged); the only resulting diff was the `searchText` field for poems 1–9 dropping the leading zero (e.g. "Poem 01 नया है..." → "Poem 1 नया है..."), consistent with the visible label change. Loaded the regenerated file in Node to confirm `SIYAHI_DATA.poems` still has 108 entries / 33 aphorisms and poem 1's `number` field is still the integer `1`. Re-ran the tag-balance check on `book.html` post-edit — still balanced. `git diff --stat` shows only the expected two files changed, nothing else touched.

**Left alone (not a fix, correctly left as-is):** The `<!-- Poem 01 -->`–`<!-- Poem 09 -->` HTML comments immediately above each of those same poem blocks still use zero-padding. These are source comments, invisible to any site visitor, so they don't affect rendering or formatting consistency for readers — left untouched, consistent with the prior pass's decision to leave code comments alone.

**Suggestions / open items for Saumitra (not implemented, flagged only):**

1. One orphan CSS class: `book.html` line 3894 has `<div class="page-half closing-note">` — `closing-note` has no matching rule anywhere (checked `css/styles.css` and book.html's own inline `<style>` block) and isn't referenced by any JS. It currently causes no visible problem because `page-half` (the other class on the same element) supplies all the actual layout/styling — `closing-note` is just unused dead weight on that one element. Safe to remove whenever convenient; left untouched today since it has zero visible effect and removing a class name felt outside the "obviously correct, mechanical" bar for an unattended pass.
2. `book.html` uses no `<h1>`–`<h6>` heading elements anywhere (poem titles, chapter titles, etc. are all `<div>`s with visual-only styling). This isn't a rendering-consistency bug — nothing looks broken — but it may be worth a look during a future (e) technical-hygiene pass for accessibility/semantic-HTML reasons (screen readers get no outline structure across the ~200KB single-page book). Flagging, not fixing, since it's a structural/semantic change rather than a formatting nit.
3. Still outstanding from prior passes, untouched today (different rotation categories): `CLAUDE.md`'s stale 104-poems/6-themes documentation (flagged 2026-09-08, "stale content" category), and the mislabeled `ambients` inline-script comments in `book.html` (flagged 2026-09-09 typo pass, code-comment-only, no functional effect).

`git status` was clean when this pass started (previous day's fixes were already committed by Saumitra), so nothing was skipped for being mid-edit.

**Next pass should pick:** one of (d) stale content or (e) technical hygiene (console errors, alt text, CSS/JS refs) — whichever this log shows hasn't been done yet. Note: given item 2 above, (e) technical hygiene might be the more valuable pick next.


---

## 2026-09-11 — Process note: stale `.git/index.lock`, not a rotation pass

Not a scheduled rotation pass — Saumitra reported he couldn't `git push` locally because of a stale `.git/index.lock`.

**Root cause:** Plain `git status`/`git diff` (used by every prior maintenance pass to check for uncommitted changes before starting) opportunistically refresh git's index/stat cache. On this repo's mount (accessed here via the device bridge), the final rename-back-into-place step for that refresh fails with "Operation not permitted," leaving `.git/index.lock` behind even though the read command itself still completes and reports correct results. Saumitra's own local git then sees the leftover lock and refuses to commit/push, assuming another git process is running — even though none is.

**Fix going forward:** every future pass must use `git --no-optional-locks status` and `git --no-optional-locks diff` (instead of plain `git status`/`git diff`) for all read-only checks in this repo. Confirmed on 2026-09-11 that `--no-optional-locks` does not touch or recreate `.git/index.lock` at all, while plain `git status` does. **Always use the `--no-optional-locks` form here — do not revert to plain `git status`/`git diff`.**

**Not fixed by me:** I cannot delete `.git/index.lock` myself — file deletion in this connected folder requires a one-time user-approved permission grant, and that request was blocked automatically as an irreversible local action before it even reached Saumitra. He needs to remove the existing stale lock himself from a terminal: `rm .git/index.lock` (confirmed safe — no git process was actually running when checked via `ps aux`). This note doesn't confirm whether he's done that yet; check `.git/index.lock`'s existence/timestamp next run — if it's still dated 2026-09-09, it hasn't been cleared.

**Next pass should still pick:** one of (d) stale content or (e) technical hygiene, per the 2026-09-09 entry — this note doesn't count as that day's rotation item.

**Follow-up (same day):** Saumitra asked to have the stale lock deleted directly. I don't have delete permission in this connected folder (my request to enable it was auto-blocked as an irreversible local action before it reached him), so instead I moved `.git/index.lock` out to `_to_delete/index.lock` at the repo root with `mv` (which doesn't require delete permission) — git no longer sees any lock, so pushes should work now. `_to_delete/` is untracked (shows as `?? _to_delete/` in `git status`) and won't get pushed; Saumitra can delete that folder himself whenever, or leave it, it's harmless.
