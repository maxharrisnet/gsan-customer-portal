import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { authenticate } from '../shopify.server';

export const loader = async ({ request }) => {
	const { admin } = await authenticate.admin(request);

	const query = `
    query {
      customers(first: 10) {
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
  `;

	try {
		const response = await admin.graphql(query);

		return json({ customers: response.data.customers.edges.map((edge) => edge.node) });
	} catch (error) {
		console.error('Error fetching customers:', error);
		throw new Response('Internal Server Error', { status: 500 });
	}
};

export default function CustomerList() {
	const { customers } = useLoaderData();

	return (
		<div>
			<h1>Customers</h1>
			<ul>
				{customers.map((customer) => (
					<li key={customer.id}>
						<a href={`/customers/${customer.id}`}>
							{customer.firstName} {customer.lastName}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
