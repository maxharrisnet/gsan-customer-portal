import Layout from '../components/layout/Layout';
import { useLoaderData } from '@remix-run/react';
import { shopifyAccessToken } from './auth.tokens';

export const loader = async ({ request }) => {
	const shopId = process.env.SHOPIFY_SHOP_ID;
	const access_token = await shopifyAccessToken(request);
	const response = await fetch(`https://shopify.com/${shopId}/account/customer/api/2024-10/graphql`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: { access_token },
		},
		body: JSON.stringify({
			operationName: 'SomeQuery',
			query: 'query { customer { emailAddress { emailAddress }}}',
			variables: {},
		}),
	});

	return response.json();
};

export default function Login() {
	const data = useLoaderData();
	console.log(data);

	return (
		<Layout>
			<div className='container'>
				<h1>User 🐶</h1>
				<div className=' content-centered'></div>
			</div>
		</Layout>
	);
}
