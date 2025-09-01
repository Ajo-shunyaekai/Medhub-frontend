import React, { useEffect, useRef } from 'react'
import styles from './bidProductDetails.module.css'

const QuoteRequestedModal = ({isOpen, onClose}) => {

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




  const handleCancelBtn = () => {
    onClose();
  }

  if(!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox} ref={modalRef}>       
          <div className={styles.modalHeaderContainer}>
            <p className={styles.modalHeaderPara}>Quotation Received</p>
            <button className={styles.closeButton} onClick={onClose}>
              &times;
            </button>
          </div>

          <div className={styles.modalDescSection}>
            <p>You have received the quotation from buyer , you can't edit now.</p>
          </div>


            <div className={styles.modalBtnSection}>
               <button /* onClick={} */ className={styles.sendQuote}>
                    View Quotation
                </button>
            </div>
           
        
      </div>
    </div>
  )
}

export default QuoteRequestedModal