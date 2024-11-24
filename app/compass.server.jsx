import { json } from '@remix-run/node';
import axios from 'axios';
import { getCompassAccessToken } from './routes/api.get-compass-access-token';

export const fetchServicesAndModemData = async () => {
	console.log('🌽 Fetching services and modem data...');
	try {
		const accessToken = await getCompassAccessToken();
		const companyId = process.env.COMPASS_COMPANY_ID;

		const servicesUrl = `https://api-compass.speedcast.com/v2.0/company/${companyId}`;
		const modemDetailsUrl = (provider, modemId) => `https://api-compass.speedcast.com/v2.0/${encodeURI(provider.toLowerCase())}/${modemId}`;

		const servicesResponse = await axios.get(servicesUrl, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		const allServices = await servicesResponse.data;
		console.log('🌽 All services fetched');
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
		throw new Response('Internal Server Error', { status: 500 });
	}
};
