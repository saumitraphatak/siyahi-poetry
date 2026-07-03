(function () {
  "use strict";

  const data = window.SIYAHI_DATA;
  if (!data || !Array.isArray(data.poems)) return;

  const COMMENTS_REPO = "saumitraphatak/siyahi-poetry";

  const languageNames = {
    hindi: "Hindi",
    marathi: "Marathi",
    english: "English",
  };

  const moodPaths = [
    {
      title: "Home",
      subtitle: "family, memory, and the old room inside you",
      theme: "rishtey",
      poemId: "poem-53",
    },
    {
      title: "Friendship",
      subtitle: "the people who become weather",
      theme: "dosti",
      poemId: "poem-45",
    },
    {
      title: "Becoming",
      subtitle: "questions of time, self, and purpose",
      theme: "zindagi",
      poemId: "poem-93",
    },
    {
      title: "Society",
      subtitle: "what the world asks of us",
      theme: "samaj",
      poemId: "poem-97",
    },
    {
      title: "Identity",
      subtitle: "the English poems, slightly restless",
      theme: "english-verses",
      poemId: "poem-101",
    },
    {
      title: "Longing",
      subtitle: "when the heart keeps returning",
      theme: "ishq",
      poemId: "poem-18",
    },
  ];

  const readingPaths = [
    {
      key: "first-ten",
      title: "The First Ten Pages",
      subtitle: "the doorway I would hand to a new reader",
      poemIds: ["poem-105", "poem-106", "poem-107", "poem-108", "poem-18", "poem-45", "poem-54", "poem-53", "poem-101", "poem-42"],
    },
    {
      key: "home-distance",
      title: "Home & Distance",
      subtitle: "mother tongue, migration, and the room you carry with you",
      poemIds: ["poem-53", "poem-54", "poem-55", "poem-107", "poem-108", "poem-100", "poem-103"],
    },
    {
      key: "late-night",
      title: "Late Night Pages",
      subtitle: "for when the heart is awake before the mind is ready",
      poemIds: ["poem-6", "poem-18", "poem-24", "poem-31", "poem-42", "poem-81", "poem-86"],
    },
    {
      key: "growing-up",
      title: "Growing Up, Still",
      subtitle: "purpose, identity, responsibility, and small courage",
      poemIds: ["poem-93", "poem-101", "poem-102", "poem-105", "poem-106", "poem-108", "poem-88"],
    },
    {
      key: "chosen-people",
      title: "Chosen People",
      subtitle: "the friendships that become family without asking permission",
      poemIds: ["poem-45", "poem-46", "poem-47", "poem-48", "poem-50", "poem-51", "poem-52"],
    },
  ];

  const state = {
    language: "hindi",
    theme: "all",
    query: "",
    path: null,
    selectedId: null,
    meaningVisible: true,
    transliterationVisible: false,
  };

  const elements = {
    tabs: Array.from(document.querySelectorAll(".language-tab")),
    countBadges: Array.from(document.querySelectorAll("[data-count]")),
    themeSelect: document.getElementById("themeSelect"),
    searchInput: document.getElementById("searchInput"),
    resultCount: document.getElementById("resultCount"),
    poemList: document.getElementById("poemList"),
    emptyState: document.getElementById("emptyState"),
    reader: document.getElementById("poemReader"),
    readerClose: document.getElementById("readerClose"),
    randomPoem: document.getElementById("randomPoem"),
    dailyLine: document.getElementById("dailyLine"),
    featuredGrid: document.getElementById("featuredGrid"),
    moodGrid: document.getElementById("moodGrid"),
    pathGrid: document.getElementById("pathGrid"),
  };

  const vowelMap = {
    "अ": "a", "आ": "aa", "इ": "i", "ई": "ee", "उ": "u", "ऊ": "oo", "ऋ": "ri", "ए": "e", "ऐ": "ai", "ओ": "o", "औ": "au",
    "ऑ": "o", "ॲ": "a", "ऍ": "e",
  };
  const matraMap = {
    "ा": "aa", "ि": "i", "ी": "ee", "ु": "u", "ू": "oo", "ृ": "ri", "े": "e", "ै": "ai", "ो": "o", "ौ": "au", "ॉ": "o", "ॅ": "e", "ं": "n", "ँ": "n", "ः": "h",
  };
  const consonantMap = {
    "क": "k", "ख": "kh", "ग": "g", "घ": "gh", "ङ": "ng", "च": "ch", "छ": "chh", "ज": "j", "झ": "jh", "ञ": "ny",
    "ट": "t", "ठ": "th", "ड": "d", "ढ": "dh", "ण": "n", "त": "t", "थ": "th", "द": "d", "ध": "dh", "न": "n",
    "प": "p", "फ": "ph", "ब": "b", "भ": "bh", "म": "m", "य": "y", "र": "r", "ल": "l", "व": "v", "श": "sh", "ष": "sh", "स": "s", "ह": "h", "ळ": "l", "क्ष": "ksh", "ज्ञ": "gy", "क़": "q", "ख़": "kh", "ग़": "gh", "ज़": "z", "ड़": "d", "ढ़": "dh", "फ़": "f", "य़": "y",
  };

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function poemsForLanguage(language) {
    return data.poems.filter((poem) => poem.languages.includes(language));
  }

  function pathByKey(key) {
    return readingPaths.find((path) => path.key === key) || null;
  }

  function poemsForPath(key) {
    const path = pathByKey(key);
    if (!path) return [];
    return path.poemIds.map((id) => data.poems.find((poem) => poem.id === id)).filter(Boolean);
  }

  function filteredPoems() {
    const query = state.query.trim().toLocaleLowerCase();
    const base = state.path ? poemsForPath(state.path) : poemsForLanguage(state.language);
    return base.filter((poem) => {
      const matchesTheme = state.path || state.theme === "all" || poem.theme.slug === state.theme;
      const matchesQuery = !query || poem.searchText.toLocaleLowerCase().includes(query);
      return matchesTheme && matchesQuery;
    });
  }

  function hasDevanagari(text) {
    return /[\u0900-\u097F]/.test(text);
  }

  function romanizeDevanagari(text) {
    let output = "";
    for (let i = 0; i < text.length; i += 1) {
      const two = text.slice(i, i + 2);
      const char = text[i];
      if (consonantMap[two]) {
        const next = text[i + 2];
        output += consonantMap[two];
        if (next === "्") i += 2;
        else if (matraMap[next]) {
          output += matraMap[next];
          i += 2;
        } else output += "a";
      } else if (consonantMap[char]) {
        const next = text[i + 1];
        output += consonantMap[char];
        if (next === "्") i += 1;
        else if (matraMap[next]) {
          output += matraMap[next];
          i += 1;
        } else output += "a";
      } else if (vowelMap[char]) {
        output += vowelMap[char];
      } else if (matraMap[char]) {
        output += matraMap[char];
      } else if (char === "।") {
        output += ".";
      } else {
        output += char;
      }
    }
    return output.replace(/a([,.!?;:])/g, "$1").replace(/\s+/g, " ");
  }

  function romanizedPoemHtml(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    template.content.querySelectorAll(".poem-meaning, .meaning-label").forEach((node) => node.remove());
    const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (hasDevanagari(node.nodeValue)) node.nodeValue = romanizeDevanagari(node.nodeValue);
    });
    return template.innerHTML;
  }

  function updateCounts() {
    elements.countBadges.forEach((badge) => {
      badge.textContent = poemsForLanguage(badge.dataset.count).length;
    });
  }

  function populateThemes() {
    data.themes.forEach((theme) => {
      const option = document.createElement("option");
      option.value = theme.slug;
      option.textContent = theme.label;
      elements.themeSelect.append(option);
    });
  }

  function renderList() {
    const poems = filteredPoems();
    elements.poemList.innerHTML = poems
      .map(
        (poem) => `
          <button class="poem-row${poem.id === state.selectedId ? " is-selected" : ""}"
                  type="button"
                  data-poem-id="${poem.id}"
                  aria-pressed="${poem.id === state.selectedId}">
            <span class="row-number">${String(poem.number).padStart(3, "0")}</span>
            <span class="row-title">
              <strong>${escapeHtml(poem.title)}</strong>
              <span>${escapeHtml(poem.subtitle || poem.theme.description)}</span>
            </span>
            <span class="row-theme">${escapeHtml(poem.theme.label)}</span>
          </button>
        `
      )
      .join("");

    const activePath = pathByKey(state.path);
    elements.resultCount.textContent = activePath
      ? `${poems.length} ${poems.length === 1 ? "poem" : "poems"} in ${activePath.title}`
      : `${poems.length} ${poems.length === 1 ? "poem" : "poems"} in ${languageNames[state.language]}`;
    elements.emptyState.hidden = poems.length !== 0;

    elements.poemList.querySelectorAll(".poem-row").forEach((button) => {
      button.addEventListener("click", () => selectPoem(button.dataset.poemId, true));
    });
  }

  function languageChips(poem) {
    return poem.languages
      .map((language) => `<span>${escapeHtml(languageNames[language])}</span>`)
      .join("");
  }

  function scrollToArchive() {
    document.getElementById("archive")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clearPath() {
    state.path = null;
    elements.pathGrid?.querySelectorAll(".path-card").forEach((card) => card.classList.remove("is-active"));
  }

  function applyTheme(theme, poemId) {
    clearPath();
    const poem = data.poems.find((item) => item.id === poemId);
    state.language = poem ? poem.languages[0] : state.language;
    state.theme = theme;
    state.query = "";

    elements.tabs.forEach((tab) => {
      const active = tab.dataset.language === state.language;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    elements.themeSelect.value = theme;
    elements.searchInput.value = "";

    if (poem && poem.languages.includes(state.language)) {
      selectPoem(poem.id, true);
    } else {
      const first = filteredPoems()[0];
      if (first) selectPoem(first.id, true);
      else renderList();
    }
    scrollToArchive();
  }

  function loadComments(poem) {
    const host = elements.reader.querySelector(".comments-thread");
    const button = elements.reader.querySelector(".load-comments");
    if (!host || host.dataset.loaded === "true") return;
    host.dataset.loaded = "true";
    if (button) {
      button.disabled = true;
      button.textContent = "Loading comments";
    }
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("repo", COMMENTS_REPO);
    script.setAttribute("issue-term", poem.id);
    script.setAttribute("label", "poem-comments");
    script.setAttribute("theme", "github-light");
    host.append(script);
  }

  function selectPoem(id, openOnMobile) {
    const poem = data.poems.find((item) => item.id === id);
    if (!poem) return;

    state.selectedId = poem.id;
    const visible = filteredPoems();
    const visibleIndex = visible.findIndex((item) => item.id === poem.id);
    const previous = visibleIndex > 0 ? visible[visibleIndex - 1] : null;
    const next = visibleIndex >= 0 && visibleIndex < visible.length - 1 ? visible[visibleIndex + 1] : null;
    const canRomanize = hasDevanagari(poem.contentHtml);
    const romanized = canRomanize && state.transliterationVisible
      ? `<section class="transliteration-panel" aria-label="Approximate romanized reading">
          <p class="transliteration-label">Romanized reading</p>
          <div class="transliteration-content">${romanizedPoemHtml(poem.contentHtml)}</div>
        </section>`
      : "";

    elements.reader.innerHTML = `
      <button class="reader-close" id="readerClose" type="button" aria-label="Close poem">×</button>
      <article>
        <p class="reader-kicker">Poem ${String(poem.number).padStart(3, "0")} · ${escapeHtml(poem.theme.label)}</p>
        <h2 class="reader-title">${escapeHtml(poem.title)}</h2>
        ${poem.subtitle ? `<p class="reader-subtitle">${escapeHtml(poem.subtitle)}</p>` : ""}
        <div class="reader-meta" aria-label="Poem metadata">
          ${languageChips(poem)}
          <span>${escapeHtml(poem.theme.description)}</span>
        </div>
        <div class="reader-rule" aria-hidden="true"></div>
        <div class="reader-content${state.meaningVisible ? "" : " hide-meaning"}">${poem.contentHtml}</div>
        ${romanized}
        <nav class="reader-tools" aria-label="Poem navigation">
          <button class="previous" type="button" ${previous ? `data-select="${previous.id}"` : "disabled"}>← Previous</button>
          <button class="meaning" type="button" aria-pressed="${!state.meaningVisible}">${state.meaningVisible ? "Poetry mode" : "Annotated mode"}</button>
          ${canRomanize ? `<button class="romanize" type="button" aria-pressed="${state.transliterationVisible}">${state.transliterationVisible ? "Original script" : "Romanize"}</button>` : ""}
          <button class="share" type="button">Share</button>
          <button class="next" type="button" ${next ? `data-select="${next.id}"` : "disabled"}>Next →</button>
        </nav>
        <section class="poem-comments" aria-label="Reader comments">
          <div>
            <p class="comments-title">Reader notes</p>
            <p class="comments-copy">Leave a public note on this poem, and read what other readers noticed.</p>
          </div>
          <button class="load-comments" type="button">Show comments</button>
          <div class="comments-thread" data-loaded="false"></div>
        </section>
      </article>
    `;

    elements.reader.querySelector("#readerClose").addEventListener("click", closeReader);
    elements.reader.querySelectorAll("[data-select]").forEach((button) => {
      button.addEventListener("click", () => selectPoem(button.dataset.select, false));
    });
    elements.reader.querySelector(".meaning").addEventListener("click", toggleMeaning);
    elements.reader.querySelector(".romanize")?.addEventListener("click", () => {
      state.transliterationVisible = !state.transliterationVisible;
      selectPoem(poem.id, false);
    });
    elements.reader.querySelector(".share").addEventListener("click", () => sharePoem(poem));
    elements.reader.querySelector(".load-comments").addEventListener("click", () => loadComments(poem));

    renderList();
    history.replaceState(null, "", `#${poem.id}`);
    elements.reader.scrollTop = 0;

    if (openOnMobile && window.matchMedia("(max-width: 900px)").matches) {
      elements.reader.classList.add("is-open");
      document.body.classList.add("reader-open");
    }
  }

  function closeReader() {
    elements.reader.classList.remove("is-open");
    document.body.classList.remove("reader-open");
  }

  function toggleMeaning(event) {
    state.meaningVisible = !state.meaningVisible;
    const content = elements.reader.querySelector(".reader-content");
    content.classList.toggle("hide-meaning", !state.meaningVisible);
    event.currentTarget.textContent = state.meaningVisible ? "Poetry mode" : "Annotated mode";
    event.currentTarget.setAttribute("aria-pressed", String(!state.meaningVisible));
  }

  async function sharePoem(poem) {
    const url = `${location.href.split("#")[0]}#${poem.id}`;
    const shareData = {
      title: `${poem.title} | Siyahi`,
      text: poem.subtitle || `Poem ${poem.number} from Siyahi`,
      url,
    };

    if (navigator.share) {
      await navigator.share(shareData).catch(() => {});
      return;
    }

    const button = elements.reader.querySelector(".share");
    await navigator.clipboard.writeText(url);
    button.textContent = "Link copied";
    window.setTimeout(() => {
      button.textContent = "Share";
    }, 1600);
  }

  function switchLanguage(language) {
    clearPath();
    state.language = language;
    state.theme = "all";
    elements.themeSelect.value = "all";

    elements.tabs.forEach((tab) => {
      const active = tab.dataset.language === language;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    const selected = data.poems.find((poem) => poem.id === state.selectedId);
    if (!selected || !selected.languages.includes(language)) {
      const first = filteredPoems()[0];
      state.selectedId = first ? first.id : null;
      if (first && !window.matchMedia("(max-width: 900px)").matches) {
        selectPoem(first.id, false);
        return;
      }
    }
    renderList();
  }

  function chooseRandomPoem() {
    const poems = filteredPoems();
    if (!poems.length) return;
    const currentIndex = poems.findIndex((poem) => poem.id === state.selectedId);
    let nextIndex = Math.floor(Math.random() * poems.length);
    if (poems.length > 1 && nextIndex === currentIndex) {
      nextIndex = (nextIndex + 1) % poems.length;
    }
    selectPoem(poems[nextIndex].id, true);
  }

  function setDailyLine() {
    if (!data.aphorisms.length) return;
    const dayIndex = Math.floor(Date.now() / 86400000) % data.aphorisms.length;
    elements.dailyLine.textContent = `“${data.aphorisms[dayIndex]}”`;
  }

  function openPoem(id, openOnMobile) {
    const poem = data.poems.find((item) => item.id === id);
    if (!poem) return false;

    clearPath();
    state.language = poem.languages[0];
    elements.tabs.forEach((tab) => {
      const active = tab.dataset.language === state.language;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    state.theme = "all";
    elements.themeSelect.value = "all";
    state.query = "";
    elements.searchInput.value = "";

    selectPoem(poem.id, openOnMobile);
    return true;
  }

  function renderFeatured() {
    if (!elements.featuredGrid) return;

    const featured = data.poems
      .filter((poem) => poem.featuredRank)
      .sort((a, b) => a.featuredRank - b.featuredRank);

    elements.featuredGrid.innerHTML = featured
      .map(
        (poem) => `
          <button class="featured-card" type="button" data-poem-id="${poem.id}">
            <span class="featured-rank">${String(poem.featuredRank).padStart(2, "0")}</span>
            <span class="featured-title">${escapeHtml(poem.title)}</span>
            <span class="featured-meta">${escapeHtml(poem.theme.label)} · ${languageNames[poem.languages[0]]}</span>
            <span class="featured-excerpt">${escapeHtml(poem.meaning)}</span>
          </button>
        `
      )
      .join("");

    elements.featuredGrid.querySelectorAll(".featured-card").forEach((button) => {
      button.addEventListener("click", () => {
        openPoem(button.dataset.poemId, true);
        scrollToArchive();
      });
    });
  }

  function renderMoods() {
    if (!elements.moodGrid) return;

    elements.moodGrid.innerHTML = moodPaths
      .map((mood) => {
        const count = data.poems.filter((poem) => poem.theme.slug === mood.theme).length;
        return `
          <button class="mood-card" type="button" data-theme="${mood.theme}" data-poem-id="${mood.poemId}">
            <span class="mood-title">${escapeHtml(mood.title)}</span>
            <span class="mood-subtitle">${escapeHtml(mood.subtitle)}</span>
            <span class="mood-count">${count} ${count === 1 ? "poem" : "poems"}</span>
          </button>
        `;
      })
      .join("");

    elements.moodGrid.querySelectorAll(".mood-card").forEach((button) => {
      button.addEventListener("click", () => applyTheme(button.dataset.theme, button.dataset.poemId));
    });
  }

  function renderPaths() {
    if (!elements.pathGrid) return;

    elements.pathGrid.innerHTML = readingPaths
      .map((path) => {
        const poems = poemsForPath(path.key);
        const titles = poems.slice(0, 3).map((poem) => poem.title).join(" · ");
        return `
          <button class="path-card${state.path === path.key ? " is-active" : ""}" type="button" data-path="${path.key}">
            <span class="path-title">${escapeHtml(path.title)}</span>
            <span class="path-subtitle">${escapeHtml(path.subtitle)}</span>
            <span class="path-preview">${escapeHtml(titles)}</span>
            <span class="path-count">${poems.length} stops</span>
          </button>
        `;
      })
      .join("");

    elements.pathGrid.querySelectorAll(".path-card").forEach((button) => {
      button.addEventListener("click", () => applyPath(button.dataset.path));
    });
  }

  function applyPath(key) {
    const path = pathByKey(key);
    if (!path) return;
    state.path = key;
    state.query = "";
    state.theme = "all";
    elements.searchInput.value = "";
    elements.themeSelect.value = "all";
    elements.pathGrid.querySelectorAll(".path-card").forEach((card) => {
      card.classList.toggle("is-active", card.dataset.path === key);
    });
    const first = filteredPoems()[0];
    if (first) selectPoem(first.id, true);
    else renderList();
    scrollToArchive();
  }

  function restoreSectionHash() {
    const id = location.hash.slice(1);
    if (!["featured", "moods", "paths", "archive"].includes(id)) return;
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    }, 80);
  }

  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchLanguage(tab.dataset.language));
  });

  elements.themeSelect.addEventListener("change", (event) => {
    clearPath();
    state.theme = event.target.value;
    renderList();
  });

  elements.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderList();
  });

  elements.randomPoem.addEventListener("click", chooseRandomPoem);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeReader();
  });

  window.addEventListener("popstate", () => {
    const id = location.hash.slice(1);
    if (id.startsWith("poem-")) openPoem(id, false);
  });

  updateCounts();
  populateThemes();
  setDailyLine();
  renderFeatured();
  renderMoods();
  renderPaths();

  const hashId = location.hash.slice(1);
  if (!openPoem(hashId, false)) {
    const first = filteredPoems()[0];
    if (first && !window.matchMedia("(max-width: 900px)").matches) {
      selectPoem(first.id, false);
    } else {
      renderList();
    }
  }
  restoreSectionHash();
})();
