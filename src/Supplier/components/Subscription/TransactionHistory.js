import React from 'react';
import Pagination from "react-js-pagination";
import { Link } from 'react-router-dom';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import styles from './subscription.module.css';

const TransactionHistory = () => {
    const staticInvoices = [
        {
            invoice_no: "INV-001",
            order_id: "ORD-1234",
            supplier_name: "John Doe",
            total_payable_amount: "150.00",
            mode_of_payment: "Credit Card",
            status: "Paid",
            invoice_id: "1"
        },
        {
            invoice_no: "INV-002",
            order_id: "ORD-5678",
            supplier_name: "Jane Smith",
            total_payable_amount: "200.00",
            mode_of_payment: "PayPal",
            status: "Pending",
            invoice_id: "2"
        }
    ];

    return (
        <div className={styles.transactionHistoryContainer}>
                <table className={styles.transactionTable}>
                    <thead className={styles.thead}>
                        <tr className={styles.tr} style={{backgroundColor:"transparent"}}>
                            <th className={styles.th}>Date</th>
                            <th className={styles.th}>Transaction ID</th>
                            <th className={styles.th}>Plan</th>
                            <th className={styles.th}>Mode</th>
                            <th className={styles.th}>Amount</th>
                            <th className={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                        {staticInvoices.map((invoice, i) => (
                            <tr className={styles.tr} key={i}>
                                <td className={styles.td}>{invoice.invoice_no}</td>
                                <td className={styles.td}>{invoice.order_id}</td>
                                <td className={styles.td}>{invoice.supplier_name}</td>
                                <td className={styles.td}>{invoice.total_payable_amount} USD</td>
                                <td className={styles.td}>{invoice.mode_of_payment}</td>
                                <td className={styles.td}>
                                    <div className={styles.transactionActionButtons}>
                                        <Link className={styles.transactionViewIcon} to={`/supplier/subscription-invoice-details`}>
                                            <VisibilityOutlinedIcon className={styles.viewIcon}  />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            <div className={styles.transactionPaginationContainer}>
                <Pagination
                    activePage={1}
                    itemsCountPerPage={10}
                    totalItemsCount={staticInvoices.length}
                    pageRangeDisplayed={5}
                    itemClass="page-item"
                    linkClass="page-link"
                    prevPageText={<KeyboardDoubleArrowLeftIcon />}
                    nextPageText={<KeyboardDoubleArrowRightIcon />}
                    hideFirstLastPages={true}
                />
            </div>
        </div>
    );
};

export default TransactionHistory;
