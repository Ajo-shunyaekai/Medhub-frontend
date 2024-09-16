import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../style/order.module.css';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import InquiryRequest from './InquiryRequest';
import PurchasedOrder from './PurchasedOrder';
import { postRequestWithToken } from '../../api/Requests';
import { toast } from 'react-toastify';

// const SellerInquiry = () => {
//     const location = useLocation();
//     const navigate = useNavigate();

//     const adminIdSessionStorage = sessionStorage.getItem("admin_id");
//     const adminIdLocalStorage   = localStorage.getItem("admin_id");

//     const getActiveLinkFromPath = (path) => {
//         switch (path) {
//             case '/admin/seller-inquiry/inquiry':
//                 return 'inquiry';
//                 case '/admin/seller-purchased/purchased':
//                 return 'purchased';
//             default:
//                 return 'inquiry';
//         }
//     };

//     const activeLink = getActiveLinkFromPath(location.pathname);

//     const handleLinkClick = (link) => {
//         setCurrentPage(1)
//         switch (link) {
//             case 'inquiry':
//                 navigate('/admin/seller-inquiry/inquiry');
//                 break;
//                 case 'purchased':
//                 navigate('/admin/seller-purchased/purchased');
//                 break;
//             default:
//                 navigate('/admin/seller-inquiry/inquiry');
//         }
//     };

//     const [list, setList]     = useState([])
//     const [totalList, setTotalList] = useState()
//     const [currentPage, setCurrentPage] = useState(1); 
//     const listPerPage = 5;

//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     useEffect(() => {
//         if (!adminIdSessionStorage && !adminIdLocalStorage) {
//             navigate("/admin/login");
//             return;
//         }
//         const obj = {
//             admin_id  : adminIdSessionStorage || adminIdLocalStorage,
//             filterKey : activeLink,
//             pageNo    : currentPage, 
//             pageSize  : listPerPage,
//         }

//         postRequestWithToken('admin/get-inquiry-list', obj, async (response) => {
//             if (response.code === 200) {
//                 setList(response.result.data)
//                 setTotalList(response.result.totalItems)
//             } else {
//                console.log('error in order list api',response);
//             }
//           })

//           if (activeLink === 'purchased') {
//             obj.status = 'active'
//             postRequestWithToken('admin/get-po-list', obj, async (response) => {
//                 if (response.code === 200) {
//                     setList(response.result.data)
//                     setTotalList(response.result.totalItems)
//                 } else {
//                     toast(response.message, {type:'error'})
//                     console.log('error in purchased order list api', response);
//                 }
//                 // setLoading(false);
//             });
//         } 
//     },[activeLink, currentPage])


    

//     return (
//         <>
//             <div className={styles[`order-container`]}>
//                 <div className={styles['complete-container-order-section']}>
//                     <div className={styles['complete-conatiner-head']}>Inquiry & Purchased Orders</div>
//                 </div>
//                 <div className={styles[`order-wrapper`]}>
//                     <div className={styles[`order-wrapper-left`]}>
//                         <div
//                             onClick={() => handleLinkClick('inquiry')}
//                             className={`${activeLink === 'inquiry' ? styles.active : ''} ${styles['order-wrapper-left-text']}`}
//                         >
//                             <DescriptionOutlinedIcon className={styles['order-wrapper-left-icons']} />
//                             <div>Inquiry Request</div>
//                         </div>
//                         <div
//                             onClick={() => handleLinkClick('purchased')}
//                             className={`${activeLink === 'purchased' ? styles.active : ''} ${styles['order-wrapper-left-text']}`}
//                         >
//                             <DescriptionOutlinedIcon className={styles['order-wrapper-left-icons']} />
//                             <div>Purchased Orders</div>
//                         </div>
//                     </div>
//                     <div className={styles[`order-wrapper-right`]}>
//                         {activeLink === 'inquiry' &&
//                          <InquiryRequest
//                             inquiryList      = {list} 
//                             totalInquiries   = {totalList} 
//                             currentPage      = {currentPage}
//                             inquiriesPerPage = {listPerPage}
//                             handlePageChange = {handlePageChange}
//                             activeLink       = {activeLink}
//                          />}
//                         {activeLink === 'purchased' &&
//                         <PurchasedOrder
//                             poList           = {list} 
//                             totalList        = {totalList} 
//                             currentPage      = {currentPage}
//                             listPerPage      = {listPerPage}
//                             handlePageChange = {handlePageChange}
//                             activeLink       = {activeLink}
//                         />}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

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
    const [list, setList] = useState([]);
    const [totalList, setTotalList] = useState(0);
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
    const fetchData = () => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
            return;
        }

        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            filterKey: activeLink,
            pageNo: currentPage,
            pageSize: listPerPage,
        };

        if (activeLink === 'inquiry') {
            postRequestWithToken('admin/get-inquiry-list', obj, (response) => {
                if (response.code === 200) {
                    setList(response.result.data);
                    setTotalList(response.result.totalItems);
                } else {
                    console.log('Error fetching inquiry list', response);
                }
            });
        } else if (activeLink === 'purchased') {
            obj.status = 'active';  
            postRequestWithToken('admin/get-po-list', obj, (response) => {
                if (response.code === 200) {
                    setList(response.result.data);
                    setTotalList(response.result.totalItems);
                } else {
                    console.log('Error fetching PO list', response);
                }
            });
        }
    };

    // First useEffect: Calls fetchData when activeLink changes
    useEffect(() => {
        fetchData();
    }, [activeLink, currentPage]);  // Call whenever `activeLink` or `currentPage` changes

    return (
        <>
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
        </>
    );
};




export default SellerInquiry;