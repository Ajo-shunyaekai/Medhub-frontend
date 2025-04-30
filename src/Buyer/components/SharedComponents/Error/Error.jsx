import React from "react";
import styles from "./Error.module.css";

const Error = () => {

  return (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>404</h1>
      <p className={styles.errorMessage}>Oops! Page Not Found</p>
    </div>
  );
};

export default Error;
