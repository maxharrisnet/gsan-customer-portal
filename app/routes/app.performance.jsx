import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import axios from 'axios';
import { getCompassAccessToken } from './api.get-compass-access-token';

export const loader = async () => {
	try {
		const accessToken = await getCompassAccessToken();
		const companyId = process.env.COMPASS_COMPANY_ID;
		const servicesUrl = `https://api-compass.speedcast.com/v2.0/company/${companyId}`;
		const modemDetailsUrl = (sysId) => `https://api-compass.speedcast.com/v2.0/starlink/${sysId}`;

		const servicesResponse = await axios.get(servicesUrl, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		const allServices = servicesResponse.data;

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
	const { performanceData } = useLoaderData();
	console.log(performanceData);
	return (
		<div>
			<h1>Performance Data</h1>
			<ul>
				{performanceData.map((data) => (
					<li key={data.service_id}>
						{data.name}: {data.service_id}
					</li>
				))}
			</ul>
		</div>
	);
}
