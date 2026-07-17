# Fieldnote Roasters

**One metaobject, every surface.** The companion repo for *Beyond Theme Settings: The Metaobject Configuration Layer* — a partner talk at Shopify's DotDev 2026 by [Taylor Page](https://thepagesmedia.com).

<p>
  <a href="https://fieldnote-roasters.netlify.app"><img src="https://img.shields.io/badge/live_demo-fieldnote--roasters.netlify.app-A0522D" alt="Live demo"></a>
  <a href="./LICENSE.md"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License"></a>
  <a href="https://www.netlify.com"><img src="https://www.netlify.com/assets/badges/netlify-badge-color-accent.svg" alt="Deploys by Netlify" height="28"></a>
</p>

> ☕ **Fieldnote Roasters is a fictional coffee brand.** There are no beans. The brand, the catalog, and the store exist only to demo what Shopify metaobjects can do.

## What this is

Most themes bury merchandising data in theme settings, where it's locked to one theme and one surface. This demo makes the opposite argument: model your domain (a coffee, its origin, its tasting notes, how to brew it) as **metaobjects**, connect them to products with a single metafield, and every surface — Liquid storefront, auto-generated metaobject pages, structured data, Flow, and fully headless pages — reads from the same source of truth.

The demo store models one `coffee_configuration` metaobject per coffee, referencing `tasting_note` and `brewing_method` metaobjects, connected to products via a `custom.coffee_configuration` metafield. Change a roast level once in admin and watch it propagate everywhere.

**Pick a door at the demo hub → [fieldnote-roasters.netlify.app](https://fieldnote-roasters.netlify.app)**

| Surface | Where |
| --- | --- |
| The full storefront (Liquid theme) | [fieldnote-roasters-demo.myshopify.com](https://fieldnote-roasters-demo.myshopify.com) — password `metaobjects` |
| Product page rendering the metaobject | [/products/reserve-roast](https://fieldnote-roasters-demo.myshopify.com/products/reserve-roast) |
| Auto-generated metaobject pages | [/pages/coffee/reserve-roast](https://fieldnote-roasters-demo.myshopify.com/pages/coffee/reserve-roast) |
| Headless coffee guide (outside Shopify) | [fieldnote-roasters.netlify.app/coffee-guide](https://fieldnote-roasters.netlify.app/coffee-guide/) |
| Slides from the talk | [/slides.pdf](https://fieldnote-roasters.netlify.app/slides.pdf) |

## The headless part is one file

The [coffee guide](./demo/headless/coffee-guide/index.html) is the whole point made small: plain HTML, no framework, no build step — one `fetch` to the Storefront API pulling the same metaobject the theme renders. The query traverses product → metafield → metaobject → referenced metaobjects in a single request:

```graphql
query GetCoffeeProduct($handle: String!) {
  product(handle: $handle) {
    title
    metafield(namespace: "custom", key: "coffee_configuration") {
      reference {
        ... on Metaobject {
          roastLevel: field(key: "roast_level") { value }
          origin: field(key: "origin") { value }
          tastingNotes: field(key: "tasting_notes") {
            references(first: 10) {
              nodes {
                ... on Metaobject {
                  name: field(key: "name") { value }
                  icon: field(key: "icon") { value }
                  color: field(key: "color") { value }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

That's the pitch: the data model does the heavy lifting, so every consumer — Liquid or headless — gets simpler.

## How it was built

This was treated as a greenfield project from day one, with AI in the loop at every step:

1. **Design spec first.** A written brand/design spec for a fictional single-origin coffee company — voice ("observation over ornament"), palette (Paper `#F4EDDF`, Espresso `#2A1E16`, Clay `#A0522D`), type (Zilla Slab + Work Sans).
2. **Claude designed the brand.** The spec went to Claude to build out the full brand identity — wordmark, bag design, photography direction, and storefront mockups for a coffee brand that does not exist.
3. **Claude Code built the store.** Back in the terminal, Claude Code took Shopify's [Skeleton theme](https://github.com/Shopify/skeleton-theme) as the starting point and built the theme out against the brand spec — sections, blocks, snippets, and the metaobject rendering — following Skeleton's conventions (`{% schema %}`, `{% stylesheet %}`, LiquidDoc headers).
4. **Modeled the data in admin.** Metaobject definitions (`coffee_configuration`, `tasting_note`, `brewing_method`), the `custom.coffee_configuration` product metafield connection, and a small demo catalog. The step-by-step build is documented in [docs/build-guide-rehearsal.md](./docs/build-guide-rehearsal.md).
5. **Netlify for everything outside Shopify.** The demo hub and headless coffee guide are static files in [`demo/headless/`](./demo/headless/). [`netlify.toml`](./netlify.toml) points Netlify's publish directory straight at that folder — no build step, and any push to `main` that touches the demo redeploys it automatically (everything else, like theme-editor sync commits, is skipped).

## Repo tour

```
.
├── assets/          # critical.css (design tokens), self-hosted fonts, static assets
├── blocks/          # Reusable theme blocks
├── config/          # Theme settings schema + data
├── demo/headless/   # The Netlify site: demo hub + headless coffee guide
├── docs/            # Build guide, catalog notes, admin punch list
├── layout/          # theme.liquid
├── locales/         # Translations
├── sections/        # Hero, product, collection, footer, etc.
├── snippets/        # product-card, css-variables, image, meta-tags
├── templates/       # JSON templates
└── netlify.toml     # Publishes demo/headless, skips non-demo commits
```

## Run it locally

The theme half needs the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli):

```bash
shopify theme dev
```

The headless half needs nothing — open `demo/headless/index.html` in a browser, or serve the folder with any static server. The coffee guide accepts `?token=` and `?handle=` query params if you want to point it at your own store's Storefront API.

## Credits

- Built on Shopify's [Skeleton theme](https://github.com/Shopify/skeleton-theme) (MIT).
- Brand identity designed with Claude; theme and demo built with [Claude Code](https://claude.com/claude-code).
- Hosted on [Netlify](https://www.netlify.com).
- More from Taylor at [shopdevalliance.com](https://shopdevalliance.com) · [thepagesmedia.com](https://thepagesmedia.com).

Open-sourced under the [MIT license](./LICENSE.md).
