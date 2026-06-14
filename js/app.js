(function () {
  "use strict";

  const data = window.SIYAHI_DATA;
  if (!data || !Array.isArray(data.poems)) return;

  const languageNames = {
    hindi: "Hindi",
    marathi: "Marathi",
    english: "English",
  };

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
    if (id.startsWith("poem-")) selectPoem(id, false);
  });

  updateCounts();
  populateThemes();
  setDailyLine();

  const hashId = location.hash.slice(1);
  const hashPoem = data.poems.find((poem) => poem.id === hashId);
  if (hashPoem) {
    state.language = hashPoem.languages[0];
    elements.tabs.forEach((tab) => {
      const active = tab.dataset.language === state.language;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    selectPoem(hashPoem.id, false);
  } else {
    const first = filteredPoems()[0];
    if (first && !window.matchMedia("(max-width: 900px)").matches) {
      selectPoem(first.id, false);
    } else {
      renderList();
    }
  }
})();
