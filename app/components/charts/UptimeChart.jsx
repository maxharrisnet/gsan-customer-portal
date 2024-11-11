import React, { useEffect } from 'react';
import { Chart } from 'chart.js';

const UptimeChart = ({ uptimeLabels, uptimeValues }) => {
	useEffect(() => {
		const ctx = document.getElementById('uptimeChart').getContext('2d');
		new Chart(ctx, {
			type: 'line',
			data: {
				labels: uptimeLabels,
				datasets: [{ label: 'Uptime', data: uptimeValues, stepped: true }],
			},
			options: {
				scales: {
					y: {
						min: 0,
						beginAtZero: true,
						ticks: { stepSize: 0.5 },
					},
				},
			},
		});
	}, [uptimeLabels, uptimeValues]);

	return (
		<canvas
			id='uptimeChart'
			width='400'
			height='100'
		></canvas>
	);
};

export default UptimeChart;
