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
			<main className='content centered-content'>
				<h1 className={styles.heading}>GSAN Customer Portal</h1>
				<section className='section '>
					<div className='centered-content'>
						<h2>Login With Shopify</h2>
						{showForm && (
							<Form
								className={styles.form}
								method='post'
								action='/auth/login'
							>
								<label className={styles.label}>
									<span>Shop domain</span>
									<input
										className={styles.input}
										type='text'
										name='shop'
									/>
									<span>e.g: my-shop-domain.myshopify.com</span>
								</label>
								<button
									className={styles.button}
									type='submit'
								>
									Log in
								</button>
							</Form>
						)}
					</div>
					<div className='centered-content'>
						<h2>Login With Sonar</h2>
						<Form
							className={styles.form}
							method='post'
							action={`https://switch.sonar.software/api/v1/customer_portal/auth`}
						>
							<label className={styles.label}>
								<span>Username</span>
								<input
									className={styles.input}
									type='text'
									name='username'
								/>
							</label>
							<label className={styles.label}>
								<span>Password</span>
								<input
									className={styles.input}
									type='password'
									name='password'
								/>
							</label>
							<button
								className={styles.button}
								type='submit'
							>
								Log in
							</button>
						</Form>
						<a href='/service-provider'>Login as service provider</a>
					</div>
				</section>
			</main>
		</Layout>
	);
}
