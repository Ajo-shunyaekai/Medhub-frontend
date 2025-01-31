import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './dashboardorders.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import OrderCancel from '../../Orders/OrderCancel/OrderCancel'
import { postRequestWithToken } from '../../../../api/Requests';
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

    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage, setOrdersPerPage] = useState(5)

    const [poList, setPOList] = useState([])
    const [totalPoList, setTotalPoList] = useState()

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const totalPages = Math.ceil(poList.length / ordersPerPage);

    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }

        const obj = {
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
            status: 'active',
            pageNo: currentPage,
            pageSize: ordersPerPage,
        }

        postRequestWithToken('buyer/purchaseorder/get-po-list', obj, async (response) => {
            if (response.code === 200) {
                setPOList(response.result.data)
                setTotalPoList(response.result.totalItems)
            } else {
                toast(response.message, { type: 'error' })
                console.log('error in purchased order list api', response);
            }
            // setLoading(false);
        });
    }, [currentPage])

    return (
        <>
            <div className='completed-order-main-container'>
                <div className="completed-order-main-head">Purchase Orders List</div>
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
                                        <span className='completed-header-text-color'>Date</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-2'>
                                        <span className='completed-header-text-color'>Supplier Name	</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Total Amount</span>
                                    </div>
                                    <div className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Action</span>
                                    </div>
                                </div>
                            </thead>

                            <tbody className='bordered'>
                                {poList && poList.length > 0 ? (
                                    poList.map((order, index) => {
                                        // Calculate totalAmount by summing up the total_amount from each item in order.order_items
                                        const totalAmount = order.order_items.reduce((sum, item) => sum + parseFloat(item.total_amount), 0);

                                        return (
                                            <div key={order.purchaseOrder_id} className='completed-table-row-container'>
                                                <div className='completed-table-row-item completed-table-order-1'>
                                                    <div className='completed-table-text-color'>{order.purchaseOrder_id}</div>
                                                </div>
                                                <div className='completed-table-row-item completed-table-order-1'>
                                                    <div className='completed-table-text-color'>{order.enquiry_id}</div>
                                                </div>
                                                <div className='completed-table-row-item completed-table-order-1'>
                                                    <div className='completed-table-text-color'>{order.po_date}</div>
                                                </div>
                                                <div className='completed-table-row-item completed-table-order-2'>
                                                    <div className='table-text-color'>{order.supplier_name}</div>
                                                </div>
                                                <div className='completed-table-row-item completed-table-order-1'>
                                                    {/* Display totalAmount, fall back to order.total_amount if available */}
                                                    <div className='completed-table-text-color'>{order.total_amount || totalAmount} USD</div>
                                                </div>
                                                <div className='completed-table-row-item completed-order-table-btn completed-table-order-1'>
                                                    <Link to={`/buyer/purchased-order-details/${order.purchaseOrder_id}`}>
                                                        <div className='completed-order-table completed-order-table-view' onClick={showModal}>
                                                            <RemoveRedEyeOutlinedIcon className="table-icon" />
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <>
                                    <div className='pending-products-no-orders'>
                                        No Purchase Orders
                                    </div>

                                </>
                                )}
                            </tbody>

                        </Table>

                        {
                            modal === true ? <OrderCancel setModal={setModal} orderId={selectedOrderId} activeLink={'active'} /> : ''
                        }
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
                    </div>
                </div >
            </div>



        </>
    )
}

export default PurchasedOrdersList


