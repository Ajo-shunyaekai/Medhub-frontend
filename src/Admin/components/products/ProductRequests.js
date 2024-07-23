import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../style/dashboardorders.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const ProductRequests = () => {
    const product = [
        {
            supplier_id: "000001",
            product_id: "012122",
            product_name: "Migon",
            strength: "500 Mg",
            origin: "India"
        },
        {
            supplier_id: "000001",
            product_id: "012122",
            product_name: "Migon",
            strength: "500 Mg",
            origin: "UAE"
        },
        {
            supplier_id: "000001",
            product_id: "012122",
            product_name: "Migon",
            strength: "500 Mg",
            origin: "UK"
        },
        {
            supplier_id: "000001",
            product_id: "012122",
            product_name: "Migon",
            strength: "500 Mg",
            origin: "USA"
        },
        {
            supplier_id: "000001",
            product_id: "012122",
            product_name: "Migon",
            strength: "500 Mg",
            origin: "Europe"
        },
        {
            supplier_id: "000001",
            product_id: "012122",
            product_name: "Migon",
            strength: "500 Mg",
            origin: "UAE"
        },
    
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 4;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = product.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className='rejected-main-container'>
                <div className="rejected-main-head">Product Requests</div>
                <div className="rejected-container">
                    <div className="rejected-container-right-2">
                        <Table responsive="xxl" className='rejected-table-responsive'>
                            <thead>
                                <div className='rejected-table-row-container' style={{ backgroundColor: 'transparent' }}>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Supplier ID</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Product ID</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-2'>
                                        <span className='rejected-header-text-color'>Product Name</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Strength</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>origin</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Action</span>
                                    </div>
                                </div>
                            </thead>
                            <tbody className='bordered'>
                                {currentOrders?.map((product, index) => (
                                    <div className='rejected-table-row-container' key={index}>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='rejected-table-text-color'>{product.supplier_id}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='rejected-table-text-color'>{product.product_id}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-2'>
                                            <div className='table-text-color'>{product.product_name}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='rejected-table-text-color'>{product.strength}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-order-1'>
                                            <div className='rejected-table-text-color'>{product.origin}</div>
                                        </div>
                                        <div className='rejected-table-row-item rejected-table-btn rejected-table-order-1'>
                                            <Link to='/order-details'>
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
                                totalItemsCount={product.length}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                hideFirstLastPages={true}
                            />
                            <div className='rejected-pagi-total'>
                                <div>Total Items: {product.length}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductRequests;