import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { fetchServicesAndModemData } from '../compass.server';
import { getSonarAccountData, getSonarAccountGroupData, getSonarAccoutUsageData } from '../sonar.server';
import { Line } from 'react-chartjs-2';
import Layout from '../components/layout/Layout';
import dashboardStyles from '../styles/dashboard.css?url';

export const links = () => [{ rel: 'stylesheet', href: dashboardStyles }];

export const loader = async ({ request }) => {
	console.log('🏀 Dashboard loader');
	// const user = await getUserSession(request);
	const user = { accountId: 28 };
	const services = await fetchServicesAndModemData();

	const accountResponse = await getSonarAccountData(user.accountId);
	const sonarAccountData = accountResponse.customers;

	const sonarGroupData = await Promise.all(
		sonarAccountData.account_groups.map(async (id) => {
			const groupResponse = await getSonarAccountGroupData(id);
			return groupResponse.data;
		})
	);

	const accountUsageResponse = await getSonarAccoutUsageData(user.accountId);
	const sonarAccountUsageData = accountUsageResponse.data.granular;
	console.log('🍀 sonarAccountUsageData:', sonarAccountUsageData);

	// const inventoryItemsResponse = await getSonarInventoryItems(user.accountId);
	// const sonarInventoryItems = await inventoryItemsResponse.data;
	// console.log('🍀 sonarInventoryItems:', sonarInventoryItems);

	// const inventoryMonitoringData = await Promise.all(
	// 	sonarInventoryItems.map(async (item) => {
	// 		const response = await getMonitoringData(user.accountId, item.id);
	// 		console.log('🍀 Monitoring data response:', response);
	// 		return { itemId: item.id, data: response.data };
	// 	})
	// );
	// console.log('🍀 inventoryMonitoringData:', inventoryMonitoringData);
	return json({ user, services, sonarAccountData, sonarGroupData });
};

export function getLatencyClass(latency) {
	if (latency < 50) return 'latency-green';
	else if (latency < 150) return 'latency-orange';
	else return 'latency-red';
}

export default function Dashboard() {
	const { user, services, sonarAccountData, sonarGroupData, sonarInventoryItems, monitoringData } = useLoaderData();

	const showLatency = (modem) => {
		return modem.details.data.latency && modem.details.data.latency.data.length > 0 ? true : false;
	};

	return (
		<Layout>
			<div>
				<div className='container'>
					<div className='section'>
						<div className='card-body'>
							<h1>Welcome, {sonarAccountData.name}</h1>
							<div className='account-data'>
								<div className='account-data-wrapper'>
									<div className='account-data-item'>
										<h4>Account Status</h4>
										<p>{sonarAccountData.account_status_id === 2 ? 'Active' : 'Inactive'}</p>
									</div>
									<div className='account-data-item'>
										<h4>Services</h4>
										{sonarGroupData.map((group) => (
											<p key={group.id}>{group.name}</p>
										))}
									</div>
									<div className='account-data-item'>
										<h4>Account Type</h4>
										<p>{sonarAccountData.account_type_id}</p>
									</div>
								</div>
							</div>
							<div className='account-data'>
								<div className='account-data-wrapper'>
									<div className='account-data-item'>
										<h4>Account Status</h4>
										<p>{sonarAccountData.account_status_id === 2 ? 'Active' : 'Inactive'}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='container'>{/* Service Data Charts */}</div>
			</div>
		</Layout>
	);
}
