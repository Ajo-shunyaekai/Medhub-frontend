import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../style/activeorders.module.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import moment from 'moment/moment';

const PurchasedOrder = ({poList, totalList, currentPage, listPerPage, handlePageChange, activeLink}) => {
    

    return (
        <>
            <div className={styles['actives-main-container']}>
                <div className={styles['actives-container']}>
                    <div className={styles['actives-container-right-2']}>
                        <Table responsive="xxl" className={styles['actives-table-responsive']}>
                            <thead>
                                <div className={styles['actives-table-row-container']} style={{ backgroundColor: 'transparent' }}>
                                    <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <span className={styles['actives-header-text-color']}>PO ID</span>
                                    </div>
                                    <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <span className={styles['actives-header-text-color']}>Inquiry ID</span>
                                    </div>
                                    <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <span className={styles['actives-header-text-color']}>PO Date</span>
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
                            {poList?.length > 0 ? (
                                poList.map((list, index) => {
                                    const totalQuantity = list?.items?.reduce((total, item) => {
                                    return total + (item.quantity || item.quantity_required);
                                    }, 0);
                                    const orderedDate = moment(list.created_at).format("DD/MM/YYYY");

                                    return (
                                    <div className={styles['actives-table-row-container']} key={index}>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <div className={styles['actives-table-text-color']}>{list.purchaseOrder_id}</div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <div className={styles['actives-table-text-color']}>{list.enquiry_id}</div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <div className={styles['actives-table-text-color']}>{orderedDate}</div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-2']}`}>
                                        <div className={`${styles['actives-table-text-color']} ${styles['truncated-text']}`}>{list.buyer?.buyer_name}</div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <div className={styles['actives-table-text-color']}>
                                            {list?.po_status?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        </div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-btn']} ${styles['actives-table-order-1']}`}>
                                        <Link to={`/admin/seller-purchased-order-details/${list.purchaseOrder_id}`}>
                                            <div className={`${styles['actives-table']} ${styles['actives-table-view']}`}>
                                            <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                                            </div>
                                        </Link>
                                        </div>
                                    </div>
                                    );
                                })
                                ) : (
                                <div className={styles['no-data-message']}>No data available</div>
                                )}

                            </tbody>
                        </Table>
                        <div className={styles['actives-pagi-container']}>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={listPerPage}
                                totalItemsCount={totalList}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                               itemClass="page-item"
                                    linkClass="page-link"
                                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                hideFirstLastPages={true}
                            />
                            <div className={styles['actives-pagi-total']}>
                                <div>Total Items: {totalList}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PurchasedOrder;
