import React, { useState } from 'react';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const SellerInquiryProductList = ({ items, setCounterChecked, setAcceptChecked, setQuotationItems, inquiryDetails, quotation }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [prices, setPrices] = useState({});
    const ordersPerPage = 10;

    const activeOrders = [
        { productId: 'PR1234567', productName: 'Paracetamol (acetaminophen)', quantity: 200, targetprice: '10 AED' },
        { productId: 'PR1234568', productName: 'Ibuprofen', quantity: 100, targetprice: '14 AED' },
        { productId: 'PR1234569', productName: 'Aspirin', quantity: 150, targetprice: '18 AED' },
    ];

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = activeOrders.slice(indexOfFirstOrder, indexOfLastOrder);

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

                    <tr>
                        <td className='tables-td'>
                            <div className="table-g-section-content">
                                <span className="table-g-driver-name">Product ID</span>
                                <span className="table-g-not-names">PRO123456</span>
                            </div>
                        </td>
                        <td className='tables-td-cont'>
                            <div className="table-second-container">
                                <span className="table-g-section">G</span>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Product Name</span>
                                    <span className="table-g-not-name">Paracetamol</span>
                                </div>
                            </div>
                        </td>
                        <td className='tables-td'>
                            <div className="table-g-section-content">
                                <span className="table-g-driver-name">Quantity Req.</span>
                                <span className="table-g-not-name">500</span>
                            </div>
                        </td>
                        <td className='tables-td'>
                            <div className="table-g-section-content">
                                <span className="table-g-driver-name">Target Price</span>
                                <span className="table-g-not-name">
                                    1 AED
                                </span>
                            </div>
                        </td>
                        {/* <td className='tables-td'>
                            <div className="table-g-section-content">
                                <span className="table-g-driver-name">Counter Price</span>
                                <span className="table-g-not-name">
                                </span>
                            </div>
                        </td> */}
                        <td className='tables-td'>
                            <div className="table-g-section-content">
                                <span className="table-g-driver-name">Est. Delivery Time</span>
                                <span className="table-g-not-name">
                                    14 Days
                                </span>
                            </div>
                        </td>
                        <td className='tables-td'>
                            <div className="table-g-section-content">
                                <span className="table-g-driver-name">Status</span>
                                <span className="table-g-not-name">
                                    Pending
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className='pagi-container'>
                <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={ordersPerPage}
                    totalItemsCount={items?.length}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                    itemClass="page-item"
                    linkClass="page-link"
                    prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                    nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                    hideFirstLastPages={true}
                />
                <div className='pagi-total'>
                    <div>Total Items: {items?.length}</div>
                </div>
            </div>
        </div>
    );
};

export default SellerInquiryProductList;