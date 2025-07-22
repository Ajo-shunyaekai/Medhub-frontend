import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineChart = React.memo(() => {
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
                            data: [40, 60, 90, 50, 80, 40, 60],
                            tension: 0.4,
                            fill: false,
                            borderWidth: 2,
                            pointRadius: 0
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
                        }
                    },
                    animation: {
                        onComplete: function () {
                            const chart = this.chart;
                            if (!chart) return; // Ensure chart exists
                            const ctx = chart.ctx;
                            if (!ctx) return; // Ensure context exists

                            const gradientStroke = ctx.createLinearGradient(0, 0, 0, 300);
                            gradientStroke.addColorStop(0, '#4290f2');
                            gradientStroke.addColorStop(1, '#31c774');

                            const datasets = chart.data.datasets;
                            for (let i = 0; i < datasets.length; i++) {
                                const meta = chart.getDatasetMeta(i);
                                if (meta.type === 'line') {
                                    const elements = meta.data || [];
                                    elements.forEach(function (element, index) {
                                        const path = element._model.path;
                                        ctx.strokeStyle = gradientStroke;
                                        ctx.lineWidth = chart.data.datasets[i].borderWidth;
                                        ctx.stroke(path);
                                    });
                                }
                            }
                        }
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <div className='line-chart' style={{ width: '140px' }}>
            <canvas ref={chartRef} id="chart-line-2" style={{ display: 'block', width: '93px', height: '30px' }} width="93" height="30" className="chartjs-render-monitor" />
        </div>
    );
});

export default LineChart;
