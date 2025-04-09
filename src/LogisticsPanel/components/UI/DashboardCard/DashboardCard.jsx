import React from "react";
import styles from "./DashboardCard.module.css";

function DashboardCard({ title,count,icons }) {
  return (
    <div className={styles.card}>
        <div className={styles.cardBody}>
            <div className={styles.cardIcons}>
                {icons}
            </div>
            <div className={styles.cardContent}>
                <div className={styles.cardHeading}>{title}</div>
                <div className={styles.cardContent}>{count}</div>
            </div>
        </div>
    </div>
  );
}

export default DashboardCard;
