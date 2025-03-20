import React from 'react';
import Inventory from "./InventoryList/Inventory";
import styles from "./InventoryList/inventory.module.css";

const index = () => {
  return (
    <div className={styles.mainContainer}>
      <Inventory/>
    </div>
  )
}

export default index;