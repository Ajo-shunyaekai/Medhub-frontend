import React from 'react';
import Dashboard from '../../style/dashboard.css'

const PinkBar = ({ bgcolor, progress, height }) => {
    const parentDivStyle = {
        height: height,
        width: '100%',
        backgroundColor: 'whitesmoke',
        borderRadius: 40,
    };

    const childDivStyle = {
        height: '100%',
        width: `${progress}%`,
        background: bgcolor, // Set background directly to bgcolor
        borderRadius: 40,
        textAlign: 'right'
    };

    return (
        <div style={parentDivStyle}>
            <div style={childDivStyle}></div>
        </div>
    );
};

const App = () => {
    return (
        <div className="pink-progress-bar">
            <PinkBar bgcolor="linear-gradient(45deg, #f54394, #f543ed)" progress={100} height={6} />
        </div>
    );
};

export default App;
