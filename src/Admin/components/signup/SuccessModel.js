import React from 'react';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import styles from '../../style/successmodal.module.css';
import Success from '../../assest/successful.svg';
import { Link } from 'react-router-dom';
// Import PropTypes for type-checking

function SuccessModal({ show, handleClose }) {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton />
            <Modal.Body>
                <div className={styles['signup-modal-success-container']}>
                    <div className={styles['signup-modal-image-section']}>
                        <img src={Success} />
                    </div>
                    <div className={styles['signup-modal-cont-heading']}>Thank You for Signing Up!!</div>
                    <div className={styles['signup-modal-cont-text']}>
                        Your registration is being reviewed. You’ll receive an email once it's approved.
                    </div>
                    <Link to='/admin/login'>
                        <div className={styles['signup-modal-cont-button']}>
                            Go to Login Page
                        </div>
                    </Link>
                </div>
            </Modal.Body>
        </Modal>
    );
}

SuccessModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default SuccessModal;
