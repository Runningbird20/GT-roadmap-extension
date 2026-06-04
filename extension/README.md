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
- Confirm the floating **Roadmap** toolbar appears in the bottom-right corner.
- Toggle each control from the toolbar and confirm the page updates immediately.
- Open the extension popup and confirm the same settings are reflected there.
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
- **Compact mode**: Reduces spacing around semester columns and course cards.
- **Dim completed courses**: Lowers visual emphasis for elements marked completed through stable attributes such as `data-completed`, `data-status`, or accessible labels.
- **Emphasize prerequisite warnings**: Highlights prerequisite or corequisite warnings using stable selectors and conservative text-based fallback annotations.

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
