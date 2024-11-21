import { json } from '@remix-run/node';
import shopify from './shopify.server';

export const loader = async ({ request }) => {
	try {
		const { admin } = await shopify.authenticate.admin(request);
		console.log('🐯 Admin:', admin);
		return json({ admin });
	} catch (error) {
		console.error('Loader authentication error:', error);
		return json({ error: 'Authentication failed' }, { status: 401 });
	}
};

export const authenticateShopifyUser = async function (email, password, request) {
	console.log('🔒 Authenticating Shopify user:', email);
	try {
		const { admin } = await shopify.authenticate.admin(request);
		console.log('🐯 Admin:', admin);

		const response = await admin.graphql(
			`
      query($email: String!) {
        customers(first: 1, query: $email) {
          edges {
            node {
              id
              firstName
              lastName
              email
            }
          }
        }
      }
    `,
			{ variables: { email } }
		);

		const customers = response.body.data.customers.edges;
		if (customers.length === 0) {
			return json({ error: 'Customer not found' }, { status: 404 });
		}

		const customer = customers[0].node;
		return json({ success: true, userData: customer });
	} catch (error) {
		console.error('Error authenticating customer:', error);
		if (error.response && error.response.status === 302) {
			// Instead of returning a 302, we'll return a custom error
			return json({ error: 'Authentication required', redirectUrl: error.response.headers.get('Location') }, { status: 401 });
		}
		return json({ error: 'Authentication failed' }, { status: 500 });
	}
};

export default authenticateShopifyUser;
