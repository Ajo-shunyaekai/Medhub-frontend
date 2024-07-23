import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef && chartRef.current) {
            const ctx = chartRef.current.getContext("2d");

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                        {
                            data: [40, 59, 80, 81, 56, 55, 40, 85, 95, 105, 23, 10],
                            borderColor: 'rgb(255, 99, 132)',
                            tension: 0.4, // Adjust the tension for smoother curves
                            fill: false,
                            borderWidth: 3, // Increase the width of the line
                            pointStyle: 'line' // Remove the dots
                        },
                        {
                            data: [30, 69, 90, 98, 66, 65, 50, 95, 105, 115, 33, 20],
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.4, // Adjust the tension for smoother curves
                            fill: false,
                            borderWidth: 3, // Increase the width of the line
                            pointStyle: 'line' // Remove the dots
                        },
                        {
                            data: [10, 30, 60, 90, 20, 70, 105, 80, 115, 90, 100, 120],
                            borderColor: 'rgb(54, 162, 235)',
                            tension: 0.4, // Adjust the tension for smoother curves
                            fill: false,
                            borderWidth: 2, // Increase the width of the line
                            pointStyle: 'line' // Remove the dots
                        }
                    ]
                },
                options: {
                    elements: {
                        line: {
                            borderColor: '#FFFFF7' // Lighten the line color
                        }
                    },
                    plugins: {
                        legend: {
                            display: false // Remove the legend
                        }
                    }
                }
            });
        }

        return () => {
            // Clean up function to destroy the chart instance when the component unmounts
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <div className='line-chart'>
            <canvas ref={chartRef} />
        </div>
    );
};

export default LineChart;
