import React, { useState } from 'react';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Link } from 'react-router-dom';

const SellerActiveInvoiceList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    // Hardcoded data
    const invoiceData = [
        { invoice_no: '1254124125', order_id: '1478523698', buyer_name: 'Paramceutical Agency', total_payable_amount: '250 USD', invoice_status: 'Paid', invoice_id: '1' },
        { invoice_no: '2254124125', order_id: '2478523698', buyer_name: 'Medical Supplies Co.', total_payable_amount: '150 USD', invoice_status: 'Unpaid', invoice_id: '2' },
        { invoice_no: '3254124125', order_id: '3478523698', buyer_name: 'Global Pharma Ltd.', total_payable_amount: '500 USD', invoice_status: 'Paid', invoice_id: '3' },
        { invoice_no: '4254124125', order_id: '4478523698', buyer_name: 'Health Care Ltd.', total_payable_amount: '750 USD', invoice_status: 'Unpaid', invoice_id: '4' },
        { invoice_no: '5254124125', order_id: '5478523698', buyer_name: 'Pharma Inc.', total_payable_amount: '300 USD', invoice_status: 'Paid', invoice_id: '5' },
        { invoice_no: '6254124125', order_id: '6478523698', buyer_name: 'Medicorp', total_payable_amount: '450 USD', invoice_status: 'Unpaid', invoice_id: '6' },
        { invoice_no: '7254124125', order_id: '7478523698', buyer_name: 'Pharma Solutions', total_payable_amount: '600 USD', invoice_status: 'Paid', invoice_id: '7' },
    ];

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = invoiceData.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className='inquiry-invoice-list-main-container'>
                <div className="card-body">
                    <div>
                        <div className="table-assign-driver-heading">Invoice List</div>
                    </div>
                    <table className="table">
                        <tbody>
                            {currentOrders.map((invoice, i) => (
                                <tr key={i}>
                                    <td className='tables-td'>
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Invoice No.</span>
                                            <span className="table-g-not-names">{invoice.invoice_no}</span>
                                        </div>
                                    </td>
                                    <td className='tables-td-cont'>
                                        <div className="table-second-container">
                                            <div className="table-g-section-content">
                                                <span className="table-g-driver-name">Order ID</span>
                                                <span className="table-g-not-name">{invoice.order_id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='tables-td'>
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Buyer Name</span>
                                            <span className="table-g-not-name">{invoice.buyer_name}</span>
                                        </div>
                                    </td>
                                    <td className='tables-td'>
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Amount</span>
                                            <span className="table-g-not-name">{invoice.total_payable_amount}</span>
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
                                            <span className="table-g-not-name">
                                                <Link to={`/supplier/invoice-design/${invoice.invoice_id}`}>
                                                    <div className='invoice-details-button-column'>
                                                        <VisibilityOutlinedIcon className='invoice-view' />
                                                    </div>
                                                </Link>
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
                            totalItemsCount={invoiceData.length}
                            pageRangeDisplayed={5}
                            onChange={handlePageChange}
                            itemClass="page-item"
                            linkClass="page-link"
                            prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                            nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                            hideFirstLastPages={true}
                        />
                        <div className='pagi-total'>
                            <div>Total Items: {invoiceData.length}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SellerActiveInvoiceList;
