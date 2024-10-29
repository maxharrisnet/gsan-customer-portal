import { useLoaderData } from '@remix-run/react';

export const loader = () => {
	// If GSAN admin Get all customers
	// Else get customers according to logged in provider

	return {};
};

function CustomerList() {
	// const { customers } = useLoaderData();

	return (
		<div>
			<h1>Customers</h1>
			<div>{/* Customer List */}</div>
		</div>
	);
}

export default CustomerList();
