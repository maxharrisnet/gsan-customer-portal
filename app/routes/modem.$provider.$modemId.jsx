import { useParams, useLoaderData } from '@remix-run/react';
import { loader } from './api.modem';
import { LayoutComponent } from '../components/layout/LayoutComponent';
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
		<LayoutComponent>
			<div>
				<h1>Modem Details</h1>
				<p>Provider: {provider}</p>
				<p>Modem ID: {modemId}</p>
				<MapComponent gpsData={gpsData} />
				<ChartComponent
					chartId='latencyChart'
					chartType='line'
					chartData={{
						labels: latencyTimestamps,
						datasets: [{ label: 'Latency (ms)', data: latencyValues }],
					}}
					chartOptions={{
						scales: {
							y: {
								ticks: { callback: (value) => `${value}ms`, stepSize: 20 },
								beginAtZero: true,
							},
						},
					}}
				/>
				<ChartComponent
					chartId='throughputChart'
					chartType='line'
					chartData={{
						labels: throughputTimestamps,
						datasets: [
							{ label: 'Download Throughput (Mbps)', data: throughputDownload },
							{ label: 'Upload Throughput (Mbps)', data: throughputUpload },
						],
					}}
					chartOptions={{
						scales: {
							x: {
								type: 'time',
								time: { unit: 'hour', stepSize: 2, displayFormats: { hour: 'HH:mm' } },
								title: { display: true, text: 'Time (Every 2 Hours)' },
								tooltipFormat: 'MMM d, HH:mm',
							},
							y: {
								ticks: { callback: (value) => `${value}Mbps`, stepSize: 5 },
								beginAtZero: true,
							},
						},
						plugins: { legend: { display: true, position: 'bottom' } },
					}}
				/>
				<ChartComponent
					chartId='obstructionChart'
					chartType='line'
					chartData={{
						labels: obstructionLabels,
						datasets: [{ label: 'Obstruction (%)', data: obstructionValues }],
					}}
					chartOptions={{
						scales: {
							y: {
								ticks: { callback: (value) => `${value}%`, stepSize: 50 },
								max: 100,
								beginAtZero: true,
							},
						},
					}}
				/>
				<ChartComponent
					chartId='uptimeChart'
					chartType='line'
					chartData={{
						labels: uptimeLabels,
						datasets: [{ label: 'Uptime', data: uptimeValues, stepped: true }],
					}}
					chartOptions={{
						scales: {
							y: {
								min: 0,
								beginAtZero: true,
								ticks: { stepSize: 0.5 },
							},
						},
					}}
				/>
			</div>
		</LayoutComponent>
	);
}
