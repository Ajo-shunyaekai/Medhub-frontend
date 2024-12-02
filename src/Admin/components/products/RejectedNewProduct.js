import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../style/dashboardorders.css';
import Table from 'react-bootstrap/Table';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { postRequestWithToken } from '../../api/Requests';

const RejectedNewProduct = ({productList, totalProducts, currentPage, listPerPage, handlePageChange, activeLink}) => {

    return (
        <>
            <div className='rejected-main-container'>
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
                                        <span className='rejected-header-text-color'>Status</span>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <span className='rejected-header-text-color'>Action</span>
                                    </div>
                                </div>
                            </thead>
                            <tbody className='bordered'>
                            {productList?.length > 0 ? (
                                productList.map((product, index) => (
                                    <div className='rejected-table-row-container' key={index}>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <div className='rejected-table-text-color'>{product.supplier_id || 'N/A'}</div>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <div className='rejected-table-text-color'>{product.medicine_id || 'N/A'}</div>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-2'>
                                        <div className='table-text-color'>{product.medicine_name || 'N/A'}</div>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <div className='rejected-table-text-color'>{product.strength || '500 mg'}</div>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-order-1'>
                                        <div className='rejected-table-text-color'>
                                        {(() => {
                                            switch (product.status) {
                                            case 0:
                                                return 'Pending';
                                            case 1:
                                                return 'Approved';
                                            case 2:
                                                return 'Rejected';
                                            default:
                                                return 'Unknown';
                                            }
                                        })()}
                                        </div>
                                    </div>
                                    <div className='rejected-table-row-item rejected-table-btn rejected-table-order-1'>
                                        <Link to={`/admin/product-details/${product.medicine_id}`}>
                                        <div className='rejected-table rejected-table-view'>
                                            <RemoveRedEyeOutlinedIcon className="table-icon" />
                                        </div>
                                        </Link>
                                    </div>
                                    </div>
                                ))
                                ) : (
                                    <div className='pending-products-no-orders'>
                                    No data available
                               </div>
                                )}

                            </tbody>
                        </Table>
                        <div className='rejected-pagi-container'>
                            <Pagination
                               activePage={currentPage}
                               itemsCountPerPage={listPerPage}
                               totalItemsCount={totalProducts}
                               pageRangeDisplayed={5}
                               onChange={handlePageChange}
                               itemClass="page-item"
                               linkClass="page-link"
                               prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                               nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                               hideFirstLastPages={true}
                            />
                            <div className='rejected-pagi-total'>
                              <div>Total Items: {totalProducts}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RejectedNewProduct;