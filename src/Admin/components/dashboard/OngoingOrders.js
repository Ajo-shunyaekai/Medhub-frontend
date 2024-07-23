import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../style/dashboardorders.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
const OngoingOrders = () => {


    // Alloted Order JSOn file
    const activeOrders = [
        {
            order_id: "000001",
            order_date: "14-06-2024",
            supplier_name: "ABC Pvt. Ltd.",
            order_qty: "125",
            order_status: "Shipped"
        },
        {
            order_id: "000002",
            order_date: "16-06-2024",
            supplier_name: "ABC Pvt. Ltd.",
            order_qty: "130",
            order_status: "Shipped"
        },
        {
            order_id: "000003",
            order_date: "20-06-2024",
            supplier_name: "ABC Pvt. Ltd.",
            order_qty: "325",
            order_status: "Shipped"
        },
        {
            order_id: "000004",
            order_date: "26-06-2024",
            supplier_name: "ABC Pvt. Ltd.",
            order_qty: "656",
            order_status: "Shipped"
        },
    ]


    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 2;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = activeOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <>
            <div className='completed-order-main-container'>
                <div className="completed-order-main-head"> Ongoing Orders</div>
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
                                {currentOrders?.map((order, index) => (
                                    <div className='completed-table-row-container'>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{order.order_id}</div>
                                        </div>

                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{order.order_date}</div>
                                        </div>
                                        <div className='completed-table-row-item  completed-table-order-2'>
                                            <div className='table-text-color'>{order.supplier_name}</div>
                                        </div>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{order.order_qty}</div>
                                        </div>
                                        <div className='completed-table-row-item completed-table-order-1'>
                                            <div className='completed-table-text-color'>{order.order_status}</div>
                                        </div>
                                        <div className='completed-table-row-item  completed-order-table-btn completed-table-order-1'>
                                            <Link to='/admin/order-details'>
                                                <div className='completed-order-table completed-order-table-view '><RemoveRedEyeOutlinedIcon className="table-icon" /></div>
                                            </Link>
                                        </div>
                                    </div>
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
                                <div className='completed-pagi-total'>
                                    Total Items: {activeOrders.length}
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






