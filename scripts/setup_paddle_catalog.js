const PADDLE_API_KEY = process.env.PADDLE_API_KEY;

if (!PADDLE_API_KEY) {
  console.error("❌ Please set the PADDLE_API_KEY environment variable.");
  console.error("Usage: PADDLE_API_KEY=your_key node scripts/setup_paddle_catalog.js");
  process.exit(1);
}

const BASE_URL = "https://sandbox-api.paddle.com";

const headers = {
  "Authorization": `Bearer ${PADDLE_API_KEY}`,
  "Content-Type": "application/json"
};

const catalog = [
  {
    name: "Standard Plan",
    tax_category: "standard",
    prices: [
      {
        description: "Standard Monthly",
        billing_cycle: { interval: "month", frequency: 1 },
        unit_price: { amount: "369", currency_code: "USD" },
        unit_price_overrides: [
          {
            country_codes: ["IN"],
            unit_price: { amount: "12999", currency_code: "INR" }
          }
        ]
      },
      {
        description: "Standard Annual",
        billing_cycle: { interval: "year", frequency: 1 },
        unit_price: { amount: "3690", currency_code: "USD" },
        unit_price_overrides: [
          {
            country_codes: ["IN"],
            unit_price: { amount: "129900", currency_code: "INR" }
          }
        ]
      }
    ]
  },
  {
    name: "Premium Plan",
    tax_category: "standard",
    prices: [
      {
        description: "Premium Monthly",
        billing_cycle: { interval: "month", frequency: 1 },
        unit_price: { amount: "699", currency_code: "USD" },
        unit_price_overrides: [
          {
            country_codes: ["IN"],
            unit_price: { amount: "15999", currency_code: "INR" }
          }
        ]
      },
      {
        description: "Premium Annual",
        billing_cycle: { interval: "year", frequency: 1 },
        unit_price: { amount: "6990", currency_code: "USD" },
        unit_price_overrides: [
          {
            country_codes: ["IN"],
            unit_price: { amount: "159900", currency_code: "INR" }
          }
        ]
      }
    ]
  },
  {
    name: "Kanji Liar Add-on",
    tax_category: "standard",
    prices: [
      {
        description: "Kanji Liar Add-on (One-Time)",
        unit_price: { amount: "699", currency_code: "USD" }
      }
    ]
  }
];

async function createProduct(productData) {
  const { prices, ...productPayload } = productData;
  const response = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers,
    body: JSON.stringify(productPayload)
  });
  if (!response.ok) {
    throw new Error(`Failed to create product ${productData.name}: ${await response.text()}`);
  }
  const data = await response.json();
  return data.data;
}

async function createPrice(productId, priceData) {
  const response = await fetch(`${BASE_URL}/prices`, {
    method: "POST",
    headers,
    body: JSON.stringify({ ...priceData, product_id: productId })
  });
  if (!response.ok) {
    throw new Error(`Failed to create price for product ${productId}: ${await response.text()}`);
  }
  const data = await response.json();
  return data.data;
}

async function main() {
  console.log("🚀 Creating Paddle Sandbox Catalog...\n");
  const mapping = {};

  for (const item of catalog) {
    console.log(`📦 Creating product: ${item.name}`);
    const product = await createProduct(item);
    console.log(`   ✅ Product ID: ${product.id}`);

    mapping[product.name] = {
      id: product.id,
      prices: {}
    };

    for (const priceData of item.prices) {
      console.log(`   💸 Creating price: ${priceData.description}`);
      const price = await createPrice(product.id, priceData);
      console.log(`      ✅ Price ID: ${price.id}`);
      
      mapping[product.name].prices[priceData.description] = price.id;
    }
    console.log(""); // newline
  }

  console.log("\n🎉 Catalog Creation Complete!");
  console.log("Here is your ID Mapping to use in your app:\n");
  console.log(JSON.stringify(mapping, null, 2));
}

main().catch(console.error);
