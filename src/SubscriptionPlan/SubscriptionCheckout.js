import React from 'react'
import styles from './checkout.module.css'

const SubscriptionCheckout = () => {
    return (
        <div className={styles.container}>
            <div className={styles.logoSection}>
                <img className={styles.logo} src={MedhubLogo} alt='Logo' />
            </div>
            <div className={styles.section}>
                <div className={styles.card}></div>
                <div className={styles.checkoutCard}></div>
            </div>
        </div>
    )
}

export default SubscriptionCheckout