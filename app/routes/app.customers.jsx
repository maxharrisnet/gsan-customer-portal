import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { authenticate } from '../shopify.server';

export const loader = async ({ request }) => {
	const { admin } = await authenticate.admin(request);

	const response = await admin.graphql(
		`#graphql
  query getCustomers {
    customers (first: 10) {
      edges {
        node {
          id
					firstName
					lastName
          email
        }
      }
    }
  }`
	);

	const data = await response.json();
	console.log('👾👾👾 Data:', data);
	return json({ customers: data.data.customers.edges.map((edge) => edge.node) });

	// TODO: handle errors
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
