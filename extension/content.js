(() => {
  "use strict";

  const TOOLBAR_ID = "gt-roadmap-customizer-toolbar";
  const LEGACY_SETTINGS_KEY = "gtRoadmapCustomizerSettings";

  const DEFAULT_SETTINGS = {
    selectedTheme: "gt-classic",
    themeEnabled: true,
    compactMode: false,
    dimCompleted: false,
    emphasizePrereqs: false,
    customThemeColors: {
      page: "#0f2118",
      panel: "#1d3527",
      card: "#254331",
      input: "#203b2c",
      text: "#edf8f0",
      muted: "#bdd1c3",
      accent: "#6fd294",
      border: "#5fbf83",
      warning: "#ffbf7a"
    }
  };

  const THEME_CLASSES = [
    "gt-theme-gt-classic",
    "gt-theme-pink",
    "gt-theme-purple",
    "gt-theme-true-black",
    "gt-theme-forest-green",
    "gt-theme-ocean-blue",
    "gt-theme-sunset-orange",
    "gt-theme-custom"
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

  function normalizeHex(value, fallback) {
    const text = String(value || "").trim();
    const full = /^#?([0-9a-f]{6})$/i.exec(text);
    if (full) return `#${full[1].toLowerCase()}`;

    const short = /^#?([0-9a-f]{3})$/i.exec(text);
    if (short) {
      return `#${short[1]
        .split("")
        .map((character) => character + character)
        .join("")
        .toLowerCase()}`;
    }

    return fallback;
  }

  function normalizeCustomColors(colors) {
    return Object.fromEntries(
      Object.entries(DEFAULT_SETTINGS.customThemeColors).map(([key, fallback]) => [
        key,
        normalizeHex(colors && colors[key], fallback)
      ])
    );
  }

  function hexToRgb(hex) {
    const normalized = normalizeHex(hex, "#000000").slice(1);
    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16)
    };
  }

  function getReadableTextColor(backgroundHex) {
    const { r, g, b } = hexToRgb(backgroundHex);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance > 0.58 ? "#000000" : "#ffffff";
  }

  function setThemeVariable(element, name, value) {
    element.style.setProperty(name, value);
  }

  function clearCustomThemeVariables(element) {
    [
      "--gtc-page-bg",
      "--gtc-header-bg",
      "--gtc-sidebar-bg",
      "--gtc-main-bg",
      "--gtc-panel-bg",
      "--gtc-panel-bg-elevated",
      "--gtc-card-bg",
      "--gtc-card-hover-bg",
      "--gtc-input-bg",
      "--gtc-menu-bg",
      "--gtc-border",
      "--gtc-border-strong",
      "--gtc-text",
      "--gtc-text-muted",
      "--gtc-text-soft",
      "--gtc-focus-ring",
      "--gtc-hover-bg",
      "--gtc-selected-bg",
      "--gtc-selected-text",
      "--gtc-current-bg",
      "--gtc-current-text",
      "--gtc-current-border",
      "--gtc-current-ring",
      "--gtc-current-shadow",
      "--gtc-warning",
      "--gtc-warning-bg"
    ].forEach((name) => element.style.removeProperty(name));
  }

  function applyCustomThemeVariables(element, colors) {
    const textSoft = `color-mix(in srgb, ${colors.muted} 78%, ${colors.page})`;
    const hover = `color-mix(in srgb, ${colors.card} 84%, ${colors.accent})`;
    const accentText = getReadableTextColor(colors.accent);

    setThemeVariable(element, "--gtc-page-bg", colors.page);
    setThemeVariable(element, "--gtc-header-bg", colors.panel);
    setThemeVariable(element, "--gtc-sidebar-bg", colors.panel);
    setThemeVariable(element, "--gtc-main-bg", colors.page);
    setThemeVariable(element, "--gtc-panel-bg", colors.panel);
    setThemeVariable(element, "--gtc-panel-bg-elevated", `color-mix(in srgb, ${colors.panel} 86%, ${colors.card})`);
    setThemeVariable(element, "--gtc-card-bg", colors.card);
    setThemeVariable(element, "--gtc-card-hover-bg", hover);
    setThemeVariable(element, "--gtc-input-bg", colors.input);
    setThemeVariable(element, "--gtc-menu-bg", colors.card);
    setThemeVariable(element, "--gtc-border", colors.border);
    setThemeVariable(element, "--gtc-border-strong", colors.accent);
    setThemeVariable(element, "--gtc-text", colors.text);
    setThemeVariable(element, "--gtc-text-muted", colors.muted);
    setThemeVariable(element, "--gtc-text-soft", textSoft);
    setThemeVariable(element, "--gtc-focus-ring", `color-mix(in srgb, ${colors.accent} 36%, transparent)`);
    setThemeVariable(element, "--gtc-hover-bg", hover);
    setThemeVariable(element, "--gtc-selected-bg", colors.accent);
    setThemeVariable(element, "--gtc-selected-text", accentText);
    setThemeVariable(element, "--gtc-current-bg", colors.accent);
    setThemeVariable(element, "--gtc-current-text", accentText);
    setThemeVariable(element, "--gtc-current-border", colors.border);
    setThemeVariable(element, "--gtc-current-ring", `color-mix(in srgb, ${colors.accent} 32%, transparent)`);
    setThemeVariable(element, "--gtc-current-shadow", `0 0 0 1px color-mix(in srgb, ${colors.accent} 44%, transparent)`);
    setThemeVariable(element, "--gtc-warning", colors.warning);
    setThemeVariable(element, "--gtc-warning-bg", `color-mix(in srgb, ${colors.warning} 16%, transparent)`);
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
      customThemeColors: DEFAULT_SETTINGS.customThemeColors,
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
          : Boolean(legacy.emphasizePrereqs ?? DEFAULT_SETTINGS.emphasizePrereqs),
      customThemeColors: normalizeCustomColors(stored.customThemeColors)
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

      if (settings.themeEnabled && normalizeThemeName(settings.selectedTheme) === "custom") {
        applyCustomThemeVariables(element, settings.customThemeColors);
      } else {
        clearCustomThemeVariables(element);
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

  function annotateAll(selector, attribute, value = "true") {
    document.querySelectorAll(selector).forEach((element) => {
      element.setAttribute(attribute, value);
    });
  }

  function closestCourseCard(element) {
    if (!(element instanceof Element)) return null;
    return element.closest(
      [
        "[data-testid='course-card']",
        "[data-course-id]",
        "[data-gt-roadmap-course-card='true']",
        ".bg-background-elevated.border",
        ".dark\\:bg-background-elevated-dark.border"
      ].join(", ")
    );
  }

  function annotateCourseCards() {
    annotateAll(
      [
        "[data-testid='course-card']",
        "[data-course-id]",
        "[class*='course'][class*='card']",
        ".bg-background-elevated.border:has([data-course-menu])",
        ".dark\\:bg-background-elevated-dark.border:has([data-course-menu])",
        ".bg-background-elevated.border:has(.text-ready, .text-locked, .text-satisfied, .text-ap)",
        ".dark\\:bg-background-elevated-dark.border:has(.text-ready, .text-locked, .text-satisfied, .text-ap)"
      ].join(", "),
      "data-gt-roadmap-course-card"
    );

    annotateAll(
      [
        "[data-gt-roadmap-course-card='true'].border-error",
        "[data-gt-roadmap-course-card='true']:has(.text-locked)",
        ".bg-background-elevated.border-error",
        ".dark\\:bg-background-elevated-dark.border-error"
      ].join(", "),
      "data-gt-roadmap-prereq-warning"
    );

    annotateAll(
      [
        "[data-gt-roadmap-course-card='true'].border-selected",
        "[data-gt-roadmap-course-card='true'].shadow-highlight",
        ".bg-background-elevated.border-selected",
        ".dark\\:bg-background-elevated-dark.border-selected"
      ].join(", "),
      "data-gt-roadmap-selected-course"
    );

    document.querySelectorAll(".text-satisfied").forEach((element) => {
      const text = (element.textContent || "").trim().toLowerCase();
      const card = closestCourseCard(element);
      if (card && /^(satisfied|completed)$/.test(text)) {
        card.setAttribute("data-gt-roadmap-completed", "true");
      }
    });
  }

  function annotateStableTargets() {
    if (!document.body) return;

    // DOM targeting strategy:
    // Prefer source-owned hooks such as data-testid, data-course-id, ARIA labels,
    // roles, and semantic attributes. Text scanning is deliberately conservative
    // and only annotates leaf-like nodes so it does not fight React layout.
    annotateAll(
      [
        '[data-testid="prereq-warning"]',
        '[aria-label*="prereq" i]',
        '[aria-label*="coreq" i]',
        '[aria-label*="conflict" i]',
        '[role="alert"]',
        ".border-error",
        ".text-locked",
        ".text-status-error"
      ].join(", "),
      "data-gt-roadmap-prereq-warning"
    );

    annotateAll(
      [
        '[data-completed="true"]',
        '[data-status="completed"]',
        '[aria-label*="completed" i]',
        '[aria-label*="satisfied" i]',
        ".text-satisfied"
      ].join(", "),
      "data-gt-roadmap-completed"
    );

    annotateAll('[data-tour="course-panel"]', "data-gt-roadmap-course-panel");
    annotateAll('[data-tour="toolbar"], #roadmap-toolbar', "data-gt-roadmap-toolbar");
    annotateAll('[data-tour="semester-columns"]', "data-gt-roadmap-workspace");
    annotateAll('[data-tour="control-panel"]', "data-gt-roadmap-control-panel");
    annotateAll('[data-tour="search-bar"]', "data-gt-roadmap-search");
    annotateAll('[data-tour="course-filters"]', "data-gt-roadmap-course-filters");
    annotateAll('[data-semester]', "data-gt-roadmap-semester");
    annotateAll('[aria-label*="notes" i], textarea[placeholder*="notes" i]', "data-gt-roadmap-notes");
    annotateAll('[aria-label^="Add "][aria-label*=" semester bin"], [aria-label^="Remove "][aria-label*=" semester bin"]', "data-gt-roadmap-semester-action");
    annotateAll('[aria-label*="Zoom " i]', "data-gt-roadmap-zoom-control");

    annotateCurrentSemester();
    annotateCourseCards();

    annotateAll(
      '[data-semester] .scrollbar-themed, [data-tour="semester-columns"] .scrollbar-themed',
      "data-gt-roadmap-scroll-surface"
    );

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
        "customThemeColors",
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
