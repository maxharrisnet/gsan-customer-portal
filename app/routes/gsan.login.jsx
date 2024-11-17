// app/routes/gsan.login.jsx
import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';

export async function action({ request }) {
	const formData = await request.formData();
	const email = formData.get('email');
	const password = formData.get('password');

	// In a real application, you'd want to use a server-side utility function
	// to handle the authentication logic
	try {
		// This is a placeholder for your actual authentication logic
		const result = await authenticateCustomer(email, password);

		if (result.success) {
			// You'd set up a session here
			return redirect('/gsan/dashboard');
		} else {
			return json({ errors: result.errors });
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
		<Form method='post'>
			<input
				type='email'
				name='email'
				required
			/>
			<input
				type='password'
				name='password'
				required
			/>
			<button type='submit'>Log in</button>
			{actionData?.errors && (
				<ul>
					{actionData.errors.map((error, index) => (
						<li key={index}>{error.message}</li>
					))}
				</ul>
			)}
		</Form>
	);
}

// This function would be implemented in a separate server-side file
async function authenticateCustomer(email, password) {
	// Implement your customer authentication logic here
	// This might involve calling Shopify's API or your own auth service
	// Return an object like { success: boolean, errors?: array }
}
