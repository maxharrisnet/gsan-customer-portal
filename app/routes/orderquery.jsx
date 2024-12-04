import { json } from '@remix-run/node';

const GetOrdersWithSpecificProducts = `
  query GetOrdersWithSpecificProducts($customerId: ID!, $productIds: [ID!]!) {
    customer(id: $customerId) {
    orders(first: 250) {
      edges {
        node {
          id
          orderNumber
          totalPriceV2 {
            amount
            currencyCode
          }
          lineItems(first: 250) {
            edges {
              node {
                product {
                  id
                }
                title
              }
            }
            `;

export const loader = async ({ request }) => {
	const accessToken = ''; // Get the customer's access token from the session
	const customerId = ''; // Get the customer's ID from the session
	const productIds = ['gid://shopify/Product/123', 'gid://shopify/Product/456']; // Add your product IDs

	const response = await fetch(`https://${process.env.SHOPIFY_SHOP_ID}.myshopify.com/api/2024-01/graphql.json`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
		},
		body: JSON.stringify({
			query: GetOrdersWithSpecificProducts,
			variables: {
				customerId,
				productIds,
			},
		}),
	});

	const { data } = await response.json();

	// Filter orders that contain at least one of the specified products
	const ordersWithProducts = data.customer.orders.edges.filter(({ node }) => node.lineItems.edges.some(({ node: lineItem }) => productIds.includes(lineItem.product.id)));

	return json({ orders: ordersWithProducts });
};
