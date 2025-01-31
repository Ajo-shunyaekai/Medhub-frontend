import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './notificationlist.css';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { postRequestWithToken } from '../../../api/Requests';
import moment from 'moment/moment';

const NotificationList = () => {
    const navigate = useNavigate();
    const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
    const supplierIdLocalStorage = localStorage.getItem("supplier_id");

    const [notificationList, setNotificationList] = useState([]);
    const [count, setCount] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

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
            // pageNo: currentPage,
            // pageSize: ordersPerPage
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

    const handleNavigation = (notificationId, event, eventId,linkId) => {
        switch (event) {
            case 'enquiry':
                navigate(`/supplier/inquiry-request-details/${eventId}`);
                break;
            case 'order':
                navigate(`/supplier/active-orders-details/${eventId}`);
                break;
            case 'purchaseorder':
                navigate(`/supplier/purchased-order-details/${linkId}`);
                break;  
            case 'invoice':
                navigate(`/supplier/invoice/paid`);
                break;

            case 'addnewmedicinerequest':
                navigate(`/supplier/product-details/${eventId}`);
                break;       
            case 'addsecondarymedicinerequest':
                navigate(`/supplier/secondary-product-details/${eventId}`);
                break;     
            case 'addnewmedicine':
                navigate(`/supplier/product-details/${eventId}`);
                break;       
            case 'addsecondarymedicine':
                navigate(`/supplier/secondary-product-details/${eventId}`);
                break;     

            case 'editnewmedicinerequest':
                navigate(`/supplier/pending-products-list`);
                break;    
            case 'editsecondarymedicinerequest':
                navigate(`/supplier/pending-products-list`);
                break;   
            case 'editnewmedicine':
                navigate(`/supplier/product-details/${eventId}`);
                break;  
            case 'editsecondarymedicine':
                navigate(`/supplier/secondary-product-details/${eventId}`);
                break;   
            case 'Profile Edit Approved':
                navigate(`/supplier/profile/${sessionStorage.getItem('_id')}`);
                break; 
            case 'Profile Edit Rejected':
                navigate(`/supplier/profile/${sessionStorage.getItem('_id')}`);
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
                                        <div className="notification-container-head">From</div>
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
                            {notificationOrders?.map((notification, index) => {
                                let additionalInfo = '';

                                // if (notification.event === 'order' || notification.event === 'purchaseorder') {
                                //     additionalInfo = `for ${notification.event_id}`;
                                // } else if (notification.event === 'enquiry') {
                                //     additionalInfo = `from: ${notification.buyer?.buyer_name}`;
                                // }

                                return (
                                    <tbody className='notification-container-tbody' key={notification.notification_id || index}>
                                        <tr className="notification-section-tr">
                                            <td className='notification-section-td'>
                                                <div className="notification-section-heading">
                                                {notification.from === 'admin' ? 'Admin' : notification.buyer?.buyer_name}
                                                </div>
                                            </td>
                                            <td className='notification-section-td'>
                                                <div className="notification-section-heading">
                                                    {/* {moment(notification.createdAt).format("DD/MM/YYYY")} */}
                                                    {moment(notification.createdAt).format("DD/MM/YYYY HH:mm")}
                                                <span style={{ color: 'gray', fontSize: '12px', marginLeft: '8px' }}>
                                                    ({moment(notification.createdAt).fromNow()})
                                                </span>
                                                    </div>
                                            </td>
                                            <td className='notification-section-tds'>
                                                <div className="notification-section-heading">
                                                    {notification.message} 
                                                    {/* {additionalInfo} */}
                                                </div>
                                            </td>
                                            <td className='notification-section-button-cont'>
                                                <div className='notification-section-button'>
                                                    <div className='notification-section-view' 
                                                        onClick={() => handleNavigation(notification.notification_id, notification.event, notification.event_id, notification.link_id)}>
                                                        <RemoveRedEyeOutlinedIcon className='table-icon' />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                );
                            })}
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