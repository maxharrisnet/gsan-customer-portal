import { json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { createUserSession } from '../session.server';
import authenticateSonarUser from '../sonar.server';
import Layout from '../components/layout/Layout';

export async function action({ request }) {
	const formData = await request.formData();
	const username = formData.get('username');
	const password = formData.get('password');

	const sonarAuth = await authenticateSonarUser(username, password);

	if (sonarAuth.success) {
		return createUserSession(sonarAuth.userData, 'sonar', '/dashboard');
	} else {
		return json({ error: sonarAuth.error }, { status: 401 });
	}
}

export async function loader({ request }) {
	return null;
}

export default function SonarLogin() {
	const actionData = useActionData();
	console.log('👽 Switch login page');
	return (
		<Layout>
			<div className='container'>
				<div className='content-centered'>
					<Form method='post'>
						<h1>Sonar Switch</h1>
						<input
							type='text'
							name='username'
							required
						/>
						<input
							type='password'
							name='password'
							required
						/>
						<button type='submit'>Log in with Switch</button>
						{actionData?.error && <p>{actionData.error}</p>}
					</Form>
				</div>
			</div>
		</Layout>
	);
}
