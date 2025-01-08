import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../../assest/style/dashboardorder.css'
import { postRequestWithToken } from '../../../../api/Requests';
import moment from 'moment/moment';
import OrderCancel from '../../Orders/OrderCancel';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Table } from 'react-bootstrap';

const PendingProducts = () => {
    const navigate = useNavigate()

    const [show, setShow] = useState(false);

    const [modal, setModal] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const showModal = (orderId) => {
        setSelectedOrderId(orderId)
        setModal(!modal)
    }

    const [productList, setProductList]     = useState([])
    const [totalProducts, setTotalProducts] = useState()

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage     = 5;
    const indexOfLastOrder  = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    // const currentOrders     = activeOrders.slice(indexOfFirstOrder, indexOfLastOrder);

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
            status : 0,
            pageNo   : currentPage, 
            pageSize     : ordersPerPage,
        }

        postRequestWithToken('supplier/medicine-request-list', obj, async (response) => {
            if (response.code === 200) {
                setProductList(response.result.data)
                setTotalProducts(response.result.totalItems)
            } else {
               console.log('error in order list api',response);
            }
          })
    },[currentPage])
    return (
        <>
            <div className='completed-order-main-container'>
                <div className="completed-order-main-head">Pending Products List</div>
                <div className="completed-order-container">
                    <div className="completed-order-container-right-2">
                        <Table responsive="xxl" className='completed-order-table-responsive'>
                            <thead>
                                <div className='completed-table-row-container m-0' style={{ backgroundColor: 'transparent' }} >
                                    < div className='table-row-item table-order-1' >
                                        <span className='completed-header-text-color' >Product ID</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Date</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-2'>
                                        <span className='completed-header-text-color'>Product Name</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Total Quantity</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Status</span>
                                    </div>
                                    {/* <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Action</span>
                                    </div> */}

                                </div>
                            </thead>

                            <tbody className='bordered'>
                            {
                                    productList && productList?.length > 0 ? (
                                        productList.map((item, i) => {
                                            // const totalQuantity = order.items.reduce((total, item) => {
                                            //     return total + item.quantity;
                                            //   }, 0);
                                              const requestDate = moment(item.created_at).format("DD/MM/YYYY")
                                            return (
                                    <div className='completed-table-row-container'>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{item.medicine_id}</div>
                                        </div>

                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{requestDate}</div>
                                        </div>
                                        <div className='completed-table-row-item  completed-table-order-2'>
                                            <div className='table-text-color'>{item.medicine_name}</div>
                                        </div>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{item.total_quantity}</div>
                                        </div>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>
                                                {/* {order.status === 0 && order.edit_status === 1 ? 'Pending' :  order.status === 1 && order.edit_status === 1 ? 'Accepted' : order.status === 2 ? 'Rejected' : ''} */}
                                                {item.status === 0 && item.edit_status === 0 ? 'Pending' : 
                                                    item.status === 1 && item.edit_status === 0 ? 'Pending' :
                                                    item.status === 1 && item.edit_status === 2 ? 'Rejected' : 
                                                    item.status === 2 && item.edit_status === 2 ? 'Rejected' : 
                                                    ''}
                                                </div>
                                        </div>
                                        {/* <div className='completed-table-row-item  completed-order-table-btn completed-table-order-1'>
                                            <Link to={`/supplier/active-orders-details/${order.order_id}`}>
                                                <div className='completed-order-table completed-order-table-view '><RemoveRedEyeOutlinedIcon className="table-icon" /></div>
                                            </Link>
                                        </div> */}
                                    </div>
                                ) 
                            })
                        ) : (
                            <div className='pending-products-no-orders'>
                            No Pending Product Requests
                            </div>
                        )
                    }
                            </tbody>
                        </Table>
                        <div className='completed-pagi-container'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={ordersPerPage}
                                totalItemsCount={totalProducts}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                hideFirstLastPages={true}
                            />
                            <div className='completed-pagi-total'>
                                <div className='completed-pagi-total'>
                                    Total Items: {totalProducts}
                                </div>
                            </div>
                        </div>
                        {
                            modal === true ? <OrderCancel setModal={setModal} orderId = {selectedOrderId} activeLink = {'completed'} /> : ''
                        }
                    </div>
                </div>
            </div>



        </>
    )
}

export default PendingProducts