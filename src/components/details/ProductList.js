import React, { useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const ProductList = ({orderItems, quotationItems, handleAccept, handleReject}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 2; 

    const activeOrders = [
        { productId: 'PR1234567', productName: 'Paracetamol', quantity: 200, totalAmount: '500 AED' },
        { productId: 'PR1234567', productName: 'Paracetamol', quantity: 200, totalAmount: '500 AED' },
        { productId: 'PR1234567', productName: 'Paracetamol', quantity: 200, totalAmount: '500 AED' },
    ];

    // const data = orderItems && orderItems.length > 0 ? orderItems : activeOrders;
    const data = orderItems && orderItems?.length > 0 ? orderItems : quotationItems && quotationItems?.length > 0 ? quotationItems : activeOrders;

    const indexOfLastOrder  = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders     = data.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [acceptedItems, setAcceptedItems] = useState([]);
    const [rejectedItems, setRejectedItems] = useState([]);

    const handleAcceptClick = (item) => {
        setAcceptedItems([...acceptedItems, item]);
        setRejectedItems(rejectedItems.filter(rejItem => rejItem._id !== item._id));
        handleAccept(item); 
    };

    const handleRejectClick = (item) => {
        setRejectedItems([...rejectedItems, item]);
        setAcceptedItems(acceptedItems.filter(accItem => accItem._id !== item._id));
        handleReject(item); 
    };

    const isAccepted = (item) => acceptedItems.some(accItem => accItem._id === item._id);
    const isRejected = (item) => rejectedItems.some(rejItem => rejItem._id === item._id);
    
    return (
        <div className="card-body">
            <div>
                <div className="table-assign-driver-heading">Product List</div>
            </div>
            <table className="table">
                <tbody>

    {
        currentOrders?.map((item,i) => {
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
                                <span className="table-g-section">{item?.product_name?.charAt(0) || item.medicine_details?.medicine_name?.charAt(0) || item?.productName?.charAt(0) }</span>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Product Name</span>
                                    <span className="table-g-not-name">{item.product_name || item.medicine_details?.medicine_name || item.product_name} ({item.composition || item.medicine_details?.composition || 'Claritin'}) </span>
                                </div>
                            </div>
                        </td>
                        <td className='tables-tds'>
                            <div className="table-g-section-content">
                                <span className="table-g-driver-name">Quantity</span>
                                <span className="table-g-not-name">{item.quantity || item.quantity_required || item.quantity}</span>
                            </div>
                        </td>
                        <td className='tables-tds'>
                            <div className="table-g-section-content">
                                <span className="table-g-driver-name">Target Price</span>
                                <span className="table-g-not-name">{item.price || item.target_price ||  item.totalAmount || '30 AED'}</span>
                            </div>
                        </td>

                        <td className='tables-tds'>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Counter Price</span>
                                    <span className="table-g-not-name">{item.counterprice || item.counter_price || '-'}</span>
                                </div>
                        </td>
                        {/* <td className='tables-tds'>
                                <div className="table-g-section-content-button">
                                    <span className="table-g-not-name-button" onClick={() => handleAccept(item.medicine_id, item._id)}>Accept</span>
                                    <span className="table-g-not-reject-buttons" onClick={() => handleReject(item.medicine_id, item._id)}>Reject</span>
                                </div>
                        </td> */}
                        <td className='tables-tds'>
                                <div className="table-g-section-content-button">
                                    {isAccepted(item) ? (
                                        <span className="table-g-not-name-button accepted">Accepted</span>
                                    ) : isRejected(item) ? (
                                        <span className="table-g-not-reject-buttons rejected">Rejected</span>
                                    ) : (
                                        <>
                                            <span className="table-g-not-name-button" onClick={() => handleAcceptClick(item)}>Accept</span>
                                            <span className="table-g-not-reject-buttons" onClick={() => handleRejectClick(item)}>Reject</span>
                                        </>
                                    )}
                                </div>
                            </td>
                        
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