// Requesting authorization
import { generateCodeVerifier, generateCodeChallenge, generateState, generateNonce } from './auth.utils';

const clientId = process.env.SHOPIFY_API_KEY;
const shopId = process.env.SHOPIFY_SHOP_ID;
const authorizationRequestUrl = new URL(`https://shopify.com/authentication/${shopId}/oauth/authorize`);
const redirect_uri = '/user';
const state = await generateState();
const nonce = await generateNonce(999);

authorizationRequestUrl.searchParams.append('scope', 'openid email customer-account-api:full');
authorizationRequestUrl.searchParams.append('client_id', clientId);
authorizationRequestUrl.searchParams.append('response_type', 'code');
authorizationRequestUrl.searchParams.append('redirect_uri', redirect_uri);
authorizationRequestUrl.searchParams.append('state', state);
authorizationRequestUrl.searchParams.append('nonce', nonce);

// Public client
const verifier = await generateCodeVerifier();
const challenge = await generateCodeChallenge(verifier);
localStorage.setItem('code-verifier', verifier);

authorizationRequestUrl.searchParams.append('code_challenge', challenge);
authorizationRequestUrl.searchParams.append('code_challenge_method', 'S256');

window.location.href = authorizationRequestUrl.toString();

// Access token request
