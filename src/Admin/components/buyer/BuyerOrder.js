import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../style/order.module.css';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ActiveBuyerOrder from './ActiveBuyerOrder';
import CompletedBuyerOrder from './CompletedBuyerOrder';
import PendingBuyerOrder from './PendingBuyerOrder';
import { postRequestWithToken } from '../../api/Requests';
import Loader from '../../../components/Loader';
import { apiRequests } from '../../../api';

const BuyerOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");

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
    const ordersPerPage = 5;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const fetchData = async ()=>{
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
            return;
        }
        const obj = {
            admin_id  : adminIdSessionStorage || adminIdLocalStorage,
            filterKey : activeLink,
            pageNo    : currentPage, 
            pageSize  : ordersPerPage,
        }
    
        // postRequestWithToken('admin/buyer-order-list', obj, async (response) => {
        //     if (response.code === 200) {
        //         setOrderList(response.result.data)
        //         setTotalOrders(response.result.totalItems)
        //     } else {
        //        console.log('error in order list api',response);
        //     }
        //     setLoading(false);
        // })
        try {
            // const response = await  apiRequests.postRequest('order/get-order-list-all-users', obj)
            // if (response.code === 200) {
            //     setOrderList(response.result.data)
            //     setTotalOrders(response.result.totalItems)
            // }
            postRequestWithToken('order/get-order-list-all-users', obj, async (response) => {
                if (response.code == 200) {
                    setOrderList(response.result.data)
                    setTotalOrders(response.result.totalItems)
                }
            })
        } catch (error) {
            console.log('error in order list api',error);
        } finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    },[activeLink, currentPage])

    return (
        <>
        {loading ? (
                     <Loader />
                ) : (
            <div className={styles[`order-container`]}>
                <div className={styles['complete-container-order-section']}>
                    <div className={styles['complete-conatiner-head']}>Orders</div>
                </div>
                <div className={styles[`order-wrapper`]}>
                    <div className={styles[`order-wrapper-left`]}>
                        <div
                            onClick={() => handleLinkClick('active')}
                            className={`${activeLink === 'active' ? styles.active : ''} ${styles['order-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['order-wrapper-left-icons']} />
                            <div>Active Orders</div>
                        </div>
                        <div
                            onClick={() => handleLinkClick('completed')}
                            className={`${activeLink === 'completed' ? styles.active : ''} ${styles['order-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['order-wrapper-left-icons']} />
                            <div>Completed Orders</div>
                        </div>
                       
                    </div>
                    <div className={styles[`order-wrapper-right`]}>
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