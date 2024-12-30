import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../style/order.module.css';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import InquiryRequest from './InquiryRequest';
import PurchasedOrder from './PurchasedOrder';
import { postRequestWithToken } from '../../api/Requests';
import { toast } from 'react-toastify';
import Loader from '../../../components/Loader';
import { apiRequests } from '../../../api';


const SellerInquiry = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage = localStorage.getItem("admin_id");

    // Get initial active link based on the path
    const getActiveLinkFromPath = (path) => {
        switch (path) {
            case '/admin/seller-inquiry/inquiry':
                return 'inquiry';
            case '/admin/seller-purchased/purchased':
                return 'purchased';
            default:
                return 'inquiry';
        }
    };

    // State variables
    const [activeLink, setActiveLink] = useState(getActiveLinkFromPath(location.pathname));
    
    const [loading, setLoading]         = useState(true);
    const [list, setList]               = useState([]);
    const [totalList, setTotalList]     = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const listPerPage = 5;

    // Handle link clicks to change active page
    const handleLinkClick = (link) => {
        setCurrentPage(1);  // Reset page when switching tabs
        setActiveLink(link);

        // Navigate to appropriate route
        if (link === 'inquiry') {
            navigate('/admin/seller-inquiry/inquiry');
        } else if (link === 'purchased') {
            navigate('/admin/seller-purchased/purchased');
        }
    };

    // Fetch the inquiry or PO list based on activeLink and currentPage
    const fetchData = async () => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
            return;
        }

        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            filterKey: activeLink,
            pageNo: currentPage,
            pageSize: listPerPage,
            user_type: 'Supplier'
        };

        if (activeLink === 'inquiry') {
            // postRequestWithToken('admin/get-inquiry-list', obj, (response) => {
            //     if (response.code === 200) {
            //         setList(response.result.data);
            //         setTotalList(response.result.totalItems);
            //     } else {
            //         console.log('Error fetching inquiry list', response);
            //     }
            //     setLoading(false);
            // });
            
            try {
                // const response = await  apiRequests.postRequest('enquiry/get-enquiry-list-all-users', obj)
                // if (response.code === 200) {
                //     setList(response.result.data);
                //     setTotalList(response.result.totalItems);
                // }
                postRequestWithToken('enquiry/get-enquiry-list-all-users', obj, async (response) => {
                    if (response.code == 200) {
                        setList(response.result.data);
                        setTotalList(response.result.totalItems);
                    }
                })
            } catch (error) {
                console.log('Error fetching inquiry list', error);
            } finally{
                setLoading(false);
            }
        } else if (activeLink === 'purchased') {
            obj.status = 'active';  
            postRequestWithToken('admin/get-po-list', obj, (response) => {
                if (response.code === 200) {
                    setList(response.result.data);
                    setTotalList(response.result.totalItems);
                } else {
                    console.log('Error fetching PO list', response);
                }
                setLoading(false);
            });
        }
    };

    // First useEffect: Calls fetchData when activeLink changes
    useEffect(() => {
        fetchData();
    }, [activeLink, currentPage]);  // Call whenever `activeLink` or `currentPage` changes

    return (
        <>
        { loading ? (
                     <Loader />
                ) : (
            <div className={styles[`order-container`]}>
                <div className={styles['complete-container-order-section']}>
                    <div className={styles['complete-conatiner-head']}>Inquiry & Purchased Orders</div>
                </div>
                <div className={styles[`order-wrapper`]}>
                    <div className={styles[`order-wrapper-left`]}>
                        <div
                            onClick={() => handleLinkClick('inquiry')}
                            className={`${activeLink === 'inquiry' ? styles.active : ''} ${styles['order-wrapper-left-text']}`}
                        >
                            <DescriptionOutlinedIcon className={styles['order-wrapper-left-icons']} />
                            <div>Inquiry Request</div>
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
                        {activeLink === 'inquiry' && (
                            <InquiryRequest
                                inquiryList={list}
                                totalInquiries={totalList}
                                currentPage={currentPage}
                                inquiriesPerPage={listPerPage}
                                handlePageChange={setCurrentPage}
                                activeLink={activeLink}
                            />
                        )}
                        {activeLink === 'purchased' && (
                            <PurchasedOrder
                                poList={list}
                                totalList={totalList}
                                currentPage={currentPage}
                                listPerPage={listPerPage}
                                handlePageChange={setCurrentPage}
                                activeLink={activeLink}
                            />
                        )}
                    </div>
                </div>
            </div>
             )}
        </>
    );
};




export default SellerInquiry;