import { generateState, generateNonce } from './auth.utils';

export const loader = async ({ request }) => {
	const clientId = process.env.SHOPIFY_API_KEY;
	const shopId = process.env.SHOPIFY_SHOP_ID;
	const authorizationRequestUrl = new URL(`https://shopify.com/authentication/${shopId}/oauth/authorize`);
	const redirect_uri = '/user';
	const state = await generateState();
	const nonce = await generateNonce(100);

	authorizationRequestUrl.searchParams.append('scope', 'openid email customer-account-api:full');
	authorizationRequestUrl.searchParams.append('client_id', clientId);
	authorizationRequestUrl.searchParams.append('response_type', 'code');
	authorizationRequestUrl.searchParams.append('redirect_uri', redirect_uri);
	authorizationRequestUrl.searchParams.append('state', state);
	authorizationRequestUrl.searchParams.append('nonce', nonce);

	console.log('✈️ Authorization URL:', authorizationRequestUrl.toString());

	const response = await fetch(authorizationRequestUrl.toString(), {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error('🦝 Failed to fetch authorization URL');
	}

	return null;
};
