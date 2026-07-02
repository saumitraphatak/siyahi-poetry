(function () {
  "use strict";

  const data = window.SIYAHI_DATA;
  if (!data || !Array.isArray(data.poems)) return;

  const languageNames = {
    hindi: "Hindi",
    marathi: "Marathi",
    english: "English",
  };

  const moodPaths = [
    {
      title: "Longing",
      subtitle: "when the heart keeps returning",
      theme: "ishq",
      poemId: "poem-6",
    },
    {
      title: "Friendship",
      subtitle: "the people who become weather",
      theme: "dosti",
      poemId: "poem-50",
    },
    {
      title: "Home",
      subtitle: "family, memory, and the old room inside you",
      theme: "rishtey",
      poemId: "poem-53",
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
      poemId: "poem-100",
    },
  ];

  const state = {
    language: "hindi",
    theme: "all",
    query: "",
    selectedId: null,
    meaningVisible: true,
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

  function filteredPoems() {
    const query = state.query.trim().toLocaleLowerCase();
    return poemsForLanguage(state.language).filter((poem) => {
      const matchesTheme = state.theme === "all" || poem.theme.slug === state.theme;
      const matchesQuery = !query || poem.searchText.toLocaleLowerCase().includes(query);
      return matchesTheme && matchesQuery;
    });
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

    elements.resultCount.textContent = `${poems.length} ${poems.length === 1 ? "poem" : "poems"} in ${languageNames[state.language]}`;
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

  function applyTheme(theme, poemId) {
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

  function selectPoem(id, openOnMobile) {
    const poem = data.poems.find((item) => item.id === id);
    if (!poem) return;

    state.selectedId = poem.id;
    const visible = filteredPoems();
    const visibleIndex = visible.findIndex((item) => item.id === poem.id);
    const previous = visibleIndex > 0 ? visible[visibleIndex - 1] : null;
    const next = visibleIndex >= 0 && visibleIndex < visible.length - 1 ? visible[visibleIndex + 1] : null;

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
        <nav class="reader-tools" aria-label="Poem navigation">
          <button class="previous" type="button" ${previous ? `data-select="${previous.id}"` : "disabled"}>← Previous</button>
          <button class="meaning" type="button" aria-pressed="${state.meaningVisible}">${state.meaningVisible ? "Hide meaning" : "Show meaning"}</button>
          <button class="share" type="button">Share</button>
          <button class="next" type="button" ${next ? `data-select="${next.id}"` : "disabled"}>Next →</button>
        </nav>
      </article>
    `;

    elements.reader.querySelector("#readerClose").addEventListener("click", closeReader);
    elements.reader.querySelectorAll("[data-select]").forEach((button) => {
      button.addEventListener("click", () => selectPoem(button.dataset.select, false));
    });
    elements.reader.querySelector(".meaning").addEventListener("click", toggleMeaning);
    elements.reader.querySelector(".share").addEventListener("click", () => sharePoem(poem));

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
    event.currentTarget.textContent = state.meaningVisible ? "Hide meaning" : "Show meaning";
    event.currentTarget.setAttribute("aria-pressed", String(state.meaningVisible));
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

  function restoreSectionHash() {
    const id = location.hash.slice(1);
    if (!["featured", "moods", "archive"].includes(id)) return;
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    }, 80);
  }

  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchLanguage(tab.dataset.language));
  });

  elements.themeSelect.addEventListener("change", (event) => {
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
