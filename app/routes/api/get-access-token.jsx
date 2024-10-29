import { json } from '@remix-run/node';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// API variables
const username = process.env.COMPASS_API_USERNAME;
const password = process.env.COMPASS_API_PASSWORD;
const apiEndpoint = 'https://api-compass.speedcast.com/v2.0';
console.log(process.env);

let accessToken = null;

axios
	.post(`${apiEndpoint}/auth`, {
		username,
		password,
	})
	.then((response) => {
		const accessToken = response.data.access_token;
		console.log('Access token retrieved:', accessToken);
	})
	.catch((error) => {
		console.error('Error retrieving access token:', error);
	});

export const loader = async () => {
	if (!accessToken) {
		return json({ message: 'Access token not available' }, { status: 500 });
	}
	return json({ accessToken });
};
