import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../style/dashboardorder.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { postRequestWithToken } from '../../api/Requests';
import OrderCancel from '../OrderCancel';
import moment from 'moment/moment';

const OrderRequest = () => {
    const navigate = useNavigate()


    const [show, setShow] = useState(false);

    const [modal, setModal] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const showModal = (orderId) => {
        setSelectedOrderId(orderId)
        setModal(!modal)
    }

    const [orderList, setOrderList]     = useState([])
    const [totalOrders, setTotalOrders] = useState()

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage     = 2;
    const indexOfLastOrder  = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    // const currentOrders     = activeOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const supplierIdSessionStorage = sessionStorage.getItem('supplier_id')
        const supplierIdLocalStorage   = localStorage.getItem('supplier_id')

        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
        navigate("/supplier/login");
        return;
        }
        
        const obj = {
            supplier_id : supplierIdSessionStorage || supplierIdLocalStorage,
            filterKey   : 'pending',
            page_no     : currentPage, 
            limit       : ordersPerPage,
        }

        postRequestWithToken('supplier/order/supplier-order-list', obj, async (response) => {
            if (response.code === 200) {
                setOrderList(response.result.data)
                setTotalOrders(response.result.totalItems)
            } else {
               console.log('error in order list api',response);
            }
          })
    },[currentPage])
    return (
        <>
            <div className='completed-order-main-container'>
                <div className="completed-order-main-head">Order Request</div>
                <div className="completed-order-container">
                    <div className="completed-order-container-right-2">
                        <Table responsive="xxl" className='completed-order-table-responsive'>
                            <thead>
                                <div className='completed-table-row-container m-0' style={{ backgroundColor: 'transparent' }} >
                                    < div className='table-row-item table-order-1' >
                                        <span className='completed-header-text-color' >Order ID	</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Date	</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-2'>
                                        <span className='completed-header-text-color'>Buyer Name</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Quantity</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Status	</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Action	</span>
                                    </div>

                                </div>
                            </thead>

                            <tbody className='bordered'>
                            {
                                    orderList && orderList.length > 0 ? (
                                        orderList.map((order, i) => {
                                            const totalQuantity = order.items.reduce((total, item) => {
                                                return total + item.quantity;
                                              }, 0);
                                              const orderedDate = moment(order.created_at).format("DD/MM/YYYY")
                                            return (
                                    <div className='completed-table-row-container'>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{order.order_id}</div>
                                        </div>

                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{orderedDate}</div>
                                        </div>
                                        <div className='completed-table-row-item  completed-table-order-2'>
                                            <div className='table-text-color'>{order?.buyer?.buyer_name || "Needhi Pharma"}</div>
                                        </div>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{totalQuantity}</div>
                                        </div>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{order?.order_status?.charAt(0).toUpperCase() + order?.order_status?.slice(1) }</div>
                                        </div>
                                        <div className='completed-table-row-item  completed-order-table-btn completed-table-order-1'>
                                            <Link to={`/supplier/order-details/${order?.order_id}`}>
                                                <div className='completed-order-table completed-order-table-view '><RemoveRedEyeOutlinedIcon className="table-icon" /></div>
                                            </Link>
                                        </div>
                                    </div>
                                 ) 
                                })
                            ) :  (
                                <>
                                <div className='pending-products-no-orders'>
                                    No Order Request
                                </div>

                            </>
                                
                        )
                        } 
                            </tbody>
                        </Table>
                        <div className='pagi-container'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={ordersPerPage}
                                totalItemsCount={totalOrders}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                hideFirstLastPages={true}
                            />
                            <div className='pagi-total'>
                                <div className='pagi-total'>
                                    Total Items: {totalOrders}
                                </div>
                            </div>
                        </div>
                        {
                            modal === true ? <OrderCancel setModal={setModal} orderId = {selectedOrderId} activeLink = {'pending'} /> : ''
                        }
                    </div>
                </div>
            </div>



        </>
    )
}

export default OrderRequest

