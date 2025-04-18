import React from "react";
import styles from "./FormCard.module.css";

function FormCard({ children, className, props }) {
  return (
    <section className={`${styles.card} ${className}`} {...props}>
      {children}
    </section>
  );
}

export default FormCard;
