import React from 'react';
import { Link } from '@remix-run/react';

const Header = () => {
	return (
		<header className='header'>
			<div className='header-container'>
				<div className='logo'>
					<img
						src='/assets/images/GSAN-logo.png'
						alt='GSAN Logo'
					/>
				</div>
				<nav className='nav'>
					<ul className='nav-list'>
						<li className='nav-item'>
							<Link to='/'>Map View</Link>
						</li>
						<li className='nav-item'>
							<Link to='/performance'>Performance</Link>
						</li>
						<li className='nav-item'>
							<Link to='/reports'>Reports</Link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default Header;
