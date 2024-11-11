import React, { useEffect } from 'react';
import { Chart } from 'chart.js';

const LatencyChart = ({ latencyTimestamps, latencyValues }) => {
	useEffect(() => {
		const ctx = document.getElementById('latencyChart').getContext('2d');
		new Chart(ctx, {
			type: 'line',
			data: {
				labels: latencyTimestamps,
				datasets: [{ label: 'Latency (ms)', data: latencyValues }],
			},
			options: {
				scales: {
					y: {
						ticks: { callback: (value) => `${value}ms`, stepSize: 20 },
						beginAtZero: true,
					},
				},
			},
		});
	}, [latencyTimestamps, latencyValues]);

	return (
		<canvas
			id='latencyChart'
			width='400'
			height='100'
		></canvas>
	);
};

export default LatencyChart;
