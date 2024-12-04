import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';

export const loader = async ({ request }) => {
	const shopifyShopId = process.env.SHOPIFY_SHOP_ID;
	if (!shopifyShopId) {
		throw new Error('SHOPIFY_SHOP_ID is not defined in the environment variables');
	}

	return json({ shopifyShopId });
};

export default function CustomerOrderSearch() {
	const { shopifyShopId } = useLoaderData();

	const fetchCustomerOrders = async (accessToken, customerId, productNames) => {
		const query = `
      query ($customerId: ID!, $productNames: [String!]) {
        customer(id: $customerId) {
          orders(first: 10, query: $productNames) {
            edges {
              node {
                id
                name
                lineItems(first: 10) {
                  edges {
                    node {
                      title
                      quantity
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

		const response = await fetch(`https://${shopifyShopId}.myshopify.com/admin/api/2024-01/graphql.json`, {
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

		const result = await response.json();
		return result.data;
	};

	// Example usage of fetchCustomerOrders
	useEffect(() => {
		const accessToken = 'your-access-token';
		const customerId = 'customer-id';
		const productNames = ['Product 1', 'Product 2'];

		fetchCustomerOrders(accessToken, customerId, productNames)
			.then((data) => {
				console.log('Customer Orders:', data);
			})
			.catch((error) => {
				console.error('Error fetching customer orders:', error);
			});
	}, []);

	return (
		<div>
			<h1>Customer Order Search</h1>
			{/* Render customer orders here */}
		</div>
	);
}
