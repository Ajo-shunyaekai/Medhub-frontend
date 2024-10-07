import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../style/order.module.css';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Loader from '../../../components/Loader';
import TotalOngoingInquiries from './TotalOngoingInquiries';
import TotalInquiriesRequest from './TotalInquiriesRequest';


const InquiriesDashList = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage = localStorage.getItem("admin_id");

    const getActiveLinkFromPath = (path) => {
        switch (path) {
            case '/admin/inquiries-section/request':
                return 'request';
            case '/admin/inquiries-section/ongoing':
                return 'ongoing';
            default:
                return 'request';
        }
    };

    const activeLink = getActiveLinkFromPath(location.pathname);

    const handleLinkClick = (link) => {
        setCurrentPage(1)
        switch (link) {
            case 'request':
                navigate('/admin/inquiries-section/request');
                break;
            case 'ongoing':
                navigate('/admin/inquiries-section/ongoing');
                break;
            default:
                navigate('/admin/inquiries-section/request');
        }
    };

    const [loading, setLoading] = useState(true);
    const [orderList, setOrderList] = useState([])
    const [totalOrders, setTotalOrders] = useState()
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        // if (!adminIdSessionStorage && !adminIdLocalStorage) {
        //     navigate("/admin/login");
        //     return;
        // }
        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            filterKey: activeLink,
            pageNo: currentPage,
            pageSize: ordersPerPage,
        }
    }, [activeLink, currentPage])

    return (
        <>
                <div className={styles[`order-container`]}>
                    <div className={styles['complete-container-order-section']}>
                        <div className={styles['complete-conatiner-head']}>Inquiries</div>
                    </div>
                    <div className={styles[`order-wrapper`]}>
                        <div className={styles[`order-wrapper-left`]}>
                            <div
                                onClick={() => handleLinkClick('request')}
                                className={`${activeLink === 'request' ? styles.active : ''} ${styles['order-wrapper-left-text']}`}
                            >
                                <DescriptionOutlinedIcon className={styles['order-wrapper-left-icons']} />
                                <div>Inquiry Requests</div>
                            </div>
                            <div
                                onClick={() => handleLinkClick('ongoing')}
                                className={`${activeLink === 'ongoing' ? styles.active : ''} ${styles['order-wrapper-left-text']}`}
                            >
                                <DescriptionOutlinedIcon className={styles['order-wrapper-left-icons']} />
                                <div>Ongoing Inquiries</div>
                            </div>

                        </div>
                        <div className={styles[`order-wrapper-right`]}>
                            {activeLink === 'ongoing' &&
                                <TotalOngoingInquiries
                                    orderList={orderList}
                                    totalOrders={totalOrders}
                                    currentPage={currentPage}
                                    ordersPerPage={ordersPerPage}
                                    handlePageChange={handlePageChange}
                                    activeLink={activeLink}
                                />}
                            {activeLink === 'request' &&
                                <TotalInquiriesRequest
                                    orderList={orderList}
                                    totalOrders={totalOrders}
                                    currentPage={currentPage}
                                    ordersPerPage={ordersPerPage}
                                    handlePageChange={handlePageChange}
                                    activeLink={activeLink}
                                />}

                        </div>
                    </div>
                </div>
        </>
    );
}

export default InquiriesDashList;