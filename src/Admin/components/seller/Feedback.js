import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../style/complaint.module.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const Feedback = ({ supportList, handlePageChange, currentPage, totalItems, listPerPage }) => {
    return (
        <>
            <div className={styles['complaint-main-container']}>
                <div className={styles['complaint-container']}>
                    <div className={styles['complaint-container-right-2']}>
                        <Table responsive="xxl" className={styles['complaint-table-responsive']}>
                            <thead>
                                <div className={styles['complaint-table-row-container']} style={{ backgroundColor: 'transparent' }}>
                                    <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                                        <span className={styles['complaint-header-text-color']}>Feedback ID</span>
                                    </div>
                                    <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                                        <span className={styles['complaint-header-text-color']}>Order ID</span>
                                    </div>
                                    <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-2']}`}>
                                        <span className={styles['complaint-header-text-color']}>Feedback</span>
                                    </div>
                                    <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                                        <span className={styles['complaint-header-text-color']}>Action</span>
                                    </div>
                                </div>
                            </thead>
                            <tbody className={styles.bordered}>
                                {supportList?.length > 0 ? (
                                    supportList.map((feedback, index) => (
                                        <div className={styles['complaint-table-row-container']} key={index}>
                                            <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                                                <div className={styles['complaint-table-text-color']}>{feedback.support_id || 'ID Not Provided'}</div>
                                            </div>
                                            <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                                                <div className={styles['complaint-table-text-color']}>{feedback.order_id || 'Order ID Not Provided'}</div>
                                            </div>
                                            <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-2']}`}>
                                                <div className={`${styles['complaint-table-text-color']} ${styles['truncated-text']}`}>
                                                    {feedback.reason || 'Reason Not Provided'}
                                                </div>
                                            </div>
                                            <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-btn']} ${styles['complaint-table-order-1']}`}>
                                                <Link to={`/admin/seller-feedback-details/${feedback.support_id}`}>
                                                    <div className={`${styles['complaint-table']} ${styles['complaint-table-view']}`}>
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
                        <div className={styles['complaint-pagi-container']}>
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
                            <div className={styles['complaint-pagi-total']}>
                                <div>Total Items: {totalItems}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Feedback;
