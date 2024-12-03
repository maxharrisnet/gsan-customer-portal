import { json, redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { createUserSession } from '../session.server';
import Layout from '../components/layout/Layout';
// import { shopifyStorefrontAccessToken } from '../api.storefrontToken.server';

const customerLoginMutation = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const action = async ({ request }) => {
	const formData = new URLSearchParams(await request.text());
	const email = formData.get('email');
	const password = formData.get('password');
	// const storefrontAccessToken = await shopifyStorefrontAccessToken(request);
	const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
	console.log('🔐 Storefront Access Token:', storefrontAccessToken);

	const response = await fetch(`https://${process.env.SHOPIFY_SHOP_ID}.myshopify.com/api/2024-01/graphql.json`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
		},
		body: JSON.stringify({
			query: customerLoginMutation,
			variables: {
				input: {
					email,
					password,
				},
			},
		}),
	});

	console.log('🐯 Response:', response);

	const result = await response.json();

	if (result.data.customerAccessTokenCreate.userErrors.length) {
		return json({ errors: result.data.customerAccessTokenCreate.userErrors }, { status: 400 });
	}

	const customerAccessToken = result.data.customerAccessTokenCreate.customerAccessToken.accessToken;
	return createUserSession({ accessToken: customerAccessToken }, 'shopify', '/customer');
};

export default function Login() {
	const actionData = useActionData();
	return (
		<Layout>
			<h1>Customer Portal Login</h1>
			<form method='post'>
				<div>
					<label htmlFor='email'>Email:</label>
					<input
						type='email'
						id='email'
						name='email'
						required
					/>
				</div>
				<div>
					<label htmlFor='password'>Password:</label>
					<input
						type='password'
						id='password'
						name='password'
						required
					/>
				</div>
				<button type='submit'>Login</button>
			</form>
			{actionData?.errors && (
				<div>
					<h2>Errors:</h2>
					<ul>
						{actionData.errors.map((error, index) => (
							<li key={index}>{error.message}</li>
						))}
					</ul>
				</div>
			)}
		</Layout>
	);
}
