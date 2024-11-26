export default async function shopifyAccessToken(code: string): Promise<{ access_token: string; expires_in: number; id_token: string; refresh_token: string }> {
	const clientId = process.env.CLIENT_ID!;
	const shopId = process.env.SHOPIFY_SHOP_ID;
	const body = new URLSearchParams();
	const redirectUri = '/user';

	body.append('grant_type', 'authorization_code');
	body.append('client_id', clientId);
	body.append('redirect_uri', redirectUri);
	body.append('code', code);

	// Public Client
	const codeVerifier = localStorage.getItem('code-verifier');
	if (!codeVerifier) {
		throw new Error('Code verifier not found in local storage');
	}
	body.append('code_verifier', codeVerifier);

	const headers = {
		'content-type': 'application/x-www-form-urlencoded',
		// Confidential Client
		Authorization: 'Basic `<credentials>`',
	};

	const response = await fetch(`https://shopify.com/authentication/${shopId}/oauth/token`, {
		method: 'POST',
		headers: headers,
		body,
	});

	interface AccessTokenResponse {
		access_token: string;
		expires_in: number;
		id_token: string;
		refresh_token: string;
	}

	const { access_token, expires_in, id_token, refresh_token } = (await response.json()) as AccessTokenResponse;

	return { access_token, expires_in, id_token, refresh_token };
}
