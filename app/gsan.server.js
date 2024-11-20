import { json } from '@remix-run/node';
import shopify from './shopify.server';

const authenticateShopifyUser = async function (email, password, request) {
	const { admin } = await shopify.authenticate.admin(request);

	try {
		// First, create a customer access token
		const tokenResponse = await admin.graphql(
			`
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
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

		const { customerAccessTokenCreate } = tokenResponse.body.data;

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
			return json({ success: false, errors: customerAccessTokenCreate.customerUserErrors });
		}
	} catch (error) {
		console.error('Error authenticating customer:', error);
		return json({ success: false, errors: [{ message: 'Authentication failed' }] });
	}
};

export default authenticateShopifyUser;
