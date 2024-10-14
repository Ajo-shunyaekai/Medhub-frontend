import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../style/dashboardorders.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import OrderCancel from '../../components/orders/OrderCancel'
import { postRequestWithToken } from '../../api/Requests';
import moment from 'moment/moment';
const OngoingOrders = () => {
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
    const [ordersPerPage, setOrdersPerPage] = useState(5)
    // const ordersPerPage     = 2;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }

        const obj = {
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
            filterKey: 'active',
            page_no: currentPage,
            limit: ordersPerPage,
        }

        postRequestWithToken('buyer/order/buyer-order-list', obj, async (response) => {
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
                <div className="completed-order-main-head">Active Orders</div>
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
                                        <span className='completed-header-text-color'>Supplier Name	</span>
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
                                    orderList && orderList?.length > 0 ? (
                                        orderList?.map((order, i) => {
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
                                                        <div className='completed-table-text-color'>{orderedDate}</div>
                                                        <div className='completed-table-text-color-2'>{order?.date?.time}</div>
                                                    </div>
                                                    <div className='completed-table-row-item  completed-table-order-2'>
                                                        <div className='table-text-color'>{order.supplier.supplier_name}</div>
                                                        <div className='table-text-color-2'>{order?.source_destination?.destination}</div>
                                                    </div>
                                                    <div className='completed-table-row-item completed-table-order-1'>
                                                        <div className='completed-table-text-color ms-4'>{totalQuantity}</div>
                                                    </div>
                                                    <div className='completed-table-row-item completed-table-order-1'>
                                                        <div className='completed-table-text-color'>{order?.status?.charAt(0).toUpperCase() + order?.status?.slice(1)}</div>
                                                    </div>
                                                    <div className='completed-table-row-item  completed-order-table-btn completed-table-order-1'>
                                                        <Link to={`/buyer/order-details/${order.order_id}`}>
                                                            <div className='completed-order-table completed-order-table-view ' onClick={showModal}>
                                                                <RemoveRedEyeOutlinedIcon className="table-icon" />
                                                            </div>
                                                        </Link>
                                                        {/* <div className='completed-order-table completed-order-table-cancel' onClick={() => showModal(order.order_id)}>
                                                <HighlightOffIcon className="table-icon" />
                                            </div> */}

                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <>
                                            <div className='pending-products-no-orders'>
                                                No Active Orders
                                            </div>

                                        </>

                                    )
                                }
                            </tbody>
                        </Table>

                        {
                            modal === true ? <OrderCancel setModal={setModal} orderId={selectedOrderId} activeLink={'active'} /> : ''
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

export default OngoingOrders






