(() => {
  "use strict";

  const DEFAULT_SETTINGS = {
    selectedTheme: "gt-classic",
    themeEnabled: true,
    compactMode: false,
    dimCompleted: false,
    emphasizePrereqs: false
  };

  const form = document.getElementById("settings-form");
  const chooseThemeButton = document.getElementById("choose-theme-button");
  const resetButton = document.getElementById("reset-button");
  const status = document.getElementById("status");

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
    ["compactMode", "dimCompleted", "emphasizePrereqs"].forEach((key) => {
      if (form.elements[key]) {
        form.elements[key].checked = Boolean(settings[key]);
      }
    });
  }

  async function saveToggle(key, value) {
    await setStorage({ [key]: value });
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

    form.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (!["compactMode", "dimCompleted", "emphasizePrereqs"].includes(target.name)) return;

      saveToggle(target.name, target.checked);
    });

    resetButton.addEventListener("click", resetSettings);
  }

  init();
})();
