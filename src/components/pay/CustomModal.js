import React from 'react';
import styles from '../../style/custom.module.css';

const CustomModal = ({ isOpen, onClose, children }) => {

    const handleClose = () => {
        onClose();
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return isOpen ? (
        <div className={styles['modal-overlay']} onClick={onClose}>
            <div className={styles['modal-content']} onClick={handleContentClick}>
                <span className={styles['modal-close']} onClick={handleClose}>&times;</span>
                {children}
            </div>
        </div>
    ) : null;
};

export default CustomModal;
