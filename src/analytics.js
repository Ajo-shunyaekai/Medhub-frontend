// src/analytics.js
import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize(process.env.REACT_APP_GA_KEY); // <-- Replace with your Measurement ID
};

export const sendPageview = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const handleGAEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};
