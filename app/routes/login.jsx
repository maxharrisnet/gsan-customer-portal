import { Link } from '@remix-run/react';
import Layout from '../components/layout/Layout';

export default function Login() {
	return (
		<Layout>
			<div className='container'>
				<h1>Login</h1>
				<div className=' content-centered'>
					<div className='button-wrapper login-button-wrapper'>
						<div>
							<img
								src='/assets/images/switch-logo.png'
								alt='Switch Logo'
							/>
							<Link
								to='/switch/login'
								className='button'
							>
								Login with Switch
							</Link>
						</div>
						<div>
							<img
								src='/assets/images/GSAN-logo.png'
								alt='GSAN Logo'
							/>
							<Link
								to='/gsan/login'
								className='button'
							>
								Login with GSAN
							</Link>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}
