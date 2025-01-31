import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './notificationlist.css';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { postRequestWithToken } from '../../../../api/Requests';
import moment from 'moment/moment';

const NotificationList = () => {
   
    const navigate = useNavigate();
    const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
    const buyerIdLocalStorage = localStorage.getItem("buyer_id");

    const [list, setList] = useState()
    const [totalItems, setTotalItems] = useState()


    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const notificationOrders = list?.slice(indexOfFirstOrder, indexOfFirstOrder + ordersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }

        const obj = {
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
            // pageNo: currentPage,
            // pageSize: ordersPerPage
        };

        postRequestWithToken('buyer/get-notification-details-list', obj, (response) => {
            if (response.code === 200) {
                setList(response.result.data);
                setTotalItems(response.result.totalItems);
            } else {
                console.log('Error in get-notification-details-list API');
            }
        });
    }, [currentPage]);

    const handleNavigation = (notificationId, event, eventId, linkId) => {
        switch (event) {
            case 'enquiry':
                navigate(`/buyer/ongoing-inquiries-details/${eventId}`);
                break;
            case 'order':
                navigate(`/buyer/order-details/${eventId}`);
                break;
            case 'purchaseorder':
                navigate(`/buyer/purchased-order-details/${linkId}`);
                break; 
            case 'invoice':
                navigate(`/buyer/invoice/Pending-Invoice`);
                break; 
                case 'Profile Edit Approved':
                    navigate(`/buyer/profile/${sessionStorage.getItem('_id')}`);
                    break; 
                case 'Profile Edit Rejected':
                    navigate(`/buyer/profile/${sessionStorage.getItem('_id')}`);
                    break; 
            default:
                navigate('/buyer/');
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
                                    <th className="notification-container-th"><div className="notification-container-head">Supplier Name</div></th>
                                    <th className="notification-container-th"><div className="notification-container-head">Date</div></th>
                                    <th className="notification-container-ths"><div className="notification-container-heads">Message</div></th>
                                    <th className="notification-container-th"><div className="notification-container-head">Action</div></th>
                                </tr>
                            </thead>
                            {
                                notificationOrders?.map((notification, index) => {
                                    let additionalInfo = '';

                                    if (notification.event_type === 'Order created') {
                                        additionalInfo = `for ${notification.connected_id}`;
                                    } else if (notification.event_type === 'Shipment details submitted') {
                                        additionalInfo = `for: ${notification.event_id}`;
                                    } else if (notification.event_type === 'Enquiry quotation') {
                                        additionalInfo = `from: ${notification.supplier?.supplier_name}`;
                                    }

                                    // let displayMessage = notification.message;
                                    // if (notification.message === 'Enquiry quotation submitted') {
                                    //     displayMessage = `Enquiry quotation received `;
                                    // }

                                    return (
                                <tbody className='notification-container-tbody' key={index}>

                                    <tr className="notification-section-tr" >
                                        <td className='notification-section-td'>
                                            <div className="notification-section-heading">
                                                {/* {notification.supplier?.supplier_name} */}
                                                {notification.from === 'admin' ? 'Admin' : notification.supplier?.supplier_name}
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
                                })
                            }
                        </table>
                    </div>
                    <div className='pagi-container'>
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={ordersPerPage}
                            totalItemsCount={totalItems}
                            pageRangeDisplayed={5}
                            onChange={handlePageChange}
                            itemClass="page-item"
                            linkClass="page-link"
                            prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                            nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                            hideFirstLastPages={true}
                        />
                        <div className='pagi-total'>
                            Total Items: {totalItems}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotificationList