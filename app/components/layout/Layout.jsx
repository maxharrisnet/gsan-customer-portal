import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './layout.css';

const Layout = ({ children }) => {
	return (
		<div>
			<Header />
			<div className='wrapper'>
				<Sidebar />
				<main className='main-content'>{children}</main>
			</div>
			<Footer />
		</div>
	);
};

export default Layout;
