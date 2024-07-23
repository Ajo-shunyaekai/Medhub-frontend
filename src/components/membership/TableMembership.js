import React, {useState } from 'react';
import '../../style/tablemembership.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
const TableMembership = () => {
    const SubscriptionTable = [
        {
            date:"24/08/2024",
            description:"Premium Service",
            service_period:"24/08/2024--24/10/2024",
            payment_method:"Net Banking",
            subtotal:"USD 43",
            total:"USD 43"
        },
        {
            date:"24/08/2024",
            description:"Premium Service",
            service_period:"24/08/2024--24/10/2024",
            payment_method:"Net Banking",
            subtotal:"USD 43",
            total:"USD 43"
        },
        {
            date:"24/08/2024",
            description:"Premium Service",
            service_period:"24/08/2024--24/10/2024",
            payment_method:"Net Banking",
            subtotal:"USD 43",
            total:"USD 43"
        },
        {
            date:"24/08/2024",
            description:"Premium Service",
            service_period:"24/08/2024--24/10/2024",
            payment_method:"Net Banking",
            subtotal:"USD 43",
            total:"USD 43"
        },
    ]


    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 2;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = SubscriptionTable.slice(indexOfFirstOrder, indexOfLastOrder);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <>
            <div className='member-order-main-container'>
                <div className="member-order-container">
                    <div className="member-order-container-right-2">
                        <Table responsive="xxl" className='member-order-table-responsive'>
                            <thead>
                                <div className='member-table-row-container m-0' style={{ backgroundColor: 'transparent' }} >
                                    < div className='member-row-item table-order-1' >
                                        <span className='member-header-text-color' >Date</span>
                                    </div>
                                    <div className='member-table-row-item member-table-order-1'>
                                        <span className='member-header-text-color'>Description</span>
                                    </div>
                                    <div className='member-table-row-item member-table-order-2'>
                                        <span className='member-header-text-color'>Service Period</span>
                                    </div>
                                    <div className='member-table-row-item member-table-order-1'>
                                        <span className='member-header-text-color'>Payment Method</span>
                                    </div>
                                    <div className='member-table-row-item member-table-order-1'>
                                        <span className='member-header-text-color'>Subtotal</span>
                                    </div>
                                    <div className='member-table-row-item member-table-order-1'>
                                        <span className='member-header-text-color'>Total</span>
                                    </div>

                                </div>
                            </thead>

                            <tbody className='bordered'>
                                {currentOrders?.map((order, index) => (
                                    <div className='member-table-row-container'>
                                        <div className='member-table-row-item member-table-order-1'>
                                            <div className='member-table-text-color'>{order.date}</div>
                                        </div>

                                        <div className='member-table-row-item member-table-order-1'>
                                            <div className='member-table-text-color'>{order.description}</div>
                                        </div>
                                        <div className='member-table-row-item  member-table-order-2'>
                                            <div className='table-text-color'>{order.service_period}</div>
                                        </div>
                                        <div className='member-table-row-item member-table-order-1'>
                                            <div className='member-table-text-color'>{order.payment_method}</div>
                                        </div>
                                        <div className='member-table-row-item member-table-order-1'>
                                            <div className='member-table-text-color'>{order.subtotal}</div>
                                        </div>
                                        <div className='member-table-row-item member-table-order-1'>
                                            <div className='member-table-text-color'>{order.total}</div>
                                        </div>
                                    </div>
                                ))}
                            </tbody>
                        </Table>
                        <div className='member-pagi-container'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={ordersPerPage}
                                totalItemsCount={SubscriptionTable.length}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                hideFirstLastPages={true}
                            />
                            <div className='member-pagi-total'>
                                <div className='member-pagi-total'>
                                    Total Items: {SubscriptionTable.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </>
    )
}

export default TableMembership