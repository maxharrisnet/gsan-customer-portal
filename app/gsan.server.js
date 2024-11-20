import { json } from '@remix-run/node';
import { shopify, authenticate } from './shopify.server';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request }) => {
	const { admin } = await authenticate.admin(request);
	console.log('🐯 Admin:', admin);
	return json({ admin });
};

export const authenticateShopifyUser = async function (email, password, request) {
	try {
		console.log('🟢 Authenticating Shopify customer:', email);
		const { admin } = await authenticate.admin(request);
		console.log('🐯 Adminnnnn:', admin);

		// First, create a customer access token
		const tokenResponse = await admin.graphql(
			`
      mutation customerAccessTokenCreate {
        customerAccessTokenCreate(input: {email: email, password: password}) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `,
			{
				variables: {
					input: {
						email: email,
						password: password,
					},
				},
			}
		);

		console.log('🔵 Token response:', tokenResponse);
		const { customerAccessTokenCreate } = tokenResponse.json;

		if (customerAccessTokenCreate.customerAccessToken) {
			// If token creation was successful, fetch customer details
			const customerResponse = await admin.graphql(
				`
        query($accessToken: String!) {
          customer(customerAccessToken: $accessToken) {
            id
            firstName
            lastName
            email
          }
        }
      `,
				{
					variables: {
						accessToken: customerAccessTokenCreate.customerAccessToken.accessToken,
					},
				}
			);

			const customer = customerResponse.body.data.customer;

			return json({
				success: true,
				userData: {
					account_id: customer.id,
					username: customer.email,
					contact_name: `${customer.firstName} ${customer.lastName}`,
					email_address: customer.email,
				},
			});
		} else {
			console.error('🔴 Error creating customer access token:', customerAccessTokenCreate.customerUserErrors);
			return json({ success: false, errors: customerAccessTokenCreate.customerUserErrors });
		}
	} catch (error) {
		console.error('🔴 Error authenticating customer:', error);
		return json({ success: false, errors: [{ message: 'Authentication failed' }] });
	}
};

export default authenticateShopifyUser;
