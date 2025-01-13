import React, { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../dashboard.css';

const initialPercentage = 55;

function CircularBar({ totalPurchase }) {
    const [percentage, setPercentage] = useState(initialPercentage);

    return (
        <div className="dashbaord-uppar-circular-bar">
            <div className='circular-bar-container'>
                <CircularProgressbar
                    value={percentage}
                    text={totalPurchase || '0'}
                    strokeWidth={5}
                    styles={{
                        path: {
                            stroke: `url(#gradient)`,
                        },
                        text: {
                            fill: '#5e676f',
                            fontSize: '15px',
                            fontWeight: '450'
                        },
                    }}
                />
                <div style={{ position: 'absolute', top: '56%', left: '50%', transform: 'translateX(-50%)' }}>
                    <p style={{ textAlign: 'center', fontSize: '13px', margin: '0', color: '#99a0ac' }}>USD</p>
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

export default CircularBar;
