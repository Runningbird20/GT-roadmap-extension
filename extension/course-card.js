(() => {
  "use strict";

  const DEFAULT_SETTINGS = {
    showCourseName: true,
    showCourseCredits: true,
    showCourseGpa: true
  };

  const TOGGLE_KEYS = ["showCourseName", "showCourseCredits", "showCourseGpa"];

  const backButton = document.getElementById("back-button");
  const status = document.getElementById("status");

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
      const input = document.querySelector(`input[name="${key}"]`);
      if (input instanceof HTMLInputElement) {
        input.checked = Boolean(settings[key]);
      }
    });
  }

  async function saveToggle(key, value) {
    await setStorage({ [key]: value });
    await notifyActiveTab();
  }

  async function init() {
    const settings = await getStorage(DEFAULT_SETTINGS);
    render(settings);

    backButton.addEventListener("click", () => {
      window.location.href = "popup.html";
    });

    document.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (!TOGGLE_KEYS.includes(target.name)) return;

      saveToggle(target.name, target.checked);
    });
  }

  init();
})();
