import React, { useState } from 'react'
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import moment from "moment-timezone";

const ProductList = ({ orderItems, quotationItems, handleAccept, handleReject, inquiryDetails }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    const activeOrders = [
        { productId: 'PR1234567', productName: 'Paracetamol', quantity: 200, totalAmount: '500 USD' },
        { productId: 'PR1234567', productName: 'Paracetamol', quantity: 200, totalAmount: '500 USD' },
        { productId: 'PR1234567', productName: 'Paracetamol', quantity: 200, totalAmount: '500 USD' },
    ];

    // const data = orderItems && orderItems.length > 0 ? orderItems : activeOrders;
    const data = orderItems && orderItems?.length > 0 ? orderItems : quotationItems && quotationItems?.length > 0 ? quotationItems : activeOrders;

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = data.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [acceptedItems, setAcceptedItems] = useState([]);
    const [rejectedItems, setRejectedItems] = useState([]);

    const handleAcceptClick = (item, status) => {
        setAcceptedItems([...acceptedItems, item]);
        setRejectedItems(rejectedItems.filter(rejItem => rejItem._id !== item._id));
        handleAccept(item, status);

    };

    const handleRejectClick = (item, status) => {
        setRejectedItems([...rejectedItems, item]);
        setAcceptedItems(acceptedItems.filter(accItem => accItem._id !== item._id));
        handleReject(item, status);
    };

    const isAccepted = (item) => acceptedItems.some(accItem => accItem._id === item._id);
    const isRejected = (item) => rejectedItems.some(rejItem => rejItem._id === item._id);

    const dateToDisplay = inquiryDetails?.quotation_items_created_at || inquiryDetails?.quotation_items_updated_at || moment().toISOString();

    // Format the date to display
    const formattedDate = moment(dateToDisplay)
        .tz("Asia/Kolkata")
        .format("DD/MM/YYYY HH:mm:ss");

    return (
        <div className="card-body">
            <div>
                <div className="table-assign-driver-heading">Quotation from Supplier</div>
            </div>

            <table className="table">
                <tbody>

                    {
                        currentOrders?.map((item, i) => {
                            return (
                                <tr>
                                    <td className='tables-tds'>
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Product ID</span>
                                            <span className="table-g-not-names">{item.product_id || item.medicine_id || item.productId}</span>
                                        </div>
                                    </td>
                                    <td className='tables-tds-cont' >
                                        <div className="table-second-container">
                                            <span className="table-g-section">{item?.product_name?.charAt(0) || item?.medicine_details?.medicine_name?.charAt(0) || item?.productName?.charAt(0)}</span>
                                            <div className="table-g-section-content">
                                                <span className="table-g-driver-name">Product Name</span>
                                                <span className="table-g-not-name">{item?.product_name || item?.medicine_details?.medicine_name || item.product_name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='tables-tds'>
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Quantity Req.</span>
                                            <span className="table-g-not-name">{item.quantity || item.quantity_required || item.quantity}</span>
                                        </div>
                                    </td>
                                    <td className='tables-tds'>
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Target Price</span>
                                            <span className="table-g-not-name">
                                                {item.price || item.target_price || item.totalAmount
                                                    ? `${item.price || item.target_price || item.totalAmount} USD`
                                                    : '-'}
                                            </span>
                                        </div>
                                    </td>

                                    <td className='tables-tds'>
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
                                    <td className='tables-tds'>
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
                                    {inquiryDetails.enquiry_status === 'PO created' && (
                                        <td className='tables-tds'>
                                            <div className="table-g-section-content">
                                                <span className="table-g-driver-name">Status</span>
                                                <span className="table-g-not-name">
                                                    {item?.status?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || '-'}
                                                </span>
                                            </div>
                                        </td>
                                    )}

                                   
                                   {inquiryDetails.enquiry_status !== 'PO created' && (
                                   
                                    <td className='tables-tds'>
                                        <div className="table-g-section-content-button">
                                            {item.status === 'pending' ? (
                                                <>
                                                    <span className="table-g-not-name-button" onClick={() => handleAcceptClick(item, 'accepted')}>Accept</span>
                                                    <span className="table-g-not-reject-buttons" onClick={() => handleRejectClick(item, 'rejected')}>Reject</span>
                                                </>
                                            ) : item.status === 'accepted' ? (
                                                <span className="table-g-not-name-button accepted"
                                                // onClick={() => handleRejectClick(item, 'rejected')}
                                                >
                                                    Accepted</span>
                                            ) : item.status === 'rejected' ? (
                                                <span className="table-g-not-reject-buttons rejected"
                                                //  onClick={() => handleAcceptClick(item, 'accepted')}
                                                 >
                                                    Rejected</span>
                                            ) : null}
                                        </div>
                                    </td>
                                    )}
                                    <td></td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>
            <div className='pagi-container'>
                <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={ordersPerPage}
                    totalItemsCount={data.length}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                    itemClass="page-item"
                    linkClass="page-link"
                    prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                    nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                    hideFirstLastPages={true}
                />
                <div className='pagi-total'>
                    <div>Total Items: {data.length}</div>
                </div>
            </div>
        </div>
    )
}

export default ProductList