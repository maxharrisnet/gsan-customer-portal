import { authenticate } from './shopify.server';

export async function shopifyStorefrontAccessToken(request) {
	const { admin } = await authenticate.admin(request);

	const storefrontTokenResponse = await admin.graphql(
		`#graphql
    mutation StorefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
      storefrontAccessTokenCreate(input: $input) {
        userErrors {
          field
          message
        }
        shop {
          id
        }
        storefrontAccessToken {
          accessScopes {
            handle
          }
          accessToken
          title
        }
      }
    }`,
		{
			input: {
				title: 'New Storefront Access Token',
				accessScopes: ['unauthenticated_read_product_listings', 'unauthenticated_write_checkouts', 'unauthenticated_read_checkouts', 'unauthenticated_read_selling_plans'],
			},
		}
	);

	const { storefrontAccessTokenCreate } = storefrontTokenResponse;

	if (storefrontAccessTokenCreate.userErrors.length > 0) {
		throw new Error(`Error creating storefront access token: ${storefrontAccessTokenCreate.userErrors.map((error) => error.message).join(', ')}`);
	}

	const accessToken = storefrontAccessTokenCreate.storefrontAccessToken.accessToken;

	return {
		access_token: accessToken,
		expires_in: 0, // Shopify storefront access tokens do not expire
		id_token: '',
		refresh_token: '',
	};
}
