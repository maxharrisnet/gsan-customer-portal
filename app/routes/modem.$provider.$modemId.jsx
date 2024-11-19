import { useEffect, useRef } from 'react';
import { useLoaderData } from '@remix-run/react';
import { loader } from './api.modem';
import Layout from '../components/layout/Layout';
import Sidebar from '../components/layout/Sidebar';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import chartStyles from '../styles/charts.css?url';

export const links = () => [{ rel: 'stylesheet', href: chartStyles }];

export { loader };

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend);

export default function ModemDetails() {
	const { modem, gpsData, mapsAPIKey, latencyData, throughputData, signalQualityData, obstructionData, usageData, uptimeData } = useLoaderData();

	const latencyTimestamps = latencyData.map((entry) => new Date(entry[0] * 1000).toLocaleTimeString());
	const latencyValues = latencyData.map((entry) => entry[1]);

	const throughputTimestamps = throughputData.map((entry) => new Date(entry[0] * 1000).toLocaleTimeString());
	const throughputDownload = throughputData.map((entry) => entry[1]);
	const throughputUpload = throughputData.map((entry) => entry[2]);

	const signalQualityLabels = signalQualityData.map((entry) => new Date(entry[0] * 1000).toLocaleTimeString());
	const signalQualityValues = signalQualityData.map((entry) => entry[1]);

	const obstructionLabels = obstructionData.map((entry) => new Date(entry[0] * 1000).toLocaleTimeString());
	const obstructionValues = obstructionData.map((entry) => entry[1] * 100);

	const usageLabels = usageData.map((entry) => new Date(entry[0] * 1000).toLocaleTimeString());
	const usageDownload = usageData.map((entry) => entry[1]);
	const usageUpload = usageData.map((entry) => entry[2]);

	const uptimeLabels = uptimeData.map((entry) => new Date(entry[0] * 1000).toLocaleTimeString());
	const uptimeValues = uptimeData.map((entry) => Math.ceil((entry[1] / 86400) * 10) / 10);

	const usageChartRef = useRef(null);
	const signalQualityChartRef = useRef(null);
	const throughputChartRef = useRef(null);
	const latencyChartRef = useRef(null);
	const obstructionChartRef = useRef(null);
	const uptimeChartRef = useRef(null);

	// Set global defaults for Chart.js
	ChartJS.defaults.global = {
		...ChartJS.defaults.global,
		responsive: true,
		maintainAspectRatio: false,
		height: 200,
		plugins: {
			legend: {
				display: false,
				position: 'bottom',
			},
		},
		elements: {
			point: {
				radius: 0,
				hoverRadius: 5,
				hoverBorderWidth: 1,
				backgroundColor: '#3986a8',
				borderColor: '#3986a8',
			},
			bar: {
				backgroundColor: '#3986a8',
				borderWidth: 1,
			},
			line: {
				hitRadius: 15,
				borderCapStyle: 'round',
				borderColor: '#3986a8',
				borderWidth: 1,
				fill: true,
			},
		},
	};

	ChartJS.defaults.global.height = 200;
	ChartJS.defaults.plugins.legend.display = false;
	ChartJS.defaults.plugins.legend.position = 'bottom';
	ChartJS.defaults.elements.point.radius = 0;
	ChartJS.defaults.elements.point.hoverRadius = 5;
	ChartJS.defaults.elements.point.hoverBorderWidth = 1;
	ChartJS.defaults.elements.point.backgroundColor = '#3986a8';
	ChartJS.defaults.elements.point.borderColor = '#3986a8';

	// Bar Chart Defaults
	ChartJS.defaults.elements.bar.backgroundColor = '#3986a8';
	ChartJS.defaults.elements.bar.borderWidth = 1;

	// Line Chart Defaults
	ChartJS.defaults.elements.line.hitRadius = 15;
	ChartJS.defaults.elements.line.borderCapStyle = 'round';
	ChartJS.defaults.elements.line.borderColor = '#3986a8';
	ChartJS.defaults.elements.line.borderWidth = 1;
	ChartJS.defaults.elements.line.fill = true;

	useEffect(() => {
		return () => {
			// Clean up chart instances on component unmount to prevent reuse issues
			if (usageChartRef.current) {
				usageChartRef.current.destroy();
				usageChartRef.current = null;
			}
			if (signalQualityChartRef.current) {
				signalQualityChartRef.current.destroy();
				signalQualityChartRef.current = null;
			}
			if (throughputChartRef.current) {
				throughputChartRef.current.destroy();
				throughputChartRef.current = null;
			}
			if (latencyChartRef.current) {
				latencyChartRef.current.destroy();
				latencyChartRef.current = null;
			}
			if (obstructionChartRef.current) {
				obstructionChartRef.current.destroy();
				obstructionChartRef.current = null;
			}
			if (uptimeChartRef.current) {
				uptimeChartRef.current.destroy();
				uptimeChartRef.current = null;
			}
		};
	}, []);

	return (
		<Layout>
			<Sidebar>
				<h2>{modem.name}</h2>
				<p>{modem.type}</p>
				<p>{modem.id}</p>
			</Sidebar>
			<main className='content'>
				<section className='map-wrapper'>
					<APIProvider apiKey={mapsAPIKey}>
						<Map
							style={{ width: '100%', height: '400px' }}
							defaultCenter={{ lat: gpsData[0].lat, lng: gpsData[0].lon }}
							defaultZoom={3}
							gestureHandling={'greedy'}
							disableDefaultUI={true}
						/>
					</APIProvider>
				</section>
				<section className='section chart-wrapper'>
					<h2>Usage</h2>
					<Bar
						data={{
							labels: usageLabels,
							datasets: [
								{ label: 'Download (GB)', data: usageDownload.map((value) => Math.ceil(value / 1000000)) },
								{ label: 'Upload (GB)', data: usageUpload.map((value) => Math.ceil(value / 1000000)) },
							],
						}}
						options={{
							scales: {
								y: {
									ticks: { callback: (value) => `${value}GB`, stepSize: 100 },
									beginAtZero: true,
								},
							},
						}}
					/>
				</section>
				<section className='section chart-wrapper'>
					<h2>Signal Quality</h2>
					<Line
						data={{
							labels: signalQualityLabels,
							datasets: [{ label: 'Signal Quality (%)', data: signalQualityValues }],
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
				</section>
				<section className='section chart-wrapper'>
					<h2>Throughput</h2>
					<Line
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
				</section>
				<section className='section chart-wrapper'>
					<h2>Latency</h2>
					<Line
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
				</section>
				<section className='section chart-wrapper'>
					<h2>Obstruction</h2>
					<Line
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
				</section>
				<section className='section chart-wrapper'>
					<h2>Uptime</h2>
					<Line
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
				</section>
			</main>
		</Layout>
	);
}
