import React, { useEffect, useState } from 'react';
import '../../style/adminsupplierdetails.css'
import AssignDriver from '../details/AssignDriver';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../../api/Requests';

const OrderDetails = ({productList}) => {

    const { orderId } = useParams()
    const navigate    = useNavigate()

    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");

    const [orderDetails, setOrderDetails] = useState()

    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
            return;
        }

        const obj = {
            order_id    : orderId,
            admin_id  : adminIdSessionStorage || adminIdLocalStorage,
        }

        postRequestWithToken('admin/order-details', obj, async (response) => {
            if (response.code === 200) {
                setOrderDetails(response.result)
            } else {
               console.log('error in order details api');
            }
          })
    },[])

    return (
        <div className='suppliers-details-container'>
        <div className='suppliers-details-conatiner-heading'>Order ID:<span>{orderDetails?.order_id}</span></div>
        <div className='suppliers-details-section'>
            <div className='suppliers-details-left-section'>
                <div className='suppliers-details-top-inner-section'>
                    <div className='suppliers-details-left-inner-section-container'>
                        <div className='suppliers-details-left-top-containers'>
                            <Link to={`/supplier/buyer-details/${orderDetails?.buyer_id}`}>
                                <div className='suppliers-details-top-order-cont'>
                                    <div className='suppliers-details-left-top-main-heading'> Buyer Name</div>
                                    <div className='suppliers-details-left-top-main-contents'> {orderDetails?.buyer?.buyer_name || 'MedicalLink Globals'}</div>
                                </div>
                            </Link>
                            <div className='suppliers-details-top-order-cont'>
                                <div className='suppliers-details-left-top-main-heading'> Order Status</div>
                                <div className='suppliers-details-left-top-main-contents'> {orderDetails?.order_status}</div>
                            </div>
                            <div className='suppliers-details-top-order-cont'>
                                <div className='suppliers-details-left-top-main-heading-button'> Tracking</div>
                                <div className='suppliers-details-left-top-main-contents'> </div>
                            </div>
                        </div>
                        <div className='suppliers-details-left-bottom-containers'>
                            <div className='suppliers-details-left-bottom-vehichle'>
                                <div className='suppliers-details-left-bottom-vehicle-head'>Vehicle Type</div>
                                <div className='suppliers-details-left-bottom-vehicle-text'>20 FT Flatbed Open Body</div>
                            </div>
                            <div className='suppliers-details-left-bottom-vehichle-no'>
                                <div className='suppliers-details-left-bottom-vehichle-no-head'>Total Cost</div>
                                <div className='suppliers-details-left-bottom-vehichle-no-text'>4000 AED</div>
                            </div>

                        </div>
                    </div>
                    {/* <div className='suppliers-details-right-inner-section-container'>
                        <div className='suppliers-details-right-inner-circular-bar-section'>
                            <div className='suppliers-details-right-inner-section-heading'>Order Status</div>

                        </div>
                        <div className='suppliers-details-right-inner-circular-bar-section'>
                            <div className='suppliers-details-right-inner-section-heading'>Tracking</div>

                        </div>
                    </div> */}
                </div>
                <div className='suppliers-details-top-bottom-sction'>
                    <div className='suppliers-details-top-bottom-order-sect'>
                        <div className='suppliers-details-top-bottom-order-heading'>Commodity</div>
                        <div className='suppliers-details-top-bottom-order-content'>Steel Plates - 20 Ton</div>
                    </div>
                    <div className='suppliers-details-top-bottom-order-sect'>
                        <div className='suppliers-details-top-bottom-order-heading'>Order Rate</div>
                        <div className='suppliers-details-top-bottom-order-content'>AED 2152/TRWB</div>
                    </div>
                    <div className='suppliers-details-top-bottom-order-sect'>
                        <div className='suppliers-details-top-bottom-order-heading'>Order Date & Time</div>
                        <div className='suppliers-details-top-bottom-order-content'>24/12/2019, 12:00 PM</div>
                    </div>
                </div>


            </div>
            {/* <div className='suppliers-details-right-section'>
                <div className='suppliers-details-map-container'>
                    <WorldMap
                        color="red"
                        value-suffix="people"
                        size="sm"
                        data={countryData}
                    />
                </div>
            </div> */}
        </div>
        {/* start the assign driver section */}
        <div className='suppliers-details-assign-driver-section'>
            <AssignDriver productList = {orderDetails?.items}/>
        </div>
        {/* end the assign driver section */}

        {/* Start the end section */}
        <div className='suppliers-details-payment-container'>
            <div className='suppliers-details-payment-left-section'>
                <div className='suppliers-details-payment-terms-cont'>
                    <div className='suppliers-details-payment-first-terms-cont'>
                        <div className='suppliers-details-payment-detention-head'>Due Invoices</div>
                        <div className='suppliers-details-payment-detention-content'>
                            <div className='suppliers-details-payment-detention-date'>20</div>
                            {/* <div className='suppliers-details-payment-detention-time'>AED 300</div> */}
                        </div>
                    </div>
                    <div className='suppliers-details-payment-first-terms-cont'>
                        <div className='suppliers-details-payment-first-terms-heading'>Est. Delivery Time</div>
                        <div className='suppliers-details-payment-first-terms-text'>22 Hour</div>
                    </div>
                </div>
                <div className='suppliers-details-payment-detention-cont'>
                    <div className='suppliers-details-payment-first-terms-heading'>Payment Terms</div>
                    <div className='suppliers-details-payment-first-terms-text'>
                        <ul className='suppliers-details-payment-ul-section'>
                            <li className='suppliers-details-payment-li-section'>30% advance payment 70% on delivery.</li>
                            <li className='suppliers-details-payment-li-section'>50% advance payment 50% on delivery.</li>
                            <li className='suppliers-details-payment-li-section'>70% advance payment 30% on delivery.</li>
                            <li className='suppliers-details-payment-li-section'>100% advance payment.</li>
                            <li className='suppliers-details-payment-li-section'>100% payment on delivery.</li>
                        </ul>
                    </div>

                </div>
                <div className='suppliers-details-payment-remark-cont'>
                    <div className='suppliers-details-payment-remark-head'>Remarks</div>
                    <div className='suppliers-details-payment-remark-text'>Increase 2.5% conversion rate Increase 2.5% conversion rate Increase 2.5% conversion rate</div>
                </div>
            </div>
            <div className='suppliers-details-payment-right-section'>
                <div className='suppliers-details-payment-right-section-heading'>Shipping Details</div>
                <div className='suppliers-details-payment-right-details-row'>
                    <div className='suppliers-details-right-details-row-one'>
                        <div className='suppliers-details-right-pickupdata'>
                            <div className='suppliers-details-right-pickdata-head'>Consignor Name</div>
                            <div className='suppliers-details-right-pickdata-text'>Surya Kumar sharma</div>
                        </div>
                        <div className='suppliers-details-right-pickupdata'>
                            <div className='suppliers-details-right-pickdata-head'>Phone No.</div>
                            <div className='suppliers-details-right-pickdata-text'>+971 563658956</div>
                        </div>
                        <div className='suppliers-details-right-pickupdata-address'>
                            <div className='suppliers-details-right-pickdata-head'>Address</div>
                            <div className='suppliers-details-right-pickdata-text'>Financial Center Rd, Along Sheik zayed road, Dubai 22155.</div>
                        </div>
                    </div>
                    <hr className='suppliers-details-right-pickupdata-hr' />
                    <div className='suppliers-details-right-details-row-one'>
                        <div className='suppliers-details-right-pickupdata'>
                            <div className='suppliers-details-right-pickdata-head'>Consignor Name</div>
                            <div className='suppliers-details-right-pickdata-text'>Ashok kumar chauhan</div>
                        </div>
                        <div className='suppliers-details-right-pickupdata'>
                            <div className='suppliers-details-right-pickdata-head'>Phone No.</div>
                            <div className='suppliers-details-right-pickdata-text'>+971 562145214</div>
                        </div>
                        <div className='suppliers-details-right-pickupdata-address'>
                            <div className='suppliers-details-right-pickdata-head'>Address</div>
                            <div className='suppliers-details-right-pickdata-text'>Financial Center Rd, Along Sheik zayed road, Dubai 22155.</div>
                        </div>
                    </div>
                    {/* <hr className='suppliers-details-right-pickupdata-hr' /> */}
                    {/* <div className='suppliers-details-payment-right-section-heading'>Drop Details</div>
                    <div className='suppliers-details-right-details-row-one'>
                        <div className='suppliers-details-right-pickupdata'>
                            <div className='suppliers-details-right-pickdata-head'>Consignee Name</div>
                            <div className='suppliers-details-right-pickdata-text'>Mustfa Zaved khan</div>
                        </div>
                        <div className='suppliers-details-right-pickupdata'>
                            <div className='suppliers-details-right-pickdata-head'>Phone No.</div>
                            <div className='suppliers-details-right-pickdata-text'>+971 587452154</div>
                        </div>
                        <div className='suppliers-details-right-pickupdata-address'>
                            <div className='suppliers-details-right-pickdata-head'>Address</div>
                            <div className='suppliers-details-right-pickdata-text'>Financial Center Rd, Along Sheik zayed road, Dubai 22155.</div>
                        </div>
                    </div>
                    <hr className='suppliers-details-right-pickupdata-hr' />
                    <div className='suppliers-details-right-details-row-one'>
                        <div className='suppliers-details-right-pickupdata'>
                            <div className='suppliers-details-right-pickdata-head'>Consignee Name</div>
                            <div className='suppliers-details-right-pickdata-text'>John Hancko</div>
                        </div>
                        <div className='suppliers-details-right-pickupdata'>
                            <div className='suppliers-details-right-pickdata-head'>Phone No.</div>
                            <div className='suppliers-details-right-pickdata-text'>+971 585421542</div>
                        </div>
                        <div className='suppliers-details-right-pickupdata-address'>
                            <div className='suppliers-details-right-pickdata-head'>Address</div>
                            <div className='suppliers-details-right-pickdata-text'>Financial Center Rd, Along Sheik zayed road, Dubai 22155.</div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
        {/* end the section */}
        {/* Start the button section */}
        <div className='suppliers-details-button-section'>
            <div className='suppliers-details-cancel-button'>Cancel</div>
            <div className='suppliers-details-submit-button'>Submit Quotation</div>
        </div>
        {/* End the button section */}
         </div>
    )
}

export default OrderDetails