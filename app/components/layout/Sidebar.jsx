import React from 'react';
// import './Sidebar.css';

const Sidebar = () => {
	return (
		<aside className='sidebar'>
			<ul className='sidebar-list'>
				<li className='sidebar-item'>
					<a href='#item1'>Item 1</a>
				</li>
				<li className='sidebar-item'>
					<a href='#item2'>Item 2</a>
				</li>
				<li className='sidebar-item'>
					<a href='#item3'>Item 3</a>
				</li>
				<li className='sidebar-item'>
					<a href='#item4'>Item 4</a>
				</li>
			</ul>
		</aside>
	);
};

export default Sidebar;
