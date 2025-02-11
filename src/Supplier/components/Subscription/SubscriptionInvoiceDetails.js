
import React from 'react';
import styles from './subscriptioninvoice.module.css'
import logo from '../../assest/images/logo.svg';
import html2pdf from 'html2pdf.js';

const SubscriptionInvoiceDetails = ({ title, service, details }) => {
    console.log(details)
    const handleDownload = () => {
        const invoiceElement = document.getElementById('invoiceToDownload');
        const options = {
            margin: 0.5,
            filename: 'Invoice.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(options).from(invoiceElement).save();
    };
    return (
        <div className={styles.invoiceMainContainer}>
            <div className={styles.invoiceSection} >
                <div className={`${styles.invoiceDownloadSection} hideInPdf`}>
                    <span className={styles.invoiceDownload} onClick={handleDownload}>
                        Download
                    </span>
                </div>
                <div className={styles.container} id="invoiceToDownload">
                    <table className={styles.table} style={{ width: "100%" }}>
                        <tbody>
                            <tr>
                                <td colSpan="2">
                                    <table>
                                        <tr>
                                            <td className={styles.logoSection}>
                                                <img src={logo} alt="company logo" className={styles.logoImage} />
                                                <p>D55-PBU</p>
                                                <p>DUBAI PRODUCTION CITY</p>
                                                <p>Dubai-United Arab Emirates</p>
                                                <p>+971 54279 6424</p>

                                            </td>
                                            <td className={styles.invoiceTitle}>
                                                <p>Invoice</p>
                                                <div className={styles.bookingId}>
                                                    <p>Payment ID: 258963258  </p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <table style={{ width: '100%', marginTop: '10px' }}>
                                        <tr>
                                            <td className={styles.billTo}>
                                                <p>Bill To:</p>
                                                <p className={styles.billToName}>Shivanshi Tripathi</p>
                                            </td>
                                            <td className={styles.invoiceDetails}>
                                                <p>
                                                    Invoice Date: 12/12/2024
                                                </p>
                                                <p>
                                                    Invoice No.: 789654789
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>

                                <td colSpan="2">
                                    <table style={{ width: '100%', borderSpacing: 0, marginTop: "20px" }}>
                                        <thead>
                                            <tr className={styles.serviceHeader}>
                                                <th>Items Ordered</th>
                                                <th className={styles.amountRightAlign}>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className={styles.serviceItem}>
                                                <td>Monthly Membership</td>
                                                <td className={styles.amountRightAlign}>50</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>

                            </tr>
                            <tr className={styles.serviceItem}>
                                <td style={{ width: '60%', textAlign: 'left' }}>
                                    <p className={styles.totalAmountLabel}>Total Amount:</p>
                                </td>
                                <td className={styles.amountRightAlign}>
                                    <p className={styles.totalAmountValue}>
                                        121441
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionInvoiceDetails;