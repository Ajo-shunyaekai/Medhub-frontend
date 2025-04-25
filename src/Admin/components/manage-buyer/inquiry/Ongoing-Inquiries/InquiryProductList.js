import React, { useState } from 'react';
import moment from 'moment-timezone';
import PaginationComponent from '../../../shared-components/Pagination/Pagination';

const InquiryProductList = ({ orderItems, quotationItems,inquiryDetails }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;
    const data = orderItems?.length > 0 ? orderItems : quotationItems?.length > 0 ? quotationItems : [];
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = data.slice(indexOfFirstOrder, indexOfLastOrder);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const dateToDisplay =
        inquiryDetails?.quotation_items_created_at ||
        inquiryDetails?.quotation_items_updated_at ||
        moment().toISOString();
    const formattedDate = moment(dateToDisplay)
        .tz('Asia/Kolkata')
        .format('DD/MM/YYYY HH:mm:ss');

    return (
        <div className="card-body">
            <div>
                <div className="table-assign-driver-heading">Quotation from Supplier</div>
            </div>

            <table className="table">
                <tbody>
                    {currentOrders.map((item, i) => (
                        <tr key={i}>
                            <td className="tables-tds">
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Product ID</span>
                                    <span className="table-g-not-names">
                                        {item.product_id || item.productId}
                                    </span>
                                </div>
                            </td>
                            <td className="tables-tds-cont">
                                <div className="table-second-container">
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Product Name</span>
                                        <span className="table-g-not-name">
                                            {item.product_name ||
                                                item?.medicine_details?.general?.name ||
                                                item.productName}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="tables-tds">
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Quantity Req.</span>
                                    <span className="table-g-not-name">
                                        {item.quantity || item.quantity_required}
                                    </span>
                                </div>
                            </td>
                            <td className="tables-tds">
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Target Price</span>
                                    <span className="table-g-not-name">
                                        {item.price || item.target_price || item.totalAmount
                                            ? `${item.price || item.target_price || item.totalAmount} USD`
                                            : '-'}
                                    </span>
                                </div>
                            </td>
                            <td className="tables-tds">
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Counter Price</span>
                                    <span className="table-g-not-name">
                                        {item.counter_price
                                            ? item.counter_price.toLowerCase().includes('usd')
                                                ? item.counter_price.replace(/usd/i, 'USD')
                                                : `${item.counter_price} USD`
                                            : '-'}
                                    </span>
                                </div>
                            </td>
                            <td className="tables-tds">
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Est. Delivery Time</span>
                                    <span className="table-g-not-name">
                                        {item.est_delivery_days
                                            ? item.est_delivery_days.toLowerCase().includes('days')
                                                ? item.est_delivery_days.replace(/days/i, 'Days')
                                                : `${item.est_delivery_days} Days`
                                            : '-'}
                                    </span>
                                </div>
                            </td>
                            <td className="tables-tds">
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Status</span>
                                    <span className="table-g-not-name">
                                        {item?.status
                                            ?.split(' ')
                                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ') || '-'}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
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

export default InquiryProductList;