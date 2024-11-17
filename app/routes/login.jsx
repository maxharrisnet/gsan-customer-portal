import { Link } from '@remix-run/react';
import Layout from '../components/layout/Layout';

export default function Login() {
	return (
		<Layout>
			<div className='container'>
				<div className=' content-centered'>
					<h1>Login</h1>
					<div className='button-wrapper'>
						<Link
							to='/login/switch'
							className='button'
						>
							Login with Switch
						</Link>
						<Link
							to='/login/gsan'
							className='button'
						>
							Login with GSAN
						</Link>
					</div>
				</div>
			</div>
		</Layout>
	);
}
