import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../style/dashboardorders.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import OrderCancel from '../../components/orders/OrderCancel'
const PendingInvoicesList = () => {
    const navigate = useNavigate()
    const [show, setShow] = useState(false);
    const [modal, setModal] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const showModal = (orderId) => {
        setSelectedOrderId(orderId)
        setModal(!modal)
    }
    const [totalOrders, setTotalOrders] = useState()

    // Alloted Order JSOn file
    const [activeOrders, setActiveOrders] = useState([
        {
            "invoice_no": "3654646",
            "order_id": "14785269",
            "customer_name":"Sheetal Pharmacy",
            "amount":"233 AED",
            "status":"Pending",
           
        },
        {
            "invoice_no": "3654646",
            "order_id": "14785269",
            "customer_name":"Sheetal Pharmacy",
            "amount":"233 AED",
            "status":"Pending",
           
        },
        {
            "invoice_no": "3654646",
            "order_id": "14785269",
            "customer_name":"Sheetal Pharmacy",
            "amount":"233 AED",
            "status":"Pending",
           
        },
        {
            "invoice_no": "3654646",
            "order_id": "14785269",
            "customer_name":"Sheetal Pharmacy",
            "amount":"233 AED",
            "status":"Pending",
           
        },
        {
            "invoice_no": "3654646",
            "order_id": "14785269",
            "customer_name":"Sheetal Pharmacy",
            "amount":"233 AED",
            "status":"Pending",
           
        },
    ]);


    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage, setOrdersPerPage] = useState(5)
    const indexOfLastOrder  = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders     = activeOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const totalPages = Math.ceil(activeOrders.length / ordersPerPage);

    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        navigate("/buyer/login");
        return;
        }

        const obj = {
            buyer_id  : buyerIdSessionStorage || buyerIdLocalStorage,
            filterKey : 'active',
            page_no   : currentPage, 
            limit     : ordersPerPage,
        }
    },[currentPage])

    return (
        <>
            <div className='completed-order-main-container'>
                <div className="completed-order-main-head">Pending Invoices</div>
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
                                        <span className='completed-header-text-color'>Status</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Action</span>
                                    </div>
                                </div>
                            </thead>

                            <tbody className='bordered'>
                            {currentOrders?.map((order, index) => (
                                    <div className='completed-table-row-container'>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{order.invoice_no}</div>
                                        </div>

                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{order.order_id}</div>
                                        </div>
                                        <div className='completed-table-row-item  completed-table-order-2'>
                                            <div className='table-text-color'>{order.customer_name}</div>
                                        </div>  
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{order.amount}</div>
                                        </div>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{order.status}</div>
                                        </div>
                                        <div className='completed-table-row-item  completed-order-table-btn completed-table-order-1'>
                                            <Link to={`/buyer/invoice-design/INV-9d6f2b22`}>
                                                <div className='completed-order-table completed-order-table-view ' onClick={showModal}>
                                                    <RemoveRedEyeOutlinedIcon className="table-icon" />
                                                </div>
                                            </Link>
                                            <div className='invoice-details-button-column-download'>
                                                    <CloudDownloadOutlinedIcon className='invoice-view' />
                                                </div>
                                        </div>
                                    </div>
                                       ))}
                            </tbody>
                        </Table>

                        {
                            modal === true ? <OrderCancel setModal={setModal} orderId = {selectedOrderId} activeLink = {'active'} /> : ''
                        }
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
                    </div>
                </div >
            </div>



        </>
    )
}

export default PendingInvoicesList