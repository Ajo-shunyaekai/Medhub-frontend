import React, { useState } from 'react';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const InquiryProductList = ({items, setCounterChecked, setAcceptChecked, setQuotationItems, inquiryDetails}) => {
    const [currentPage, setCurrentPage]       = useState(1);
    const [acceptedOrders, setAcceptedOrders] = useState([]);
    const [rejectedOrders, setRejectedOrders] = useState([]);
    const [prices, setPrices] = useState({});
    const ordersPerPage = 10; 

    const activeOrders = [
        { productId: 'PR1234567', productName: 'Paracetamol (acetaminophen)', quantity: 200, targetprice: '10 AED' },
        { productId: 'PR1234568', productName: 'Ibuprofen', quantity: 100, targetprice: '14 AED' },
        { productId: 'PR1234569', productName: 'Aspirin', quantity: 150, targetprice: '18 AED' },
    ];

    const indexOfLastOrder  = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders     = activeOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleAcceptChange = (itemId) => {
        const item = items.find((item) => item._id === itemId);
        setAcceptedOrders((prev) =>
            prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
        );
        setRejectedOrders((prev) => prev.filter((id) => id !== itemId));

        setPrices((prev) => ({ ...prev, [itemId]: '' }));
        setQuotationItems((prev) => prev.filter((order) => order._id !== itemId));

        if (!acceptedOrders.includes(itemId)) {
            setQuotationItems((prev) => [...prev, { ...item, accepted: true }]);
        }
    };

    const handleRejectChange = (itemId) => {
        const item = items.find((item) => item._id === itemId);
        setRejectedOrders((prev) =>
            prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
        );
        setAcceptedOrders((prev) => prev.filter((id) => id !== itemId));
        setQuotationItems((prev) => prev.filter((order) => order._id !== itemId));

        if (!rejectedOrders.includes(itemId)) {
            setQuotationItems((prev) => [...prev, { ...item, accepted: false }]);
        }
    };

    const handlePriceChange = (itemId, value) => {
        if (/^\d{0,9}$/.test(value)) {
            setPrices((prev) => ({ ...prev, [itemId]: value }));
            if (value.length > 0) {
                setRejectedOrders((prev) => {
                    if (!prev.includes(itemId)) {
                        return [...prev, itemId];
                    }
                    return prev;
                });

                setAcceptedOrders((prev) => prev.filter((id) => id !== itemId));
                setQuotationItems((prev) =>
                    prev.map((order) => (order._id === itemId ? { ...order, counterPrice: value } : order))
                );
            }
        }
    };

    return (
        <div className="card-body">
            <div>
                <div className="table-assign-driver-heading">Product List</div>
            </div>
            <table className="table">
                <tbody>
                    {items?.map((item, index) => (
                        <tr key={index}>
                            <td className='tables-td'>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Product ID</span>
                                    <span className="table-g-not-names">{item.medicine_id}</span>
                                </div>
                            </td>
                            <td className='tables-td-cont'>
                                <div className="table-second-container">
                                    <span className="table-g-section">G</span>
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Product Name</span>
                                        <span className="table-g-not-name">{item.medicine_details.medicine_name}</span>
                                    </div>
                                </div>
                            </td>
                            <td className='tables-td'>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Quantity</span>
                                    <span className="table-g-not-name">{item.quantity_required}</span>
                                </div>
                            </td>
                            <td className='tables-td'>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Target Price</span>
                                    <span className="table-g-not-name">{item.target_price}</span>
                                </div>
                            </td>
                            {/* <td className='tables-status'>
                                <div className='tables-button-conatiner'>
                                    <label className='inquiry-label-section'>
                                        <input
                                            className='inquiry-input-section'
                                            type="checkbox"
                                            checked={acceptedOrders.includes(item._id)}
                                            onChange={() => handleAcceptChange(item._id)}
                                        />
                                        Accept
                                    </label>
                                    <div className='inquiry-price-container'>
                                        <label className='inquiry-label-section'>
                                            <input
                                             className='inquiry-input-section'
                                                type="checkbox"
                                                checked={rejectedOrders.includes(item._id)}
                                                onChange={() => handleRejectChange(item._id)}
                                            />
                                        </label>
                                        <input
                                        className='inquiry-text-input-section'
                                            type="text"
                                            value={prices[item._id] || ''}
                                            onChange={(e) => handlePriceChange(item._id, e.target.value)}
                                            disabled={!rejectedOrders.includes(item._id)}
                                            maxLength="9"
                                            placeholder='Enter Counter Price'
                                        
                                        />
                                    </div>
                                </div>
                            </td> */}
                             {inquiryDetails.enquiry_status !== 'Quotation submitted' && inquiryDetails.enquiry_status !== 'cancelled' && inquiryDetails.enquiry_status !== 'PO created' ? (
                <td className='tables-status'>
                    <div className='tables-button-conatiner'>
                        <label className='inquiry-label-section'>
                            <input
                                className='inquiry-input-section'
                                type="checkbox"
                                checked={acceptedOrders.includes(item._id)}
                                onChange={() => handleAcceptChange(item._id)}
                            />
                            Accept
                        </label>
                        <div className='inquiry-price-container'>
                            <label className='inquiry-label-section'>
                                <input
                                    className='inquiry-input-section'
                                    type="checkbox"
                                    checked={rejectedOrders.includes(item._id)}
                                    onChange={() => handleRejectChange(item._id)}
                                />
                            </label>
                            <input
                                className='inquiry-text-input-section'
                                type="text"
                                value={prices[item._id] || ''}
                                onChange={(e) => handlePriceChange(item._id, e.target.value)}
                                disabled={!rejectedOrders.includes(item._id)}
                                maxLength="9"
                                placeholder='Enter Counter Price'
                            />
                        </div>
                    </div>
                </td>
            ) : (
                <td className='tables-td'>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Status</span>
                                    <span className="table-g-not-name">{inquiryDetails?.enquiry_status.charAt(0).toUpperCase() + inquiryDetails?.enquiry_status.slice(1)}</span>
                                </div>
                            </td>
            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='pagi-container'>
                <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={ordersPerPage}
                    totalItemsCount={activeOrders.length}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                    itemClass="page-item"
                    linkClass="page-link"
                    prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                    nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                    hideFirstLastPages={true}
                />
                <div className='pagi-total'>
                    <div>Total Items: {activeOrders.length}</div>
                </div>
            </div>
        </div>
    );
};

export default InquiryProductList;
