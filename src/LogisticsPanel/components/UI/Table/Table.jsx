import React from 'react';
import DataTable from 'react-data-table-component';
import Pagination from "react-js-pagination";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const Table = ({ 
    columns, 
    data, 
    totalItems, 
    currentPage, 
    itemsPerPage, 
    onPageChange 
}) => {
    return (
        <div className='order-main-container'>
            <div className="order-container">
                <div className="order-container-right-section">
                    <DataTable
                        columns={columns}
                        data={data}
                        pagination={false}
                        noDataComponent={<div className='pending-products-no-orders'>No Requests</div>}
                    />
                    {data && data.length > 0 && (
                        <div className='pagi-container'>
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={itemsPerPage}
                                totalItemsCount={totalItems}
                                pageRangeDisplayed={5}
                                onChange={onPageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                hideFirstLastPages={true}
                            />
                            <div className='pagi-total'>
                                Total Items: {totalItems}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Table;
