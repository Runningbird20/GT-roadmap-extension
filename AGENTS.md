# GT Roadmap Extension Agent Notes

## Project Scope

This repository contains a Manifest V3 browser extension in `extension/` for theming and customizing the GT Degree Roadmap site.

The `prereq-roadmap copy/` folder is reference source only. Do not edit files inside that folder unless the user explicitly asks for source app changes.

## Theming Rules

- Theme the site by overriding the copied app's existing design tokens and Tailwind utility classes.
- Prefer targeted selectors for known app hooks/classes:
  - `bg-background-primary`
  - `bg-background-secondary`
  - `bg-background-elevated`
  - `bg-surface-interactive`
  - `bg-surface-hover`
  - `text-text-primary`
  - `text-text-secondary`
  - `text-text-tertiary`
  - `border-border-primary`
  - `border-accent-primary`
  - `ring-accent-primary`
  - `data-tour` hooks such as `search-bar`, `toolbar`, `semester-columns`, and `course-panel`
- Avoid broad wrapper selectors that repaint layout containers, especially `[data-semester]`, generic `panel`, generic `card`, or generic `semester` selectors. These caused odd boxes and surfaces that did not match the original app.
- The goal for themes is: same layout, shape, spacing, shadows, and interaction model as the original app, but with different colors.
- The zoom control is intentionally themed as its own component and should not depend on the app's light/dark mode classes.
- The search bar is intentionally transparent when themed.
- Draft settings uses HeroUI generated slots. Keep modal/input/select rules scoped enough to avoid repainting the whole app.
- Font customization is separate from color theming. It uses `fonts.html`, `fonts.js`, `font-options.js`, `selectedFont`, and `gt-roadmap-font-enabled`.
- Keep font options centralized in `extension/font-options.js` so the picker and content script stay in sync.
- Bundled font files live in `extension/assets/fonts/` and are exposed through `web_accessible_resources`; do not add remote runtime font downloads. Proprietary fonts such as SF Pro Display and Aptos should stay local/system-only options, not bundled files.
- Language customization uses `language-options.js`, `selectedLanguage`, and `selectedFunLanguage`. Fun modes are English variants selected only when `selectedLanguage` is `en`; they must not force `selectedFont` back to `default`. Real non-English languages should still force `selectedFont` back to `default` for glyph coverage.
- Accessibility color customization is launched from `themes.html` and uses `accessibility-colors.html` / `accessibility-colors.js`, `selectedAccessibilityMode`, and `gt-accessibility-*` classes. Do not show an Off option on the accessibility colors page; `none` is only the internal inactive state restored when a normal theme is chosen. Accessibility color classes should only apply when `themeEnabled` is true.
- Dyslexia-support fonts live in the main `fonts.html` picker and should stay at the top of the font groups.
- Clutter-reduction controls use `distractionFreeMode`.
- Course card detail controls live in `course-card.html` / `course-card.js` and use `showCourseName`, `showCourseCredits`, and `showCourseGpa`; the content script annotates card sub-elements before CSS hides and reshapes them.
- Rounded corner customization uses `cornerRadius` and the `--gtc-radius` CSS variable. Keep radius rules targeted to controls/cards/panels rather than broad universal selectors.

## Custom Theme

Custom theme colors are stored in `chrome.storage.sync` as `customThemeColors`.

Custom theme mode is stored as `customThemeMode`:

- `easy`: user picks one `customThemeBaseColor`; the extension derives the full palette.
- `advanced`: user edits every `customThemeColors` field directly.

The editable custom keys are:

- `page`
- `panel`
- `card`
- `input`
- `text`
- `muted`
- `accent`
- `border`
- `warning`

The content script derives the full `--gtc-*` variable set from those values when `selectedTheme` is `custom`.

## Font Options

The selected font is stored in `chrome.storage.sync` as `selectedFont`.

Supported values are defined in `extension/font-options.js`, including bundled Google Fonts, bundled Nerd Fonts, and local/system-only entries.

The content script maps those values to font family stacks and sets `--gtc-font-family` on `html` and `body`. The CSS override lives behind `gt-roadmap-font-enabled`.

## Language Options

The selected language is stored in `chrome.storage.sync` as `selectedLanguage`.

Fun English variants are stored separately as `selectedFunLanguage` and only apply when `selectedLanguage` is `en`.

Supported values are defined in `extension/language-options.js`. Translation is local and dictionary/pattern based; keep new roadmap UI copy in that file when adding labels the extension should translate.

## Verification

For extension-only JavaScript changes, run:

```sh
node --check extension/content.js
node --check extension/popup.js
node --check extension/themes.js
node --check extension/fonts.js
node --check extension/accessibility-colors.js
node --check extension/course-card.js
node -e "JSON.parse(require('fs').readFileSync('extension/manifest.json','utf8')); console.log('manifest ok')"
```

After CSS or manifest changes, reload the unpacked extension in the browser and refresh the roadmap page.

