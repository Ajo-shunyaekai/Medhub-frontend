import React, { useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { useNavigate, useParams} from 'react-router-dom';
import moment from 'moment/moment';
import { postRequestWithToken } from '../../../api/Requests';
import { apiRequests } from '../../../../api';


function BuyerInvoiceDetails() {
    const {invoiceId} = useParams()
    const navigate    = useNavigate();
 
    const adminIdSessionStorage = localStorage?.getItem("admin_id");
    const adminIdLocalStorage   = localStorage?.getItem("admin_id");
 
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
        html2pdf().from(element).set(options).save()
    };
 
    useEffect(() => {
        const fetchData= async ()=> {
            if (!adminIdSessionStorage && !adminIdLocalStorage) {
                localStorage?.clear();
                navigate("/admin/login");
                return;
            }
    
            const obj = {
                invoice_id    : invoiceId,
                admin_id  : adminIdSessionStorage || adminIdLocalStorage,
            };
    
            try {
                const response = await apiRequests.getRequest(`invoice/get-specific-invoice-details/${obj?.invoice_id}`, obj);
                if (response?.code !== 200) {
                    return;
                }
                setInvoiceDetails(response.result);
               
            } catch (error) {
            }
        }
        fetchData()
    }, [invoiceId, navigate]);

    return (
        <div className='invoice-template-design'>
            <div className='scroll-wrapper'>
                <div className='invoice-template-download'>
                    <div className='invoice-template-button'  onClick={handleDownload}>Download</div>
                </div>
                <div id='invoice-content'>
                    <div style={{ maxWidth: '800px',
                         margin: 'auto auto 10rem', 
                         padding: '30px', 
                         border: '1px solid #eee', 
                         fontSize: '16px', 
                         lineHeight: '24px', 
                         color: '#212121',
                         boxShadow:"0 2px 5px -1px #32325d40, 0 1px 3px -1px #0000004d", 
                         backgroundColor: '#FFFFFF' }}>
                        <div style={{ textAlign: 'center', fontWeight: '500', fontSize: '30px', margin: '0px 0px 20px 0px' }}>Invoice</div>
                        <table style={{ fontSize: '12px' }}>
                            <thead>
                                <tr style={{ borderBottom: ' 1px solid #616161' }}>
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
                                <tr>
                                    <td>
                                        <table style={{ padding: '20px 16px', width: '100%', borderRadius: '12px', tableLayout: 'fixed', marginTop: '20px' }}>
                                            <tbody>
                                                <tr style={{ borderBottom: ' 1px solid #616161' }}>
                                                    <td style={{ verticalAlign: 'top', width: '60%', paddingRight: '20px', paddingBottom: '20px' }}>
                                                        <h1 style={{ fontSize: '14px', fontWeight: 500, paddingBottom: '3px' }}>From :</h1>
                                                        <p style={{ fontSize: '16px', fontWeight: 500 }}>{invoiceDetails?.supplier_name}</p>
                                                        <p style={{ fontSize: '13px',    fontWeight:"500",color: '#616161' }}>{invoiceDetails?.supplier_address}</p>
                                                        {invoiceDetails?.supplier_registered_address?.locality && <p style={{ fontSize: '13px',    fontWeight:"  500",     color: '#616161' }}>{invoiceDetails?.supplier_registered_address?.locality}</p>}
                                                        {invoiceDetails?.supplier_registered_address?.land_mark && <p style={{ fontSize: '13px',    fontWeight:"  500",    color: '#616161' }}>{invoiceDetails?.supplier_registered_address?.land_mark}</p>}
                                                        {
                                                            (invoiceDetails?.supplier_registered_address?.city || invoiceDetails?.supplier_registered_address?.state || invoiceDetails?.supplier_registered_address?.pincode || invoiceDetails?.supplier_registered_address?.country) &&
                                                            <p style={{ fontSize: '13px',    fontWeight:"500",    color: '#616161' }}>{invoiceDetails?.supplier_registered_address?.city} {invoiceDetails?.supplier_registered_address?.state} {invoiceDetails?.supplier_registered_address?.pincode} {invoiceDetails?.supplier_registered_address?.country} </p>
                                                        }
                                                       
                                                        <td style={{ display: 'flex', justifyContent: 'start' }}>
                                                            <p style={{ fontSize: '13px',    fontWeight:"500",    color: '#616161',  }}>VAT Reg No :</p>
                                                            <p style={{ fontSize: '13px',    fontWeight:"500",     color: '#616161', }}>&nbsp;{invoiceDetails?.supplier_vat_reg_no}</p>
                                                        </td>
                                                    </td>
                                                    <td style={{ verticalAlign: 'top', width: '40%', paddingBottom: '20px' }}>
                                                        <h1 style={{ fontSize: '14px', fontWeight: 500, paddingBottom: '3px', textAlign: 'end' }}>To :</h1>
                                                        <p style={{ fontSize: '16px', fontWeight: 500, textAlign: 'end' }}>{invoiceDetails?.buyer_name}</p>
                                                        <p style={{ fontSize: '13px',    fontWeight:"  500",   color: '#616161', textAlign: 'end' }}>{invoiceDetails?.buyer_address}</p>{invoiceDetails?.buyer_registered_address?.locality && <p style={{ fontSize: '13px', lineHeight: '16px',     color: '#616161' }}>{invoiceDetails?.buyer_registered_address?.locality}</p>}
                                                        {invoiceDetails?.buyer_registered_address?.land_mark && <p style={{ fontSize: '13px',    fontWeight:"  500",    color: '#616161' }}>{invoiceDetails?.buyer_registered_address?.land_mark}</p>}
                                                        {
                                                            (invoiceDetails?.buyer_registered_address?.city || invoiceDetails?.buyer_registered_address?.state || invoiceDetails?.buyer_registered_address?.pincode || invoiceDetails?.buyer_registered_address?.country) &&
                                                            <p style={{ fontSize: '13px',    fontWeight:"  500",    color: '#616161' }}>{invoiceDetails?.buyer_registered_address?.city} {invoiceDetails?.buyer_registered_address?.state} {invoiceDetails?.buyer_registered_address?.pincode} {invoiceDetails?.buyer_registered_address?.country} </p>
                                                        }
                                                        
                                                        <td style={{ display: 'flex', justifyContent: 'end' }}>
                                                            <p style={{ fontSize: '13px',    fontWeight:"  500",    color: '#616161',  }}>VAT Reg No :</p>
                                                            <p style={{ fontSize: '13px',    fontWeight:"  500",     color: '#616161',  }}>&nbsp;{invoiceDetails?.buyer_vat_reg_no}</p>
                                                        </td>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="3">
                                                        <table style={{ width: '100%', borderSpacing: 0, }}>
                                                            <thead>
                                                                <tr style={{ textTransform: 'uppercase' }}>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: ' 1px solid #616161', width: '40px' }}>S.No</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: ' 1px solid #616161', width: '180px' }}>Product Name</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: ' 1px solid #616161', width: '40px' }}>Qty</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: ' 1px solid #616161', textAlign: 'end', width: '100px' }}>Price</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: ' 1px solid #616161', textAlign: 'end', width: '100px' }}>Tax %</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: ' 1px solid #616161', textAlign: 'end', width: '120px' }}>Total</td>
                                                                </tr>
                                                            </thead>
                                                            {
                                                                invoiceDetails?.items?.map((item, i) => {
                                                                    return (
                                                                        <tbody>
                                                                        <tr>
                                                                            <td style={{ paddingBlock: '12px', display: 'flex', alignItems: 'baseline', verticalAlign:"baseline" }}>
                                                                                <p style={{ fontWeight: 500, fontSize: '14px' }}>{i + 1}.</p>
                                                                            </td>
                                                                            <td style={{ paddingBlock: '12px',verticalAlign:"baseline" }}>
                                                                                <p style={{ fontWeight: 500, fontSize: '14px', lineHeight:"20px" }}>{item.medicine_name} ({item.strength})</p>
                                                                            </td>
                                                                            <td style={{ paddingBlock: '12px',verticalAlign:"baseline" }}>
                                                                                <p style={{ fontWeight: 500, fontSize: '13px' }}>{item?.quantity_required}</p>
                                                                            </td>
                                                                            <td style={{ paddingBlock: '12px', textAlign: 'end',verticalAlign:"baseline" }}>
                                                                                <p style={{ fontWeight: 500, fontSize: '13px' }}>{item.counter_price || item.target_price} USD</p>
                                                                            </td>
                                                                            <td style={{ paddingBlock: '12px', textAlign: 'end',verticalAlign:"baseline" }}>
                                                                                <p style={{ fontWeight: 500, fontSize: '13px' }}>{item.unit_tax}%</p>
                                                                            </td>
                                                                            <td style={{ paddingBlock: '12px', textAlign: 'end',verticalAlign:"baseline" }}>
                                                                                <p style={{ fontWeight: 500, fontSize: '13px' }}>{item.total_amount} USD </p>
                                                                            </td>
                                                                        </tr>
                                                                        
                                                                    </tbody>
                                                                    )
                                                                })
                                                            }
                                                           
                                                        </table>
                                                        <table>
                                                            <tbody style={{ borderTop: ' 1px solid #616161', borderBottom: ' 1px solid #616161' }}>
                                                                <tr>
                                                                    <td style={{ verticalAlign: 'top', paddingBottom: '20px', width: '42%' }}>
                                                                        <h1 style={{ fontSize: '16px', fontWeight: '500', marginTop: '16px', textAlign: 'start' }}>Bank Details :</h1>
                                                                        <tr style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', paddingTop: '8px' }}>
                                                                            <p style={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>Account No :</p>
                                                                            <p style={{ fontSize: '14px', fontWeight: '500' }}>{invoiceDetails?.account_number}</p>
                                                                        </tr>
                                                                        <tr style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', paddingTop: '6px' }}>
                                                                            <p style={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>Sort Code :</p>
                                                                            <p style={{ fontSize: '14px', fontWeight: '500' }}>{invoiceDetails?.sort_code}</p>
                                                                        </tr>
                                                                    </td>
                                                                    <td style={{ width: '  500px' }} >
                                                                        <table style={{ width: '100%', borderSpacing: 0, }}>
                                                                            <tbody>
                                                                              
                                                                                <tr style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: '10px', paddingTop: '6px' }}>
                                                                                    <p style={{ textAlign: 'end', fontSize: '14px', fontWeight: '500', paddingBottom: '10px' }}>Total Amount Payable   :</p>
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
                                <tbody style={{ width: '100%', borderBottom: ' 1px solid #616161' }}>
                                    <tr>
                                        <td style={{ verticalAlign: 'top', width: '100vw', paddingRight: '20px', paddingBottom: '20px' }}>
                                            <h1 style={{ fontSize: '16px', fontWeight: '500', marginTop: '16px' }}>Payment Terms :</h1>
                                            <div style={{ fontSize: '13px', lineHeight: '20px', marginTop: '4px',     color: '#616161' }}>
                                                {
                                                    invoiceDetails?.payment_terms?.map((term, i) => {
                                                        return (
                                                            <p style={{ position: 'relative', paddingLeft: '20px', fontSize:"13px", fontWeight:"500" }}>
                                                            <span style={{ position: 'absolute', left: '0', top: '0', fontSize: '22px' }}>•</span>
                                                             {term}
                                                        </p>
                                                        )
                                                    })
                                                }
                                               
                                                
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

export default BuyerInvoiceDetails;

