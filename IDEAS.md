# GT Roadmap Extension — Feature Ideas

> This file covers potential additions that **do not** duplicate any existing functionality.
> 
> **Already built:** color themes (25 presets + custom), course card field toggles (name / credits / GPA), corner-radius slider, font picker (Nerd Font stacks + system fonts), typography controls (font scale × 3, letter spacing, word spacing, line height), accessibility modes (8 presets), readable-font picker, language translation (fun + real), distraction-free mode, and the custom 9-field color editor.

---

## 1. Roadmap Analytics

Visual summaries that surface information already on the roadmap but not currently aggregated.

| Idea | Description |
|------|-------------|
| **Credit load indicator** | Show a small badge per semester column with the total credit hours. Color-code light / heavy / overloaded loads. |
| **Graduation progress ring** | Overlay a circular progress indicator (e.g., 72 / 126 credits) somewhere on the toolbar or header. |
| **GPA trend sparkline** | A tiny line chart in the toolbar showing GPA across semesters, so you can see trends at a glance. |
| **Course-type breakdown** | Pie or bar breakdown of credits by category (CS core, math, electives, free). Requires the data GT already marks up. |
| **Estimated graduation date** | Based on credit pace, surface an estimate of which semester you will likely finish. |

---

## 2. Export & Sharing

| Idea | Description |
|------|-------------|
| **Export as PNG/PDF** | One-click screenshot of the full roadmap canvas (stitched if it scrolls). Uses `html2canvas` or the native Screenshot API. |
| **Export course list as CSV** | Flat table of course code, name, credits, semester, GPA. Useful for advisors. |
| **Shareable image card** | Generate a styled "summary card" (current theme colors) suitable for posting to social media — e.g., "#3 semesters left" style graphic. |

---

## 3. Course Card Enhancements

These extend what is shown on cards beyond the existing name / credits / GPA toggles.

| Idea | Description |
|------|-------------|
| **Department color coding** | Automatically tint card borders or accents by department prefix (CS, MATH, PHYS, ECE…) using a configurable color map. |
| **Difficulty highlight** | Let users mark a course as Easy / Medium / Hard; show a subtle indicator on the card. Stored in `chrome.storage.sync`. |
| **Custom emoji / icon per course** | Small icon slot on each card. Users pick from a preset set of emoji (fire, star, clock…). |
| **Prerequisite chain highlight** | Hover a course and dim all courses that are not its prerequisites or dependents. |
| **Course notes tooltip** | Click a "note" icon on a card to add a short text note (advisor comment, reminder). Shown as a tooltip on hover. |

---

## 4. Layout & Navigation

| Idea | Description |
|------|-------------|
| **Compact card mode** | Reduce card padding so more cards fit on screen without scrolling. Toggle in popup separate from the font-scale controls. |
| **Roadmap zoom** | Ctrl+scroll (or a ±zoom button in the toolbar) to scale the entire canvas. Useful on small screens. |
| **Semester year groupings** | Visually group Fall/Spring/Summer under a year header (2023–2024, etc.) for quicker navigation. |
| **Jump-to-semester dropdown** | A select in the toolbar that scrolls the canvas to a chosen semester instantly. |
| **Collapse past semesters** | Fold completed semesters into a single thin strip to maximize visible space for remaining coursework. |

---

## 5. New Accessibility Features

These are distinct from the existing 8 accessibility color modes and the typography panel.

| Idea | Description |
|------|-------------|
| **Focus mode** | Dim all semesters except the one the cursor is in. Helps people who get distracted by surrounding content. |
| **Reading ruler** | A horizontal highlight band that follows the mouse, useful for users with tracking difficulties. |
| **Reduced motion toggle** | Disable all CSS transitions and animations for users who are motion-sensitive (separate from OS-level prefers-reduced-motion since GT may not respect it). |
| **Cursor size amplifier** | Inject a larger custom cursor overlay within the roadmap iframe/page. |

---

## 6. Theme & Visual Extras

Beyond the 25 presets and custom editor that already exist.

| Idea | Description |
|------|-------------|
| **Scheduled theme switching** | Automatically swap to a "night" theme after a user-defined time (e.g., dark after 8 PM) without relying on OS dark mode. |
| **Custom background texture** | Let users choose a subtle background pattern (dots, grid, noise) applied to `--gtc-page` behind course columns. |
| **Animated gradient toggle** | Slow-shifting gradient on the page background — opt-in, off by default, respects reduced-motion. |
| **Theme import / export** | Export the current custom theme as a JSON string to share with friends or back up. Paste JSON to import. |
| **Seasonal auto-theme** | Automatically switch to a preset based on the current date (e.g., Crimson in fall, Emerald in spring). |

---

## 7. Productivity & Workflow

| Idea | Description |
|------|-------------|
| **Course search** | A keyboard shortcut (e.g., `Ctrl+F` inside the page) that opens a search bar and highlights matching course cards. |
| **Starred / bookmarked courses** | Let users pin important courses (e.g., ones they are deciding between). Starred courses get a visual marker. |
| **Semester "locked" mode** | Mark a semester as finalized; lock icon appears and cards can't be accidentally rearranged. |
| **Copy course code to clipboard** | Double-click a course code on the card to copy it (for pasting into OSCAR / registration). |
| **Keyboard navigation** | Arrow-key navigation between course cards and semesters, so the roadmap is usable without a mouse. |

---

## 8. Integration Ideas

| Idea | Description |
|------|-------------|
| **Rate My Professor overlay** | Show an RMP score badge on each course card, fetched from the public RMP GraphQL API. Opt-in. |
| **OSCAR availability dot** | Green / yellow / red dot showing whether a course section is open for registration. Requires a lightweight proxy or the GT public API. |
| **iCal / Google Calendar export** | Generate a `.ics` file from a semester's courses so users can block study time. |
| **Advisor note sync** | Let users paste a block of text from their advisor and have it auto-highlight mentioned course codes on the roadmap. |
