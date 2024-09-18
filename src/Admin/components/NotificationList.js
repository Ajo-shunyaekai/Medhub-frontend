import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/adminnotificationlist.css';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { postRequestWithToken } from '../api/Requests';
import moment from 'moment/moment';

const NotificationList = () => {
    const navigate = useNavigate();
    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");

    const [notificationList, setNotificationList] = useState([]);
    const [count, setCount] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if( !adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
        }
        const obj = {
            admin_id : adminIdSessionStorage || adminIdLocalStorage,
            pageNo   : currentPage,
            pageSize : ordersPerPage
        };

        postRequestWithToken('admin/get-notification-details-list', obj, (response) => {
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
            case 'addnewmedicinerequest':
                navigate(`/admin/product-request-details/${eventId}`);
                break;
            case 'addsecondarymedicinerequest':
                navigate(`/admin/secondary-product-request-details/${eventId}`);
                break;
            case 'editnewmedicinerequest':
                navigate(`/admin/edit-product-details/${eventId}`);
                break;  
            case 'editsecondarymedicinerequest':
                navigate(`/admin/edit-secondary-details/${eventId}`);
                break;   
            case 'buyerregistration':
                navigate(`/admin/buyer-request-details/${eventId}`);
                break;   
            case 'supplierregistration':
                navigate(`/admin/supplier-request-details/${eventId}`);
                break;        
            default:
                navigate('/admin/');
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
                            {notificationList?.map((notification, index) => {
                                let additionalInfo = '';

                                if (notification.event === 'order' || notification.event === 'purchaseorder') {
                                    additionalInfo = `for ${notification.event_id}`;
                                } else if (notification.event === 'addmedicine') {
                                    additionalInfo = `from: ${notification.fromDetails?.buyer_name || notification.fromDetails?.supplier_name}`;
                                }

                                return (
                                    <tbody className='notification-container-tbody' key={notification.notification_id || index}>
                                        <tr className="notification-section-tr">
                                            <td className='notification-section-td'>
                                                <div className="notification-section-heading">{notification.fromDetails?.buyer_name || notification.fromDetails?.supplier_name}</div>
                                            </td>
                                            <td className='notification-section-td'>
                                                <div className="notification-section-heading">{moment(notification.createdAt).format("DD/MM/YYYY")}</div>
                                            </td>
                                            <td className='notification-section-tds'>
                                                <div className="notification-section-heading">
                                                    {notification.message} {additionalInfo}
                                                </div>
                                            </td>
                                            <td className='notification-section-button-cont'>
                                                <div className='notification-section-button'>
                                                    <div className='notification-section-view' 
                                                        onClick={() => handleNavigation(notification.notification_id, notification.event, notification.event_id, notification.link_id)}>
                                                        <RemoveRedEyeOutlinedIcon className='notification-section-eye' />
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