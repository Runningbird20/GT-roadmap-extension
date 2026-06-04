(() => {
  "use strict";

  const DEFAULT_SETTINGS = {
    selectedFont: "default"
  };

  const FONT_OPTIONS = [
    {
      id: "default",
      name: "Default",
      sample: "Roadmap Aa",
      family: 'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif'
    },
    {
      id: "jetbrains-mono",
      name: "JetBrainsMono Nerd Font",
      sample: "CS 1331 󰘧",
      family: '"GT JetBrainsMono Nerd Font", monospace'
    },
    {
      id: "fira-code",
      name: "FiraCode Nerd Font",
      sample: "MATH 1554 󰊕",
      family: '"GT FiraCode Nerd Font", monospace'
    },
    {
      id: "hack",
      name: "Hack Nerd Font",
      sample: "Thread 󰙅",
      family: '"GT Hack Nerd Font", monospace'
    },
    {
      id: "meslo",
      name: "MesloLGS Nerd Font",
      sample: "Spring 2025 󰃭",
      family: '"GT MesloLGS Nerd Font", monospace'
    },
    {
      id: "caskaydia",
      name: "CaskaydiaCove Nerd Font",
      sample: "Credits 󰆼",
      family: '"GT CaskaydiaCove Nerd Font", monospace'
    },
    {
      id: "iosevka",
      name: "Iosevka Nerd Font",
      sample: "Prereqs 󰌵",
      family: '"GT Iosevka Nerd Font", monospace'
    },
    {
      id: "mononoki",
      name: "Mononoki Nerd Font",
      sample: "Done 󰄬",
      family: '"GT Mononoki Nerd Font", monospace'
    }
  ];

  const backButton = document.getElementById("back-button");
  const fontGrid = document.getElementById("font-grid");
  const status = document.getElementById("status");

  let selectedFont = DEFAULT_SETTINGS.selectedFont;

  function setStatus(message) {
    status.textContent = message;
  }

  function normalizeFontId(fontId) {
    return FONT_OPTIONS.some((font) => font.id === fontId) ? fontId : DEFAULT_SETTINGS.selectedFont;
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

    FONT_OPTIONS.forEach((font) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "font-option";
      button.setAttribute("aria-pressed", String(font.id === selectedFont));
      button.style.setProperty("--font-preview-family", font.family);

      const name = document.createElement("span");
      name.className = "font-option-name";
      name.textContent = font.name;

      const sample = document.createElement("span");
      sample.className = "font-option-sample";
      sample.textContent = font.sample;

      button.append(name, sample);
      button.addEventListener("click", async () => {
        selectedFont = font.id;
        await setStorage({ selectedFont });
        renderFonts();
        await notifyActiveTab();
      });

      fontGrid.appendChild(button);
    });
  }

  async function init() {
    const settings = await getStorage(DEFAULT_SETTINGS);
    selectedFont = normalizeFontId(settings.selectedFont);
    renderFonts();

    backButton.addEventListener("click", () => {
      window.location.href = "popup.html";
    });
  }

  init();
})();
