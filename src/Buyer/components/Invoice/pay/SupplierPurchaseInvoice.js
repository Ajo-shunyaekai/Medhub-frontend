import React from 'react';
import InvoiceCardDesign from './InvoiceCardDesign';
import '../../style/invoiceDesign.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function InvoiceTemplate({invoice}) {
    const handleDownloadPDF = () => {
        const input = document.getElementById('invoice');

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('invoice.pdf');
        });
    };

    return (
        <div className='invoice-supplier-template-design'>
            <div className='scroll-wrapper'>
                <div id='invoice' style={{ maxWidth: '800px', margin: 'auto', padding: '30px', border: '1px solid #eee', fontSize: '16px', lineHeight: '24px', color: '#555', backgroundColor: '#FFFFFF' }}>
                    <div style={{ textAlign: 'center', fontWeight: '500', fontSize: '30px', margin: '0px 0px 20px 0px' }}>Invoice</div>
                    <table style={{ fontSize: '12px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px dotted #99a0ac' }}>
                                <td style={{ display: 'flex', justifyContent: 'end' }}>
                                    <p style={{ fontSize: '16px', fontWeight: '500' }}>Invoice Number :</p>
                                    <p style={{ fontSize: '16px', fontWeight: '500' }}>&nbsp;1234567890123</p>
                                </td>
                                <td style={{ display: 'flex', justifyContent: 'end', paddingBottom: '10px' }}>
                                    <p style={{ fontSize: '15px', fontWeight: '500' }}>Date :</p>
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
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>VAT Reg No :</p>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;1266547896</p>
                                                    </td>
                                                </td>
                                                <td style={{ verticalAlign: 'top', width: '40%', paddingBottom: '20px' }}>
                                                    <h1 style={{ fontSize: '14px', fontWeight: 500, paddingBottom: '3px', textAlign: 'end' }}>To :</h1>
                                                    <p style={{ fontSize: '16px', fontWeight: 500, paddingBottom: '6px', textAlign: 'end' }}>Sheetal Medical Store</p>
                                                    <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', lineHeight: '16px', textAlign: 'end' }}>House No. 12 City Place Dubai</p>
                                                    <p style={{ fontSize: '13px', color: '#99a0ac', lineHeight: '16px', textAlign: 'end', paddingTop: '6px' }}>Dubai (United Arab Emirates)</p>
                                                    <td style={{ display: 'flex', justifyContent: 'end' }}>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>VAT Reg No :</p>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;1266547896</p>
                                                    </td>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3">
                                                    <table style={{ width: '100%', borderSpacing: 0 }}>
                                                        <thead>
                                                            <tr style={{ textTransform: 'uppercase' }}>
                                                                <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', width: '40px' }}>S.No</td>
                                                                <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', width: '150px' }}>Description</td>
                                                                <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', width: '40px' }}>Qty</td>
                                                                <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', textAlign: 'end', width: '100px' }}>Unit Price</td>
                                                                <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', textAlign: 'end', width: '120px' }}>Total</td>
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
                                                                    <p style={{ fontWeight: 500, fontSize: '13px' }}>50 USD</p>
                                                                </td>
                                                                <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                                                    <p style={{ fontWeight: 500, fontSize: '13px' }}>5000 USD </p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ paddingBlock: '12px', display: 'flex', alignItems: 'baseline' }}>
                                                                    <p style={{ fontWeight: 500, fontSize: '14px' }}>2.</p>
                                                                </td>
                                                                <td style={{ paddingBlock: '12px' }}>
                                                                    <p style={{ fontWeight: 500, fontSize: '14px' }}>Migon (650mg)</p>
                                                                </td>
                                                                <td style={{ paddingBlock: '12px' }}>
                                                                    <p style={{ fontWeight: 500, fontSize: '13px' }}>100</p>
                                                                </td>
                                                                <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                                                    <p style={{ fontWeight: 500, fontSize: '13px' }}>60 USD</p>
                                                                </td>
                                                                <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                                                    <p style={{ fontWeight: 500, fontSize: '13px' }}>6000 USD</p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <table>
                                                        <tbody style={{ borderTop: '1px dotted rgb(153, 160, 172)', borderBottom: '1px dotted rgb(153, 160, 172)' }}>
                                                            <tr>
                                                                <td style={{ verticalAlign: 'top', paddingBottom: '20px', width: '42%' }}>
                                                                    <h1 style={{ fontSize: '16px', fontWeight: '500', marginTop: '16px', textAlign: 'start' }}>Bank Details :</h1>
                                                                    <tr style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', paddingTop: '8px' }}>
                                                                        <p style={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>Account No :</p>
                                                                        <p style={{ fontSize: '14px', fontWeight: '500' }}>1234567890123456</p>
                                                                    </tr>
                                                                    <tr style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', paddingTop: '6px' }}>
                                                                        <p style={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>Sort Code :</p>
                                                                        <p style={{ fontSize: '14px', fontWeight: '500' }}>147852</p>
                                                                    </tr>
                                                                </td>
                                                                <td style={{ width: '550px' }}>
                                                                    <table style={{ width: '100%', borderSpacing: 0 }}>
                                                                        <tbody>
                                                                            <tr style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: '10px', marginTop: '8px' }}>
                                                                                <p style={{ textAlign: 'end', fontSize: '14px', fontWeight: '500' }}>Subtotal :</p>
                                                                                <p style={{ textAlign: 'end', fontWeight: '500', fontSize: '14px', width: '100px' }}>200 USD</p>
                                                                            </tr>
                                                                            <tr style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: '10px', paddingTop: '8px' }}>
                                                                                <p style={{ textAlign: 'end', fontSize: '14px', fontWeight: '500' }}>VAT @ 20% :</p>
                                                                                <p style={{ textAlign: 'end', fontWeight: '500', fontSize: '14px', width: '100px' }}>4400 USD</p>
                                                                            </tr>
                                                                            <tr style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: '10px', paddingTop: '6px' }}>
                                                                                <p style={{ textAlign: 'end', fontSize: '14px', fontWeight: '500', paddingBottom: '10px' }}>Total Amount Payable :</p>
                                                                                <p style={{ textAlign: 'end', fontWeight: '500', fontSize: '14px', paddingBottom: '10px', width: '100px' }}>1425500 USD</p>
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
    );
}

export default InvoiceTemplate;
