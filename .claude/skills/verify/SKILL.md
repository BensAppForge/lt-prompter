# Verify lt-prompter changes

How to drive the running app to verify changes end-to-end.

## Quick start: committed smoke suite

`npm run e2e` runs the Playwright suite in `e2e/smoke.spec.ts` (starts the
dev server itself, uses system Chrome locally, ~1 min). It covers one
generate-flow per editor, placeholder-token guards, library save/reopen,
and settings defaults. CI runs it on every push (`.github/workflows/e2e.yml`).
For change-specific verification beyond the suite, use the recipe below.

## Launch

```bash
npm start   # dev server on http://localhost:4200, ready in ~15s (curl until 200)
```

## Drive (headless, no extension needed)

Use `playwright-core` with the system Chrome — no browser download:

```js
const { chromium } = require('playwright-core');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
```

Install into the scratchpad dir (`npm i playwright-core`), not the repo.

## Gotchas

- **Material buttons have `aria-label`s that override visible text** — `getByRole('button', {name: 'Kopieren'})` fails. Use class selectors instead: `.edit-button`, `.copy-button`, `.save-button`. `Prompt generieren` has no aria-label and works by role.
- **mat-select**: click `mat-select[formcontrolname="..."]`, then `getByRole('option', {name, exact: true})` (exact matters: A1 vs A1+). Wait ~300ms after for overlay animation.
- Vocabulary words go into a chip input: `mat-chip-grid input` → `fill(word)` + `press('Enter')`.
- Generated prompt renders in `.prompt-container pre`; edit mode swaps it for `textarea.prompt-editor`.
- Clipboard assertions work after `context.grantPermissions(['clipboard-read','clipboard-write'], {origin})`.
- Save-to-library dialog: `mat-dialog-container`, confirm via its `Speichern` button; data lands in IndexedDB of the (temp) browser profile, so tests don't pollute the user's real library.

## Flows worth driving

- Each exercise page: fill selects → generate → assert `pre` content (check for leftover `[PLACEHOLDER]` tokens).
- Edit-mode lifecycle: edit → commit (`.edit-button` toggles Anzeigen/Bearbeiten) → regenerate → assert fresh prompt shown.
- Library: filters via `mat-select[formcontrolname="category"/"cefr"]`, cards are `.prompt-card`.
