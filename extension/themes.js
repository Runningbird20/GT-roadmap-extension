(() => {
  "use strict";

  const DEFAULT_SETTINGS = {
    selectedTheme: "gt-classic",
    themeEnabled: true,
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
    {
      id: "gt-classic",
      name: "GT Classic",
      description: "Clean GT surface palette",
      preview: {
        page: "#f5f5f3",
        panel: "#efeee9",
        card: "#fafaf8",
        text: "#1a1a1a",
        current: "#b3a369",
        accent: "#b3a369"
      }
    },
    {
      id: "pink",
      name: "Pink",
      description: "Rose-tinted full page",
      preview: {
        page: "#fff1f7",
        panel: "#fff9fc",
        card: "#ffffff",
        text: "#321620",
        current: "#c93678",
        accent: "#d54f8b"
      }
    },
    {
      id: "purple",
      name: "Purple",
      description: "Dark violet full page",
      preview: {
        page: "#171126",
        panel: "#211638",
        card: "#342454",
        text: "#f5efff",
        current: "#a779ff",
        accent: "#c9b8e8"
      }
    },
    {
      id: "true-black",
      name: "True Black",
      description: "Black high-contrast page",
      preview: {
        page: "#000000",
        panel: "#101010",
        card: "#171717",
        text: "#f5f5f5",
        current: "#f5f5f5",
        accent: "#b7b7b7"
      }
    },
    {
      id: "forest-green",
      name: "Forest Green",
      description: "Deep green full page",
      preview: {
        page: "#0f2118",
        panel: "#1d3527",
        card: "#254331",
        text: "#edf8f0",
        current: "#6fd294",
        accent: "#5fbf83"
      }
    },
    {
      id: "ocean-blue",
      name: "Ocean Blue",
      description: "Deep blue full page",
      preview: {
        page: "#0c2032",
        panel: "#173a56",
        card: "#1f4968",
        text: "#edf8ff",
        current: "#60d5ff",
        accent: "#45c7f0"
      }
    },
    {
      id: "sunset-orange",
      name: "Sunset Orange",
      description: "Warm cream full page",
      preview: {
        page: "#fff6eb",
        panel: "#fffaf3",
        card: "#ffffff",
        text: "#352012",
        current: "#d96026",
        accent: "#ffb97d"
      }
    },
    {
      id: "custom",
      name: "Custom",
      description: "Your saved color palette",
      preview: null
    }
  ];

  const backButton = document.getElementById("back-button");
  const enabledToggle = document.getElementById("theme-enabled-toggle");
  const themeGrid = document.getElementById("theme-grid");
  const customThemeCard = document.getElementById("custom-theme-card");
  const customColorGrid = document.getElementById("custom-color-grid");
  const useCustomButton = document.getElementById("use-custom-button");
  const status = document.getElementById("status");

  let selectedTheme = DEFAULT_SETTINGS.selectedTheme;
  let themeEnabled = DEFAULT_SETTINGS.themeEnabled;
  let customThemeMode = DEFAULT_SETTINGS.customThemeMode;
  let customThemeBaseColor = DEFAULT_SETTINGS.customThemeBaseColor;
  let customThemeColors = { ...DEFAULT_SETTINGS.customThemeColors };

  function setStatus(message) {
    status.textContent = message;
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
    const normalized = normalizeHex(hex, "#000000").slice(1);
    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16)
    };
  }

  function rgbToHex({ r, g, b }) {
    return `#${[r, g, b]
      .map((value) => Math.round(Math.max(0, Math.min(255, value))).toString(16).padStart(2, "0"))
      .join("")}`;
  }

  function mixColors(hexA, hexB, amountB) {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    const amountA = 1 - amountB;
    return rgbToHex({
      r: a.r * amountA + b.r * amountB,
      g: a.g * amountA + b.g * amountB,
      b: a.b * amountA + b.b * amountB
    });
  }

  function getLuminance(hex) {
    const { r, g, b } = hexToRgb(hex);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  function getReadableTextColor(backgroundHex) {
    return getLuminance(backgroundHex) > 0.58 ? "#1a1a1a" : "#f5f5f5";
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
      page,
      panel,
      card,
      input,
      text,
      muted,
      accent,
      border,
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

  async function saveCustomColors(nextColors, activate = false) {
    customThemeColors = normalizeCustomColors(nextColors);
    const values = { customThemeColors };

    if (activate) {
      selectedTheme = "custom";
      values.selectedTheme = selectedTheme;
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

    const values = {
      customThemeMode,
      customThemeBaseColor,
      customThemeColors
    };

    if (activate) {
      selectedTheme = "custom";
      values.selectedTheme = selectedTheme;
      values.themeEnabled = themeEnabled;
    }

    await setStorage(values);
    renderThemes();
    renderCustomEditor();
    await notifyActiveTab();
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

  function renderThemes() {
    themeGrid.innerHTML = "";

    THEMES.forEach((theme) => {
      const previewColors = theme.id === "custom" ? getCustomPreview() : theme.preview;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "theme-card";
      button.dataset.themeId = theme.id;
      button.setAttribute("aria-pressed", String(theme.id === selectedTheme));

      const preview = document.createElement("span");
      preview.className = "theme-preview";
      preview.setAttribute("aria-hidden", "true");
      preview.style.setProperty("--preview-page", previewColors.page);
      preview.style.setProperty("--preview-panel", previewColors.panel);
      preview.style.setProperty("--preview-card", previewColors.card);
      preview.style.setProperty("--preview-text", previewColors.text);
      preview.style.setProperty("--preview-current", previewColors.current);
      preview.style.setProperty("--preview-accent", previewColors.accent);

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

      button.title = theme.name;
      button.setAttribute("aria-label", theme.name);
      button.append(preview);

      button.addEventListener("click", async () => {
        selectedTheme = theme.id;
        await setStorage({ selectedTheme, themeEnabled });
        renderThemes();
        await notifyActiveTab();
      });

      themeGrid.appendChild(button);
    });
  }

  function renderCustomEditor() {
    customThemeCard.classList.toggle("is-active", selectedTheme === "custom");
    useCustomButton.textContent = selectedTheme === "custom" ? "Using Custom" : "Use Custom";
    customColorGrid.innerHTML = "";

    const modeControl = document.createElement("div");
    modeControl.className = "custom-mode-control";
    modeControl.setAttribute("role", "tablist");
    modeControl.setAttribute("aria-label", "Custom color mode");

    [
      { id: "easy", label: "Easy" },
      { id: "advanced", label: "Advanced" }
    ].forEach((mode) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "custom-mode-button";
      button.textContent = mode.label;
      button.setAttribute("aria-selected", String(customThemeMode === mode.id));
      button.addEventListener("click", () => saveCustomMode(mode.id));
      modeControl.appendChild(button);
    });

    customColorGrid.appendChild(modeControl);

    if (customThemeMode === "easy") {
      const row = document.createElement("label");
      row.className = "custom-color-row custom-color-row-easy";

      const label = document.createElement("span");
      label.className = "custom-color-label";
      label.textContent = "Page color";

      const swatch = document.createElement("input");
      swatch.type = "color";
      swatch.value = customThemeBaseColor;
      swatch.setAttribute("aria-label", "Page color");

      const hex = document.createElement("input");
      hex.type = "text";
      hex.inputMode = "text";
      hex.spellcheck = false;
      hex.value = customThemeBaseColor;
      hex.pattern = "#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?";
      hex.setAttribute("aria-label", "Page color hex value");

      swatch.addEventListener("input", () => {
        hex.value = swatch.value;
      });

      swatch.addEventListener("change", () => {
        hex.value = swatch.value;
        saveEasyBaseColor(swatch.value, selectedTheme === "custom");
      });

      hex.addEventListener("change", () => {
        const normalized = normalizeHex(hex.value, customThemeBaseColor);
        hex.value = normalized;
        swatch.value = normalized;
        saveEasyBaseColor(normalized, selectedTheme === "custom");
      });

      const helper = document.createElement("p");
      helper.className = "custom-mode-helper";
      helper.textContent = "The rest of the palette is generated from this color.";

      row.append(label, swatch, hex);
      customColorGrid.append(row, helper);
      return;
    }

    CUSTOM_COLOR_FIELDS.forEach((field) => {
      const row = document.createElement("label");
      row.className = "custom-color-row";

      const label = document.createElement("span");
      label.className = "custom-color-label";
      label.textContent = field.label;

      const swatch = document.createElement("input");
      swatch.type = "color";
      swatch.value = customThemeColors[field.key];
      swatch.setAttribute("aria-label", `${field.label} color`);

      const hex = document.createElement("input");
      hex.type = "text";
      hex.inputMode = "text";
      hex.spellcheck = false;
      hex.value = customThemeColors[field.key];
      hex.pattern = "#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?";
      hex.setAttribute("aria-label", `${field.label} hex value`);

      const update = async (value) => {
        const nextValue = normalizeHex(value, customThemeColors[field.key]);
        const nextColors = { ...customThemeColors, [field.key]: nextValue };
        await saveCustomColors(nextColors, selectedTheme === "custom");
      };

      swatch.addEventListener("input", () => {
        hex.value = swatch.value;
      });

      swatch.addEventListener("change", () => {
        hex.value = swatch.value;
        update(swatch.value);
      });

      hex.addEventListener("change", () => {
        const normalized = normalizeHex(hex.value, customThemeColors[field.key]);
        hex.value = normalized;
        swatch.value = normalized;
        update(normalized);
      });

      row.append(label, swatch, hex);
      customColorGrid.appendChild(row);
    });
  }

  async function init() {
    const settings = await getStorage(DEFAULT_SETTINGS);
    selectedTheme = settings.selectedTheme || DEFAULT_SETTINGS.selectedTheme;
    themeEnabled = Boolean(settings.themeEnabled);
    customThemeMode = settings.customThemeMode === "advanced" ? "advanced" : "easy";
    customThemeBaseColor = normalizeHex(settings.customThemeBaseColor, DEFAULT_SETTINGS.customThemeBaseColor);
    customThemeColors =
      customThemeMode === "easy"
        ? deriveEasyThemeColors(customThemeBaseColor)
        : normalizeCustomColors(settings.customThemeColors);
    enabledToggle.checked = themeEnabled;
    renderThemes();
    renderCustomEditor();

    backButton.addEventListener("click", () => {
      window.location.href = "popup.html";
    });

    enabledToggle.addEventListener("change", async () => {
      themeEnabled = enabledToggle.checked;
      await setStorage({ themeEnabled, selectedTheme });
      await notifyActiveTab();
    });

    useCustomButton.addEventListener("click", async () => {
      selectedTheme = "custom";
      themeEnabled = true;
      enabledToggle.checked = true;
      if (customThemeMode === "easy") {
        await saveEasyBaseColor(customThemeBaseColor, true);
      } else {
        await saveCustomColors(customThemeColors, true);
      }
    });
  }

  init();
})();
