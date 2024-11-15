// app/routes/customer-login.jsx
import { json, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import axios from 'axios';
import shopify from '../shopify.server';
import Layout from '../components/layout/Layout';

const SONAR_API_URL = 'https://switch.sonar.software/api/v1';

async function authenticateSonarUser(email, password) {
	try {
		const response = await axios.post(
			`${SONAR_API_URL}/users/authenticate`,
			{
				email,
				password,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			}
		);

		if (response.data && response.data.data && response.data.data.token) {
			return { success: true, token: response.data.data.token, email };
		} else {
			return { success: false, error: 'Authentication failed' };
		}
	} catch (error) {
		console.error('Sonar authentication error:', error);
		return { success: false, error: 'Authentication failed' };
	}
}

async function getShopifyCustomerByEmail(request, email) {
	const { admin } = await shopify.authenticate.admin(request);

	try {
		const response = await admin.graphql(
			`
      query($email: String!) {
        customers(first: 1, query: $email) {
          edges {
            node {
              id
              firstName
              lastName
              email
              orders(first: 5) {
                edges {
                  node {
                    id
                    name
                    totalPriceSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
			{ variables: { email } }
		);

		const customers = response.body.data.customers.edges;
		return customers.length > 0 ? customers[0].node : null;
	} catch (error) {
		console.error('Error fetching Shopify customer:', error);
		return null;
	}
}

export async function action({ request }) {
	const formData = await request.formData();
	const email = formData.get('email');
	const password = formData.get('password');

	const sonarAuth = await authenticateSonarUser(email, password);

	if (sonarAuth.success) {
		const shopifyCustomer = await getShopifyCustomerByEmail(request, email);

		if (shopifyCustomer) {
			// Store session info (implement this based on your needs)
			// For example, you could use cookies or server-side sessions
			return redirect('/customer-dashboard');
		} else {
			return json({ error: 'Customer not found in Shopify' }, { status: 404 });
		}
	} else {
		return json({ error: sonarAuth.error }, { status: 401 });
	}
}

export default function CustomerLogin() {
	const actionData = useActionData();

	return (
		<Layout>
			<main className='content centered-content'>
				<h1>GSAN Customer Portal</h1>
				<section className='section '>
					<div className='centered-content'>
						<h2>Login with Sonar</h2>
						<Form method='post'>
							<input
								type='email'
								name='email'
								required
							/>
							<input
								type='password'
								name='password'
								required
							/>
							<button type='submit'>Log in</button>
							{actionData?.error && <p>{actionData.error}</p>}
						</Form>
					</div>
				</section>
			</main>
		</Layout>
	);
}
