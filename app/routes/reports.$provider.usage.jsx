import { useEffect, useState } from 'react';
import { useLoaderData } from '@remix-run/react';
import { fetchServicesAndModemData } from '../compass.server';
import { useUser } from '../context/UserContext';
import Layout from './../components/layout/Layout';
import Sidebar from './../components/layout/Sidebar';

export const loader = async ({ request }) => {
	const response = await fetchServicesAndModemData();
	const servicesJSON = await response.json();
	const services = servicesJSON.services;

	return { services };
};

const Reports = () => {
	const { services } = useLoaderData();
	const [WebDataRocks, setWebDataRocks] = useState(null);

	// Helper function to calculate averages
	const calculateAverage = (arr) => (arr.length > 0 ? arr.reduce((sum, val) => sum + val, 0) / arr.length : 0);

	// Flatten and compute the necessary fields
	const flattenedData = services.flatMap((service) =>
		service.modems.map((modem) => {
			// Extract data safely
			const latencyData = modem.data?.latency?.data || [];
			const throughputData = modem.data?.throughput?.data || {};
			const signalQualityData = modem.data?.signal?.data || [];
			const uptimeData = modem.data?.uptime?.data || [];
			const usageData = modem.usage || [];

			// Calculate averages and totals
			const avgLatency = calculateAverage(latencyData).toFixed(2);
			const avgDownload = calculateAverage(throughputData.download || []).toFixed(2);
			const avgUpload = calculateAverage(throughputData.upload || []).toFixed(2);
			const avgSignal = calculateAverage(signalQualityData).toFixed(2);
			const avgUptime = calculateAverage(uptimeData).toFixed(2);

			const totalPriority = usageData.reduce((sum, u) => sum + (u.priority || 0), 0).toFixed(2);
			const totalStandard = usageData.reduce((sum, u) => sum + (u.standard || 0), 0).toFixed(2);

			return {
				Service: service.name,
				Status: modem.status === 'online' ? 'Online' : 'Offline',
				Kit: service.id,
				PriorityData: totalPriority, // in GB
				StandardData: totalStandard, // in GB
				UsageLimit: modem.details.meta.usageLimit || 'N/A', // in GB, or fallback
				AvgLatency: avgLatency, // in ms
				AvgDownloadThroughput: avgDownload, // in Mbps
				AvgUploadThroughput: avgUpload, // in Mbps
				AvgSignalQuality: avgSignal, // in %
				AvgUptime: avgUptime, // in %
			};
		})
	);

	useEffect(() => {
		import('@webdatarocks/react-webdatarocks')
			.then((module) => {
				setWebDataRocks(() => module.default);
			})
			.catch((error) => {
				console.error('Failed to load WebDataRocks:', error);
			});
	}, []);

	if (!WebDataRocks) {
		return (
			<Layout>
				<Sidebar>
					<h1>Reports</h1>
				</Sidebar>
				<main className='content'>
					<section className='section'>
						<div>Loading...</div>
					</section>
				</main>
			</Layout>
		);
	}

	return (
		<Layout>
			<Sidebar>
				<h1>Reports</h1>
			</Sidebar>
			<main className='content'>
				<section className='section'>
					<WebDataRocks
						toolbar={true}
						width='100%'
						height='600px'
						report={{
							dataSource: {
								data: flattenedData,
							},
							slice: {
								rows: [{ uniqueName: 'Service' }, { uniqueName: 'Kit' }],
								columns: [{ uniqueName: 'Measures' }],
								measures: [
									{ uniqueName: 'PriorityData', aggregation: 'sum' },
									{ uniqueName: 'StandardData', aggregation: 'sum' },
									{ uniqueName: 'UsageLimit', aggregation: 'sum' },
									{ uniqueName: 'AvgLatency', aggregation: 'average' },
									{ uniqueName: 'AvgDownloadThroughput', aggregation: 'average' },
									{ uniqueName: 'AvgUploadThroughput', aggregation: 'average' },
									{ uniqueName: 'AvgSignalQuality', aggregation: 'average' },
								],
							},
						}}
					/>
				</section>
			</main>
		</Layout>
	);
};

export default Reports;
