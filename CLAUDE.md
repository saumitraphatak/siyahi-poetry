# Siyahi Poetry

Siyahi is Saumitra S. Phatak's static multilingual poetry archive.

## Site structure

- `index.html` is the browsing interface.
- `book.html` preserves the original complete book edition.
- `css/styles.css` contains the responsive visual system.
- `js/app.js` powers language tabs, search, filters, poem reading, and sharing.
- `js/poems-data.js` is generated from the original book.
- `scripts/build_content.py` extracts all poems and aphorisms from `book.html`.
- `assets/siyahi-cover.png` is a rendered image of the original cover.

There are no packages, frameworks, or build tools. The site can be opened directly from the filesystem and is deployed through GitHub Pages.

## Content rules

- The collection contains exactly 104 poems.
- Do not edit poem text in `js/poems-data.js` by hand.
- Edit the source poem in `book.html`, then run `python3 scripts/build_content.py`.
- Hindi, Marathi, and English are many-to-many labels. A multilingual poem can appear in more than one tab.
- Preserve Unicode Devanagari text exactly.
- Keep poem numbers stable because links use hashes such as `#poem-54`.

## Language metadata

The generator contains the explicit English and Marathi poem-number sets. Poems not in those sets default to Hindi. Poems 54 and 97 are intentionally multilingual.

## Design

The main site is an editorial archive, while `book.html` retains the physical-book experience. Maintain:

- readable serif poetry typography
- restrained cream, charcoal, blue, red, green, and gold palette
- square or gently rounded controls
- desktop split view and mobile full-screen reader
- keyboard-accessible controls and visible focus states

## Deployment

The live URL is `https://saumitraphatak.github.io/siyahi-poetry/`, served from the repository's `main` branch.
