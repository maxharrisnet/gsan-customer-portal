import { json } from '@remix-run/node';
import authenticateShopifyUser from '../gsan.server';
import { createUserSession } from '../session.server';
import Layout from '../components/layout/Layout';
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';
import { authenticate } from '../shopify.server';

export async function action({ request }) {
	// console.log('App ID:', response.app_id);
	console.log('🍀 GSAN Customer login action');
	const formData = await request.formData();
	const email = formData.get('email');
	const password = formData.get('password');

	try {
		console.log('🍀 Starting Shopify Auth:');
		const shopifyAuth = await authenticateShopifyUser(email, password, request);
		console.log('🍀 Shopify Auth:', shopifyAuth);
		if (shopifyAuth.success) {
			console.log('🍀 Shopify login success:', shopifyAuth.userData);
			return createUserSession(shopifyAuth.userData, 'shopify', '/dashboardxxx');
		} else {
			console.log('😷 Shopify login failed:', shopifyAuth.errors);

			return json({ errors: shopifyAuth.errors });
		}
	} catch (error) {
		console.error('🎳 Shopify login error:', error);
		return json({ errors: [{ message: 'An error occurred during login' }] });
	}
}

export const loader = async ({ request }) => {
	console.log('🍀 GSAN Customer loader, authing admin');
	console.log('🐞🐞🐞 Shopify:', shopify);

	const { admin } = await authenticate.admin(request);
	console.log('🍀 Admin:', admin);

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

	console.log('Shopify Response:', shopifyResponse);
	const shopifyCustomersData = await shopifyResponse.json();
	const shopifyCustomers = shopifyCustomersData.data.customers.edges;

	return json({ shopifyCustomers });
};

export default function GsanLogin() {
	const actionData = useActionData();
	const { shopifyCustomers } = useLoaderData();

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
					<Form method='post'>
						<div className='form-group'>
							<label
								htmlFor='shopifyEmail'
								className='sr-only'
							>
								Email
							</label>
							<input
								type='text'
								name='email'
								placeholder='Email'
								id='shopifyEmail'
								required
							/>
							<label
								htmlFor='shopifyPassword'
								className='sr-only'
							>
								Password
							</label>
							<input
								type='password'
								name='password'
								placeholder='Password'
								id='shopifyPassword'
								required
							/>
							<button type='submit'>Log in with GSAN</button>
							<a
								href='/reports/starlink/usage'
								className='button'
							>
								Log in with GSAN
							</a>
						</div>
					</Form>
					{actionData?.errors &&
						actionData.errors.map((error, index) => (
							<p
								key={index}
								style={{ color: 'red' }}
							>
								{error}
							</p>
						))}
				</div>

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
					</div>
				</div>
			</div>
		</Layout>
	);
}

export function ErrorBoundary({ error }) {
	console.error('ErrorBoundary caught an error:', error);
	return (
		<Layout>
			<div className='container'>
				<h1>Something went wrong</h1>
				<p>{error.message}</p>
				<Link to='/'>Go back to the homepage</Link>
			</div>
		</Layout>
	);
}
