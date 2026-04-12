# CLAUDE.md — Siyahi Poetry

## Purpose & Audience

Siyahi (सियाही — *ink* in Hindi/Urdu) is a bilingual poetry collection by **Saumitra S. Phatak**, a physicist who writes poetry. The site presents original poems in Hindi, Marathi, and English as a single scrolling digital book. Themes: love and longing, science and wonder, identity and diaspora (Mumbaikar at Purdue), memory, friendship, family, philosophy, and the human condition.

- **Live URL:** https://saumitraphatak.github.io/siyahi-poetry/
- **GitHub:** https://github.com/saumitraphatak/siyahi-poetry
- **Author:** Saumitra S. Phatak

---

## Tech Stack

- **Single `index.html`** — the entire book lives here. No sub-pages, no nav.
- Pure HTML + inline CSS (all `<style>` in `<head>`). No external stylesheet.
- Minimal JS — a few UI interactions only (no frameworks, no npm, no build step).
- **Fonts via Google Fonts CDN:**
  - `Playfair Display` — headings, poem titles, chapter titles
  - `EB Garamond` — body text, prose, English poems
  - `Noto Serif Devanagari` — Hindi and Marathi Devanagari script
- Deployed via GitHub Pages from the `main` branch root.
- **No npm. No Node. No build tools.** Open `index.html` directly in a browser.

---

## File Structure

```
siyahi-poetry/
├── index.html      # The entire book — cover, author's note, TOC, all 104+ poems
├── robots.txt
└── sitemap.xml
```

Everything is in `index.html`. Do not create sub-pages or external CSS files.

---

## Architecture: Single-Page Book

The `<div class="book">` wrapper contains every section in document order:

1. `.cover` — dark book cover with ornamental border, large "SIYAHI" title
2. `.page-half` — Author's Note (bilingual prose)
3. `.page` — Table of Contents (index of all poems by part)
4. `.chapter-header` — Part divider (e.g., "Part I: Ishq")
5. `.page` / `.page-half` — Poem pages (one or more `.poem-block` each)
6. `.page` — Aphorisms section ("Sukhanvad")
7. `.back-cover` — closing dark cover with a final quote

Page numbers are automatic via CSS counter `page-num`:
```css
.book { counter-reset: page-num; }
.page, .page-half, .chapter-header { counter-increment: page-num; }
.page::after, .page-half::after, .chapter-header::after {
  content: counter(page-num);
}
```

---

## Design Tokens (CSS Variables)

```css
:root {
  --paper:        #fdf8ef;   /* warm cream — main page background */
  --paper-dark:   #f5edd8;   /* slightly darker cream */
  --ink:          #2c1a0e;   /* dark brown — body text */
  --accent:       #8b4513;   /* saddle brown — titles, borders */
  --accent-light: #c4894a;   /* light brown/gold — page numbers, ornaments */
  --divider:      #d4a574;   /* warm tan — horizontal rules, dotted lines */
  --muted:        #6b4c30;   /* muted brown — subtitles, notes, attributions */
  --shadow:       rgba(44,26,14,0.08);
}
```

The book itself sits on a medium brown body background (`#b8a48a`) so the cream book stands out like a physical object.

---

## Component Patterns

### Poem block (within a `.page` or `.page-half`)

```html
<div class="poem-block">
  <div class="poem-num">Poem 01</div>
  <div class="poem-title">नया है कुछ, अच्छा है</div>
  <div class="poem-subtitle">Naya Hai Kuch, Achha Hai</div>  <!-- transliteration or English subtitle -->
  <div class="poem-rule"></div>
  <div class="poem-body hi">   <!-- use .hi or .mr for Devanagari; omit for English -->
    <div class="stanza">
      Line one of the stanza,<br>
      Line two of the stanza...
    </div>
    <div class="stanza">
      Second stanza here...
    </div>
  </div>
  <!-- Optional meaning note -->
  <div class="poem-meaning">
    <span class="meaning-label">Meaning</span>
    English translation or context note here.
  </div>
  <!-- Optional signature -->
  <div class="poem-sig">— Saumitra</div>
</div>
```

**Language classes:**
- `.poem-body.hi` — Hindi (Noto Serif Devanagari, slightly smaller, looser line-height)
- `.poem-body.mr` — Marathi (same font as `.hi`)
- `.poem-body` (no modifier) — English (EB Garamond)

### Chapter header (part divider)

```html
<div class="chapter-header">
  <div class="ch-part">Part Two</div>
  <div class="ch-title-en">Dosti</div>
  <div class="ch-title-hi">दोस्ती</div>
  <div class="ch-rule"></div>
  <div class="ch-desc">Friendship<br><em>the companions who stayed</em></div>
</div>
```

### Bilingual side-by-side layout

```html
<div class="bilingual">
  <div class="poem-body hi">
    <!-- Hindi/Marathi text -->
  </div>
  <div class="bilingual-sep"></div>
  <div class="poem-body">
    <!-- English translation -->
  </div>
</div>
```

### Aphorism (sukhanvad) item

```html
<div class="aph-item hi">अपना शेर</div>
<div class="aph-item">English aphorism</div>
```

### Ornamental divider

```html
<div class="orn">✦ &nbsp; ✦ &nbsp; ✦</div>
```

---

## How to Add a Poem

1. Find the correct Part section in `index.html` (the chapter header marks the boundary).
2. Inside the appropriate `.page` or `.page-half`, add a `.poem-block` div.
3. Add a matching entry in the Table of Contents `.toc-section` with the correct `.toc-num`.
4. Use `.page` for full poems (90px top/bottom padding) or `.page-half` for shorter ones (60px).
5. Update the poem count if mentioned anywhere in prose.

Multiple short poems can share one `.page`. Long poems may need their own `.page`.

---

## Gotchas

- **All CSS is inline** inside the `<style>` block in `<head>`. There is no external stylesheet. Edit the `<style>` tag directly.
- **No JavaScript framework** — minimal inline JS only if truly needed. Preserve the zero-JS spirit.
- **HTML entity for en-dash:** `&mdash;` — used in headings and attributions.
- **Devanagari text** must use Unicode directly (not romanized) for the `.hi` / `.mr` class to render correctly.
- The `counter-increment: page-num` on `.page`, `.page-half`, and `.chapter-header` means every section that uses these classes gets an auto page number in its `::after` pseudo-element. The `.cover` and `.back-cover` intentionally do NOT have this counter.
- **Print styles** are included: `@media print` forces A4, removes box-shadow, preserves dark cover colors via `print-color-adjust: exact`.
- The `<html lang="hi">` attribute is set at the document level. If you add a section that is predominantly English, do not change this attribute — individual `<div>` elements can carry their own `lang` if needed.
- Google Fonts `google8a0c77e6409e4ccc.html` in the root is a Search Console verification file — do not delete it.
- **Copyright:** All poems are original works. Do not reproduce content without attribution.

---

## Parts & Poem Count

| Part | Theme | Poems |
|------|-------|-------|
| I — Ishq (इश्क) | Love & Longing | 01–44 |
| II — Dosti | Friendship | 45–52 |
| III — Rishtey | Family & Bonds | 53–55 |
| IV — Zindagi | Life & Philosophy | 56–93 |
| V — Samaj | Society & Nation | 94–99 |
| VI — English Verses | English poems | 100–104 |
| Closing — Sukhanvad | Aphorisms | — |
