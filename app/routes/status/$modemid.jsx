import { useParams } from '@remix-run/react';

function Modem() {
	const params = useParams();

	return (
		<div>
			<h1>Modem: {params.modemId}</h1>
		</div>
	);
}

export default Modem;
