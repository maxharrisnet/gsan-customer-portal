import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import chartStyles from '../styles/charts.css?url';

const CPUChart = ({ data }) => {
	const chartData = {
		labels: data['15'].map((item) => new Date(item[0] * 1000).toLocaleTimeString()),
		datasets: [
			{
				label: 'CPU Usage',
				data: data['15'].map((item) => item[1]),
				borderColor: '#e74c3c',
				fill: false,
			},
		],
	};

	return <Line data={chartData} />;
};
