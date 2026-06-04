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
    emphasizePrereqs: false
  };

  const TOGGLE_KEYS = [
    "emphasizePrereqs"
  ];

  const form = document.getElementById("settings-form");
  const chooseThemeButton = document.getElementById("choose-theme-button");
  const chooseCourseCardButton = document.getElementById("choose-course-card-button");
  const chooseFontButton = document.getElementById("choose-font-button");
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

    const cornerRadius = normalizeCornerRadius(settings.cornerRadius);
    cornerRadiusSlider.value = String(cornerRadius);
    cornerRadiusValue.textContent = `${cornerRadius}px`;
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
