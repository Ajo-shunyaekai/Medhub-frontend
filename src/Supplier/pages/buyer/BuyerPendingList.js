import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import '../../style/BuyerOrdersList.css';

const BuyerPendingList = () => {
    const [activeOrders, setActiveOrders] = useState([
        {
            "order_id": "3654646",
            "order_datetime": "12/02/2024",
            "order_quantity": "20 Ton",
            "order_price": "$2000",
            "status": "Pending"
        },
        {
            "order_id": "000002",
            "order_datetime": "20/02/2024",
            "order_quantity": "15 Ton",
            "order_price": "$1500",
            "status": "Pending"
        },
        {
            "order_id": "000003",
            "order_datetime": "20/02/2024",
            "order_quantity": "25 Ton",
            "order_price": "$2500",
            "status": "Pending"
        },
        {
            "order_id": "000004",
            "order_datetime": "20/02/2024",
            "order_quantity": "30 Ton",
            "order_price": "$3000",
            "status": "Pending"
        },
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 4;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = activeOrders.slice(indexOfFirstOrder, indexOfFirstOrder + ordersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className='completed-order-main-container'>
                <div className="completed-order-main-head">Pending Orders</div>
                <div className="completed-order-container">
                    <div className="completed-order-container-right-2">
                        <Table responsive="xxl" className='completed-order-table-responsive'>
                            <thead>
                                <tr className='completed-table-row-container m-0' style={{ backgroundColor: 'transparent' }}>
                                    <th className='table-row-item table-order-1'>
                                        <span className='completed-header-text-color'>Order ID</span>
                                    </th>
                                    <th className='completed-table-row-item completed-table-order-2'>
                                        <span className='completed-header-text-color'>Date</span>
                                    </th>
                                    <th className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Quantity</span>
                                    </th>
                                    <th className='completed-table-row-item completed-table-order-2'>
                                        <span className='completed-header-text-color'>Price</span>
                                    </th>
                                    <th className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Status</span>
                                    </th>
                                    <th className='completed-table-row-item completed-table-order-1'>
                                        <span className='completed-header-text-color'>Action</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='bordered'>
                                {currentOrders.map((order, index) => (
                                    <tr className='completed-table-row-container' key={index}>
                                        <td className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{order.order_id}</div>
                                        </td>
                                        <td className='completed-table-row-item completed-table-order-2'>
                                            <div className='completed-table-text-color'>{order.order_datetime}</div>
                                        </td>
                                        <td className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{order.order_quantity}</div>
                                        </td>
                                        <td className='completed-table-row-item completed-table-order-2'>
                                            <div className='completed-table-text-color'>{order.order_price}</div>
                                        </td>
                                        <td className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{order.status}</div>
                                        </td>
                                        <td className='completed-table-row-item completed-order-table-btn completed-table-order-1'>
                                            <Link to='/supplier/active-orders-details'>
                                                <div className='completed-order-table completed-order-table-view'>
                                                    <RemoveRedEyeOutlinedIcon className="table-icon" />
                                                </div>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div className='completed-pagi-container'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={ordersPerPage}
                                totalItemsCount={activeOrders.length}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                hideFirstLastPages={true}
                            />
                            <div className='completed-pagi-total'>
                                Total Items: {activeOrders.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BuyerPendingList;


