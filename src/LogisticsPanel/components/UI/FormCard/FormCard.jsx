import React from "react";
import styles from "./FormCard.module.css";

function FormCard({ children, props }) {
  return (
    <section className={styles.card} {...props}>
      {children}
    </section>
  );
}

export default FormCard;
