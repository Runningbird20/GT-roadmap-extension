(() => {
  "use strict";

  const DEFAULT_SETTINGS = {
    selectedTheme: "gt-classic",
    themeEnabled: true
  };

  const THEMES = [
    {
      id: "gt-classic",
      name: "GT Classic",
      description: "Clean GT surface palette",
      preview: {
        page: "#f4f6f9",
        panel: "#ffffff",
        card: "#ffffff",
        text: "#17202a",
        current: "#003057",
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
    }
  ];

  const backButton = document.getElementById("back-button");
  const enabledToggle = document.getElementById("theme-enabled-toggle");
  const themeGrid = document.getElementById("theme-grid");
  const status = document.getElementById("status");

  let selectedTheme = DEFAULT_SETTINGS.selectedTheme;
  let themeEnabled = DEFAULT_SETTINGS.themeEnabled;

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

  function renderThemes() {
    themeGrid.innerHTML = "";

    THEMES.forEach((theme) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "theme-card";
      button.dataset.themeId = theme.id;
      button.setAttribute("aria-pressed", String(theme.id === selectedTheme));

      const preview = document.createElement("span");
      preview.className = "theme-preview";
      preview.setAttribute("aria-hidden", "true");
      preview.style.setProperty("--preview-page", theme.preview.page);
      preview.style.setProperty("--preview-panel", theme.preview.panel);
      preview.style.setProperty("--preview-card", theme.preview.card);
      preview.style.setProperty("--preview-text", theme.preview.text);
      preview.style.setProperty("--preview-current", theme.preview.current);
      preview.style.setProperty("--preview-accent", theme.preview.accent);

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

      const copy = document.createElement("span");
      copy.className = "theme-copy";

      const name = document.createElement("span");
      name.className = "theme-name";
      name.textContent = theme.name;

      const description = document.createElement("span");
      description.className = "theme-description";
      description.textContent = theme.description;

      copy.append(name, description);
      button.append(preview, copy);

      button.addEventListener("click", async () => {
        selectedTheme = theme.id;
        await setStorage({ selectedTheme, themeEnabled });
        renderThemes();
        await notifyActiveTab();
      });

      themeGrid.appendChild(button);
    });
  }

  async function init() {
    const settings = await getStorage(DEFAULT_SETTINGS);
    selectedTheme = settings.selectedTheme || DEFAULT_SETTINGS.selectedTheme;
    themeEnabled = Boolean(settings.themeEnabled);
    enabledToggle.checked = themeEnabled;
    renderThemes();

    backButton.addEventListener("click", () => {
      window.location.href = "popup.html";
    });

    enabledToggle.addEventListener("change", async () => {
      themeEnabled = enabledToggle.checked;
      await setStorage({ themeEnabled, selectedTheme });
      await notifyActiveTab();
    });
  }

  init();
})();
