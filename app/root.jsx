import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from '@remix-run/react';
import globalStyles from './styles/global.css';

export const links = () => [{ rel: 'stylesheet', href: globalStyles }];

export default function Root() {
	return (
		<html>
			<head>
				<meta charSet='utf-8' />
				<meta
					name='viewport'
					content='width=device-width,initial-scale=1'
				/>
				<link
					rel='preconnect'
					href='https://cdn.shopify.com/'
				/>
				<link
					rel='stylesheet'
					href='https://cdn.shopify.com/static/fonts/inter/v4/styles.css'
				/>
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();
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
					<p style={{ textAlign: 'left', lineHeight: '1.4rem' }}>{error.statusText || error.message}</p>
				</div>
				<Scripts />
			</body>
		</html>
	);
}
