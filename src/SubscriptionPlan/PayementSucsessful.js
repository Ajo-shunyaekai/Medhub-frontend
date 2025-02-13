import React, { useEffect } from "react";
import styles from "./payment.module.css";
import Success from "./assest/success.svg";
import {
  fetchUserData,
  saveSubscriptionPayment,
  sendSubscriptionPaymentEmail,
} from "../redux/reducers/subscriptionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import InvoicePDF from "./invoice/InvoicePDF";
import { pdf } from "@react-pdf/renderer"; // Import the pdf function from @react-pdf/renderer

const PaymentSuccessful = () => {
  const dispatch = useDispatch();
  const { userType, userId } = useParams();
  const { user, subscriptionDetails } = useSelector(
    (state) => state?.subscriptionReducer
  );

  // Access the query params from the URL using window.location.search
  const queryParams = new URLSearchParams(window.location.search);
  const sessionId = queryParams?.get("session_id");

  // Function to generate the PDF from React PDF Renderer
  const generatePDF = () => {
    const invoiceComponent = (
      <InvoicePDF
        title="Invoice"
        subscriptionDetails={subscriptionDetails}
        user={user}
      />
    ); // Pass title, service, and details as needed
    return new Promise((resolve, reject) => {
      // Generate PDF and return it as a blob
      pdf(invoiceComponent)
        .toBlob() // Convert to Blob
        .then((pdfBlob) => {
          resolve(pdfBlob); // Resolve with the Blob
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  console.log("user, subscriptionDetails", user, subscriptionDetails);

  // Function to send the payment email (send PDF to backend API)
  const sendPaymentEmail = async (pdfBlob) => {
    try {
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("email", user?.contact_person_email);
      for (const property in subscriptionDetails) {
        subscriptionDetails[property] &&
          formData.append(property, subscriptionDetails[property]);
      }
      for (const property in user) {
        user[property] && formData.append(property, user[property]);
      }
      formData.append("userId", user?._id);
      formData.append("invoice_pdf", pdfBlob, "Invoice.pdf"); // Append the PDF Blob to FormData

      dispatch(
        sendSubscriptionPaymentEmail({
          session_id: sessionId,
          email: user?.contact_person_email, // need to make it dynamic according to the user
          userType,
          userId,
          formData,
        })
      );
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  useEffect(() => {
    if (sessionId && user?.contact_person_email) {
      dispatch(
        saveSubscriptionPayment({
          session_id: sessionId,
          email: user?.contact_person_email, // need to make it dynamic according to the user
          userType,
          userId,
        })
      );
    }
  }, [sessionId, user]);

  useEffect(() => {
    userId &&
      userType &&
      dispatch(fetchUserData({ id: userId, type: userType }));
  }, [userId, userType, dispatch]);

  useEffect(() => {
    // Generate the PDF first and then call savePayment with the generated Blob
    Object.values(subscriptionDetails)?.length > 0 &&
      subscriptionDetails?.subscriptionId &&
      generatePDF()
        .then((pdfBlob) => {
          sendPaymentEmail(pdfBlob);
        })
        .catch((error) => {
          console.error("Error generating PDF:", error);
        });
  }, [subscriptionDetails]); // Dependency array ensures it runs when sessionId changes

  return (
    <div className={styles.container}>
      <div className={styles.paymentCard}>
        <div className={styles.Card}>
          <div className={styles.successIcon}>
            <img className={styles.success} src={Success} alt="Success" />
          </div>
          <span className={styles.heading}>Payment Successful!</span>
          <span className={styles.subHeading}>
            Thank you for your purchase! Your payment has been successfully
            processed. A confirmation email with your payment details has been
            sent to your registered email address.
          </span>
          <a
            className={styles.Button}
            target="_blank"
            href="https://medhub.global/"
          >
            <span className={styles.homeButton}>Home</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessful;
