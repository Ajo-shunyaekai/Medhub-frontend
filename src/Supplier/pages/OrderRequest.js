import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import order from '../style/order.css';
import activeorder from '../style/activeOrder.css'
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import OrderCancel from './OrderCancel';
import moment from 'moment/moment';

const OrderRequest = ({orderList, totalOrders, currentPage, ordersPerPage, handlePageChange,  activeLink}) => {
    const [show, setShow] = useState(false);
    const [modal, setModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const showModal = (orderId) => {
        setSelectedOrderId(orderId)
        setModal(!modal)
    }
    const [allotedOrders, setAllotedOrders] = useState([
        {
            "order_id": "000001",
            "date": {
                "date": "12/12/2019",
            },
            "source_destination": {
                "source": "Pharmaceutical Pvt Ltd",
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
                "source": "Pharmaceutical Pvt Ltd",
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
                "source": "Pharmaceutical Pvt Ltd",
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
                "source": "Pharmaceutical Pvt Ltd",
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
    const currentOrders = allotedOrders.slice(indexOfFirstOrder, indexOfLastOrder);


    return (
        <>
            <div className='order-main-container'>
                <div className="order-name-2"> Order Request</div>
                <div className="order-container">
                    <div className="order-container-right-section">
                        <div className='order-inner-container-section'>
                            <table className="table-container">
                                <thead className='order-container-thead'>
                                    <tr className='order-container-tr'>
                                        <th className=" text-muted order-container-th"><div className="order-container-head"> Order ID</div></th>
                                        <th className=" order-container-th"> <div className="order-container-head"> Date</div></th>
                                        <th className="order-container-ths"><div className="order-container-heads">Buyer Name</div></th>
                                        <th className="order-container-th"><div className="order-container-head">Quantity</div></th>
                                        <th className="order-container-th"><div className="order-container-head">Status</div></th>
                                        <th className="order-container-th-action"><div className="order-container-head">Action</div></th>
                                    </tr>
                                </thead>
                               
                                {
                                    orderList && orderList.length > 0 ? (
                                        orderList.map((order,i) => {
                                            const totalQuantity = order.items.reduce((total, item) => {
                                                return total + item.quantity;
                                              }, 0);
                                              const orderedDate = moment(order.created_at).format("DD/MM/YYYY")
                                            return (
                                                <tbody className='order-container-tbody' key={order.order_id}>
                                                    <tr className="order-section-tr" >
                                                        <td className='order-section-td'>
                                                            <div className="order-section-heading">{order.order_id}</div>
                                                        </td>
                                                        <td className='order-section-td'>
                                                            <div className="order-section-heading">{orderedDate}</div>
                                                        </td>
                                                        <td className='order-section-tds'>
                                                            <div className="order-section-heading">{order?.buyer?.buyer_name || 'MedicaLink Global'}</div>
                                                        </td>
                                                        <td className='order-section-td'>
                                                            <div className="order-section-heading">{totalQuantity}</div>
                                                        </td>
                                                        <td className='order-section-td'>
                                                            <div className="order-section-heading">{order.order_status}</div>
                                                        </td>
                                                        <td className='order-section-button-cont'>
                                                            <div className='order-section-button'>
                                                                <Link to={`/supplier/order-details/${order.order_id}`}>
                                                                    <div className='order-section-view'>
                                                                        <RemoveRedEyeOutlinedIcon className='order-section-eye' />
                                                                    </div>
                                                                </Link>
                                                                
                                                                    <div className='order-section-delete' onClick={() => showModal(order.order_id)}>
                                                                        <HighlightOffIcon className='order-section-off' />
                                                                    </div>
                                                                
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            )
                                        })
                                    ) : (
                                     <>
                                        {allotedOrders.map((order, i) => {
                                            const orderedDate = moment(order.date.date).format("DD/MM/YYYY")
                                            return (
                                                <tbody className='order-container-tbody'>
                                                <tr className="order-section-tr" key={order.order_id}>
                                                    <td className='order-section-td'>
                                                        <div className="order-section-heading">{order.order_id}</div>
                                                    </td>
                                                    <td className='order-section-td'>
                                                        <div className="order-section-heading">{orderedDate}</div>
                                                    </td>
                                                    <td className='order-section-tds'>
                                                        <div className="order-section-heading">{order.source_destination.source}</div>
                                                    </td>
                                                    <td className='order-section-td'>
                                                        <div className="order-section-heading">{order.number_of_TRWB}</div>
                                                    </td>
                                                    <td className='order-section-td'>
                                                        <div className="order-section-heading">{order.status}</div>
                                                    </td>
                                                    <td className='order-section-button-cont'>
                                                        <div className='order-section-button'>
                                                            <Link to='/supplier/order-details/879824'>
                                                                <div className='order-section-view'>
                                                                    <RemoveRedEyeOutlinedIcon className='order-section-eye' />
                                                                </div>
                                                            </Link>
                                                            
                                                                <div className='order-section-delete' onClick={() => showModal('786755')} >
                                                                    <HighlightOffIcon className='order-section-off' />
                                                                </div>
                                                            
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            )
                                        })}
                                    </>
                                )
                                }
                            </table>
                        </div>
                        {modal && <OrderCancel setModal={setModal} orderId = {selectedOrderId}  activeLink = { activeLink} />}
                        <div className='pagi-container'>
                            <Pagination
                                // activePage={currentPage}
                                // itemsCountPerPage={ordersPerPage}
                                // totalItemsCount={allotedOrders.length}
                                // pageRangeDisplayed={5}
                                activePage={currentPage}
                                itemsCountPerPage={ordersPerPage}
                                totalItemsCount={totalOrders || allotedOrders.length}
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
                                    {/* Total Items: {allotedOrders.length} */}
                                    Total Items: {totalOrders || allotedOrders.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderRequest;
