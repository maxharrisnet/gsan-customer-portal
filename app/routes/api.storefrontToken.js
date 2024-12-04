import { authenticate } from '../shopify.server';

export async function shopifyStorefrontAccessToken(request) {
	console.log('🔐 Creating storefront access token from api.storefrontToken.js');
	const { admin } = await authenticate.admin(request);

	const storefrontTokenResponse = await admin.graphql(
		`#graphql
    mutation StorefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
      storefrontAccessTokenCreate(input: $input) {
        userErrors {
          field
          message
        }
        storefrontAccessToken {
          accessToken
          accessScopes {
            handle
          }
          title
        }
      }
    }`,
		{
			input: {
				title: 'GSAN Storefront Token',
				accessScopes: ['unauthenticated_read_product_listings', 'unauthenticated_read_customers', 'unauthenticated_read_checkouts'],
			},
		}
	);

	console.log('Storefront Token Response:', storefrontTokenResponse);

	const { storefrontAccessTokenCreate } = storefrontTokenResponse;

	if (storefrontAccessTokenCreate.userErrors.length > 0) {
		console.error('Error creating storefront access token:', storefrontAccessTokenCreate.userErrors);
		throw new Error(`Error creating storefront access token: ${storefrontAccessTokenCreate.userErrors.map((error) => error.message).join(', ')}`);
	}

	const accessToken = storefrontAccessTokenCreate.storefrontAccessToken.accessToken;

	return {
		access_token: accessToken,
		expires_in: 0, // Shopify storefront access tokens do not expire
	};
}
