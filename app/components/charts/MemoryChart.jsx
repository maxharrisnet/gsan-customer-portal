import { Line } from 'react-chartjs-2';

const MemoryChart = ({ data }) => {
	console.log('🍹 Memory Chart Data:', data['17']);

	const options = {
		responsive: true,
		scales: {
			x: {
				type: 'time',
				time: {
					unit: 'minute',
				},
			},
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'Memory (MB)',
				},
			},
		},
	};

	const chartData = {
		labels: data['17'].map((item) => new Date(item[0] * 1000).toLocaleTimeString()),
		datasets: [
			{
				label: 'Total Memory',
				data: data['17'].map((item) => item[1] / 1024), // Convert to MB
				borderColor: '#1abc9c',
				fill: false,
			},
			{
				label: 'Used Memory',
				data: data['16'].map((item) => item[1] / 1024), // Convert to MB
				borderColor: '#e74c3c',
				fill: false,
			},
		],
	};

	return (
		<Line
			data={chartData}
			options={options}
		/>
	);
};

export default MemoryChart;
