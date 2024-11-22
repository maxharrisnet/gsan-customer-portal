import { json, redirect } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useRouteError } from '@remix-run/react';
import { getUserSession } from './session.server';
import { UserProvider } from './context/UserContext';
import globalStyles from './styles/global.css?url';

export const links = () => [
	{ rel: 'stylesheet', href: globalStyles },
	{ rel: 'preconnect', href: 'https://cdn.shopify.com/' },
	{ rel: 'stylesheet', href: 'https://cdn.shopify.com/static/fonts/inter/v4/styles.css' },
];

export const loader = async ({ request }) => {
	const url = new URL(request.url);
	const path = url.pathname;
	const user = await getUserSession(request);

	console.log('🏀 Page Loader: ', path);

	// If there is a user session and the path is /login, redirect to /dashboard
	if (path.endsWith('/login') && user) {
		console.log('🏓 Redirecting to dashboard');
		return redirect('/dashboard');
	}

	// If there is no user session and the path is not /login, redirect to /login
	// if (!path.endsWith('/login') && !user) {
	// 	console.log('🏓 Redirecting to login');
	// 	return redirect('/login');
	// }

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
