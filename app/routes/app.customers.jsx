import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import axios from 'axios';

export const loader = async () => {
	const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
	const shop = process.env.SHOPIFY_SHOP;

	if (!accessToken || !shop) {
		throw new Response('Missing Shopify credentials', { status: 401 });
	}

	try {
		const response = await axios.get(`https://${shop}.myshopify.com/admin/api/2021-04/customers.json`, {
			headers: {
				'X-Shopify-Access-Token': accessToken,
			},
		});

		return json({ customers: response.data.customers });
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
							{customer.first_name} {customer.last_name}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
