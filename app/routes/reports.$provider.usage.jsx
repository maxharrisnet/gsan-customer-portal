import { useEffect, useState } from 'react';
import { useParams, useLoaderData } from '@remix-run/react';
import { loader } from './api.services';
import Layout from './../components/layout/Layout';

export { loader };

const Reports = () => {
	const { services } = useLoaderData();
	console.log('📊 📊 📊 Data: ', services[0].modems[0].details.usage);
	const [WebDataRocks, setWebDataRocks] = useState(null);

	const flattenedData = services.flatMap((service) =>
		service.modems.flatMap((modem) => {
			const usage = Array.isArray(modem.details.usage) ? modem.details.usage : [modem.details.usage]; // Ensure usage is an array

			return usage.map((entry) => ({
				serviceName: service.name,
				serviceId: service.id,
				modemId: modem.id,
				date: entry.date,
				priority: entry.priority,
			}));
		})
	);

	useEffect(() => {
		import('@webdatarocks/react-webdatarocks')
			.then((module) => {
				setWebDataRocks(() => module.default);
			})
			.catch((error) => {
				console.error('Failed to load WebDataRocks:', error);
			});
	}, []);

	if (!WebDataRocks) {
		return <div>Loading...</div>;
	}

	return (
		<Layout>
			<div>
				<h1>Reports</h1>
				<section className='section'>
					<WebDataRocks
						toolbar={true}
						report={{
							dataSource: {
								data: flattenedData,
							},
							slice: {
								rows: [{ uniqueName: 'serviceName' }, { uniqueName: 'modemId' }, { uniqueName: 'date' }],
								columns: [{ uniqueName: 'Measures' }],
								measures: [
									{
										uniqueName: 'priority',
										aggregation: 'average',
									},
								],
							},
						}}
					/>
				</section>
			</div>
		</Layout>
	);
};

export default Reports;
