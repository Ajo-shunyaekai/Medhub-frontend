import React, { useState } from 'react';
import styles from './invoicecard.module.css'

const InvoiceCardDesign = ({invoiceDetails}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <div className={styles['invoice-card-design-container']}>
                <div className={styles['invoice-card-design-inner']}>
                    <div className={styles['invoice-card-section']}>
                        <div className={styles['invoice-card-conts']}>
                            <div className={styles['invoice-card-conts-head']}>Mode of Payment :</div>
                            <div className={styles['invoice-card-conts-text']}>{invoiceDetails?.mode_of_payment}</div>
                        </div>
                        <div className={styles['invoice-card-conts']}>
                            <div className={styles['invoice-card-conts-head']}>Amount :</div>
                            <div className={styles['invoice-card-conts-text']}>{invoiceDetails?.amount_paid} USD</div>
                        </div>
                    </div>
                    <div className={styles['invoice-card-section']}>
                        <div className={styles['invoice-card-conts']}>
                            <div className={styles['invoice-card-conts-head']}>Transaction ID :</div>
                            <div className={styles['invoice-card-conts-text']}>{invoiceDetails?.transaction_id}</div>
                        </div>
                        <div className={styles['invoice-card-conts']}>
                            <div className={styles['invoice-card-conts-head']}>Date :</div>
                            <div className={styles['invoice-card-conts-text']}>{invoiceDetails?.payment_date}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles['invoice-card-img-container']}>
                <div className={styles['invoice-card-img']}>
                    <img 
                    // src={Cheque} 
                    src={`${process.env.REACT_APP_SERVER_URL}uploads/buyer/order/invoice_images/${invoiceDetails?.transaction_image[0]}`}
                    alt="Cheque" onClick={openModal} style={{ cursor: 'pointer' }} />
                </div>
            </div>

            {isModalOpen && (
                <div className={styles['modal-overlay']}>
                    <div className={styles['modal-content']}>
                        <span onClick={closeModal} className={styles['close-button']}>&times;</span>
                        <img 
                        // src={Cheque} 
                        src={`${process.env.REACT_APP_SERVER_URL}uploads/buyer/order/invoice_images/${invoiceDetails?.transaction_image[0]}`}
                        alt="Cheque" className={styles['modal-image']} />
                    </div>
                </div>
            )}
        </>
    )
}

export default InvoiceCardDesign