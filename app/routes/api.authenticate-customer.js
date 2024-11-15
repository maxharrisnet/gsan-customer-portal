import { json } from '@remix-run/node';
import shopify from '../shopify.server';

export async function action({ request }) {
	const { admin } = await shopify.authenticate.admin(request);
	const formData = await request.formData();
	const email = formData.get('email');
	const password = formData.get('password');

	try {
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

		// Note: Shopify doesn't provide a way to verify customer passwords via API
		// You would need to implement your own authentication system or use a third-party service
		// For this example, we're just checking if the customer exists

		return json({ customer });
	} catch (error) {
		console.error('Error authenticating customer:', error);
		return json({ error: 'Authentication failed' }, { status: 500 });
	}
}
