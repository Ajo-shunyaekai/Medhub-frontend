import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../style/notificationlist.css';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { postRequestWithToken } from '../api/Requests';
import moment from 'moment/moment';

// const NotificationList = () => {
//     const notificationListt = [
//         {
//             buyer_id: "00001",
//             notification_date: "12-08-2024",
//             message: "Supplier send the submit quotations"
//         },
//         {
//             buyer_id: "00001",
//             notification_date: "12-08-2024",
//             message: "Supplier send the submit quotations"
//         },
//         {
//             buyer_id: "00001",
//             notification_date: "12-08-2024",
//             message: "Supplier send the submit quotations"
//         },
//         {
//             buyer_id: "00001",
//             notification_date: "12-08-2024",
//             message: "Supplier send the submit quotations"
//         },
//         {
//             buyer_id: "00001",
//             notification_date: "12-08-2024",
//             message: "Supplier send the submit quotations"
//         },
//         {
//             buyer_id: "00001",
//             notification_date: "12-08-2024",
//             message: "Supplier send the submit quotations"
//         },
//         {
//             buyer_id: "00001",
//             notification_date: "12-08-2024",
//             message: "Supplier send the submit quotations"
//         },
//         {
//             buyer_id: "00001",
//             notification_date: "12-08-2024",
//             message: "Supplier send the submit quotations"
//         },

//     ]

//     const navigate = useNavigate()
//     const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
//     const supplierIdLocalStorage   = localStorage.getItem("supplier_id");

//     const [notificationList, setNotificationList] = useState([])
//     const [count, setCount] = useState()

//     const [currentPage, setCurrentPage] = useState(1);
//     const ordersPerPage = 5;
//     const indexOfLastOrder = currentPage * ordersPerPage;
//     const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
//     const notificationOrders = notificationList.slice(indexOfFirstOrder, indexOfLastOrder);
//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     useEffect(() => {
//         if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
//             navigate("/supplier/login");
//         }
    
//         const obj = {
//             supplier_id : supplierIdSessionStorage || supplierIdLocalStorage,
//             pageNo      : currentPage,
//             pageSize    : ordersPerPage
//         };
    
//         postRequestWithToken('supplier/get-notification-details-list', obj, (response) => {
//             if (response.code === 200) {
//                 setNotificationList(response.result.data);
//                 setCount(response.result.totalItems || 0);
//             } else {
//                 console.log('error in get-notification-listapi');
//             }
//         });
        
//     }, [currentPage]);

//     const handleNavigation = (notificationId,event, eventId) => {
//         console.log('eventId',eventId);
//         switch (event) {
//           case 'enquiry':
//             // setIsNotificationOpen(false)
//             // navigate('/buyer/inquiry-purchase-orders/ongoing');
//             navigate(`/supplier/inquiry-request-details/${eventId}`);
//             // updateStatusApi(notificationId)
//             // handleClick(notificationId, event)
//             break;
//           case 'order':
//             // setIsNotificationOpen(false)
//             navigate(`/supplier/active-orders-details/${eventId}`);
//             // handleClick(notificationId, event)
//             break;
//           // Add more cases as needed
//           default:
//             navigate('/buyer/'); // Default to home or another page if event_type doesn't match
//             break;
//         }
//       };
    
//     return (
//         <>
//             <div className='notification-main-container'>
//                 <div className="notification-name-2">Notification List</div>
//                 <div className="notification-container">
//                     <div className="notification-container-right-section">
//                         <div className='notification-inner-container-section'>
//                             <table className="table-container">
//                                 <thead className='notification-container-thead'>
//                                     <tr className='notification-container-tr'>
//                                         <th className="notification-container-th"><div className="notification-container-head">Buyer Name</div></th>
//                                         <th className="notification-container-th"><div className="notification-container-head">Date</div></th>
//                                         <th className="notification-container-ths"><div className="notification-container-heads">Message</div></th>
//                                         <th className="notification-container-th"><div className="notification-container-head">Action</div></th>
//                                     </tr>
//                                 </thead>
//                                 {notificationOrders.map(notification => (
//                                     <tbody className='notification-container-tbody'>
//                                         <tr className="notification-section-tr">
//                                             <td className='notification-section-td'>
//                                                 <div className="notification-section-heading">{notification.buyer.buyer_name}</div>
//                                             </td>
//                                             <td className='notification-section-td'>
//                                                 <div className="notification-section-heading">{moment(notification.createdAt).format("DD/MM/YYYY")}</div>
//                                             </td>
//                                             <td className='notification-section-tds'>
//                                                 <div className="notification-section-heading">{notification.message}</div>
//                                             </td>
//                                             <td className='notification-section-button-cont'>
//                                                 <div className='notification-section-button'>
//                                                     {/* <Link to='/order-details'> */}
//                                                         <div className='notification-section-view' onClick={() => handleNavigation(notification.notification_id,notification.event, notification.event_id)}>
//                                                             <RemoveRedEyeOutlinedIcon className='notification-section-eye' />
//                                                         </div>
//                                                     {/* </Link> */}
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     </tbody>
//                                 ))}
//                             </table>
//                         </div>
//                         <div className='pagi-container'>
//                             <Pagination
//                                 activePage={currentPage}
//                                 itemsCountPerPage={ordersPerPage}
//                                 totalItemsCount={count}
//                                 pageRangeDisplayed={5}
//                                 onChange={handlePageChange}
//                                 itemClass="page-item"
//                                 linkClass="page-link"
//                                 prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
//                                 nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
//                                 hideFirstLastPages={true}
//                             />
//                             <div className='pagi-total'>
//                                 Total Items: {count}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

const NotificationList = () => {
    const navigate = useNavigate();
    const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
    const supplierIdLocalStorage = localStorage.getItem("supplier_id");

    const [notificationList, setNotificationList] = useState([]);
    const [count, setCount] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const notificationOrders = notificationList.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }

        const obj = {
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
            pageNo: currentPage,
            pageSize: ordersPerPage
        };

        postRequestWithToken('supplier/get-notification-details-list', obj, (response) => {
            if (response.code === 200) {
                setNotificationList(response.result.data);
                setCount(response.result.totalItems || 0);
            } else {
                console.log('Error in get-notification-details-list API');
            }
        });
    }, [currentPage]); 

    const handleNavigation = (notificationId, event, eventId) => {
        switch (event) {
            case 'enquiry':
                navigate(`/supplier/inquiry-request-details/${eventId}`);
                break;
            case 'order':
                navigate(`/supplier/active-orders-details/${eventId}`);
                break;
            default:
                navigate('/supplier/');
                break;
        }
    };

    return (
        <div className='notification-main-container'>
            <div className="notification-name-2">Notification List</div>
            <div className="notification-container">
                <div className="notification-container-right-section">
                    <div className='notification-inner-container-section'>
                        <table className="table-container">
                            <thead className='notification-container-thead'>
                                <tr className='notification-container-tr'>
                                    <th className="notification-container-th">
                                        <div className="notification-container-head">Buyer Name</div>
                                    </th>
                                    <th className="notification-container-th">
                                        <div className="notification-container-head">Date</div>
                                    </th>
                                    <th className="notification-container-ths">
                                        <div className="notification-container-heads">Message</div>
                                    </th>
                                    <th className="notification-container-th">
                                        <div className="notification-container-head">Action</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='notification-container-tbody'>
                                {notificationOrders.map((notification, index) => (
                                    <tr className="notification-section-tr" key={notification.notification_id || index}>
                                        <td className='notification-section-td'>
                                            <div className="notification-section-heading">{notification.buyer?.buyer_name}</div>
                                        </td>
                                        <td className='notification-section-td'>
                                            <div className="notification-section-heading">{moment(notification.createdAt).format("DD/MM/YYYY")}</div>
                                        </td>
                                        <td className='notification-section-tds'>
                                            <div className="notification-section-heading">{notification.message}</div>
                                        </td>
                                        <td className='notification-section-button-cont'>
                                            <div className='notification-section-button'>
                                                <div className='notification-section-view' onClick={() => handleNavigation(notification.notification_id, notification.event, notification.event_id)}>
                                                    <RemoveRedEyeOutlinedIcon className='notification-section-eye' />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='pagi-container'>
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={ordersPerPage}
                            totalItemsCount={count}
                            pageRangeDisplayed={5}
                            onChange={handlePageChange}
                            itemClass="page-item"
                            linkClass="page-link"
                            prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                            nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                            hideFirstLastPages={true}
                        />
                        <div className='pagi-total'>
                            Total Items: {count}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default NotificationList