import React from 'react';
import styles from './payment.module.css';
import Success from './assest/success.svg';

const PaymentSuccessful = () => {
    return (
        <div className={styles.container}>
            <div className={styles.paymentCard}>
                <div className={styles.Card}>
                <div className={styles.successIcon}>
                    <img className={styles.success} src={Success} alt='Success' />
                </div>
                <span className={styles.heading}>Payment Successful!</span>
                <span className={styles.subHeading}>
                Thank you for your purchase! Your payment has been successfully processed. A confirmation email with your payment details has been sent to your registered email address.
                </span>
                <a className={styles.Button}  target='_blank'   href='https://medhub.global/'>
                    <span className={styles.homeButton}>Home</span>
                </a>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessful;
