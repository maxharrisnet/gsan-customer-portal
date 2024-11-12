import axios from 'axios';

export function getGPSURL(provider) {
	const baseUrl = 'https://api-compass.speedcast.com/v2.0';
	switch (provider.toLowerCase) {
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
async function fetchGPS(provider, ids, accessToken) {
	// Proceed with API call
	const url = getGPSURL(provider.toLowerCase());
	const postData = { ids };

	try {
		const response = await axios.post(url, postData, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});

		console.log('📣 GPS Response:', response);

		if (response.status === 200) {
			return response.data;
		} else if (response.status === 429) {
			console.error('Error 429: Rate limit exceeded.');
			return null;
		} else {
			return `Error: HTTP code ${response.status}.`;
		}
	} catch (error) {
		console.error('Network Error:', error.message);
		return null;
	}
}

export default fetchGPS;
