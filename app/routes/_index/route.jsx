import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { login } from '../../shopify.server';
import Layout from '../../components/layout/Layout';
import styles from './styles.module.css';

export const loader = async ({ request }) => {
	const url = new URL(request.url);

	if (url.searchParams.get('shop')) {
		throw redirect(`/app?${url.searchParams.toString()}`);
	}

	return json({ showForm: Boolean(login) });
};

export default function App() {
	const { showForm } = useLoaderData();

	return (
		<Layout>
			<main className='content content-centered'>
				<h1 className={styles.heading}>GSAN Customer Portal</h1>
			</main>
		</Layout>
	);
}
