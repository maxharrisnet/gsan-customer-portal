import { useEffect, useState } from 'react';
import { useParams, useLoaderData } from '@remix-run/react';
import { loader } from './api.services';
import Layout from './../components/layout/Layout';
// import * as WebDataRocksReact from '@webdatarocks/react-webdatarocks';

export { loader };

const Reports = () => {
	const { provider } = useParams();
	const { services } = useLoaderData();
	const [WebDataRocks, setWebDataRocks] = useState(null);

	useEffect(() => {
		import('@webdatarocks/react-webdatarocks').then((module) => {
			setWebDataRocks(module.default);
		});
	}, []);

	if (!WebDataRocks) {
		return <div>Loading...</div>;
	}

	return (
		<Layout>
			<div>
				<h1>Reports</h1>
				<WebDataRocks
					toolbar={true}
					width='100%'
					height='600px'
					report={{
						dataSource: {
							data: [
								{ Category: 'Beverages', Sales: 100 },
								{ Category: 'Beverages', Sales: 200 },
								{ Category: 'Snacks', Sales: 150 },
								{ Category: 'Snacks', Sales: 250 },
							],
						},
					}}
				/>{' '}
			</div>
		</Layout>
	);
};

export default Reports;
