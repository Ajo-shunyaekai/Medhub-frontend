import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../style/order.module.css';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BuyerOngoingInquiry from './BuyerOngoingInquiry';
import BuyerPurchasedOrder from './BuyerPurchasedOrder';
import { postRequestWithToken } from '../../api/Requests';
const BuyerInquiry = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");

    const getActiveLinkFromPath = (path) => {
        switch (path) {
            case '/admin/buyer-inquiry/inquiry':
                return 'inquiry';
                case '/admin/buyer-purchased/purchased':
                return 'purchased';
            default:
                return 'inquiry';
        }
    };

    const activeLink = getActiveLinkFromPath(location.pathname);

    const handleLinkClick = (link) => {
        setCurrentPage(1)
        switch (link) {
            case 'inquiry':
                navigate('/admin/buyer-inquiry/inquiry');
                break;
                case 'purchased':
                navigate('/admin/buyer-purchased/purchased');
                break;
            default:
                navigate('/admin/buyer-inquiry/inquiry');
        }
    };

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
            page_no   : currentPage, 
            limit     : ordersPerPage,
        }

        postRequestWithToken('admin/buyer-order-list', obj, async (response) => {
            if (response.code === 200) {
                setOrderList(response.result.data)
                setTotalOrders(response.result.totalItems)
            } else {
               console.log('error in order list api',response);
            }
          })
    },[activeLink, currentPage])

    return (
        <>
            <div className={styles[`order-container`]}>
                <div className={styles['complete-container-order-section']}>
                    <div className={styles['complete-conatiner-head']}>Orders</div>
                </div>
                <div className={styles[`order-wrapper`]}>
                    <div className={styles[`order-wrapper-left`]}>
                        <div
                            onClick={() => handleLinkClick('inquiry')}
                            className={`${activeLink === 'inquiry' ? styles.active : ''} ${styles['order-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['order-wrapper-left-icons']} />
                            <div>Ongoing Inquiries</div>
                        </div>
                        <div
                            onClick={() => handleLinkClick('purchased')}
                            className={`${activeLink === 'purchased' ? styles.active : ''} ${styles['order-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['order-wrapper-left-icons']} />
                            <div>Purchased Orders</div>
                        </div>
                    </div>
                    <div className={styles[`order-wrapper-right`]}>
                        {activeLink === 'inquiry' &&
                         <BuyerOngoingInquiry
                            orderList        = {orderList} 
                            totalOrders      = {totalOrders} 
                            currentPage      = {currentPage}
                            ordersPerPage    = {ordersPerPage}
                            handlePageChange = {handlePageChange}
                            activeLink       = {activeLink}
                         />}
                        {activeLink === 'purchased' && 
                        <BuyerPurchasedOrder
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
        </>
    );
}

export default BuyerInquiry;