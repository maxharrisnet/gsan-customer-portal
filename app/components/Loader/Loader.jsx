import React, { useEffect, useState } from 'react';
import styles from './styles.module.css'; // Assuming you have a CSS file for styling

const Loader = () => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulate data fetching
		const timer = setTimeout(() => {
			setLoading(false);
		}, 3000); // Adjust the timeout duration as needed

		return () => clearTimeout(timer);
	}, []);

	if (!loading) {
		return null;
	}

	return (
		<div className={styles.overlay}>
			<div className={styles.spinner}></div>
		</div>
	);
};

export default Loader;
