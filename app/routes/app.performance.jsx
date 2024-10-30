import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import axios from 'axios';
import { getCompassAccessToken } from './api.get-compass-access-token';

export const loader = async () => {
	try {
		const accessToken = await getCompassAccessToken();
		const companyId = process.env.COMPASS_COMPANY_ID;
		const apiUrl = `https://api-compass.speedcast.com/v2.0/company/${companyId}`;

		const response = await axios.get(apiUrl, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		return json({ performanceData: response.data });
	} catch (error) {
		console.error('Error fetching performance data:', error);
		throw new Response('Internal Server Error', { status: 500 });
	}
};

export default function Performance() {
	const { performanceData } = useLoaderData();

	return (
		<div>
			<h1>Performance Data</h1>
			<ul>
				{performanceData.map((data) => (
					<li key={data.id}>
						{data.metric}: {data.value}
					</li>
				))}
			</ul>
		</div>
	);
}
