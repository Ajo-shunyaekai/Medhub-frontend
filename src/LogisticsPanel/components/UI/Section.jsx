import React from "react";
import styles from "./Section.module.css";

function Section({ children, classes, ...props }) {
  return (
    <section className={`${styles.container} ${classes}`.trim()} {...props}>
      {children}
    </section>
  );
}

export default Section;
