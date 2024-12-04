import { json, redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { createUserSession } from '../session.server';
import Layout from '../components/layout/Layout';
import { shopifyStorefrontAccessToken } from './api.storefrontToken';

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
	const storefrontAccessToken = await shopifyStorefrontAccessToken(request);
	// const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

	const response = await fetch(`https://switch-incorporated.myshopify.com/api/2024-01/graphql.json`, {
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
			<div className='container'>
				<h1>GSAN Customer Portal</h1>
				<div className='content-centered'>
					<img
						src='/assets/images/GSAN-logo.png'
						alt='GSAN Logo'
						className='login-logo'
					/>
					<form method='post'>
						<div className='form-group'>
							<label
								htmlFor='email'
								className='sr-only'
							>
								Email
							</label>
							<input
								type='email'
								id='email'
								name='email'
								placeholder='Email'
								required
							/>
							<label
								htmlFor='password'
								className='sr-only'
							>
								Password
							</label>
							<input
								type='password'
								id='password'
								name='password'
								placeholder='Password'
								required
							/>
							<button type='submit'>Login</button>
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
						</div>
					</form>
				</div>
			</div>
		</Layout>
	);
}
