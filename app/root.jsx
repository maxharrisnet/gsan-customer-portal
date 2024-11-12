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

// export function ErrorBoundary() {
// 	const error = useRouteError();
// 	console.error(error);
// 	return (
// 		<html>
// 			<head>
// 				<title>Oh no!</title>
// 				<Meta />
// 				<Links />
// 			</head>
// 			<body>
// 				<p>Something went wrong: {error}</p>
// 				<Scripts />
// 			</body>
// 		</html>
// 	);
// }
