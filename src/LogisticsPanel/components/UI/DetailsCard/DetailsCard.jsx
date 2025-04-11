import React from "react";
import styles from "./DetailsCard.module.css";

function DetailsCard({ children, className, props }) {
  return (
    <section className={`${styles.card} ${className}`} {...props}>
      {children}
    </section>
  );
}

export default DetailsCard;
