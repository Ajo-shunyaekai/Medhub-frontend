import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../style/complaint.module.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const BuyerComplaint = ({supportList, handlePageChange, currentPage, totalItems,listPerPage}) => {
    // const complaint = [
    //     {
    //         complaint_id: "125252",
    //         order_id: "14785236",
    //         complaint: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    //         status:"Under Review"
    //     },
    //     {
    //         complaint_id: "112522",
    //         order_id: "1565236",
    //         complaint: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    //         status:"Pending"
    //     },
    //     {
    //         complaint_id: "11478256",
    //         order_id: "1369852",
    //         complaint: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    //         status:"In Process"
    //     },
    //     {
    //         complaint_id: "1789654",
    //         order_id: "1253652",
    //         complaint: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    //         status:"Resolved"
    //     },
    //     {
    //         complaint_id: "125632",
    //         order_id: "1475445",
    //         complaint: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    //         status:"Pending"
    //     },
    // ];

    // const [currentPage, setCurrentPage] = useState(1);
    // const ordersPerPage = 4;
    // const indexOfLastOrder = currentPage * ordersPerPage;
    // const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    // const currentOrders = complaint.slice(indexOfFirstOrder, indexOfLastOrder);

    // const handlePageChange = (pageNumber) => {
    //     setCurrentPage(pageNumber);
    // };

    return (
        <>
            <div className={styles['complaint-main-container']}>
                <div className={styles['complaint-container']}>
                    <div className={styles['complaint-container-right-2']}>
                        <Table responsive="xxl" className={styles['complaint-table-responsive']}>
                            <thead>
                                <div className={styles['complaint-table-row-container']} style={{ backgroundColor: 'transparent' }}>
                                    <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                                        <span className={styles['complaint-header-text-color']}>Complaint ID</span>
                                    </div>
                                    <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                                        <span className={styles['complaint-header-text-color']}>Order ID</span>
                                    </div>
                                    <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-2']}`}>
                                        <span className={styles['complaint-header-text-color']}>Complaint</span>
                                    </div>
                                    <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                                        <span className={styles['complaint-header-text-color']}>Status</span>
                                    </div>
                                    <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                                        <span className={styles['complaint-header-text-color']}>Action</span>
                                    </div>
                                </div>
                            </thead>
                            <tbody className={styles.bordered}>
                                {supportList?.map((complaint, index) => (
                                    <div className={styles['complaint-table-row-container']} key={index}>
                                        <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                                            <div className={styles['complaint-table-text-color']}>{complaint.support_id}</div>
                                        </div>
                                        <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                                            <div className={styles['complaint-table-text-color']}>{complaint.order_id}</div>
                                        </div>
                                        <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-2']}`}>
                                            <div className={`${styles['complaint-table-text-color']} ${styles['truncated-text']}`}>{complaint.reason}</div>
                                        </div>
                                        <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-order-1']}`}>
                                            <div className={styles['complaint-table-text-color']}>{'pending'}</div>
                                        </div>
                                        <div className={`${styles['complaint-table-row-item']} ${styles['complaint-table-btn']} ${styles['complaint-table-order-1']}`}>
                                            <Link to='/admin/order-details'>
                                                <div className={`${styles['complaint-table']} ${styles['complaint-table-view']}`}>
                                                    <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </tbody>
                        </Table>
                        <div className={styles['complaint-pagi-container']}>
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

export default BuyerComplaint;
