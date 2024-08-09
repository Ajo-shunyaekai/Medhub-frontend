import React from 'react';
import '../style/invoiceDesign.css'
import html2pdf from 'html2pdf.js';

function ProformaDetailsPage() {

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

    return (
        <div className='invoice-template-design'>
            <div className='scroll-wrapper'>
                <div className='invoice-template-download'>
                    <div className='invoice-template-button' onClick={handleDownload}>Download</div>
                </div>
                <div id='invoice-content'>
                    <div style={{ maxWidth: '800px', margin: 'auto auto 10rem', padding: '30px', border: '1px solid #eee', fontSize: '16px', lineHeight: '24px', color: '#555', backgroundColor: '#FFFFFF' }}>
                        <div style={{ textAlign: 'center', fontWeight: '500', fontSize: '30px', margin: '0px 0px 20px 0px' }}>Proforma Invoice</div>
                        <table style={{ fontSize: '12px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px dotted #99a0ac' }}>
                                    <td style={{ display: 'flex', justifyContent: 'end' }}>
                                        <p style={{ fontSize: '16px', fontWeight: '500' }}>Invoice Number : </p>
                                        <p style={{ fontSize: '16px', fontWeight: '500' }}>&nbsp;1234567890123</p>
                                    </td>
                                    <td style={{ display: 'flex', justifyContent: 'end' }}>
                                        <p style={{ fontSize: '16px', fontWeight: '500' }}>Payment Due date : </p>
                                        <p style={{ fontSize: '16px', fontWeight: '500' }}>&nbsp;12/08/2024</p>
                                    </td>
                                    <td style={{ display: 'flex', justifyContent: 'end', paddingBottom: '10px' }}>
                                        <p style={{ fontSize: '15px', fontWeight: '500' }}>Invoice Generated Date : </p>
                                        <p style={{ fontSize: '15px', fontWeight: '500' }}>&nbsp;12/04/2024</p>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <table style={{ padding: '20px 16px', width: '100%', borderRadius: '12px', tableLayout: 'fixed', marginTop: '20px' }}>
                                            <tbody>
                                                <tr style={{ borderBottom: '1px dotted #99a0ac' }}>
                                                    <td style={{ verticalAlign: 'top', width: '60%', paddingRight: '20px', paddingBottom: '20px' }}>
                                                        <h1 style={{ fontSize: '14px', fontWeight: 500, paddingBottom: '3px' }}>From :</h1>
                                                        <p style={{ fontSize: '16px', fontWeight: 500, paddingBottom: '6px' }}>SABC Pharma Agency</p>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac' }}>Khalid Bin Al Waleed Rd-Al Raffa-Dubai</p>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>United Arab Emirates</p>
                                                        <td style={{ display: 'flex', justifyContent: 'start' }}>
                                                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>Mobile No. :</p>
                                                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;+971 123456789</p>
                                                        </td>
                                                        <td style={{ display: 'flex', justifyContent: 'start' }}>
                                                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>Email ID :</p>
                                                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;sabs@gmail.com</p>
                                                        </td>
                                                    </td>
                                                    <td style={{ verticalAlign: 'top', width: '40%', paddingBottom: '20px' }}>
                                                        <h1 style={{ fontSize: '14px', fontWeight: 500, paddingBottom: '3px', textAlign: 'end' }}>To :</h1>
                                                        <p style={{ fontSize: '16px', fontWeight: 500, paddingBottom: '6px', textAlign: 'end' }}>Sheetal Medical Store</p>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', lineHeight: '16px', textAlign: 'end' }}>House No. 12 City Place Dubai</p>
                                                        <p style={{ fontSize: '13px', color: '#99a0ac', lineHeight: '16px', textAlign: 'end', paddingTop: '6px' }}>Dubai (United Arab Emirates)</p>
                                                        <td style={{ display: 'flex', justifyContent: 'end' }}>
                                                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>Mobile No. :</p>
                                                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;+971 147852369</p>
                                                        </td>
                                                        <td style={{ display: 'flex', justifyContent: 'end' }}>
                                                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>Email ID :</p>
                                                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp; sheetal@gmail.com</p>
                                                        </td>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="3">
                                                        <table style={{ width: '100%', borderSpacing: 0, }}>
                                                            <thead>
                                                                <tr style={{ textTransform: 'uppercase' }}>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', width: '40px' }}>S.No</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', width: '150px' }}>Name</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', width: '40px' }}>Qty</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', textAlign: 'end', width: '100px' }}>Listed Price</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', textAlign: 'end', width: '100px' }}>Tax%</td>
                                                                    <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', textAlign: 'end', width: '120px' }}>Total Amount</td>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td style={{ paddingBlock: '12px', display: 'flex', alignItems: 'baseline' }}>
                                                                        <p style={{ fontWeight: 500, fontSize: '14px' }}>1.</p>
                                                                    </td>
                                                                    <td style={{ paddingBlock: '12px' }}>
                                                                        <p style={{ fontWeight: 500, fontSize: '14px' }}>Paracetamol (500mg)</p>
                                                                    </td>
                                                                    <td style={{ paddingBlock: '12px' }}>
                                                                        <p style={{ fontWeight: 500, fontSize: '13px' }}>50</p>
                                                                    </td>
                                                                    <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                                                        <p style={{ fontWeight: 500, fontSize: '13px' }}>12 AED</p>
                                                                    </td>
                                                                    <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                                                        <p style={{ fontWeight: 500, fontSize: '13px' }}>2%</p>
                                                                    </td>
                                                                    <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                                                        <p style={{ fontWeight: 500, fontSize: '13px' }}>500 AED </p>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <table>
                                                            <tbody style={{ borderTop: '1px dotted rgb(153, 160, 172)', borderBottom: '1px dotted rgb(153, 160, 172)' }}>
                                                                <tr>
                                                                    <td style={{ width: '750px' }} >
                                                                        <table style={{ width: '100%', borderSpacing: 0, }}>
                                                                            <tbody>
                                                                                <tr style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: '10px', marginTop: '8px' }}>
                                                                                    <p style={{ textAlign: 'end', fontSize: '14px', fontWeight: '500' }}>Subtotal :</p>
                                                                                    <p style={{ textAlign: 'end', fontWeight: '500', fontSize: '14px', width: '100px' }}>200 AED</p>
                                                                                </tr>
                                                                                <tr style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: '10px', paddingTop: '8px' }}>
                                                                                    <p style={{ textAlign: 'end', fontSize: '14px', fontWeight: '500' }}>Tax % :</p>
                                                                                    <p style={{ textAlign: 'end', fontWeight: '500', fontSize: '14px', width: '100px' }}>4400 AED</p>
                                                                                </tr>
                                                                                <tr style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: '10px', paddingTop: '6px' }}>
                                                                                    <p style={{ textAlign: 'end', fontSize: '14px', fontWeight: '500', paddingBottom: '10px' }}>Grand Total  :</p>
                                                                                    <p style={{ textAlign: 'end', fontWeight: '500', fontSize: '14px', paddingBottom: '10px', width: '100px' }}>1425500 AED</p>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>

                                                                </tr>
                                                            </tbody>

                                                            <tbody style={{ borderTop: '1px dotted rgb(153, 160, 172)', borderBottom: '1px dotted rgb(153, 160, 172)' }}>
                                                                <tr>
                                                                    <td style={{ width: '750px' }} >
                                                                        <table style={{ width: '100%', borderSpacing: 0, }}>
                                                                            <tbody>
                                                                                <tr style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: '10px', marginTop: '8px' }}>
                                                                                    <p style={{ textAlign: 'end', fontSize: '14px', fontWeight: '500' }}>Deposit Requested :</p>
                                                                                    <p style={{ textAlign: 'end', fontWeight: '500', fontSize: '14px', width: '100px' }}>30% Advance</p>
                                                                                </tr>
                                                                                <tr style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: '10px', paddingTop: '8px' }}>
                                                                                    <p style={{ textAlign: 'end', fontSize: '14px', fontWeight: '500' }}>Deposit Due :</p>
                                                                                    <p style={{ textAlign: 'end', fontWeight: '500', fontSize: '14px', width: '100px' }}>70% Due</p>
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
                                <tbody style={{ width: '100%', borderBottom: '1px dotted rgb(153, 160, 172)' }}>
                                    <tr>
                                        <td style={{ verticalAlign: 'top', width: '100%', paddingRight: '20px', paddingBottom: '20px' }}>
                                            <h1 style={{ fontSize: '16px', fontWeight: '500', marginTop: '16px' }}>Payment Terms :</h1>
                                            <div style={{ fontSize: '13px', lineHeight: '20px', marginTop: '4px', color: '#99a0ac' }}>
                                                <p style={{ position: 'relative', paddingLeft: '20px' }}>
                                                    <span style={{ position: 'absolute', left: '0', top: '0', fontSize: '22px' }}>•</span>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                                </p>
                                                <p style={{ position: 'relative', paddingLeft: '20px' }}>
                                                    <span style={{ position: 'absolute', left: '0', top: '0', fontSize: '22px' }}>•</span>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                                </p>
                                                <p style={{ position: 'relative', paddingLeft: '20px' }}>
                                                    <span style={{ position: 'absolute', left: '0', top: '0', fontSize: '22px' }}>•</span>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                                </p>
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

export default ProformaDetailsPage;



