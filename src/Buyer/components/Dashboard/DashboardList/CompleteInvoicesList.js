import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './dashboardorders.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import OrderCancel from '../../Orders/OrderCancel/OrderCancel'
import Loader from '../../SharedComponents/Loader/Loader'
import { postRequestWithToken } from '../../../../api/Requests';
import { toast } from 'react-toastify';
import { apiRequests } from '../../../../api';

const CompleteInvoicesList = () => {
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
            "order_id": "1478366",
            "customer_name":"Pharmaceuticals",
            "amount":"244 USD",
            "amount_type":"Card Payment",
            "status": "Pending"
        },
        {
            "invoice_no": "3654646",
            "order_id": "1478366",
            "customer_name":"Pharmaceuticals",
            "amount":"244 USD",
            "amount_type":"Card Payment",
            "status": "Pending"
        },
           
        {
            "invoice_no": "3654646",
            "order_id": "1478366",
            "customer_name":"Pharmaceuticals",
            "amount":"244 USD",
            "amount_type":"Card Payment",
            "status": "Pending"
        },
           
        {
            "invoice_no": "3654646",
            "order_id": "1478366",
            "customer_name":"Pharmaceuticals",
            "amount":"244 USD",
            "amount_type":"Card Payment",
            "status": "Pending"
        },
           
        {
            "invoice_no": "3654646",
            "order_id": "1478366",
            "customer_name":"Pharmaceuticals",
            "amount":"244 USD",
            "amount_type":"Card Payment",
            "status": "Pending"
        },
           
           
       
    ]);

    const [loading, setLoading] = useState(true);
    const [invoiceList, setInvoiceList] = useState([]);
    const [totalInvoices, setTotalInvoices] = useState(0);
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
        const fetchData = async ()=>{
            const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
            const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

            if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
            }
            setLoading(true); 
            const obj = {
                buyer_id  : buyerIdSessionStorage || buyerIdLocalStorage,
                filterKey : 'paid',
                page_no   : currentPage, 
                limit     : ordersPerPage,
            }
    
            // postRequestWithToken('order/get-invoice-list-all-users', obj, async (response) => {
            //     if (response.code === 200) {
            //         setInvoiceList(response.result.data);
            //         setTotalInvoices(response.result.totalItems);
            //     } else {
            //         console.log('error in order list api', response);
            //     }
            //     setLoading(false);
            // })
            try {
                const response = await apiRequests.getRequest(`order/get-all-invoice-list?filterKey=${'paid'}&pageNo=${currentPage}&pageSize=${ordersPerPage}`)
                if(response?.code!==200){
                    console.log('error in invoice list api', response);
                    return
                }
                
                setInvoiceList(response.result.data);
                setTotalInvoices(response.result.totalItems);
            } catch (error) {
                console.log('Error in get-invoice-list API', error);
                
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    },[currentPage])

    return (
        <>
        {loading ? (
                        <Loader />
                    ) : (
            <div className='completed-order-main-container'>
                <div className="completed-order-main-head">Completed Invoices</div>
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
                                        <span className='completed-header-text-color'>Customer Name	</span>
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
                            {invoiceList && invoiceList.length > 0 ? (
                            invoiceList.map((invoice, i) => (
                                    <div className='completed-table-row-container'>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{invoice.invoice_no}</div>
                                        </div>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{invoice.order_id}</div>
                                        </div>
                                        <div className='completed-table-row-item  completed-table-order-2'>
                                            <div className='table-text-color'>{invoice.supplier_name}</div>
                                        </div>  
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{invoice.total_payable_amount} USD</div>
                                        </div>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{invoice.mode_of_payment}</div>
                                        </div>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{invoice.status?.charAt(0).toUpperCase() + invoice?.status?.slice(1)}</div>
                                        </div>
                                        <div className='completed-table-row-item  completed-order-table-btn completed-table-order-1'>
                                            <Link to={`/buyer/invoice-design/${invoice.invoice_id}`}>
                                                <div className='completed-order-table completed-order-table-view ' onClick={showModal}>
                                                    <RemoveRedEyeOutlinedIcon className="table-icon" />
                                                </div>
                                            </Link>
                                            <div className='invoice-details-button-column-download'>
                                                    <CloudDownloadOutlinedIcon className='invoice-view' />
                                                </div>
                                        </div>
                                    </div>
                                       ))
                                    ) : (
                                      
                                        <div className='pending-products-no-orders'>
                                            No Completed Invoices Available
                                        </div>
                                       
                                    )}
                            </tbody>
                        </Table>

                        {
                            modal === true ? <OrderCancel setModal={setModal} orderId = {selectedOrderId} activeLink = {'active'} /> : ''
                        }
                        <div className='completed-pagi-container'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={ordersPerPage}
                                totalItemsCount={totalInvoices || invoiceList.length}
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
                                    Total Items: {totalInvoices || invoiceList.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div>
          )}

        </>
    )
}

export default CompleteInvoicesList