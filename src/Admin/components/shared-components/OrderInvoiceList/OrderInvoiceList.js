import React, { useState } from 'react';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Link } from 'react-router-dom';

const OrderInvoiceList = ({invoiceData}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5; 

    const data =  invoiceData;

    const indexOfLastOrder  = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders     = data.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="card-body">
            <div>
                <div className="table-assign-driver-heading">Invoice List</div>
            </div>
            <table className="table">
                <tbody>

                       {
                        currentOrders.map((invoice, i) => (
                            <tr key={i}>
                                <td className='tables-td'>
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Invoice No.</span>
                                        <span className="table-g-not-names">{invoice.invoice_no }</span>
                                    </div>
                                </td>
                                <td className='tables-td-cont' >
                                    <div className="table-second-container">
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Order ID</span>
                                            <span className="table-g-not-name">{invoice.order_id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className='tables-td'>
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Supplier Name</span>
                                        <span className="table-g-not-name">{invoice.supplier_name}</span>
                                    </div>
                                </td>
                                <td className='tables-td'>
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Amount</span>
                                        <span className="table-g-not-name">
                                           {invoice.total_payable_amount !== null && invoice.total_payable_amount !== undefined
                                            ? `${invoice.total_payable_amount} USD`
                                            : ''}
                                        </span>
                                    </div>
                                </td>
                                <td className='tables-td'>
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Status</span>
                                        <span className="table-g-not-name">
                                        {invoice.invoice_status.charAt(0).toUpperCase() + invoice.invoice_status.slice(1)}
                                        </span>
                                    </div>
                                </td>
                                <td className='tables-td'>
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Action</span>
                                        <span className="table-g-not-name"><Link to={`/admin/buyer-invoice-details/${invoice.invoice_id}`}>
                                            <div className='invoice-details-button-column'>
                                                <VisibilityOutlinedIcon className='invoice-view' />
                                            </div>
                                        </Link></span>
                                    </div>
                                </td>
                            </tr>
                        ))
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
    );
};

export default OrderInvoiceList;







