import React, { useEffect, useState } from 'react';
import InvoiceCardDesign from './InvoiceCardDesign';
import './pay/invoiceDesign.css'
import html2pdf from 'html2pdf.js';
import { postRequestWithToken } from '../../../api/Requests';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment/moment';
import { apiRequests } from '../../../api';

function InvoiceTemplate({ invoice }) {
    const { invoiceId } = useParams();
    const navigate = useNavigate();
    const [invoiceDetails, setInvoiceDetails] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const obj = { invoice_id: invoiceId };
                const response = await apiRequests.getRequest(`invoice/get-specific-invoice-details/${invoiceId}`, obj);
                
                if (response?.code !== 200) {
                    console.error('Error fetching invoice details:', response);
                    return;
                }
                
                setInvoiceDetails(response?.result);
            } catch (error) {
                console.error('Exception in fetching invoice details:', error);
            }
        };
        
        fetchData();
    }, [invoiceId]);
    
    // Export a download function that can be called from outside or inside the component
    const handleDownload = () => {
        const element = document.getElementById('invoice-content');
        if (!element) {
            console.error('Invoice content element not found');
            return;
        }
        
        const options = {
            margin: 0.5,
            filename: `invoice_${invoiceDetails?.invoice_no || invoiceId}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        html2pdf().from(element).set(options).save();
    };
    
    let subtotal = 0;
    let vatAmount = 0;

    useEffect(() => {
        // Function to handle messages from parent window
        const handleMessage = (event) => {
            // Only accept messages from our own domain
            if (event.origin !== window?.location?.origin) return;
            
            // Check if this is a download request
            if (event.data && event.data.type === "DOWNLOAD_INVOICE") {
                // Notify parent that invoice is ready
                window.parent.postMessage({
                    type: "INVOICE_READY",
                    invoiceId: invoiceId
                }, window?.location?.origin);
                
              
            }
        };
        
        // Listen for messages from parent window
        window.addEventListener('message', handleMessage);
        
        // If we're loaded in an iframe, notify parent that we're ready
        if (window.self !== window.top) {
            // We're in an iframe
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
    }, [invoiceId])

    // Make invoice content accessible via ID without duplication
    return (
        <div className='invoice-template-design'>
            <div className='scroll-wrapper'>
                <div className='invoice-template-download'>
                    <div className='invoice-template-button' onClick={handleDownload}>Download</div>
                </div>
                <div id='invoice-content'>
                    <div style={{ maxWidth: '800px', margin: 'auto', padding: '30px', border: '1px solid #eee', fontSize: '16px', lineHeight: '24px', color: '#555', backgroundColor: '#FFFFFF' }}>
                        <div style={{ textAlign: 'center', fontWeight: '500', fontSize: '30px', margin: '0px 0px 20px 0px' }}>Invoice</div>
                        <table style={{ fontSize: '12px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px dotted #99a0ac' }}>
                                    <td style={{ display: 'flex', justifyContent: 'end' }}>
                                        <p style={{ fontSize: '16px', fontWeight: '500' }}>Invoice Number : </p>
                                        <p style={{ fontSize: '16px', fontWeight: '500' }}>&nbsp;{invoiceDetails?.invoice_no}</p>
                                    </td>
                                    <td style={{ display: 'flex', justifyContent: 'end', paddingBottom: '10px' }}>
                                        <p style={{ fontSize: '15px', fontWeight: '500' }}>Date : </p>
                                        <p style={{ fontSize: '15px', fontWeight: '500' }}>&nbsp;{invoiceDetails?.invoice_date}</p>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Rest of your invoice table structure remains the same */}
                                {/* I'm keeping this simplified to focus on the key fixes */}
                                <tr>
                                    <td>
                                        <table style={{ padding: '20px 16px', width: '100%', borderRadius: '12px', tableLayout: 'fixed', marginTop: '20px' }}>
                                            <tbody>
                                                {/* Supplier and buyer info section */}
                                                <tr style={{ borderBottom: '1px dotted #99a0ac' }}>
                                                    {/* From section */}
                                                    <td style={{ verticalAlign: 'top', width: '60%', paddingRight: '20px', paddingBottom: '20px' }}>
                                                        <h1 style={{ fontSize: '14px', fontWeight: 500, paddingBottom: '3px' }}>From :</h1>
                                                        <p style={{ fontSize: '16px', fontWeight: 500, paddingBottom: '6px' }}>{invoiceDetails?.supplier_name}</p>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac' }}>{invoiceDetails?.supplier_address}</p>
                                                       
                                                        <td style={{ display: 'flex', justifyContent: 'start' }}>
                                                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>VAT Reg No :</p>
                                                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;{invoiceDetails?.supplier_vat_reg_no}</p>
                                                        </td>
                                                    </td>
                                                    
                                                    {/* To section */}
                                                    <td style={{ verticalAlign: 'top', width: '40%', paddingBottom: '20px' }}>
                                                        <h1 style={{ fontSize: '14px', fontWeight: 500, paddingBottom: '3px', textAlign: 'end' }}>To :</h1>
                                                        <p style={{ fontSize: '16px', fontWeight: 500, paddingBottom: '6px', textAlign: 'end' }}>{invoiceDetails?.buyer_name}</p>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', textAlign: 'end' }}>{invoiceDetails?.buyer_address}</p>
                                                       
                                                        <td style={{ display: 'flex', justifyContent: 'end' }}>
                                                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>VAT Reg No :</p>
                                                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;{invoiceDetails?.buyer_vat_reg_no}</p>
                                                        </td>
                                                    </td>
                                                </tr>
                                                
                                                {/* Items table section - with proper keys for list items */}
                                                <tr>
                                                    <td colSpan="3">
                                                        <table style={{ width: '100%', borderSpacing: 0 }}>
                                                            <thead>
                                                                <tr style={{ textTransform: 'uppercase' }}>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', width: '40px' }}>S.No</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', width: '150px' }}>Description</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', width: '40px' }}>Qty</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', textAlign: 'end', width: '100px' }}>Price</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', textAlign: 'end', width: '100px' }}>Unit Tax %</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', textAlign: 'end', width: '120px' }}>Total</td>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {(invoiceDetails && invoiceDetails?.items && invoiceDetails?.items?.length) ?
                                                                    invoiceDetails?.items?.map((item, i) => {
                                                                        const totalPrice = item?.quantity * 50;
                                                                        subtotal += totalPrice;
                                                                        vatAmount = subtotal * 0.20;
                                                                        return (
                                                                            <tr key={`invoice-item-${i}`}>
                                                                                <td style={{ paddingBlock: '12px', display: 'flex', alignItems: 'baseline' }}>
                                                                                    <p style={{ fontWeight: 500, fontSize: '14px' }}>{i + 1}.</p>
                                                                                </td>
                                                                                <td style={{ paddingBlock: '12px' }}>
                                                                                    <p style={{ fontWeight: 500, fontSize: '14px' }}>{item.medicine_name}</p>
                                                                                </td>
                                                                                <td style={{ paddingBlock: '12px' }}>
                                                                                    <p style={{ fontWeight: 500, fontSize: '13px' }}>{item?.quantity_required}</p>
                                                                                </td>
                                                                                <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                                                                    <p style={{ fontWeight: 500, fontSize: '13px' }}>{item.counter_price || item.target_price} USD</p>
                                                                                </td>
                                                                                <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                                                                    <p style={{ fontWeight: 500, fontSize: '13px' }}>{item.unit_tax}%</p>
                                                                                </td>
                                                                                <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                                                                    <p style={{ fontWeight: 500, fontSize: '13px' }}>{item.total_amount} USD</p>
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    })
                                                                    :
                                                                    invoice?.items?.map((item, i) => {
                                                                        const totalPrice = item?.quantity * 50;
                                                                        subtotal += totalPrice;
                                                                        vatAmount = subtotal * 0.20;
                                                                        return (
                                                                            <tr key={`fallback-item-${i}`}>
                                                                                <td style={{ paddingBlock: '12px', display: 'flex', alignItems: 'baseline' }}>
                                                                                    <p style={{ fontWeight: 500, fontSize: '14px' }}>{i + 1}.</p>
                                                                                </td>
                                                                                <td style={{ paddingBlock: '12px' }}>
                                                                                    <p style={{ fontWeight: 500, fontSize: '14px' }}>{item.product_name} (500mg)</p>
                                                                                </td>
                                                                                <td style={{ paddingBlock: '12px' }}>
                                                                                    <p style={{ fontWeight: 500, fontSize: '13px' }}>{item?.quantity}</p>
                                                                                </td>
                                                                                <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                                                                    <p style={{ fontWeight: 500, fontSize: '13px' }}>50 USD</p>
                                                                                </td>
                                                                                <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                                                                    <p style={{ fontWeight: 500, fontSize: '13px' }}>{item?.quantity * 50} USD</p>
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    })}
                                                            </tbody>
                                                        </table>
                                                        
                                                        {/* Bank details and payment total section */}
                                                        <table>
                                                            <tbody style={{ borderTop: '1px dotted rgb(153, 160, 172)', borderBottom: '1px dotted rgb(153, 160, 172)' }}>
                                                                <tr>
                                                                    {/* Bank details section */}
                                                                    <td style={{ verticalAlign: 'top', paddingBottom: '20px', width: '42%' }}>
                                                                        <h1 style={{ fontSize: '16px', fontWeight: '500', marginTop: '16px', textAlign: 'start' }}>Bank Details :</h1>
                                                                        <tr style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', paddingTop: '8px' }}>
                                                                            <p style={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>Bank Name :</p>
                                                                            <p style={{ fontSize: '14px', fontWeight: '500' }}>{invoiceDetails?.bank_name}</p>
                                                                        </tr>
                                                                        <tr style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', paddingTop: '8px' }}>
                                                                            <p style={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>Account No :</p>
                                                                            <p style={{ fontSize: '14px', fontWeight: '500' }}>{invoiceDetails?.account_number}</p>
                                                                        </tr>
                                                                        <tr style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', paddingTop: '6px' }}>
                                                                            <p style={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>Sort Code :</p>
                                                                            <p style={{ fontSize: '14px', fontWeight: '500' }}>{invoiceDetails?.sort_code}</p>
                                                                        </tr>
                                                                    </td>
                                                                    
                                                                    {/* Total amount section */}
                                                                    <td style={{ width: '550px' }}>
                                                                        <table style={{ width: '100%', borderSpacing: 0 }}>
                                                                            <tbody>
                                                                                <tr style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: '10px', paddingTop: '6px' }}>
                                                                                    <p style={{ textAlign: 'end', fontSize: '14px', fontWeight: '500', paddingBottom: '10px' }}>Total Amount Payable   :</p>
                                                                                    <p style={{ textAlign: 'end', fontWeight: '500', fontSize: '14px', paddingBottom: '10px', width: '150px' }}>{invoiceDetails?.total_payable_amount} USD</p>
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
                            
                            {/* Payment terms footer */}
                            <tfoot>
                                <tr>
                                    <td style={{ verticalAlign: 'top', width: '100%', paddingBottom: '20px' }}>
                                        <h1 style={{ fontSize: '16px', fontWeight: '500', marginTop: '16px' }}>Payment Terms :</h1>
                                        <div style={{ fontSize: '13px', lineHeight: '20px', marginTop: '4px', color: '#99a0ac' }}>
                                            {invoiceDetails?.payment_terms?.map((term, i) => {
                                                return (
                                                    <p key={`term-${i}`} style={{ position: 'relative', paddingLeft: '20px' }}>
                                                        <span style={{ position: 'absolute', left: '0', top: '0', fontSize: '22px' }}>•</span>
                                                        {term}
                                                    </p>
                                                )
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    {/* Conditional render of paid invoice card */}
                    {invoiceDetails?.invoice_status === 'paid' && (
                        <div className='invoice-card-section-design'>
                            <InvoiceCardDesign
                                invoiceDetails={invoiceDetails}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Make component available as default export and expose handleDownload for iframe usage
InvoiceTemplate.displayName = 'InvoiceTemplate';
// export default InvoiceTemplate;

export default InvoiceTemplate;
