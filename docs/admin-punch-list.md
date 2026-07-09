# Admin Punch List — Rehearsal Day

Everything below happens in the Shopify admin. The theme side (build guide Phases 3 & 4) is **already done** — the PDP reads `custom.coffee_configuration` metaobject-first, renders tasting-note pills (icon + color tint), a "Recommended brewing" section, the Process/Altitude/Harvest/Packaging fact grid, and emits the JSON-LD block. Flat `custom.*` metafields work as a fallback, so nothing breaks while you're mid-setup.

**The live-edit demo path:** edit the "Reserve Roast" coffee_configuration entry → refresh the PDP → change appears. Ready as soon as items 1–5 below exist.

---

## 1. Metaobject definitions — Content → Metaobjects → Add definition

| # | Definition | Type handle | Fields | Notes |
|---|---|---|---|---|
| ☐ 1a | Tasting Note | `tasting_note` | `name` (single line, required) · `icon` (single line, emoji, optional) · `color` (**color** type — swatch picker in admin, not single-line hex) · `description` (multi-line) | Enable **Storefronts** access |
| ☐ 1b | Brewing Method | `brewing_method` | `name` (single line, required) · `icon` (single line, emoji) · `brew_time` (single line) · `description` (multi-line) | Enable **Storefronts** access |
| ☐ 1c | Coffee Configuration | `coffee_configuration` | `name` (single line, required — **set as the display name field**; admin-only reference so entries read "Reserve Roast" in pickers instead of an auto-handle; theme never renders it) · `roast_level` (single line, allowed values: Light / Medium-Light / Medium / Medium-Dark / Dark) · `tasting_notes` (metaobject ref **list** → Tasting Note) · `brewing_methods` (metaobject ref **list** → Brewing Method) · `processing_method` (single line, allowed: Washed / Natural / Honey / Anaerobic) · `bag_type` (single line, allowed: Resealable pouch / Valve bag / Tin) · `origin` (single line) | Enable **Storefronts** access **and the "Web pages" capability** (needed for the Phase 5 auto page at `/pages/coffee_configuration/…`) |

> **⚠️ Two fields to ADD beyond your guide:** `altitude` (single line, e.g. "1,900 m") and `harvest` (single line, e.g. "2025"). The brand-spec PDP fact grid is Process · Altitude · Harvest (+ Packaging). The theme reads `coffee_config.altitude` / `coffee_config.harvest` — without them those cells simply don't render, but the page looks better (and the live-edit demo has more to show) with them.

## 2. Tasting Note entries (5 from guide + 3 brand-accurate)

| # | Name | Icon | Color |
|---|---|---|---|
| ☐ | Citrus | 🍊 | #F59E0B |
| ☐ | Chocolate | 🍫 | #78350F |
| ☐ | Floral | 🌸 | #EC4899 |
| ☐ | Berry | 🫐 | #7C3AED |
| ☐ | Nutty | 🌰 | #B45309 |
| ☐ | Bergamot | 🍋 | #C9A24A |
| ☐ | Stone Fruit | 🍑 | #C4633C |
| ☐ | Black Tea | 🍂 | #8f4227 |

> **⚠️ Brand mismatch in the guide:** it seeds Reserve Roast with [Citrus, Chocolate], but the bag design and catalog say **Bergamot · Stone Fruit · Black Tea**. The last three entries fix that. (Theme renders the colors as a subtle border/background tint, so the guide's bright hexes won't fight the palette either way.) Add a one-line description on each.

## 2b. Standard taxonomy flavors (the interop layer — do alongside §2, not instead)

| # | Item | Detail |
|---|---|---|
| ☐ | Set product category | Each coffee product → taxonomy category **Coffee** (product details page). This surfaces the category metafields, including Flavor |
| ☐ | Populate `shopify.flavor` | On Reserve Roast, pick/create flavor entries (taxonomy has defaults; you can add custom entries like "Bergamot" — entries are editable, the definition's *fields* are not) |
| ☐ | Test (your open question) | Try adding a metaobject-reference field on a custom definition targeting `shopify--flavor`. Undocumented either way — if the picker offers it, great, link tasting_note → flavor for the canonical-mapping story; if not, product-level `shopify.flavor` still carries the interop demo |

**Why both:** `shopify--flavor` entries only expose `label` + `taxonomy_reference` in Liquid (taxonomy_reference is an unresolvable GID), the definition is read-only (no icon/color/description can ever be added), and category metafields attach to *products*, not to your metaobject. So standard flavors can't replace `tasting_note` — but they're the discoverability/canonical layer (Shop, marketplaces, search engines). The theme now renders tasting notes with this priority: **custom tasting_note metaobjects → standard `shopify.flavor` labels → flat text metafield**, so either layer works alone and the talk can show both.

## 3. Brewing Method entries (4)

| # | Name | Icon | Brew time |
|---|---|---|---|
| ☐ | Espresso | ☕ | 25–30 sec |
| ☐ | Pour-over | 💧 | 3–4 min |
| ☐ | French Press | 🫖 | 4 min |
| ☐ | Cold Brew | 🧊 | 12–24 hrs |

Short description on each — these render on the PDP under "Recommended brewing."

## 4. Product metafield definition (the CONNECTION) — Settings → Custom data → Products

| # | Item | Value |
|---|---|---|
| ☐ | Name | Coffee Configuration |
| ☐ | Namespace & key | `custom.coffee_configuration` — **exactly this**; it's what the theme reads |
| ☐ | Type | Metaobject reference (**single**) → Coffee Configuration |
| ☐ | Access | Storefronts enabled |

The flat metafields (`custom.origin`, `custom.process`, etc.) are now **optional fallbacks** — skip creating them unless you want to demo the contrast. One exception worth keeping: `custom.subtitle` (single line text) drives the italic line under the PDP title ("Medium-dark, whole bean"); it's not part of the metaobject.

## 5. Coffee Configuration entry — "Reserve Roast"

| # | Field | Value |
|---|---|---|
| ☐ | Display name | Reserve Roast |
| ☐ | roast_level | Medium-Dark |
| ☐ | tasting_notes | Bergamot, Stone Fruit, Black Tea (guide said Citrus + Chocolate — see §2 note) |
| ☐ | brewing_methods | Pour-over, Espresso |
| ☐ | processing_method | Washed |
| ☐ | bag_type | Valve bag |
| ☐ | origin | Ethiopia · Yirgacheffe |
| ☐ | altitude | 1,900 m |
| ☐ | harvest | 2025 |

## 6. Products — Reserve Roast is the blocker; the rest make the store look real

| # | Product | Price | Origin line | Notes |
|---|---|---|---|---|
| ☐ | **Reserve Roast** | $22 | Ethiopia Yirgacheffe | Link `custom.coffee_configuration` → Reserve Roast entry. Tag `new` (clay badge). Subtitle metafield: "Medium-dark, whole bean" |
| ☐ | Understory | $20 | Guatemala Huehuetenango | Cocoa, cherry, brown sugar |
| ☐ | Meridian | $19 | Colombia Huila | Caramel, red apple, cocoa |
| ☐ | Nightjar | $21 | Peru Cajamarca | Dark chocolate, walnut, plum |
| ☐ | First Frost | $23 | Kenya Nyeri | Blackcurrant, grapefruit, cane sugar |
| ☐ | Field Blend | $17 | House blend | Milk chocolate, hazelnut, orange |

Per product, also:
- ☐ **Variants** — option "Grind": Whole Bean / Filter / Espresso (drives the PDP pill picker; without it the picker hides, which is fine but less demo)
- ☐ **Images** — at least Reserve Roast needs 2+ (thumbnail gallery hides with one image)
- ☐ Guide says one product is enough — true for the demo, but home shows 3 cards and "From the same table" needs ≥2 products sharing a collection. **4 products is the realistic minimum.**

## 7. Collection & navigation

| # | Item | Detail |
|---|---|---|
| ☐ | Collection "Single Origins" | Add all coffee products; a short description renders under the collection title |
| ☐ | Header menu (Navigation) | Coffee · Single Origins · Subscriptions · About — assign in theme editor → Header |
| ☐ | Footer menu 1 "Shop" | Single Origins · Subscriptions · Equipment · Gift Cards |
| ☐ | Footer menu 2 "Company" | About · Sourcing · Wholesale · Contact |

## 8. Theme editor picks (Online Store → Customize)

| # | Where | What |
|---|---|---|
| ☐ | Home → Featured collection | Pick "Single Origins" |
| ☐ | Home → Hero | Upload image (warm pour/origin shot per photo direction); placeholder shows until then |
| ☐ | Home → Editorial band | Upload field/farm image |
| ☐ | Header | Assign menu; monogram defaults to "FR" |
| ☐ | Footer | Assign both menus |

## 9. Later phases (per guide priority — all optional today)

| # | Phase | Status |
|---|---|---|
| ☐ | 5 — Metaobject page | Just verify `/pages/coffee_configuration/reserve-roast` loads (needs Web pages capability from §1c) |
| ☐ | 6 — Storefront API | Run guide query in GraphiQL, screenshot. Needs a custom app w/ Storefront API token |
| ☐ | 7 — Flow | Build or screenshot |
| ☐ | 8 — Checkout extension | Skip today (screenshot for deck) |

---

### Gap check: guide vs. what's built (theme side — done, no action)

| Guide item | Status |
|---|---|
| Phase 3 snippet `coffee-configuration.liquid` on Dawn | Superseded — rendering is native to `sections/product.liquid` in the Fieldnote theme (metaobject-first + flat fallback), styled to brand |
| Phase 3 live-edit test | Theme-ready; needs §1–5 data to run |
| Phase 4 JSON-LD | Done — emits when a coffee_configuration is linked; verify via view-source |
| Tasting note colors | Rendered as subtle tints (brand has one accent; bright badge fills would fight it) |
| Brewing methods | Rendered as "Recommended brewing" rows on PDP (icon · name · time · description) |
