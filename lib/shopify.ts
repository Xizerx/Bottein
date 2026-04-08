/**
 * Stubbed Shopify Storefront API client.
 * Replace SHOPIFY_DOMAIN and SHOPIFY_STOREFRONT_TOKEN with real values
 * when connecting to production.
 */

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? "bottein.myshopify.com";
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_TOKEN ?? "";
const API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

async function shopifyFetch<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  if (!STOREFRONT_TOKEN) {
    // Return mock data during development / before Shopify is connected
    throw new Error("Shopify Storefront API token not configured.");
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data as T;
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export async function createCart(): Promise<{ id: string; checkoutUrl: string }> {
  // Stub — returns a fake cart until Shopify is connected
  return {
    id: "stub-cart-id",
    checkoutUrl: "https://bottein.ca/checkout",
  };
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<void> {
  // Stub
  console.log("[Shopify stub] addToCart", { cartId, variantId, quantity });
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProducts() {
  // Stub — returns example product list
  return [
    {
      id: "gid://shopify/Product/1",
      title: "Bottein Custom Formula",
      handle: "custom-formula",
      variants: [
        {
          id: "gid://shopify/ProductVariant/1",
          title: "Default",
          price: "49.99",
          availableForSale: true,
        },
      ],
    },
  ];
}

export { shopifyFetch };
