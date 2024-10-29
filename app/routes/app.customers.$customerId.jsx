import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import axios from 'axios';

export const loader = async ({ params }) => {
	const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
	const shop = process.env.SHOPIFY_SHOP;
	const customerId = params.customerId;

	if (!accessToken || !shop) {
		throw new Response('Missing Shopify credentials', { status: 401 });
	}

	try {
		const response = await axios.get(`https://${shop}.myshopify.com/admin/api/2021-04/customers/${customerId}.json`, {
			headers: {
				'X-Shopify-Access-Token': accessToken,
			},
		});

		return json({ customer: response.data.customer });
	} catch (error) {
		console.error('Error fetching customer details:', error);
		throw new Response('Internal Server Error', { status: 500 });
	}
};

export default function CustomerDetails() {
	const { customer } = useLoaderData();

	return (
		<div>
			<h1>
				{customer.first_name} {customer.last_name}
			</h1>
			<p>Email: {customer.email}</p>
			<p>Orders Count: {customer.orders_count}</p>
			{/* Add more customer details as needed */}
		</div>
	);
}
