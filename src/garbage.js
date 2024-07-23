import React from 'react';

function InvoiceDesign() {
    return (
        <div style={{ maxWidth: '750px', margin: 'auto', padding: '16px', border: '1px solid #eee', fontSize: '16px', lineHeight: '24px', fontFamily: 'Inter, sans-serif', color: '#555', backgroundColor: '#FFFFFF' }}>
            <table style={{ fontSize: '12px', lineHeight: '20px' }}>
                <thead>
                    <tr>
                        <td style={{ padding: '0 16px 18px 16px' }}>
                            <h1 style={{ color: '#1A1C21', fontSize: '18px', fontStyle: 'normal', fontWeight: 600, lineHeight: 'normal' }}>ABC Pharma Agency</h1>
                            <p>abcpharma@email.com</p>
                            <p>+971 7766002333</p>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <table style={{ backgroundColor: '#FFF', padding: '20px 16px', border: '1px solid #D7DAE0', width: '100%', borderRadius: '12px', fontSize: '12px', lineHeight: '20px', tableLayout: 'fixed' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ verticalAlign: 'top', width: '30%', paddingRight: '20px', paddingBottom: '35px' }}>
                                            <p style={{ fontWeight: 700, color: '#1A1C21' }}>Client Name</p>
                                            <p style={{ color: '#5E6470' }}>Business address City, Country</p>
                                            <p style={{ color: '#5E6470' }}>email@company.com</p>
                                        </td>
                                        <td style={{ verticalAlign: 'top', width: '35%', paddingRight: '20px', paddingBottom: '35px' }}>
                                            <p style={{ fontWeight: 700, color: '#1A1C21' }}>Pick-up</p>
                                            <p style={{ color: '#5E6470' }}>1 Hight street, London, E1 7QL Uk</p>
                                            <p style={{ fontWeight: 700, color: '#1A1C21' }}>Drop-off</p>
                                            <p style={{ color: '#5E6470' }}>1 Hight street, London, E1 7QL Uk</p>
                                        </td>
                                        <td style={{ verticalAlign: 'top', paddingBottom: '35px' }}>
                                            <table style={{ tableLayout: 'fixed', width: '-webkit-fill-available' }}>
                                                <tr>
                                                    <th style={{ textAlign: 'left', color: '#1A1C21' }}>Job ID</th>
                                                    <td style={{ textAlign: 'right' }}>123567</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ textAlign: 'left', color: '#1A1C21' }}>Job date</th>
                                                    <td style={{ textAlign: 'right' }}>14/12/2020</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ textAlign: 'left', color: '#1A1C21' }}>Distance</th>
                                                    <td style={{ textAlign: 'right' }}>1.568 miles</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ textAlign: 'left', color: '#1A1C21' }}>Pick-up time</th>
                                                    <td style={{ textAlign: 'right' }}>19:58</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ textAlign: 'left', color: '#1A1C21' }}>Time delivered</th>
                                                    <td style={{ textAlign: 'right' }}>20:58</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ paddingBottom: '13px' }}>
                                            <p style={{ color: '#5E6470' }}>Service </p>
                                            <p style={{ fontWeight: 700, color: '#1A1C21' }}>Delivery Service</p>
                                        </td>
                                        <td style={{ textAlign: 'center', paddingBottom: '13px' }}>
                                            <p style={{ color: '#5E6470' }}>Invoice number</p>
                                            <p style={{ fontWeight: 700, color: '#1A1C21' }}>#AB2324-01</p>
                                        </td>
                                        <td style={{ textAlign: 'end', paddingBottom: '13px' }}>
                                            <p style={{ color: '#5E6470' }}>Invoice date</p>
                                            <p style={{ fontWeight: 700, color: '#1A1C21' }}>01 Aug, 2023</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3">
                                            <table style={{ width: '100%', borderSpacing: 0 }}>
                                                <thead>
                                                    <tr style={{ textTransform: 'uppercase' }}>
                                                        <td style={{ padding: '8px 0', borderBottom: '1px solid #D7DAE0' }}>Item Detail</td>
                                                        <td style={{ padding: '8px 0', borderBottom: '1px solid #D7DAE0', width: '40px' }}>Qty</td>
                                                        <td style={{ padding: '8px 0', borderBottom: '1px solid #D7DAE0', textAlign: 'end', width: '100px' }}>Rate</td>
                                                        <td style={{ padding: '8px 0', borderBottom: '1px solid #D7DAE0', textAlign: 'end', width: '120px' }}>Amount</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ paddingBlock: '12px' }}>
                                                            <p style={{ fontWeight: 700, color: '#1A1C21' }}>Drops</p>
                                                            <p style={{ color: '#5E6470' }}>On-demand delivery</p>
                                                        </td>
                                                        <td style={{ paddingBlock: '12px' }}>
                                                            <p style={{ fontWeight: 700, color: '#1A1C21' }}>1</p>
                                                        </td>
                                                        <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                                            <p style={{ fontWeight: 700, color: '#1A1C21' }}>£5.00</p>
                                                        </td>
                                                        <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                                            <p style={{ fontWeight: 700, color: '#1A1C21' }}>£5.00</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ paddingBlock: '12px' }}>
                                                            <p style={{ fontWeight: 700, color: '#1A1C21' }}>Hours</p>
                                                            <p style={{ color: '#5E6470' }}>Shift delivery service</p>
                                                        </td>
                                                        <td style={{ paddingBlock: '12px' }}>
                                                            <p style={{ fontWeight: 700, color: '#1A1C21' }}>0</p>
                                                        </td>
                                                        <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                                            <p style={{ fontWeight: 700, color: '#1A1C21' }}>£0.00</p>
                                                        </td>
                                                        <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                                            <p style={{ fontWeight: 700, color: '#1A1C21' }}>£0.00</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td style={{ padding: '12px 0', borderTop: '1px solid #D7DAE0' }}></td>
                                                        <td style={{ borderTop: '1px solid #D7DAE0' }} colSpan="3">
                                                            <table style={{ width: '100%', borderSpacing: 0 }}>
                                                                <tbody>
                                                                    <tr>
                                                                        <th style={{ paddingTop: '12px', textAlign: 'start', color: '#1A1C21' }}>Subtotal</th>
                                                                        <td style={{ paddingTop: '12px', textAlign: 'end', color: '#1A1C21' }}>£5.00</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th style={{ padding: '12px 0', textAlign: 'start', color: '#1A1C21' }}>VAT in items (0%) (1)</th>
                                                                        <td style={{ padding: '12px 0', textAlign: 'end', color: '#1A1C21' }}>£5.00</td>
                                                                    </tr>
                                                                </tbody>
                                                                <tfoot>
                                                                    <tr>
                                                                        <th style={{ padding: '12px 0 30px 0', textAlign: 'start', color: '#1A1C21', borderTop: '1px solid #D7DAE0' }}>Total Price (2)</th>
                                                                        <th style={{ padding: '12px 0 30px 0', textAlign: 'end', color: '#1A1C21', borderTop: '1px solid #D7DAE0' }}>£5.00</th>
                                                                    </tr>
                                                                </tfoot>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <p style={{ color: '#1A1C21' }}>(1) VAT non applicable</p>
                                                            <p style={{ color: '#1A1C21' }}>(2) Price includes the remuneration for MealShift Services</p>
                                                        </td>
                                                    </tr>
                                                </tfoot>
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
                        <td style={{ paddingTop: '30px' }}>
                            <p style={{ display: 'flex', gap: '0 13px' }}><span style={{ color: '#1A1C21', fontWeight: 700 }}>MealShift Ltd</span><span>1 Assam Street, London - E1 7QL</span><span>Registration number:12793366</span></p>
                            <p style={{ color: '#1A1C21' }}>Any questions, contact customer service at <a href="mailto:support@mealshift.co.uk" style={{ color: '#000' }}>support@mealshift.co.uk</a>.</p>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default InvoiceDesign;
