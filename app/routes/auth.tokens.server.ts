import { headerCredentials } from './auth.utils.server';

console.log('🟢 auth.tokens.ts');
const credentials = await headerCredentials();

export default async function shopifyAccessToken(code: string): Promise<{ access_token: string; expires_in: number; id_token: string; refresh_token: string }> {
	const clientId = process.env.SHOPIFY_API_KEY!;
	const shop = process.env.SHOPIFY_SHOP_ID;
	const appUrl = 'https://565f-2604-3d08-4e82-a500-4cc3-afca-b09c-e2be.ngrok-free.app';
	const body = new URLSearchParams();
	const redirectUri = `${appUrl}/api/gsan/callback`;

	body.append('grant_type', 'authorization_code');
	body.append('client_id', clientId);
	body.append('redirect_uri', redirectUri);
	console.log('🍃 Redirect URI:', redirectUri);
	body.append('code', code);

	const headers = {
		'content-type': 'application/x-www-form-urlencoded',
		// Confidential Client
		Authorization: `Basic ${credentials}`,
	};

	const response = await fetch(`https://${shop}.myshopify.com/admin/oauth/access_token`, {
		method: 'POST',
		headers: headers,
		body,
	});

	console.log('🎈 - Shopify Access Token Response:', response);
	interface AccessTokenResponse {
		access_token: string;
		expires_in: number;
		id_token: string;
		refresh_token: string;
	}

	const { access_token, expires_in, id_token, refresh_token } = (await response.json()) as AccessTokenResponse;

	return { access_token, expires_in, id_token, refresh_token };
}

// Refresh Token
export async function shopifyRefreshToken(refreshToken: string): Promise<{ access_token: string; expires_in: number; refresh_token: string }> {
	const clientId = process.env.SHOPIFY_API_KEY;
	const shopId = process.env.SHOPIFY_SHOP_ID;
	const body = new URLSearchParams();

	body.append('grant_type', 'refresh_token');
	if (clientId) {
		body.append('client_id', clientId);
	} else {
		throw new Error('SHOPIFY_API_KEY is not defined');
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

	// interface AccessTokenResponse {
	// 	access_token: string;
	// 	expires_in: number;
	// 	refresh_token: string;
	// }

	const { access_token, expires_in, refresh_token: newRefreshToken } = await response.json();

	return { access_token, expires_in, refresh_token: newRefreshToken };
}
