import React from 'react';
import styles from '../../../assets/style/suppliermodal.module.css';

const SupplierCustomModal = ({ onClose }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.supplierIdSection}>
          <label>Supplier ID: </label>
          <span>SEP123456</span>
        </div>
        <div className={styles.commentsSection}>
          <label htmlFor="comments" className={styles.labelReject}>Reason for Rejection:</label>
          <textarea id="comments" rows="4" cols="10" className={styles.ModaltextArea} placeholder="Enter your reason here..."></textarea>
        </div>
        <div className={styles.modalActions}>
          <button className={styles.rejectButton}>Reject</button>
          <button onClick={onClose} className={styles.closeButton}>
            Close
          </button>

        </div>
      </div>
    </div>
  );
};

export default SupplierCustomModal;
