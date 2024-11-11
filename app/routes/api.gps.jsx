import axios from 'axios';
import fs from 'fs';
import path from 'path';

export function getGPSURL(provider) {
	const baseUrl = 'https://api-compass.speedcast.com/v2.0';

	switch (provider) {
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
	const cacheFile = path.join(__dirname, 'data', 'gps_cache.json');

	// Check if cache exists and is still valid (e.g., 5 minutes expiration)
	if (fs.existsSync(cacheFile) && Date.now() - fs.statSync(cacheFile).mtimeMs < 300000) {
		return JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
	}

	// Proceed with API call
	const url = getGPSURL(provider);
	const postData = { ids };

	try {
		const response = await axios.post(url, postData, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});

		if (response.status === 200) {
			fs.writeFileSync(cacheFile, JSON.stringify(response.data)); // Save to cache
			return response.data;
		} else if (response.status === 429) {
			console.error('Error 429: Rate limit exceeded. Using cached data...');
			return fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, 'utf-8')) : null;
		} else {
			return `Error: HTTP code ${response.status}.`;
		}
	} catch (error) {
		console.error('Network Error:', error.message);
		return null;
	}
}

export default fetchGPS;
