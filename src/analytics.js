// src/analytics.js
import ReactGA from "react-ga4";

export const initGA = () => {
  try {
    ReactGA.initialize(process.env.REACT_APP_GA_KEY); // <-- Replace with your Measurement ID
  } catch (error) {
    console.error("error", error);
  }
};

export const sendPageview = (path) => {
  try {
    ReactGA.send({ hitType: "pageview", page: path });
  } catch (error) {
    console.error("error", error);
  }
};

export const handleGAEvent = (category, action, label) => {
  try {
    ReactGA.event({
      category,
      action,
      label,
    });
  } catch (error) {
    console.error("error", error);
  }
};
