import { headerCredentials } from './auth.utils';

export default async function refreshToken(refreshToken: string): Promise<{ access_token: string; expires_in: number; refresh_token: string }> {
	const clientId = process.env.CLIENT_ID;
	const shopId = process.env.SHOPIFY_SHOP_ID;
	const credentials = await headerCredentials();
	const body = new URLSearchParams();

	body.append('grant_type', 'refresh_token');
	if (clientId) {
		body.append('client_id', clientId);
	} else {
		throw new Error('CLIENT_ID is not defined');
	}
	body.append('refresh_token', refreshToken);

	const headers = {
		'content-type': 'application/x-www-form-urlencoded',
		// Confidential Client
		Authorization: `Basic ${credentials}`,
	};

	const response = await fetch(`https://shopify.com/authentication/${shopId}/oauth/token`, {
		method: 'POST',
		headers: headers,
		body,
	});

	interface AccessTokenResponse {
		access_token: string;
		expires_in: number;
		refresh_token: string;
	}

	const { access_token, expires_in, refresh_token: newRefreshToken } = await response.json();

	return { access_token, expires_in, refresh_token: newRefreshToken };
}
