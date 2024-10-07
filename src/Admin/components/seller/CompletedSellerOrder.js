import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../style/activeorders.module.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import moment from 'moment/moment';

const CompletedSellerOrder = ({orderList, totalOrders, currentPage, ordersPerPage, handlePageChange}) => {

    return (
        <>
            <div className={styles['actives-main-container']}>
                <div className={styles['actives-container']}>
                    <div className={styles['actives-container-right-2']}>
                        <Table responsive="xxl" className={styles['actives-table-responsive']}>
                        <thead>
                                <div className={styles['actives-table-row-container']} style={{ backgroundColor: 'transparent' }}>
                                    <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <span className={styles['actives-header-text-color']}>Order ID</span>
                                    </div>
                                    <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <span className={styles['actives-header-text-color']}>Date</span>
                                    </div>
                                    <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-2']}`}>
                                        <span className={styles['actives-header-text-color']}>Buyer Name</span>
                                    </div>
                                    <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <span className={styles['actives-header-text-color']}>Quantity</span>
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
                            {orderList?.length > 0 ? (
                                orderList.map((order, index) => {
                                    const totalQuantity = order.items.reduce((total, item) => {
                                    return total + (item.quantity || item.quantity_required);
                                    }, 0);
                                    const orderedDate = moment(order.created_at).format("DD/MM/YYYY");

                                    return (
                                    <div className={styles['actives-table-row-container']} key={index}>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <div className={styles['actives-table-text-color']}>{order.order_id}</div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <div className={styles['actives-table-text-color']}>{orderedDate}</div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-2']}`}>
                                        <div className={`${styles['actives-table-text-color']} ${styles['truncated-text']}`}>{order.buyer?.buyer_name}</div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <div className={styles['actives-table-text-color']}>{totalQuantity}</div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <div className={styles['actives-table-text-color']}>{order.order_status ? 'Completed' : ''}</div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-btn']} ${styles['actives-table-order-1']}`}>
                                        <Link to={`/admin/supplier-order-details/${order.order_id}`}>
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
                                itemsCountPerPage={ordersPerPage}
                                totalItemsCount={totalOrders}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                              itemClass="page-item"
                                    linkClass="page-link"
                                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                hideFirstLastPages={true}
                            />
                            <div className={styles['actives-pagi-total']}>
                            <div>Total Items: {totalOrders}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CompletedSellerOrder;