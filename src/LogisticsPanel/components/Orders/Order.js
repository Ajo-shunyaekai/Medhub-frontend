import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './order.css';
import order_list from '../../assest/images/dashboard/order_list.svg'
import ActiveOrder from './ActiveOrders/ActiveOrder';
import CompletedOrder from './CompletedOrders/CompleteOrder';
import PendingOrder from './PendingOrders/PendingOrders'
import OngoingOrder from './OngoingOrders/OngoingOrders'
import { postRequestWithToken } from '../../../api/Requests';
import Loader from '../SharedComponents/Loader/Loader';
import { toast } from 'react-toastify';
import { apiRequests } from '../../../api';


const Order = () => {
    const location = useLocation();
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true);
    const [orderList, setOrderList] = useState([])
    const [totalOrders, setTotalOrders] = useState()
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;


    const getActiveLinkFromPath = (path) => {

        switch (path) {
            case '/logistics/order/active':
                return 'active';
            case '/logistics/order/completed':
                return 'completed';
            case '/logistics/order/pending':
                return 'pending';
            case '/logistics/order/ongoing':
                return 'ongoing';
            default:
                return 'pending';
        }
    };

    const activeLink = getActiveLinkFromPath(location.pathname);

    const handleLinkClick = (link) => {
        setCurrentPage(1)
        switch (link) {
            case 'active':
                navigate('active');
                break;
            case 'completed':
                navigate('completed');
                break;
            case 'pending':
                navigate('pending');
                break;
            case 'ongoing':
                navigate('ongoing');
                break;
            default:
                navigate('pending');
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>

            <div className='order-main-container'>
                <div className="order-name">
                    Orders
                </div>

                <div className="order-container">
                    <div className="order-container-left">
                        <div onClick={() => handleLinkClick('pending')} className={activeLink === 'pending' ? 'active order-left-wrapper' : 'order-left-wrapper'}>
                            <img src={order_list} alt="order icon" />
                            <div>Pending Orders</div>
                        </div>

                        <div onClick={() => handleLinkClick('ongoing')} className={activeLink === 'ongoing' ? 'active order-left-wrapper' : 'order-left-wrapper'}>
                            <img src={order_list} alt="order icon" />
                            <div>Ongoing Orders</div>
                        </div>
                        <div onClick={() => handleLinkClick('active')} className={activeLink === 'active' ? 'active order-left-wrapper' : 'order-left-wrapper'}>
                            <img src={order_list} alt="order icon" />
                            <div>Active Orders</div>
                        </div>
                        <div onClick={() => handleLinkClick('completed')} className={activeLink === 'completed' ? 'active order-left-wrapper' : 'order-left-wrapper'}>
                            <img src={order_list} alt="order icon" />
                            <div>Completed Orders</div>
                        </div>


                    </div>

                    {/* Order Right side table  */}
                    <div className="order-container-right">
                        <div responsive="xl" className='order-table-responsive'>

                            {
                                activeLink === 'active' ?
                                    <ActiveOrder
                                        orderList={orderList}
                                        totalOrders={totalOrders}
                                        currentPage={currentPage}
                                        ordersPerPage={ordersPerPage}
                                        handlePageChange={handlePageChange}
                                        activeLink={activeLink}
                                    />
                                    : activeLink === 'completed' ?
                                        <CompletedOrder
                                            orderList={orderList}
                                            totalOrders={totalOrders}
                                            currentPage={currentPage}
                                            ordersPerPage={ordersPerPage}
                                            handlePageChange={handlePageChange}
                                            activeLink={activeLink}
                                        /> :
                                        activeLink === 'pending' ?
                                            <PendingOrder
                                                orderList={orderList}
                                                totalOrders={totalOrders}
                                                currentPage={currentPage}
                                                ordersPerPage={ordersPerPage}
                                                handlePageChange={handlePageChange}
                                                activeLink={activeLink}
                                            /> : 
                                            activeLink === 'ongoing' ?
                                            <OngoingOrder
                                                orderList={orderList}
                                                totalOrders={totalOrders}
                                                currentPage={currentPage}
                                                ordersPerPage={ordersPerPage}
                                                handlePageChange={handlePageChange}
                                                activeLink={activeLink}
                                            /> : ''
                            }


                        </div>
                    </div>
                </div>
            </div >

        </>
    )
}
export default Order