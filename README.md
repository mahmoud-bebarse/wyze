# Wyze-style Security System Builder

A two-column, data-driven React app for assembling a home security system. Left side is a 4-step accordion builder; right side is a live "Your security system" review panel. Selections, variants, and quantities stay in sync across both columns, the layout is fully responsive down to phone width, and the shopper's configuration can be saved to `localStorage` and restored on return.

Built as a front-end take-home.

## Run it

Requirements: Node 18+ (Node 20 recommended), npm 9+.

```bash
npm install
npm run dev
```

Then open <http://localhost:5173>.

Production build:

```bash
npm run build     # type-check + bundle
npm run preview   # serve the built bundle
```

## Stack

- **Vite + React 18 + TypeScript**
- **Plain CSS Modules** + a root `tokens.css` for design tokens (colors, spacing, radii, type scale)
- **React Context + `useReducer`** — single source of truth for cart state
- **`localStorage`** for the "Save my system for later" persistence
- **No backend** — data lives in `src/data/catalog.json`

## Where things live

```
src/
├─ App.tsx / main.tsx
├─ styles/
│  ├─ tokens.css          # CSS custom properties for the whole app
│  └─ reset.css
├─ data/catalog.json      # product data, step metadata, seeded initial state
├─ state/
│  ├─ CartContext.tsx     # provider + useCart() hook
│  ├─ cartReducer.ts
│  ├─ selectors.ts        # derived values (line items, totals, per-step counts)
│  ├─ persistence.ts      # localStorage load/save
│  └─ types.ts
├─ components/
│  ├─ Layout/             # top-level page shell + mobile header
│  ├─ Accordion/          # 4-step accordion with Next buttons
│  ├─ ProductCard/        # cards + variant selector
│  ├─ ReviewPanel/        # right column: line items + totals + checkout
│  ├─ primitives/         # QuantityStepper, PriceBlock, Badge (reused)
│  └─ icons/              # inline SVG icons
└─ utils/format.ts
public/images/            # product illustrations (inline SVGs)
```

## How the state works

Cart state has three fields:

```ts
{
  quantities: Record<string, number>;        // key = productId or `${productId}:${variantId}`
  activeVariant: Record<string, string>;     // productId -> currently selected variantId
  openStep: 1 | 2 | 3 | 4 | null;
}
```

### Variant model

Each `(product, variant)` pair is a **separate entry** in `quantities`. Red-2 and Blue-0 of the same product coexist. The card's stepper reads and writes the quantity of `activeVariant[productId]`, so switching the chip changes which count you're editing without touching the others. The review panel iterates over all entries with `qty > 0` and renders each variant as its own line — exactly as the spec requires.

### "N selected" counter

Counts **distinct entries** (variant-aware) in a step with `qty > 0`. So Cam v4 White(2) + Cam v4 Black(1) contributes 2 to Step 1's count. This matches how the review panel lists them.

### Persistence

Explicit save only. Clicking **Save my system for later** writes the current state to `localStorage` under `wyze-builder-state:v1` and shows a "Saved!" confirmation for 2.5s. On next page load, if the key is present, that state is hydrated; otherwise the seeded initial state from `catalog.json` is used. Delete the key in DevTools and reload to reset.

## The mock data

`src/data/catalog.json` is the single source of truth. It contains:

- `steps` — metadata for the 4 accordion steps (title, icon, next-button label)
- `products` — everything sellable, each with an id, category, step, price, optional badge/description/variants/free/required flags
- `shipping` — the "Fast Shipping" line
- `financingMonthly` — the "as low as $X/mo" pill value
- `initialState` — quantities, active variants, and open step to seed a first-time visitor

Edit `initialState.quantities` to change what a fresh visitor sees.

## Decisions & tradeoffs

- **CSS Modules over Tailwind.** Design uses very specific tokens (indigo palette, radii, spacing scale). Plain CSS with variables felt more direct and produced smaller output than configuring Tailwind's theme extension.
- **Context + reducer over a store library.** State is small and self-contained; a global store like Zustand would add a dep for negligible ergonomic gain here.
- **Save-on-click, not auto-save.** The spec says the shopper clicks the link, comes back, and their system is restored. Auto-save would work too, but the explicit action matches the wording and lets us surface a clear "Saved!" confirmation.
- **Distinct-variants counting.** The spec calls out both "distinct products currently chosen" and lines being separate per variant. I read the two together to mean "distinct entries" — matches what the review panel visualizes.
- **Placeholder SVG product images.** I don't have rights to the real Wyze product photography, so `/public/images/` contains hand-authored SVG placeholders that hint at each product's look. Swap them for real assets by dropping PNGs at the paths referenced in `catalog.json`.
- **Steps 2–4 have no product grids** (the Figma only shows Step 1's grid). Opening them reveals a short "already included in your system" note plus the Next button. Their seeded items still appear in the review panel exactly as the design shows.
- **Card vs. review-line price discrepancy.** The Figma shows Cam Pan v3's card price as `$34.98` (compare `$39.98`), but the review line for qty 2 shows `$47.98` (compare `$57.98`). Only $23.99/unit sums with the rest to the advertised `$187.89` total. I chose per-unit `$23.99` / `$28.99` to keep the math self-consistent with the total; the card's shown-in-Figma price is a mockup inconsistency.
- **Checkout is a stub.** Clicking the button opens an `alert()` explaining it's a prototype.
- **No unit tests.** The spec didn't require them; the reducer + selectors are pure and would be straightforward to test if this shipped.
- **Selected-chip highlight.** The active variant chip gets an indigo outline. The spec allowed skipping this styling; I included it because it's trivial and makes the interaction obvious.

## Verifying against the design

On first load you should see:

- Step 1 open with 5 camera cards. Cam v4 (White, qty 1) and Cam Pan v3 (White, qty 2) are highlighted with an indigo border.
- Step 1 header reads **"2 selected ▲"**.
- Steps 2, 3, 4 are collapsed. Their counters show **1 selected**, **2 selected**, **1 selected** respectively (matching the mobile mockup).
- Review panel shows: Cameras (Cam v4 ×1, Cam Pan v3 ×2), Sensors (Motion ×2, Hub ×1 FREE), Accessories (MicroSD ×2), Plan (Cam Unlimited $9.99/mo).
- Total: **$187.89** with **$238.81** struck through.
- Savings: **$50.92**.

Interactions to try:

- **Variant switching**: on Cam v4, click **Black** — the stepper reads 0. Add one. The review panel now shows both a White (×1) and a Black (×1) line for Cam v4. Step 1's count becomes 3.
- **Stepper sync**: change Cam Pan v3's quantity from the review panel — the card in Step 1 updates instantly, and the total recalculates.
- **Accordion**: click any collapsed step header to open it; the previously-open step collapses. Click **Next: …** in Step 1 to advance to Step 2.
- **Save & restore**: change a few quantities, click **Save my system for later**, hard-reload — state comes back exactly as you left it. Clear `wyze-builder-state:v1` from `localStorage` and reload to reset to the seed.
- **Responsive**: DevTools iPhone SE (375px) shows a single-column stack with the "Let's get started!" mobile title. Tablet (768px) shows a 2-column product grid, still stacked. Desktop (1280px+) shows the two-column layout with the review panel sticky.

## Not finished / would do next

- Real product photography instead of placeholder SVGs.
- Unit tests for `cartReducer` and `selectors`.
- Keyboard navigation between accordion steps (Arrow keys).
- Animate the accordion open/close with `height` transitions (currently instant).
- Wire the "Learn More" links to real content or a modal.
- Build out Step 2–4 product grids if additional design comps become available.
