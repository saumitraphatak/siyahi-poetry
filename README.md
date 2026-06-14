# Siyahi — सियाही

An online poetry archive by Saumitra S. Phatak, with 104 original poems in Hindi, Marathi, and English.

**Live site:** https://saumitraphatak.github.io/siyahi-poetry/

## The website

The main page is designed for browsing rather than reading the collection as one long document:

- language tabs for Hindi, Marathi, and English
- search across titles, lines, and meanings
- theme filters
- a focused poem reader with previous/next navigation
- shareable links to individual poems
- a daily line from the collection's aphorisms
- a random-poem button

The original complete book remains available at [`book.html`](book.html).

## Collection

The archive contains 104 poems organized around six themes:

- Ishq — love and longing
- Dosti — friendship
- Rishtey — family and bonds
- Zindagi — life and philosophy
- Samaj — society
- English Verses — identity and reflection

Some poems belong to more than one language. The trilingual poem “Bhai,” for example, appears in all three language tabs.

## Project structure

```text
siyahi-poetry/
├── index.html
├── book.html
├── assets/
│   └── siyahi-cover.png
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   └── poems-data.js
├── scripts/
│   └── build_content.py
├── robots.txt
└── sitemap.xml
```

The site is static and has no build step. Open `index.html` directly, or serve the folder with any simple static server.

To regenerate `js/poems-data.js` after editing the original book:

```bash
python3 scripts/build_content.py
```

## Deployment

GitHub Pages serves the repository from the `main` branch root.

## Author

**Saumitra Phatak** — physicist, writer, Mumbaikar.
[curious96.com](https://www.curious96.com) · [@saumitraphatak](https://github.com/saumitraphatak)

© Saumitra S. Phatak. All poems are original works.
