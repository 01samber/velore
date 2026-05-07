# Frontend Currency Dropdown Fix Report

## Root cause
- The Navbar and Footer used **native `<select>`** controls for currency. These:
  - render with **browser / OS UI**, which visually clashes with the site’s recovered premium popover language
  - can cause **layout jump** because long labels (e.g. “UNITED STATES (USD $)”) change trigger width
  - behave inconsistently between desktop/mobile and between Navbar/Footer (duplicated logic)

## Fix summary
- Introduced a shared custom popover component `CurrencyMenu` that:
  - shows a **stable-width trigger** with short codes (`USD`, `EUR`, `GBP`, `LBP`)
  - shows a premium menu (`v-popover`, `v-menu-item`, `v-popover-anim`)
  - closes on selection, closes on outside click, closes on Escape
  - persists selection to `localStorage` key **`velore_currency`**
  - avoids any external exchange-rate fetches and does not reload the page

## Files changed
- `src/shared/components/ui/CurrencyMenu.jsx` (new)
- `src/shared/components/ui/index.js` (export `CurrencyMenu`)
- `src/shared/components/layout/Navbar.jsx` (replace native currency selects with `CurrencyMenu`)
- `src/shared/components/layout/Footer.jsx` (replace currency select with `CurrencyMenu`, keep language select)
- `src/index.css` (selected-row styling for menu items)

## Navbar behavior after fix
- **Trigger**: stable width; no right-side navbar jump when switching currency.
- **Menu**: premium popover surface; selected row clearly indicated; hover/focus states consistent.
- **Interactions**:
  - click trigger toggles menu
  - click outside closes
  - Escape closes and returns focus to trigger
  - selecting an option updates currency, closes menu, no reload
- **No conflict**: search dropdown remains independent.

## Footer behavior after fix
- Currency control now matches Navbar visually and behaviorally using the same `CurrencyMenu`.
- Footer language remains a native `<select>` but is styled with `v-select` for consistency.

## Mobile behavior
- Navbar mobile menu uses the same `CurrencyMenu` (stable, consistent, no browser-select jank).
- Footer mobile uses the same `CurrencyMenu`.
- Menu uses `maxWidth: calc(100vw - 24px)` to avoid viewport overflow.

## Accessibility notes
- Trigger:
  - `aria-label` set (“Select currency”)
  - `aria-haspopup="menu"` and `aria-expanded`
- Menu items:
  - are real `<button>`s with `role="menuitem"`
  - selected row uses `aria-current="true"` + `aria-pressed="true"`
- Keyboard:
  - Tab focuses trigger and menu items
  - Escape closes menu and restores focus to trigger
- Decorative icons use `aria-hidden`

## Regression check (confirmed not broken)
- `resolveImageUrl` still works
- product images + blog images still show
- route lazy loading remains intact (build output still chunk-splits)
- `ContactModal` and `CartSidebar` remain lazy-loaded
- clickable contact cards remain
- checkout empty-cart total/shipping remains correct
- navbar icon navigation remains
- page transitions remain stable
- search dropdown remains functional

## Build / lint results
- **Build**: PASS (`npm run build`)
- **Lint**: PASS with known warnings only (`npm run lint`)
  - `src/features/checkout/Checkout.jsx`: `react-hooks/exhaustive-deps` missing `loadCart`
  - `src/features/product/ProductDetail.jsx`: `react-hooks/exhaustive-deps` missing `loadProduct`
  - `src/features/shop/Shop.jsx`: `react-hooks/exhaustive-deps` missing `loadProducts`

## Remaining TODOs
- If/when currency affects pricing display, add a small shared helper (without introducing external rate fetches).

