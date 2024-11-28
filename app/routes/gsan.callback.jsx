import { redirect } from '@remix-run/node';
import { createUserSession } from '../session.server';
import shopifyAccessToken from './auth.tokens';

export const loader = async ({ request }) => {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	if (!code) {
		throw new Error('🐔 Authorization code is missing!');
	}

	try {
		// Exchange the authorization code for an access token
		const tokenData = await shopifyAccessToken(code);

		console.log('🪙 Token data:', tokenData);
		// Fetch customer details using the access token
		const shopId = process.env.SHOPIFY_SHOP_NAME;
		// const url = `https://${shopId}.myshopify.com/admin/api/2024-01/customers.json`;
		const url = `https://${shopId}.myshopify.com/api/2024-01/graphql.json`;
		console.log('🌍 Fetching customer data from:', url);
		// const customerResponse = await fetch(url, {
		// 	headers: {
		// 		Authorization: `Bearer ${tokenData.access_token}`,
		// 		'Content-Type': 'application/json',
		// 	},
		// });

		const customerResponse = await fetch(url, {
			method: 'POST',
			headers: {
				'X-Shopify-Storefront-Access-Token': tokenData.access_token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: `
      query {
        customer {
          id
          firstName
          lastName
          email
        }
      }
    `,
			}),
		});

		console.log('✉️ Customer response:', customerResponse);

		if (!customerResponse.ok) {
			throw new Error('🙈 Failed to fetch customer data.');
		}

		const customerData = await customerResponse.json();
		console.log('🐋 Customer data: ', customerData);

		// Extract user-specific data for session storage
		const userData = {
			account_id: customerData.id,
			username: customerData.first_name,
			contact_name: `${customerData.first_name} ${customerData.last_name}`,
			email_address: customerData.email,
		};

		// Create a session
		console.log('🍾 Creating user session with data:', userData);
		return createUserSession(userData, 'shopify', '/dashboard');
	} catch (error) {
		console.error('🐪 Error in callback loader:', error);
		throw new Error('🚩 Callback handler failed.');
	}
};
