import { redirect } from '@remix-run/node';
import { createUserSession } from '../session.server';

export const loader = async ({ request }) => {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');

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
			throw new Error('Failed to exchange authorization code for access token.');
		}

		const { access_token: accessToken } = await tokenResponse.json();

		// Fetch customer details using the Storefront API
		const query = `
      query {
        customer {
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
    `;

		const customerResponse = await fetch(`https://${process.env.SHOPIFY_SHOP_ID}.myshopify.com/api/2024-01/graphql.json`, {
			method: 'POST',
			headers: {
				'X-Shopify-Storefront-Access-Token': accessToken,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ query }),
		});

		if (!customerResponse.ok) {
			throw new Error('Failed to fetch customer data.');
		}

		const customerData = await customerResponse.json();
		const customer = customerData.data.customer;

		if (!customer) {
			throw new Error('No customer data found.');
		}

		// Create a session
		return createUserSession(
			{
				account_id: customer.id,
				email_address: customer.email,
			},
			'shopify',
			'/performance'
		);
	} catch (error) {
		console.error('Error in callback loader:', error);
		throw new Error('Callback handler failed.');
	}
};
