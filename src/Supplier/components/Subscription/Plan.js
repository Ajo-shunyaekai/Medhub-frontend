import React, { useState } from "react";
import styles from "./subscription.module.css";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
const Plan = () => {
  const [subscription, setSubscription] = useState({
    plan: "Monthly", 
    price: 129,
    nextBillingDate: "07-March-2025",
    isActive: true,
  });

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
       <span className={styles.subscriptionHead}> {subscription.isActive ? "Subscription Active!" : "Subscription Expired"} </span>
       <button className={styles.cancelSubscription}>Cancel Subscription</button>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.plan}>You are subscribed to the {subscription.plan} Plan.</p>
        <p className={styles.billingDate}><span>Next Billing Date:</span> {subscription.nextBillingDate}</p>

        <div className={styles.benefits}>
          <h6>Benefits:</h6>
          <ul>
            <li> <MdOutlineKeyboardDoubleArrowRight className={styles.icon}/> Full access to AI-Powered marketplace.</li>
            <li> <MdOutlineKeyboardDoubleArrowRight className={styles.icon} /> No transaction charge.</li>
            <li> <MdOutlineKeyboardDoubleArrowRight className={styles.icon} /> Procurement process automation tools.</li>
            <li> <MdOutlineKeyboardDoubleArrowRight  className={styles.icon}/> Integrated logistics support.</li>
            <li> <MdOutlineKeyboardDoubleArrowRight className={styles.icon}/> Invoice factoring.</li>
          </ul>
        </div>

        {subscription.plan === "Monthly" && (
          <button className={`${styles.button} ${styles.upgrade}`}>Upgrade to Yearly Plan</button>
        )}
       
      </div>
    </div>
  );
};

export default Plan;

