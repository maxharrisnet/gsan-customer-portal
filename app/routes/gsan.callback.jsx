import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const loader = async () => {
	console.log('💦 Shopify login callback worked');
	return redirect('/dashboard');
};

const GsanCallback = () => {
	const navigate = useNavigate();

	useEffect(() => {
		navigate('/dashboard');
	}, [navigate]);

	return null;
};

export default GsanCallback;
