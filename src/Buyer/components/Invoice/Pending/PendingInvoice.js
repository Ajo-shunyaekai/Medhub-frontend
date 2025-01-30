import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import './pendingInvoice.css';
import Pagination from "react-js-pagination";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import PayModal from '../pay/PayModal';
import html2pdf from 'html2pdf.js';


const PendingInvoice = ({ invoiceList, currentPage, totalInvoices, invoicesPerPage, handlePageChange, socket }) => {

    const navigate = useNavigate()

    const [selectedInvoiceId, setSelectedInvoiceId] = useState()
    const [selectedOrderId, setSelectedOrderId] = useState()

    const [showModal, setShowModal] = useState(false);

    const handleModal = (invoiceId, orderId) => {
        setSelectedInvoiceId(invoiceId)
        setSelectedOrderId(orderId)
        setShowModal(true)
    };
    const handleCloseModal = () => setShowModal(false);


    const iframeRef = useRef(null);

    const handleDownload = (invoiceId) => {
        const invoiceUrl = `/buyer/invoice-design/${invoiceId}`;
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
                            filename: `invoice_${iframeDocument.title}.pdf`,
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
        <div className='pending-invo-container' >
            <div className='table-responsive mh-2 50'>
                <table className="table table-theme table-row v-middle" style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                    {
                        <thead>
                            <tr>
                                <th className="text-muted invoice-th">Invoice No.</th>
                                <th className="text-muted invoice-th">Order ID</th>
                                <th className="text-muted invoice-th">Customer Name</th>
                                <th className="text-muted invoice-th">Amount</th>
                                <th className="text-muted invoice-th">Status</th>
                                <th className="text-muted invoice-th">Action</th>
                            </tr>
                        </thead>
                    }


                    {
                        invoiceList && invoiceList.length > 0 ? (
                            invoiceList?.map((invoice, i) => {
                                return (
                                    <tbody className='pending-invoies-tbody-section' data-id="9">
                                        <tr className='table-row v-middle'>
                                            <td>
                                                <span className="item-title">{invoice.invoice_no}</span>
                                            </td>
                                            <td>
                                                <span className="item-title">{invoice.order_id}</span>
                                            </td>
                                            <td>
                                                <div className="mx-0">
                                                    <span className="item-title text-color">{invoice?.supplier_name}</span>
                                                </div>
                                            </td>

                                            <td className="flex">
                                                <span className="item-title text-color">{invoice.total_payable_amount} USD</span>
                                            </td>
                                            <td className="flex">
                                                <span className="item-title text-color">{invoice.status?.charAt(0).toUpperCase() + invoice?.status?.slice(1)}</span>
                                            </td>
                                            <td className='pending-invoices-td'>
                                                <div className='invoice-details-button-row'>
                                                    <div className='invoice-details-button-column-pay' onClick={() => { handleModal(invoice.invoice_id, invoice.order_id) }}>
                                                        <span
                                                            className='invoices-details-button-pay'
                                                            variant="primary"

                                                        >
                                                            Pay
                                                        </span>
                                                    </div>

                                                    <PayModal
                                                        showModal={showModal}
                                                        handleClose={handleCloseModal}
                                                        invoiceId={selectedInvoiceId}
                                                        orderId={selectedOrderId}
                                                        buyerId={invoice.buyer_id}
                                                        supplierId={invoice.supplier_id}
                                                       socket      = {socket}
                                                    />
                                                    <Link to={`/buyer/invoice-design/${invoice.invoice_id}`}>
                                                        <div className='invoice-details-button-column'>
                                                            <VisibilityOutlinedIcon className='invoice-view' />
                                                        </div>
                                                    </Link>
                                                    <div className='invoice-details-button-column-download' onClick={() => handleDownload(invoice.invoice_id)}>
                                                        <CloudDownloadOutlinedIcon className='invoice-view' />
                                                    </div>
                                                    <iframe ref={iframeRef} style={{ display: 'none' }} title="invoice-download-iframe"></iframe>

                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                )
                            })
                        ) : (
                            <tbody>
                                <tr>
                                    <td colSpan="8">
                                        <div className='pending-products-no-orders'>
                                            No Pending Invoices Available
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        )
                    }
                </table>
            </div>
            <div className='pending-invoice-pagination-conatiner-section'>
                {invoiceList && invoiceList.length > 0 && (
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
                )}
            </div>

        </div>
    )
}

export default PendingInvoice
