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
    distractionFreeMode: false
  };

  const TOGGLE_KEYS = ["distractionFreeMode"];

  const LANGUAGE_OPTIONS = globalThis.GT_ROADMAP_LANGUAGES || [
    { id: "en", label: "English 🇺🇸", name: "English", htmlLang: "en", dir: "ltr" }
  ];
  const FUN_LANGUAGE_IDS = globalThis.GT_ROADMAP_FUN_LANGUAGE_IDS || [];
  const REAL_LANGUAGE_OPTIONS = LANGUAGE_OPTIONS.filter((language) => !FUN_LANGUAGE_IDS.includes(language.id));
  const FUN_LANGUAGE_OPTIONS = LANGUAGE_OPTIONS.filter((language) => FUN_LANGUAGE_IDS.includes(language.id));

  const form = document.getElementById("settings-form");
  const chooseThemeButton = document.getElementById("choose-theme-button");
  const chooseCourseCardButton = document.getElementById("choose-course-card-button");
  const chooseFontButton = document.getElementById("choose-font-button");
  const languageSelect = document.getElementById("language-select");
  const funLanguageRow = document.getElementById("fun-language-row");
  const funLanguageSelect = document.getElementById("fun-language-select");
  const cornerRadiusSlider = document.getElementById("corner-radius-slider");
  const cornerRadiusValue = document.getElementById("corner-radius-value");
  const resetButton = document.getElementById("reset-button");
  const status = document.getElementById("status");

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  function normalizeCornerRadius(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return DEFAULT_SETTINGS.cornerRadius;
    return Math.max(0, Math.min(24, Math.round(number)));
  }

  function normalizeLanguageId(languageId) {
    return REAL_LANGUAGE_OPTIONS.some((language) => language.id === languageId)
      ? languageId
      : DEFAULT_SETTINGS.selectedLanguage;
  }

  function normalizeFunLanguageId(languageId) {
    return FUN_LANGUAGE_OPTIONS.some((language) => language.id === languageId)
      ? languageId
      : DEFAULT_SETTINGS.selectedFunLanguage;
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

  function render(settings) {
    TOGGLE_KEYS.forEach((key) => {
      if (form.elements[key]) {
        form.elements[key].checked = Boolean(settings[key]);
      }
    });

    const selectedLanguage = normalizeLanguageId(settings.selectedLanguage);
    const selectedFunLanguage = FUN_LANGUAGE_IDS.includes(settings.selectedLanguage)
      ? settings.selectedLanguage
      : settings.selectedFunLanguage;
    languageSelect.value = selectedLanguage;
    funLanguageSelect.value = normalizeFunLanguageId(selectedFunLanguage);
    funLanguageRow.hidden = selectedLanguage !== "en";

    const cornerRadius = normalizeCornerRadius(settings.cornerRadius);
    cornerRadiusSlider.value = String(cornerRadius);
    cornerRadiusValue.textContent = `${cornerRadius}px`;
  }

  async function saveLanguage(value) {
    const selectedLanguage = normalizeLanguageId(value);
    const updates = { selectedLanguage };
    if (selectedLanguage !== "en") {
      updates.selectedFont = DEFAULT_SETTINGS.selectedFont;
      updates.selectedFunLanguage = DEFAULT_SETTINGS.selectedFunLanguage;
    }

    await setStorage(updates);
    await notifyActiveTab();
  }

  async function saveFunLanguage(value) {
    const selectedFunLanguage = normalizeFunLanguageId(value);
    await setStorage({ selectedLanguage: "en", selectedFunLanguage });
    await notifyActiveTab();
  }

  async function saveToggle(key, value) {
    await setStorage({ [key]: value });
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
    await setStorage({ ...DEFAULT_SETTINGS });
    render(DEFAULT_SETTINGS);
    await notifyActiveTab();
  }

  async function init() {
    REAL_LANGUAGE_OPTIONS.forEach((language) => {
      const option = document.createElement("option");
      option.value = language.id;
      option.textContent = language.label;
      languageSelect.appendChild(option);
    });

    const defaultFunOption = document.createElement("option");
    defaultFunOption.value = DEFAULT_SETTINGS.selectedFunLanguage;
    defaultFunOption.textContent = "Default English";
    funLanguageSelect.appendChild(defaultFunOption);

    FUN_LANGUAGE_OPTIONS.forEach((language) => {
      const option = document.createElement("option");
      option.value = language.id;
      option.textContent = language.label;
      funLanguageSelect.appendChild(option);
    });

    const settings = await getStorage(DEFAULT_SETTINGS);
    render(settings);

    chooseThemeButton.addEventListener("click", () => {
      window.location.href = "themes.html";
    });

    chooseCourseCardButton.addEventListener("click", () => {
      window.location.href = "course-card.html";
    });

    chooseFontButton.addEventListener("click", () => {
      window.location.href = "fonts.html";
    });

    languageSelect.addEventListener("change", () => {
      saveLanguage(languageSelect.value).then(() => {
        funLanguageRow.hidden = languageSelect.value !== "en";
      });
    });

    funLanguageSelect.addEventListener("change", () => {
      saveFunLanguage(funLanguageSelect.value);
    });

    form.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (!TOGGLE_KEYS.includes(target.name)) return;

      saveToggle(target.name, target.checked);
    });

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
