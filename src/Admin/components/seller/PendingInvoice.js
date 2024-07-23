import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../style/invoie.module.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const PendingInvoice = ({invoiceList, totalItems, currentPage, listPerPage, handlePageChange}) => {
//     const pending = [
//         {
//             invoice_id: "125252",
//             order_id: "14785236",
//             buyer_name: "Atom Pharma",
//             amount:"450 AED",
//             status:"Pending"

//         },
//         {
//           invoice_id: "125252",
//           order_id: "14785236",
//           buyer_name: "Atom Pharma",
//           amount:"450 AED",
//           status:"Pending"

//       },
//       {
//         invoice_id: "125252",
//         order_id: "14785236",
//         buyer_name: "Atom Pharma",
//         amount:"450 AED",
//         status:"Pending"

//     },
//     {
//       invoice_id: "125252",
//       order_id: "14785236",
//       buyer_name: "Atom Pharma",
//       amount:"450 AED",
//       status:"Pending"

//   },
//     ];

//     const [currentPage, setCurrentPage] = useState(1);
//     const ordersPerPage = 4;
//     const indexOfLastOrder = currentPage * ordersPerPage;
//     const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
//     const currentOrders = pending.slice(indexOfFirstOrder, indexOfLastOrder);

//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

    return (
        <>
            <div className={styles['invoice-main-container']}>
                <div className={styles['invoice-container']}>
                    <div className={styles['invoice-container-right-2']}>
                        <Table responsive="xxl" className={styles['invoice-table-responsive']}>
                            <thead>
                                <div className={styles['invoice-table-row-container']} style={{ backgroundColor: 'transparent' }}>
                                    <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-order-1']}`}>
                                        <span className={styles['invoice-header-text-color']}>invoice No.</span>
                                    </div>
                                    <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-order-1']}`}>
                                        <span className={styles['invoice-header-text-color']}>Order ID</span>
                                    </div>
                                    <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-order-1']}`}>
                                        <span className={styles['invoice-header-text-color']}>Buyer Name</span>
                                    </div>
                                    <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-order-1']}`}>
                                        <span className={styles['invoice-header-text-color']}>Total Amount</span>
                                    </div>
                                    <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-order-1']}`}>
                                        <span className={styles['invoice-header-text-color']}>Status</span>
                                    </div>
                                    <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-order-1']}`}>
                                        <span className={styles['invoice-header-text-color']}>Action</span>
                                    </div>
                                </div>
                            </thead>
                            <tbody className={styles.bordered}>
                                {invoiceList?.map((invoice, index) => (
                                    <div className={styles['invoice-table-row-container']} key={index}>
                                        <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-order-1']}`}>
                                            <div className={styles['invoice-table-text-color']}>{invoice.invoice_number}</div>
                                        </div>
                                        <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-order-1']}`}>
                                            <div className={styles['invoice-table-text-color']}>{invoice.order_id}</div>
                                        </div>
                                        <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-order-1']}`}>
                                            <div className={styles['invoice-table-text-color']}>{invoice.buyer_company}</div>
                                        </div>
                                        <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-order-1']}`}>
                                            <div className={styles['invoice-table-text-color']}>{invoice.totalPrice}</div>
                                        </div>
                                        <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-order-1']}`}>
                                            <div className={styles['invoice-table-text-color']}>{invoice.order_status}</div>
                                        </div>
                                        <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-btn']} ${styles['invoice-table-order-1']}`}>
                                            <Link to='/admin/order-details'>
                                                <div className={`${styles['invoice-table']} ${styles['invoice-table-view']}`}>
                                                    <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </tbody>
                        </Table>
                        <div className={styles['invoice-pagi-container']}>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={listPerPage}
                                totalItemsCount={totalItems}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass={styles['page-item']}
                                linkClass={styles['page-link']}
                                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                hideFirstLastPages={true}
                            />
                            <div className={styles['invoice-pagi-total']}>
                                <div>Total Items: {totalItems}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PendingInvoice;

