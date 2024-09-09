import React, { useState } from 'react';
import styles from '../../style/invoicecard.module.css'
import Cheque from '../../assest/cheque.png'

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
                            <div className={styles['invoice-card-conts-text']}>Cheque</div>
                        </div>
                        <div className={styles['invoice-card-conts']}>
                            <div className={styles['invoice-card-conts-head']}>Amount :</div>
                            <div className={styles['invoice-card-conts-text']}>422</div>
                        </div>
                    </div>
                    <div className={styles['invoice-card-section']}>
                        <div className={styles['invoice-card-conts']}>
                            <div className={styles['invoice-card-conts-head']}>Transaction ID :</div>
                            <div className={styles['invoice-card-conts-text']}>TRE12345678</div>
                        </div>
                        <div className={styles['invoice-card-conts']}>
                            <div className={styles['invoice-card-conts-head']}>Date :</div>
                            <div className={styles['invoice-card-conts-text']}>12/04/2024</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles['invoice-card-img-container']}>
                <div className={styles['invoice-card-img']}>
                    <img src={Cheque} alt="Cheque" onClick={openModal} style={{ cursor: 'pointer' }} />
                </div>
            </div>

            {isModalOpen && (
                <div className={styles['modal-overlay']}>
                    <div className={styles['modal-content']}>
                        <span onClick={closeModal} className={styles['close-button']}>&times;</span>
                        <img src={Cheque} alt="Cheque" className={styles['modal-image']} />
                    </div>
                </div>
            )}
        </>
    )
}

export default InvoiceCardDesign