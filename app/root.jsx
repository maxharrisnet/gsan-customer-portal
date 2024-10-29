import { Links, Link, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';

export default function App() {
	return (
		<Document>
			<Layout>
				<Outlet />
			</Layout>
		</Document>
	);
}

function Document({ children, title }) {
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
				{children}
				<ScrollRestoration />
				<Scripts />
				{process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
			</body>
		</html>
	);
}

function Layout({ children }) {
	return (
		<>
			<nav className='navbar'>
				<Link to='/'>Status</Link>
				<div className='container'>{children}</div>
			</nav>
		</>
	);
}

export function ErrorBoundary({ error }) {
	console.log(error);
	return (
		<Document>
			<Layout>
				<h1>Error</h1>
				<p>{error.message}</p>
			</Layout>
		</Document>
	);
}
