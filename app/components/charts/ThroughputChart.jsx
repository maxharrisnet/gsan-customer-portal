import React, { useEffect } from 'react';
import { Chart } from 'chart.js';

const ThroughputChart = ({ throughputTimestamps, throughputDownload, throughputUpload }) => {
	useEffect(() => {
		const ctx = document.getElementById('throughputChart').getContext('2d');
		new Chart(ctx, {
			type: 'line',
			data: {
				labels: throughputTimestamps,
				datasets: [
					{ label: 'Download Throughput (Mbps)', data: throughputDownload },
					{ label: 'Upload Throughput (Mbps)', data: throughputUpload },
				],
			},
			options: {
				scales: {
					x: {
						type: 'time',
						time: { unit: 'hour', stepSize: 2, displayFormats: { hour: 'HH:mm' } },
						title: { display: true, text: 'Time (Every 2 Hours)' },
						tooltipFormat: 'MMM d, HH:mm',
					},
					y: {
						ticks: { callback: (value) => `${value}Mbps`, stepSize: 5 },
						beginAtZero: true,
					},
				},
				plugins: { legend: { display: true, position: 'bottom' } },
			},
		});
	}, [throughputTimestamps, throughputDownload, throughputUpload]);

	return (
		<canvas
			id='throughputChart'
			width='400'
			height='100'
		></canvas>
	);
};

export default ThroughputChart;
