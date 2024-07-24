import React, { useState } from 'react';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const AssignDriver = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 3; // Number of orders to display per page

    // Example data (replace this with your actual data)
    const activeOrders = [
        { id: 'PR123654', productName: 'Paracetamol', quantity: 200, unitprice: '20 AED', targetprice:'18 AED', status:'Pending' },
        { id: 'QR147852', productName: 'Ibuprofen', quantity: 150, unitprice: '10 AED', targetprice:'9 AED', status:'Pending' },
        { id: 'RT258963', productName: 'Aspirin', quantity: 100, unitprice: '14 AED', targetprice:'12 AED', status:'Pending' },
        { id: 'BN258963', productName: 'Amoxicillin', quantity: 50, unitprice: '15 AED', targetprice:'13 AED', status:'Pending' },
        { id: 'YU789654', productName: 'Ciprofloxacin', quantity: 75, unitprice: '18 AED', targetprice:'15 AED', status:'Pending' },
        // Add more orders as needed
    ];

    // Logic to slice orders for pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = activeOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Function to handle page change
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
                    {currentOrders.map(order => (
                        <tr key={order.id}>
                            <td className='tables-td'>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Product ID</span>
                                    <span className="table-g-not-names">{order.id}</span>
                                </div>
                            </td>
                            <td className='tables-td-cont'>
                                <div className="table-second-container">
                                    <span className="table-g-section">G</span>
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Product Name</span>
                                        <span className="table-g-not-name">{order.productName}</span>
                                    </div>
                                </div>
                            </td>
                            <td className='tables-td'>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Quantity</span>
                                    <span className="table-g-not-name">{order.quantity}</span>
                                </div>
                            </td>
                            <td className='tables-td'>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Unit Price</span>
                                    <span className="table-g-not-name">{order.unitprice}</span>
                                </div>
                            </td>
                            <td className='tables-td'>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Target Price</span>
                                    <span className="table-g-not-name">{order.targetprice}</span>
                                </div>
                            </td>
                            {/* <td className='tables-td'>
                                <div className="table-g-section-content">
                                    <span className="table-g-driver-name">Status</span>
                                    <span className="table-g-not-name">{order.status}</span>
                                </div>
                            </td> */}
                            <td>
                                {/* Any additional actions */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination section */}
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
                    Total Items: {activeOrders.length}
                </div>
            </div>
        </div>
    );
};

export default AssignDriver;
