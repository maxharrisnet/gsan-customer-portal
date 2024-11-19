import { json } from '@remix-run/node';
import { authenticateShopifyUser } from '../gsan.server';
import { createUserSession } from '../session.server';
import Layout from '../components/layout/Layout';
import { Form, useActionData, useLoaderData } from '@remix-run/react';

export async function action({ request }) {
	const formData = await request.formData();
	const email = formData.get('email');
	const password = formData.get('password');

	try {
		const shopifyAuth = await authenticateShopifyUser(email, password, request);

		if (shopifyAuth.success) {
			return createUserSession(shopifyAuth.userData, 'sonar', '/dashboard');
		} else {
			return json({ errors: shopifyAuth.errors });
		}
	} catch (error) {
		console.error('Customer login error:', error);
		return json({ errors: [{ message: 'An error occurred during login' }] });
	}
}

export default function GsanLogin() {
	const actionData = useActionData();
	const loaderData = useLoaderData();

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
							{actionData?.error && <p>{actionData.error}</p>}
						</div>
					</Form>
				</div>
			</div>
		</Layout>
	);
}
