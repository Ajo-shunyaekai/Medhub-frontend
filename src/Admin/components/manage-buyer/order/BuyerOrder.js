import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from "../../../assets/style/secondsidebar.module.css";
import { TbReorder } from "react-icons/tb";
import ActiveBuyerOrder from './ActiveOrder/ActiveBuyerOrder';
import CompletedBuyerOrder from './CompletedOrder/CompletedBuyerOrder';
import Loader from '../../shared-components/Loader/Loader';
import { apiRequests } from '../../../../api';

const BuyerOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const adminIdSessionStorage = localStorage?.getItem("admin_id");
    const adminIdLocalStorage   = localStorage?.getItem("admin_id");
 
    const getActiveLinkFromPath = (path) => {
        switch (path) {
            case '/admin/buyer-order/active':
                return 'active';
                case '/admin/buyer-order/complete':
                return 'completed';
            case '/admin/buyer-order/pending':
                return 'pending';
            default:
                return 'active';
        }
    };
 
    const activeLink = getActiveLinkFromPath(location.pathname);
 
    const handleLinkClick = (link) => {
        setCurrentPage(1)
        switch (link) {
            case 'active':
                navigate('/admin/buyer-order/active');
                break;
                case 'completed':
                navigate('/admin/buyer-order/complete');
                break;
            case 'pending':
                navigate('/admin/buyer-order/pending');
                break;
            default:
                navigate('/admin/buyer-order/active');
        }
    };
 
    const [loading, setLoading]         = useState(true);
    const [orderList, setOrderList]     = useState([])
    const [totalOrders, setTotalOrders] = useState()
    const [currentPage, setCurrentPage] = useState(1); 
    const ordersPerPage = 8;
 
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const fetchData = async ()=>{
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            localStorage?.clear();
            navigate("/admin/login");
            return;
        }
        const obj = {
            admin_id  : adminIdSessionStorage || adminIdLocalStorage,
            filterKey : activeLink,
            pageNo    : currentPage, 
            pageSize  : ordersPerPage,
        }
    
        try {
            const response = await apiRequests.getRequest(`order/get-all-order-list?filterKey=${activeLink}&pageNo=${currentPage}&pageSize=${ordersPerPage}`)
            if (response?.code === 200) {
                setOrderList(response.result.data)
                setTotalOrders(response.result.totalItems)
            }
        } catch (error) {
        } finally{
            setLoading(false);
        }
    }
 
    useEffect(() => {
        fetchData()
    },[activeLink, currentPage])
            
    const handleDownload = () => {
        const obj = {
            admin_id  : adminIdSessionStorage || adminIdLocalStorage,
            filterKey : activeLink,
            pageNo    : currentPage, 
            pageSize  : ordersPerPage,
        }        
 
        apiRequests?.postReqCSVDownload('order/get-order-list-csv', obj, `Buyer_Orders_${window?.location?.pathname?.includes('/active')?"Active":"Completed"}.csv`)        
    };

    return (
        <>
        {loading ? (
                     <Loader />
                ) : (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.title}>Orders</div>
                </div>
                <div className={styles.content}>
                    <div className={styles.sidebar}>
                        <div
                            onClick={() => handleLinkClick('active')}
                            className={`${activeLink === 'active' ? styles.active : ''} ${styles.tab}`}
                        >
                            <TbReorder className={styles.icon} />
                            <div className={styles.text}>Active Orders</div>
                        </div>
                        <div
                            onClick={() => handleLinkClick('completed')}
                            className={`${activeLink === 'completed' ? styles.active : ''} ${styles.tab}`}
                        >
                            <TbReorder className={styles.icon} />
                            <div className={styles.text}>Completed Orders</div>
                        </div>
                       
                    </div>
                    <div className={styles.main}>
                        {activeLink === 'active' &&
                         <ActiveBuyerOrder
                            orderList        = {orderList} 
                            totalOrders      = {totalOrders} 
                            currentPage      = {currentPage}
                            ordersPerPage    = {ordersPerPage}
                            handlePageChange = {handlePageChange}
                            activeLink       = {activeLink}
                         />}
                        {activeLink === 'completed' && 
                        <CompletedBuyerOrder
                            orderList        = {orderList} 
                            totalOrders      = {totalOrders} 
                            currentPage      = {currentPage}
                            ordersPerPage    = {ordersPerPage}
                            handlePageChange = {handlePageChange}
                            activeLink       = {activeLink}
                        />}
                        
                    </div>
                </div>
            </div>
            )}
        </>
    );
}

export default BuyerOrder;