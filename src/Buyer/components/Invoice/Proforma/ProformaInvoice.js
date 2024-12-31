import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom';
import '../Pending/pendingInvoice.css';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import Pagination from "react-js-pagination";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Link, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import moment from 'moment/moment';


const ProformaInvoice = ({ invoiceList, currentPage, totalInvoices, invoicesPerPage, handlePageChange }) => {

    const navigate = useNavigate()

    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const iframeRef = useRef(null);

    const handleDownload = (orderId) => {
        const invoiceUrl = `/buyer/Proforma-Invoice-Details/${orderId}`;
        if (iframeRef.current) {

            iframeRef.current.src = invoiceUrl;
        }
    };

    useEffect(() => {
        const iframe = iframeRef.current;

        if (iframe) {
            const handleIframeLoad = () => {
                setTimeout(() => {
                    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                    const element = iframeDocument.getElementById('invoice-content');
                    if (element) {
                        const options = {
                            margin: 0.5,
                            filename: `proformaInvoice_${iframeDocument.title}.pdf`,
                            image: { type: 'jpeg', quality: 1.00 },
                            html2canvas: { scale: 2 },
                            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                        };

                        html2pdf().from(element).set(options).save();
                    } else {
                        console.error('Invoice content element not found');
                    }
                }, 500);
            };

            iframe.addEventListener('load', handleIframeLoad);

            return () => {
                iframe.removeEventListener('load', handleIframeLoad);
            };
        }
    }, []);


    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }
    }, [])

    return (
        <>
            <div className='pending-invo-container' >

                <div className='table-responsive mh-2 50'>
                    <table className="table table-theme table-row v-middle" style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                        {
                            <thead>
                                <tr>
                                    <th className="text-muted invoice-th">Invoice No.</th>
                                    <th className="text-muted invoice-th">PO Date</th>
                                    <th className="text-muted invoice-th">Order ID</th>
                                    <th className="text-muted invoice-th">Customer Name</th>
                                    <th className="text-muted invoice-th">Action</th>
                                </tr>
                            </thead>
                        }


                        {invoiceList && invoiceList.length > 0 ? (
                            invoiceList.map((invoice, i) => (
                                <tbody data-id="9" className='pending-invoies-tbody-section'>
                                    <tr className='table-row v-middle'>
                                        <td>
                                            <span className="item-title">{invoice.invoice_number || invoice.invoice_no}</span>
                                        </td>
                                        <td className="flex">
                                            <span className="item-title text-color">{moment(invoice?.created_at).format("DD/MM/YYYY")}</span>
                                        </td>
                                        <td>
                                            <span className="item-title">{invoice.order_id}</span>
                                        </td>
                                        <td>
                                            <span className="item-title">{invoice?.supplier?.supplier_name}</span>
                                        </td>

                                        <td>
                                            <div className='invoice-details-button-row'>
                                                <Link to={`/buyer/Proforma-Invoice-Details/${invoice.order_id}`}>
                                                    <div className='invoice-details-button-column'>
                                                        <VisibilityOutlinedIcon className='invoice-view' />
                                                    </div>
                                                </Link>
                                                <div className='invoice-details-button-column-download' onClick={() => handleDownload(invoice.order_id)}>
                                                    <CloudDownloadOutlinedIcon className='invoice-view' />
                                                </div>

                                                <iframe ref={iframeRef} style={{ display: 'none' }} title="invoice-download-iframe"></iframe>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ))
                        ) : (
                            <tbody>
                                <tr>
                                    <td colSpan="8">
                                        <div className='pending-products-no-orders'>
                                            No Proforma Invoices Available
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        )
                        }


                    </table>
                </div>
                <div className='pending-invoice-pagination-conatiner-section'>
                    <div className='pagi-container'>
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={invoicesPerPage}
                            totalItemsCount={totalInvoices || invoiceList.length}
                            pageRangeDisplayed={5}
                            onChange={handlePageChange}
                            itemClass="page-item"
                            linkClass="page-link"
                            prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                            nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                            hideFirstLastPages={true}
                        />
                        <div className='pagi-total'>
                            <div>Total Items: {totalInvoices || invoiceList.length}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProformaInvoice