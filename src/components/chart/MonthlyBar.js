// Monthly.js
import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function MonthlyBar({ percentage }) {
    const idCSS = "hello";
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
                            <stop offset="0.29%" stopColor="#f4c414" />
                            <stop offset="85.56%" stopColor="#f5488e" />
                        </linearGradient>
                    </defs>
                </svg>

            </div>
        </div>
    );
}

function Monthly() {
    const percentage = 25;

    return (
        <div className="App">
            <MonthlyBar percentage={percentage} />
        </div>
    );
}

export default Monthly;
