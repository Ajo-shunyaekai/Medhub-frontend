import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../../assets/style/secondsidebar.module.css'
import { TbReorder } from "react-icons/tb";
import ActiveOrders from './ActiveOrders/ActiveOrder';
import CompletedOrders from './CompletedOrders/CompleteOrder';
import Loader from '../SharedComponents/Loader/Loader';
import { toast } from 'react-toastify';
import { apiRequests } from '../../../api';


const Order = () => {
    const location = useLocation();
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true);
    const [orderList, setOrderList] = useState([])
    const [totalOrders, setTotalOrders] = useState()
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;


    const getActiveLinkFromPath = (path) => {

        switch (path) {
            case '/buyer/order/active-orders':
                return 'active';
            case '/buyer/order/completed-orders':
                return 'completed';
            default:
                return 'active';
        }
    };

    const activeLink = getActiveLinkFromPath(location.pathname);

    const handleLinkClick = (link) => {
        setCurrentPage(1)
        switch (link) {
            case 'active':
                navigate('active-orders');
                break;
            case 'completed':
                navigate('completed-orders');
                break;
            default:
                navigate('active-orders');
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const fetchData = async () => {
        const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
        const buyerIdLocalStorage = localStorage?.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            localStorage?.clear();
            navigate("/buyer/login");
            return;
        }
        const obj = {
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
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

                            <div onClick={() => handleLinkClick('active')}
                                className={
                                    activeLink === "active"
                                        ? `${styles.active} ${styles.tab}`
                                        : styles.tab
                                }
                            >
                                <TbReorder
                                    className={styles.icon}
                                />
                                <div className={styles.text}>Active Orders</div>

                            </div>


                            <div onClick={() => handleLinkClick('completed')}
                                className={
                                    activeLink === "completed"
                                        ? `${styles.active} ${styles.tab}`
                                        : styles.tab
                                }
                            >
                                <TbReorder
                                    className={styles.icon}
                                />
                                <div className={styles.text}>Completed Orders</div>

                            </div>


                        </div>

                        {/* Order Right side table  */}
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