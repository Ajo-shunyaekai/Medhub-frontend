import React, { useState } from 'react';
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import '../../../assets/style/orderdetails.css';

const SellerActiveCodinator = ({ data = [] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 2;

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = data.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="card-body">
            <div className="table-assign-driver-heading">Coordinator List</div>
            {data.length === 0 ? (
                <div>No data available</div>
            ) : (
                <>
                    <table className="table">
                        <tbody>
                            {currentOrders.map((order, i) => (
                                <tr key={i}>
                                    <td className="tables-td">
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Name</span>
                                            <span className="table-g-not-names">{order.name || 'Ashok Kumar'}</span>
                                        </div>
                                    </td>
                                    <td className="tables-td-cont">
                                        <div className="table-second-container">
                                            <div className="table-g-section-content">
                                                <span className="table-g-driver-name">Company Name</span>
                                                <span className="table-g-not-name">{order.companyName || 'Bkart Logisctics'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="tables-td">
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Designation</span>
                                            <span className="table-g-not-name">{order.designation || 'Manager'}</span>
                                        </div>
                                    </td>
                                    <td className="tables-td">
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Mobile No</span>
                                            <span className="table-g-not-name">{order.mobile || '79751245141'}</span>
                                        </div>
                                    </td>
                                    <td className="tables-td">
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Email ID</span>
                                            <span className="table-g-not-name">{order.email || 'ashok@gmail.com'}</span>
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
                </>
            )}
        </div>
    );
};

export default SellerActiveCodinator;