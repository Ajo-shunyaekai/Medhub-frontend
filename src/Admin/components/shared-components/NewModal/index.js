import React, { useEffect, useState, useRef } from "react";
import styles from "./newModal.module.css";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { sendSubscriptionPaymentUrlEmail } from "../../../../redux/reducers/subscriptionSlice";

const Modal = ({ isOpen, onClose, id, userType }) => {
  const coupons = [
    "SAVET1-99",
    "SAVET2-198",
    "SAVET3-297",
    "SAVET4-396",
    "SAVET6-594",
  ];

  const [currentTab, setCurrentTab] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const modalRef = useRef();
  const dispatch = useDispatch();
  /* 
 const {supplierId} = useParams(); */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleEmailSendingAction = async (coupon) => {
    await dispatch(
      sendSubscriptionPaymentUrlEmail({
        userType: userType,
        id: id,
        ...(coupon && { coupon }),
      })
    ).then((response) => {
      if (response?.payload?.code === 200) {
        toast.success(response?.payload?.message);
      } else {
        toast.error(response?.payload?.message);
      }
    });
  };

  const handleAddCoupon = async () => {
    if (currentTab.length == 0) setShowError(true);
    else {
      setIsLoading(true);
      try {
        await handleEmailSendingAction(currentTab);
        onClose();
      } catch (error) {
        toast.error("Error in getting Payment Link");
      } finally {
        setIsLoading(false);
        setCurrentTab("");
      }
    }
  };

  const handleSkipCoupon = async () => {
    setIsLoading(true);
    try {
      await handleEmailSendingAction();
      onClose();
    } catch (error) {
      toast.error("Error in getting Payment Link");
    } finally {
      setIsLoading(false);
      setCurrentTab("");
    }
  };

  const handleResetBtn = () => {
    setCurrentTab("");
    setShowError(false);
  };

  const handleTabChange = (coupon) => {
    if (!isLoading) {
      setCurrentTab(coupon);
      setShowError(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} ref={modalRef}>
        <div className={styles.modalBody}>
          {/* Modal Header */}
          <div className={styles.modalHeaderDiv}>
            <p className={styles.modalHeaderPara}>Add Coupon</p>
            <button className={styles.closeButton} onClick={onClose}>
              &times;
            </button>
          </div>

          {/* Modal main content section */}
          <div className={styles.modalMainContentSection}>
            {/* Modal Tab Section */}
            <div className={styles.modalTabSection}>
              {(coupons || []).map((coupon, i) => (
                <div
                  onClick={() => {
                    handleTabChange(coupon);
                  }}
                  key={i}
                  className={`
                        ${
                          currentTab === coupon
                            ? styles.modalTabSelected
                            : styles.modalTab
                        }
                        ${isLoading ? styles.modalNewTab : ""}
                        `}
                >
                  {coupon}
                </div>
              ))}
            </div>
            {/* Modal Selected Coupon Showing Section */}
            <div
              className={
                currentTab && styles.modalSelectedCouponShowingSectionDiv
              }
            >
              {currentTab && (
                <div className={styles.modalSelectedCouponShowingDiv}>
                  <span className={styles.modalSelectedCouponShowingSpan}>
                    Applied Coupon :-{" "}
                    <span
                      className={styles.modalSelectedCouponShowingSecondSpan}
                    >
                      {" "}
                      {currentTab}
                    </span>
                  </span>
                  {!isLoading && (
                    <div
                      onClick={handleResetBtn}
                      className={styles.modalResetBtn}
                    >
                      Remove Coupon
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Modal Buttons and error showing section*/}
            <div className={styles.modalButtonSectionDiv}>
              {/* error showing div */}
              <div className={styles.errorSectionDiv}>
                {showError && <span>Please select the Coupon</span>}
              </div>
              {/* button div */}
              {isLoading ? (
                <div className={styles.loadingSpinner}></div>
              ) : (
                <div className={styles.modalBtnDiv}>
                  {/* Add Coupon */}
                  <div onClick={handleAddCoupon} className={styles.addCoupon}>
                    Add Coupon
                  </div>
                  {/* skip */}
                  <div onClick={handleSkipCoupon} className={styles.skipBtn}>
                    Skip
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
