import React, { useEffect, useState } from "react";
import styles from "./subscription.module.css";
import MedhubLogo from "./assest/navibluelogo.svg";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserData } from "../redux/reducers/userDataSlice";

const SubscriptionPage = () => {
  const dispatch = useDispatch();
  const { userType, userId } = useParams();
  const [activePlan, setActivePlan] = useState(null);

  const handleCardClick = (plan) => {
    setActivePlan(plan);
  };

  useEffect(() => {
    userId && dispatch(fetchUserData(userId));
  }, [userId, userType]);

  return (
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
              Experience the full power of MedHub Global with simple,
              transparent subscription plans designed to meet your{" "}
              <br className={styles.br} /> needs. No hidden fees, no transaction
              charges—just seamless healthcare procurement.
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
                    No transaction charge.
                  </li>
                  <li className={styles.cardListText}>
                    Procurement process automation tools.
                  </li>
                </ul>
                <ul className={styles.cardList}>
                  <li className={styles.cardListText}>
                    Integrated logistics support.
                  </li>
                  <li className={styles.cardListText}>Invoice factoring.</li>
                </ul>
              </div>
              <span className={styles.cardContent}>
                Ideal for businesses looking for cost-effective, long-term
                procurement solutions.
              </span>
              </div>
              <div className={styles.subscriptionContainer}>
              <div className={styles.button}>Purchase Now</div>
              </div>
            </div>

            <div
              className={`${styles.card} ${
                activePlan === "yearly" ? styles.activeCard : ""
              }`}
              onClick={() => handleCardClick("yearly")}
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
                    All monthly plan benefits at a discount rate.
                  </li>
                  <li className={styles.cardListText}>
                    Priority support for an account.
                  </li>
                  <li className={styles.cardListText}>
                    Exclusive early access to new features.
                  </li>
                </ul>
              </div>
              <span className={styles.cardContent}>
                Ideal for buyers and sellers who want flexibility without a
                long-term commitment.
              </span>
              </div>
              <div className={styles.subscriptionContainer}>
              <div className={styles.button}>Purchase Now</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
