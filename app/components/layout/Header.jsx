import React from 'react';
import { Link } from '@remix-run/react';
// import './Header.css';

const Header = () => {
	return (
		<header className='header'>
			<div className='header-container'>
				<div className='logo'>MyApp</div>
				<nav className='nav'>
					<ul className='nav-list'>
						<li className='nav-item'>
							<Link to='/'>Home</Link>
						</li>
						<li className='nav-item'>
							<Link to='/about'>About</Link>
						</li>
						<li className='nav-item'>
							<Link to='/services'>Services</Link>
						</li>
						<li className='nav-item'>
							<Link to='/contact'>Contact</Link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default Header;
