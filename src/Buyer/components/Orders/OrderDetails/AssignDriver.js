import React, { useState } from 'react';
import PaginationComponent from '../../SharedComponents/Pagination/pagination'; // Import the common PaginationComponent
import './orderdetails.css';

const AssignDriver = ({ orderItems }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 3;
    const data = orderItems && orderItems.length > 0 ? orderItems : []; // Use empty array if no orderItems
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
                    {currentOrders?.map((item, i) => {
                        return (
                            <tr key={i}>
                                <td className="tables-td">
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Product ID</span>
                                        <span className="table-g-not-names">{item.product_id}</span>
                                    </div>
                                </td>
                                <td className="tables-td-cont">
                                    <div className="table-second-container">
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Product Name</span>
                                            <span className="table-g-not-name">{item.medicine_name || item.product_name}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="tables-td">
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Quantity</span>
                                        <span className="table-g-not-name">{item.quantity_required || item.quantity}</span>
                                    </div>
                                </td>
                                <td className="tables-td">
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Total Price</span>
                                        <span className="table-g-not-name">{item.total_amount || item.item_price} USD</span>
                                    </div>
                                </td>
                                <td className="tables-td">
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Est. Delivery Time</span>
                                        <span className="table-g-not-name">
                                            {item.est_delivery_days
                                                ? item.est_delivery_days.toLowerCase().includes('days')
                                                    ? item.est_delivery_days.replace(/days/i, 'Days')
                                                    : `${item.est_delivery_days} Days`
                                                : '10 Days'}
                                        </span>
                                    </div>
                                </td>
                                <td></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <PaginationComponent
                activePage={currentPage}
                itemsCountPerPage={ordersPerPage}
                totalItemsCount={data.length}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
            />
        </div>
    );
};

export default AssignDriver;