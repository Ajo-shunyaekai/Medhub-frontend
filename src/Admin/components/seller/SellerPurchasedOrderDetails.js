import React, { useEffect, useState } from 'react'
import styles from '../../style/sellerorder.module.css'
import CompanyLogo from '../../../assest/CompanyLogo.png'
import html2pdf from 'html2pdf.js'
import { useNavigate, useParams } from 'react-router-dom'

const SellerPurchasedOrderDetails = () => {
  const { purchaseOrderId } = useParams()
  const navigate = useNavigate()

  const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
  const buyerIdLocalStorage = localStorage.getItem("buyer_id");

  const [poDetails, setPoDetails] = useState()

  useEffect(() => {
    // if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
    //     navigate("/buyer/login");
    //     return;
    // }
    const obj = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      purchaseOrder_id: purchaseOrderId,
    }

    // postRequestWithToken('buyer/purchaseorder/get-po-details', obj, async (response) => {
    //     if (response.code === 200) {
    //         setPoDetails(response.result)
    //     } else {
    //        console.log('error in purchaseorder/get-po-details api',response);
    //     }
    // })
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
                    <img src={'CompanyLogo'}
                      alt="companylogo" className={styles['purchange-logo']} />
                  </td>
                </tr>
                <tr>
                  <td style={{ display: 'flex', justifyContent: 'end' }}>
                    <p style={{ fontSize: '16px', fontWeight: '500' }}>PO Number : </p>
                    <p style={{ fontSize: '16px', fontWeight: '500' }}>&nbsp;147822585</p>
                  </td>
                  <td style={{ display: 'flex', justifyContent: 'end', paddingBottom: '10px' }}>
                    <p style={{ fontSize: '15px', fontWeight: '500' }}>PO Date : </p>
                    <p style={{ fontSize: '15px', fontWeight: '500' }}>&nbsp;14/10/2024</p>
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
                          <p style={{ fontSize: '16px', fontWeight: 500, paddingBottom: '6px' }}>Mohammad Raj</p>
                          <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac' }}>Dubai United Arab Emirates</p>
                          {/* <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>United Arab Emirates</p> */}
                          <td style={{ display: 'flex', justifyContent: 'start' }}>
                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>Mobile No. :</p>
                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;+971 852963741</p>
                          </td>
                          <td style={{ display: 'flex', justifyContent: 'start' }}>
                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>Email ID :</p>
                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;mohammad@gmail.com</p>
                          </td>
                          <td style={{ display: 'flex', justifyContent: 'start' }}>
                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>Company Registration No. :</p>
                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;147852369</p>
                          </td>
                        </td>
                        <td style={{ verticalAlign: 'top', width: '40%', paddingBottom: '20px' }}>
                          <h1 style={{ fontSize: '14px', fontWeight: 500, paddingBottom: '3px', textAlign: 'end' }}>To :</h1>
                          <p style={{ fontSize: '16px', fontWeight: 500, paddingBottom: '6px', textAlign: 'end' }}>Pharmaceuticals</p>
                          <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', textAlign: 'end' }}>United Arab Emirates</p>
                          {/* <p style={{ fontSize: '13px', color: '#99a0ac', lineHeight: '16px', textAlign: 'end', paddingTop: '6px' }}>Dubai (United Arab Emirates)</p> */}
                          <td style={{ display: 'flex', justifyContent: 'end' }}>
                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>Mobile No. :</p>
                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;+971 258963147</p>
                          </td>
                          <td style={{ display: 'flex', justifyContent: 'end' }}>
                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>Email ID :</p>
                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;pharma@gmail.com</p>
                          </td>
                          <td style={{ display: 'flex', justifyContent: 'end' }}>
                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>Company Registration No. :</p>
                            <p style={{ fontSize: '13px', lineHeight: '16px', color: '#99a0ac', paddingTop: '6px' }}>&nbsp;177425855</p>
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
                            <tbody>
                              <tr>
                                <td style={{ paddingBlock: '12px', display: 'flex', alignItems: 'baseline' }}>
                                  <p style={{ fontWeight: 500, fontSize: '14px' }}>1.</p>
                                </td>
                                <td style={{ paddingBlock: '12px' }}>
                                  <p style={{ fontWeight: 500, fontSize: '14px' }}>Paracetamol</p>
                                </td>
                                <td style={{ paddingBlock: '12px' }}>
                                  <p style={{ fontWeight: 500, fontSize: '13px' }}>255</p>
                                </td>
                                <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                  <p style={{ fontWeight: 500, fontSize: '13px' }}>1 AED</p>
                                </td>
                                <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                  <p style={{ fontWeight: 500, fontSize: '13px' }}>2%</p>
                                </td>
                                <td style={{ paddingBlock: '12px', textAlign: 'end' }}>
                                  <p style={{ fontWeight: 500, fontSize: '13px' }}>200 AED </p>
                                </td>
                              </tr>

                            </tbody>
                          </table>
                          <table>
                            <tbody style={{ borderTop: '1px dotted rgb(153, 160, 172)', borderBottom: '1px dotted rgb(153, 160, 172)' }}>
                              <tr>
                                {/* <td style={{ verticalAlign: 'top', paddingBottom: '20px', width: '42%' }}>
                                                                    <h1 style={{ fontSize: '16px', fontWeight: '500', marginTop: '16px', textAlign: 'start' }}>Bank Details :</h1>
                                                                    <tr style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', paddingTop: '8px' }}>
                                                                        <p style={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>Account No :</p>
                                                                        <p style={{ fontSize: '14px', fontWeight: '500' }}>1234567890123456</p>
                                                                    </tr>
                                                                    <tr style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', paddingTop: '6px' }}>
                                                                        <p style={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>Sort Code :</p>
                                                                        <p style={{ fontSize: '14px', fontWeight: '500' }}>147852</p>
                                                                    </tr>
                                                                </td> */}
                                <td style={{ width: '750px' }} >
                                  <table style={{ width: '100%', borderSpacing: 0, }}>
                                    <tbody>
                                      <tr style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: '10px', marginTop: '8px' }}>
                                        <p style={{ textAlign: 'end', fontSize: '14px', fontWeight: '500' }}>Total Amount :</p>
                                        <p style={{ textAlign: 'end', fontWeight: '500', fontSize: '14px', width: '150px' }}>2500 AED</p>
                                      </tr>
                                      {/* <tr style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: '10px', marginTop: '8px' }}>
                                                                                <p style={{ textAlign: 'end', fontSize: '14px', fontWeight: '500' }}>Tax Amount :</p>
                                                                                <p style={{ textAlign: 'end', fontWeight: '500', fontSize: '14px', width: '100px' }}>{totalTaxAmount.toFixed(2)}</p>
                                                                            </tr>
                                                                            <tr style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: '10px', marginTop: '8px' }}>
                                                                                <p style={{ textAlign: 'end', fontSize: '14px', fontWeight: '500' }}>Grant Total :</p>
                                                                                <p style={{ textAlign: 'end', fontWeight: '500', fontSize: '14px', width: '100px' }}>{grandTotal.toFixed(2)} AED </p>
                                                                            </tr> */}

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
                      <td style={{ verticalAlign: 'top', width: '100%', paddingRight: '20px', paddingBottom: '20px' }}>
                        <h1 style={{ fontSize: '16px', fontWeight: '500', marginTop: '16px' }}>Additional Instruction :</h1>
                        <div style={{ fontSize: '13px', lineHeight: '20px', marginTop: '4px', color: '#99a0ac' }}>
                          <p style={{ position: 'relative', paddingLeft: '20px' }}>
                            <span style={{ position: 'absolute', left: '0', top: '0', fontSize: '22px' }}>•</span>
                            {poDetails?.additional_instructions}
                          </p>
                          {/* <p style={{ position: 'relative', paddingLeft: '20px' }}>
                                                    <span style={{ position: 'absolute', left: '0', top: '0', fontSize: '22px' }}>•</span>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                                </p>
                                                <p style={{ position: 'relative', paddingLeft: '20px' }}>
                                                    <span style={{ position: 'absolute', left: '0', top: '0', fontSize: '22px' }}>•</span>
                                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                                </p> */}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </tfoot>
              )
            }

          </table>
        </div>
      </div>
    </div>
  )
}

export default SellerPurchasedOrderDetails