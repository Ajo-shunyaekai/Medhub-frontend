import React, { useEffect, useState } from "react";
import styles from "./subscription.module.css";
import MedhubLogo from "./assets/navibluelogo.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createSubscriptionSession,
  fetchCurrentSubscription,
  fetchUserData,
} from "../redux/reducers/subscriptionSlice";
import axios from "axios";

const SubscriptionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userType, userId } = useParams();
  const { user, subscribedPlanDetails } = useSelector(
    (state) => state?.subscriptionReducer
  );
  const [activePlan, setActivePlan] = useState(null);

  const subscriptionPlans = [
    {
      type: "Monthly Subscription",
      price: 129,
      pkg: "Monthly Subscription",
      duration: "month",
      features: ["feature 1", "feature 2"],
      bgColor: "#37d1dd",
    },
    {
      type: "Yearly Subscription",
      price: 1188,
      pkg: "Yearly Subscription",
      duration: "year",
      features: ["feature 1", "feature 2"],
      bgColor: "#d137dd",
    },
  ];

  const handleCardClick = (plan) => {
    setActivePlan(plan);
  };

  const handlePayment = async (duration, pkg, email) => {
    dispatch(
      createSubscriptionSession({
        plan_name: pkg,
        duration,
        email: email, // need to make it dynamic according to the user
        userType,
        userId: userId || user?._id,
      })
    );
  };

  useEffect(() => {
    userId &&
      userType &&
      dispatch(fetchUserData({ id: userId, type: userType }));
  }, [userId, userType]);

  useEffect(() => {
    user?.currentSubscription &&
      dispatch(
        fetchCurrentSubscription({
          id: user?.currentSubscription,
          type: userType,
        })
      );
  }, [user?.currentSubscription]);

  return (
    <>
      {user?.currentSubscription ? (
        <div className={styles.container}>
          <div className={styles.section}>
            <div className={styles.logoSection}>
              <img className={styles.logo} src={MedhubLogo} alt="Logo" />
            </div>
            <div className={styles.containerInner}>
              <div className={styles.headContainer}>
                <span className={styles.heading}>
                  You are already subscribed to "
                  {subscribedPlanDetails?.subscriptionDetails?.name}"
                </span>
                <span className={styles.text}>
                  Experience the full power of Medhub Global with simple,
                  transparent subscription plans designed to meet your{" "}
                  <br className={styles.br} /> needs. No hidden fees, no
                  transaction charges—just seamless healthcare procurement.
                </span>
              </div>
              <div className={styles.CardContainer}>
                {subscribedPlanDetails?.subscriptionDetails?.name ==
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
                            Billed Manually
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
                          <li className={styles.cardListText}>
                            Invoice factoring.
                          </li>
                        </ul>
                      </div>
                      <span className={styles.cardContent}>
                        Ideal for businesses looking for cost-effective,
                        long-term procurement solutions.
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
                        Ideal for buyers and sellers who want flexibility
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
                        <li className={styles.cardListText}>
                          Invoice factoring.
                        </li>
                      </ul>
                    </div>
                    <span className={styles.cardContent}>
                      Ideal for businesses looking for cost-effective, long-term
                      procurement solutions.
                    </span>
                  </div>
                  <div className={styles.subscriptionContainer}>
                    <div
                      className={styles.button}
                      onClick={() =>
                        handlePayment(
                          subscriptionPlans?.[0]?.duration,
                          subscriptionPlans?.[0]?.type,
                          user?.contact_person_email || user?.email
                        )
                      }
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
                      Ideal for buyers and sellers who want flexibility without
                      a long-term commitment.
                    </span>
                  </div>
                  <div className={styles.subscriptionContainer}>
                    <div
                      className={styles.button}
                      onClick={() =>
                        handlePayment(
                          subscriptionPlans?.[1]?.duration,
                          subscriptionPlans?.[1]?.type,
                          user?.contact_person_email || user?.email
                        )
                      }
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
    </>
  );
};

export default SubscriptionPage;
