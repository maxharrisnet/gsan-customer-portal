import { json } from '@remix-run/node';
import { shopify, authenticate } from './shopify.server';
// import { useLoaderData } from '@remix-run/react';

// export const loader = async ({ request }) => {
// 	const { admin } = await authenticate.admin(request);
// 	console.log('🐯 Admin:', admin);
// 	return json({ admin });
// };

const authenticateShopifyUser = async function (email, password, request) {
	try {
		const { admin } = await authenticate.admin(request);
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
		if (error.response && error.response.status === 302) {
			return json({ error: 'Authentication required', redirectUrl: error.response.headers.get('Location') }, { status: 302 });
		}
		console.error('Error authenticating customer:', error);
		return json({ error: 'Authentication failed' }, { status: 500 });
	}
};

export default authenticateShopifyUser;
