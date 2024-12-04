import { createUserSession } from '../session.server';

export const loader = async ({ request }) => {
	console.log('🔥 Callback loader activated!');

	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	const shop = url.searchParams.get('shop'); // Log for debugging
	const state = url.searchParams.get('state');

	console.log('Request URL:', request.url);
	console.log('Code:', code);
	console.log('Shop:', shop);
	console.log('State:', state);

	if (!code) {
		throw new Error('Authorization code is missing!');
	}

	try {
		// Exchange the authorization code for an access token
		const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
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
			console.error('Token Exchange Error:', errorDetails);
			throw new Error('Failed to exchange authorization code for access token.');
		}

		const { access_token: accessToken } = await tokenResponse.json();

		console.log('Access Token:', accessToken);

		// Use Admin API or Storefront API based on your requirements
		// Example: Fetching customer data using Admin API
		const query = `
      query {
        shop {
          name
          email
        }
      }
    `;

		const shopResponse = await fetch(`https://${shop}/admin/api/2024-01/graphql.json`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({ query }),
		});

		if (!shopResponse.ok) {
			const errorDetails = await shopResponse.text();
			console.error('Shop Fetch Error:', errorDetails);
			throw new Error('Failed to fetch shop data.');
		}

		const shopData = await shopResponse.json();
		console.log('Shop Data:', shopData);

		// Create a session and redirect to the performance page
		return createUserSession(
			{
				shop: shopData.data.shop.name,
				email: shopData.data.shop.email,
			},
			'shopify',
			'/performance'
		);
	} catch (error) {
		console.error('Error in callback loader:', error);
		throw new Error('Callback handler failed.');
	}
};
