import React, { useEffect, useState } from 'react';
import './invoiceDesign.css';
import html2pdf from 'html2pdf.js';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequests } from '../../../api';

function InvoiceDesign() {
    const { invoiceId } = useParams();
    const navigate = useNavigate();

    const [invoiceDetails, setInvoiceDetails] = useState(null);

    const handleDownload = () => {
        const element = document.getElementById('invoice-content');
        const options = {
            margin: 0.5,
            filename: 'invoice.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(element).set(options).save();
    };

    // Updated function to format address into "Address 1" and "Address 2"
    const formatAddress = (addressDetails, primaryAddress) => {
        const { company_reg_address, locality, land_mark, city, state, pincode, country } = addressDetails || {};
        const address1 = [primaryAddress || company_reg_address, locality]
            .filter(Boolean)
            .join(', ') || 'Address 1';
        const address2 = [land_mark,country, city, state, pincode]
            .filter(Boolean)
            .join(', ') || 'Address 2';
        return [address1, address2];
    };

    useEffect(() => {
        const fetchData = async () => {
            const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
            const supplierIdLocalStorage = localStorage?.getItem("supplier_id");

            if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
                localStorage?.clear();
                navigate("/supplier/login");
                return;
            }

            const obj = {
                invoice_id: invoiceId,
                supplier_id: supplierIdSessionStorage || supplierIdLocalStorage
            };

            const response = await apiRequests.getRequest(`invoice/get-specific-invoice-details/${invoiceId}`, obj);
            if (response?.code !== 200) {
                return;
            }
            setInvoiceDetails(response?.result);
        };
        fetchData();
    }, [invoiceId, navigate]);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== window?.location?.origin) return;

            if (event.data && event.data.type === "DOWNLOAD_INVOICE") {
                window.parent.postMessage({
                    type: "INVOICE_READY",
                    invoiceId: invoiceId
                }, window?.location?.origin);
            }
        };

        window.addEventListener('message', handleMessage);

        if (window.self !== window.top) {
            setTimeout(() => {
                window.parent.postMessage({
                    type: "INVOICE_READY",
                    invoiceId: invoiceId
                }, window?.location?.origin);
            }, 500);
        }

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [invoiceId]);

    // Format addresses to ensure "Address 1" and "Address 2"
    const supplierAddressLines = formatAddress(
        invoiceDetails?.supplier_registered_address,
        invoiceDetails?.supplier_address
    );
    const buyerAddressLines = formatAddress(
        invoiceDetails?.buyer_registered_address,
        invoiceDetails?.buyer_address
    );

    return (
        <div className='invoice-template-design'>
            <div className='scroll-wrapper'>
                <div className='invoice-template-download'>
                    <div className='invoice-template-button' onClick={handleDownload}>Download</div>
                </div>
                <div id='invoice-content'>
                    <div style={{
                        maxWidth: '800px',
                        margin: 'auto auto 10rem',
                        padding: '30px',
                        border: '1px solid #eee',
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: '#5e676f',
                        backgroundColor: '#FFFFFF',
                        boxShadow: "0 2px 5px -1px #32325d40, 0 1px 3px -1px #0000004d"
                    }}>
                        <div style={{ textAlign: 'center', fontWeight: '500', fontSize: '30px', margin: '0px 0px 20px 0px' }}>Invoice</div>
                        <table style={{ fontSize: '12px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #99a0ac' }}>
                                    <td style={{ display: 'flex', justifyContent: 'end' }}>
                                        <p style={{ fontSize: '16px', fontWeight: '500' }}>Invoice Number : </p>
                                        <p style={{ fontSize: '16px', fontWeight: '500' }}> {invoiceDetails?.invoice_no}</p>
                                    </td>
                                    <td style={{ display: 'flex', justifyContent: 'end', paddingBottom: '10px' }}>
                                        <p style={{ fontSize: '15px', fontWeight: '500' }}>Date : </p>
                                        <p style={{ fontSize: '15px', fontWeight: '500' }}> {invoiceDetails?.invoice_date}</p>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <table style={{ padding: '20px 16px', width: '100%', borderRadius: '12px', tableLayout: 'fixed', marginTop: '20px' }}>
                                            <tbody>
                                                <tr style={{ borderBottom: '1px solid #99a0ac' }}>
                                                    <td style={{ verticalAlign: 'top', width: '60%', paddingRight: '20px', paddingBottom: '20px' }}>
                                                        <h1 style={{ fontSize: '14px', fontWeight: 500, paddingBottom: '3px' }}>From:</h1>
                                                        <p style={{ fontSize: '16px', fontWeight: 500 }}>{invoiceDetails?.supplier_name}</p>
                                                        <p style={{ fontSize: '13px',  color: "#5e676f", }}>{supplierAddressLines[0]}</p>
                                                        <p style={{ fontSize: '13px',  color: "#5e676f", }}>{supplierAddressLines[1]}</p>
                                                        <td style={{ display: 'flex', justifyContent: 'start' }}>
                                                            <p style={{ fontSize: '13px',  color: "#5e676f", fontWeight: '500' }}>VAT Reg No:</p>
                                                            <p style={{ fontSize: '13px',  color: "#5e676f",}}>&nbsp;{invoiceDetails?.supplier_vat_reg_no}</p>
                                                        </td>
                                                    </td>
                                                    <td style={{ verticalAlign: 'top', width: '40%', paddingBottom: '20px' }}>
                                                        <h1 style={{ fontSize: '14px', fontWeight: 500, paddingBottom: '3px', textAlign: 'end' }}>To:</h1>
                                                        <p style={{ fontSize: '16px', fontWeight: 500, textAlign: 'end' }}>{invoiceDetails?.buyer_name}</p>
                                                        <p style={{ fontSize: '13px',  color: "#5e676f", textAlign: 'end' }}>{buyerAddressLines[0]}</p>
                                                        <p style={{ fontSize: '13px', color: "#5e676f", textAlign: 'end' }}>{buyerAddressLines[1]}</p>
                                                        <td style={{ display: 'flex', justifyContent: 'end' }}>
                                                            <p style={{ fontSize: '13px', fontWeight: '500',  color: "#5e676f", }}>VAT Reg No:</p>
                                                            <p style={{ fontSize: '13px',  color: "#5e676f",}}>&nbsp;{invoiceDetails?.buyer_vat_reg_no}</p>
                                                        </td>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="3">
                                                        <table style={{ width: '100%', borderSpacing: 0 }}>
                                                            <thead>
                                                                <tr style={{ textTransform: 'uppercase' }}>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px solid #99a0ac', width: '40px' }}>S.No</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px solid #99a0ac', width: '180px' }}>Product Name</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px solid #99a0ac', width: '40px' }}>Qty</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px solid #99a0ac', textAlign: 'end', width: '100px' }}>Price</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px solid #99a0ac', textAlign: 'end', width: '100px' }}>Unit Tax %</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px solid #99a0ac', textAlign: 'end', width: '120px' }}>Total</td>
                                                                </tr>
                                                            </thead>
                                                            {invoiceDetails?.items?.map((item, i) => (
                                                                <tbody key={i}>
                                                                    <tr>
                                                                        <td style={{ paddingBlock: '12px', display: 'flex', alignItems: 'baseline' }}>
                                                                            <p style={{ fontWeight: 500, fontSize: '14px' }}>{i + 1}.</p>
                                                                        </td>
                                                                        <td style={{ paddingBlock: '12px', verticalAlign: "baseline" }}>
                                                                            <p style={{ fontWeight: 500, fontSize: '14px', lineHeight: "20px" }}>{item.medicine_name}</p>
                                                                        </td>
                                                                        <td style={{ paddingBlock: '12px', verticalAlign: "baseline" }}>
                                                                            <p style={{ fontWeight: 500, fontSize: '13px' }}>{item?.quantity_required}</p>
                                                                        </td>
                                                                        <td style={{ paddingBlock: '12px', verticalAlign: "baseline", textAlign: 'end' }}>
                                                                            <p style={{ fontWeight: 500, fontSize: '13px' }}>{item.counter_price || item.target_price} USD</p>
                                                                        </td>
                                                                        <td style={{ paddingBlock: '12px', verticalAlign: "baseline", textAlign: 'end' }}>
                                                                            <p style={{ fontWeight: 500, fontSize: '13px' }}>{item.unit_tax}%</p>
                                                                        </td>
                                                                        <td style={{ paddingBlock: '12px', verticalAlign: "baseline", textAlign: 'end' }}>
                                                                            <p style={{ fontWeight: 500, fontSize: '13px' }}>{item.total_amount} USD</p>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            ))}
                                                        </table>
                                                        <table>
                                                            <tbody style={{ borderTop: '1px solid #99a0ac', borderBottom: '1px solid #99a0ac' }}>
                                                                <tr>
                                                                    <td style={{ verticalAlign: 'top', paddingBottom: '20px', width: '42%' }}>
                                                                        <h1 style={{ fontSize: '16px', fontWeight: '500', marginTop: '16px', textAlign: 'start' }}>Bank Details :</h1>
                                                                        <tr style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', paddingTop: '8px' }}>
                                                                            <p style={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>Bank Name :</p>
                                                                            <p style={{ fontSize: '14px',  color: "#5e676f", }}>{invoiceDetails?.bank_name}</p>
                                                                        </tr>
                                                                        <tr style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', paddingTop: '8px' }}>
                                                                            <p style={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>Account No :</p>
                                                                            <p style={{ fontSize: '14px',  color: "#5e676f", }}>{invoiceDetails?.account_number}</p>
                                                                        </tr>
                                                                        <tr style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', paddingTop: '6px' }}>
                                                                            <p style={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>Sort Code :</p>
                                                                            <p style={{ fontSize: '14px',  color: "#5e676f", }}>{invoiceDetails?.sort_code}</p>
                                                                        </tr>
                                                                    </td>
                                                                    <td style={{ width: '550px' }}>
                                                                        <table style={{ width: '100%', borderSpacing: 0 }}>
                                                                            <tbody>
                                                                                <tr style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: '10px', paddingTop: '6px' }}>
                                                                                    <p style={{ textAlign: 'end', fontSize: '14px', fontWeight: '500', paddingBottom: '10px' }}>Total Amount Payable :</p>
                                                                                    <p style={{ textAlign: 'end', fontWeight: '500', fontSize: '14px', paddingBottom: '10px', width: '100px' }}>{invoiceDetails?.total_payable_amount} USD</p>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tbody style={{ width: '100vw', Fournier: '1px solid #99a0ac' }}>
                                    <tr>
                                        <td style={{ verticalAlign: 'top', width: '100vw', paddingRight: '20px', paddingBottom: '20px' }}>
                                            <h1 style={{ fontSize: '16px', fontWeight: '500', marginTop: '16px' }}>Payment Terms :</h1>
                                            <div style={{ fontSize: '13px', fontWeight: '500', lineHeight: '20px', marginTop: '4px' }}>
                                                {invoiceDetails?.payment_terms?.map((term, i) => (
                                                    <p key={i} style={{ position: 'relative', paddingLeft: '20px' }}>
                                                        <span style={{ position: 'absolute', left: '0', top: '0', fontSize: '22px' }}>•</span>
                                                        {term}
                                                    </p>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvoiceDesign;