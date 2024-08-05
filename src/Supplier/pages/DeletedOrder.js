import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/order.css';
import order_list from '../assest/dashboard/order_list.svg'
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import OrderCancel from './OrderCancel';



const DeletedOrder = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [modal, setModal] = useState(false)

    const showModal = () => {
        setModal(!modal)
    }

    // Alloted Order JSOn file
    const [deletedOrders, setDeletedOrders] = useState([
        {
            "order_id": "123456",
            "date": {
                "date": "12/12/2019",
                // "time": "10:00 am"
            },
            "source_destination": {
                "source": "Pharmaceutical Pvt Ltd",
                // "destination": "Sharjah - United Arab Emirates"
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
                // "time": "10:00 am"
            },
            "source_destination": {
                "source": "Pharmaceutical Pvt Ltd",
                // "destination": "Sharjah - United Arab Emirates"
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
                // "time": "10:00 am"
            },
            "source_destination": {
                "source": "Pharmaceutical Pvt Ltd",
                // "destination": "Sharjah - United Arab Emirates"
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
                // "time": "10:00 am"
            },
            "source_destination": {
                "source": "Pharmaceutical Pvt Ltd",
                // "destination": "Sharjah - United Arab Emirates"
            },
            "number_of_TRWB": 4,
            "commodity": {
                "name": "Steel",
                "quantity": "(20 Ton)"
            },
            "status": "Order Placed"
        },
    ]);


    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 2; // Change this to set the number of orders per page
    // Logic to calculate pagination indexes
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = deletedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate total pages
    const totalPages = Math.ceil(deletedOrders.length / ordersPerPage);

    // pagination end
    return (
        <>
            <div className='order-main-container'>
                <div className="order-name-2"> Deleted Orders</div>
                <div className="order-container">

                    {/* Order Right side table  */}
                    <div className="order-container-right-2">
                        <Table responsive="xl" className='order-table-responsive'>
                            <thead>
                                <div className='table-row-container m-0' style={{ backgroundColor: 'transparent' }} >
                                    < div className='table-row-item table-order-1' >
                                        <span className='header-text-color' >Order ID	</span>
                                    </div>
                                    <div className='table-row-item table-order-1'>
                                        <span className='header-text-color'>Date	</span>
                                    </div>
                                    <div className='table-row-item table-order-2'>
                                        <span className='header-text-color'>Supplier Name</span>
                                    </div>
                                    <div className='table-row-item table-order-1'>
                                        <span className='header-text-color'>No. Qty</span>
                                    </div>
                                    {/* <div className='table-row-item table-order-1'>
                                        <span className='header-text-color'>Commodity	</span>
                                    </div> */}
                                    <div className='table-row-item table-order-1'>
                                        <span className='header-text-color'>Status	</span>
                                    </div>
                                    <div className='table-row-item table-order-1'>
                                        <span className='header-text-color'>Action	</span>
                                    </div>
                                </div>
                            </thead>

                            <tbody className='bordered'>
                                {currentOrders?.map((order, index) => (
                                    <div className='table-row-container'>
                                        <div className='table-row-item table-order-1'>
                                            <div className='table-text-color'>{order.order_id}</div>
                                        </div>

                                        <div className='table-row-item table-order-1'>
                                            <div className='table-text-color'>{order.date.date}</div>
                                            <div className='table-text-color-2'>{order.date.time}</div>
                                        </div>
                                        <div className='table-row-item table-order-2'>
                                            <div className='table-text-color'>{order.source_destination.source}</div>
                                            <div className='table-text-color-2'>{order.source_destination.destination}</div>
                                        </div>
                                        <div className='table-row-item table-order-1'>
                                            <div className='table-text-color ms-4'>{order.number_of_TRWB}</div>
                                        </div>
                                        {/* <div className='table-row-item table-order-1'>
                                            <div className='table-text-color'>{order.commodity.name}</div>
                                            <div className='table-text-color-2'>{order.commodity.quantity}</div>
                                        </div> */}
                                        <div className='table-row-item table-order-1'>
                                            <div className='table-text-color'>{order.status}</div>
                                        </div>
                                        <div className='table-row-item  order-table-btn table-order-1'>
                                            <Link to="/supplier/order-details">
                                                <div className='order-table order-table-view ' ><RemoveRedEyeOutlinedIcon className="table-icon" /></div>
                                            </Link>
                                            <div className='order-table order-table-cancel' onClick={showModal} ><HighlightOffIcon className="table-icon" /></div>
                                        </div>
                                    </div>
                                ))}
                            </tbody>
                        </Table>
                        {
                            modal === true ? <OrderCancel setModal={setModal} /> : ''
                        }

                        <div className='pagi-container'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={ordersPerPage}
                                totalItemsCount={deletedOrders.length}
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
                                    Total Items: {deletedOrders.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >

        </>
    )
}

export default DeletedOrder