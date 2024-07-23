import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../style/dashboardorders.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const SellerTransaction = () => {
    const sellerTransaction = [
        {
            trans_id: "12541001",
            buyer_name: "Mohammad Abdul Shaikh",
            total_amount: "250 USD",
            payment_mode: "Net Banking",
            status: "Paid"
        },
        {
            trans_id: "12541001",
            buyer_name: "Mohammad Abdul Shaikh",
            total_amount: "250 USD",
            payment_mode: "Net Banking",
            status: "Paid"
        },
        {
            trans_id: "12541001",
            buyer_name: "Mohammad Abdul Shaikh",
            total_amount: "250 USD",
            payment_mode: "Net Banking",
            status: "Paid"
        },
        {
            trans_id: "12541001",
            buyer_name: "Mohammad Abdul Shaikh",
            total_amount: "250 USD",
            payment_mode: "Net Banking",
            status: "Paid"
        },
        {
            trans_id: "12541001",
            buyer_name: "Mohammad Abdul Shaikh",
            total_amount: "250 USD",
            payment_mode: "Net Banking",
            status: "Paid"
        },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 4;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = sellerTransaction.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className='rejected-main-container'>
                <div className="rejected-main-head">Seller Transaction List</div>
                <div className="rejected-container">
                    <div className="rejected-container-right-2">
                        <Table responsive="xxl" className='rejected-table-responsive'>
                            <thead>
                                <div className='rejected-table-row-container' style={{ backgroundColor: 'transparent' }}>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Transaction ID</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Buyer Name</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Total Amount</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-2'>
                                        <span className='rejected-header-text-color'>Payment Mode</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Status</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Action</span>
                                    </div>
                                </div>
                            </thead>
                            <tbody className='bordered'>
                                {currentOrders?.map((transaction, index) => (
                                    <div className='rejected-table-row-container' key={index}>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='rejected-table-text-color'>{transaction.trans_id}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='rejected-table-text-color'>{transaction.buyer_name}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='table-text-color'>{transaction.total_amount}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-2'>
                                            <div className='rejected-table-text-color'>{transaction.payment_mode}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='rejected-table-text-color'>{transaction.status}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-btn rejected-table-order-1'>
                                            <Link to='/admin/order-details'>
                                                <div className='rejected-table rejected-table-view'><RemoveRedEyeOutlinedIcon className="table-icon" /></div>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </tbody>
                        </Table>
                        <div className='rejected-pagi-container'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={ordersPerPage}
                                totalItemsCount={sellerTransaction.length}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                hideFirstLastPages={true}
                            />
                            <div className='rejected-pagi-total'>
                                <div>Total Items: {sellerTransaction.length}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SellerTransaction;