import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../../assets/style/order.module.css';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ActiveSellerOrder from './ActiveOrder/ActiveSellerOrder';
import CompletedSellerOrder from './CompletedOrder/CompletedSellerOrder';
import { postRequestWithToken } from '../../../api/Requests';
import Loader from '../../shared-components/Loader/Loader';

const SellerOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");

    const getActiveLinkFromPath = (path) => {
        switch (path) {
            case '/admin/supplier-order/active':
                return 'active';
                case '/admin/supplier-order/complete':
                return 'completed';
            case '/admin/supplier-order/pending':
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
                navigate('/admin/supplier-order/active');
                break;
                case 'completed':
                navigate('/admin/supplier-order/complete');
                break;
            case 'pending':
                navigate('/admin/supplier-order/pending');
                break;
            default:
                navigate('/admin/supplier-order/active');
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

    useEffect(() => {
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

        postRequestWithToken('admin/buyer-order-list', obj, async (response) => {
            if (response.code === 200) {
                setOrderList(response.result.data)
                setTotalOrders(response.result.totalItems)
            } else {
            }
            setLoading(false);
          })
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
                            <div className={styles.OrderHeading}>Active Orders</div>
                        </div>
                        <div
                            onClick={() => handleLinkClick('completed')}
                            className={`${activeLink === 'completed' ? styles.active : ''} ${styles['order-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['order-wrapper-left-icons']} />
                            <div className={styles.OrderHeading}>Completed Orders</div>
                        </div>
                        
                    </div>
                    <div className={styles[`order-wrapper-right`]}>
                        {activeLink === 'active' &&
                         <ActiveSellerOrder
                            orderList        = {orderList} 
                            totalOrders      = {totalOrders} 
                            currentPage      = {currentPage}
                            ordersPerPage    = {ordersPerPage}
                            handlePageChange = {handlePageChange}
                            activeLink       = {activeLink}
                         />}
                        {activeLink === 'completed' &&
                        <CompletedSellerOrder
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

export default SellerOrder;