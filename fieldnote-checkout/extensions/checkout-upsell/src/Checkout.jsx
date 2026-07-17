import '@shopify/ui-extensions/preact';
import {render} from 'preact';
import {useEffect, useState} from 'preact/hooks';

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const {heading, offer_variant: variantId} = shopify.settings.value;
  const [offer, setOffer] = useState(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!variantId) return;
    shopify
      .query(
        `query ($id: ID!) {
          node(id: $id) {
            ... on ProductVariant {
              id
              price { amount currencyCode }
              image { url altText }
              product {
                title
                featuredImage { url altText }
                config: metafield(namespace: "custom", key: "coffee_configuration") {
                  reference {
                    ... on Metaobject {
                      origin: field(key: "origin") { value }
                      notes: field(key: "tasting_notes") { value }
                    }
                  }
                }
                subtitle: metafield(namespace: "custom", key: "subtitle") { value }
                flatNotes: metafield(namespace: "custom", key: "tasting_notes") { value }
              }
            }
          }
        }`,
        {variables: {id: variantId}},
      )
      .then(({data}) => setOffer(data?.node ?? null))
      .catch(() => setOffer(null));
  }, [variantId]);

  if (!shopify.instructions.value.lines.canAddCartLine) return null;
  if (!variantId || !offer) return null;

  const inCart = shopify.lines.value.some(
    (line) => line.merchandise.id === offer.id,
  );
  // Same hierarchy as the theme: coffee_configuration metaobject first,
  // flat custom.* metafields as fallback. Subtitle only exists flat.
  const config = offer.product.config?.reference;
  const image = offer.image?.url ?? offer.product.featuredImage?.url;
  const subtitle = config?.origin?.value || offer.product.subtitle?.value;
  const notes = formatNotes(
    config?.notes?.value ?? offer.product.flatNotes?.value,
  );
  const price = shopify.i18n.formatCurrency(Number(offer.price.amount), {
    currency: offer.price.currencyCode,
  });

  async function addToOrder() {
    setAdding(true);
    setError(false);
    const result = await shopify.applyCartLinesChange({
      type: 'addCartLine',
      merchandiseId: offer.id,
      quantity: 1,
    });
    setAdding(false);
    if (result.type === 'error') {
      setError(true);
    }
  }

  return (
    <s-stack direction="block" gap="base">
      <s-heading>
        {heading || shopify.i18n.translate('defaultHeading')}
      </s-heading>
      {error && (
        <s-banner tone="critical">
          {shopify.i18n.translate('addFailed')}
        </s-banner>
      )}
      <s-grid
        grid-template-columns="auto 1fr auto"
        gap="base"
        align-items="center"
      >
        {image && <s-product-thumbnail src={image} />}
        <s-stack direction="block" gap="small-200">
          <s-text type="strong">{offer.product.title}</s-text>
          {subtitle && <s-text color="subdued">{subtitle}</s-text>}
          {notes && <s-text color="subdued">{notes}</s-text>}
        </s-stack>
        <s-stack direction="block" gap="small-200" align-items="end">
          <s-text>{price}</s-text>
          <s-button onClick={addToOrder} loading={adding} disabled={inCart}>
            {inCart
              ? shopify.i18n.translate('added')
              : shopify.i18n.translate('add')}
          </s-button>
        </s-stack>
      </s-grid>
    </s-stack>
  );
}

function formatNotes(raw) {
  if (!raw) return '';
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.join(' · ');
  } catch {
    // not JSON — fall through to comma handling
  }
  return raw
    .split(',')
    .map((part) => part.trim())
    .join(' · ');
}
