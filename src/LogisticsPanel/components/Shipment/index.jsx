import React from "react";
import Shipment from "./Shipment";
import styles from "./Shipment.module.css";

const index = () => {
  return (
    <div className={styles.mainContainer}>
      <Shipment />
    </div>
  );
};

export default index;
