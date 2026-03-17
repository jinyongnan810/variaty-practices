# Playwright MCP Scenarios

## Gallery navigation smoke test

Open the home page and confirm the main gallery experience is intact.
The page should show the hero title "Tiny tricks, big impact." and the
"Browse Tricks" section. Filter the gallery to React, confirm React-only
tricks are visible, open "Composition Search (IME)", and verify the detail
page shows the title, the technologies section, and a route back to the
gallery. Capture a screenshot of the trick detail page after the checks pass.

## Unknown trick route

Navigate directly to `/trick/does-not-exist` and confirm the page renders the
"Trick not found." state. Capture a screenshot of the not found view.

## useLocalStorage persistence

Open the `useLocalStorage Hook` trick page. Enter the name `Kin`, increment the
counter once, and enable dark mode. Verify the count is 1 and the changed state
looks applied. Reload the page and confirm the name, count, and dark mode state
persisted. Capture a screenshot before reload and another after reload.

## Composition search behavior

Open the `Composition Search (IME)` trick page. Confirm the applied keyword is
empty initially. Then type the character `東` into the search field and verify
the filtered result list narrows to the matching item `東京`. Capture a
screenshot of the filtered result state.
