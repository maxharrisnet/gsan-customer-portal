import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import axios from 'axios';
import { getCompassAccessToken } from './api.get-compass-access-token';
import { BlockStack, Card, Text } from '@shopify/polaris';

export const loader = async () => {
	const accessToken = await getCompassAccessToken();
	const companyId = process.env.COMPASS_COMPANY_ID;
	const servicesUrl = `https://api-compass.speedcast.com/v2.0/company/${companyId}`;
	const modemDetailsUrl = (sysId) => `https://api-compass.speedcast.com/v2.0/starlink/${sysId}`;

	try {
		const servicesResponse = await axios.get(servicesUrl, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		const allServices = servicesResponse.data;
		console.log('allServices:', allServices);

		const servicesWithModemDetails = await Promise.all(
			allServices.map(async (service) => {
				if (service.modems && service.modems.length > 0) {
					const modemsWithDetails = await Promise.all(
						service.modems.map(async (modem) => {
							const detailsResponse = await axios.get(modemDetailsUrl(modem.type, modem.id), {
								headers: { Authorization: `Bearer ${accessToken}` },
							});
							return { ...modem, details: detailsResponse.data };
						})
					);
					return { ...service, modems: modemsWithDetails };
				}
				return service;
			})
		);

		return json({ services: servicesWithModemDetails });
	} catch (error) {
		console.error('Error fetching performance data:', error);
		throw new Response('Internal Server Error', { status: 500 });
	}
};

export default function Performance() {
	const { services } = useLoaderData();

	return (
		<div>
			<h1>Performance Data</h1>
			{services.length > 0 ? (
				services.map((service) => (
					<div key={service.id}>
						<h2>{service.name}</h2>
						{service.modems && service.modems.length > 0 ? (
							service.modems.map((modem) => (
								<div
									key={modem.id}
									className='row p-2'
								>
									<a
										href={`http://localhost/switch/modem_status_details.php?provider=${modem.type.toLowerCase()}&modemid=${modem.id}`}
										className='text-black text-decoration-none fw-bold'
									>
										<div
											className='card modem-card shadow-sm mb-0'
											onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
											onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '')}
										>
											<div className='card-body'>
												<div className='d-flex justify-content-between align-items-center'>
													<div className='w-25'>
														<h3 className='card-title fs-6'>{modem.name}</h3>
														<h4 className='card-subtitle h6 font-weight-bolder text-secondary'>{service.name}</h4>
													</div>
													{modem.details.data.latency.data && modem.details.data.latency.data.length > 0 ? (
														<div
															className='latency-bar-24h d-flex rounded'
															style={{ width: '70%', height: '50px' }}
														>
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
														<p className='mb-0'>No data available</p>
													)}
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
						<div className='row text-center'>
							<p>No services available.</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
