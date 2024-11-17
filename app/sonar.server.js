import axios from 'axios';

const SONAR_API_URL = 'https://switch.sonar.software/api/v1';
const SONAR_API_USERNAME = process.env.SONAR_API_USERNAME;
const SONAR_API_PASSWORD = process.env.SONAR_API_PASSWORD;

const authenticateSonarUser = async function (username, password) {
	const sonarAuth = Buffer.from(`${SONAR_API_USERNAME}:${SONAR_API_PASSWORD}`).toString('base64');
	console.log('🍩 Authenticating Sonar auth: ', sonarAuth);
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

		console.log('🍩 Sonar authentication response: ', response);

		if (response.data && response.data.data && response.data.data.token) {
			return { success: true, token: response.data.data.token, username };
		} else {
			console.log('🐬 Sonar authentication failed:', response.data);
			return { success: false, error: '🐬 Authentication failed' };
		}
	} catch (error) {
		console.error('🏔️ Sonar authentication error:', error);
		return { success: false, error: '🍀 Authentication failed' };
	}
};

export default authenticateSonarUser;
