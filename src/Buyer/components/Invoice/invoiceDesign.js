import React, { useEffect, useState } from 'react';
import InvoiceCardDesign from './InvoiceCardDesign';
import './pay/invoiceDesign.css';
import html2pdf from 'html2pdf.js';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequests } from '../../../api';
import Loader from '../SharedComponents/Loader/Loader';

function InvoiceTemplate({ invoice }) {
    const { invoiceId } = useParams();
    const navigate = useNavigate();
    const [invoiceDetails, setInvoiceDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const obj = { invoice_id: invoiceId };
                const response = await apiRequests.getRequest(`invoice/get-specific-invoice-details/${invoiceId}`, obj);
                
                if (response?.code !== 200) {
                    console.error('Error fetching invoice details:', response);
                    return;
                }
                
                setInvoiceDetails(response?.result);
            } catch (error) {
                console.error('Exception in fetching invoice details:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [invoiceId]);
    
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

    if (loading) {
        return <Loader />;
    }

    // Construct two-line addresses for buyer and supplier
    const buyerAddressLine1 = [
        invoiceDetails?.buyer_registered_address?.company_reg_address,
        invoiceDetails?.buyer_registered_address?.locality,
        invoiceDetails?.buyer_registered_address?.land_mark
    ].filter(Boolean).join(', ');
    
    const buyerAddressLine2 = [
         invoiceDetails?.buyer_registered_address?.country,
         invoiceDetails?.buyer_registered_address?.state,
        invoiceDetails?.buyer_registered_address?.city,
        invoiceDetails?.buyer_registered_address?.pincode
    ].filter(Boolean).join(', ');

    const supplierAddressLine1 = [
        invoiceDetails?.supplier_registered_address?.company_reg_address,
        invoiceDetails?.supplier_registered_address?.locality,
        invoiceDetails?.supplier_registered_address?.land_mark
    ].filter(Boolean).join(', ');
    
    const supplierAddressLine2 = [
      
        invoiceDetails?.supplier_registered_address?.country,
          invoiceDetails?.supplier_registered_address?.state,
        invoiceDetails?.supplier_registered_address?.city,
        
        invoiceDetails?.supplier_registered_address?.pincode
    ].filter(Boolean).join(', ');

    return (
        <div className='invoice-template-design'>
            <div className='scroll-wrapper'>
                <div className='invoice-template-download'>
                    <div className='invoice-template-button' onClick={handleDownload}>Download</div>
                </div>
                <div id='invoice-content'>
                    <div 
                        style={{
                            maxWidth: '800px',
                            margin: 'auto', 
                            padding: '30px', 
                            border: '1px solid #eee', 
                            fontSize: '16px', 
                            lineHeight: '24px', 
                            color: '#212121', 
                            backgroundColor: '#FFFFFF',
                            boxShadow: "0 2px 5px -1px #32325d40, 0 1px 3px -1px #0000004d"
                        }}
                    >
                        <div style={{ textAlign: 'center', fontWeight: '500', fontSize: '30px', margin: '0px 0px 20px 0px' }}>Invoice</div>
                        <table style={{ fontSize: '12px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #616161' }}>
                                    <td style={{ display: 'flex', justifyContent: 'end' }}>
                                        <p style={{ fontSize: '16px', fontWeight: '500' }}>Invoice Number : </p>
                                        <p style={{ fontSize: '16px', fontWeight: '500' }}> {invoiceDetails?.invoice_no}</p>
                                    </td>
                                    <td style={{ display: 'flex', justifyContent: 'end', paddingBottom: '10px' }}>
                                        <p style={{ fontSize: '15px', fontWeight: '500' }}>Date : </p>
                                        <p style={{ fontSize: '15px', fontWeight: '500' }}> {invoiceDetails?.invoice_date}</p>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <table style={{ padding: '20px 16px', width: '100%', borderRadius: '12px', tableLayout: 'fixed', marginTop: '20px' }}>
                                            <tbody>
                                                <tr style={{ borderBottom: '1px solid #616161' }}>
                                                    <td style={{ verticalAlign: 'top', width: '50%', paddingRight: '10px', paddingBottom: '20px' }}>
                                                        <h1 style={{ fontSize: '14px', fontWeight: 500, paddingBottom: '3px' }}>From :</h1>
                                                        <p style={{ fontSize: '16px', fontWeight: 500 }}>{invoiceDetails?.supplier_name}</p>
                                                        <p style={{ fontSize: '13px', color: "#616161", fontWeight: 500 }}>{supplierAddressLine1}</p>
                                                        <p style={{ fontSize: '13px', color: "#616161", fontWeight: 500 }}>{supplierAddressLine2}</p>
                                                        <div style={{ display: 'flex', justifyContent: 'start' }}>
                                                            <p style={{ fontSize: '13px', color: "#616161", fontWeight: 500 }}>VAT Reg No :</p>
                                                            <p style={{ fontSize: '13px', color: "#616161", fontWeight: 500 }}> {invoiceDetails?.supplier_vat_reg_no}</p>
                                                        </div>
                                                    </td>
                                                    <td style={{ verticalAlign: 'top', width: '50%', paddingBottom: '20px', paddingLeft:'10px' }}>
                                                        <h1 style={{ fontSize: '14px', fontWeight: 500, paddingBottom: '3px', textAlign: 'end' }}>To :</h1>
                                                        <p style={{ fontSize: '16px', fontWeight: 500, textAlign: 'end' }}>{invoiceDetails?.buyer_name}</p>
                                                        <p style={{ fontSize: '13px', fontWeight: 500, color: "#616161", textAlign: 'end' }}>{buyerAddressLine1}</p>
                                                        <p style={{ fontSize: '13px', fontWeight: 500, color: "#616161", textAlign: 'end' }}>{buyerAddressLine2}</p>
                                                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                                                            <p style={{ fontSize: '13px', color: "#616161", fontWeight: 500 }}>VAT Reg No :</p>
                                                            <p style={{ fontSize: '13px', color: "#616161", fontWeight: 500 }}> {invoiceDetails?.buyer_vat_reg_no}</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="3">
                                                        <table style={{ width: '100%', borderSpacing: 0 }}>
                                                            <thead>
                                                                <tr style={{ textTransform: 'uppercase' }}>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px solid #616161', width: '40px' }}>S.No</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px solid #616161', width: '180px' }}>Description</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px solid #616161', width: '40px' }}>Qty</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px solid #616161', textAlign: 'end', width: '100px' }}>Price</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px solid #616161', textAlign: 'end', width: '100px' }}>Unit Tax %</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px solid #616161', textAlign: 'end', width: '120px' }}>Total</td>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {(invoiceDetails && invoiceDetails?.items && invoiceDetails?.items?.length) ?
                                                                    invoiceDetails?.items?.map((item, i) => {
                                                                        const totalPrice = item?.quantity_required * item?.unit_price;
                                                                        subtotal += totalPrice;
                                                                        vatAmount = subtotal * (item?.unit_tax / 100);
                                                                        return (
                                                                            <tr key={`invoice-item-${i}`}>
                                                                                <td style={{ paddingBlock: '12px', display: 'flex', alignItems: 'baseline', verticalAlign: 'baseline' }}>
                                                                                    <p style={{ fontWeight: 500, fontSize: '14px' }}>{i + 1}.</p>
                                                                                </td>
                                                                                <td style={{ paddingBlock: '12px', verticalAlign: 'baseline' }}>
                                                                                    <p style={{ fontWeight: 500, fontSize: '14px', lineHeight: "20px" }}>{item.medicine_name}</p>
                                                                                </td>
                                                                                <td style={{ paddingBlock: '12px', verticalAlign: 'baseline' }}>
                                                                                    <p style={{ fontWeight: 500, fontSize: '13px' }}>{item?.quantity_required}</p>
                                                                                </td>
                                                                                <td style={{ paddingBlock: '12px', textAlign: 'end', verticalAlign: 'baseline' }}>
                                                                                    <p style={{ fontWeight: 500, fontSize: '13px' }}>{item.unit_price || item.target_price} USD</p>
                                                                                </td>
                                                                                <td style={{ paddingBlock: '12px', textAlign: 'end', verticalAlign: 'baseline' }}>
                                                                                    <p style={{ fontWeight: 500, fontSize: '13px' }}>{item.unit_tax}%</p>
                                                                                </td>
                                                                                <td style={{ paddingBlock: '12px', textAlign: 'end', verticalAlign: 'baseline' }}>
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
                                                        <table>
                                                            <tbody style={{ borderTop: '1px solid #616161', borderBottom: '1px solid #616161' }}>
                                                                <tr>
                                                                    <td style={{ verticalAlign: 'top', paddingBottom: '20px', width: '42%' }}>
                                                                        <h1 style={{ fontSize: '16px', fontWeight: '500', marginTop: '16px', textAlign: 'start' }}>Bank Details :</h1>
                                                                        <tr style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', paddingTop: '8px' }}>
                                                                            <p style={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>Bank Name :</p>
                                                                            <p style={{ fontSize: '14px', color: "#616161", fontWeight: '500' }}>{invoiceDetails?.bank_name}</p>
                                                                        </tr>
                                                                        <tr style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', paddingTop: '8px' }}>
                                                                            <p style={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>Account No :</p>
                                                                            <p style={{ fontSize: '14px', color: "#616161", fontWeight: '500' }}>{invoiceDetails?.account_number}</p>
                                                                        </tr>
                                                                        <tr style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', paddingTop: '6px' }}>
                                                                            <p style={{ fontSize: '14px', fontWeight: '500', height: '100px' }}>Sort Code :</p>
                                                                            <p style={{ fontSize: '14px', color: "#616161", fontWeight: '500' }}>{invoiceDetails?.sort_code}</p>
                                                                        </tr>
                                                                    </td>
                                                                    <td style={{ width: '550px' }}>
                                                                        <table style={{ width: '100%', borderSpacing: 0 }}>
                                                                            <tbody>
                                                                                <tr style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: '10px', paddingTop: '6px' }}>
                                                                                    <p style={{ textAlign: 'end', fontSize: '14px', fontWeight: '500', paddingBottom: '10px' }}>Total Amount Payable :</p>
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
                            <tfoot>
                                <tr>
                                    <td style={{ verticalAlign: 'top', width: '100%', paddingBottom: '20px', borderBottom: '1px solid #616161' }}>
                                        <h1 style={{ fontSize: '16px', fontWeight: '500', marginTop: '16px' }}>Payment Terms :</h1>
                                        <div style={{ fontSize: '13px', fontWeight: 500, lineHeight: '20px', color: "#616161", marginTop: '4px' }}>
                                            {invoiceDetails?.payment_terms?.map((term, i) => (
                                                <p key={`term-${i}`} style={{ position: 'relative', paddingLeft: '20px' }}>
                                                    <span style={{ position: 'absolute', left: '0', top: '0', fontSize: '22px' }}>•</span>
                                                    {term}
                                                </p>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    {invoiceDetails?.invoice_status === 'paid' && (
                        <div className='invoice-card-section-design'>
                            <InvoiceCardDesign invoiceDetails={invoiceDetails} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

InvoiceTemplate.displayName = 'InvoiceTemplate';
export default InvoiceTemplate;