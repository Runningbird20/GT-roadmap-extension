(() => {
  "use strict";

  const DEFAULT_SETTINGS = {
    selectedFont: "default",
    selectedLanguage: "en"
  };

  const FONT_OPTIONS = globalThis.GT_ROADMAP_FONT_OPTIONS || [
    {
      id: "default",
      name: "Default",
      sample: "Roadmap Aa",
      group: "Default",
      family: 'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif'
    }
  ];

  const FONT_FACE_DEFINITIONS = globalThis.GT_ROADMAP_FONT_FACES || [];
  const FUN_LANGUAGE_IDS = globalThis.GT_ROADMAP_FUN_LANGUAGE_IDS || [];
  const FONT_FACE_STYLE_ID = "gt-roadmap-font-picker-font-faces";
  const FONT_PREVIEW_TEXT = "CS 1301";
  const FONT_GROUP_ORDER = [
    "Dyslexia Support",
    "Default",
    "Clean Sans",
    "Local/System",
    "Tech",
    "Retro",
    "Serif & Handwritten",
    "Nerd Fonts"
  ];

  const backButton = document.getElementById("back-button");
  const fontGrid = document.getElementById("font-grid");
  const status = document.getElementById("status");

  let selectedFont = DEFAULT_SETTINGS.selectedFont;
  let selectedLanguage = DEFAULT_SETTINGS.selectedLanguage;

  function setStatus(message) {
    status.textContent = message;
  }

  function normalizeFontId(fontId) {
    return FONT_OPTIONS.some((font) => font.id === fontId) ? fontId : DEFAULT_SETTINGS.selectedFont;
  }

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
      (font) => `
@font-face {
  font-family: "${font.family}";
  src: url("${getExtensionUrl(font.file)}") format("${font.format || "truetype"}");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}`
    ).join("\n");

    document.head.appendChild(style);
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
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    if (!tab || !tab.id) return;

    chrome.tabs.sendMessage(tab.id, { type: "GT_ROADMAP_SETTINGS_UPDATED" }, () => {
      if (chrome.runtime.lastError) {
        setStatus("Open a matching Roadmap tab to apply immediately.");
        return;
      }
      setStatus("Applied.");
    });
  }

  function renderFonts() {
    fontGrid.innerHTML = "";

    const groups = FONT_OPTIONS.reduce((groupMap, font) => {
      const groupName = font.group || "Other";
      if (!groupMap.has(groupName)) groupMap.set(groupName, []);
      groupMap.get(groupName).push(font);
      return groupMap;
    }, new Map());

    const orderedGroupNames = [
      ...FONT_GROUP_ORDER.filter((groupName) => groups.has(groupName)),
      ...Array.from(groups.keys()).filter((groupName) => !FONT_GROUP_ORDER.includes(groupName))
    ];

    orderedGroupNames.forEach((groupName) => {
      const section = document.createElement("section");
      section.className = "font-group";
      section.setAttribute("aria-labelledby", `font-group-${groupName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);

      const heading = document.createElement("h3");
      heading.className = "font-group-heading";
      heading.id = `font-group-${groupName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
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
          if (selectedLanguage !== "en" && font.id !== DEFAULT_SETTINGS.selectedFont) {
            selectedFont = DEFAULT_SETTINGS.selectedFont;
            await setStorage({ selectedFont });
            renderFonts();
            setStatus("Switch back to English to use custom fonts.");
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

  async function init() {
    ensureBundledFontFaces();
    const settings = await getStorage(DEFAULT_SETTINGS);
    selectedLanguage = FUN_LANGUAGE_IDS.includes(settings.selectedLanguage)
      ? DEFAULT_SETTINGS.selectedLanguage
      : settings.selectedLanguage || DEFAULT_SETTINGS.selectedLanguage;
    if (FUN_LANGUAGE_IDS.includes(settings.selectedLanguage)) {
      await setStorage({
        selectedLanguage: DEFAULT_SETTINGS.selectedLanguage,
        selectedFunLanguage: settings.selectedLanguage
      });
    }
    selectedFont = selectedLanguage === "en"
      ? normalizeFontId(settings.selectedFont)
      : DEFAULT_SETTINGS.selectedFont;
    if (selectedLanguage !== "en" && settings.selectedFont !== DEFAULT_SETTINGS.selectedFont) {
      await setStorage({ selectedFont: DEFAULT_SETTINGS.selectedFont });
      setStatus("Default font restored for translation support.");
    }
    renderFonts();

    backButton.addEventListener("click", () => {
      window.location.href = "popup.html";
    });

  }

  init();
})();
