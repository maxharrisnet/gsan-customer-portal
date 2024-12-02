import { redirect } from '@remix-run/node';
import { createUserSession } from '../session.server';

export const loader = async ({ request }) => {
	console.log('🟢🟢🟢 Callback request:', request);
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	if (!code) {
		throw new Error('Authorization code is missing!');
	}

	try {
		// Exchange the authorization code for an access token
		const tokenResponse = await fetch(`https://${process.env.SHOPIFY_SHOP_ID}.myshopify.com/admin/oauth/access_token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				client_id: process.env.SHOPIFY_API_KEY,
				client_secret: process.env.SHOPIFY_API_SECRET,
				code,
			}),
		});

		if (!tokenResponse.ok) {
			const errorDetails = await tokenResponse.text();
			console.error('🔴 Token API Error:', errorDetails);
			throw new Error('🔴 Failed to exchange authorization code for access token.');
		}

		console.log('🟢 Token API Response:', tokenResponse);

		// const { access_token: accessToken } = await tokenResponse.json();

		const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

		// Fetch customer details using the Admin GraphQL API
		const query = `
      query {
        customers(first: 1) {
          edges {
            node {
              id
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
        }
      }
    `;

		const customerResponse = await fetch(`https://${process.env.SHOPIFY_SHOP_ID}.myshopify.com/admin/api/2024-01/graphql.json`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ query }),
		});

		console.log('🟢 Customer API Response:', customerResponse);

		if (!customerResponse.ok) {
			const errorDetails = await customerResponse.text();
			console.error('🔴 Customer API Error:', errorDetails);
			throw new Error('🔴 Failed to fetch customer data.');
		}

		const customerData = await customerResponse.json();
		const customer = customerData.data.customers.edges[0]?.node;

		if (!customer) {
			throw new Error('🔴 No customer data found.');
		}

		// Create a session
		return createUserSession(
			{
				account_id: customer.id,
				email_address: customer.email,
			},
			'shopify',
			'/dashboard'
		);
	} catch (error) {
		console.error('Error in callback loader:', error);
		throw new Error('📢 Callback handler failed.');
	}
};
