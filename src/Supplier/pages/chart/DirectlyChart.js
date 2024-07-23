import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DirectlyChart = () => {
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
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    datasets: [
                        {
                            data: [20, 60, 40, 80, 20, 70, 60],
                            tension: 0.4,
                            fill: false,
                            borderWidth: 2, // Increase border width to make gradient visible
                            pointRadius: 0,
                            borderColor: '#f7cb62', // Initial color, will be overridden by plugin
                            borderCapStyle: 'round',
                            borderJoinStyle: 'round',
                            lineTension: 0.5
                        }
                    ]
                },
                options: {
                    scales: {
                        x: {
                            display: false
                        },
                        y: {
                            display: false
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: false // Disable tooltips
                        }
                    },
                    elements: {
                        point: {
                            radius: 0 // Disable points
                        }
                    }
                },
                plugins: [{
                    beforeDraw: (chart) => {
                        const ctx = chart.ctx;
                        const colors = ['#f7cb62', '#f55087'];
                        const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
                        gradient.addColorStop(0, colors[0]);
                        gradient.addColorStop(1, colors[1]);

                        chart.data.datasets.forEach((dataset) => {
                            dataset.borderColor = gradient;
                        });
                    }
                }]
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <div className='directly-chart'>
            <canvas ref={chartRef} id="directly-chart" width="140" height="70" role="img" />
        </div>
    );
};

export default DirectlyChart;
