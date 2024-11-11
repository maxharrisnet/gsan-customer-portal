import React, { useEffect } from 'react';
import { Chart } from 'chart.js';

const ObstructionChart = ({ obstructionLabels, obstructionValues }) => {
	useEffect(() => {
		const ctx = document.getElementById('obstructionChart').getContext('2d');
		new Chart(ctx, {
			type: 'line',
			data: {
				labels: obstructionLabels,
				datasets: [{ label: 'Obstruction (%)', data: obstructionValues }],
			},
			options: {
				scales: {
					y: {
						ticks: { callback: (value) => `${value}%`, stepSize: 50 },
						max: 100,
						beginAtZero: true,
					},
				},
			},
		});
	}, [obstructionLabels, obstructionValues]);

	return (
		<canvas
			id='obstructionChart'
			width='400'
			height='100'
		></canvas>
	);
};

export default ObstructionChart;
