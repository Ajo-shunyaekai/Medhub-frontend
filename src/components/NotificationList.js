import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/notificationlist.css';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { postRequestWithToken } from '../api/Requests';
import moment from 'moment/moment';

const NotificationList = () => {
    const notificationList = [
        {
            supplier_id: "00001",
            notification_date: "12-08-2024",
            message: "Supplier send the submit quotations"
        },
        {
            supplier_id: "00001",
            notification_date: "12-08-2024",
            message: "Supplier send the submit quotations"
        },
        {
            supplier_id: "00001",
            notification_date: "12-08-2024",
            message: "Supplier send the submit quotations"
        },
        {
            supplier_id: "00001",
            notification_date: "12-08-2024",
            message: "Supplier send the submit quotations"
        },
        {
            supplier_id: "00001",
            notification_date: "12-08-2024",
            message: "Supplier send the submit quotations"
        },
        {
            supplier_id: "000324",
            notification_date: "12-08-2024",
            message: "Supplier send the submit quotations"
        },
        {
            supplier_id: "0002341",
            notification_date: "12-08-2024",
            message: "Supplier send the submit quotations"
        },
        {
            supplier_id: "000222",
            notification_date: "12-08-2024",
            message: "Supplier send the submit quotations"
        },

    ]
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
            buyer_id: buyerIdSessionStorage|| buyerIdLocalStorage,
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

    const handleNavigation = (notificationId, event, eventId) => {
        switch (event) {
            case 'enquiry':
                navigate(`/buyer/ongoing-inquiries-details/${eventId}`);
                break;
            case 'order':
                navigate(`/buyer/order-details/${eventId}`);
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
                            <tbody className='notification-container-tbody'>
                                {notificationOrders?.map((notification, index) => (
                                    <tr className="notification-section-tr" key={index}>
                                        <td className='notification-section-td'>
                                            <div className="notification-section-heading">{notification.supplier?.supplier_name}</div>
                                        </td>
                                        <td className='notification-section-td'>
                                            <div className="notification-section-heading">{moment(notification.createdAt).format("DD/MM/YYYY")}</div>
                                        </td>
                                        <td className='notification-section-tds'>
                                            <div className="notification-section-heading">{notification.message}</div>
                                        </td>
                                        <td className='notification-section-button-cont'>
                                            <div className='notification-section-button'>
                                                {/* <Link to='/order-details'> */}
                                                    <div className='notification-section-view' onClick={() => handleNavigation(notification.notification_id, notification.event, notification.event_id)}>
                                                        <RemoveRedEyeOutlinedIcon className='notification-section-eye' />
                                                    </div>
                                                {/* </Link> */}
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