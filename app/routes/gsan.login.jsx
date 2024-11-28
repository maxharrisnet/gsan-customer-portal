import { redirect } from '@remix-run/node';
import { generateState, generateNonce } from './auth.utils';
import { generateCodeVerifier, generateCodeChallenge } from './auth.code';

export const loader = async ({ request }) => {
	const clientId = process.env.SHOPIFY_API_KEY;
	const shopId = process.env.SHOPIFY_SHOP_NAME;

	// TODO: Test and update environment variable
	// const appUrl = process.env.SHOPIFY_APP_URL; // Ensure this is set to your app's base URL
	const appUrl = 'https://54d5-2604-3d08-4e82-a500-3c1d-2895-c17-6664.ngrok-free.app';
	const redirectUri = `${appUrl}/gsan/callback`;

	// const authorizationRequestUrl = new URL(`https://shopify.com/authentication/${clientId}/oauth/authorize`);
	const authorizationRequestUrl = new URL(`https://${shopId}.myshopify.com/account/login/oauth/authorize`); // No, actually use this!!!
	// const authorizationRequestUrl = new URL(`https://${shopId}.myshopify.com/admin/oauth/authorize`); // This works, don't touch it!
	const state = await generateState();
	const nonce = await generateNonce(100);

	authorizationRequestUrl.searchParams.append('scope', 'openid email customer-account-api:full');
	authorizationRequestUrl.searchParams.append('client_id', clientId);
	authorizationRequestUrl.searchParams.append('response_type', 'code');
	authorizationRequestUrl.searchParams.append('redirect_uri', redirectUri);
	authorizationRequestUrl.searchParams.append('state', state);
	authorizationRequestUrl.searchParams.append('nonce', nonce);

	// Public client
	// const verifier = await generateCodeVerifier();
	// const challenge = await generateCodeChallenge(verifier);
	// localStorage.setItem('code-verifier', verifier);

	// authorizationRequestUrl.searchParams.append('code_challenge', challenge);
	// authorizationRequestUrl.searchParams.append('code_challenge_method', 'S256');

	// window.location.href = authorizationRequestUrl.toString();

	return redirect(authorizationRequestUrl.toString());
};
