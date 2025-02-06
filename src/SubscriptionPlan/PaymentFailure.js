import React from 'react';
import styles from './payment.module.css';
import Failure from './assest/failure.svg';

const PaymentFailure = () => {
    return (
        <div className={styles.container}>
            <div className={styles.paymentCard}>
                <div className={styles.Card}>
                <div className={styles.successIcon}>
                    <img className={styles.success} src={Failure} alt='Success' />
                </div>
                <span className={styles.heading}>Payment Failed!</span>
                <span className={styles.subHeading}>
                Oops! Something went wrong with your transaction.
                </span>
                <span className={styles.content}>
                We were unable to process your payment. Please check your payment details and try again. 
                If the issue persists, contact your bank or our support team for assistance.
                </span>
                <a className={styles.Button}  target='_blank'   href='/subscription'>
                    <span className={styles.homeButton}>Home</span>
                </a>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
