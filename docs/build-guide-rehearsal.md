# Rehearsal Day Build Guide

**Beyond Theme Settings: The Metaobject Configuration Layer**

Goal today: enough working infrastructure to walk the Shopify team through the demo sequence. Not every surface has to be production-ready. The live edit moment on the theme is the only thing that must actually work end-to-end.

---

## Priority Order

| Phase | What | Time | Blocker? |
|---|---|---|---|
| 1 | Referenced metaobjects (tasting_note, brewing_method) | 30-45 min | Yes |
| 2 | coffee_configuration metaobject + product metafield | 30 min | Yes |
| 3 | Theme rendering (Liquid snippet) | 60-90 min | Yes |
| 4 | JSON-LD block | 15-20 min | No, but cheap |
| 5 | Metaobject page verification | 5 min | No |
| 6 | Storefront API query (fake headless) | 30 min | No |
| 7 | Flow workflow or screenshot | 15 min | No, screenshot fine |
| 8 | Checkout extension | Skip today | Screenshot for talk |

**If time runs out, cut in this order:** checkout extension, Flow (screenshot only), Storefront API app (GraphiQL screenshot only), metaobject page. Never cut theme rendering.

**The one thing that must work:** edit a field in the admin, refresh the product page, see the change propagate. That is the demo.

---

## Phase 1: Referenced Metaobjects

Build these first because coffee_configuration references them.

### `tasting_note` metaobject definition

Admin → Content → Metaobjects → Add definition

- **Name:** Tasting Note
- **Type:** `tasting_note`
- **Access:** Storefronts (enabled)
- **Fields:**
  - `name` - Single line text - Required
  - `icon` - Single line text - (holds an emoji character, way faster than file uploads today)
  - `color` - Single line text - (hex code like `#F59E0B`)
  - `description` - Multi-line text - Optional

### Seed 5 tasting_note entries

| Name | Icon | Color |
|---|---|---|
| Citrus | 🍊 | #F59E0B |
| Chocolate | 🍫 | #78350F |
| Floral | 🌸 | #EC4899 |
| Berry | 🫐 | #7C3AED |
| Nutty | 🌰 | #B45309 |

Add a brief description on each. Something like "Bright citrus notes reminiscent of orange peel and grapefruit."

### `brewing_method` metaobject definition

- **Name:** Brewing Method
- **Type:** `brewing_method`
- **Access:** Storefronts (enabled)
- **Fields:**
  - `name` - Single line text - Required
  - `icon` - Single line text - (emoji)
  - `brew_time` - Single line text - (e.g., "3-4 min")
  - `description` - Multi-line text

### Seed 4 brewing_method entries

| Name | Icon | Brew Time |
|---|---|---|
| Espresso | ☕ | 25-30 sec |
| Pour-over | 💧 | 3-4 min |
| French Press | 🫖 | 4 min |
| Cold Brew | 🧊 | 12-24 hrs |

Add short descriptions on each.

### Verification

- Both definitions saved
- All entries visible in Content → Metaobjects
- Each entry has a stable ID (visible in URL)

---

## Phase 2: coffee_configuration + Product Metafield

### `coffee_configuration` metaobject definition

Admin → Content → Metaobjects → Add definition

- **Name:** Coffee Configuration
- **Type:** `coffee_configuration`
- **Access:** Storefronts (enabled)
- **Fields:**
  - `roast_level` - Single line text - Allowed values: `Light`, `Medium-Light`, `Medium`, `Medium-Dark`, `Dark`
  - `tasting_notes` - Metaobject reference (list) → Tasting Note
  - `brewing_methods` - Metaobject reference (list) → Brewing Method
  - `processing_method` - Single line text - Allowed values: `Washed`, `Natural`, `Honey`, `Anaerobic`
  - `bag_type` - Single line text - Allowed values: `Resealable pouch`, `Valve bag`, `Tin`
  - `origin` - Single line text

Allowed values on the scalar fields give the merchant editor a nicer UX (dropdown vs free text) and tighten the schema. Takes 2 extra minutes to set up per field. Worth it for demo credibility.

### Product metafield definition (the CONNECTION)

**This is the metafield the Connection slide is about. It has to exist for the demo to work.**

Admin → Settings → Custom data → Products → Add definition

- **Name:** Coffee Configuration
- **Namespace and key:** `custom.coffee_configuration`
- **Type:** Metaobject reference (single) → Coffee Configuration
- **Access:** Storefronts (enabled)

### Create one coffee_configuration entry

Content → Metaobjects → Coffee Configuration → Add entry

- **roast_level:** Medium-Dark
- **tasting_notes:** [Citrus, Chocolate]
- **brewing_methods:** [Pour-over, Espresso]
- **processing_method:** Washed
- **bag_type:** Valve bag
- **origin:** Yirgacheffe, Ethiopia

Give it a display name like "Reserve Roast" so it's easy to find.

### Create one coffee product

Admin → Products → Add product

- **Title:** Reserve Roast (or whatever fits the demo store)
- **Description:** Anything reasonable
- **Coffee Configuration metafield:** Select the "Reserve Roast" entry you just created

This one product is enough for demo. Don't seed a catalog.

### Verification

- Metaobject definition saved with 6 fields
- Product metafield definition saved (`custom.coffee_configuration`)
- One coffee_configuration entry exists
- Product has the metafield populated and pointing at that entry

---

## Phase 3: Theme Rendering

Use Dawn or any theme where you can freely edit files. Duplicate first so you don't affect anything live.

### Snippet file: `snippets/coffee-configuration.liquid`

```liquid
{%- liquid
  assign config = product.metafields.custom.coffee_configuration.value
-%}

{%- if config -%}
<div class="coffee-config">
  <div class="coffee-config__grid">
    <div class="coffee-config__cell">
      <span class="coffee-config__label">Roast Level</span>
      <span class="coffee-config__value">{{ config.roast_level }}</span>
    </div>

    <div class="coffee-config__cell">
      <span class="coffee-config__label">Origin</span>
      <span class="coffee-config__value">{{ config.origin }}</span>
    </div>

    <div class="coffee-config__cell">
      <span class="coffee-config__label">Processing</span>
      <span class="coffee-config__value">{{ config.processing_method }}</span>
    </div>

    <div class="coffee-config__cell">
      <span class="coffee-config__label">Packaging</span>
      <span class="coffee-config__value">{{ config.bag_type }}</span>
    </div>
  </div>

  {%- assign notes = config.tasting_notes.value -%}
  {%- if notes.size > 0 -%}
    <div class="coffee-config__section">
      <h3 class="coffee-config__heading">Tasting Notes</h3>
      <div class="coffee-config__badges">
        {%- for note in notes -%}
          <span class="coffee-config__badge" style="background-color: {{ note.color }}20; border-color: {{ note.color }};">
            <span class="coffee-config__badge-icon">{{ note.icon }}</span>
            <span class="coffee-config__badge-name">{{ note.name }}</span>
          </span>
        {%- endfor -%}
      </div>
    </div>
  {%- endif -%}

  {%- assign methods = config.brewing_methods.value -%}
  {%- if methods.size > 0 -%}
    <div class="coffee-config__section">
      <h3 class="coffee-config__heading">Recommended Brewing</h3>
      <div class="coffee-config__methods">
        {%- for method in methods -%}
          <div class="coffee-config__method">
            <div class="coffee-config__method-header">
              <span class="coffee-config__method-icon">{{ method.icon }}</span>
              <strong class="coffee-config__method-name">{{ method.name }}</strong>
              <span class="coffee-config__method-time">{{ method.brew_time }}</span>
            </div>
            {%- if method.description != blank -%}
              <p class="coffee-config__method-description">{{ method.description }}</p>
            {%- endif -%}
          </div>
        {%- endfor -%}
      </div>
    </div>
  {%- endif -%}
</div>
{%- endif -%}
```

### Include the snippet in the product template

In `sections/main-product.liquid` (or wherever your theme renders product blocks), add:

```liquid
{% render 'coffee-configuration' %}
```

Drop it wherever it makes visual sense on the product page. Below the buy button is a safe default.

### Minimal styling

Add to `assets/coffee-configuration.css` and load it, or inline in the snippet with `<style>` tags for speed:

```css
.coffee-config {
  padding: 24px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  margin-top: 24px;
}

.coffee-config__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.coffee-config__cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.coffee-config__label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #666;
}

.coffee-config__value {
  font-size: 16px;
  font-weight: 600;
}

.coffee-config__section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.coffee-config__heading {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.coffee-config__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.coffee-config__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid;
  font-size: 14px;
}

.coffee-config__methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.coffee-config__method {
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
}

.coffee-config__method-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.coffee-config__method-time {
  margin-left: auto;
  font-size: 13px;
  color: #666;
}

.coffee-config__method-description {
  font-size: 14px;
  color: #444;
  margin: 4px 0 0 0;
}
```

### Verification

- Product page renders the config block
- Roast level, origin, processing, bag type all show
- Tasting note badges show with icons and colors
- Brewing methods show with icons, names, times

### The critical test: live edit

1. Open the product page in one browser tab
2. Open the coffee_configuration entry in admin in another tab
3. Change `roast_level` from Medium-Dark to Dark
4. Refresh the product page
5. Confirm the change appears

**If this works end-to-end, the demo works.** Everything after this is bonus.

---

## Phase 4: JSON-LD Structured Data

Add to `sections/main-product.liquid` inside a `<script>` tag at the bottom of the product content, or in the theme's structured data snippet if it has one:

```liquid
{%- assign config = product.metafields.custom.coffee_configuration.value -%}
{%- if config -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": {{ product.title | json }},
  "description": {{ product.description | strip_html | json }},
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Roast level", "value": {{ config.roast_level | json }} },
    { "@type": "PropertyValue", "name": "Origin", "value": {{ config.origin | json }} },
    { "@type": "PropertyValue", "name": "Processing method", "value": {{ config.processing_method | json }} },
    { "@type": "PropertyValue", "name": "Packaging", "value": {{ config.bag_type | json }} }
    {%- assign notes = config.tasting_notes.value -%}
    {%- if notes.size > 0 %},
    {
      "@type": "PropertyValue",
      "name": "Tasting notes",
      "value": {{ notes | map: 'name' | join: ', ' | json }}
    }
    {%- endif -%}
  ]
}
</script>
{%- endif -%}
```

### Verification

- View source on the product page
- Confirm the JSON-LD block appears
- Copy the JSON and paste into Google's Rich Results Test if you want to fully validate

For the demo, just showing view source with the block visible is enough.

---

## Phase 5: Metaobject Page

Shopify auto-generates a page for published metaobjects at `/pages/{type_handle}/{entry_handle}`. For the coffee_configuration entry, the URL will be something like `/pages/coffee_configuration/reserve-roast`.

### Verification

- Navigate to the metaobject entry URL
- Confirm it renders (even the default template is fine)
- If you want a nicer template, create `templates/metaobject.coffee_configuration.json` and add sections. Skip for today if time is tight.

Screenshot this URL for the demo. Live loading during the talk is fine but a screenshot is a solid backup.

---

## Phase 6: Storefront API (Headless Fake)

The fastest path today: use Shopify's GraphiQL app (or your Storefront API dashboard) to run the query, screenshot the query and response, and use that in the demo.

### The GraphQL query

```graphql
query GetCoffeeProduct($handle: String!) {
  product(handle: $handle) {
    id
    title
    handle
    metafield(namespace: "custom", key: "coffee_configuration") {
      reference {
        ... on Metaobject {
          roastLevel: field(key: "roast_level") { value }
          origin: field(key: "origin") { value }
          processingMethod: field(key: "processing_method") { value }
          bagType: field(key: "bag_type") { value }
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
          brewingMethods: field(key: "brewing_methods") {
            references(first: 10) {
              nodes {
                ... on Metaobject {
                  name: field(key: "name") { value }
                  icon: field(key: "icon") { value }
                  brewTime: field(key: "brew_time") { value }
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

Variables:
```json
{ "handle": "reserve-roast" }
```

### Verification

- Query runs successfully
- Response includes all six top-level fields plus nested tasting_notes and brewing_methods
- Screenshot the query and the response side-by-side

**Note on Storefront API syntax:** double-check the exact field-access syntax against current Shopify docs. The metaobject fields API has evolved over time and the reference/references access pattern may need minor tweaks. If GraphiQL flags a syntax issue, the fix is usually renaming `field(key:)` or adjusting the fragment shape. This won't take long.

### Bonus: minimal HTML page

If you want a rendered "headless" demo (better than a screenshot):

```html
<!DOCTYPE html>
<html>
<head>
  <title>Reserve Roast · Coffee Guide</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 40px auto; padding: 0 20px; }
    .badge { display: inline-block; padding: 6px 12px; border-radius: 999px; margin-right: 6px; font-size: 14px; border: 1px solid; }
    .method { padding: 12px; background: #fafafa; border-radius: 6px; margin-bottom: 8px; }
  </style>
</head>
<body>
  <h1 id="title"></h1>
  <p><strong>Origin:</strong> <span id="origin"></span></p>
  <p><strong>Roast:</strong> <span id="roast"></span></p>
  <h3>Tasting Notes</h3>
  <div id="notes"></div>
  <h3>Brewing Methods</h3>
  <div id="methods"></div>

  <script>
    const SHOP_DOMAIN = 'your-store.myshopify.com';
    const TOKEN = 'your-storefront-api-token';
    const QUERY = `... paste the query above ...`;

    fetch(`https://${SHOP_DOMAIN}/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': TOKEN
      },
      body: JSON.stringify({ query: QUERY, variables: { handle: 'reserve-roast' } })
    })
    .then(r => r.json())
    .then(data => {
      const p = data.data.product;
      const cfg = p.metafield.reference;
      document.getElementById('title').textContent = p.title;
      document.getElementById('origin').textContent = cfg.origin.value;
      document.getElementById('roast').textContent = cfg.roastLevel.value;

      cfg.tastingNotes.references.nodes.forEach(n => {
        const el = document.createElement('span');
        el.className = 'badge';
        el.style.borderColor = n.color.value;
        el.style.backgroundColor = n.color.value + '20';
        el.textContent = `${n.icon.value} ${n.name.value}`;
        document.getElementById('notes').appendChild(el);
      });

      cfg.brewingMethods.references.nodes.forEach(m => {
        const el = document.createElement('div');
        el.className = 'method';
        el.innerHTML = `<strong>${m.icon.value} ${m.name.value}</strong> · ${m.brewTime.value}`;
        document.getElementById('methods').appendChild(el);
      });
    });
  </script>
</body>
</html>
```

Save as `.html`, open in browser. Non-Shopify domain in the URL bar sells the story. Get a Storefront API token from Shopify → Settings → Apps → Develop apps → Create an app → Configure Storefront API scopes.

Skip this today if you're time-crunched. Do it before July 22.

---

## Phase 7: Shopify Flow

If Flow is enabled on the dev store:

1. Flow → Create workflow
2. Trigger: Order created
3. Add a step: Check condition
4. Condition: `Order line items → Product → coffee_configuration → brewing_methods` contains a specific method
5. Action: Add tag to order (e.g., `brewing-guide-espresso`)

If Flow isn't enabled or you're tight on time, take a mockup screenshot instead. The talk's Flow slide shows a workflow diagram, not a live Flow session, so a screenshot is honest.

### Verification

- Screenshot of the Flow builder ready for the deck
- Or workflow saved and enabled if you built it real

---

## Phase 8: Checkout Extension

**Skip today.** Screenshot for the deck is enough for the talk itself. Building a real UI extension is worth 4-6 hours of work and adds nothing the audience can't get from a mockup.

If you want to build it before July 22, use Shopify's UI extension CLI to scaffold a checkout extension that queries the coffee_configuration via the checkout API and renders a compact block. But that's a next-week project.

---

## Post-Rehearsal Checklist

Before you present to Shopify today:

- [ ] All three metaobject definitions saved
- [ ] Referenced metaobject entries seeded (5 tasting notes, 4 brewing methods)
- [ ] Product metafield definition exists on Product
- [ ] One coffee product created with metafield populated
- [ ] Theme snippet added and rendering on product page
- [ ] Live edit test passed (edit admin field, refresh page, see change)
- [ ] JSON-LD block visible in view source
- [ ] Metaobject page URL confirmed working
- [ ] Storefront API query saved and tested in GraphiQL
- [ ] Flow screenshot ready OR workflow built
- [ ] Checkout extension mockup ready (or noted as post-rehearsal)

### For the rehearsal conversation

Tell the Shopify team upfront which surfaces are real and which are placeholder. They'll appreciate the honesty and it lets them give better feedback on framing without getting distracted by "wait, is that real?"