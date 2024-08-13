import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import order from '../style/order.css';
import order_list from '../assest/dashboard/order_list.svg'
import OrderCancel from './OrderCancel';
import OrderDetails from './OrderDetails';
import OrderRequest from './OrderRequest';
import ActiveOrders from './ActiveOrder';
import CompletedOrders from './CompleteOrder';
import DeletedOrders from './DeletedOrder';
// import SupSidebar from '../components/SupSidebar';
import { postRequestWithToken } from '../api/Requests';


const Order = () => {
    const location = useLocation();
    const navigate = useNavigate();


    // const [activeLink, setActiveLink]   = useState('order-request');
    const [orderList, setOrderList]     = useState([])
    const [totalOrders, setTotalOrders] = useState()
    const [currentPage, setCurrentPage] = useState(1); 
    const ordersPerPage = 2;

     const getActiveLinkFromPath = (path) => {
        switch (path) {
            // case '/supplier/order/order-request':
            //     return 'order-request';
            case '/supplier/order/active':
                return 'active';
            case '/supplier/order/completed':
                return 'completed';
            default:
                return 'order-request';
        }
    };

    const activeLink = getActiveLinkFromPath(location.pathname);

    const handleLinkClick = (link) => {
        setCurrentPage(1);
        switch (link) {
            // case 'order-request':
            //     navigate('/supplier/order/order-request');
            //     break;
            case 'active':
                navigate('/supplier/order/active');
                break;
            case 'completed':
                navigate('/supplier/order/completed');
                break;
            default:
                navigate('/supplier/order/order-request');
        }
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow  = () => setShow(true);

    const [modal, setModal] = useState(false)

    const showModal = () => {
        setModal(!modal)
    }

    const [showOrder, showOrderDetails] = useState(false)

    const showOrderModal = () => {
        showOrderDetails(!showOrder)
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
        const supplierIdLocalStorage   = localStorage.getItem("supplier_id");

        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
        navigate("/supplier/login");
        return;
        }
        const obj = {
            supplier_id  : supplierIdSessionStorage || supplierIdLocalStorage,
            filterKey    : activeLink,
            page_no      : currentPage, 
            limit        : ordersPerPage,
        }

        postRequestWithToken('supplier/order/supplier-order-list', obj, async (response) => {
            if (response.code === 200) {
                setOrderList(response.result.data)
                setTotalOrders(response.result.totalItems)
            } else {
               console.log('error in order list api',response);
            }
          })
    },[activeLink, currentPage])

    
    return (
        <>
            <div className='order-main-container'>
                <div className="order-name">
                    {(() => {
                        switch (activeLink) {
                            case 'order-request':
                                return 'Order Request';
                            case 'active':
                                return 'Active Orders';
                            case 'completed':
                                return 'Completed Orders';
                            default:
                                return 'Orders';
                        }
                    })()}
                </div>
                <div className="order-container">
                    {/* <div className="order-container-left">
                        <div onClick={() => handleLinkClick('order-request')} className={activeLink === 'order-request' ? 'active order-left-wrapper' : 'order-left-wrapper'}>
                            <img src={order_list} alt="order icon" />
                            <div>Order Request</div>
                        </div>
                        <div onClick={() => handleLinkClick('active')} className={activeLink === 'active' ? 'active order-left-wrapper' : 'order-left-wrapper'}>
                            <img src={order_list} alt="order icon" />
                            <div>Active Orders</div>
                        </div>
                        <div onClick={() => handleLinkClick('completed')} className={activeLink === 'completed' ? 'active order-left-wrapper' : 'order-left-wrapper'}>
                            <img src={order_list} alt="order icon" />
                            <div>Completed Orders</div>
                        </div>
                    </div> */}

                   <div className="order-container-left">
                    {/* <div
                        onClick={() => handleLinkClick('pending')}
                        className={activeLink === 'order-request' ? 'active order-left-wrapper' : 'order-left-wrapper'}
                    >
                        <img src={order_list} alt="order icon" />
                        <div>Order Request</div>
                    </div> */}
                    <div
                        onClick={() => handleLinkClick('active')}
                        className={activeLink === 'active' ? 'active order-left-wrapper' : 'order-left-wrapper'}
                    >
                        <img src={order_list} alt="order icon" />
                        <div>Active Orders</div>
                    </div>
                    <div
                        onClick={() => handleLinkClick('completed')}
                        className={activeLink === 'completed' ? 'active order-left-wrapper' : 'order-left-wrapper'}
                    >
                        <img src={order_list} alt="order icon" />
                        <div>Completed Orders</div>
                    </div>
                </div>

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
                                 /> 
                                // : activeLink === 'deleted' ? 
                                // <DeletedOrders /> 
                                : activeLink === 'order-request' ? 
                                <OrderRequest 
                                    orderList        = {orderList} 
                                    totalOrders      = {totalOrders} 
                                    currentPage      = {currentPage}
                                    ordersPerPage    = {ordersPerPage}
                                    handlePageChange = {handlePageChange}
                                    activeLink       = {activeLink}
                                /> : ''
                            }
                        </div>
                        {/* {
                            modal === true ? <OrderCancel setModal={setModal} /> : ''
                        }
                        {
                            showOrder === true ? <OrderDetails showOrderDetails={showOrderDetails} /> : ''
                        } */}

                    </div>
                </div>
            </div>
        </>
    )
}
export default Order
