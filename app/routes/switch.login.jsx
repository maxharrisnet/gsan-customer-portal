import { json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { createUserSession } from '../session.server';
import authenticateSonarUser from '../sonar.server';
import Layout from '../components/layout/Layout';

export async function action({ request }) {
	const formData = await request.formData();
	const username = formData.get('username');
	const password = formData.get('password');

	try {
		const sonarAuth = await authenticateSonarUser(username, password);

		if (sonarAuth.success) {
			console.log('👾 Creating session from switch.login.jsx');
			return createUserSession(sonarAuth.userData, 'sonar', '/dashboard');
		} else {
			return json({ error: sonarAuth.error }, { status: 401 });
		}
	} catch (error) {
		console.error('Sonar customer login error:', error);
		return json({ errors: [{ message: 'An error occurred during sonar login' }] });
	}
}

export default function SonarLogin() {
	const actionData = useActionData();
	return (
		<Layout>
			<div className='container'>
				<div className='content-centered'>
					<Form method='post'>
						<h1>Switch Customer Login</h1>
						<div className='form-group'>
							<label htmlFor='sonarUsername'>Username</label>
							<input
								type='text'
								name='username'
								id='sonarUsername'
								required
							/>
							<label htmlFor='sonarPassword'>Password</label>
							<input
								type='password'
								name='password'
								id='sonarPassword'
								required
							/>
							<button type='submit'>Log in with Switch</button>
							{actionData?.error && <p>{actionData.error}</p>}
						</div>
					</Form>
				</div>
			</div>
		</Layout>
	);
}
