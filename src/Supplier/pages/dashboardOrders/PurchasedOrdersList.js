import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../style/dashboardorder.css'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { postRequestWithToken } from '../../api/Requests';
import moment from 'moment/moment';
import OrderCancel from '../OrderCancel';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

const PurchasedOrdersList = () => {
    const navigate = useNavigate()

    const [show, setShow] = useState(false);

    const [modal, setModal] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const showModal = (orderId) => {
        setSelectedOrderId(orderId)
        setModal(!modal)
    }
 const [poList, setPOList]           = useState([])
    const [totalPoList, setTotalPoList] = useState()
    const [orderList, setOrderList] = useState([])
    const [totalOrders, setTotalOrders] = useState()
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
        const supplierIdLocalStorage = localStorage.getItem("supplier_id");

        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }

        const obj = {
            supplier_id : supplierIdSessionStorage || supplierIdLocalStorage,
            status      : 'active',
            pageNo      : currentPage,
            pageSize    : ordersPerPage,
        }

        postRequestWithToken('supplier/purchaseorder/get-po-list', obj, async (response) => {
            if (response.code === 200) {
                setPOList(response.result.data)
                setTotalPoList(response.result.totalItems)
            } else {
                toast(response.message, {type:'error'})
                console.log('error in purchased order list api', response);
            }
            // setLoading(false);
        });
    }, [currentPage])
    return (
        <>
            <div className='completed-order-main-container'>
                <div className="completed-order-main-head">Purchased Orders</div>
                <div className="completed-order-container">
                    <div className="completed-order-container-right-2">
                        <Table responsive="xxl" className='completed-order-table-responsive'>
                            <thead>
                                <div className='completed-table-row-container m-0' style={{ backgroundColor: 'transparent' }} >
                                    < div className='table-row-item table-order-1' >
                                        <span className='completed-header-text-color' >PO ID</span>
                                    </div>
                                    < div className='table-row-item table-order-1' >
                                        <span className='completed-header-text-color' >Inquiry ID</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>PO Date</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-2'>
                                        <span className='completed-header-text-color'>Buyer Name</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Status</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Action</span>
                                    </div>

                                </div>
                            </thead>

                            <tbody className='bordered'>
                            {poList?.length > 0 ? (
                                poList.map((order, i) => {
                                const totalAmount = order.order_items.reduce((sum, item) => sum + parseFloat(item.total_amount), 0);
                                return (
                                                <div className='completed-table-row-container'>
                                                    <div className='completed-table-row-item completed-table-order-1'>
                                                        <div className='completed-table-text-color'>{order.purchaseOrder_id}</div>
                                                    </div>
                                                    <div className='completed-table-row-item completed-table-order-1'>
                                                        <div className='completed-table-text-color'>{order.enquiry_id}</div>
                                                    </div>
                                                    <div className='completed-table-row-item completed-table-order-1'>
                                                        <div className='completed-table-text-color'>{order.po_date}</div>
                                                    </div>
                                                    <div className='completed-table-row-item  completed-table-order-2'>
                                                        <div className='table-text-color'>{order.buyer_name}</div>
                                                    </div>
                                                    <div className='completed-table-row-item completed-table-order-1'>
                                                        <div className='completed-table-text-color'>
                                                            {order?.po_status?.charAt(0).toUpperCase() + order?.po_status?.slice(1)}
                                                            </div>
                                                    </div>
                                                    <div className='completed-table-row-item  completed-order-table-btn completed-table-order-1'>
                                                        <Link to={`/supplier/proforma-invoice/${order.purchaseOrder_id}`}>
                                                            <div className='ongoing-section-button-section-cont'>
                                                                <span className='ongoing-section-orders-button'>Make Order</span>
                                                            </div>
                                                        </Link>
                                                        <Link to={`/supplier/purchased-order-details/${order.purchaseOrder_id}`}>
                                                            <div className='completed-order-table completed-order-table-view '><RemoveRedEyeOutlinedIcon className="table-icon" /></div>
                                                        </Link>
                                                    </div>
                                                </div>
                                           );
                                        })
                                      ) : (
                                        <div className='pending-products-no-orders'>
                                         No Purchase Orders Available
                                         </div>
                                      )}
                            </tbody>
                        </Table>
                        <div className='completed-pagi-container'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={ordersPerPage}
                                totalItemsCount={totalPoList}
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
                                    Total Items: {totalPoList}
                                </div>
                            </div>
                        </div>
                        {
                            modal === true ? <OrderCancel setModal={setModal} orderId={selectedOrderId} activeLink={'completed'} /> : ''
                        }
                    </div>
                </div>
            </div>



        </>
    )
}

export default PurchasedOrdersList