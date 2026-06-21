(() => {
  "use strict";

  const TOOLBAR_ID = "gt-roadmap-customizer-toolbar";
  const LEGACY_SETTINGS_KEY = "gtRoadmapCustomizerSettings";

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
    "gt-theme-zelda",
    "gt-theme-cyberpunk",
    "gt-theme-terminal-hacker",
    "gt-theme-georgia-tech-dark",
    "gt-theme-material-you",
    "gt-theme-glassmorphism",
    "gt-theme-amoled-black",
    "gt-theme-catppuccin",
    "gt-theme-nord",
    "gt-theme-gruvbox",
    "gt-theme-dracula",
    "gt-theme-solarized-dark",
    "gt-theme-rose-gold",
    "gt-theme-midnight",
    "gt-theme-crimson",
    "gt-theme-emerald",
    "gt-theme-superman",
    "gt-theme-custom"
  ];

  const ACCESSIBILITY_MODES = [
    "none",
    "high-contrast-bw",
    "high-contrast-navy-yellow",
    "high-contrast-bright-dark",
    "wcag-aa",
    "wcag-aaa",
    "protanopia",
    "deuteranopia",
    "tritanopia"
  ];

  const ACCESSIBILITY_CLASSES = ACCESSIBILITY_MODES
    .filter((mode) => mode !== "none")
    .map((mode) => `gt-accessibility-${mode}`);

  const FONT_STACKS = globalThis.GT_ROADMAP_FONT_STACKS || {
    default: "",
    "jetbrains-mono": '"GT JetBrainsMono Nerd Font", "JetBrainsMono Nerd Font", "JetBrainsMono NF", "JetBrains Mono", monospace',
    "fira-code": '"GT FiraCode Nerd Font", "FiraCode Nerd Font", "FiraCode NF", "Fira Code", monospace',
    hack: '"GT Hack Nerd Font", "Hack Nerd Font", "Hack NF", Hack, monospace',
    meslo: '"GT MesloLGS Nerd Font", "MesloLGS NF", "MesloLGSDZ Nerd Font", Menlo, monospace',
    caskaydia: '"GT CaskaydiaCove Nerd Font", "CaskaydiaCove Nerd Font", "CaskaydiaCove NF", Consolas, monospace',
    iosevka: '"GT Iosevka Nerd Font", "Iosevka Nerd Font", "Iosevka NF", Iosevka, monospace',
    mononoki: '"GT Mononoki Nerd Font", "Mononoki Nerd Font", "Mononoki NF", Mononoki, monospace'
  };

  const FONT_FACE_STYLE_ID = "gt-roadmap-bundled-font-faces";

  const FONT_FACE_DEFINITIONS = globalThis.GT_ROADMAP_FONT_FACES || [
    {
      family: "GT JetBrainsMono Nerd Font",
      file: "assets/fonts/JetBrainsMonoNerdFontMono-Regular.ttf"
    },
    {
      family: "GT FiraCode Nerd Font",
      file: "assets/fonts/FiraCodeNerdFontMono-Regular.ttf"
    },
    {
      family: "GT Hack Nerd Font",
      file: "assets/fonts/HackNerdFontMono-Regular.ttf"
    },
    {
      family: "GT MesloLGS Nerd Font",
      file: "assets/fonts/MesloLGSNerdFontMono-Regular.ttf"
    },
    {
      family: "GT CaskaydiaCove Nerd Font",
      file: "assets/fonts/CaskaydiaCoveNerdFontMono-Regular.ttf"
    },
    {
      family: "GT Iosevka Nerd Font",
      file: "assets/fonts/IosevkaNerdFontMono-Regular.ttf"
    },
    {
      family: "GT Mononoki Nerd Font",
      file: "assets/fonts/MononokiNerdFontMono-Regular.ttf"
    }
  ];

  const BODY_CLASSES = {
    themeEnabled: "gt-theme-enabled",
    fontEnabled: "gt-roadmap-font-enabled",
    readabilityEnabled: "gt-roadmap-readability-enabled",
    distractionFree: "gt-roadmap-distraction-free",
    hideCourseName: "gt-roadmap-hide-course-name",
    hideCourseCredits: "gt-roadmap-hide-course-credits",
    hideCourseGpa: "gt-roadmap-hide-course-gpa",
    creditLoadEnabled: "gt-credit-load-enabled"
  };

  const ALL_CONTROL_CLASSES = [
    BODY_CLASSES.themeEnabled,
    BODY_CLASSES.fontEnabled,
    BODY_CLASSES.readabilityEnabled,
    BODY_CLASSES.distractionFree,
    BODY_CLASSES.hideCourseName,
    BODY_CLASSES.hideCourseCredits,
    BODY_CLASSES.hideCourseGpa,
    BODY_CLASSES.creditLoadEnabled,
    "gt-roadmap-customizer-enabled",
    ...THEME_CLASSES,
    ...ACCESSIBILITY_CLASSES
  ];

  const LANGUAGE_OPTIONS = globalThis.GT_ROADMAP_LANGUAGES || [
    { id: "en", label: "English", name: "English", htmlLang: "en", dir: "ltr" }
  ];
  const FUN_LANGUAGE_IDS = globalThis.GT_ROADMAP_FUN_LANGUAGE_IDS || [];
  const TRANSLATIONS = globalThis.GT_ROADMAP_TRANSLATIONS || {};
  const TRANSLATABLE_ATTRIBUTES = ["aria-label", "title", "placeholder"];
  const DYSLEXIA_FONT_IDS = globalThis.GT_ROADMAP_DYSLEXIA_FONT_IDS || [
    "opendyslexic",
    "lexend",
    "atkinson-hyperlegible"
  ];
  const TOOLBAR_TOGGLES = [];

  let settings = { ...DEFAULT_SETTINGS };
  let observer = null;
  let scanQueued = false;
  let prereqData = null;
  let postreqData = null;
  let prereqLoadPromise = null;
  let prereqListenerInstalled = false;
  let lastDebugAt = 0;
  const originalTextNodes = new WeakMap();
  const originalAttributes = new WeakMap();

  const hasChromeStorage =
    typeof chrome !== "undefined" &&
    chrome.storage &&
    chrome.storage.sync;

  function normalizeThemeName(themeName) {
    return THEME_CLASSES.includes(`gt-theme-${themeName}`) ? themeName : DEFAULT_SETTINGS.selectedTheme;
  }

  function normalizeFontId(fontId) {
    return Object.prototype.hasOwnProperty.call(FONT_STACKS, fontId) ? fontId : DEFAULT_SETTINGS.selectedFont;
  }

  function normalizeLanguageId(languageId) {
    return LANGUAGE_OPTIONS.some((language) => language.id === languageId && !FUN_LANGUAGE_IDS.includes(language.id))
      ? languageId
      : DEFAULT_SETTINGS.selectedLanguage;
  }

  function normalizeFunLanguageId(languageId) {
    return FUN_LANGUAGE_IDS.includes(languageId) ? languageId : DEFAULT_SETTINGS.selectedFunLanguage;
  }

  function normalizeTranslationLanguageId(languageId) {
    return LANGUAGE_OPTIONS.some((language) => language.id === languageId)
      ? languageId
      : DEFAULT_SETTINGS.selectedLanguage;
  }

  function getLanguageConfig(languageId) {
    return (
      LANGUAGE_OPTIONS.find((language) => language.id === normalizeTranslationLanguageId(languageId)) ||
      LANGUAGE_OPTIONS[0]
    );
  }

  function normalizeCornerRadius(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return DEFAULT_SETTINGS.cornerRadius;
    return Math.max(0, Math.min(24, Math.round(number)));
  }

  function normalizeAccessibilityMode(mode) {
    return ACCESSIBILITY_MODES.includes(mode) ? mode : DEFAULT_SETTINGS.selectedAccessibilityMode;
  }

  function clampInteger(value, fallback, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.max(min, Math.min(max, Math.round(number)));
  }

  function normalizeReadableFont(fontId) {
    return DYSLEXIA_FONT_IDS.includes(fontId) && Object.prototype.hasOwnProperty.call(FONT_STACKS, fontId)
      ? fontId
      : DEFAULT_SETTINGS.selectedReadableFont;
  }

  function normalizeReadabilitySettings(values) {
    return {
      selectedReadableFont: normalizeReadableFont(values.selectedReadableFont),
      bodyFontScale: clampInteger(values.bodyFontScale, DEFAULT_SETTINGS.bodyFontScale, 90, 115),
      courseCardFontScale: clampInteger(values.courseCardFontScale, DEFAULT_SETTINGS.courseCardFontScale, 85, 120),
      semesterHeaderFontScale: clampInteger(
        values.semesterHeaderFontScale,
        DEFAULT_SETTINGS.semesterHeaderFontScale,
        90,
        125
      ),
      readabilityLetterSpacing: clampInteger(
        values.readabilityLetterSpacing,
        DEFAULT_SETTINGS.readabilityLetterSpacing,
        0,
        8
      ),
      readabilityWordSpacing: clampInteger(values.readabilityWordSpacing, DEFAULT_SETTINGS.readabilityWordSpacing, 0, 22),
      readabilityLineHeight: clampInteger(values.readabilityLineHeight, DEFAULT_SETTINGS.readabilityLineHeight, 120, 180)
    };
  }

  function getExtensionUrl(path) {
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getURL) {
      return chrome.runtime.getURL(path);
    }

    return path;
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

  function ensureBundledFontFaces() {
    if (!document.documentElement || document.getElementById(FONT_FACE_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = FONT_FACE_STYLE_ID;
    style.textContent = FONT_FACE_DEFINITIONS.map(
      (font) => `
@font-face {
  font-family: "${font.family}";
  src: url("${getExtensionUrl(font.file)}") format("${font.format || "truetype"}");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}`
    ).join("\n");

    (document.head || document.documentElement).appendChild(style);
  }

  function applyFontVariable(element, selectedFont) {
    const fontStack = FONT_STACKS[normalizeFontId(selectedFont)];
    if (fontStack) {
      element.style.setProperty("--gtc-font-family", fontStack);
    } else {
      element.style.removeProperty("--gtc-font-family");
    }
  }

  function applyReadabilityVariables(element, readability) {
    const readableFontStack = FONT_STACKS[readability.selectedReadableFont] || "";
    if (readableFontStack) {
      element.style.setProperty("--gtc-readable-font-family", readableFontStack);
    } else {
      element.style.removeProperty("--gtc-readable-font-family");
    }

    element.style.setProperty("--gtc-body-font-scale", `${readability.bodyFontScale}%`);
    element.style.setProperty("--gtc-course-card-font-scale", `${readability.courseCardFontScale}%`);
    element.style.setProperty("--gtc-semester-header-font-scale", `${readability.semesterHeaderFontScale}%`);
    element.style.setProperty("--gtc-readability-letter-spacing", `${readability.readabilityLetterSpacing / 100}em`);
    element.style.setProperty("--gtc-readability-word-spacing", `${readability.readabilityWordSpacing / 100}em`);
    element.style.setProperty("--gtc-readability-line-height", String(readability.readabilityLineHeight / 100));
  }

  function applyCornerRadiusVariable(element, cornerRadius) {
    element.style.setProperty("--gtc-radius", `${normalizeCornerRadius(cornerRadius)}px`);
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

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function getDictionary(languageId) {
    return TRANSLATIONS[normalizeTranslationLanguageId(languageId)] || null;
  }

  function lookupTranslation(dictionary, text) {
    if (!dictionary) return null;
    if (Object.prototype.hasOwnProperty.call(dictionary, text)) return dictionary[text];

    const lowerText = text.toLowerCase();
    const match = Object.keys(dictionary).find((key) => key.toLowerCase() === lowerText);
    return match ? dictionary[match] : null;
  }

  function translateCoreText(text, languageId) {
    const dictionary = getDictionary(languageId);
    if (!dictionary || languageId === "en") return text;

    const exact = lookupTranslation(dictionary, text);
    if (exact) return exact;

    const gpaMatch = /^GPA:\s*(.+)$/i.exec(text);
    if (gpaMatch) return `${lookupTranslation(dictionary, "GPA") || "GPA"}: ${gpaMatch[1]}`;

    const creditsMatch = /^(\d+(?:\.\d+)?)\s+credits?$/i.exec(text);
    if (creditsMatch) {
      const creditKey = Number(creditsMatch[1]) === 1 ? "credit" : "credits";
      return `${creditsMatch[1]} ${lookupTranslation(dictionary, creditKey) || creditKey}`;
    }

    const semesterMatch = /^(Spring|Summer|Fall)\s+(\d{4})$/i.exec(text);
    if (semesterMatch) {
      const term = semesterMatch[1][0].toUpperCase() + semesterMatch[1].slice(1).toLowerCase();
      return `${lookupTranslation(dictionary, term) || term} ${semesterMatch[2]}`;
    }

    let translated = text;
    Object.keys(dictionary)
      .filter((key) => /^[A-Za-z][A-Za-z /'-]+$/.test(key))
      .sort((a, b) => b.length - a.length)
      .forEach((key) => {
        translated = translated.replace(
          new RegExp(`(^|\\b)${escapeRegExp(key)}(\\b|$)`, "gi"),
          (_match, prefix, suffix) => `${prefix}${dictionary[key]}${suffix}`
        );
      });

    return translated;
  }

  function translateText(text, languageId) {
    if (!text || !text.trim()) return text;

    const leading = text.match(/^\s*/)?.[0] || "";
    const trailing = text.match(/\s*$/)?.[0] || "";
    const core = text.trim().replace(/\s+/g, " ");
    return `${leading}${translateCoreText(core, languageId)}${trailing}`;
  }

  function shouldSkipTranslationNode(node) {
    const parent = node.parentElement;
    if (!parent) return true;

    return Boolean(
      parent.closest(
        [
          "script",
          "style",
          "noscript",
          "svg",
          "canvas",
          "code",
          "pre",
          "textarea",
          "input",
          "select",
          "[contenteditable='true']",
          "[data-gt-roadmap-no-translate='true']"
        ].join(", ")
      )
    );
  }

  function translateTextNode(node, languageId) {
    if (shouldSkipTranslationNode(node)) return;

    if (!originalTextNodes.has(node)) {
      originalTextNodes.set(node, node.nodeValue || "");
    }

    const original = originalTextNodes.get(node);
    const translated = languageId === "en" ? original : translateText(original, languageId);
    if (node.nodeValue !== translated) {
      node.nodeValue = translated;
    }
  }

  function translateAttributes(element, languageId) {
    TRANSLATABLE_ATTRIBUTES.forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;

      let originals = originalAttributes.get(element);
      if (!originals) {
        originals = {};
        originalAttributes.set(element, originals);
      }

      if (!Object.prototype.hasOwnProperty.call(originals, attribute)) {
        originals[attribute] = element.getAttribute(attribute) || "";
      }

      const original = originals[attribute];
      const translated = languageId === "en" ? original : translateText(original, languageId);
      if (element.getAttribute(attribute) !== translated) {
        element.setAttribute(attribute, translated);
      }
    });
  }

  function applyLanguage() {
    if (!document.documentElement || !document.body) return;

    const baseLanguage = normalizeLanguageId(settings.selectedLanguage);
    const selectedTranslationLanguage =
      baseLanguage === "en" ? normalizeFunLanguageId(settings.selectedFunLanguage) : baseLanguage;
    const language = getLanguageConfig(selectedTranslationLanguage);
    document.documentElement.lang = language.htmlLang || selectedTranslationLanguage;
    document.documentElement.dir = language.dir || "ltr";
    document.body.dir = language.dir || "ltr";

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      translateTextNode(node, selectedTranslationLanguage);
      node = walker.nextNode();
    }

    document.body
      .querySelectorAll(TRANSLATABLE_ATTRIBUTES.map((attribute) => `[${attribute}]`).join(", "))
      .forEach((element) => translateAttributes(element, selectedTranslationLanguage));
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
      selectedFont: DEFAULT_SETTINGS.selectedFont,
      themeEnabled: DEFAULT_SETTINGS.themeEnabled,
      showCourseName: DEFAULT_SETTINGS.showCourseName,
      showCourseCredits: DEFAULT_SETTINGS.showCourseCredits,
      showCourseGpa: DEFAULT_SETTINGS.showCourseGpa,
      cornerRadius: DEFAULT_SETTINGS.cornerRadius,
      selectedLanguage: DEFAULT_SETTINGS.selectedLanguage,
      selectedFunLanguage: DEFAULT_SETTINGS.selectedFunLanguage,
      selectedAccessibilityMode: DEFAULT_SETTINGS.selectedAccessibilityMode,
      selectedReadableFont: DEFAULT_SETTINGS.selectedReadableFont,
      bodyFontScale: DEFAULT_SETTINGS.bodyFontScale,
      courseCardFontScale: DEFAULT_SETTINGS.courseCardFontScale,
      semesterHeaderFontScale: DEFAULT_SETTINGS.semesterHeaderFontScale,
      readabilityLetterSpacing: DEFAULT_SETTINGS.readabilityLetterSpacing,
      readabilityWordSpacing: DEFAULT_SETTINGS.readabilityWordSpacing,
      readabilityLineHeight: DEFAULT_SETTINGS.readabilityLineHeight,
      distractionFreeMode: DEFAULT_SETTINGS.distractionFreeMode,
      prereqHighlight: DEFAULT_SETTINGS.prereqHighlight,
      creditLoadIndicator: DEFAULT_SETTINGS.creditLoadIndicator,
      creditLoadLightBelow: DEFAULT_SETTINGS.creditLoadLightBelow,
      creditLoadHeavyFrom: DEFAULT_SETTINGS.creditLoadHeavyFrom,
      creditLoadOverloadedFrom: DEFAULT_SETTINGS.creditLoadOverloadedFrom,
      customThemeColors: DEFAULT_SETTINGS.customThemeColors,
      [LEGACY_SETTINGS_KEY]: null
    });

    const legacy = stored[LEGACY_SETTINGS_KEY] || {};
    const storedLanguage = stored.selectedLanguage || DEFAULT_SETTINGS.selectedLanguage;
    const migratedFunLanguage = FUN_LANGUAGE_IDS.includes(storedLanguage)
      ? storedLanguage
      : stored.selectedFunLanguage;
    const selectedLanguage = normalizeLanguageId(storedLanguage);
    const selectedFunLanguage =
      selectedLanguage === "en" ? normalizeFunLanguageId(migratedFunLanguage) : DEFAULT_SETTINGS.selectedFunLanguage;

    if (FUN_LANGUAGE_IDS.includes(storedLanguage)) {
      await setStorage({ selectedLanguage: DEFAULT_SETTINGS.selectedLanguage, selectedFunLanguage });
    }

    if (selectedLanguage !== "en" && normalizeFontId(stored.selectedFont) !== DEFAULT_SETTINGS.selectedFont) {
      await setStorage({ selectedFont: DEFAULT_SETTINGS.selectedFont });
    }

    const readability = normalizeReadabilitySettings({
      selectedReadableFont:
        selectedLanguage === "en" ? stored.selectedReadableFont : DEFAULT_SETTINGS.selectedReadableFont,
      bodyFontScale: stored.bodyFontScale,
      courseCardFontScale: stored.courseCardFontScale,
      semesterHeaderFontScale: stored.semesterHeaderFontScale,
      readabilityLetterSpacing: stored.readabilityLetterSpacing,
      readabilityWordSpacing: stored.readabilityWordSpacing,
      readabilityLineHeight: stored.readabilityLineHeight
    });

    if (selectedLanguage !== "en" && normalizeReadableFont(stored.selectedReadableFont) !== DEFAULT_SETTINGS.selectedReadableFont) {
      await setStorage({ selectedReadableFont: DEFAULT_SETTINGS.selectedReadableFont });
    }

    return {
      selectedTheme: normalizeThemeName(stored.selectedTheme || DEFAULT_SETTINGS.selectedTheme),
      selectedFont: selectedLanguage === "en" ? normalizeFontId(stored.selectedFont) : DEFAULT_SETTINGS.selectedFont,
      selectedLanguage,
      selectedFunLanguage,
      themeEnabled:
        typeof stored.themeEnabled === "boolean"
          ? stored.themeEnabled
          : Boolean(legacy.theme ?? DEFAULT_SETTINGS.themeEnabled),
      showCourseName:
        typeof stored.showCourseName === "boolean" ? stored.showCourseName : DEFAULT_SETTINGS.showCourseName,
      showCourseCredits:
        typeof stored.showCourseCredits === "boolean" ? stored.showCourseCredits : DEFAULT_SETTINGS.showCourseCredits,
      showCourseGpa:
        typeof stored.showCourseGpa === "boolean" ? stored.showCourseGpa : DEFAULT_SETTINGS.showCourseGpa,
      cornerRadius: normalizeCornerRadius(stored.cornerRadius),
      selectedAccessibilityMode: normalizeAccessibilityMode(stored.selectedAccessibilityMode),
      ...readability,
      distractionFreeMode:
        typeof stored.distractionFreeMode === "boolean" ? stored.distractionFreeMode : DEFAULT_SETTINGS.distractionFreeMode,
      prereqHighlight:
        typeof stored.prereqHighlight === "boolean" ? stored.prereqHighlight : DEFAULT_SETTINGS.prereqHighlight,
      creditLoadIndicator:
        typeof stored.creditLoadIndicator === "boolean" ? stored.creditLoadIndicator : DEFAULT_SETTINGS.creditLoadIndicator,
      creditLoadLightBelow: clampInteger(stored.creditLoadLightBelow, DEFAULT_SETTINGS.creditLoadLightBelow, 1, 99),
      creditLoadHeavyFrom: clampInteger(stored.creditLoadHeavyFrom, DEFAULT_SETTINGS.creditLoadHeavyFrom, 1, 99),
      creditLoadOverloadedFrom: clampInteger(stored.creditLoadOverloadedFrom, DEFAULT_SETTINGS.creditLoadOverloadedFrom, 1, 99),
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

  function cleanupYearCollapseFeature() {
    document.getElementById("gt-roadmap-year-collapse-controls")?.remove();
    document.querySelectorAll("[data-gt-roadmap-year-group], [data-gt-roadmap-year-label], [data-gt-roadmap-year-collapsed]")
      .forEach((element) => {
        element.removeAttribute("data-gt-roadmap-year-group");
        element.removeAttribute("data-gt-roadmap-year-label");
        element.removeAttribute("data-gt-roadmap-year-collapsed");
      });
  }

  function applySettings() {
    if (!document.documentElement || !document.body) return;

    ensureBundledFontFaces();

    [document.documentElement, document.body].forEach((element) => {
      element.classList.remove(...ALL_CONTROL_CLASSES);
      element.classList.toggle(BODY_CLASSES.themeEnabled, Boolean(settings.themeEnabled));
      element.classList.toggle(BODY_CLASSES.fontEnabled, normalizeFontId(settings.selectedFont) !== "default");
      const readability = normalizeReadabilitySettings(settings);
      const readabilityEnabled =
        readability.selectedReadableFont !== DEFAULT_SETTINGS.selectedReadableFont ||
        readability.bodyFontScale !== DEFAULT_SETTINGS.bodyFontScale ||
        readability.courseCardFontScale !== DEFAULT_SETTINGS.courseCardFontScale ||
        readability.semesterHeaderFontScale !== DEFAULT_SETTINGS.semesterHeaderFontScale ||
        readability.readabilityLetterSpacing !== DEFAULT_SETTINGS.readabilityLetterSpacing ||
        readability.readabilityWordSpacing !== DEFAULT_SETTINGS.readabilityWordSpacing ||
        readability.readabilityLineHeight !== DEFAULT_SETTINGS.readabilityLineHeight;
      element.classList.toggle(BODY_CLASSES.readabilityEnabled, readabilityEnabled);
      applyFontVariable(element, settings.selectedFont);
      applyReadabilityVariables(element, readability);
      applyCornerRadiusVariable(element, settings.cornerRadius);

      const accessibilityMode = normalizeAccessibilityMode(settings.selectedAccessibilityMode);
      const accessibilityEnabled = settings.themeEnabled && accessibilityMode !== "none";

      if (settings.themeEnabled && !accessibilityEnabled) {
        element.classList.add(`gt-theme-${normalizeThemeName(settings.selectedTheme)}`);
      }

      if (settings.themeEnabled && !accessibilityEnabled && normalizeThemeName(settings.selectedTheme) === "custom") {
        applyCustomThemeVariables(element, settings.customThemeColors);
      } else {
        clearCustomThemeVariables(element);
      }

      element.classList.toggle(BODY_CLASSES.hideCourseName, !settings.showCourseName);
      element.classList.toggle(BODY_CLASSES.hideCourseCredits, !settings.showCourseCredits);
      element.classList.toggle(BODY_CLASSES.hideCourseGpa, !settings.showCourseGpa);
      element.classList.toggle(BODY_CLASSES.distractionFree, Boolean(settings.distractionFreeMode));
      element.classList.toggle(BODY_CLASSES.creditLoadEnabled, Boolean(settings.creditLoadIndicator));

      if (accessibilityEnabled) {
        element.classList.add(`gt-accessibility-${accessibilityMode}`);
      }
    });

    if (!settings.prereqHighlight) clearPrereqHighlight();

    annotateStableTargets();
    cleanupYearCollapseFeature();
    applyLanguage();
    debugThemeState();
  }

  function ensureToolbar() {
    if (TOOLBAR_TOGGLES.length === 0) {
      document.getElementById(TOOLBAR_ID)?.remove();
      return;
    }

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
    const card = element.closest(
      [
        "[data-testid='course-card']",
        "[data-course-id]",
        "[data-gt-roadmap-course-card='true']",
        "[class*='bg-background-elevated'][class*='rounded-lg'][class*='border']",
        "[class*='bg-background-elevated-dark'][class*='rounded-lg'][class*='border']",
        ".bg-background-elevated.border",
        ".dark\\:bg-background-elevated-dark.border"
      ].join(", ")
    );

    return card instanceof HTMLElement && isCustomizableCourseCard(card) ? card : null;
  }

  function isCustomizableCourseCard(card) {
    if (!(card instanceof HTMLElement)) return false;
    if (document.body?.hasAttribute("data-gt-roadmap-course-tree-page")) return false;

    const disallowedSurface = card.closest(
      [
        "[data-tour='control-panel']",
        "[data-gt-roadmap-control-panel='true']",
        "[data-gt-roadmap-debug-conflicts='true']",
        "[role='dialog']",
        "[aria-modal='true']"
      ].join(", ")
    );
    if (disallowedSurface) return false;

    return Boolean(
      card.closest(
        [
          "[data-semester]",
          "[data-tour='semester-columns']",
          "[data-gt-roadmap-workspace='true']",
          "[data-tour='course-panel']",
          "[data-tour='course-card-menu']",
          "[data-gt-roadmap-course-panel='true']"
        ].join(", ")
      )
    );
  }

  function clearCourseCardDetailAnnotations(card) {
    [
      "data-gt-roadmap-course-card-customizable",
      "data-gt-roadmap-course-detail-row",
      "data-gt-roadmap-course-code-row",
      "data-gt-roadmap-course-name-row",
      "data-gt-roadmap-has-course-status"
    ].forEach((attribute) => card.removeAttribute(attribute));

    card
      .querySelectorAll(
        [
          "[data-gt-roadmap-course-card-customizable]",
          "[data-gt-roadmap-course-gpa]",
          "[data-gt-roadmap-course-credits]",
          "[data-gt-roadmap-course-name]",
          "[data-gt-roadmap-course-status]",
          "[data-gt-roadmap-course-menu]",
          "[data-gt-roadmap-course-code-row]",
          "[data-gt-roadmap-course-detail-row]",
          "[data-gt-roadmap-course-name-row]"
        ].join(", ")
      )
      .forEach((element) => {
        element.removeAttribute("data-gt-roadmap-course-card-customizable");
        element.removeAttribute("data-gt-roadmap-course-gpa");
        element.removeAttribute("data-gt-roadmap-course-credits");
        element.removeAttribute("data-gt-roadmap-course-name");
        element.removeAttribute("data-gt-roadmap-course-status");
        element.removeAttribute("data-gt-roadmap-course-menu");
        element.removeAttribute("data-gt-roadmap-course-code-row");
        element.removeAttribute("data-gt-roadmap-course-detail-row");
        element.removeAttribute("data-gt-roadmap-course-name-row");
      });
  }

  function annotateCourseCardDetails(card) {
    clearCourseCardDetailAnnotations(card);
    if (!isCustomizableCourseCard(card)) return;

    card.setAttribute("data-gt-roadmap-course-card-customizable", "true");

    const directRows = Array.from(card.children).filter((child) => child instanceof HTMLElement);
    const codeRow = directRows[0];
    const detailRow = directRows[1];
    const nameRow = directRows[2];

    if (codeRow) {
      codeRow.setAttribute("data-gt-roadmap-course-code-row", "true");
      const menu = codeRow.querySelector("[data-course-menu], button[aria-haspopup='menu'], button[aria-label*='menu' i]");
      if (menu) {
        menu.setAttribute("data-gt-roadmap-course-menu", "true");
      }
    }

    if (detailRow) {
      detailRow.setAttribute("data-gt-roadmap-course-detail-row", "true");
    }

    if (nameRow) {
      nameRow.setAttribute("data-gt-roadmap-course-name-row", "true");
      const statusChip = Array.from(
        nameRow.querySelectorAll(".text-satisfied, .text-ready, .text-locked, .text-ap")
      )[0];
      const statusWrapper = statusChip ? statusChip.parentElement : null;

      if (statusWrapper) {
        statusWrapper.setAttribute("data-gt-roadmap-course-status", "true");
        card.setAttribute("data-gt-roadmap-has-course-status", "true");
      }

      const courseName = Array.from(nameRow.querySelectorAll("span")).find((span) => {
        const text = (span.textContent || "").trim();
        if (span.closest("[data-gt-roadmap-course-status='true']")) return false;
        return text && !/^(ready|locked|satisfied|completed|ap|in progress)$/i.test(text);
      });

      if (courseName) {
        courseName.setAttribute("data-gt-roadmap-course-name", "true");
      }
    }

    Array.from(card.querySelectorAll("span, div")).forEach((element) => {
      if (element.children.length > 0) return;

      const text = (element.textContent || "").replace(/\s+/g, " ").trim();
      if (/^GPA:\s*/i.test(text)) {
        element.setAttribute("data-gt-roadmap-course-gpa", "true");
      }

      if (/^\d+(?:\.\d+)?\s+credits?$/i.test(text)) {
        element.setAttribute("data-gt-roadmap-course-credits", "true");
      }
    });
  }

  function promoteCourseCardsFromDescendants() {
    document
      .querySelectorAll(
        [
          "[data-course-menu]",
          ".text-satisfied",
          ".text-ready",
          ".text-locked",
          ".text-ap",
          ".text-text-tertiary",
          ".dark\\:text-text-tertiary-dark"
        ].join(", ")
      )
      .forEach((element) => {
        const card = closestCourseCard(element);
        if (card) {
          card.setAttribute("data-gt-roadmap-course-card", "true");
        }
      });

    document.querySelectorAll("span, div").forEach((element) => {
      if (element.children.length > 0) return;

      const text = (element.textContent || "").replace(/\s+/g, " ").trim();
      if (!/^GPA:\s*/i.test(text) && !/^\d+(?:\.\d+)?\s+credits?$/i.test(text)) return;

      const card = closestCourseCard(element);
      if (card) {
        card.setAttribute("data-gt-roadmap-course-card", "true");
      }
    });
  }

  function annotateCourseCards() {
    document.querySelectorAll("[data-gt-roadmap-course-card='true']").forEach((card) => {
      if (!isCustomizableCourseCard(card)) {
        clearCourseCardDetailAnnotations(card);
      }
    });

    document
      .querySelectorAll(
      [
        "[data-testid='course-card']",
        "[data-course-id]",
        "[class*='course'][class*='card']",
        "[class*='bg-background-elevated'][class*='rounded-lg'][class*='border']:has([data-course-menu])",
        "[class*='bg-background-elevated'][class*='rounded-lg'][class*='border']:has(.text-ready, .text-locked, .text-satisfied, .text-ap)",
        ".bg-background-elevated.border:has([data-course-menu])",
        ".dark\\:bg-background-elevated-dark.border:has([data-course-menu])",
        ".bg-background-elevated.border:has(.text-ready, .text-locked, .text-satisfied, .text-ap)",
        ".dark\\:bg-background-elevated-dark.border:has(.text-ready, .text-locked, .text-satisfied, .text-ap)"
      ].join(", "),
    )
      .forEach((card) => {
        if (isCustomizableCourseCard(card)) {
          card.setAttribute("data-gt-roadmap-course-card", "true");
        }
      });

    promoteCourseCardsFromDescendants();

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

    document
      .querySelectorAll("[data-gt-roadmap-course-card='true']")
      .forEach((card) => annotateCourseCardDetails(card));
  }

  function annotateStableTargets() {
    if (!document.body) return;

    // DOM targeting strategy:
    // Prefer source-owned hooks such as data-testid, data-course-id, ARIA labels,
    // roles, and semantic attributes. Text scanning is deliberately conservative
    // and only annotates leaf-like nodes so it does not fight React layout.
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

    annotateCourseTreeSurface();
    annotateDebugConflictSurface();
    annotateCurrentSemester();
    annotateCourseCards();
    annotateSemesterCredits();

    annotateAll(
      '[data-semester] .scrollbar-themed, [data-tour="semester-columns"] .scrollbar-themed',
      "data-gt-roadmap-scroll-surface"
    );

  }

  function parseCreditValue(text) {
    const m = /^(\d+(?:\.\d+)?)\s+credits?$/i.exec((text || "").trim());
    return m ? parseFloat(m[1]) : null;
  }

  function getCreditLoadLabel(total) {
    if (total <= 0) return null;
    if (total >= settings.creditLoadOverloadedFrom) return "overloaded";
    if (total >= settings.creditLoadHeavyFrom) return "heavy";
    if (total < settings.creditLoadLightBelow) return "light";
    return "normal";
  }

  function annotateSemesterCredits() {
    document.querySelectorAll("[data-semester]").forEach((semEl) => {
      semEl.removeAttribute("data-gt-credit-load");
      semEl.querySelectorAll("[data-gt-roadmap-semester-credits]").forEach((el) => {
        el.removeAttribute("data-gt-roadmap-semester-credits");
      });

      if (!settings.creditLoadIndicator) return;

      // Sum credits from annotated course cards (most reliable)
      let total = 0;
      semEl.querySelectorAll("[data-gt-roadmap-course-credits]").forEach((el) => {
        const val = parseCreditValue(el.textContent);
        if (val !== null) total += val;
      });

      // Find the semester header's credit total display element
      const header = semEl.children[0];
      let creditDisplay = null;
      if (header) {
        creditDisplay = Array.from(header.querySelectorAll("span, p, div")).find((el) => {
          return el.children.length === 0 && parseCreditValue(el.textContent) !== null;
        });
        // If course card sum is 0 (cards not yet annotated), fall back to header value
        if (total === 0 && creditDisplay) {
          const headerVal = parseCreditValue(creditDisplay.textContent);
          if (headerVal !== null) total = headerVal;
        }
      }

      if (creditDisplay) {
        creditDisplay.setAttribute("data-gt-roadmap-semester-credits", "true");
      }

      const label = getCreditLoadLabel(total);
      if (label) semEl.setAttribute("data-gt-credit-load", label);
    });
  }

  function annotateCourseTreeSurface() {
    if (!document.body) return;

    const path = window.location.pathname || "";
    const normalizedPath = path.replace(/\s+/g, "");
    const isCourseTreeRoute =
      /^\/[A-Za-z]+\d[\dA-Za-z]*\/?$/.test(normalizedPath) ||
      /^\/course-tree\/[A-Za-z]+-?\d[\dA-Za-z-]*\/?$/i.test(normalizedPath);
    document.body.toggleAttribute("data-gt-roadmap-course-tree-page", isCourseTreeRoute);

    annotateAll(".course-tree-prereqs, .course-tree-current", "data-gt-roadmap-course-tree-node");
    annotateAll(".course-tree-prereqs", "data-gt-roadmap-course-tree-prereqs");
    annotateAll(".course-tree-current", "data-gt-roadmap-course-tree-current");

    document.querySelectorAll(".course-tree-prereqs, .course-tree-current").forEach((element) => {
      const treeRoot = element.closest(".inline-flex, [class*='konvajs-content']");
      if (treeRoot instanceof HTMLElement) {
        treeRoot.setAttribute("data-gt-roadmap-course-tree-canvas", "true");
      }
    });
  }

  function annotateDebugConflictSurface() {
    if (!document.body) return;

    document
      .querySelectorAll("[data-gt-roadmap-debug-conflicts], [data-gt-roadmap-conflict-card]")
      .forEach((element) => {
        element.removeAttribute("data-gt-roadmap-debug-conflicts");
        element.removeAttribute("data-gt-roadmap-conflict-card");
      });

    const debugButton = Array.from(document.querySelectorAll("button")).find(
      (button) => (button.textContent || "").trim().toLowerCase() === "debug conflicts"
    );
    const controlPanel = debugButton?.closest("[data-tour='control-panel'], [data-gt-roadmap-control-panel='true']");
    if (!(controlPanel instanceof HTMLElement)) return;

    controlPanel.setAttribute("data-gt-roadmap-debug-conflicts", "true");

    controlPanel.querySelectorAll("h4, span, p").forEach((element) => {
      const text = (element.textContent || "").trim().toLowerCase();
      if (!/(conflict|prerequisite|requirements|satisfied)/.test(text)) return;

      const section = element.closest(".space-y-4, .space-y-3, .rounded-lg");
      if (section instanceof HTMLElement) {
        section.setAttribute("data-gt-roadmap-debug-conflicts", "true");
        const sectionText = (section.textContent || "").toLowerCase();
        if (/no conflicts detected|all prerequisites/.test(sectionText)) {
          section.setAttribute("data-gt-roadmap-conflict-card", "success");
        } else if (/schedule conflict|prerequisite conflict|locked|missing|not satisfied/.test(sectionText)) {
          section.setAttribute("data-gt-roadmap-conflict-card", "error");
        } else if (/requirements|details|debug/.test(sectionText)) {
          section.setAttribute("data-gt-roadmap-conflict-card", "info");
        }
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
        courseTreePage: "[data-gt-roadmap-course-tree-page]",
        debugConflicts: "[data-gt-roadmap-debug-conflicts='true']",
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
        selectedFont: settings.selectedFont,
        selectedLanguage: settings.selectedLanguage,
        selectedFunLanguage: settings.selectedFunLanguage,
        selectedAccessibilityMode: settings.selectedAccessibilityMode,
        selectedReadableFont: settings.selectedReadableFont,
        readability: {
          body: settings.bodyFontScale,
          courseCards: settings.courseCardFontScale,
          semesterHeaders: settings.semesterHeaderFontScale,
          letterSpacing: settings.readabilityLetterSpacing,
          wordSpacing: settings.readabilityWordSpacing,
          lineHeight: settings.readabilityLineHeight
        },
        distractionFreeMode: settings.distractionFreeMode,
        themeEnabled: settings.themeEnabled,
        courseCardDetails: {
          name: settings.showCourseName,
          credits: settings.showCourseCredits,
          gpa: settings.showCourseGpa
        },
        cornerRadius: settings.cornerRadius,
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
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: TRANSLATABLE_ATTRIBUTES
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
        "selectedFont",
        "themeEnabled",
        "showCourseName",
        "showCourseCredits",
        "showCourseGpa",
        "cornerRadius",
        "selectedLanguage",
        "selectedFunLanguage",
        "selectedAccessibilityMode",
        "selectedReadableFont",
        "bodyFontScale",
        "courseCardFontScale",
        "semesterHeaderFontScale",
        "readabilityLetterSpacing",
        "readabilityWordSpacing",
        "readabilityLineHeight",
        "distractionFreeMode",
        "prereqHighlight",
        "creditLoadIndicator",
        "creditLoadLightBelow",
        "creditLoadHeavyFrom",
        "creditLoadOverloadedFrom",
        "customThemeColors",
        LEGACY_SETTINGS_KEY
      ];

      if (watchedKeys.some((key) => Object.prototype.hasOwnProperty.call(changes, key))) {
        refreshSettings();
      }
    });
  }

  async function loadPrereqData() {
    if (prereqData && postreqData) return;
    if (prereqLoadPromise) return prereqLoadPromise;
    prereqLoadPromise = Promise.all([
      fetch(getExtensionUrl("assets/data/prereqs.json")).then((r) => r.json()),
      fetch(getExtensionUrl("assets/data/postreqs.json")).then((r) => r.json())
    ]).then(([pre, post]) => {
      prereqData = pre;
      postreqData = post;
    }).catch(() => {});
    return prereqLoadPromise;
  }

  function normalizeCourseCode(raw) {
    if (!raw) return null;
    const cleaned = raw.trim().toUpperCase().replace(/[-_]/g, " ");
    const m = cleaned.match(/^([A-Z]{2,5})\s*(\d{3,4}[A-Z0-9X]*)$/);
    return m ? `${m[1]} ${m[2]}` : null;
  }

  function getCourseCode(card) {
    const rawId = card.getAttribute("data-course-id");
    if (rawId) {
      const normalized = normalizeCourseCode(rawId);
      if (normalized) return normalized;
    }
    const codeRow = card.querySelector("[data-gt-roadmap-course-code-row='true']");
    if (!codeRow) return null;
    const walker = document.createTreeWalker(codeRow, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const normalized = normalizeCourseCode(node.textContent);
      if (normalized) return normalized;
    }
    return null;
  }

  function collectIds(node, out) {
    if (!node || typeof node === "string") return;
    if (Array.isArray(node)) { node.forEach((child) => collectIds(child, out)); }
    else if (node.id) { out.add(node.id); }
  }

  function getAllPrereqIds(courseId, visited = new Set(), depth = 0) {
    if (depth > 7 || visited.has(courseId) || !prereqData) return visited;
    const entry = prereqData[courseId];
    if (!entry || entry.length === 0) return visited;
    const direct = new Set();
    collectIds(entry, direct);
    direct.forEach((id) => {
      if (!visited.has(id)) {
        visited.add(id);
        getAllPrereqIds(id, visited, depth + 1);
      }
    });
    return visited;
  }

  function getPostreqIds(courseId) {
    if (!postreqData) return new Set();
    const entries = postreqData[courseId];
    return Array.isArray(entries) ? new Set(entries) : new Set();
  }

  function codeMatchesId(cardCode, id) {
    if (cardCode === id) return true;
    if (!id.includes("X")) return false;
    return new RegExp("^" + id.replace(/X/g, "\\d") + "$").test(cardCode);
  }

  function idSetContains(idSet, cardCode) {
    for (const id of idSet) {
      if (codeMatchesId(cardCode, id)) return true;
    }
    return false;
  }

  function clearPrereqHighlight() {
    document.body.removeAttribute("data-gt-prereq-active");
    document.querySelectorAll("[data-gt-prereq-relation]").forEach((el) => {
      el.removeAttribute("data-gt-prereq-relation");
    });
  }

  async function applyPrereqHighlight(card) {
    await loadPrereqData();
    if (!prereqData) return;
    const code = getCourseCode(card);
    if (!code) return;
    const prereqIds = getAllPrereqIds(code);
    const postreqIds = getPostreqIds(code);
    document.body.setAttribute("data-gt-prereq-active", "true");
    document.querySelectorAll("[data-gt-roadmap-course-card-customizable='true']").forEach((c) => {
      if (c === card) {
        c.setAttribute("data-gt-prereq-relation", "hovered");
        return;
      }
      const cardCode = getCourseCode(c);
      if (cardCode && idSetContains(prereqIds, cardCode)) {
        c.setAttribute("data-gt-prereq-relation", "prereq");
      } else if (cardCode && idSetContains(postreqIds, cardCode)) {
        c.setAttribute("data-gt-prereq-relation", "postreq");
      } else {
        c.setAttribute("data-gt-prereq-relation", "dimmed");
      }
    });
  }

  function installPrereqListeners() {
    if (prereqListenerInstalled) return;
    prereqListenerInstalled = true;
    loadPrereqData();
    let hoverTimeout = null;
    document.addEventListener("mouseover", (e) => {
      if (!settings.prereqHighlight) return;
      const card = closestCourseCard(e.target);
      if (!card || !card.hasAttribute("data-gt-roadmap-course-card-customizable")) return;
      if (card.contains(e.relatedTarget)) return;
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => applyPrereqHighlight(card), 100);
    }, { passive: true });
    document.addEventListener("mouseout", (e) => {
      const card = closestCourseCard(e.target);
      if (!card) return;
      if (card.contains(e.relatedTarget)) return;
      clearTimeout(hoverTimeout);
      clearPrereqHighlight();
    }, { passive: true });
  }

  async function init() {
    await refreshSettings();
    ensureToolbar();
    startObserver();
    installMessageListener();
    installStorageListener();
    installPrereqListeners();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
