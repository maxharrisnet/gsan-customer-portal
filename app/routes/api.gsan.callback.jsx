import { redirect } from '@remix-run/node';
import { createUserSession } from '../session.server';

export const loader = async ({ request }) => {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	if (!code) {
		throw new Error('Authorization code is missing!');
	}

	try {
		// Exchange the code for an access token
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

		const tokenData = await tokenResponse.json();
		const accessToken = tokenData.access_token;

		// Fetch customer details
		const customerResponse = await fetch(`https://${process.env.SHOPIFY_SHOP_ID}.myshopify.com/admin/api/2024-01/customers.json`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!customerResponse.ok) {
			throw new Error('Failed to fetch customer data.');
		}

		const customerData = await customerResponse.json();

		// Create a session
		return createUserSession(
			{
				account_id: customerData.id,
				username: customerData.first_name,
				contact_name: customerData.first_name + ' ' + customerData.last_name,
				email_address: customerData.email,
			},
			'shopify',
			'/dashboard'
		);
	} catch (error) {
		console.error('Error in callback loader:', error);
		throw new Error('Callback handler failed.');
	}
};
