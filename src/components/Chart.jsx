import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const ChartComponent = ({ title, data, labels }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        console.log(data);
        // Use data directly without any conversion
        const chartData = Array.isArray(data) ? data : [];

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
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value; // Display the exact value without formatting
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.raw; // Display exact raw value in tooltip
                            }
                        }
                    }
                }
            },
        });

        return () => {
            chartInstance.destroy(); // Cleanup chart on unmount
        };
    }, [data, labels, title]);

    return <canvas ref={chartRef} style={{ height: "300px" }} className="w-full"></canvas>;
};

export default ChartComponent;
