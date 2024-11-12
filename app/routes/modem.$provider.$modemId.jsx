import { useParams, useLoaderData } from '@remix-run/react';
import { loader } from './api.modem';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// import { LayoutComponent } from '../components/layout/LayoutComponent';
import MapComponent from '../components/charts/MapComponent';
import ChartComponent from '../components/charts/ChartComponent';

export { loader };

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
		// <LayoutComponent>
		<div>
			<h1>Modem Details</h1>
			<p>Provider: {provider}</p>
			<p>Modem ID: {modemId}</p>
			<MapComponent gpsData={gpsData} />
			<Line
				chartId='latencyChart'
				data={{
					labels: latencyTimestamps,
					datasets: [{ label: 'Latency (ms)', data: latencyValues }],
				}}
				options={{
					scales: {
						y: {
							ticks: { callback: (value) => `${value}ms`, stepSize: 20 },
							beginAtZero: true,
						},
					},
				}}
			/>
			<Line
				chartId='throughputChart'
				data={{
					labels: throughputTimestamps,
					datasets: [
						{ label: 'Download (Mbps)', data: throughputDownload },
						{ label: 'Upload (Mbps)', data: throughputUpload },
					],
				}}
				options={{
					scales: {
						y: {
							ticks: { callback: (value) => `${value}Mbps`, stepSize: 20 },
							beginAtZero: true,
						},
					},
				}}
			/>
			<Line
				chartId='obstructionChart'
				data={{
					labels: obstructionLabels,
					datasets: [{ label: 'Obstruction (%)', data: obstructionValues }],
				}}
				options={{
					scales: {
						y: {
							ticks: { callback: (value) => `${value}%`, stepSize: 20 },
							beginAtZero: true,
						},
					},
				}}
			/>
			<Line
				chartId='uptimeChart'
				data={{
					labels: uptimeLabels,
					datasets: [{ label: 'Uptime (%)', data: uptimeValues }],
				}}
				options={{
					scales: {
						y: {
							ticks: { callback: (value) => `${value}%`, stepSize: 20 },
							beginAtZero: true,
						},
					},
				}}
			/>
		</div>
		// </LayoutComponent>
	);
}
