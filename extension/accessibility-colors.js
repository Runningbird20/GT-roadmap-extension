(() => {
  "use strict";

  const DEFAULT_SETTINGS = {
    selectedAccessibilityMode: "none",
    themeEnabled: true
  };

  const ACCESSIBILITY_OPTIONS = [
    {
      id: "high-contrast-bw",
      label: "Black + white",
      helper: "Maximum contrast.",
      swatches: ["#000000", "#ffffff", "#1a1a1a"]
    },
    {
      id: "high-contrast-navy-yellow",
      label: "Navy + yellow",
      helper: "Dark navy with bright yellow.",
      swatches: ["#001b33", "#ffffff", "#ffd900"]
    },
    {
      id: "high-contrast-bright-dark",
      label: "Bright dark",
      helper: "Dark mode with brighter text.",
      swatches: ["#05070a", "#ffffff", "#facc15"]
    },
    {
      id: "wcag-aa",
      label: "WCAG AA",
      helper: "AA compliant contrast colors.",
      swatches: ["#f7fafc", "#1a202c", "#1a365d"]
    },
    {
      id: "wcag-aaa",
      label: "WCAG AAA",
      helper: "AAA compliant contrast colors.",
      swatches: ["#ffffff", "#000000", "#111111"]
    },
    {
      id: "protanopia",
      label: "Protanopia",
      helper: "Red-blind friendly palette.",
      swatches: ["#f8fafc", "#0072b2", "#a45a00"]
    },
    {
      id: "deuteranopia",
      label: "Deuteranopia",
      helper: "Green-blind friendly palette.",
      swatches: ["#fbfaf7", "#785ef0", "#b15a00"]
    },
    {
      id: "tritanopia",
      label: "Tritanopia",
      helper: "Blue-blind friendly palette.",
      swatches: ["#fff8fb", "#c2185b", "#8a5a00"]
    }
  ];

  const backButton = document.getElementById("back-button");
  const colorGrid = document.getElementById("accessibility-color-grid");
  const status = document.getElementById("status");

  let selectedAccessibilityMode = DEFAULT_SETTINGS.selectedAccessibilityMode;

  function setStatus(message) {
    status.textContent = message;
  }

  function normalizeAccessibilityMode(mode) {
    return ACCESSIBILITY_OPTIONS.some((option) => option.id === mode)
      ? mode
      : DEFAULT_SETTINGS.selectedAccessibilityMode;
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

  function renderModes() {
    colorGrid.innerHTML = "";

    ACCESSIBILITY_OPTIONS.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "accessibility-color-button";
      button.setAttribute("aria-pressed", String(option.id === selectedAccessibilityMode));

      const swatches = document.createElement("span");
      swatches.className = "accessibility-color-swatches";
      swatches.setAttribute("aria-hidden", "true");
      option.swatches.forEach((color) => {
        const swatch = document.createElement("span");
        swatch.style.background = color;
        swatches.appendChild(swatch);
      });

      const copy = document.createElement("span");
      copy.className = "accessibility-color-copy";

      const label = document.createElement("span");
      label.className = "accessibility-color-label";
      label.textContent = option.label;

      const helper = document.createElement("span");
      helper.className = "accessibility-color-helper";
      helper.textContent = option.helper;

      copy.append(label, helper);
      button.append(swatches, copy);
      button.addEventListener("click", async () => {
        selectedAccessibilityMode = option.id;
        await setStorage({ selectedAccessibilityMode, themeEnabled: true });
        renderModes();
        await notifyActiveTab();
      });

      colorGrid.appendChild(button);
    });
  }

  async function init() {
    const settings = await getStorage(DEFAULT_SETTINGS);
    selectedAccessibilityMode = normalizeAccessibilityMode(settings.selectedAccessibilityMode);
    renderModes();

    backButton.addEventListener("click", () => {
      window.location.href = "themes.html";
    });
  }

  init();
})();
