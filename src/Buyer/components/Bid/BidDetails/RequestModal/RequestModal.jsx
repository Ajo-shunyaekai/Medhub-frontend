import React, { useEffect, useRef, useState } from 'react'
import styles from './RequestModal.module.css'

const RequestModal = ({isOpen, onClose, handleRequestQuote, requestQuoteBidObject, setRequestQuoteBidObject,isLoading ,setIsLoading}) => {

  const modalRef = useRef();


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

  /* handle quote btn */
  const handleQuoteBtn = async() => {
    setIsLoading(true);
    await handleRequestQuote(requestQuoteBidObject);
    onClose();
  }

  const handleCancelBtn = () => {
    setRequestQuoteBidObject(null);
    onClose();
  }

  if(!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox} ref={modalRef}>
        <div>
          <div className={styles.modalHeaderContainer}>
            <p className={styles.modalHeaderPara}>Request Quote</p>
            <button className={styles.closeButton} onClick={onClose}>
              &times;
            </button>
          </div>

          <div className={styles.modalDescSection}>
            <p>Once a quotation is sent, this bid will be considered closed, and you will not be able to request other vendors.</p>
          </div>

          {/* button */}
          <div className={styles.modalBtnSection}>
            {/* send Quotate */}
            {
              isLoading?
              (
                <div className={styles.loadingSpinner}></div>
              )
              :
              (
              <div onClick={handleQuoteBtn} className={styles.sendQuote}>
                Send Quote
              </div>
              )
            }
            {/* cancel */}
            <div onClick={handleCancelBtn} className={styles.cancelBtn}>
              Cancel
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestModal