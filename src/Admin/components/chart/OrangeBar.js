import React from 'react';

const OrangeBar = ({ bgcolor, progress, height }) => {
    const parentDivStyle = {
        height: height,
        width: '100%',
        backgroundColor: 'whitesmoke',
        borderRadius: 40,
    };

    const childDivStyle = {
        height: '100%',
        width: `${progress}%`,
        background: bgcolor,
        borderRadius: 40,
        textAlign: 'right'
    };

    // Adjust the gradient background
    const gradientBackground = {
        backgroundImage: bgcolor,
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
            <OrangeBar bgcolor="#f4c414 linear-gradient(45deg, #f4c414, #f45414)" progress={25} height={6} />
        </div>
    );
};

export default App;
