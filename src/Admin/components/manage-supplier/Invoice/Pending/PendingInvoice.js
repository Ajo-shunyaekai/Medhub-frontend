import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../../../assest/style/invoie.module.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const PendingInvoice = ({invoiceList, totalItems, currentPage, listPerPage, handlePageChange}) => {


    return (
        <>
            <div className={styles['invoice-main-container']}>
                <div className={styles['invoice-container']}>
                    <div className={styles['invoice-container-right-2']}>
                        <Table responsive="xxl" className={styles['invoice-table-responsive']}>
                            <thead>
                                <div className={styles['invoice-table-row-container']} style={{ backgroundColor: 'transparent' }}>
                                    <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-order-1']}`}>
                                        <span className={styles['invoice-header-text-color']}>Invoice No.</span>
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
                            {invoiceList && invoiceList.length > 0 ? (
                                    invoiceList.map((invoice, index) => (
                                        <div className={styles['invoice-table-row-container']} key={index}>
                                            <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-order-1']}`}>
                                                <div className={styles['invoice-table-text-color']}>{invoice.invoice_no}</div>
                                            </div>
                                            <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-order-1']}`}>
                                                <div className={styles['invoice-table-text-color']}>{invoice.order_id}</div>
                                            </div>
                                            <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-order-1']}`}>
                                                <div className={styles['invoice-table-text-color']}>{invoice.buyer_name}</div>
                                            </div>
                                            <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-order-1']}`}>
                                                <div className={styles['invoice-table-text-color']}>
                                                    {invoice.total_payable_amount ? `${invoice.total_payable_amount} USD` : ''}
                                                </div>
                                            </div>
                                            <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-order-1']}`}>
                                                <div className={styles['invoice-table-text-color']}>
                                                    {invoice.status ? `${invoice.status.charAt(0).toUpperCase()}${invoice.status.slice(1)}` : ''}
                                                </div>
                                            </div>
                                            <div className={`${styles['invoice-table-row-item']} ${styles['invoice-table-btn']} ${styles['invoice-table-order-1']}`}>
                                                <Link to={`/admin/supplier-invoice-details/${invoice.invoice_id}`}>
                                                    <div className={`${styles['invoice-table']} ${styles['invoice-table-view']}`}>
                                                        <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles['no-data-message']}>No data available</div>
                                )}

                            </tbody>
                        </Table>
                        <div className={styles['invoice-pagi-container']}>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={listPerPage}
                                totalItemsCount={totalItems}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                    linkClass="page-link"
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

