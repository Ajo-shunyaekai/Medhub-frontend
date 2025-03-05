import React from 'react'
import styles from "./thankyou.module.css";
import MedhubLogo from "./assets/navibluelogo.svg";

const SubscriptionThankYou = () => {
    return (
        <div className={styles.container}>
            <div className={styles.section}>
            <div className={styles.logoSection}>
                    <img className={styles.logo} src={MedhubLogo} alt="Logo" />
                </div>
                <div className={styles.card}>
                    <span className={styles.cardHeading}>Subscription Plan</span>
                    <span className={styles.cardContent}>You are already subscribed to the MedHub Plan ($99/month), enjoying exclusive benefits like priority access,
                         special discounts, and dedicated support..</span>
                    <span className={styles.cardContent}> Enjoy uninterrupted benefits to streamline 
                    your experience.</span>
                </div>
            </div>
        </div>
    )
}

export default SubscriptionThankYou