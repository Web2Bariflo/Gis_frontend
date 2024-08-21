// import React, { useEffect, useRef } from 'react';
// import { Chart } from 'chart.js/auto';

// const ChartComponent = ({ title, data, labels }) => {
//     const chartRef = useRef(null);

//     useEffect(() => {
//         console.log(data);
//         const chartData = Array.isArray(data) ? data : [];

//         const minValue = Math.min(...chartData);
//         const maxValue = Math.max(...chartData);

//         const ctx = chartRef.current.getContext('2d');
//         const chartInstance = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     label: title,
//                     data: chartData,
//                     backgroundColor: 'rgba(107, 107, 218, 0.2)',
//                     borderColor: '#0a64f5',
//                     borderWidth: 2,
//                     tension: 0.4,
//                     fill: true,
//                 }],
//             },
//             options: {
//                 responsive: false,
//                 maintainAspectRatio: true,
//                 scales: {
//                     y: {
//                         beginAtZero: false,
//                         // min: minValue - (maxValue - minValue) * 0.1, // Add padding below the min value
//                         // max: maxValue + (maxValue - minValue) * 0.1, // Add padding above the max value
//                         ticks: {
//                             //callback: function(value) {
//                                 //return value; // Display all tick values
//                             //},
//                             autoSkip: true
//                         }
//                     }
//                 },
//                 plugins: {
//                     tooltip: {
//                         callbacks: {
//                             label: function(context) {
//                                 return context.raw;
//                             }
//                         }
//                     }
//                 }
//             },
//         });

//         return () => {
//             chartInstance.destroy();
//         };
//     }, [data, labels, title]);

//     return <canvas ref={chartRef} style={{ height: "300px" }} className="w-full"></canvas>;
// };

// export default ChartComponent;




//edit by-Rajeswari
import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const ChartComponent = ({ title, data, labels }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // console.log(data);
        const chartData = Array.isArray(data) ? data : [];

        const minValue = Math.min(...chartData);
        const maxValue = Math.max(...chartData);
        


        const ctx = chartRef.current.getContext('2d');
        const chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels:labels ,
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
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        // min: minValue - (maxValue - minValue) * 0.1, // Add padding below the min value
                        // max: maxValue + (maxValue - minValue) * 0.1, // Add padding above the max value
                        ticks: {
                            //callback: function(value) {
                                //return value; // Display all tick values
                            //},
                            autoSkip: true
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.raw;
                            }
                        }
                    }
                }
            },
        });

        return () => {
            chartInstance.destroy();
        };
    }, [data, labels, title]);

    return <canvas ref={chartRef} className="w-full"></canvas>;
};

export default ChartComponent;

