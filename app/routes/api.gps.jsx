import { json } from '@remix-run/node';
import axios from 'axios';

export function getGPSURL(provider) {
	const baseUrl = 'https://api-compass.speedcast.com/v2.0';
	switch (provider.toLowerCase()) {
		case 'starlink':
			return `${baseUrl}/starlinkgps`;
		case 'idirect':
			return `${baseUrl}/idirectgps`;
		case 'newtec':
			return `${baseUrl}/newtecgps`;
		case 'oneweb':
			return `${baseUrl}/oneweb`; // TODO: Test, fix with terminalId (see docs)
		default:
			return null;
	}
}

export const loader = async ({ params }) => {
	const { provider, ids } = params;
	const accessToken = process.env.COMPASS_ACCESS_TOKEN; // Ensure this is set in your environment

	const url = getGPSURL(provider.toLowerCase());
	const postData = { ids: ids.split(',') }; // Assuming ids are passed as a comma-separated string

	try {
		const response = await axios.post(url, postData, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});

		console.log('📣 GPS Response:', response);

		if (response.status === 200) {
			return json(response.data);
		} else if (response.status === 429) {
			console.error('Error 429: Rate limit exceeded.');
			return json({ error: 'Rate limit exceeded' }, { status: 429 });
		} else {
			return json({ error: `HTTP code ${response.status}` }, { status: response.status });
		}
	} catch (error) {
		console.error('Network Error:', error.message);
		return json({ error: 'Network Error' }, { status: 500 });
	}
};
