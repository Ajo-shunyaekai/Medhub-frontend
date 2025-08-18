import React, { lazy, useEffect, useState } from "react";
import styles from "./subscription.module.css";
import MedhubLogo from "./assets/navibluelogo.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Modal from "./Modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  createSubscriptionSession,
  fetchCurrentSubscription,
  fetchUserData,
} from "../redux/reducers/subscriptionSlice";
import { pdf } from "@react-pdf/renderer";
import Invoice from "./SubscriptionInvoice/Invoice";
import InvoicePDF from "./SubscriptionInvoice/InvoicePDF";
const Loader = lazy(() =>
  import("../Buyer/components/SharedComponents/Loader/Loader")
);
 
const SubscriptionPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType, userId } = useParams();
  const { user, subscribedPlanDetails, loading } = useSelector(
    (state) => state?.subscriptionReducer
  );
  const [activePlan, setActivePlan] = useState(null);
 
  /* modal of verify coupon */
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(false);
  const couponArray = [
    {
      code: "Roshan",
    },
    {
      code: "Rohit",
    },
    {
      code: "Gaurav",
    },
    {
      code: "Rishav",
    },
  ];
 
  const subscriptionPlans = [
    {
      type: "Monthly Subscription",
      price: 129,
      pkg: "Monthly Subscription",
      duration: "month",
      bgColor: "#37d1dd",
    },
    {
      type: "Yearly Subscription",
      price: 1188,
      pkg: "Yearly Subscription",
      duration: "year",
      bgColor: "#d137dd",
    },
  ];
 
  const handleCardClick = (plan) => {
    setActivePlan(plan);
  };
 
  const handlePayment = async (pdfBlob, duration, pkg, email, invoiceData) => {
    const formData = new FormData();
    formData.append("plan_name", pkg);
    formData.append("duration", duration);
    formData.append("email", email);
    formData.append("userType", userType);
    formData.append("userId", userId || user?._id);
    formData.append("invoice_pdf", pdfBlob, "Invoice.pdf"); // Ensure the filename is set here
 
    // Append invoice data (you can either send it as individual fields or as a JSON string)
    for (const key in invoiceData) {
      if (Object.prototype.hasOwnProperty.call(invoiceData, key)) {
        const element = invoiceData[key];
        formData.append(key, element);
      }
    }
 
    dispatch(createSubscriptionSession(formData));
  };


 
  const generatePDF = (duration, pkg, email, invoiceData) => {
    const invoiceComponent = (
      <InvoicePDF
        title="Invoice"
        subscriptionDetails={invoiceData}
        user={user}
      />
    );
 
    return new Promise((resolve, reject) => {
      pdf(invoiceComponent)
        .toBlob()
        .then((pdfBlob) => {
          resolve({ pdfBlob, duration, pkg, email, invoiceData });
        })
        .catch(reject);
    });
  };
 
  useEffect(() => {
    if (userId && userType) {
      dispatch(fetchUserData({ id: userId, type: userType }));
    }
  }, [userId, userType]);
 
  useEffect(() => {
    if (user?.currentSubscription) {
      dispatch(
        fetchCurrentSubscription({
          id: user?.currentSubscription,
          type: userType,
        })
      );
    }
  }, [user?.currentSubscription]);
 
  const handleClickPurchase = (index, discount) => {
    const duration = subscriptionPlans?.[index]?.duration;
    const pkg = subscriptionPlans?.[index]?.type;
    const email = user?.contact_person_email || user?.email;
    const selectedPlan = subscriptionPlans.find((p) => p.pkg === pkg);
 
    // Prepare the invoice data
    const invoiceData = {
      name: pkg,
      // discount,
      amount: selectedPlan?.price || 0,
      subscriptionStartDate: new Date(),
      invoiceNumber: "INV-" + Math.floor(Math.random() * 1000000),
    };
 
    // Apply discount if provided
    if (discount) {
      invoiceData.discount = discount; // Add discount to the invoice data
    }
 
    // Generate the PDF and handle payment
    generatePDF(duration, pkg, email, invoiceData)
      .then(({ pdfBlob }) => {
        handlePayment(
          pdfBlob,
          duration,
          pkg,
          user?.contact_person_email || user?.email,
          invoiceData
        );
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };
 
  return (
    <>
      {/* <Invoice/> */}
      {loading ? (
        <Loader />
      ) : user?.currentSubscription ? (
        <div className={styles.container}>
          <div className={styles.section}>
            <div className={styles.logoSection}>
              <img className={styles.logo} src={MedhubLogo} alt="Logo" />
            </div>
            <div className={styles.containerInner}>
              <div className={styles.headContainer}>
                <span className={styles.heading}>
                  You are already subscribed to "
                  {subscribedPlanDetails?.productName}"
                </span>
                <span className={styles.text}>
                  Experience the full power of Medhub Global with simple,
                  transparent subscription plans designed to meet your{" "}
                  <br className={styles.br} /> needs. No hidden fees, no
                  transaction charges—just seamless healthcare procurement.
                </span>
              </div>
              <div className={styles.CardContainer}>
                {subscribedPlanDetails?.productName ==
                "Monthly Subscription" ? (
                  <div
                    className={`${styles.card} ${
                      activePlan === "monthly" ? "" : ""
                    }`}
                    onClick={() => handleCardClick("monthly")}
                  >
                    <div className={styles.subscriptionContainer}>
                      <div className={styles.cardSec}>
                        <div className={styles.cardHead}>
                          <span className={styles.cardMonthly}>
                            Monthly Subscription
                          </span>
                          <span className={styles.cardManu}>
                            Billed Monthly
                          </span>
                        </div>
                        <span className={styles.cardMoney}>
                          $129 <span className={styles.cardMonth}>/Month</span>
                        </span>
                      </div>
                      <div className={styles.cardListSection}>
                        <ul className={styles.cardList}>
                          <li className={styles.cardListText}>
                            Full access to AI-Powered marketplace.
                          </li>
                          <li className={styles.cardListText}>
                            No transaction charges.
                          </li>
                          <li className={styles.cardListText}>
                            Integrated logistics support.
                          </li>
                        </ul>
                        
                      </div>
                      <span className={styles.cardContent}>
                       
                        Ideal for buyers and suppliers who want flexibility
                        without a long-term commitment.
                      </span>
                    </div>
                    <div className={styles.subscriptionContainer}>
                      <div
                        className={styles.button}
                        onClick={() => navigate(`/${userType}`)}
                      >
                        Home
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`${styles.card} ${
                      activePlan === "yearly" ? "" : ""
                    }`}
                    onClick={() =>
                      handleCardClick(
                        "yearly",
                        subscriptionPlans?.[1]?.type,
                        subscriptionPlans?.[1]?.duration
                      )
                    }
                  >
                    <div className={styles.subscriptionContainer}>
                      <div className={styles.cardSec}>
                        <div className={styles.cardHead}>
                          <span className={styles.cardMonthly}>
                            Yearly Subscription
                          </span>
                          <span className={styles.cardManu}>
                            Billed Annually
                          </span>
                        </div>
                        <span className={styles.cardMoney}>
                          $99 <span className={styles.cardMonth}>/Month</span>
                        </span>
                      </div>
                      <div className={styles.cardListSection}>
                        <ul className={styles.cardList}>
                          <li className={styles.cardListText}>
                            All monthly plan benefits at a discounted rate.
                          </li>
                          <li className={styles.cardListText}>
                            Priority support for your account.
                          </li>
                          <li className={styles.cardListText}>
                            Exclusive early benefits to new features.
                          </li>
                        </ul>
                      </div>
                      <span className={styles.cardContent}>
                        
                        Ideal for buyers and suppliers looking for
                        cost-effective, long-term procurement solutions.
                      </span>
                    </div>
                    <div className={styles.subscriptionContainer}>
                      <div
                        className={styles.button}
                        onClick={() => navigate(`/${userType}`)}
                      >
                        Home
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.section}>
            <div className={styles.logoSection}>
              <img className={styles.logo} src={MedhubLogo} alt="Logo" />
            </div>
            <div className={styles.containerInner}>
              <div className={styles.headContainer}>
                <span className={styles.heading}>
                  Choose the Plan That Suits You Best
                </span>
                <span className={styles.text}>
                  Experience the full power of Medhub Global with simple,
                  transparent subscription plans designed to meet your{" "}
                  <br className={styles.br} /> needs. No hidden fees, no
                  transaction charges—just seamless healthcare procurement.
                </span>
              </div>
              <div className={styles.CardContainer}>
                <div
                  className={`${styles.card} ${
                    activePlan === "monthly" ? styles.activeCard : ""
                  }`}
                  onClick={() => handleCardClick("monthly")}
                >
                  <div className={styles.subscriptionContainer}>
                    <div className={styles.cardSec}>
                      <div className={styles.cardHead}>
                        <span className={styles.cardMonthly}>
                          Monthly Subscription
                        </span>
                        <span className={styles.cardManu}>Billed Manually</span>
                      </div>
                      <span className={styles.cardMoney}>
                        $129 <span className={styles.cardMonth}>/Month</span>
                      </span>
                    </div>
                    <div className={styles.cardListSection}>
                      <ul className={styles.cardList}>
                        <li className={styles.cardListText}>
                          Full access to AI-Powered marketplace.
                        </li>
                        <li className={styles.cardListText}>
                          No transaction charges.
                        </li>
                        <li className={styles.cardListText}>
                          Integrated logistics support.
                        </li>
                      </ul>
                      
                    </div>
                    <span className={styles.cardContent}>
                      Ideal for buyers and suppliers who want flexibility
                      without a long-term commitment.
                    </span>
                  </div>
                  <div className={styles.subscriptionContainer}>
                    <div
                      className={styles.button}
                      onClick={() => handleClickPurchase(0)}
                    >
                      Purchase Now
                    </div>
                  </div>
                </div>
 
                <div
                  className={`${styles.card} ${
                    activePlan === "yearly" ? styles.activeCard : ""
                  }`}
                  onClick={() =>
                    handleCardClick(
                      "yearly",
                      subscriptionPlans?.[1]?.type,
                      subscriptionPlans?.[1]?.duration
                    )
                  }
                >
                  <div className={styles.subscriptionContainer}>
                    <div className={styles.cardSec}>
                      <div className={styles.cardHead}>
                        <span className={styles.cardMonthly}>
                          Yearly Subscription
                        </span>
                        <span className={styles.cardManu}>Billed Annually</span>
                      </div>
                      <span className={styles.cardMoney}>
                        $99 <span className={styles.cardMonth}>/Month</span>
                      </span>
                    </div>
                    <div className={styles.cardListSection}>
                      <ul className={styles.cardList}>
                        <li className={styles.cardListText}>
                          All monthly plan benefits at a discounted rate.
                        </li>
                        <li className={styles.cardListText}>
                          Priority support for your account.
                        </li>
                        <li className={styles.cardListText}>
                          Exclusive early benefits to new features.
                        </li>
                      </ul>
                    </div>
                    <span className={styles.cardContent}>
                      Ideal for buyers and suppliers looking for cost-effective,
                      long-term procurement solutions.
                    </span>
                  </div>
                  <div className={styles.subscriptionContainer}>
                    <div
                      className={styles.button}
                      // onClick={() => handleClickPurchase(1)}
                      onClick={() => {
                        const status = new URLSearchParams(location.search).get(
                          "status"
                        );
 
                        if (status && status == 1) {
                          setSelectedPlan(1);
                          setIsOpen(true);
                        } else {
                          handleClickPurchase(1);
                        }
                      }}
                    >
                      Purchase Now
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
 
      
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          couponArray={couponArray}
          selectedPlan={selectedPlan}
          handleClickPurchase={handleClickPurchase}
        />
      )}
    </>
  );
};
 
export default SubscriptionPage;