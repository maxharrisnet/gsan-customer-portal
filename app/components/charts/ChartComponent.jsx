import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js';

const ChartComponent = ({ chartId, chartType, chartData, chartOptions }) => {
	const chartRef = useRef(null);
	const chartInstance = useRef(null);

	useEffect(() => {
		const ctx = chartRef.current.getContext('2d');
		if (chartInstance.current) {
			chartInstance.current.destroy();
		}
		chartInstance.current = new Chart(ctx, {
			type: chartType,
			data: chartData,
			options: chartOptions,
		});

		return () => {
			if (chartInstance.current) {
				chartInstance.current.destroy();
			}
		};
	}, [chartType, chartData, chartOptions]);

	return (
		<canvas
			id={chartId}
			ref={chartRef}
		></canvas>
	);
};

export default ChartComponent;
