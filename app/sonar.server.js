import axios from 'axios';
import { createUserSession } from './session.server';

const SONAR_API_URL = 'https://switch.sonar.software/api/v1';
const SONAR_API_USERNAME = process.env.SONAR_API_USERNAME;
const SONAR_API_PASSWORD = process.env.SONAR_API_PASSWORD;

const authenticateSonarUser = async function (username, password) {
	const sonarAuth = Buffer.from(`${SONAR_API_USERNAME}:${SONAR_API_PASSWORD}`).toString('base64');
	try {
		const response = await axios.post(
			`${SONAR_API_URL}/customer_portal/auth`,
			{
				username,
				password,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Authorization: `Basic ${sonarAuth}`,
				},
			}
		);

		console.log('🐬 Sonar authentication response: ', response);

		if (response.data && response.data.data) {
			createUserSession(response.data.data, 'sonar', '/dashboard');
			return { success: true, token: response.data.data.token, username };
		} else {
			return { success: false, error: '🐬 Authentication failed' };
		}
	} catch (error) {
		return { success: false, error: '🐬 Authentication failed' };
	}
};

export default authenticateSonarUser;
