# GT Degree Roadmap Customizer

Local Chrome/Edge Manifest V3 extension for customizing `https://degree-roadmap.gatech.edu/` and local development builds without changing backend data.

## Load the extension

1. Open `chrome://extensions` in Chrome or `edge://extensions` in Edge.
2. Enable **Developer mode**.
3. Choose **Load unpacked**.
4. Select this repo's `extension` folder.
5. Open `https://degree-roadmap.gatech.edu/` or a matching `http://localhost:*/*` development page.

## Test locally

- Open the Degree Roadmap site or a local app page.
- Open the extension popup and confirm the same settings are reflected there.
- Change theme, font, language, rounded corners, and course card controls from the popup pages and confirm the roadmap updates immediately.
- Use **Reset defaults** in the popup to restore the default settings.

The extension uses `chrome.storage.sync`, so settings may sync across browser profiles when sync is enabled.

## Build and debug

No build step or external package is required. The extension is plain HTML, CSS, and JavaScript.

To debug:

- Use **Reload** on the extension card in `chrome://extensions` after editing files.
- Inspect the popup by right-clicking the popup and choosing **Inspect**.
- Inspect the content script from the Degree Roadmap tab's DevTools.
- Check for content-script errors in the page console and popup errors in the popup DevTools console.

## Toggles

- **Custom theme**: Enables the GT navy/gold color treatment, softer shadows, rounded course cards, semester styling, and drag/drop feedback.
- **Rounded corners**: Adjusts the roundness level for roadmap cards, panels, controls, and modals.
- **Course card details**: Shows or hides course names, credits, and GPA while reshaping cards to remove empty detail rows.
- **Language**: Translates known roadmap interface text, placeholders, titles, aria labels, semester labels, course status labels, GPA labels, and credit counts. English also has optional fun wording modes. Real non-English selections restore the default font for glyph coverage.
- **Accessibility colors**: Provides a dedicated page from the theme picker for one-click high contrast, WCAG AA/AAA, and color-blind-friendly palettes for protanopia, deuteranopia, and tritanopia. These palettes use the main theme toggle for on/off and replace the active theme while selected.
- **Fonts**: Provides a dedicated picker for bundled and local font options, with dyslexia-support fonts shown first.
- **Clutter reduction**: Adds a distraction-free mode that removes background decoration, shadows, and extra widgets.

## Stable selector notes

The content script prefers source-owned selectors over generated CSS classes:

- `data-testid="course-card"`
- `data-course-id`
- `data-testid="semester-column"`
- `data-testid="prereq-warning"`
- `data-testid="requirement-section"`
- `data-testid="drop-zone"`

When maintaining the Degree Roadmap app, keep these attributes on the semantic component root when possible. If a component changes its visual structure, the extension should keep working as long as the stable attributes remain attached to the same conceptual UI element.

Generated class names should not be used as extension integration points because framework and build-tool output can change without a product-level UI change.
