import React, { useEffect, useState } from 'react'
import styles from './PurchasedOrderDetails.module.css'
import html2pdf from 'html2pdf.js'
import { useNavigate, useParams } from 'react-router-dom'
import { postRequestWithToken } from '../../../api/Requests'

const PurchasedOrderDetails = () => {
    const { purchaseOrderId } = useParams()
    const navigate = useNavigate()

    const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
    const supplierIdLocalStorage = localStorage.getItem("supplier_id");

    const [poDetails, setPoDetails] = useState()

    useEffect(() => {
        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }
        const obj = {
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
            purchaseOrder_id: purchaseOrderId,
        }

        postRequestWithToken('supplier/purchaseorder/get-po-details', obj, async (response) => {
            if (response.code === 200) {
                setPoDetails(response.result)
            } else {
                console.log('error in purchaseorder/get-po-details api', response);
            }
        })
    }, [])

    const orderItems = poDetails?.order_items?.map(item => ({
        ...item,
        unit_price: parseFloat(item.unit_price),
        unit_tax: parseFloat(item.medicine_details?.unit_tax || '0'),
        total_amount: parseFloat(item.total_amount)
    })) || [];

    const totalAmount = orderItems.reduce((sum, item) => sum + item.total_amount, 0);
    const totalTaxAmount = orderItems.reduce((sum, item) => {
        const unitTaxRate = parseFloat(item.unit_tax || '0') / 100;
        const itemTotalAmount = parseFloat(item.total_amount);
        return sum + (itemTotalAmount * unitTaxRate);
    }, 0);
    const grandTotal = totalAmount + totalTaxAmount;

    const handleDownload = () => {
        const element = document.getElementById('po-content');
        const options = {
            margin: 0.5,
            filename: `purchaseOrder-${poDetails?.po_number}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(element).set(options).save()

    };

    return (
        <div className={styles['purchased-template-design']}>
            <div className={styles['purchased-scroll-wrapper']}>
                <div className={styles['purchased-template-download']}>
                    <div className={styles['purchased-template-button']} onClick={handleDownload}>Download</div>
                </div>
                <div id='po-content' style={{ maxWidth: '800px', margin: 'auto auto 10rem', padding: '30px', border: '1px solid #eee', fontSize: '16px', lineHeight: '24px', color: '#555', backgroundColor: '#FFFFFF' }}>
                    <div style={{ textAlign: 'center', fontWeight: '500', fontSize: '30px', margin: '0px 0px 20px 0px' }}>Purchase Order</div>
                    <table style={{ fontSize: '12px' }}>
                        <thead>
                            <div className={styles['purchased-order-container']}>
                                <tr>
                                    <td>
                                        <img src={`${process.env.REACT_APP_SERVER_URL}uploads/buyer/buyer_images/${poDetails?.buyer_details[0]?.buyer_image[0]}`}
                                            alt="companylogo" className={styles['purchange-logo']} />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px dotted #99a0ac' }}>
                                    <td style={{ display: 'flex', justifyContent: 'end' }}>
                                        <p style={{ fontSize: '16px', fontWeight: '500' }}>PO Number : </p>
                                        <p style={{ fontSize: '16px', fontWeight: '500' }}>&nbsp;{poDetails?.po_number}</p>
                                    </td>
                                    <td style={{ display: 'flex', justifyContent: 'end', paddingBottom: '10px' }}>
                                        <p style={{ fontSize: '15px', fontWeight: '500' }}>PO Date : </p>
                                        <p style={{ fontSize: '15px', fontWeight: '500' }}>&nbsp;{poDetails?.po_date}</p>
                                    </td>
                                </tr>

                            </div>

                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <table style={{ padding: '20px 16px', width: '100%', borderRadius: '12px', tableLayout: 'fixed', marginTop: '20px' }}>
                                        <tbody>
                                            <tr style={{ borderBottom: '1px dotted #99a0ac' }}>
                                                <td style={{ verticalAlign: 'top', width: '60%', paddingRight: '20px', paddingBottom: '20px' }}>
                                                    <h1 style={{ fontSize: '14px', fontWeight: 500, paddingBottom: '3px' }}>From :</h1>
                                                    <p style={{ fontSize: '16px', fontWeight: 500, paddingBottom: '6px' }}>{poDetails?.buyer_name}</p>
                                                    <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac' }}>{poDetails?.buyer_address}</p>
                                                    
                                                    <td style={{ display: 'flex', justifyContent: 'start' }}>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>Mobile No. :</p>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;{poDetails?.buyer_country_code} {poDetails?.buyer_mobile}</p>
                                                    </td>
                                                    <td style={{ display: 'flex', justifyContent: 'start' }}>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>Email ID :</p>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;{poDetails?.buyer_email}</p>
                                                    </td>
                                                    <td style={{ display: 'flex', justifyContent: 'start' }}>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>Company Registration No. :</p>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;{poDetails?.buyer_regNo}</p>
                                                    </td>
                                                </td>
                                                <td style={{ verticalAlign: 'top', width: '40%', paddingBottom: '20px' }}>
                                                    <h1 style={{ fontSize: '14px', fontWeight: 500, paddingBottom: '3px', textAlign: 'end' }}>To :</h1>
                                                    <p style={{ fontSize: '16px', fontWeight: 500, paddingBottom: '6px', textAlign: 'end' }}>{poDetails?.supplier_name}</p>
                                                    <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', textAlign: 'end' }}>{poDetails?.supplier_address}</p>
                                                   
                                                    <td style={{ display: 'flex', justifyContent: 'end' }}>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>Mobile No. :</p>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;{poDetails?.supplier_country_code } {poDetails?.supplier_mobile}</p>
                                                    </td>
                                                    <td style={{ display: 'flex', justifyContent: 'end' }}>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>Email ID :</p>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;{poDetails?.supplier_email}</p>
                                                    </td>
                                                    <td style={{ display: 'flex', justifyContent: 'end' }}>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>Company Registration No. :</p>
                                                        <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;{poDetails?.supplier_regNo}</p>
                                                    </td>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3">
                                                    <table style={{ width: '100%', borderSpacing: 0, }}>
                                                        <thead>
                                                            <tr style={{ textTransform: 'uppercase' }}>
                                                                <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', width: '40px' }}>S.No</td>
                                                                <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', width: '150px' }}>Item Name</td>
                                                                <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', width: '40px' }}>Qty</td>
                                                                <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', textAlign: 'end', width: '100px' }}>Price</td>
                                                                <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', textAlign: 'end', width: '100px' }}>Tax %</td>
                                                                <td style={{ padding: '8px 0', fontWeight: 500, borderBottom: '1px dotted rgb(153, 160, 172)', textAlign: 'end', width: '120px' }}>Total Price</td>
                                                            </tr>
                                                        </thead>
                                                        {orderItems.map((item, index) => (
                                                            <tbody>
                                                                <tr>
                                                                    <td style={{ paddingBlock: '12px', display: 'flex', alignItems: 'baseline' }}>
                                                                        <p style={{ fontWeight: 500, fontSize: '14px' }}>{index + 1}.</p>
                                                                    </td>
                                                                    <td style={{ paddingBlock: '12px' }}>
                                                                        <p style={{ fontWeight: 500, fontSize: '14px' }}>{item.medicine_name} ({item.medicine_details?.strength})</p>
                                                                    </td>
                                                                    <td style={{ paddingBlock: '12px' }}>
                                                                        <p style={{ fontWeight: 500, fontSize: '13px' }}>{item.quantity_required}</p>
                                                                    </td>
                                                                    <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                                                        <p style={{ fontWeight: 500, fontSize: '13px' }}>{item?.counter_price || item?.target_price} USD</p>
                                                                    </td>
                                                                    <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                                                        <p style={{ fontWeight: 500, fontSize: '13px' }}>{item.medicine_details?.unit_tax}%</p>
                                                                    </td>
                                                                    <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                                                        <p style={{ fontWeight: 500, fontSize: '13px' }}>{item.total_amount.toFixed(2)} USD </p>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        ))}
                                                    </table>
                                                    <table>
                                                        <tbody style={{ borderTop: '1px dotted rgb(153, 160, 172)', borderBottom: '1px dotted rgb(153, 160, 172)' }}>
                                                            <tr>


                                                                <td style={{ width: '750px' }} >
                                                                    <table style={{ width: '100%', borderSpacing: 0, }}>
                                                                        <tbody>

                                                                            <td style={{ width: '750px' }} >
                                                                                <table style={{ width: '100%', borderSpacing: 0, }}>
                                                                                    <tbody>
                                                                                        <tr style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: '10px', marginTop: '8px' }}>
                                                                                            <p style={{ textAlign: 'end', fontSize: '14px', fontWeight: '500' }}>Total Amount :</p>
                                                                                            <p style={{ textAlign: 'end', fontWeight: '500', fontSize: '14px', width: '150px' }}>{totalAmount.toFixed(2)} USD</p>
                                                                                        </tr>
                                                                                        {/* <tr style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: '10px', marginTop: '8px' }}>
                                                                                            <p style={{ textAlign: 'end', fontSize: '14px', fontWeight: '500' }}>Tax Amount :</p>
                                                                                            <p style={{ textAlign: 'end', fontWeight: '500', fontSize: '14px', width: '100px' }}>{totalTaxAmount.toFixed(2)} USD</p>
                                                                                        </tr>
                                                                                        <tr style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: '10px', marginTop: '8px' }}>
                                                                                            <p style={{ textAlign: 'end', fontSize: '14px', fontWeight: '500' }}>Grand Total :</p>
                                                                                            <p style={{ textAlign: 'end', fontWeight: '500', fontSize: '14px', width: '100px' }}>{grandTotal.toFixed(2)} USD </p>

                                                                                        </tr> */}

                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
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
                        {
                            poDetails?.additional_instructions && (
                        <tfoot>
                            <tbody style={{ width: '100%', borderBottom: '1px dotted rgb(153, 160, 172)' }}>
                                <tr>
                                    <td style={{ verticalAlign: 'top', width: '100vw', paddingBottom: '20px' }}>
                                        <h1 style={{ fontSize: '16px', fontWeight: '500', marginTop: '16px' }}>Additional Instruction :</h1>
                                        <div style={{ fontSize: '13px', lineHeight: '20px', marginTop: '4px', color: '#99a0ac' }}>
                                            <p style={{ position: 'relative', paddingLeft: '20px' }}>
                                                <span style={{ position: 'absolute', left: '0', top: '0', fontSize: '22px' }}>•</span>
                                                {poDetails?.additional_instructions}
                                            </p>
                                            
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </tfoot>
                         )
                        }
                    </table>
                </div >
            </div >
        </div >

    )
}

export default PurchasedOrderDetails