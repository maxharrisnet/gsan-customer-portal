import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './layout.css';

const Layout = ({ children }) => {
	return (
		<div className='layout'>
			<Header />
			<div className='wrapper'>{children}</div>
			<Footer />
		</div>
	);
};

export default Layout;
