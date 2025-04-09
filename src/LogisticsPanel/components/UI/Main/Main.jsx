import React from "react";
import styles from "./Main.module.css";

function Main({ title, children }) {
  return (
    <main className={styles.outerContainer}>
      <div className={styles.title}>
        <h4>{title}</h4>
      </div>
      <div className={styles.innerContainer}>{children}</div>
    </main>
  );
}

export default Main;
