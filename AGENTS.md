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
- Font customization is separate from color theming. It uses `fonts.html`, `fonts.js`, `selectedFont`, and `gt-roadmap-font-enabled`.
- Bundled font files live in `extension/assets/fonts/` and are exposed through `web_accessible_resources`; do not add remote runtime font downloads.
- Course card detail controls live in `course-card.html` / `course-card.js` and use `showCourseName`, `showCourseCredits`, and `showCourseGpa`; the content script annotates card sub-elements before CSS hides and reshapes them.

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

Supported values are:

- `default`
- `jetbrains-mono`
- `fira-code`
- `hack`
- `meslo`
- `caskaydia`
- `iosevka`
- `mononoki`

The content script maps those values to bundled Nerd Font family stacks and sets `--gtc-font-family` on `html` and `body`. The CSS override lives behind `gt-roadmap-font-enabled`.

## Verification

For extension-only JavaScript changes, run:

```sh
node --check extension/content.js
node --check extension/popup.js
node --check extension/themes.js
node --check extension/fonts.js
node --check extension/course-card.js
node -e "JSON.parse(require('fs').readFileSync('extension/manifest.json','utf8')); console.log('manifest ok')"
```

After CSS or manifest changes, reload the unpacked extension in the browser and refresh the roadmap page.
