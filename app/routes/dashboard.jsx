import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { fetchServicesAndModemData } from '../compass.server';
// import { getSonarAccountData, getSonarAccountGroupData, getSonarAccoutUsageData, getSonarInventoryItems } from '../sonar.server';
import Layout from '../components/layout/Layout';
import dashboardStyles from '../styles/dashboard.css?url';
import sonarMonitoring from '../data/sonarMonitoring.json'; // Import the placeholder data
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend, TimeScale);

export const links = () => [{ rel: 'stylesheet', href: dashboardStyles }];

export const loader = async ({ request }) => {
	// const user = await getUserSession(request);
	// const user = { accountId: 818 };
	// if (!user) {
	// 	return json({ error: 'Unauthorized' }, { status: 401 });
	// }

	try {
		console.log('🏈 Loading dashboard Servce data...');
		const services = await fetchServicesAndModemData();
		console.log('🏈 Finisehd loading dashboard Servce data:', services);
		return services;
	} catch (error) {
		console.error('Error loading dashboard data:', error);
		throw new Response('Failed to load dashboard data', { status: 500 });
	}

	// const accountResponse = await getSonarAccountData(user.accountId);
	// const sonarAccountData = accountResponse.customers;

	// const sonarGroupData = await Promise.all(
	// 	sonarAccountData.account_groups.map(async (id) => {
	// 		const groupResponse = await getSonarAccountGroupData(id);
	// 		return groupResponse.data;
	// 	})
	// );

	// const accountUsageResponse = await getSonarAccoutUsageData(user.accountId);
	// const sonarAccountUsageData = accountUsageResponse.data.granular;
	// console.log('🍀 sonarAccountUsageData:', sonarAccountUsageData);

	// const inventoryItemsResponse = await getSonarInventoryItems(user.accountId);
	// const sonarInventoryItems = await inventoryItemsResponse.data;
	// console.log('🍀 sonarInventoryItems:', sonarInventoryItems);

	// const monitoringData = sonarMonitoring.data;

	return services;
	// return json({ user, services, sonarAccountData, sonarGroupData, monitoringData });
};

export function getLatencyClass(latency) {
	if (latency < 50) return 'latency-green';
	else if (latency < 150) return 'latency-orange';
	else return 'latency-red';
}

export default function Dashboard() {
	// const { user, services, sonarAccountData, sonarGroupData, monitoringData } = useLoaderData();
	const { services } = useLoaderData();
	console.log('🏈 Services:', services);

	const showLatency = (modem) => {
		return modem.details.data.latency && modem.details.data.latency.data.length > 0 ? true : false;
	};

	// const memoryChartData = {
	// 	labels: monitoringData.snmp['17'].map((item) => new Date(item[0] * 1000).toLocaleTimeString()),
	// 	datasets: [
	// 		{
	// 			label: 'Total Memory',
	// 			data: monitoringData.snmp['17'].map((item) => item[1] / 1024), // Convert to MB
	// 			borderColor: '#1abc9c',
	// 			fill: false,
	// 		},
	// 		{
	// 			label: 'Used Memory',
	// 			data: monitoringData.snmp['16'].map((item) => item[1] / 1024), // Convert to MB
	// 			borderColor: '#e74c3c',
	// 			fill: false,
	// 		},
	// 	],
	// };

	// const cpuChartData = {
	// 	labels: monitoringData.snmp['15'].map((item) => new Date(item[0] * 1000).toLocaleTimeString()),
	// 	datasets: [
	// 		{
	// 			label: 'CPU Usage',
	// 			data: monitoringData.snmp['15'].map((item) => item[1]),
	// 			borderColor: '#e74c3c',
	// 			fill: false,
	// 		},
	// 	],
	// };

	// const icmpChartData = {
	// 	labels: monitoringData.icmp.map((item) => new Date(item[0] * 1000).toLocaleTimeString()),
	// 	datasets: [
	// 		{
	// 			label: 'Min Latency',
	// 			data: monitoringData.icmp.map((item) => item[1]),
	// 			borderColor: '#3498db',
	// 			fill: false,
	// 		},
	// 		{
	// 			label: 'Avg Latency',
	// 			data: monitoringData.icmp.map((item) => item[2]),
	// 			borderColor: '#2ecc71',
	// 			fill: false,
	// 		},
	// 		{
	// 			label: 'Max Latency',
	// 			data: monitoringData.icmp.map((item) => item[3]),
	// 			borderColor: '#e74c3c',
	// 			fill: false,
	// 		},
	// 	],
	// };

	return (
		<Layout>
			<div>
				<div className='container'>
					<div className='card-body dashboard-card'>
						<h1>Welcome, Telus</h1>
						{/* <h1>Welcome, {sonarAccountData.name}</h1> */}
						<div className='account-data'>
							<div className='account-data-wrapper'>
								<div className='account-data-item'>
									<h4>Account Status</h4>
									<p>Active</p>
									{/* <p>{sonarAccountData.account_status_id === 2 ? 'Active' : 'Inactive'}</p> */}
								</div>
								<div className='account-data-item'>
									<h4>Services</h4>
									<p>Starlink</p>
									{/* {sonarGroupData.map((group) => (
										<p key={group.id}>{group.name}</p>
									))} */}
								</div>
								<div className='account-data-item'>
									<h4>Account Type</h4>
									{/* <p>{sonarAccountData.account_type_id}</p> */}
								</div>
							</div>
						</div>
					</div>

					{services.length > 0 ? (
						services.map((service) => (
							<div key={service.id}>
								{service.modems && service.modems.length > 0 ? (
									service.modems.map((modem) => (
										<div
											key={modem.id}
											className=''
										>
											<a
												href={`/modem/${encodeURI(modem.type.toLowerCase())}/${modem.id}`}
												className='text-black text-decoration-none fw-bold'
											>
												<div className='section'>
													<div className='card-body'>
														<div className='flex-row'>
															<div>
																<h3 className='card-title fs-6'>{modem.name}</h3>
																<h4 className='card-subtitle'> {service.name} </h4>
															</div>
															<div className='data-wrapper'>
																{showLatency(modem) ? (
																	<div className='latency-bar'>
																		{modem.details.data.latency.data.map((latencyPoint, index) => {
																			const latencyValue = latencyPoint[1];
																			const latencyClass = getLatencyClass(latencyValue);
																			const segmentWidth = (10 / 1440) * 100; // 10 minutes out of 1440 minutes in 24 hours
																			return (
																				<div
																					key={index}
																					className={`latency-segment ${latencyClass}`}
																					style={{ width: `${segmentWidth}%` }}
																				></div>
																			);
																		})}
																	</div>
																) : (
																	<div className='empty-data'>
																		<span>No data available</span>
																	</div>
																)}
															</div>
														</div>
													</div>
												</div>
											</a>
										</div>
									))
								) : (
									<p>No modems available for service: {service.name}</p>
								)}
							</div>
						))
					) : (
						<div className='bg-light'>
							<div className='container-sm'>
								<div className='text-center'>
									<p>No services available.</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
}
