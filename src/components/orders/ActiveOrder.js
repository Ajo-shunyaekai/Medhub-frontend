import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../style/order.css';
import '../../style/activeorder.css'
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import OrderCancel from './OrderCancel';
import OrderDetails from '../OrderDetails'
import moment from 'moment/moment';


const ActiveOrder = ({ orderList, totalOrders, currentPage, ordersPerPage, handlePageChange, activeLink }) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [modal, setModal] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const showModal = (orderId) => {
        setSelectedOrderId(orderId)
        setModal(!modal)
    }

    const [activeOrders, setActiveOrders] = useState([
        {
            "order_id": "3654646",
            "date": {
                "date": "12/12/2019",
            },
            "source_destination": {
                "destination": "Pharmaceuticals Pvt. Ltd"
            },
            "number_of_TRWB": 4,
            "commodity": {
                "name": "Steel",
                "quantity": "(20 Ton)"
            },
            "status": "Order Placed"
        },
        {
            "order_id": "000002",
            "date": {
                "date": "12/12/2019",

            },
            "source_destination": {

                "destination": "Pharmaceuticals Pvt. Ltd"
            },
            "number_of_TRWB": 4,
            "commodity": {
                "name": "Steel",
                "quantity": "(20 Ton)"
            },
            "status": "Order Placed"
        },
        {
            "order_id": "000003",
            "date": {
                "date": "12/12/2019",

            },
            "source_destination": {

                "destination": "Pharmaceuticals Pvt. Ltd"
            },
            "number_of_TRWB": 4,
            "commodity": {
                "name": "Steel",
                "quantity": "(20 Ton)"
            },
            "status": "Order Placed"
        },
        {
            "order_id": "000004",
            "date": {
                "date": "12/12/2019",

            },
            "source_destination": {

                "destination": "Pharmaceuticals Pvt. Ltd"
            },
            "number_of_TRWB": 4,
            "commodity": {
                "name": "Steel",
                "quantity": "(20 Ton)"
            },
            "status": "Order Placed"
        },
    ]);

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = activeOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    return (
        <>
            <div className='order-main-container'>
                <div className="order-name-2"> Active Orders</div>
                <div className="order-container">
                    {/* Order Right side table  */}
                    <div className="order-container-right-section">
                        {/* start the table section code */}
                        <div className='order-inner-container-section'>
                            <table className="table-container">
                                {
                                    <thead className='order-container-thead'>
                                        <tr className='order-container-tr'>
                                            <th className="order-container-th"><div className="order-container-head"> Order ID</div></th>
                                            <th className="order-container-th"> <div className="order-container-head"> Date</div></th>
                                            <th className="order-container-ths"><div className="order-container-heads">Supplier Name</div></th>
                                            <th className="order-container-th"><div className="order-container-head">Quantity</div></th>
                                            <th className="order-container-th"><div className="order-container-head">Status</div></th>
                                            <th className="order-container-th"><div className="order-container-head">Action</div></th>
                                        </tr>
                                    </thead>
                                }

                                {
                                    orderList && orderList.length > 0 ? (
                                        orderList?.map((order, i) => {
                                            const totalQuantity = order.items.reduce((total, item) => {
                                                return total + (item.quantity_required || item.quantity);
                                            }, 0);
                                            const orderedDate = moment(order.created_at).format("DD/MM/YYYY")
                                            return (
                                                <tbody className='order-container-tbody'>
                                                    <tr className="order-section-tr">
                                                        <td className='order-section-td'>
                                                            <div className="order-section-heading">{order.order_id}</div>
                                                        </td>
                                                        <td className='order-section-td'>
                                                            <div className="order-section-heading">{orderedDate}</div>
                                                        </td>
                                                        <td className='order-section-tds'>
                                                            <div className="order-section-heading">{order.supplier?.supplier_name}</div>
                                                        </td>
                                                        <td className='order-section-td'>
                                                            <div className="order-section-heading">{totalQuantity}</div>
                                                        </td>
                                                        <td className='order-section-td'>
                                                            <div className="order-section-heading">
                                                                {/* {order?.status?.charAt(0).toUpperCase() + order?.status.slice(1)  } */}
                                                                {order?.status}
                                                            </div>
                                                        </td>
                                                        <td className='order-section-button-cont'>
                                                            <div className='order-section-button'>
                                                                <Link to={`/buyer/order-details/${order.order_id}`}>
                                                                    <div className='order-section-view'>
                                                                        <RemoveRedEyeOutlinedIcon className='order-section-eye' />
                                                                    </div>
                                                                </Link>
                                                                {/* <div className='order-section-delete' onClick={() => showModal(order.order_id)}>
                                                            <HighlightOffIcon className='order-section-off' />
                                                        </div> */}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            )
                                        })
                                    ) :
                                        (
                                            <>
                                                <div className='pending-products-no-orders'>
                                                    No Active Orders
                                                </div>
                                            </>
                                        )



                                }


                            </table>
                        </div>
                        {/* End the table section code */}
                        {
                            modal === true ? <OrderCancel setModal={setModal} orderId={selectedOrderId} activeLink={activeLink} /> : ''
                        }

                        {
                            orderList && orderList.length > 0 ? (
                                <div className='pagi-container'>
                                    <Pagination
                                        activePage={currentPage}
                                        itemsCountPerPage={ordersPerPage}
                                        totalItemsCount={totalOrders}
                                        pageRangeDisplayed={5}
                                        // onChange={handlePageChange}
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
                            ) : ''
                        }

                    </div>
                </div>
            </div >



        </>
    )
}

export default ActiveOrder
