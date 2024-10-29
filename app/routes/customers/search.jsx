import { Link, redirect } from '@remix-run/react';

export const action = async ({ request }) => {
	const form = await request.formData();
	const user = form.get('user');

	console.log(user);
	// Show customer results
	return redirect('/customers');
};

function CustomerSearch() {
	return (
		<>
			<div className='page-header'>
				<h1>Search</h1>
				<Link
					to='/customers'
					className='btn btn-reverse'
				>
					Back
				</Link>
			</div>
			<div className='page-content'>
				<form method='POST'>
					<div className='for-control'>
						<label htmlFor='user'>User</label>
						<input
							type='search'
							name='user'
						/>
					</div>
				</form>
			</div>
		</>
	);
}

export default CustomerSearch;
