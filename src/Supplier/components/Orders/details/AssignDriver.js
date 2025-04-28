import React, { useState } from 'react';
import PaginationComponent from '../../SharedComponents/Pagination/Pagination';

const AssignDriver = ({ productList }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 1;
    const data = productList && productList.length > 0 ? productList : activeOrders;

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = data.slice(indexOfFirstOrder, indexOfLastOrder);

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
                                    <span className="table-g-not-names">{order.productId || order.product_id}</span>
                                </div>
                            </td>
                            <td className='tables-td-cont'>
                                <div className="table-second-container">
                                    <span className="table-g-section">G</span>
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Product Name</span>
                                        <span className="table-g-not-name">{order.productName || order.product_name}</span>
                                    </div>
                                </div>
                            </td>
                            <td className='tables-td'>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Quantity</span>
                                    <span className="table-g-not-name">{order.quantity}</span>
                                </div>
                            </td>
                            <td className='tables-td'>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Total Amount</span>
                                    <span className="table-g-not-name">{order.totalAmount || order.price}</span>
                                </div>
                            </td>
                            <td className='tables-status'>
                                <div className='tables-button-conatiner'>
                                    <div className='table-accept-button'>Accept</div>
                                    <div className='table-reject-button'>Reject</div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='pagi-container'>
                <PaginationComponent
                    activePage={currentPage}
                    itemsCountPerPage={ordersPerPage}
                    totalItemsCount={data.length}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default AssignDriver;