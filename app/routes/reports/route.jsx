import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import axios from 'axios';
import { getCompassAccessToken } from '../api.get-compass-access-token';
import Layout from '../../components/layout/Layout';
import * as WebDataRocksReact from '@webdatarocks/react-webdatarocks';

export const loader = async () => {
	const accessToken = await getCompassAccessToken();
	const companyId = process.env.COMPASS_COMPANY_ID;
	const servicesUrl = `https://api-compass.speedcast.com/v2.0/company/${companyId}`;
	const modemDetailsUrl = (provider, modemId) => `https://api-compass.speedcast.com/v2.0/${provider.toLowerCase()}/${modemId}`;

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
		throw new Response('Internal Server Error', { status: 500 });
	}
};

const Reports = () => {
	const { services } = useLoaderData();
	const loaderData = useLoaderData();

	const yourReportObject = {
		dataSource: {
			filename: 'https://cdn.webdatarocks.com/data/data.csv',
		},
		slice: {
			rows: [
				{
					uniqueName: 'Category',
				},
			],
			columns: [
				{
					uniqueName: 'Measures',
				},
			],
			measures: [
				{
					uniqueName: 'Price',
					aggregation: 'sum',
					format: 'currency',
				},
			],
		},
	};

	return (
		<Layout>
			<div>
				<WebDataRocksReact.Pivot
					toolbar={true}
					report={yourReportObject}
					reportcomplete={this.onReportComplete}
				/>
			</div>
		</Layout>
	);
};

export default Reports;
