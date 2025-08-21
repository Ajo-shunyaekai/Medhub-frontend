import React, { useEffect, useRef, useState } from 'react'
import styles from './RequestModal.module.css'

const RequestModal = ({isOpen, onClose, handleRequestQuote, requestQuoteBidObject, setRequestQuoteBidObject,isLoading ,setIsLoading}) => {

  const modalRef = useRef();


  useEffect(() => {
    const handleClickOutside = (event) => {
      /* console.log("Clicked on:", event.target); */
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (
          event.target.closest(`.${styles.sendQuote}`) ||
          event.target.closest(`.${styles.cancelBtn}`)
        ) {
      return;
    }
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
    try {
     /*  console.log(requestQuoteBidObject); */
      setIsLoading(true);
      await handleRequestQuote(requestQuoteBidObject); 
      onClose();
    } catch (error) {
      console.error("Error while sending quote:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancelBtn = () => {
    setRequestQuoteBidObject(null);
    onClose();
  }

  if(!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox} ref={modalRef}>       
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
            <div  onClick={handleQuoteBtn} className={isLoading?styles.sendQuoteLoaderDiv:styles.sendQuote}>
              {isLoading?<div className={styles.loadingSpinner}></div>:(`Send Quote`)}
            </div>
            {/* cancel */}
            <div onClick={handleCancelBtn} className={styles.cancelBtn}>
              Cancel
            </div>
          </div>
        
      </div>
    </div>
  )
}

export default RequestModal