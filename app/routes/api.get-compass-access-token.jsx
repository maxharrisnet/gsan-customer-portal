import { json } from '@remix-run/node';
import axios from 'axios';

// API variables
const username = process.env.COMPASS_API_USERNAME;
const password = process.env.COMPASS_API_PASSWORD;
const apiEndpoint = 'https://api-compass.speedcast.com/v2.0';

export const loader = async () => {
	try {
		const accessToken = await getCompassAccessToken();
		return json({ accessToken });
	} catch (error) {
		return json({ message: error.message }, { status: 500 });
	}
};

export async function getCompassAccessToken() {
	try {
		const response = await axios.post(`${apiEndpoint}/auth`, {
			username,
			password,
		});

		const accessToken = response.data.access_token;
		return accessToken;
	} catch (error) {
		console.error('Error retrieving access token:', error);
		throw new Error('Error retrieving access token');
	}
}
