import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../style/activeorders.module.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import moment from 'moment/moment';

const PurchasedOrder = () => {
    const staticOrders = [
        {
            order_id: "125252",
            created_at: "2024-10-12",
            buyer: { buyer_name: "Mezorays Pharma" },
            status: "in-process",
            items: [{ quantity: 100 }, { quantity_required: 150 }]
        },
        {
            order_id: "125254",
            created_at: "2024-11-12",
            buyer: { buyer_name: "Shree Sai Healthcare" },
            status: "in-process",
            items: [{ quantity: 120 }]
        },
        {
            order_id: "125248",
            created_at: "2024-08-10",
            buyer: { buyer_name: "Om Sai International" },
            status: "in-process",
            items: [{ quantity: 200 }]
        },
        {
            order_id: "125258",
            created_at: "2024-11-01",
            buyer: { buyer_name: "R S Healthcare" },
            status: "in-process",
            items: [{ quantity: 250 }]
        },
        {
            order_id: "125259",
            created_at: "2024-10-14",
            buyer: { buyer_name: "Naval Enterprises" },
            status: "in-process",
            items: [{ quantity: 300 }]
        },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 2;
    const totalOrders = staticOrders.length;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = staticOrders.slice(indexOfFirstOrder, indexOfLastOrder);

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
                            {currentOrders.map((order, index) => {
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
                                            <div className={styles['actives-table-text-color']}>{order.order_id}</div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                            <div className={styles['actives-table-text-color']}>{orderedDate}</div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-2']}`}>
                                            <div className={`${styles['actives-table-text-color']} ${styles['truncated-text']}`}>{order.buyer?.buyer_name}</div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-order-1']}`}>
                                            <div className={styles['actives-table-text-color']}>
                                                {order?.status?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                            </div>
                                        </div>
                                        <div className={`${styles['actives-table-row-item']} ${styles['actives-table-btn']} ${styles['actives-table-order-1']}`}>
                                            <Link to={`/admin/seller-purchased-order-details`}>
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

export default PurchasedOrder;
