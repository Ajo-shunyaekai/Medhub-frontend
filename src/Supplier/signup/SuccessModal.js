import React from 'react';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import styles from '../style/successmodal.module.css';
import Success from '../assest/successful.svg';
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
                    <div className={styles['signup-modal-cont-heading']}>Registration Successful</div>
                    <div className={styles['signup-modal-cont-text']}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </div>
                    <Link to='/supplier/login'>
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
