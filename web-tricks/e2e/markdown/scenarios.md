# Markdown E2E Scenarios

## Gallery filter and detail navigation

- Visit `/`
- Expect heading `Tiny tricks, big impact.`
- Expect heading `Browse Tricks`
- Expect link `Glassmorphism Card`
- Click button `React`
- Expect heading `React`
- Expect link `Composition Search (IME)`
- Expect link `useLocalStorage Hook`
- Expect no link `Glassmorphism Card`
- Click link `Composition Search (IME)`
- Expect heading `Composition Search (IME)`
- Expect text `Technologies`
- Expect link `Back to all tricks`
- Take screenshot `gallery-react-detail`

## Not found route

- Visit `/trick/does-not-exist`
- Expect text `Trick not found.`
- Take screenshot `trick-not-found`

## useLocalStorage persistence

- Visit `/trick/use-local-storage`
- Fill textbox `Name` with `Kin`
- Click button `+`
- Click button `Toggle dark mode`
- Expect text `Count: 1`
- Take screenshot `use-local-storage-before-reload`
- Reload page
- Expect textbox `Name`
- Expect text `Count: 1`
- Take screenshot `use-local-storage-after-reload`

## Composition search

- Visit `/trick/composition-search`
- Expect label `Applied keyword value` equals `(empty)`
- Fill textbox `Search keyword` with `東`
- Expect label `Applied keyword value` equals `東`
- Expect text `1 results`
- Take screenshot `composition-search`
