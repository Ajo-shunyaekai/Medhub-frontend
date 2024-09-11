import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../style/activeorders.module.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const InquiryRequest = () => {
    const actives = [
        {
            id: "125252",
            date: "12/10/2024",
            buyer_name: "Mezorays Pharma",
            quantity: "250 AED",
            status: "In-process"
        },
        {
            id: "125254",
            date: "12/11/2024",
            buyer_name: "Shree Sai Healthcare",
            quantity: "250 AED",
            status: "In-process"
        },
        {
            id: "125248",
            date: "10/8/2024",
            buyer_name: "Om Sai International",
            quantity: "250 AED",
            status: "In-process"
        },
        {
            id: "125258",
            date: "1/11/2024",
            buyer_name: "R S Healthcare",
            quantity: "250 AED",
            status: "In-process"
        },
        {
            id: "125259",
            date: "14/10/2024",
            buyer_name: "Naval Enterprises",
            quantity: "250 AED",
            status: "In-process"
        }
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;
    const totalOrders = actives.length;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
                                {actives.map((order, index) => (
                                    <div className={styles['actives-table-row-container']} key={index}>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                            <div className={styles['actives-table-text-color']}>{order.id}</div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                            <div className={styles['actives-table-text-color']}>{order.date}</div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-2']}`}>
                                            <div className={`${styles['actives-table-text-color']} ${styles['truncated-text']}`}>{order.buyer_name}</div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                            <div className={styles['actives-table-text-color']}>
                                                {order.status.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                            </div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-btn']} ${styles['actives-table-order-1']}`}>
                                            <Link to={'/admin/seller-inquiry-details'}>
                                                <div className={`${styles['actives-table']} ${styles['actives-table-view']}`}>
                                                    <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </tbody>
                        </Table>
                        <div className={styles['actives-pagi-container']}>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={ordersPerPage}
                                totalItemsCount={totalOrders}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass={styles['page-item']}
                                linkClass={styles['page-link']}
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

export default InquiryRequest;
