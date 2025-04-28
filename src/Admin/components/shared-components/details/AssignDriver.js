import React, { useState } from 'react';
import '../../../assets/style/orderdetails.css';
import PaginationComponent from '../../shared-components/Pagination/Pagination';

const AssignDriver = ({ orderItems, orderDetails }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 3;
    const data = orderItems && orderItems.length > 0 ? orderItems : [];

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = data.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="card-body">
            <div className="table-assign-driver-heading">Product List</div>
            <table className="table">
                <tbody>
                    {currentOrders?.length > 0 ? (
                        currentOrders.map((item, i) => (
                            <tr key={i}>
                                <td className="tables-td">
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Product ID</span>
                                        <span className="table-g-not-names">{item.productId || item.product_id}</span>
                                    </div>
                                </td>
                                <td className="tables-td-cont">
                                    <div className="table-second-container">
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Product Name</span>
                                            <span className="table-g-not-name">{item?.medicine_name || item?.productName || item?.product_name}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="tables-td">
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Quantity</span>
                                        <span className="table-g-not-name">{item?.quantity_required || item?.quantity}</span>
                                    </div>
                                </td>
                                <td className="tables-td">
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Total Amount</span>
                                        <span className="table-g-not-name">
                                            {item.total_amount || item.item_price || item.totalAmount
                                                ? `${item.total_amount || item.item_price || item.totalAmount} USD`
                                                : '-'}
                                        </span>
                                    </div>
                                </td>
                                <td className="tables-td">
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Est. Delivery Time</span>
                                        <span className="table-g-not-name">
                                            {item?.est_delivery_days
                                                ? item.est_delivery_days.toLowerCase().includes('days')
                                                    ? item.est_delivery_days.replace(/days/i, 'Days')
                                                    : `${item.est_delivery_days} Days`
                                                : ''}
                                        </span>
                                    </div>
                                </td>
                                <td></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No Data Available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {data.length > 0 && (
                <div className="pagi-container">
                    <PaginationComponent
                        activePage={currentPage}
                        itemsCountPerPage={ordersPerPage}
                        totalItemsCount={data.length}
                        pageRangeDisplayed={5}
                        onChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default AssignDriver;