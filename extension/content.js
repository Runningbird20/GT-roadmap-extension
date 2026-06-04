(() => {
  "use strict";

  const TOOLBAR_ID = "gt-roadmap-customizer-toolbar";
  const LEGACY_SETTINGS_KEY = "gtRoadmapCustomizerSettings";

  const DEFAULT_SETTINGS = {
    selectedTheme: "gt-classic",
    themeEnabled: true,
    compactMode: false,
    dimCompleted: false,
    emphasizePrereqs: false
  };

  const THEME_CLASSES = [
    "gt-theme-gt-classic",
    "gt-theme-pink",
    "gt-theme-purple",
    "gt-theme-true-black",
    "gt-theme-forest-green",
    "gt-theme-ocean-blue",
    "gt-theme-sunset-orange"
  ];

  const BODY_CLASSES = {
    themeEnabled: "gt-theme-enabled",
    compactMode: "gt-roadmap-compact-mode",
    dimCompleted: "gt-roadmap-dim-completed",
    emphasizePrereqs: "gt-roadmap-emphasize-prereqs"
  };

  const ALL_CONTROL_CLASSES = [
    BODY_CLASSES.themeEnabled,
    BODY_CLASSES.compactMode,
    BODY_CLASSES.dimCompleted,
    BODY_CLASSES.emphasizePrereqs,
    "gt-roadmap-customizer-enabled",
    ...THEME_CLASSES
  ];

  const TOOLBAR_TOGGLES = [
    { key: "compactMode", label: "Compact", title: "Toggle compact roadmap spacing" },
    { key: "dimCompleted", label: "Done", title: "Toggle completed course dimming" },
    { key: "emphasizePrereqs", label: "Prereqs", title: "Toggle prerequisite warning emphasis" }
  ];

  let settings = { ...DEFAULT_SETTINGS };
  let observer = null;
  let scanQueued = false;
  let lastDebugAt = 0;

  const hasChromeStorage =
    typeof chrome !== "undefined" &&
    chrome.storage &&
    chrome.storage.sync;

  function normalizeThemeName(themeName) {
    return THEME_CLASSES.includes(`gt-theme-${themeName}`) ? themeName : DEFAULT_SETTINGS.selectedTheme;
  }

  function getStorage(keys) {
    return new Promise((resolve) => {
      if (!hasChromeStorage) {
        resolve({});
        return;
      }

      chrome.storage.sync.get(keys, (result) => {
        resolve(result || {});
      });
    });
  }

  function setStorage(values) {
    return new Promise((resolve) => {
      if (!hasChromeStorage) {
        resolve();
        return;
      }

      chrome.storage.sync.set(values, resolve);
    });
  }

  async function readSettings() {
    const stored = await getStorage({
      selectedTheme: DEFAULT_SETTINGS.selectedTheme,
      themeEnabled: DEFAULT_SETTINGS.themeEnabled,
      compactMode: DEFAULT_SETTINGS.compactMode,
      dimCompleted: DEFAULT_SETTINGS.dimCompleted,
      emphasizePrereqs: DEFAULT_SETTINGS.emphasizePrereqs,
      [LEGACY_SETTINGS_KEY]: null
    });

    const legacy = stored[LEGACY_SETTINGS_KEY] || {};
    return {
      selectedTheme: normalizeThemeName(stored.selectedTheme || DEFAULT_SETTINGS.selectedTheme),
      themeEnabled:
        typeof stored.themeEnabled === "boolean"
          ? stored.themeEnabled
          : Boolean(legacy.theme ?? DEFAULT_SETTINGS.themeEnabled),
      compactMode:
        typeof stored.compactMode === "boolean"
          ? stored.compactMode
          : Boolean(legacy.compact ?? DEFAULT_SETTINGS.compactMode),
      dimCompleted:
        typeof stored.dimCompleted === "boolean"
          ? stored.dimCompleted
          : Boolean(legacy.dimCompleted ?? DEFAULT_SETTINGS.dimCompleted),
      emphasizePrereqs:
        typeof stored.emphasizePrereqs === "boolean"
          ? stored.emphasizePrereqs
          : Boolean(legacy.emphasizePrereqs ?? DEFAULT_SETTINGS.emphasizePrereqs)
    };
  }

  async function refreshSettings() {
    settings = await readSettings();
    applySettings();
    renderToolbarState();
  }

  async function updateSetting(key) {
    const nextSettings = { ...settings, [key]: !settings[key] };
    settings = nextSettings;
    await setStorage({ [key]: nextSettings[key] });
    applySettings();
    renderToolbarState();
  }

  function applySettings() {
    if (!document.documentElement || !document.body) return;

    [document.documentElement, document.body].forEach((element) => {
      element.classList.remove(...ALL_CONTROL_CLASSES);
      element.classList.toggle(BODY_CLASSES.themeEnabled, Boolean(settings.themeEnabled));

      if (settings.themeEnabled) {
        element.classList.add(`gt-theme-${normalizeThemeName(settings.selectedTheme)}`);
      }

      element.classList.toggle(BODY_CLASSES.compactMode, Boolean(settings.compactMode));
      element.classList.toggle(BODY_CLASSES.dimCompleted, Boolean(settings.dimCompleted));
      element.classList.toggle(BODY_CLASSES.emphasizePrereqs, Boolean(settings.emphasizePrereqs));
    });

    annotateStableTargets();
    debugThemeState();
  }

  function ensureToolbar() {
    if (!document.body || document.getElementById(TOOLBAR_ID)) return;

    const toolbar = document.createElement("section");
    toolbar.id = TOOLBAR_ID;
    toolbar.setAttribute("aria-label", "GT Roadmap quick customization controls");

    const title = document.createElement("div");
    title.className = "gt-roadmap-customizer-toolbar-title";
    title.textContent = "Roadmap";
    toolbar.appendChild(title);

    TOOLBAR_TOGGLES.forEach((toggle) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.settingKey = toggle.key;
      button.title = toggle.title;
      button.setAttribute("aria-pressed", "false");
      button.textContent = toggle.label;
      button.addEventListener("click", () => {
        updateSetting(toggle.key);
      });
      toolbar.appendChild(button);
    });

    document.body.appendChild(toolbar);
    renderToolbarState();
  }

  function renderToolbarState() {
    const toolbar = document.getElementById(TOOLBAR_ID);
    if (!toolbar) return;

    toolbar.querySelectorAll("button[data-setting-key]").forEach((button) => {
      const key = button.dataset.settingKey;
      const enabled = Boolean(settings[key]);
      button.classList.toggle("is-active", enabled);
      button.setAttribute("aria-pressed", String(enabled));
    });
  }

  function annotateStableTargets() {
    if (!document.body) return;

    // DOM targeting strategy:
    // Prefer source-owned hooks such as data-testid, data-course-id, ARIA labels,
    // roles, and semantic attributes. Text scanning is deliberately conservative
    // and only annotates leaf-like nodes so it does not fight React layout.
    document
      .querySelectorAll(
        '[data-testid="prereq-warning"], [aria-label*="prereq" i], [aria-label*="coreq" i], [role="alert"]'
      )
      .forEach((element) => {
        element.setAttribute("data-gt-roadmap-prereq-warning", "true");
      });

    document
      .querySelectorAll('[data-completed="true"], [data-status="completed"], [aria-label*="completed" i]')
      .forEach((element) => {
        element.setAttribute("data-gt-roadmap-completed", "true");
      });

    document.querySelectorAll('[data-tour="course-panel"]').forEach((element) => {
      element.setAttribute("data-gt-roadmap-course-panel", "true");
    });

    document.querySelectorAll('[data-tour="toolbar"], #roadmap-toolbar').forEach((element) => {
      element.setAttribute("data-gt-roadmap-toolbar", "true");
    });

    document.querySelectorAll('[data-tour="semester-columns"]').forEach((element) => {
      element.setAttribute("data-gt-roadmap-workspace", "true");
    });

    document.querySelectorAll('[data-semester]').forEach((element) => {
      element.setAttribute("data-gt-roadmap-semester", "true");
    });

    annotateCurrentSemester();

    document.querySelectorAll('[data-semester] .scrollbar-themed, [data-tour="semester-columns"] .scrollbar-themed').forEach((element) => {
      element.setAttribute("data-gt-roadmap-scroll-surface", "true");
    });

    const warningTextPattern = /\b(prereq|prerequisite|coreq|co-requisite|missing requirement)\b/i;
    document.querySelectorAll("p, li, div, span").forEach((element) => {
      if (element.children.length > 0) return;
      const text = element.textContent || "";
      if (warningTextPattern.test(text)) {
        element.setAttribute("data-gt-roadmap-prereq-warning", "true");
      }
    });
  }

  function getCurrentSemesterLabel() {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const term = month <= 3 ? "Spring" : month <= 6 ? "Summer" : "Fall";
    return `${term} ${year}`;
  }

  function annotateCurrentSemester() {
    const currentSemesterLabel = getCurrentSemesterLabel();
    const normalizedCurrent = currentSemesterLabel.toLowerCase();

    document
      .querySelectorAll(".gt-roadmap-current-semester-indicator, [data-gt-roadmap-current-semester='true']")
      .forEach((element) => {
        element.classList.remove("gt-roadmap-current-semester-indicator");
        element.removeAttribute("data-gt-roadmap-current-semester");
      });

    document.querySelectorAll("[data-semester]").forEach((semesterElement) => {
      const semesterName = semesterElement.getAttribute("data-semester") || "";
      if (semesterName.trim().toLowerCase() !== normalizedCurrent) return;

      semesterElement.setAttribute("data-gt-roadmap-current-semester", "true");
      const label = Array.from(semesterElement.querySelectorAll("p, span, h2, h3")).find(
        (element) => (element.textContent || "").trim().toLowerCase() === normalizedCurrent
      );
      if (label) {
        label.classList.add("gt-roadmap-current-semester-indicator");
      }
    });

    document.querySelectorAll('[aria-label*="current" i], [class*="current" i]').forEach((element) => {
      const ariaLabel = (element.getAttribute("aria-label") || "").trim().toLowerCase();
      const text = (element.textContent || "").trim().toLowerCase();
      if (
        ariaLabel.includes("current") ||
        text.includes(normalizedCurrent) ||
        /\bcurrent\b/.test(text)
      ) {
        element.classList.add("gt-roadmap-current-semester-indicator");
      }
    });
  }

  function debugThemeState() {
    try {
      if (window.localStorage.getItem("GT_ROADMAP_THEME_DEBUG") !== "true") return;
      const now = Date.now();
      if (now - lastDebugAt < 1000) return;
      lastDebugAt = now;

      const selectors = {
        appRoot: "#root, #app, [id='root'], [id='app']",
        header: "header, nav, [role='banner'], [data-user-button]",
        toolbar: "#roadmap-toolbar, [data-tour='toolbar']",
        coursePanel: "[data-tour='course-panel']",
        workspace: "[data-tour='semester-columns']",
        currentSemester: "[data-gt-roadmap-current-semester='true'], .gt-roadmap-current-semester-indicator",
        scrollSurface: "[data-gt-roadmap-scroll-surface='true']",
        semester: "[data-semester]",
        courseCard: "[data-testid='course-card'], [data-course-id], [class*='course'][class*='card']",
        search: "[data-tour='search-bar'], [aria-label='Course search bar']"
      };

      const found = Object.fromEntries(
        Object.entries(selectors).map(([key, selector]) => [key, Boolean(document.querySelector(selector))])
      );

      console.info("[GT Roadmap Customizer]", {
        selectedTheme: settings.selectedTheme,
        themeEnabled: settings.themeEnabled,
        htmlClasses: Array.from(document.documentElement.classList),
        bodyClasses: Array.from(document.body.classList),
        found
      });
    } catch (_error) {
      // Debug logging should never affect the page.
    }
  }

  function queueScan() {
    if (scanQueued) return;
    scanQueued = true;
    window.requestAnimationFrame(() => {
      scanQueued = false;
      ensureToolbar();
      applySettings();
    });
  }

  function startObserver() {
    if (observer || !document.documentElement) return;

    observer = new MutationObserver(() => queueScan());
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function installMessageListener() {
    if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.onMessage) return;

    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (!message || message.type !== "GT_ROADMAP_SETTINGS_UPDATED") return false;

      refreshSettings()
        .then(() => sendResponse({ ok: true, settings }))
        .catch(() => sendResponse({ ok: false }));
      return true;
    });
  }

  function installStorageListener() {
    if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.onChanged) return;

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "sync") return;
      const watchedKeys = [
        "selectedTheme",
        "themeEnabled",
        "compactMode",
        "dimCompleted",
        "emphasizePrereqs",
        LEGACY_SETTINGS_KEY
      ];

      if (watchedKeys.some((key) => Object.prototype.hasOwnProperty.call(changes, key))) {
        refreshSettings();
      }
    });
  }

  async function init() {
    await refreshSettings();
    ensureToolbar();
    startObserver();
    installMessageListener();
    installStorageListener();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
