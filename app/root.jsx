import { json, redirect } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useRouteError } from '@remix-run/react';
import { getUserSession } from './session.server';
import { UserProvider } from './context/UserContext';
import globalStyles from './styles/global.css?url';

export const links = () => [
	{ rel: 'stylesheet', href: globalStyles },
	{ rel: 'preconnect', href: 'https://cdn.shopify.com/' },
	{ rel: 'stylesheet', href: 'https://cdn.shopify.com/static/fonts/inter/v4/styles.css' },
	// Inter font from Google Fonts
	{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap' },
];

export const loader = async ({ request }) => {
	const url = new URL(request.url);
	const path = url.pathname;
	console.log('🟢 Getting user session from Root.jsx');
	const user = await getUserSession(request);

	// If there is a user session and the path is /login, redirect to /dashboard
	if (path.includes('/login') && user) {
		console.log('🪶 Redirecting to dashboard');
		return redirect('/dashboard');
	}

	// If there is no user session and the path is not /login, redirect to /login
	if (!path.includes('/login') && !user) {
		console.log('🪶 Redirecting to login');
		return redirect('/login');
	}

	return json({ user });
};

export default function Root() {
	const { user } = useLoaderData();
	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<Meta />
				<Links />
			</head>
			<body>
				<UserProvider initialUser={user}>
					<Outlet />
				</UserProvider>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}

export function ErrorBoundary({ error }) {
	console.log(error);
	return (
		<html>
			<head>
				<title>Oh no!</title>
				<Meta />
				<Links />
			</head>
			<body>
				<div style={{ display: 'block', textAlign: 'center', height: '100vh', maxWidth: '800px', margin: '0 auto', padding: '80px' }}>
					<h1>Something went wrong</h1>
					<p style={{ textAlign: 'left', lineHeight: '1.4rem' }}>{error?.message}</p>
				</div>
				<Scripts />
			</body>
		</html>
	);
}
