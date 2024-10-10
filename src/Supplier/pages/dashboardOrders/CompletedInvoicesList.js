import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../style/dashboardorder.css'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { postRequestWithToken } from '../../api/Requests';
import moment from 'moment/moment';
import OrderCancel from '../OrderCancel';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Table } from 'react-bootstrap';

const CompletedInvoicesList = () => {
    const navigate = useNavigate()

    const [show, setShow] = useState(false);

    const [modal, setModal] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const showModal = (orderId) => {
        setSelectedOrderId(orderId)
        setModal(!modal)
    }

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
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
            filterKey: 'completed',
            page_no: currentPage,
            limit: ordersPerPage,
        }

        postRequestWithToken('supplier/order/supplier-order-list', obj, async (response) => {
            if (response.code === 200) {
                setOrderList(response.result.data)
                setTotalOrders(response.result.totalItems)
            } else {
                console.log('error in order list api', response);
            }
        })
    }, [currentPage])
    return (
        <>
            <div className='completed-order-main-container'>
                <div className="completed-order-main-head">Complete Invoices</div>
                <div className="completed-order-container">
                    <div className="completed-order-container-right-2">
                        <Table responsive="xxl" className='completed-order-table-responsive'>
                            <thead>
                                <div className='completed-table-row-container m-0' style={{ backgroundColor: 'transparent' }} >
                                    < div className='table-row-item table-order-1' >
                                        <span className='completed-header-text-color' >Invoice No</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Order ID</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-2'>
                                        <span className='completed-header-text-color'>Customer Name</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Amount</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Payment Type</span>
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
                                {
                                    orderList && orderList?.length > 0 ? (
                                        orderList.map((order, i) => {
                                            const totalQuantity = order.items.reduce((total, item) => {
                                                return total + (item.quantity || item.quantity_required);
                                            }, 0);
                                            const orderedDate = moment(order.created_at).format("DD/MM/YYYY")
                                            return (
                                                <div className='completed-table-row-container'>
                                                    <div className='completed-table-row-item completed-table-order-1'>
                                                        <div className='completed-table-text-color'>{order.order_id}</div>
                                                    </div>

                                                    <div className='completed-table-row-item completed-table-order-1'>
                                                        <div className='completed-table-text-color'>{order.order_id}</div>
                                                    </div>
                                                    <div className='completed-table-row-item  completed-table-order-2'>
                                                        <div className='table-text-color'>{order.buyer.buyer_name}</div>
                                                    </div>
                                                    <div className='completed-table-row-item completed-table-order-1'>
                                                        <div className='completed-table-text-color'>{order.order_id}</div>
                                                    </div>
                                                    <div className='completed-table-row-item completed-table-order-1'>
                                                        <div className='completed-table-text-color'>{order.order_id}</div>
                                                    </div>
                                                    <div className='completed-table-row-item completed-table-order-1'>
                                                        <div className='completed-table-text-color'>{order?.order_status?.charAt(0).toUpperCase() + order?.order_status?.slice(1)}</div>
                                                    </div>
                                                    <div className='completed-table-row-item  completed-order-table-btn completed-table-order-1'>
                                                        <Link to={`/supplier/inquiry-request-details/INQ-77258ebc`}>
                                                            <div className='completed-order-table completed-order-table-view '><RemoveRedEyeOutlinedIcon className="table-icon" /></div>
                                                        </Link>
                                                        <div className='invoice-details-button-column-download'>
                                                            <CloudDownloadOutlinedIcon className='invoice-view' />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <>
                                        <div className='pending-products-no-orders'>
                                            No Completed Invoices
                                        </div>

                                    </>
                                        
                                )
                                }
                            </tbody>
                        </Table>
                        <div className='completed-pagi-container'>
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
                            <div className='completed-pagi-total'>
                                <div className='completed-pagi-total'>
                                    Total Items: {totalOrders}
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

export default CompletedInvoicesList







