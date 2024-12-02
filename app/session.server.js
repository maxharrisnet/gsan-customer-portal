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
	console.log('🥚 Creating session');
	try {
		const session = await sessionStorage.getSession();

		if (session.has('user')) {
			throw new Error('🐔 User session already exists');
		}

		if (!userData) {
			console.log('Invalid user data:', userData);
			throw new Error(`Invalid user data`);
		}

		if (!authType) {
			console.log('Invalid auth type:', authType);
			throw new Error(`Invalid auth type`);
		}

		if (!redirectTo) {
			console.log('Invalid redirect:', redirectTo);
			throw new Error(`Invalid redirect`);
		}

		if (authType === 'sonar') {
			if (!userData.account_id || !userData.username) {
				console.log('Invalid Sonar user data:', userData);
				throw new Error(`Invalid Sonar user data`);
			}
			session.set('user', {
				authType,
				userId: userData.contact_id,
				accountId: userData.account_id,
				username: userData.username,
				contactName: userData.contact_name,
			});
		} else if (authType === 'shopify') {
			if (!userData.accessToken) {
				console.log('Invalid Shopify user data:', userData);
				throw new Error(`Invalid Shopify user data`);
			}
			session.set('user', {
				authType,
				accessToken: userData.accessToken,
			});
		} else {
			console.log('Unknown auth type:', authType);
			throw new Error(`Unknown auth type`);
		}

		console.log('🐣 Created User session:', session.get('user'));

		const headers = {
			'Set-Cookie': await sessionStorage.commitSession(session),
		};

		return redirect(redirectTo, { headers });
	} catch (error) {
		console.error('Error creating user session:', error);
		throw error;
	}
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
	console.log('💣 Destroying User session:', session);
	return redirect('/login', {
		headers: {
			'Set-Cookie': await sessionStorage.destroySession(session),
		},
	});
}
