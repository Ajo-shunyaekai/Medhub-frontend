import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from "../../assets/style/secondsidebar.module.css";
import { TbReorder } from "react-icons/tb";
import OrderRequest from './OrderRequest';
import ActiveOrders from './ActiveOrders/ActiveOrder';
import CompletedOrders from './CompletedOrders/CompleteOrder';
import Loader from '../SharedComponents/Loader/Loader';
import { toast } from 'react-toastify';
import { apiRequests } from '../../../api';


const Order = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [orderList, setOrderList] = useState([])
    const [totalOrders, setTotalOrders] = useState()
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    const getActiveLinkFromPath = (path) => {
        switch (path) {
            case '/supplier/order/active':
                return 'active';
            case '/supplier/order/completed':
                return 'completed';
            default:
                return 'order-request';
        }
    };

    const activeLink = getActiveLinkFromPath(location.pathname);

    const handleLinkClick = (link) => {
        setCurrentPage(1);
        switch (link) {
            case 'active':
                navigate('/supplier/order/active');
                break;
            case 'completed':
                navigate('/supplier/order/completed');
                break;
            default:
                navigate('/supplier/order/order-request');
        }
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [modal, setModal] = useState(false)

    const showModal = () => {
        setModal(!modal)
    }

    const [showOrder, showOrderDetails] = useState(false)

    const showOrderModal = () => {
        showOrderDetails(!showOrder)
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const fetchData = async () => {
        const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
        const supplierIdLocalStorage = localStorage?.getItem("supplier_id");

        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            localStorage?.clear();
            navigate("/supplier/login");
            return;
        }
        const obj = {
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
            filterKey: activeLink,
            page_no: currentPage,
            limit: ordersPerPage,
        }

        try {
            const response = await apiRequests.getRequest(`order/get-all-order-list?filterKey=${activeLink}&pageNo=${currentPage}&pageSize=${ordersPerPage}`)
            if (response?.code === 200) {
                setOrderList(response.result.data)
                setTotalOrders(response.result.totalItems)
            }
        } catch (error) {
            toast(error.message, { type: 'error' })
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, [activeLink, currentPage])

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.title}>
                            Orders
                        </div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.sidebar}>
                            <div
                                onClick={() => handleLinkClick('active')}
                                className={`${styles.tab} ${activeLink === 'active' ? styles.active : ''}`}
                            >
                                <TbReorder className={styles.icon} />
                                <div className={styles.text}>Active Orders</div>
                            </div>
                            <div
                                onClick={() => handleLinkClick('completed')}
                                className={`${styles.tab} ${activeLink === 'completed' ? styles.active : ''}`}
                            >
                                <TbReorder className={styles.icon} />
                                <div className={styles.text}>Completed Orders</div>
                            </div>
                        </div>

                        <div className={styles.main}>
                            {
                                activeLink === 'active' ?
                                    <ActiveOrders
                                        orderList={orderList}
                                        totalOrders={totalOrders}
                                        currentPage={currentPage}
                                        ordersPerPage={ordersPerPage}
                                        handlePageChange={handlePageChange}
                                        activeLink={activeLink}
                                    />
                                    : activeLink === 'completed' ?
                                        <CompletedOrders
                                            orderList={orderList}
                                            totalOrders={totalOrders}
                                            currentPage={currentPage}
                                            ordersPerPage={ordersPerPage}
                                            handlePageChange={handlePageChange}
                                            activeLink={activeLink}
                                        />
                                        : activeLink === 'order-request' ?
                                            <OrderRequest
                                                orderList={orderList}
                                                totalOrders={totalOrders}
                                                currentPage={currentPage}
                                                ordersPerPage={ordersPerPage}
                                                handlePageChange={handlePageChange}
                                                activeLink={activeLink}
                                            /> : ''
                            }
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export default Order
