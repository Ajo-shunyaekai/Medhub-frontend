import React, { useState } from 'react'
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const AssignDriver = ({orderItems}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 3; 

    const activeOrders = [
        { productId: 'PR1234567', productName: 'Paracetamol', quantity: 200, totalAmount: '500 USD' },
        { productId: 'PR1234567', productName: 'Paracetamol', quantity: 200, totalAmount: '500 USD' },
        { productId: 'PR1234567', productName: 'Paracetamol', quantity: 200, totalAmount: '500 USD' },
    ];

    const data = orderItems && orderItems.length > 0 ? orderItems : activeOrders;

    const indexOfLastOrder  = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders     = data.slice(indexOfFirstOrder, indexOfLastOrder);

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
                {
                    currentOrders?.map((item,i) => {
                        return (
                                <tr>
                                    <td className='tables-td'>
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Product ID</span>
                                            <span className="table-g-not-names">{item.medicine_id || item.product_id }</span>
                                        </div>
                                    </td>
                                    <td className='tables-td-cont' >
                                        <div className="table-second-container">
                                            <span className="table-g-section">{item?.medicine_name?.charAt(0) || item?.product_name?.charAt(0) }</span>
                                            <div className="table-g-section-content">
                                                <span className="table-g-driver-name">Product Name</span>
                                                <span className="table-g-not-name">{item.medicine_name || item.product_name} </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='tables-td'>
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Quantity</span>
                                            <span className="table-g-not-name">{item.quantity_required || item.quantity}</span>
                                        </div>
                                    </td>
                                    <td className='tables-td'>
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Total Price</span>
                                            <span className="table-g-not-name">{item.total_amount || item.item_price} USD</span>
                                        </div>
                                    </td>
                                    <td className='tables-td'>
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Est. Delivery Time</span>
                                            <span className="table-g-not-name">
                                                {/* {item.time || '15 Days'} */}
                                                {item.est_delivery_days
                                                ? item.est_delivery_days.toLowerCase().includes('days')
                                                    ? item.est_delivery_days.replace(/days/i, 'Days')
                                                    : `${item.est_delivery_days} Days` 
                                                : '10 Days'}
                                                </span>
                                        </div>
                                    </td>
                                    <td>

                                    </td>
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

export default AssignDriver