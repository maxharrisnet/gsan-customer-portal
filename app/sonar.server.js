import axios from 'axios';

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

		if (response.data && response.data.data) {
			return { success: true, userData: response.data.data };
		} else {
			return { success: false, error: 'Sonar authentication failed' };
		}
	} catch (error) {
		return { success: false, error: 'Sonar authentication failed' };
	}
};

export default authenticateSonarUser;

export const getSonarAccounts = async function () {
	const sonarAuth = Buffer.from(`${SONAR_API_USERNAME}:${SONAR_API_PASSWORD}`).toString('base64');
	try {
		const response = await axios.get(`${SONAR_API_URL}/accounts`, {
			headers: {
				Authorization: `Basic ${sonarAuth}`,
			},
			params: {
				limit: 10,
				page: 1,
			},
		});

		if (response.data && response.data.data) {
			return { success: true, customers: response.data.data };
		} else {
			return { success: false, error: 'Sonar customers not found' };
		}
	} catch (error) {
		return { success: false, error: 'Sonar customers not found' };
	}
};

export const getSonarAccountData = async function (account_id) {
	const sonarAuth = Buffer.from(`${SONAR_API_USERNAME}:${SONAR_API_PASSWORD}`).toString('base64');
	try {
		const response = await axios.get(`${SONAR_API_URL}/accounts/${account_id}`, {
			headers: {
				Authorization: `Basic ${sonarAuth}`,
			},
		});

		if (response.data && response.data.data) {
			return { success: true, customers: response.data.data };
		} else {
			return { success: false, error: 'Sonar customer not found' };
		}
	} catch (error) {
		return { success: false, error: 'Sonar customer not found' };
	}
};

export const getSonarAccountGroupData = async function (group_id) {
	const sonarAuth = Buffer.from(`${SONAR_API_USERNAME}:${SONAR_API_PASSWORD}`).toString('base64');
	try {
		const response = await axios.get(`${SONAR_API_URL}/system/account_groups/${group_id}`, {
			headers: {
				Authorization: `Basic ${sonarAuth}`,
			},
		});

		if (response.data && response.data.data) {
			return { success: true, data: response.data.data };
		} else {
			return { success: false, error: 'Sonar account group not found' };
		}
	} catch (error) {
		return { success: false, error: 'Sonar account group not found' };
	}
};
