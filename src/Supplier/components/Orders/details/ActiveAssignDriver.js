import React, { useState } from 'react';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const ActiveAssignDriver = ({ productList = [] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;
    
    if (!productList.length) {
        return <div>No products available</div>;
    }

    const indexOfLastOrder  = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders     = productList.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="card-body">
            <div>
                <div className="table-assign-driver-heading">Product List</div>
            </div>
            <table className="table">
                <tbody>
                    {currentOrders.map((order, i) => (
                        <tr key={i}>
                            <td className='tables-td'>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Product ID</span>
                                    <span className="table-g-not-names">{order.product_id || order.product_id}</span>
                                </div>
                            </td>
                            <td className='tables-td-cont'>
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Product Name</span>
                                        <span className="table-g-not-name">{order.medicine_name || order.product_name}</span>
                                    </div>
                            </td>
                            <td className='tables-td'>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Quantity</span>
                                    <span className="table-g-not-name">{order.quantity_required || order.quantity}</span>
                                </div>
                            </td>
                            <td className='tables-td'>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Total Amount</span>
                                    <span className="table-g-not-name">
                                        {order.total_amount || order.item_price ? `${order.total_amount || order.item_price} USD` : '-'}
                                    </span>
                                </div>
                            </td>
                            <td className='tables-td'>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Est. Delivery Time</span>
                                    <span className="table-g-not-name">
                                        {order?.est_delivery_days
                                            ? order.est_delivery_days.toLowerCase().includes('days')
                                                ? order.est_delivery_days.replace(/days/i, 'Days')
                                                : `${order.est_delivery_days} Days`
                                            : '10 Days'}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='pagi-container'>
                <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={ordersPerPage}
                    totalItemsCount={productList.length}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                    itemClass="page-item"
                    linkClass="page-link"
                    prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                    nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                    hideFirstLastPages={true}
                />
                <div className='pagi-total'>
                    <div className='pagination-total-items'>Total Items: {productList.length}</div>
                </div>
            </div>
        </div>
    );
};

export default ActiveAssignDriver;
