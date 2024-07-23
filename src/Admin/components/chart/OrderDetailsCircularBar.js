import React, { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const initialPercentage = 55;

function OrderDetailsCircularBar() {
    const [percentage, setPercentage] = useState(initialPercentage);

    return (
        <div className="dashbaord-uppar-circular-bar">
            <div style={{ width: 120, height: 120, position: 'relative' }}>
                <CircularProgressbar
                    value={percentage}
                    text={`39,500`}
                    strokeWidth={5}
                    styles={{
                        path: {
                            stroke: `url(#gradient)`,
                        },
                        text: {
                            fill: '#5e676f',
                            fontSize: '15px',
                            fontWeight: '500'
                        },
                    }}
                />
                <div style={{ position: 'absolute', top: '56%', left: '50%', transform: 'translateX(-50%)' }}>
                    <p style={{ textAlign: 'center', fontSize: '13px', margin: '0', color: '#99a0ac' }}>usd</p>
                </div>
                <svg style={{ height: 0 }}>
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#448EFF" />
                            <stop offset="100%" stopColor="#32C579" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
}

export default OrderDetailsCircularBar;
