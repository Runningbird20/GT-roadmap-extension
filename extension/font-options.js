(() => {
  "use strict";

  const bundledSans = [
    ["inter", "Inter", "Inter UI Aa", "Inter-Regular.woff2"],
    ["roboto", "Roboto", "Roadmap Aa", "Roboto-Regular.woff2"],
    ["manrope", "Manrope", "Credits Aa", "Manrope-Regular.woff2"],
    ["plus-jakarta-sans", "Plus Jakarta Sans", "Spring Aa", "PlusJakartaSans-Regular.woff2"],
    ["ibm-plex-sans", "IBM Plex Sans", "CS 1331 Aa", "IBMPlexSans-Regular.woff2"],
    ["source-sans-3", "Source Sans 3", "GPA Aa", "SourceSans3-Regular.woff2"],
    ["work-sans", "Work Sans", "Thread Aa", "WorkSans-Regular.woff2"],
    ["noto-sans", "Noto Sans", "Notes Aa", "NotoSans-Regular.woff2"],
    ["dm-sans", "DM Sans", "Course Aa", "DMSans-Regular.woff2"],
    ["merriweather-sans", "Merriweather Sans", "Degree Aa", "MerriweatherSans-Regular.woff2"],
    ["lato", "Lato", "Locked Aa", "Lato-Regular.woff2"],
    ["nunito-sans", "Nunito Sans", "Ready Aa", "NunitoSans-Regular.woff2"],
    ["libre-franklin", "Libre Franklin", "Plan Aa", "LibreFranklin-Regular.woff2"],
    ["figtree", "Figtree", "Card Aa", "Figtree-Regular.woff2"],
    ["public-sans", "Public Sans", "Roadmap Aa", "PublicSans-Regular.woff2"]
  ];

  const bundledDyslexia = [
    ["opendyslexic", "OpenDyslexic", "CS 1301", "OpenDyslexic-Regular.woff2"],
    ["lexend", "Lexend", "CS 1301", "Lexend-Regular.woff2"],
    ["atkinson-hyperlegible", "Atkinson Hyperlegible", "CS 1301", "AtkinsonHyperlegible-Regular.woff2"]
  ];

  const bundledTech = [
    ["orbitron", "Orbitron", "AE 1355", "Orbitron-Regular.woff2"],
    ["exo-2", "Exo 2", "CS 2110", "Exo2-Regular.woff2"],
    ["rajdhani", "Rajdhani", "MATH 1554", "Rajdhani-Regular.woff2"],
    ["audiowide", "Audiowide", "ROBOTICS", "Audiowide-Regular.woff2"],
    ["oxanium", "Oxanium", "THREAD", "Oxanium-Regular.woff2"],
    ["chakra-petch", "Chakra Petch", "CREDITS", "ChakraPetch-Regular.woff2"],
    ["michroma", "Michroma", "GT ROADMAP", "Michroma-Regular.woff2"],
    ["teko", "Teko", "SPRING 2025", "Teko-Regular.woff2"]
  ];

  const bundledRetro = [
    ["press-start-2p", "Press Start 2P", "START", "PressStart2P-Regular.woff2"],
    ["russo-one", "Russo One", "COURSE", "RussoOne-Regular.woff2"],
    ["bebas-neue", "Bebas Neue", "CREDITS", "BebasNeue-Regular.woff2"],
    ["jersey-10", "Jersey 10", "ROADMAP", "Jersey10-Regular.woff2"],
    ["silkscreen", "Silkscreen", "PIXEL", "Silkscreen-Regular.woff2"],
    ["vt323", "VT323", "TERMINAL", "VT323-Regular.woff2"]
  ];

  const bundledSerifHand = [
    ["cinzel", "Cinzel", "Degree", "Cinzel-Regular.woff2"],
    ["cormorant-garamond", "Cormorant Garamond", "Seminar", "CormorantGaramond-Regular.woff2"],
    ["caveat", "Caveat", "Notes", "Caveat-Regular.woff2"],
    ["patrick-hand", "Patrick Hand", "Reminder", "PatrickHand-Regular.woff2"],
    ["kalam", "Kalam", "Plan", "Kalam-Regular.woff2"],
    ["indie-flower", "Indie Flower", "Sketch", "IndieFlower-Regular.woff2"],
    ["shadows-into-light", "Shadows Into Light", "Draft", "ShadowsIntoLight-Regular.woff2"],
    ["handlee", "Handlee", "Checklist", "Handlee-Regular.woff2"],
    ["marcellus", "Marcellus", "Classics", "Marcellus-Regular.woff2"],
    ["medievalsharp", "MedievalSharp", "Quest", "MedievalSharp-Regular.woff2"],
    ["uncial-antiqua", "Uncial Antiqua", "Legend", "UncialAntiqua-Regular.woff2"],
    ["cormorant-sc", "Cormorant SC", "Honors", "CormorantSC-Regular.woff2"],
    ["forum", "Forum", "Lecture", "Forum-Regular.woff2"],
    ["im-fell-english", "IM Fell English", "Archive", "IMFellEnglish-Regular.woff2"]
  ];

  const nerdFonts = [
    ["jetbrains-mono", "JetBrainsMono Nerd Font", "CS 1331 󰘧", "JetBrainsMonoNerdFontMono-Regular.ttf"],
    ["fira-code", "FiraCode Nerd Font", "MATH 1554 󰊕", "FiraCodeNerdFontMono-Regular.ttf"],
    ["hack", "Hack Nerd Font", "Thread 󰙅", "HackNerdFontMono-Regular.ttf"],
    ["meslo", "MesloLGS Nerd Font", "Spring 2025 󰃭", "MesloLGSNerdFontMono-Regular.ttf"],
    ["caskaydia", "CaskaydiaCove Nerd Font", "Credits 󰆼", "CaskaydiaCoveNerdFontMono-Regular.ttf"],
    ["iosevka", "Iosevka Nerd Font", "Prereqs 󰌵", "IosevkaNerdFontMono-Regular.ttf"],
    ["mononoki", "Mononoki Nerd Font", "Card 󰄬", "MononokiNerdFontMono-Regular.ttf"]
  ];

  const localFonts = [
    {
      id: "sf-pro-display",
      name: "SF Pro Display",
      sample: "Apple-like Aa",
      group: "Local/System",
      family: '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
    },
    {
      id: "aptos",
      name: "Aptos",
      sample: "Office Aa",
      group: "Local/System",
      family: 'Aptos, "Aptos Display", Calibri, system-ui, sans-serif'
    }
  ];

  function familyName(name) {
    return `GT ${name}`;
  }

  function fallbackFor(file) {
    return file.endsWith(".ttf") ? "monospace" : "sans-serif";
  }

  function toOption(group) {
    return ([id, name, sample, file]) => ({
      id,
      name,
      sample,
      group,
      family: `"${familyName(name)}", ${fallbackFor(file)}`
    });
  }

  function toFace([_id, name, _sample, file]) {
    return {
      family: familyName(name),
      file: `assets/fonts/${file}`,
      format: file.endsWith(".woff2") ? "woff2" : "truetype"
    };
  }

  const bundledFonts = [
    ...bundledSans,
    ...bundledDyslexia,
    ...bundledTech,
    ...bundledRetro,
    ...bundledSerifHand,
    ...nerdFonts
  ];

  const options = [
    {
      id: "default",
      name: "Default",
      sample: "Roadmap Aa",
      group: "Default",
      family: 'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif'
    },
    ...bundledSans.map(toOption("Clean Sans")),
    ...bundledDyslexia.map(toOption("Dyslexia Support")),
    ...localFonts,
    ...bundledTech.map(toOption("Tech")),
    ...bundledRetro.map(toOption("Retro")),
    ...bundledSerifHand.map(toOption("Serif & Handwritten")),
    ...nerdFonts.map(toOption("Nerd Fonts"))
  ];

  const stacks = Object.fromEntries(options.map((font) => [font.id, font.id === "default" ? "" : font.family]));
  const faces = bundledFonts.map(toFace);

  globalThis.GT_ROADMAP_FONT_OPTIONS = options;
  globalThis.GT_ROADMAP_FONT_STACKS = stacks;
  globalThis.GT_ROADMAP_FONT_FACES = faces;
  globalThis.GT_ROADMAP_DYSLEXIA_FONT_IDS = bundledDyslexia.map(([id]) => id);
})();
