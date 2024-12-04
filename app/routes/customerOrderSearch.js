// app/utils/customerOrderSearch.js

export async function searchCustomerOrders(accessToken, customerId, productNames) {
	const query = `
    query($customerId: ID!, $productNames: [String!]!) {
      customer(id: $customerId) {
        orders(first: 50) {
          edges {
            node {
              id
              lineItems(first: 100) {
                edges {
                  node {
                    title
                    variant {
                      product {
                        id
                        title
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

	const response = await fetch(`https://${process.env.SHOPIFY_SHOP_ID}.myshopify.com/admin/api/2024-01/graphql.json`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query,
			variables: {
				customerId,
				productNames,
			},
		}),
	});

	if (!response.ok) {
		throw new Error('Failed to fetch customer order data');
	}

	const data = await response.json();
	const orders = data.data.customer.orders.edges;

	const matchingOrders = orders.filter((order) => order.node.lineItems.edges.some((item) => productNames.includes(item.node.title)));

	return matchingOrders;
}
