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
	return redirect(redirectTo, {
		headers: {
			'Set-Cookie': await sessionStorage.commitSession(session),
		},
	});
}

export async function getUserSession(request) {
	const session = await sessionStorage.getSession(request.headers.get('Cookie'));
	console.log('🍪 User session:', session);
	return session.get('user');
}

export async function destroyUserSession(request) {
	const session = await sessionStorage.getSession(request.headers.get('Cookie'));
	return redirect('/', {
		headers: {
			'Set-Cookie': await sessionStorage.destroySession(session),
		},
	});
}
