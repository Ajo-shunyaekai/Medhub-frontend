import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../style/activeorders.module.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import moment from 'moment/moment';

const BuyerPurchasedOrder = () => {
    // Static data for orders
    const orderList = [
        {
            order_id: "125252",
            created_at: "2024-10-12",
            supplier: { supplier_name: "Mezorays Pharma" },
            items: [{ quantity: 250 }],
            status: "In-process"
        },
        {
            order_id: "125254",
            created_at: "2024-11-12",
            supplier: { supplier_name: "Shree Sai Healthcare" },
            items: [{ quantity: 250 }],
            status: "In-process"
        },
        {
            order_id: "125248",
            created_at: "2024-08-10",
            supplier: { supplier_name: "Om Sai International" },
            items: [{ quantity: 250 }],
            status: "In-process"
        },
        {
            order_id: "125258",
            created_at: "2024-11-01",
            supplier: { supplier_name: "R S Healthcare" },
            items: [{ quantity: 250 }],
            status: "In-process"
        },
        {
            order_id: "125259",
            created_at: "2024-10-14",
            supplier: { supplier_name: "Naval Enterprises" },
            items: [{ quantity: 250 }],
            status: "In-process"
        }
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 4;
    const totalOrders = orderList.length;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orderList.slice(indexOfFirstOrder, indexOfLastOrder);

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
                                        <span className={styles['actives-header-text-color']}>PO ID</span>
                                    </div>
                                    <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <span className={styles['actives-header-text-color']}>Inquiry ID</span>
                                    </div>
                                    <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <span className={styles['actives-header-text-color']}>Date</span>
                                    </div>
                                    <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-2']}`}>
                                        <span className={styles['actives-header-text-color']}>Supplier Name</span>
                                    </div>
                                    <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <span className={styles['actives-header-text-color']}>Total Amount</span>
                                    </div>
                                    <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                        <span className={styles['actives-header-text-color']}>Action</span>
                                    </div>
                                </div>
                            </thead>
                            <tbody className={styles.bordered}>
                                {currentOrders.map((order, index) => {
                                    const totalQuantity = order.items.reduce((total, item) => total + item.quantity, 0);
                                    const orderedDate = moment(order.created_at).format("DD/MM/YYYY");
                                    return (
                                        <div className={styles['actives-table-row-container']} key={index}>
                                            <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                                <div className={styles['actives-table-text-color']}>{order.order_id}</div>
                                            </div>
                                            <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                                <div className={styles['actives-table-text-color']}>{order.order_id}</div>
                                            </div>
                                            <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                                <div className={styles['actives-table-text-color']}>{orderedDate}</div>
                                            </div>
                                            <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-2']}`}>
                                                <div className={`${styles['actives-table-text-color']} ${styles['truncated-text']}`}>{order.supplier.supplier_name}</div>
                                            </div>
                                            <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                                <div className={styles['actives-table-text-color']}>{totalQuantity}</div>
                                            </div>
                                            <div className={`${styles['actives-table-row-item']} ${styles['actives-table-btn']} ${styles['actives-table-order-1']}`}>
                                                <Link to={`/admin/order-details/${order.order_id}`}>
                                                    <div className={`${styles['actives-table']} ${styles['actives-table-view']}`}>
                                                        <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
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
};

export default BuyerPurchasedOrder;
