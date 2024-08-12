import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../style/notificationlist.css';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
const NotificationList = () => {
    const notificationList = [
        {
            buyer_id: "00001",
            notification_date: "12-08-2024",
            message: "Supplier send the submit quotations"
        },
        {
            buyer_id: "00001",
            notification_date: "12-08-2024",
            message: "Supplier send the submit quotations"
        },
        {
            buyer_id: "00001",
            notification_date: "12-08-2024",
            message: "Supplier send the submit quotations"
        },
        {
            buyer_id: "00001",
            notification_date: "12-08-2024",
            message: "Supplier send the submit quotations"
        },
        {
            buyer_id: "00001",
            notification_date: "12-08-2024",
            message: "Supplier send the submit quotations"
        },
        {
            buyer_id: "00001",
            notification_date: "12-08-2024",
            message: "Supplier send the submit quotations"
        },
        {
            buyer_id: "00001",
            notification_date: "12-08-2024",
            message: "Supplier send the submit quotations"
        },
        {
            buyer_id: "00001",
            notification_date: "12-08-2024",
            message: "Supplier send the submit quotations"
        },

    ]


    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 4;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const notificationOrders = notificationList.slice(indexOfFirstOrder, indexOfLastOrder);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <>
            <div className='notification-main-container'>
                <div className="notification-name-2">Notification List</div>
                <div className="notification-container">
                    <div className="notification-container-right-section">
                        <div className='notification-inner-container-section'>
                            <table className="table-container">
                                <thead className='notification-container-thead'>
                                    <tr className='notification-container-tr'>
                                        <th className="notification-container-th"><div className="notification-container-head">Buyer ID</div></th>
                                        <th className="notification-container-th"><div className="notification-container-head">Date</div></th>
                                        <th className="notification-container-ths"><div className="notification-container-heads">Message</div></th>
                                        <th className="notification-container-th"><div className="notification-container-head">Action</div></th>
                                    </tr>
                                </thead>
                                {notificationOrders.map(notification => (
                                    <tbody className='notification-container-tbody'>
                                        <tr className="notification-section-tr">
                                            <td className='notification-section-td'>
                                                <div className="notification-section-heading">{notification.buyer_id}</div>
                                            </td>
                                            <td className='notification-section-td'>
                                                <div className="notification-section-heading">{notification.notification_date}</div>
                                            </td>
                                            <td className='notification-section-tds'>
                                                <div className="notification-section-heading">{notification.message}</div>
                                            </td>
                                            <td className='notification-section-button-cont'>
                                                <div className='notification-section-button'>
                                                    <Link to='/order-details'>
                                                        <div className='notification-section-view'>
                                                            <RemoveRedEyeOutlinedIcon className='notification-section-eye' />
                                                        </div>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                ))}
                            </table>
                        </div>
                        <div className='pagi-container'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={ordersPerPage}
                                totalItemsCount={notificationList.length}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                hideFirstLastPages={true}
                            />
                            <div className='pagi-total'>
                                Total Items: {notificationList.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NotificationList