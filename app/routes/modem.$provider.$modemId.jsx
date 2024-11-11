import { useParams, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import axios from 'axios';
import { getCompassAccessToken } from './api.get-compass-access-token';

async function fetchModemDetails(url, accessToken) {
	try {
		const response = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		return response.data;
	} catch (error) {
		if (error.response) {
			const { status } = error.response;
			if (status === 401) {
				return { error: 'Unauthorized: Invalid API Key' };
			} else if (status === 404) {
				return { error: 'Modem not found' };
			} else {
				return { error: `Unexpected Error! (HTTP Code: ${status})` };
			}
		} else if (error.request) {
			return { error: 'Network Error: ' + error.message };
		} else {
			return { error: 'Unexpected Error: ' + error.message };
		}
	}
}

export const loader = async ({ params }) => {
	const { provider, modemId } = params;
	const accessToken = await getCompassAccessToken();
	const modemDetailsUrl = (provider, sysId) => `https://api-compass.speedcast.com/v2.0/${provider}/${sysId}`;
	const modemDetails = await fetchModemDetails(modemDetailsUrl(provider, modemId), accessToken);

	return json({ modemDetails });
};

export default function Performance() {
	const { provider, modemId } = useParams();
	const data = useLoaderData();

	return (
		<div>
			<h1>Modem Details</h1>
			<p>Provider: {provider}</p>
			<p>Modem ID: {modemId}</p>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}
