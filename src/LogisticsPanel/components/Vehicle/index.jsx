import React from "react";
import AddVehicle from "./AddVehicle/AddVehicle";
import styles from "./AddVehicle/AddVehicle.module.css";

const index = () => {
  return (
    <div className={styles.mainContainer}>
      <AddVehicle />
    </div>
  );
};

export default index;
