import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../style/activeorders.module.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import moment from 'moment-timezone';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const InquiryRequest = ({inquiryList, totalInquiries, currentPage, inquiriesPerPage, handlePageChange, activeLink }) => {

    return (
        <>
            <div className={styles['actives-main-container']}>
                <div className={styles['actives-container']}>
                    <div className={styles['actives-container-right-2']}>
                        <Table responsive="xxl" className={styles['actives-table-responsive']}>
                            <thead>
                                <div className={styles['actives-table-row-container']} style={{ backgroundColor: 'transparent' }}>
                                    <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <span className={styles['actives-header-text-color']}>Inquiry ID</span>
                                    </div>
                                    <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <span className={styles['actives-header-text-color']}>Date</span>
                                    </div>
                                    <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-2']}`}>
                                        <span className={styles['actives-header-text-color']}>Buyer Name</span>
                                    </div>
                                    <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <span className={styles['actives-header-text-color']}>Status</span>
                                    </div>
                                    <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <span className={styles['actives-header-text-color']}>Action</span>
                                    </div>
                                </div>
                            </thead>
                            <tbody className={styles.bordered}>
                            {inquiryList.length > 0 ? (
                              inquiryList.map(ongoing => (
                                    <div className={styles['actives-table-row-container']} key={ongoing.ongoing_id}>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                            <div className={styles['actives-table-text-color']}>{ongoing.enquiry_id}</div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                            <div className={styles['actives-table-text-color']}>{moment(ongoing?.created_at).format("DD/MM/YYYY")}</div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-2']}`}>
                                            <div className={`${styles['actives-table-text-color']} ${styles['truncated-text']}`}>{ongoing?.buyer.buyer_name}</div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                            <div className={styles['actives-table-text-color']}>
                                                {ongoing?.enquiry_status?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                            </div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-btn']} ${styles['actives-table-order-1']}`}>
                                            <Link to={`/admin/seller-inquiry-details/${ongoing?.enquiry_id}`}>
                                                <div className={`${styles['actives-table']} ${styles['actives-table-view']}`}>
                                                    <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                    ))
                                ) : (
                                    <tbody>
                                      <tr>
                                        <td colSpan="5" className="no-data-message">
                                          No Ongoing Inquiries
                                        </td>
                                      </tr>
                                    </tbody>
                                  )}
                            </tbody>
                        </Table>
                        <div className={styles['actives-pagi-container']}>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={inquiriesPerPage}
                                totalItemsCount={totalInquiries}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                               itemClass="page-item"
                                    linkClass="page-link"
                                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                hideFirstLastPages={true}
                            />
                            <div className={styles['actives-pagi-total']}>
                                <div>Total Items: {totalInquiries}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InquiryRequest;
