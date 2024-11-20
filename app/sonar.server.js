import axios from 'axios';

const SONAR_API_URL = 'https://switch.sonar.software/api/v1';
const SONAR_API_USERNAME = process.env.SONAR_API_USERNAME;
const SONAR_API_PASSWORD = process.env.SONAR_API_PASSWORD;
const sonarAuth = Buffer.from(`${SONAR_API_USERNAME}:${SONAR_API_PASSWORD}`).toString('base64');

const authenticateSonarUser = async function (username, password) {
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

export const getSonarAccountData = async function (accountId) {
	try {
		const response = await axios.get(`${SONAR_API_URL}/accounts/${accountId}`, {
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

export const getSonarAccoutUsageData = async function (accountId) {
	const endTime = Math.floor(Date.now() / 1000); // Current time in Unix timestamp
	const startTime = endTime - 24 * 60 * 60; // 24 hours ago in Unix timestamp

	try {
		const response = await axios.get(`${SONAR_API_URL}/accounts/${accountId}/granular_data_usage/${startTime}/${endTime}`, {
			headers: {
				Authorization: `Basic ${sonarAuth}`,
			},
		});

		if (response.data && response.data.data) {
			return { success: true, data: response.data.data };
		} else {
			return { success: false, error: 'Sonar account usage not found' };
		}
	} catch (error) {
		return { success: false, error: 'Sonar account usage not found' };
	}
};

export const getSonarInventoryItems = async function (accountId) {
	try {
		const response = await axios.get(`${SONAR_API_URL}/accounts/${accountId}/inventory_items`, {
			headers: {
				Authorization: `Basic ${sonarAuth}`,
			},
			params: {
				account_id: accountId,
			},
		});

		if (response.data && response.data.data) {
			return { success: true, data: response.data.data };
		} else {
			return { success: false, error: 'Sonar inventory items not found' };
		}
	} catch (error) {
		return { success: false, error: 'Sonar inventory items not found' };
	}
};
