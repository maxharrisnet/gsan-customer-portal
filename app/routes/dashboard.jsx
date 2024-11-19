import { loader } from './api.services';
import { useLoaderData } from '@remix-run/react';
import Layout from '../components/layout/Layout';
import dashboardStyles from '../styles/dashboard.css?url';
export const links = () => [{ rel: 'stylesheet', href: dashboardStyles }];

export { loader };

export function getLatencyClass(latency) {
	if (latency < 50) return 'latency-green';
	else if (latency < 150) return 'latency-orange';
	else return 'latency-red';
}

export default function Dashboard() {
	const { services } = useLoaderData();
	const showLatency = (modem) => {
		return modem.details.data.latency && modem.details.data.latency.data.length > 0 ? true : false;
	};
	return (
		<Layout>
			<div>
				<div className='container'>
					<div className='section'>
						<div className='card-body'>
							<h2 className='card-title'>Dashboard</h2>
							<h3 className='card-subtitle'>Welcome, =</h3>
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
