import React, { useState } from 'react';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const SellerInquiryProductList = ({ items, setCounterChecked, setAcceptChecked, setQuotationItems, inquiryDetails, quotation }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [prices, setPrices] = useState({});
    const ordersPerPage = 10;

    const activeOrders = [
        { productId: 'PR1234567', productName: 'Paracetamol (acetaminophen)', quantity: 200, targetprice: '10 USD' },
        { productId: 'PR1234568', productName: 'Ibuprofen', quantity: 100, targetprice: '14 USD' },
        { productId: 'PR1234569', productName: 'Aspirin', quantity: 150, targetprice: '18 USD' },
    ];

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = items?.slice(indexOfFirstOrder, indexOfLastOrder);

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
                {currentOrders?.map((item, i) => (
                    <tr key={i}>
                        <td className='tables-td'>
                            <div className="table-g-section-content">
                                <span className="table-g-driver-name">Product ID</span>
                                <span className="table-g-not-names">{item.medicine_id}</span>
                            </div>
                        </td>
                        <td className='tables-td-cont'>
                            <div className="table-second-container">
                                <span className="table-g-section">{item?.medicine_details?.medicine_name?.charAt(0).toUpperCase()}</span>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Product Name</span>
                                    <span className="table-g-not-name">{item?.medicine_details?.medicine_name}</span>
                                </div>
                            </div>
                        </td>
                        <td className='tables-td'>
                            <div className="table-g-section-content">
                                <span className="table-g-driver-name">Quantity Req.</span>
                                <span className="table-g-not-name">{item.quantity_required}</span>
                            </div>
                        </td>
                        <td className='tables-td'>
                            <div className="table-g-section-content">
                                <span className="table-g-driver-name">Target Price</span>
                                <span className="table-g-not-name">
                                {item.target_price
                                    ? item.target_price.toLowerCase().includes('usd')
                                        ? item.target_price.replace(/days/i, 'USD')
                                        : `${item.target_price} USD` 
                                    : '-'}
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
                                    {item.est_delivery_days
                                        ? item.est_delivery_days.toLowerCase().includes('days')
                                            ? item.est_delivery_days.replace(/days/i, 'Days')
                                            : `${item.est_delivery_days} Days` 
                                        : '-'}
                                </span>
                            </div>
                        </td>
                        <td className='tables-td'>
                            <div className="table-g-section-content">
                                <span className="table-g-driver-name">Status</span>
                                <span className="table-g-not-name">
                                   {item?.status?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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