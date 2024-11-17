import { createCookieSessionStorage, redirect } from '@remix-run/node';

export const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: 'user_session',
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secrets: [process.env.SESSION_SECRET], // Set this in your .env file
		secure: process.env.NODE_ENV === 'production',
	},
});

export async function createUserSession(userData, authType, redirectTo) {
	const session = await sessionStorage.getSession();
	session.set('user', { ...userData, authType });
	console.log('🍪🍪🍪 Created User session:', userData, session);
	return redirect(redirectTo, {
		headers: {
			'Set-Cookie': await sessionStorage.commitSession(session),
		},
	});
}

export async function getUserSession(request) {
	const session = await sessionStorage.getSession(request.headers.get('Cookie'));
	if (session.has('user')) {
		return session.get('user');
	} else {
		return null;
	}
}

export async function destroyUserSession(request) {
	const session = await sessionStorage.getSession(request.headers.get('Cookie'));
	console.log('🍪 Destroying User session:', session);
	return redirect('/', {
		headers: {
			'Set-Cookie': await sessionStorage.destroySession(session),
		},
	});
}
