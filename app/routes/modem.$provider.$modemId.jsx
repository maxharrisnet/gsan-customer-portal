import { useParams, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { getCompassAccessToken } from './api.get-compass-access-token';
import fetchGPS from './api.gps';
import fetchModemDetails from './api.modem';
import MapComponent from '../components/charts/MapComponent';
import LatencyChart from '../components/charts/LatencyChart';
import ThroughputChart from '../components/charts/ThroughputChart';
import ObstructionChart from '../components/charts/ObstructionChart';
import UptimeChart from '../components/charts/UptimeChart';

export const loader = async ({ params }) => {
	const { provider, modemId } = params;
	const accessToken = await getCompassAccessToken();

	const modemDetailsURL = (provider, modemId) => `https://api-compass.speedcast.com/v2.0/${provider}/${modemId}`;
	console.log('👓 modemDetailsURL:', modemDetailsURL);
	const modemDetails = await fetchModemDetails(modemDetailsURL, accessToken);

	if (!modemDetails) {
		throw new Response('No data available for modem 🦞', { status: 404 });
	}

	return json(modemDetails);
};

export default function ModemDetails() {
	const { provider, modemId } = useParams();
	const { modem, gpsData, latencyData, throughputData, signalQualityData, obstructionData, usageData, uptimeData } = useLoaderData();

	const latencyTimestamps = latencyData.map((entry) => new Date(entry[0] * 1000).toLocaleTimeString());
	const latencyValues = latencyData.map((entry) => entry[1]);

	const throughputTimestamps = throughputData.map((entry) => new Date(entry[0] * 1000).toLocaleTimeString());
	const throughputDownload = throughputData.map((entry) => entry[1]);
	const throughputUpload = throughputData.map((entry) => entry[2]);

	const obstructionLabels = obstructionData.map((entry) => new Date(entry[0] * 1000).toLocaleTimeString());
	const obstructionValues = obstructionData.map((entry) => entry[1] * 100);

	const uptimeLabels = uptimeData.map((entry) => new Date(entry[0] * 1000).toLocaleTimeString());
	const uptimeValues = uptimeData.map((entry) => Math.ceil((entry[1] / 86400) * 10) / 10);

	return (
		<div>
			<h1>Modem Details</h1>
			<p>Provider: {provider}</p>
			<p>Modem ID: {modemId}</p>
			<MapComponent gpsData={gpsData} />
			<LatencyChart
				latencyTimestamps={latencyTimestamps}
				latencyValues={latencyValues}
			/>
			<ThroughputChart
				throughputTimestamps={throughputTimestamps}
				throughputDownload={throughputDownload}
				throughputUpload={throughputUpload}
			/>
			<ObstructionChart
				obstructionLabels={obstructionLabels}
				obstructionValues={obstructionValues}
			/>
			<UptimeChart
				uptimeLabels={uptimeLabels}
				uptimeValues={uptimeValues}
			/>
		</div>
	);
}