import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import axios from 'axios';
import { authenticate } from '../shopify.server';

export const loader = async ({ request }) => {
	const { admin } = await authenticate.admin(request);

	const shopifyResponse = await admin.graphql(
		`#graphql
		query getShopifyCustomers {
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

	const shopifyCustomersData = await shopifyResponse.json();
	const shopifyCustomers = shopifyCustomersData.data.customers.edges;

	console.log('$$$ Shopify customers:', shopifyCustomers);
	// TODO: handle errors

	// Fetch Sonar customers
	const sonarUsername = process.env.SONAR_USERNAME;
	const sonarPassword = process.env.SONAR_PASSWORD;
	const sonarAuth = Buffer.from(`${sonarUsername}:${sonarPassword}`).toString('base64');

	try {
		const sonarResponse = await axios.get('https://switch.sonar.software/api/v1/accounts', {
			headers: {
				Authorization: `Basic ${sonarAuth}`,
			},
			params: {
				limit: 10,
				page: 1,
			},
		});

		const sonarCustomers = sonarResponse.data.data;
		console.log('$$$$ Sonar customers:', sonarCustomers);

		return json({ shopifyCustomers, sonarCustomers });
	} catch (error) {
		console.error('Error fetching Sonar customers:', error);
		throw new Response('Internal Server Error! 🛸', { status: 500 });
	}
};

export default function CustomerList() {
	const { shopifyCustomers, sonarCustomers } = useLoaderData();

	return (
		<div>
			<h1>Customers</h1>
			<div style={{ display: 'flex', justifyContent: 'center', padding: '80px', gap: '80px' }}>
				<div>
					<h2>Shopify Customers</h2>
					<ul>
						{shopifyCustomers.map((customer) => (
							<li key={customer.node.id}>
								<a href={`/customers/${customer.id}`}>
									{customer.node.firstName} {customer.node.lastName} ({customer.node.email})
								</a>
							</li>
						))}
					</ul>
				</div>
				<div>
					<h2>Sonar Customers</h2>{' '}
					<ul>
						{sonarCustomers.map((customer) => (
							<li key={customer.id}>
								<a href={`/sonar-customers/${customer.id}`}>
									{customer.name} ({customer.email_address})
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
