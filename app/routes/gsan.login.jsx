import { json, redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { createUserSession } from '../session.server';

import Layout from '../components/layout/Layout';

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
	const storeToken = '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';
	console.log('🔵 Login:', email);
	console.log('🔵 Shop:', process.env.SHOPIFY_SHOP_ID);
	console.log('🔵 Accessss Token:', storeToken);

	const response = await fetch(`https://${process.env.SHOPIFY_SHOP_ID}.myshopify.com/api/2024-01/graphql.json`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': storeToken,
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

	console.log('🟢 Login Response:', response);

	const result = await response.json();
	if (result.data.customerAccessTokenCreate.userErrors.length) {
		return json({ errors: result.data.customerAccessTokenCreate.userErrors }, { status: 400 });
	}

	console.log('🟢 Login Result:', result);

	const customerAccessToken = result.data.customerAccessTokenCreate.customerAccessToken.accessToken;

	return createUserSession({ accessToken: customerAccessToken }, 'shopify', '/customer');
};

export default function Login() {
	const actionData = useActionData();

	return (
		<Layout>
			<div className='container'>
				<h1>Customer Portal Login</h1>
				<div className='content-centered'>
					<div className='button-wrapper login-button-wrapper'>
						<div>
							<img
								src='/assets/images/GSAN-logo.png'
								alt='GSAN Logo'
							/>
							<form method='post'>
								<div>
									<label>
										Email:
										<input
											type='email'
											name='email'
											required
										/>
									</label>
								</div>
								<div>
									<label>
										Password:
										<input
											type='password'
											name='password'
											required
										/>
									</label>
								</div>
								<button type='submit'>Login</button>
							</form>
							{actionData?.errors && (
								<div>
									<h2>Errors:</h2>
									<ul>
										{actionData.errors.map((error) => (
											<li key={error.field}>{error.message}</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}
