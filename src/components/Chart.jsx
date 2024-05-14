import React, { useEffect , useRef } from 'react';
import { Chart } from 'chart.js/auto'; // Import Chart directly from chart.js

const ChartComponent = ({ title, data, labels }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Check if data is available and it's an array before mapping
        const chartData = Array.isArray(data) ? data.map(value => parseFloat(value).toFixed(2)) : [];

        const ctx = chartRef.current.getContext('2d');
        const chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: chartData,
                    backgroundColor: 'rgba(107, 107, 218, 0.2)',
                    borderColor: '#0a64f5',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                }],
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
            },
        });

        return () => {
            chartInstance.destroy(); // Cleanup chart on unmount
        };
    }, [data, labels, title]);

    return <canvas ref={chartRef} style={{height: "300px"}} className="w-full"></canvas>;
};

export default ChartComponent;
