import { json } from '@remix-run/node';
import axios from 'axios';
import { getCompassAccessToken } from './api.get-compass-access-token';
import fetchGPS from './api.gps';

export const loader = async ({ params }) => {
	const { provider, modemId } = params;
	const accessToken = await getCompassAccessToken();
	const modemDetailsURL = `https://api-compass.speedcast.com/v2.0/${encodeURIComponent(provider.toLowerCase())}/${modemId}`;

	try {
		const modemResponse = await axios.get(modemDetailsURL, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		const modem = modemResponse.data;

		const latencyData = modem.data.latency.data || [];
		const throughputData = modem.data.throughput.data || [];
		const signalQualityData = modem.data.signal.data || [];
		const obstructionData = modem.data.obstruction.data || [];
		const usageData = modem.usage || [];
		const uptimeData = modem.data.uptime.data || [];

		const mapsAPIKey = process.env.GOOGLE_MAPS_API_KEY;
		// const gpsResponse = await fetchGPS(provider, [modemId], accessToken);
		// console.log('🌍 🌍 🌍 GPS Response: ', gpsResponse);
		// const gpsData = gpsResponse.data;
		// console.log('🌍 🌍 🌍 GPS Data: ', gpsData);

		const modemDetails = {
			modem,
			mapsAPIKey,
			// gpsData,
			latencyData,
			throughputData,
			signalQualityData,
			obstructionData,
			usageData,
			uptimeData,
		};

		if (!modemDetails) {
			throw new Response('No data available for modem 🦤', { status: 404 });
		}

		return json(modemDetails);
	} catch (error) {
		console.error('🐵 Error fetching modem details: ', error);
		throw new Response('Internal Server Error 🦧', { status: 500 });
	}
};
