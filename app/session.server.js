import { createCookieSessionStorage, redirect } from '@remix-run/node';

export const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: 'user_session',
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secrets: [process.env.SESSION_SECRET],
		secure: process.env.NODE_ENV === 'production',
	},
});

export async function createUserSession(userData, authType, redirectTo) {
	const session = await sessionStorage.getSession();

	if (session.has('user')) {
		throw new Error('User session already exists');
	}

	if (!userData || !userData.account_id || !userData.username) {
		console.log('Invalid user data:', userData);
		throw new Error(`Invalid user data`);
	}

	session.set('user', {
		authType,
		userId: userData.contact_id,
		accountId: userData.account_id,
		username: userData.username,
		contactName: userData.contact_name,
		emailAddress: userData.email_address,
	});
	console.log('🐣 Created User session:', session.get('user'));

	const headers = {
		'Set-Cookie': await sessionStorage.commitSession(session),
	};

	return redirect(redirectTo, { headers });
}

export async function getUserSession(request) {
	const session = await sessionStorage.getSession(request.headers.get('Cookie'));
	if (session.has('user')) {
		// console.log('🐶 Found User session:', session.get('user'));
		return session.get('user');
	} else {
		return null;
	}
}

export async function destroyUserSession(request) {
	const session = await sessionStorage.getSession(request.headers.get('Cookie'));
	console.log('💣 Destroying User session:', session);
	return redirect('/login', {
		headers: {
			'Set-Cookie': await sessionStorage.destroySession(session),
		},
	});
}
