import { json } from '@remix-run/node';
import axios from 'axios';
import { getCompassAccessToken } from './api.get-compass-access-token';
import fetchGPS from './api.gps';

export const loader = async ({ params }) => {
	const { provider, modemId } = params;
	const accessToken = await getCompassAccessToken();

	const modemDetailsURL = `https://api-compass.speedcast.com/v2.0/${provider.toLowerCase()}/${modemId}`;
	const modemDetails = await fetchModemDetails(modemDetailsURL, accessToken);

	if (!modemDetails) {
		throw new Response('No data available for modem', { status: 404 });
	}

	return json(modemDetails);
};

export default async function fetchModemDetails(url, accessToken) {
	try {
		const modemResponse = await axios.get(url, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		const modem = modemResponse.data;
		// console.log('### modem:', modem);
		const gpsData = await fetchGPS(modem.type, [modem.id], accessToken);
		const latencyData = modem.data.latency.data || [];
		const throughputData = modem.data.throughput.data || [];
		const signalQualityData = modem.data.signal.data || [];
		const obstructionData = modem.data.obstruction.data || [];
		const usageData = modem.usage || [];
		const uptimeData = modem.data.uptime.data || [];

		return {
			modem,
			gpsData,
			latencyData,
			throughputData,
			signalQualityData,
			obstructionData,
			usageData,
			uptimeData,
		};
	} catch (error) {
		console.error('Error fetching modem details: ', error);
		return null;
	}
}
