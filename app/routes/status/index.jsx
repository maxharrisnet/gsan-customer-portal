// Import necessary libraries
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import axios from 'axios';

// Loader function to fetch service data
export const loader = async () => {
	const accessToken = process.env.ACCESS_TOKEN; // Securely fetch access token

	if (!accessToken || accessToken.startsWith('Error')) {
		throw new Response('Invalid or missing access token', { status: 401 });
	}

	try {
		const allServices = await fetchAllServices(accessToken);

		if (!Array.isArray(allServices) || allServices.length === 0) {
			throw new Response('No services available', { status: 404 });
		}

		return json({ allServices });
	} catch (error) {
		console.error('Error fetching services:', error);
		throw new Response('Internal Server Error', { status: 500 });
	}
};

// Mock function to fetch services (replace with actual service fetching logic)
async function fetchAllServices(accessToken) {
	const companyId = process.env.COMPASS_COMPANY_ID;
	const serviceUrl = `https://api-compass.speedcast.com/v2.0/company/${companyId}`;

	const response = await axios.get(serviceUrl, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	return response.data; // Adjust according to your API response structure
}

async function fetchModemDetails($modemId, accessToken) {
	const url = `https://api-compass.speedcast.com/v2.0/starlink/${modemId}`;

	const response = await axios.get(url, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
}

export default function ServiceStatus() {
	const { allServices } = useLoaderData();

	return (
		<div className='bg-light'>
			<div className='container-sm'>
				<div className='row sticky-top bg-light p-4 mb-3 border-medium border-bottom'>
					<div>{/* Logo */}</div>
				</div>

				{/* Modem items */}
				{allServices.map((service, index) => (
					<div key={index}>
						<h3>{service.name}</h3>
						{service.modems && service.modems.length > 0 ? (
							service.modems.map((modem, idx) => (
								<div
									className='card mb-3'
									key={idx}
								>
									<div className='card-body'>
										<h5 className='card-title'>Modem ID: {modem.sysId}</h5>
										{/* Display additional modem details */}
										<p className='card-text'>Status: {modem.status}</p>
										<p className='card-text'>Signal Quality: {modem.signalQuality}</p>
									</div>
								</div>
							))
						) : (
							<p>No modems available for this service.</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
