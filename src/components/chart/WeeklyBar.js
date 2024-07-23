// Weekly.js
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function WeeklyBar({ percentage }) {
    const idCSS = "weeklyGradient";
    const gradientTransform = `rotate(90)`;

    return (
        <div className="App">
            <div style={{ height: "80px", width: "80px" }}>
                <CircularProgressbar
                    strokeWidth={5}
                    value={percentage}
                    text={`${percentage}%`}
                    styles={buildStyles({
                        pathColor: `url(#${idCSS})`,
                        textColor: "#000", // Set text color to black
                        textSize: "16px" // Set text size
                    })}
                />
                <svg style={{ height: 0 }}>
                    <defs>
                        <linearGradient id={idCSS} gradientTransform={gradientTransform}>
                            <stop offset="0%" stopColor="#31c971" />
                            <stop offset="100%" stopColor="#f3c414" />
                        </linearGradient>
                    </defs>
                </svg>

            </div>
        </div>
    );
}

function Weekly() {
    const percentage = 35; // Adjust this percentage as needed

    return (
        <div className="App">
            <WeeklyBar percentage={percentage} />
        </div>
    );
}

export default Weekly;
