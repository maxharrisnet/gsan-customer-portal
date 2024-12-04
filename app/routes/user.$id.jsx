// routes/customer.jsx
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUserSession } from '../session.server';

const customerQuery = `
  query {
    customer {
      id
      firstName
      lastName
      email
      orders(first: 5) {
        edges {
          node {
            id
            totalPrice
          }
        }
      }
    }
  }
`;

export const loader = async ({ request }) => {
	const userSession = await getUserSession(request);

	if (!userSession || !userSession.accessToken) {
		return redirect('/login'); // Redirect to login if not authenticated
	}

	const customerAccessToken = userSession.accessToken;

	const response = await fetch(`https://${process.env.SHOPIFY_SHOP_ID}.myshopify.com/api/2024-01/graphql.json`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Customer-Access-Token': customerAccessToken,
		},
		body: JSON.stringify({ query: customerQuery }),
	});

	const customerData = await response.json();

	if (customerData.errors) {
		console.error('Error fetching customer data:', customerData.errors);
		throw new Response('Failed to fetch customer data', { status: 500 });
	}

	return json(customerData.data.customer);
};

export default function Customer() {
	const customer = useLoaderData();

	return (
		<div>
			<h1>Customer Information</h1>
			{customer ? (
				<div>
					<h2>
						{customer.firstName} {customer.lastName}
					</h2>
					<p>Email: {customer.email}</p>
					<h3>Recent Orders:</h3>
					<ul>
						{customer.orders.edges.map(({ node }) => (
							<li key={node.id}>
								Order ID: {node.id}, Total Price: {node.totalPrice}
							</li>
						))}
					</ul>
				</div>
			) : (
				<p>No customer data available.</p>
			)}
		</div>
	);
}
