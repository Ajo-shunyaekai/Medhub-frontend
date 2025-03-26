import React from "react";
import styles from "./Section.module.css";

function Section({ children, ...props }) {
  return (
    <section className={`${styles.container}`} {...props}>
      {children}
    </section>
  );
}

export default Section;
