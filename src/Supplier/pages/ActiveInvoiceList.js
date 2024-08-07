import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../../style/pendingInvoice.css';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import html2pdf from 'html2pdf.js';
import InvoiceDesign from './invoice/InvoiceDesign';


const ActiveInvoiceList = ({ invoiceList, currentPage, totalInvoices, invoicesPerPage, handlePageChange }) => {

    const invoiceListt = [
        {
            invoice_no: "1236547485",
            order_id: "125436",
            customer_name: "Samiksha",
            amount: "420",
            payment_type: "Cash",
            order_status: "Paid",
        },
        {
            invoice_no: "1236547485",
            order_id: "125436",
            customer_name: "Samiksha",
            amount: "420",
            payment_type: "Cash",
            order_status: "Paid",
        },
        {
            invoice_no: "1236547485",
            order_id: "125436",
            customer_name: "Samiksha",
            amount: "420",
            payment_type: "Cash",
            order_status: "Paid",
        },
        {
            invoice_no: "1236547485",
            order_id: "125436",
            customer_name: "Samiksha",
            amount: "420",
            payment_type: "Cash",
            order_status: "Paid",
        },
    ];

    const handleDownload = (invoice) => {
        const element = document.createElement('div');
        document.body.appendChild(element);

        // Render the InvoiceTemplate with the given invoice data
        ReactDOM.render(<InvoiceDesign invoice={invoice} />, element);

        // Set options for html2pdf
        const options = {
            margin: 0.5,
            filename: `invoice_${invoice.invoice_number}.pdf`,
            image: { type: 'jpeg', quality: 1.00 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Generate PDF
        html2pdf().from(document.getElementById('invoice-content')).set(options).save().then(() => {
            // Clean up the temporary container
            ReactDOM.unmountComponentAtNode(element);
            document.body.removeChild(element);
        });
    };

    return (
        <>
            <Link to='/supplier/create-invoice'>
                <div className='active-invoice-list-button-section'>
                    <div className='active-invoice-list'>Generate Invoice</div>
                </div>
            </Link>
            <div className='pending-invo-container'>
                <div className='table-responsive mh-2 50'>
                    <table className="table table-theme table-row v-middle" style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                        <thead>
                            <tr>
                                <th className="text-muted invoice-th">Invoice No.</th>
                                <th className="text-muted invoice-th">Order ID</th>
                                <th className="text-muted invoice-th">Customer Name</th>
                                <th className="text-muted invoice-th">Amount</th>
                                <th className="text-muted invoice-th">Payment Type</th>
                                <th className="text-muted invoice-th">Status</th>
                                <th className="text-muted invoice-th">Action</th>
                            </tr>
                        </thead>

                        {
                            invoiceList && invoiceList.length > 0 ? (
                                invoiceList?.map((invoice, i) => {
                                    return (
                                        <tbody className='pending-invoices-tbody-section' key={i} data-id="9" >
                                            <tr className='table-row v-middle'>
                                                <td>
                                                    <span className="item-title">{invoice.invoice_number}</span>
                                                </td>
                                                <td>
                                                    <span className="item-title">{invoice.order_id}</span>
                                                </td>
                                                <td>
                                                    <div className="mx-0">
                                                        <span className="item-title text-color">{invoice.customer_name}</span>
                                                    </div>
                                                </td>
                                                <td className="flex">
                                                    <span className="item-title text-color">{invoice.amount} AED</span>
                                                </td>
                                                <td className="flex">
                                                    <span className="item-title text-color">{invoice.payment_type}</span>
                                                </td>
                                                <td className="flex">
                                                    <span className="item-title text-color">{invoice.order_status}</span>
                                                </td>
                                                <td className='pending-invoices-td'>
                                                    <div className='invoice-details-button-row'>
                                                        <Link to='/supplier/invoice-design'>
                                                            <div className='invoice-details-button-column'>
                                                                <VisibilityOutlinedIcon className='invoice-view' />
                                                            </div>
                                                        </Link>
                                                        <div className='invoice-details-button-column-download' onClick={() => handleDownload(invoice.order_id)}>
                                                            <CloudDownloadOutlinedIcon className='invoice-view' />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                        </tbody>
                                    )
                                })
                            ) : (
                                <>
                                    {
                                        invoiceListt.map((invoice, i) => (
                                            <tbody className='pending-invoices-tbody-section' key={i} data-id="9" >
                                                <tr className='table-row v-middle'>
                                                    <td>
                                                        <span className="item-title">{invoice.invoice_number}</span>
                                                    </td>
                                                    <td>
                                                        <span className="item-title">{invoice.order_id}</span>
                                                    </td>
                                                    <td>
                                                        <div className="mx-0">
                                                            <span className="item-title text-color">{invoice.customer_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="flex">
                                                        <span className="item-title text-color">{invoice.amount} AED</span>
                                                    </td>
                                                    <td className="flex">
                                                        <span className="item-title text-color">{invoice.payment_type}</span>
                                                    </td>
                                                    <td className="flex">
                                                        <span className="item-title text-color">{invoice.order_status}</span>
                                                    </td>
                                                    <td className='pending-invoices-td'>
                                                        <div className='invoice-details-button-row'>
                                                            <Link to='/supplier/invoice-design'>
                                                                <div className='invoice-details-button-column'>
                                                                    <VisibilityOutlinedIcon className='invoice-view' />
                                                                </div>
                                                            </Link>
                                                            <div className='invoice-details-button-column-download' onClick={() => handleDownload(invoice.order_id)}>
                                                                <CloudDownloadOutlinedIcon className='invoice-view' />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>

                                            </tbody>
                                        ))
                                    }
                                </>
                            )
                        }
                    </table>
                </div>
                <div className='pending-invoice-pagination-conatiner-section'>
                    <div className='pagi-container'>
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={invoicesPerPage}
                            totalItemsCount={totalInvoices || invoiceListt.length}
                            pageRangeDisplayed={5}
                            onChange={handlePageChange}
                            itemClass="page-item"
                            linkClass="page-link"
                            prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                            nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                            hideFirstLastPages={true}
                        />
                        <div className='pagi-total'>
                            <div>Total Items: {totalInvoices || invoiceListt.length}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ActiveInvoiceList;