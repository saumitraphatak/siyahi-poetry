# Project Context: siyahi-poetry

## Short Description
A multilingual poetry website for Siyahi, presenting poems and aphorisms in Hindi, Marathi, and English with a browsable archive, featured poems, mood-based discovery, and a book-like reading mode.

## What This Repo Is For
This repo should turn the poetry collection into a real website, not just a static book. It should preserve the emotional feel of the original poems while making the collection easy to explore by language, mood, theme, and reading path.

## Current Shape
- Static website.
- `index.html`: main website and archive experience.
- `book.html`: original book-style source of poem content.
- `scripts/build_content.py`: parses poem blocks from `book.html` and generates `js/poems-data.js`.
- `js/app.js`: filtering, search, reader interactions, featured poems, mood paths.
- `css/styles.css`: visual design for the main site, archive, cards, reader, and responsive states.
- `assets/siyahi-cover.png`: cover image.
- SEO/AI context files: `llms.txt`, `llms-full.txt`, `robots.txt`, `sitemap.xml`.

## Content Source of Truth
Treat `book.html` as the canonical source for poem text unless the architecture changes. After editing poem text or poem blocks, run `scripts/build_content.py` to regenerate `js/poems-data.js`.

## Design Intent
The site should feel literary, intimate, and browsable. Avoid making it look like a generic blog. Preserve the mood of the writing while adding useful discovery surfaces: language tabs, mood paths, featured work, and a readable single-poem view.

## Maintenance Notes
- Be careful with Unicode and line breaks in Hindi/Marathi poems.
- Do not edit generated poem data manually if it can be regenerated from `book.html`.
- Keep book mode integrated with the website navigation so readers do not feel trapped in a separate app.
- Update `sitemap.xml` if new standalone pages are added.

## Local Preview
Open `index.html` directly in a browser. No build server is required.

## Good Future Improvements
- Add previous/next poem navigation inside the reader.
- Add shareable URLs for individual poems.
- Add transliteration or meaning fields only where they genuinely improve reading.
- Add a small editorial note explaining the three-language structure.
