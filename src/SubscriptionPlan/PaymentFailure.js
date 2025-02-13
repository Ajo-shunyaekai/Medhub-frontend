import React from "react";
import styles from "./payment.module.css";
import Failure from "./assest/failure.svg";
import { useNavigate, useParams } from "react-router-dom";

const PaymentFailure = () => {
  const navigate = useNavigate();
  const { userType, userId } = useParams();

  // Function to navigate to the select-plan page
  const handleHomeRedirect = () => {
    navigate(`/subscription/${userType}/${userId}/select-plan`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.paymentCard}>
        <div className={styles.Card}>
          <div className={styles.successIcon}>
            <img className={styles.success} src={Failure} alt="Failure" />
          </div>
          <span className={styles.heading}>Payment Failed!</span>
          <span className={styles.subHeading}>
            Oops! Something went wrong with your transaction.
          </span>
          <span className={styles.content}>
            We were unable to process your payment. Please check your payment
            details and try again. If the issue persists, contact your bank or
            our support team for assistance.
          </span>
          <button
            className={styles.Button}
            onClick={handleHomeRedirect}
            style={{
              margin: "0",
              padding: "0",
              border: "none",
            }}
          >
            <span className={styles.homeButton}>Retry</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
