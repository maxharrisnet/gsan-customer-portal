import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
// import './layout.css';

const LayoutComponent = ({ children }) => {
	return (
		<div>
			<Headeer />
			<div>
				<Sidebar />
				<main>{children}</main>
			</div>
			<Footer />
		</div>
	);
};

export default LayoutComponent;
