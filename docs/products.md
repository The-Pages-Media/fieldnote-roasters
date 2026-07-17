# Fieldnote Roasters — Products & Photography Brief

Fictional brand · DotDev 2026 demo. Six single-origin products + one blend.
Palette: Paper `#F4EDDF` · Espresso `#2A1E16` · Clay `#A0522D`. Type: Zilla Slab (display) / Work Sans (body).

---

## Global photography direction

Feed this at the top of **every** image prompt so the set stays coherent.

- **Mood:** observational, editorial, quietly premium. The camera documents; it does not stage.
- **Light:** soft natural daylight, single directional source, gentle shadows. Warm white balance.
- **Surfaces:** kraft paper, unbleached linen, unfinished pale wood, matte ceramic, plaster. No glossy surfaces.
- **Palette in frame:** warm neutrals + espresso browns; let the clay bag accent be the only pop of color.
- **Composition:** generous negative space, off-center subject, room for a headline. Shallow-to-medium depth of field.
- **Bag:** matte kraft coffee bag, black tin-tie fold seal, small circular "FR" monogram, minimal front label. Espresso text + one clay accent line.
- **Avoid:** hard studio light, glossy reflections, saturated grading, steam swirls, latte art, burlap sacks, vintage scales, chalkboards, busy backgrounds, cool/clinical white balance.
- **Aspect ratios:** PDP main `1:1`, product card `4:5`, hero `16:9` or `3:2`.

**Per product, generate:** (1) bag front on surface — card/PDP hero, (2) bag angled / lifestyle context, (3) loose beans or brewed detail macro.

---

## The lineup

### 1. Reserve Roast  *(the demo hero product)*
- **Origin:** Ethiopia — Yirgacheffe
- **Process:** Washed · **Roast:** Medium-Dark · **Altitude:** 1,900 m · **Harvest:** 2025
- **Notes:** Bergamot · Stone fruit · Black tea
- **Price:** $22 · **Size:** 340 g / 12 oz whole bean
- **Description:** A washed Yirgacheffe from smallholder farms above 1,900 metres. Delicate and tea-like, with bergamot lift and a stone-fruit sweetness that holds through the finish.
- **Photo prompt:** *[global direction] A matte kraft coffee bag with a black tin-tie seal and minimal espresso-brown label reading "Reserve Roast", standing on a pale unfinished wood table in soft morning light, warm neutral plaster wall behind, generous negative space to the left, a few loose coffee beans scattered near the base, editorial documentary style, shallow depth of field, warm white balance.*

### 2. Understory
- **Origin:** Guatemala — Huehuetenango
- **Process:** Washed · **Roast:** Medium · **Altitude:** 1,650 m
- **Notes:** Cocoa · Cherry · Brown sugar
- **Price:** $20 · **Size:** 340 g / 12 oz
- **Description:** A rounded, comforting cup from the highlands of Huehuetenango — cocoa and dark cherry over a brown-sugar base.
- **Photo prompt:** *[global direction] The same matte kraft "Understory" bag on unbleached linen, soft side light, a ceramic pour-over dripper just out of focus behind it, warm shadows, lots of negative space above for a headline.*

### 3. Meridian
- **Origin:** Colombia — Huila
- **Process:** Honey · **Roast:** Medium · **Altitude:** 1,750 m
- **Notes:** Caramel · Red apple · Cocoa
- **Price:** $19 · **Size:** 340 g / 12 oz
- **Description:** A honey-processed Huila with caramel weight and a crisp red-apple acidity. An everyday cup that rewards attention.
- **Photo prompt:** *[global direction] "Meridian" kraft bag standing on a pale plaster ledge, single window light from the right casting a long soft shadow, warm neutral background, minimal props, editorial calm.*

### 4. Nightjar
- **Origin:** Peru — Cajamarca
- **Process:** Washed · **Roast:** Medium-Dark · **Altitude:** 1,800 m
- **Notes:** Dark chocolate · Walnut · Plum
- **Price:** $21 · **Size:** 340 g / 12 oz
- **Description:** Deeper and more grounding — dark chocolate and walnut with a plummy sweetness underneath. Built for espresso and slow mornings.
- **Photo prompt:** *[global direction] "Nightjar" kraft bag on dark unfinished wood, moodier low-key daylight, warm shadows, a small espresso cup with dark crema beside it slightly out of focus, documentary style, still restrained and premium.*

### 5. First Frost
- **Origin:** Kenya — Nyeri
- **Process:** Washed · **Roast:** Light-Medium · **Altitude:** 1,900 m
- **Notes:** Blackcurrant · Grapefruit · Cane sugar
- **Price:** $23 · **Size:** 340 g / 12 oz
- **Description:** Bright and structured — blackcurrant and grapefruit with a clean cane-sugar finish. The most vivid cup on the table.
- **Photo prompt:** *[global direction] "First Frost" kraft bag on a bright, airy pale-linen surface, cool-leaning but still warm daylight, crisp clean shadows, a scattering of light-roast whole beans, high negative space, fresh and lively feel.*

### 6. Field Blend  *(house blend)*
- **Origin:** Blend — Latin America (rotating)
- **Process:** Washed · **Roast:** Medium · **Altitude:** Various
- **Notes:** Milk chocolate · Hazelnut · Orange
- **Price:** $17 · **Size:** 340 g / 12 oz
- **Description:** The everyday pour — milk chocolate and hazelnut with a soft orange lift. Approachable, balanced, always in stock.
- **Photo prompt:** *[global direction] "Field Blend" kraft bag in a relaxed kitchen-counter setting, warm daylight, a stovetop moka pot and a plain ceramic mug softly out of focus behind, lived-in but tidy, editorial documentary style.*

---

## Optional add-ons (only if the demo needs cart variety)

- **Subscription** — "The Fieldnote" · rotating single origin, ships monthly · from $18/mo
- **Equipment** — ceramic pour-over dripper, paper filters (100), enamel scoop
- **Gift set** — three 200 g origins in a kraft box + tasting-note card

---

## Shopify field mapping (for Claude Code)

Reuse this structure for each product so metafields line up:

- **Title** → product name
- **Vendor** → Fieldnote Roasters
- **Product type** → Single Origin / Blend
- **Variants** → Grind: `Whole Bean` (default) · `Filter` · `Espresso`
- **Tags** → origin country, process, roast level
- **Metafields (custom):** `origin`, `region`, `process`, `roast_level`, `altitude`, `harvest_year`, `tasting_notes` (list)
- **Images** → 3 per product (front / context / detail), named `handle-front`, `handle-context`, `handle-detail`

---

## Homepage hero images

- **Hero A (default):** wide 3:2 pour shot, warm light, empty left third for the headline. Prompt with global direction + *"barista pouring a slow stream into a ceramic cup, overhead-ish angle, kraft bag of Reserve Roast in soft focus nearby."*
- **Hero B (origin drop):** wide 16:9 field/farm image — drying beds or hillside, matter-of-fact, room lower-left for reversed white type over a soft dark scrim.
