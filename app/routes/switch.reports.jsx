import { json } from '@remix-run/node';
import { useEffect, useState } from 'react';
import { useLoaderData } from '@remix-run/react';
import { getUserSession } from '../session.server';
import { getSonarAccoutUsageData } from '../sonar.server';
import Layout from '../components/layout/Layout';
import Sidebar from '../components/layout/Sidebar';

export const loader = async ({ request }) => {
	// const user = await getUserSession(request);
	const user = { accountId: 1 };
	const response = await getSonarAccoutUsageData(user.accountId);
	const usageData = response.json();
	console.log('🐬 usage:', usageData);
	const flattenedData = flattenData(usageData);

	return json({ data: flattenedData });
};

function flattenData(response) {
	const flatData = [];
	response.data.granular.series.forEach((series) => {
		e;
		Object.entries(series.in).forEach(([timestamp, value]) => {
			flatData.push({
				data_source_identifier: series.data_source_identifier,
				data_source_parent: series.data_source_parent,
				data_type: series.data_type,
				timestamp: parseInt(timestamp),
				value: value,
			});
		});
	});
	return flatData;
}

export default function SonarReports() {
	const { usage } = useLoaderData();
	const [WebDataRocks, setWebDataRocks] = useState(null);

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
		return (
			<Layout>
				<Sidebar>
					<h1>Reports</h1>
				</Sidebar>
				<main className='content'>
					<section className='section'>
						<div>Loading...</div>
					</section>
				</main>
			</Layout>
		);
	}

	return (
		<Layout>
			<Sidebar>
				<h1>Reports</h1>
			</Sidebar>
			<main className='content'>
				<section className='section'>
					<WebDataRocks
						toolbar={true}
						width='100%'
						height='600px'
						report={{
							dataSource: {
								data: usage,
							},
							slice: {
								rows: [{ uniqueName: 'data_source_identifier' }, { uniqueName: 'data_source_parent' }, { uniqueName: 'data_type' }],
								columns: [{ uniqueName: 'timestamp' }],
								measures: [{ uniqueName: 'value', aggregation: 'sum' }],
							},
						}}
					/>
				</section>
			</main>
		</Layout>
	);
}
