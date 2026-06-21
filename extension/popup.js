(() => {
  "use strict";

  const DEFAULT_SETTINGS = {
    selectedTheme: "gt-classic",
    selectedFont: "default",
    themeEnabled: true,
    showCourseName: true,
    showCourseCredits: true,
    showCourseGpa: true,
    cornerRadius: 8,
    selectedLanguage: "en",
    selectedFunLanguage: "en",
    selectedAccessibilityMode: "none",
    selectedReadableFont: "default",
    bodyFontScale: 100,
    courseCardFontScale: 100,
    semesterHeaderFontScale: 100,
    readabilityLetterSpacing: 0,
    readabilityWordSpacing: 0,
    readabilityLineHeight: 140,
    distractionFreeMode: false,
    prereqHighlight: true,
    creditLoadIndicator: true,
    creditLoadLightBelow: 12,
    creditLoadHeavyFrom: 18,
    creditLoadOverloadedFrom: 21,
    customThemeMode: "easy",
    customThemeBaseColor: "#0f2118",
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

  const TOGGLE_KEYS = [
    "themeEnabled",
    "showCourseName",
    "showCourseCredits",
    "showCourseGpa",
    "distractionFreeMode",
    "prereqHighlight",
    "creditLoadIndicator"
  ];
  const NUMERIC_KEYS = ["creditLoadLightBelow", "creditLoadHeavyFrom", "creditLoadOverloadedFrom"];

  // ── Theme data ─────────────────────────────────────────────────────────────

  const CUSTOM_COLOR_FIELDS = [
    { key: "page", label: "Page" },
    { key: "panel", label: "Panel" },
    { key: "card", label: "Cards" },
    { key: "input", label: "Inputs" },
    { key: "text", label: "Text" },
    { key: "muted", label: "Muted text" },
    { key: "accent", label: "Accent" },
    { key: "border", label: "Borders" },
    { key: "warning", label: "Warnings" }
  ];

  const THEMES = [
    { id: "gt-classic", name: "GT Classic", preview: { page: "#f5f5f3", panel: "#efeee9", card: "#fafaf8", text: "#1a1a1a", current: "#b3a369", accent: "#b3a369" } },
    { id: "pink", name: "Pink", preview: { page: "#fff1f7", panel: "#fff9fc", card: "#ffffff", text: "#321620", current: "#c93678", accent: "#d54f8b" } },
    { id: "purple", name: "Purple", preview: { page: "#171126", panel: "#211638", card: "#342454", text: "#f5efff", current: "#a779ff", accent: "#c9b8e8" } },
    { id: "true-black", name: "True Black", preview: { page: "#000000", panel: "#101010", card: "#171717", text: "#f5f5f5", current: "#f5f5f5", accent: "#b7b7b7" } },
    { id: "forest-green", name: "Forest Green", preview: { page: "#0f2118", panel: "#1d3527", card: "#254331", text: "#edf8f0", current: "#6fd294", accent: "#5fbf83" } },
    { id: "ocean-blue", name: "Ocean Blue", preview: { page: "#0c2032", panel: "#173a56", card: "#1f4968", text: "#edf8ff", current: "#60d5ff", accent: "#45c7f0" } },
    { id: "sunset-orange", name: "Sunset Orange", preview: { page: "#fff6eb", panel: "#fffaf3", card: "#ffffff", text: "#352012", current: "#d96026", accent: "#ffb97d" } },
    { id: "zelda", name: "Zelda", preview: { page: "#102616", panel: "#17351f", card: "#21472b", text: "#f3f4dc", current: "#d6b35a", accent: "#6dbb67" } },
    { id: "cyberpunk", name: "Cyberpunk", preview: { page: "#12071f", panel: "#231036", card: "#311548", text: "#fff3a6", current: "#00e5ff", accent: "#ff2bd6" } },
    { id: "terminal-hacker", name: "Terminal/Hacker", preview: { page: "#00150a", panel: "#062110", card: "#0b2c16", text: "#b8ffcb", current: "#39ff88", accent: "#17c964" } },
    { id: "georgia-tech-dark", name: "Georgia Tech Dark", preview: { page: "#061527", panel: "#0b2037", card: "#12304c", text: "#f2e6b3", current: "#b3a369", accent: "#d7c98a" } },
    { id: "material-you", name: "Material You", preview: { page: "#f4f7fb", panel: "#e7eef8", card: "#ffffff", text: "#172033", current: "#5a6ff0", accent: "#7c8cff" } },
    { id: "glassmorphism", name: "Glassmorphism", preview: { page: "#eaf3ff", panel: "#f7fbff", card: "#ffffff", text: "#142033", current: "#4b8dff", accent: "#8fd3ff" } },
    { id: "amoled-black", name: "AMOLED Black", preview: { page: "#000000", panel: "#050505", card: "#0b0b0b", text: "#f7fff9", current: "#00ff85", accent: "#00c2ff" } },
    { id: "catppuccin", name: "Catppuccin", preview: { page: "#1e1e2e", panel: "#242438", card: "#313244", text: "#cdd6f4", current: "#cba6f7", accent: "#f5c2e7" } },
    { id: "nord", name: "Nord", preview: { page: "#2e3440", panel: "#3b4252", card: "#434c5e", text: "#eceff4", current: "#88c0d0", accent: "#a3be8c" } },
    { id: "gruvbox", name: "Gruvbox", preview: { page: "#282828", panel: "#32302f", card: "#3c3836", text: "#ebdbb2", current: "#fabd2f", accent: "#b8bb26" } },
    { id: "dracula", name: "Dracula", preview: { page: "#282a36", panel: "#21222c", card: "#353746", text: "#f8f8f2", current: "#ff79c6", accent: "#bd93f9" } },
    { id: "solarized-dark", name: "Solarized Dark", preview: { page: "#002b36", panel: "#073642", card: "#0d4552", text: "#93a1a1", current: "#2aa198", accent: "#268bd2" } },
    { id: "rose-gold", name: "Rose Gold", preview: { page: "#fdf0ed", panel: "#fff8f6", card: "#ffffff", text: "#3d1e1a", current: "#c97b87", accent: "#e8a8b2" } },
    { id: "midnight", name: "Midnight", preview: { page: "#1a1b2e", panel: "#222338", card: "#2d2e48", text: "#e8eaf6", current: "#7986cb", accent: "#5c6bc0" } },
    { id: "crimson", name: "Crimson", preview: { page: "#130808", panel: "#1e0e0e", card: "#2d1818", text: "#f9e4e4", current: "#e53535", accent: "#c62828" } },
    { id: "emerald", name: "Emerald", preview: { page: "#051710", panel: "#0c2a1c", card: "#18402c", text: "#d4f5e4", current: "#00c853", accent: "#69f0ae" } },
    { id: "superman", name: "Superman", preview: { page: "#060e24", panel: "#0d1c40", card: "#172a60", text: "#e8f0ff", current: "#d32f2f", accent: "#f9a825" } },
    { id: "custom", name: "Custom", preview: null }
  ];

  // ── Font data ──────────────────────────────────────────────────────────────

  const FONT_OPTIONS = globalThis.GT_ROADMAP_FONT_OPTIONS || [
    { id: "default", name: "Default", sample: "Roadmap Aa", group: "Default", family: 'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif' }
  ];
  const FONT_FACE_DEFINITIONS = globalThis.GT_ROADMAP_FONT_FACES || [];
  const FONT_FACE_STYLE_ID = "gt-roadmap-font-picker-font-faces";
  const FONT_PREVIEW_TEXT = "CS 1301";
  const FONT_GROUP_ORDER = ["Dyslexia Support", "Default", "Clean Sans", "Local/System", "Tech", "Retro", "Serif & Handwritten", "Nerd Fonts"];

  // ── Language data ──────────────────────────────────────────────────────────

  const LANGUAGE_OPTIONS = globalThis.GT_ROADMAP_LANGUAGES || [
    { id: "en", label: "English 🇺🇸", name: "English", htmlLang: "en", dir: "ltr" }
  ];
  const FUN_LANGUAGE_IDS = globalThis.GT_ROADMAP_FUN_LANGUAGE_IDS || [];
  const REAL_LANGUAGE_OPTIONS = LANGUAGE_OPTIONS.filter((l) => !FUN_LANGUAGE_IDS.includes(l.id));
  const FUN_LANGUAGE_OPTIONS = LANGUAGE_OPTIONS.filter((l) => FUN_LANGUAGE_IDS.includes(l.id));

  // ── Module-level state ─────────────────────────────────────────────────────

  let selectedTheme = DEFAULT_SETTINGS.selectedTheme;
  let selectedAccessibilityMode = DEFAULT_SETTINGS.selectedAccessibilityMode;
  let themeEnabled = DEFAULT_SETTINGS.themeEnabled;
  let customThemeMode = DEFAULT_SETTINGS.customThemeMode;
  let customThemeBaseColor = DEFAULT_SETTINGS.customThemeBaseColor;
  let customThemeColors = { ...DEFAULT_SETTINGS.customThemeColors };
  let selectedFont = DEFAULT_SETTINGS.selectedFont;
  let currentLanguageId = DEFAULT_SETTINGS.selectedLanguage;

  // ── DOM refs ───────────────────────────────────────────────────────────────

  const form = document.getElementById("settings-form");
  const languageSelect = document.getElementById("language-select");
  const funLanguageRow = document.getElementById("fun-language-row");
  const funLanguageSelect = document.getElementById("fun-language-select");
  const cornerRadiusSlider = document.getElementById("corner-radius-slider");
  const cornerRadiusValue = document.getElementById("corner-radius-value");
  const resetButton = document.getElementById("reset-button");
  const status = document.getElementById("status");
  const themeGrid = document.getElementById("theme-grid");
  const customThemeCard = document.getElementById("custom-theme-card");
  const customColorGrid = document.getElementById("custom-color-grid");
  const useCustomButton = document.getElementById("use-custom-button");
  const fontGrid = document.getElementById("font-grid");

  // ── Utility ────────────────────────────────────────────────────────────────

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  function getStorage(defaults) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(defaults, (result) => {
        resolve({ ...defaults, ...(result || {}) });
      });
    });
  }

  function setStorage(values) {
    return new Promise((resolve) => {
      chrome.storage.sync.set(values, resolve);
    });
  }

  async function notifyActiveTab() {
    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const tab = tabs[0];
    if (!tab || !tab.id) return;
    chrome.tabs.sendMessage(tab.id, { type: "GT_ROADMAP_SETTINGS_UPDATED" }, () => {
      if (chrome.runtime.lastError) {
        setStatus("Open a Roadmap tab to apply.");
        return;
      }
      setStatus("Applied.");
    });
  }

  // ── Normalize helpers ──────────────────────────────────────────────────────

  function normalizeCornerRadius(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return DEFAULT_SETTINGS.cornerRadius;
    return Math.max(0, Math.min(24, Math.round(number)));
  }

  function normalizeLanguageId(languageId) {
    return REAL_LANGUAGE_OPTIONS.some((l) => l.id === languageId) ? languageId : DEFAULT_SETTINGS.selectedLanguage;
  }

  function normalizeFunLanguageId(languageId) {
    return FUN_LANGUAGE_OPTIONS.some((l) => l.id === languageId) ? languageId : DEFAULT_SETTINGS.selectedFunLanguage;
  }

  function normalizeFontId(fontId) {
    return FONT_OPTIONS.some((f) => f.id === fontId) ? fontId : DEFAULT_SETTINGS.selectedFont;
  }

  function normalizeHex(value, fallback) {
    const text = String(value || "").trim();
    const full = /^#?([0-9a-f]{6})$/i.exec(text);
    if (full) return `#${full[1].toLowerCase()}`;
    const short = /^#?([0-9a-f]{3})$/i.exec(text);
    if (short) return `#${short[1].split("").map((c) => c + c).join("").toLowerCase()}`;
    return fallback;
  }

  // ── Color utilities ────────────────────────────────────────────────────────

  function normalizeCustomColors(colors) {
    const result = {};
    CUSTOM_COLOR_FIELDS.forEach((field) => {
      result[field.key] = normalizeHex(
        colors && colors[field.key],
        DEFAULT_SETTINGS.customThemeColors[field.key]
      );
    });
    return result;
  }

  function hexToRgb(hex) {
    const n = normalizeHex(hex, "#000000").slice(1);
    return { r: parseInt(n.slice(0, 2), 16), g: parseInt(n.slice(2, 4), 16), b: parseInt(n.slice(4, 6), 16) };
  }

  function rgbToHex({ r, g, b }) {
    return `#${[r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("")}`;
  }

  function mixColors(hexA, hexB, amountB) {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    const t = 1 - amountB;
    return rgbToHex({ r: a.r * t + b.r * amountB, g: a.g * t + b.g * amountB, b: a.b * t + b.b * amountB });
  }

  function getLuminance(hex) {
    const { r, g, b } = hexToRgb(hex);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  function getReadableTextColor(bgHex) {
    return getLuminance(bgHex) > 0.58 ? "#1a1a1a" : "#f5f5f5";
  }

  function deriveEasyThemeColors(baseColor) {
    const page = normalizeHex(baseColor, DEFAULT_SETTINGS.customThemeBaseColor);
    const isLight = getLuminance(page) > 0.58;
    const contrast = isLight ? "#000000" : "#ffffff";
    const inverse = isLight ? "#ffffff" : "#000000";
    const text = getReadableTextColor(page);
    const panel = mixColors(page, inverse, isLight ? 0.16 : 0.11);
    const card = mixColors(page, inverse, isLight ? 0.24 : 0.19);
    const input = mixColors(page, inverse, isLight ? 0.12 : 0.15);
    const accent = mixColors(page, contrast, isLight ? 0.34 : 0.42);
    const border = mixColors(page, accent, 0.62);
    const muted = mixColors(text, page, 0.38);
    return normalizeCustomColors({
      page, panel, card, input, text, muted, accent, border,
      warning: isLight ? "#b84d00" : "#ffbf7a"
    });
  }

  function getCustomPreview() {
    return {
      page: customThemeColors.page,
      panel: customThemeColors.panel,
      card: customThemeColors.card,
      text: customThemeColors.text,
      current: customThemeColors.accent,
      accent: customThemeColors.border
    };
  }

  // ── Theme rendering ────────────────────────────────────────────────────────

  function renderThemes() {
    if (!themeGrid) return;
    themeGrid.innerHTML = "";

    THEMES.forEach((theme) => {
      const previewColors = theme.id === "custom" ? getCustomPreview() : theme.preview;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "theme-card";
      button.dataset.themeId = theme.id;
      button.setAttribute(
        "aria-pressed",
        String(selectedAccessibilityMode === "none" && theme.id === selectedTheme)
      );
      button.title = theme.name;
      button.setAttribute("aria-label", theme.name);

      const preview = document.createElement("span");
      preview.className = "theme-preview";
      preview.setAttribute("aria-hidden", "true");
      if (previewColors) {
        preview.style.setProperty("--preview-page", previewColors.page);
        preview.style.setProperty("--preview-panel", previewColors.panel);
        preview.style.setProperty("--preview-card", previewColors.card);
        preview.style.setProperty("--preview-text", previewColors.text);
        preview.style.setProperty("--preview-current", previewColors.current);
        preview.style.setProperty("--preview-accent", previewColors.accent);
      }

      const previewPanel = document.createElement("span");
      previewPanel.className = "theme-preview-panel";
      const previewHeader = document.createElement("span");
      previewHeader.className = "theme-preview-header";
      const previewCurrent = document.createElement("span");
      previewCurrent.className = "theme-preview-current";
      const previewCard = document.createElement("span");
      previewCard.className = "theme-preview-card";
      previewCard.innerHTML = "<span></span><span></span>";
      const previewAccent = document.createElement("span");
      previewAccent.className = "theme-preview-accent";
      previewPanel.append(previewHeader, previewCurrent, previewCard, previewAccent);
      preview.append(previewPanel);
      button.append(preview);

      button.addEventListener("click", async () => {
        selectedTheme = theme.id;
        selectedAccessibilityMode = "none";
        themeEnabled = true;
        if (form.elements["themeEnabled"]) form.elements["themeEnabled"].checked = true;
        await setStorage({ selectedTheme, selectedAccessibilityMode, themeEnabled });
        renderThemes();
        renderCustomEditor();
        await notifyActiveTab();
      });

      themeGrid.appendChild(button);
    });
  }

  function renderCustomEditor() {
    if (!customColorGrid || !customThemeCard || !useCustomButton) return;
    const customIsActive = selectedAccessibilityMode === "none" && selectedTheme === "custom";
    customThemeCard.classList.toggle("is-active", customIsActive);
    useCustomButton.textContent = customIsActive ? "Using Custom" : "Use Custom";
    customColorGrid.innerHTML = "";

    const modeControl = document.createElement("div");
    modeControl.className = "custom-mode-control";
    modeControl.setAttribute("role", "tablist");
    modeControl.setAttribute("aria-label", "Custom color mode");
    [{ id: "easy", label: "Easy" }, { id: "advanced", label: "Advanced" }].forEach((mode) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "custom-mode-button";
      btn.textContent = mode.label;
      btn.setAttribute("aria-selected", String(customThemeMode === mode.id));
      btn.addEventListener("click", () => saveCustomMode(mode.id));
      modeControl.appendChild(btn);
    });
    customColorGrid.appendChild(modeControl);

    if (customThemeMode === "easy") {
      const row = document.createElement("label");
      row.className = "custom-color-row custom-color-row-easy";
      const label = document.createElement("span");
      label.className = "custom-color-label";
      label.textContent = "Page color";
      const hex = document.createElement("input");
      hex.type = "text";
      hex.inputMode = "text";
      hex.spellcheck = false;
      hex.value = customThemeBaseColor;
      hex.pattern = "#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?";
      hex.setAttribute("aria-label", "Page color hex value");
      hex.addEventListener("change", () => {
        const normalized = normalizeHex(hex.value, customThemeBaseColor);
        hex.value = normalized;
        saveEasyBaseColor(normalized, customIsActive);
      });
      const helper = document.createElement("p");
      helper.className = "custom-mode-helper";
      helper.textContent = "The rest of the palette is generated from this color.";
      row.append(label, hex);
      customColorGrid.append(row, helper);
      return;
    }

    CUSTOM_COLOR_FIELDS.forEach((field) => {
      const row = document.createElement("label");
      row.className = "custom-color-row";
      const label = document.createElement("span");
      label.className = "custom-color-label";
      label.textContent = field.label;
      const hex = document.createElement("input");
      hex.type = "text";
      hex.inputMode = "text";
      hex.spellcheck = false;
      hex.value = customThemeColors[field.key];
      hex.pattern = "#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?";
      hex.setAttribute("aria-label", `${field.label} hex value`);
      hex.addEventListener("change", () => {
        const normalized = normalizeHex(hex.value, customThemeColors[field.key]);
        hex.value = normalized;
        saveCustomColors({ ...customThemeColors, [field.key]: normalized }, customIsActive);
      });
      row.append(label, hex);
      customColorGrid.appendChild(row);
    });
  }

  async function saveCustomColors(nextColors, activate = false) {
    customThemeColors = normalizeCustomColors(nextColors);
    const values = { customThemeColors };
    if (activate) {
      selectedTheme = "custom";
      selectedAccessibilityMode = "none";
      values.selectedTheme = selectedTheme;
      values.selectedAccessibilityMode = selectedAccessibilityMode;
      values.themeEnabled = themeEnabled;
    }
    await setStorage(values);
    renderThemes();
    renderCustomEditor();
    await notifyActiveTab();
  }

  async function saveCustomMode(nextMode) {
    customThemeMode = nextMode === "advanced" ? "advanced" : "easy";
    const values = { customThemeMode };
    if (customThemeMode === "easy") {
      customThemeBaseColor = normalizeHex(customThemeColors.page, customThemeBaseColor);
      customThemeColors = deriveEasyThemeColors(customThemeBaseColor);
      values.customThemeColors = customThemeColors;
      values.customThemeBaseColor = customThemeBaseColor;
    }
    await setStorage(values);
    renderThemes();
    renderCustomEditor();
    if (selectedTheme === "custom") await notifyActiveTab();
  }

  async function saveEasyBaseColor(nextColor, activate = false) {
    customThemeBaseColor = normalizeHex(nextColor, customThemeBaseColor);
    customThemeColors = deriveEasyThemeColors(customThemeBaseColor);
    customThemeMode = "easy";
    const values = { customThemeMode, customThemeBaseColor, customThemeColors };
    if (activate) {
      selectedTheme = "custom";
      selectedAccessibilityMode = "none";
      values.selectedTheme = selectedTheme;
      values.selectedAccessibilityMode = selectedAccessibilityMode;
      values.themeEnabled = themeEnabled;
    }
    await setStorage(values);
    renderThemes();
    renderCustomEditor();
    await notifyActiveTab();
  }

  // ── Font rendering ─────────────────────────────────────────────────────────

  function getExtensionUrl(path) {
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getURL) {
      return chrome.runtime.getURL(path);
    }
    return path;
  }

  function ensureBundledFontFaces() {
    if (document.getElementById(FONT_FACE_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = FONT_FACE_STYLE_ID;
    style.textContent = FONT_FACE_DEFINITIONS.map(
      (font) =>
        `@font-face { font-family: "${font.family}"; src: url("${getExtensionUrl(font.file)}") format("${font.format || "truetype"}"); font-weight: 100 900; font-style: normal; font-display: swap; }`
    ).join("\n");
    document.head.appendChild(style);
  }

  function renderFonts() {
    if (!fontGrid) return;
    fontGrid.innerHTML = "";

    const groups = FONT_OPTIONS.reduce((map, font) => {
      const g = font.group || "Other";
      if (!map.has(g)) map.set(g, []);
      map.get(g).push(font);
      return map;
    }, new Map());

    const orderedGroupNames = [
      ...FONT_GROUP_ORDER.filter((g) => groups.has(g)),
      ...Array.from(groups.keys()).filter((g) => !FONT_GROUP_ORDER.includes(g))
    ];

    orderedGroupNames.forEach((groupName) => {
      const section = document.createElement("section");
      section.className = "font-group";
      const heading = document.createElement("h3");
      heading.className = "font-group-heading";
      heading.textContent = groupName;
      const optionsGrid = document.createElement("div");
      optionsGrid.className = "font-group-grid";

      groups.get(groupName).forEach((font) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "font-option";
        button.setAttribute("aria-pressed", String(font.id === selectedFont));
        button.setAttribute("aria-label", `${font.name} font`);
        button.title = font.name;
        button.style.setProperty("--font-preview-family", font.family);
        const sample = document.createElement("span");
        sample.className = "font-option-sample";
        sample.textContent = FONT_PREVIEW_TEXT;
        button.append(sample);
        button.addEventListener("click", async () => {
          if (currentLanguageId !== "en" && font.id !== DEFAULT_SETTINGS.selectedFont) {
            selectedFont = DEFAULT_SETTINGS.selectedFont;
            await setStorage({ selectedFont });
            renderFonts();
            setStatus("Switch to English to use custom fonts.");
            await notifyActiveTab();
            return;
          }
          selectedFont = font.id;
          await setStorage({ selectedFont });
          renderFonts();
          await notifyActiveTab();
        });
        optionsGrid.appendChild(button);
      });

      section.append(heading, optionsGrid);
      fontGrid.appendChild(section);
    });
  }

  // ── Form rendering ─────────────────────────────────────────────────────────

  function render(settings) {
    TOGGLE_KEYS.forEach((key) => {
      if (form.elements[key]) {
        form.elements[key].checked = Boolean(settings[key]);
      }
    });

    NUMERIC_KEYS.forEach((key) => {
      if (form.elements[key]) {
        form.elements[key].value = String(settings[key] ?? DEFAULT_SETTINGS[key]);
      }
    });

    const lang = normalizeLanguageId(settings.selectedLanguage);
    const funLang = FUN_LANGUAGE_IDS.includes(settings.selectedLanguage)
      ? settings.selectedLanguage
      : settings.selectedFunLanguage;
    languageSelect.value = lang;
    funLanguageSelect.value = normalizeFunLanguageId(funLang);
    funLanguageRow.hidden = lang !== "en";

    const cornerRadius = normalizeCornerRadius(settings.cornerRadius);
    cornerRadiusSlider.value = String(cornerRadius);
    cornerRadiusValue.textContent = `${cornerRadius}px`;
  }

  // ── Save helpers ───────────────────────────────────────────────────────────

  async function saveLanguage(value) {
    currentLanguageId = normalizeLanguageId(value);
    const updates = { selectedLanguage: currentLanguageId };
    if (currentLanguageId !== "en") {
      updates.selectedFont = DEFAULT_SETTINGS.selectedFont;
      updates.selectedFunLanguage = DEFAULT_SETTINGS.selectedFunLanguage;
      selectedFont = DEFAULT_SETTINGS.selectedFont;
    }
    await setStorage(updates);
    renderFonts();
    await notifyActiveTab();
  }

  async function saveFunLanguage(value) {
    const sfL = normalizeFunLanguageId(value);
    await setStorage({ selectedLanguage: "en", selectedFunLanguage: sfL });
    currentLanguageId = "en";
    await notifyActiveTab();
  }

  async function saveToggle(key, value) {
    await setStorage({ [key]: value });
    await notifyActiveTab();
  }

  async function saveNumericSetting(key, value) {
    const number = Math.max(1, Math.min(99, Math.round(Number(value))));
    if (!Number.isFinite(number)) return;
    await setStorage({ [key]: number });
    await notifyActiveTab();
  }

  async function saveCornerRadius(value) {
    const cornerRadius = normalizeCornerRadius(value);
    cornerRadiusSlider.value = String(cornerRadius);
    cornerRadiusValue.textContent = `${cornerRadius}px`;
    await setStorage({ cornerRadius });
    await notifyActiveTab();
  }

  async function resetSettings() {
    selectedTheme = DEFAULT_SETTINGS.selectedTheme;
    selectedAccessibilityMode = DEFAULT_SETTINGS.selectedAccessibilityMode;
    themeEnabled = DEFAULT_SETTINGS.themeEnabled;
    customThemeMode = DEFAULT_SETTINGS.customThemeMode;
    customThemeBaseColor = DEFAULT_SETTINGS.customThemeBaseColor;
    customThemeColors = { ...DEFAULT_SETTINGS.customThemeColors };
    selectedFont = DEFAULT_SETTINGS.selectedFont;
    currentLanguageId = DEFAULT_SETTINGS.selectedLanguage;
    await setStorage({ ...DEFAULT_SETTINGS });
    render(DEFAULT_SETTINGS);
    renderThemes();
    renderCustomEditor();
    renderFonts();
    await notifyActiveTab();
  }

  // ── Init ───────────────────────────────────────────────────────────────────

  async function init() {
    ensureBundledFontFaces();

    REAL_LANGUAGE_OPTIONS.forEach((l) => {
      const option = document.createElement("option");
      option.value = l.id;
      option.textContent = l.label;
      languageSelect.appendChild(option);
    });

    const defaultFunOption = document.createElement("option");
    defaultFunOption.value = DEFAULT_SETTINGS.selectedFunLanguage;
    defaultFunOption.textContent = "Default English";
    funLanguageSelect.appendChild(defaultFunOption);

    FUN_LANGUAGE_OPTIONS.forEach((l) => {
      const option = document.createElement("option");
      option.value = l.id;
      option.textContent = l.label;
      funLanguageSelect.appendChild(option);
    });

    const settings = await getStorage(DEFAULT_SETTINGS);

    // Initialize theme state
    selectedTheme = settings.selectedTheme || DEFAULT_SETTINGS.selectedTheme;
    selectedAccessibilityMode = settings.selectedAccessibilityMode || "none";
    themeEnabled = Boolean(settings.themeEnabled);
    customThemeMode = settings.customThemeMode === "advanced" ? "advanced" : "easy";
    customThemeBaseColor = normalizeHex(settings.customThemeBaseColor, DEFAULT_SETTINGS.customThemeBaseColor);
    customThemeColors = customThemeMode === "easy"
      ? deriveEasyThemeColors(customThemeBaseColor)
      : normalizeCustomColors(settings.customThemeColors);

    // Initialize font state
    currentLanguageId = FUN_LANGUAGE_IDS.includes(settings.selectedLanguage)
      ? DEFAULT_SETTINGS.selectedLanguage
      : normalizeLanguageId(settings.selectedLanguage);
    selectedFont = currentLanguageId === "en"
      ? normalizeFontId(settings.selectedFont)
      : DEFAULT_SETTINGS.selectedFont;

    render(settings);
    renderThemes();
    renderCustomEditor();
    renderFonts();

    // Panel navigation
    function setActivePanel(panelId) {
      document.querySelectorAll(".panel").forEach((el) => {
        el.classList.toggle("hidden", el.id !== `panel-${panelId}`);
      });
      document.querySelectorAll(".nav-item[data-panel]").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.panel === panelId);
      });
    }

    document.querySelectorAll(".nav-item, .quick-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.href) {
          window.location.href = btn.dataset.href;
        } else if (btn.dataset.panel) {
          setActivePanel(btn.dataset.panel);
        }
      });
    });

    // Accessibility colors navigates to separate page
    document.getElementById("choose-accessibility-colors-button")?.addEventListener("click", () => {
      window.location.href = "accessibility-colors.html";
    });

    // Keep module-level themeEnabled in sync with the toggle
    document.getElementById("theme-enabled-toggle")?.addEventListener("change", (e) => {
      themeEnabled = e.target.checked;
    });

    // Use Custom button
    useCustomButton?.addEventListener("click", async () => {
      selectedTheme = "custom";
      selectedAccessibilityMode = "none";
      themeEnabled = true;
      if (form.elements["themeEnabled"]) form.elements["themeEnabled"].checked = true;
      if (customThemeMode === "easy") {
        await saveEasyBaseColor(customThemeBaseColor, true);
      } else {
        await saveCustomColors(customThemeColors, true);
      }
    });

    // Language selects
    languageSelect.addEventListener("change", () => {
      saveLanguage(languageSelect.value).then(() => {
        funLanguageRow.hidden = currentLanguageId !== "en";
      });
    });

    funLanguageSelect.addEventListener("change", () => {
      saveFunLanguage(funLanguageSelect.value);
    });

    // Form inputs (toggles + numeric)
    form.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (TOGGLE_KEYS.includes(target.name)) {
        saveToggle(target.name, target.checked);
      } else if (NUMERIC_KEYS.includes(target.name)) {
        saveNumericSetting(target.name, target.value);
      }
    });

    // Corner radius slider
    cornerRadiusSlider.addEventListener("input", () => {
      const cornerRadius = normalizeCornerRadius(cornerRadiusSlider.value);
      cornerRadiusValue.textContent = `${cornerRadius}px`;
    });

    cornerRadiusSlider.addEventListener("change", () => {
      saveCornerRadius(cornerRadiusSlider.value);
    });

    resetButton.addEventListener("click", resetSettings);
  }

  init();
})();
