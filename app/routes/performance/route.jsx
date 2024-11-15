import { json } from '@remix-run/node';
import axios from 'axios';
import { useLoaderData } from '@remix-run/react';
import { getCompassAccessToken } from '../api.get-compass-access-token';
import Layout from '../../components/layout/Layout';
import performanceStyles from './performance.css?url';

export const links = () => [{ rel: 'stylesheet', href: performanceStyles }];

export const loader = async () => {
	const accessToken = await getCompassAccessToken();
	const companyId = process.env.COMPASS_COMPANY_ID;
	const servicesUrl = `https://api-compass.speedcast.com/v2.0/company/${companyId}`;
	const modemDetailsUrl = (provider, modemId) => `https://api-compass.speedcast.com/v2.0/${encodeURI(provider.toLowerCase())}/${modemId}`;

	try {
		const servicesResponse = await axios.get(servicesUrl, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		const allServices = await servicesResponse.data;

		const servicesWithModemDetails = await Promise.all(
			allServices.map(async (service) => {
				if (service.modems && service.modems.length > 0) {
					const modemsWithDetails = await Promise.all(
						service.modems.map(async (modem) => {
							const url = modemDetailsUrl(modem.type, modem.id);
							const detailsResponse = await axios.get(url, {
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
		throw new Response('Internal Server Error 🤔', { status: 500 });
	}
};

export function getLatencyClass(latency) {
	// Returns the class based on latency value
	if (latency < 50) return 'latency-green';
	else if (latency < 150) return 'latency-orange';
	else return 'latency-red';
}

export default function Performance() {
	const { services } = useLoaderData();

	return (
		<Layout>
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
											<div class='section'>
												<div className='card-body'>
													<div className='flex-row'>
														<div>
															<h3 className='card-title fs-6'>{modem.name}</h3>
															<h4 className='card-subtitle'> {service.name} </h4>
														</div>
														{modem.details.data.latency && modem.details.data.latency.data.length > 0 ? (
															<div
																className='latency-bar d-flex rounded'
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
															<span>No data available</span>
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
							<div className='text-center'>
								<p>No services available.</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
}
