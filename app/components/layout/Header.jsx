import React from 'react';
import { Link, Form } from '@remix-run/react';

const Header = () => {
	return (
		<header className='header'>
			<div className='header-container'>
				<div className='logo'>
					<a href='/'>
						<img
							src='/assets/images/GSAN-logo.png'
							alt='GSAN Logo'
						/>
					</a>
				</div>
				<nav className='nav'>
					<ul className='nav-list'>
						<li className='nav-item'>
							<Link to='/login'>Login</Link>
						</li>
						<li className='nav-item'>
							<Link to='/dashboard'>Dashboard</Link>
						</li>
						<li className='nav-item'>
							{/* TODO: Make provider dynamic */}
							<Link to='/reports/starlink/usage'>Reports</Link>
						</li>
					</ul>
					<div className='user-avatar'>
						<img
							src='/assets/images/avatar.svg'
							alt='User Avatar'
							height='30'
							width='30'
						/>
						<Form
							method='post'
							action='/logout'
						>
							<button
								className='logout-button'
								type='submit'
							>
								Logout
							</button>
						</Form>
					</div>
				</nav>
			</div>
		</header>
	);
};

export default Header;
