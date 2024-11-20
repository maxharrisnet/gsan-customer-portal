import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { fetchServicesAndModemData } from '../compass.server';
import { getSonarAccountData, getSonarAccountGroupData, getSonarAccoutUsageData, getSonarInventoryItems } from '../sonar.server';
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

	const inventoryItemsResponse = await getSonarInventoryItems(user.accountId);
	const sonarInventoryItems = await inventoryItemsResponse.data;
	console.log('🍀 sonarInventoryItems:', sonarInventoryItems);

	return json({ user, services, sonarAccountData, sonarGroupData });
};

export function getLatencyClass(latency) {
	if (latency < 50) return 'latency-green';
	else if (latency < 150) return 'latency-orange';
	else return 'latency-red';
}

export default function Dashboard() {
	const { user, services, sonarAccountData, sonarGroupData } = useLoaderData();
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
						</div>
					</div>
				</div>
				<div className='container'>
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
