import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import  './order.css';
import order_list from '../../assets/images/dashboard/order_list.svg'
import ActiveOrders from './ActiveOrders/ActiveOrder';
import CompletedOrders from './CompletedOrders/CompleteOrder';
import PendingOrders from './PendingOrders/DeletedOrder';
import { postRequestWithToken } from '../../../api/Requests';
import Loader from '../SharedComponents/Loader/Loader';
import { toast } from 'react-toastify';
import { apiRequests } from '../../../api';


const Order = () => {
    const location  = useLocation();
    const navigate = useNavigate()
 
    const [loading, setLoading] = useState(true);
    const [orderList, setOrderList]     = useState([])
    const [totalOrders, setTotalOrders] = useState()
    const [currentPage, setCurrentPage] = useState(1); 
    const ordersPerPage = 5;
 
    
    const getActiveLinkFromPath = (path) => {
        
        switch (path) {
            case '/buyer/order/active-orders':
                return 'active';
            case '/buyer/order/Completed-Orders':
                return 'completed';
            default:
                return 'active';
        }
    };
 
    const activeLink = getActiveLinkFromPath(location.pathname);
 
    const handleLinkClick = (link) => {
        setCurrentPage(1)
        switch (link) {
            case 'active':
                navigate('active-orders');
                break;
            case 'completed':
                navigate('Completed-Orders');
                break;
            default:
                navigate('active-orders');
        }
    };
 
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
 
    const fetchData = async () => {
        const buyerIdSessionStorage = localStorage.getItem("buyer_id");
        const buyerIdLocalStorage   = localStorage.getItem("buyer_id");
 
        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        localStorage.clear();
        navigate("/buyer/login");
        return;
        }
        const obj = {
            buyer_id  : buyerIdSessionStorage || buyerIdLocalStorage,
            filterKey : activeLink,
            page_no   : currentPage, 
            limit     : ordersPerPage,
        }
        try {
            const response = await apiRequests.getRequest(`order/get-all-order-list?filterKey=${activeLink}&pageNo=${currentPage}&pageSize=${ordersPerPage}`)
            if (response?.code === 200) {
                setOrderList(response.result.data)
                setTotalOrders(response.result.totalItems)
            }
        } catch (error) {
            toast(error.message, {type:'error'})
        } finally{
            setLoading(false);
        }
    }
 
 
    useEffect(() => {
        fetchData()
    },[activeLink, currentPage])

    return (
        <>
         {loading ? (
                     <Loader />
                ) : (
            <div className='order-main-container'>
                <div className="order-name">
                Orders
                </div>
               
                <div className="order-container">
                    <div className="order-container-left">
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
                                <ActiveOrders 
                                orderList        = {orderList} 
                                totalOrders      = {totalOrders} 
                                currentPage      = {currentPage}
                                ordersPerPage    = {ordersPerPage}
                                handlePageChange = {handlePageChange}
                                activeLink       = {activeLink}
                                /> 
                                : activeLink === 'completed' ?
                                 <CompletedOrders 
                                 orderList        = {orderList} 
                                 totalOrders      = {totalOrders} 
                                 currentPage      = {currentPage}
                                 ordersPerPage    = {ordersPerPage}
                                 handlePageChange = {handlePageChange}
                                 activeLink       = {activeLink}
                                 /> : 
                                 activeLink === 'pending' ? 
                                 <PendingOrders
                                 orderList        = {orderList} 
                                 totalOrders      = {totalOrders} 
                                 currentPage      = {currentPage}
                                 ordersPerPage    = {ordersPerPage}
                                 handlePageChange = {handlePageChange}
                                 activeLink       = {activeLink}
                                  /> : ''
                            }


                        </div>
                    </div>
                </div>
            </div >
        )}
        </>
    )
}
export default Order