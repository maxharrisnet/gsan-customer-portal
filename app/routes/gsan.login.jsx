import { redirect } from '@remix-run/node';
import { generateState, generateNonce } from './auth.utils';

export const loader = async ({ request }) => {
	const clientId = process.env.SHOPIFY_API_KEY;
	const shopId = process.env.SHOPIFY_SHOP_ID;

	// TODO: Test and update environment variable
	const appUrl = 'https://565f-2604-3d08-4e82-a500-4cc3-afca-b09c-e2be.ngrok-free.app';
	const redirectUri = `${appUrl}/api/gsan/callback`;
	const authorizationRequestUrl = new URL(`https://${shopId}.myshopify.com/admin/oauth/authorize`); // This works, don't touch it!
	const state = await generateState();
	const nonce = await generateNonce(100);

	authorizationRequestUrl.searchParams.append('scope', 'openid email customer-account-api:full');
	authorizationRequestUrl.searchParams.append('client_id', clientId);
	authorizationRequestUrl.searchParams.append('response_type', 'code');
	authorizationRequestUrl.searchParams.append('redirect_uri', redirectUri);
	authorizationRequestUrl.searchParams.append('state', state);
	authorizationRequestUrl.searchParams.append('nonce', nonce);

	return redirect(authorizationRequestUrl.toString());
};
