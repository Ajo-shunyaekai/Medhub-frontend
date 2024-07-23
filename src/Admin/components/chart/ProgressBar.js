import React from 'react';

const ProgressBar = ({ bgcolor, progress, height }) => {
    const parentDivStyle = {
        height: height,
        width: '100%',
        backgroundColor: 'whitesmoke',
        borderRadius: 40,
    };

    const childDivStyle = {
        height: '100%',
        width: `${progress}%`,
        background: bgcolor, // Change backgroundColor to background
        borderRadius: 40,
        textAlign: 'right'
    };

    // Adjust the gradient background
    const gradientBackground = {
        backgroundImage: bgcolor, // Set the gradient as backgroundImage
    };

    return (
        <div style={parentDivStyle}>
            <div style={{ ...childDivStyle, ...gradientBackground }}></div>
        </div>
    );
};

const App = () => {
    return (
        <div className="App">
            <ProgressBar bgcolor="linear-gradient(45deg, #448bff, #44e9ff)" progress={65} height={6} />
        </div>
    );
};

export default App;
