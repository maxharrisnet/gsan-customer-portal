// app/routes/customer-dashboard.jsx
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import shopify from '../shopify.server';

async function getShopifyCustomerByEmail(request, email) {
	const { admin } = await shopify.authenticate.admin(request);

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
              orders(first: 5) {
                edges {
                  node {
                    id
                    name
                    totalPriceSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
			{ variables: { email } }
		);

		const customers = response.body.data.customers.edges;
		return customers.length > 0 ? customers[0].node : null;
	} catch (error) {
		console.error('Error fetching Shopify customer:', error);
		return null;
	}
}

export async function loader({ request }) {
	// Implement session checking here
	// For example:
	// const session = await getSession(request);
	// const email = session.get('customerEmail');
	// if (!email) return redirect('/customer-login');

	const email = 'customer@example.com'; // Replace with actual session data

	const shopifyCustomer = await getShopifyCustomerByEmail(request, email);

	if (!shopifyCustomer) {
		return redirect('/customer-login');
	}

	return json({ customer: shopifyCustomer });
}

export default function CustomerDashboard() {
	const { customer } = useLoaderData();

	return (
		<div>
			<h1>Welcome, {customer.firstName}!</h1>
			<h2>Recent Orders</h2>
			<ul>
				{customer.orders.edges.map(({ node }) => (
					<li key={node.id}>
						{node.name}: {node.totalPriceSet.shopMoney.amount} {node.totalPriceSet.shopMoney.currencyCode}
					</li>
				))}
			</ul>
		</div>
	);
}
