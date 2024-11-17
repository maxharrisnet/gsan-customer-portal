import { json, redirect } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useRouteError } from '@remix-run/react';
// import { authenticate } from './shopify.server';
import globalStyles from './styles/global.css?url';

export const links = () => [
	{ rel: 'stylesheet', href: globalStyles },
	{ rel: 'preconnect', href: 'https://cdn.shopify.com/' },
	{ rel: 'stylesheet', href: 'https://cdn.shopify.com/static/fonts/inter/v4/styles.css' },
];

export const loader = async ({ request }) => {
	const url = new URL(request.url);

	if (url.pathname.startsWith('/gsan/login')) {
		return json({});
	}

	// await authenticate(request);

	return json({});
};

export default function Root() {
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
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}

export function ErrorBoundary({ error }) {
	console.error(error);
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
