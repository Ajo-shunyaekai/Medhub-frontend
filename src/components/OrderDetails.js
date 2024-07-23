import React, { useEffect, useState } from 'react';
import Orderdetails from '../style/orderdetails.css'
import AssignDriver from './details/AssignDriver';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';

const OrderDetails = () => {
    const { orderId } = useParams()
    const navigate    = useNavigate()

    const [activeButton, setActiveButton] = useState('1h');

    const handleButtonClick = (value) => {
        setActiveButton(value);
    };
    const [orderDetails, setOrderDetails] = useState()

    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        navigate("/buyer/login");
        return;
        }

        const obj = {
            order_id : orderId,
            buyer_id : buyerIdSessionStorage || buyerIdLocalStorage
        }

        postRequestWithToken('buyer/order/order-details', obj, async (response) => {
            if (response.code === 200) {
                setOrderDetails(response.result)
            } else {
               console.log('error in order details api');
            }
          })
    },[])
    
    return (
        <div className='order-details-container'>
            <div className='order-details-conatiner-heading'>Order ID: <span>{orderDetails?.order_id || '987456321'}</span></div>
            <div className='order-details-section'>
                <div className='order-details-left-section'>
                    <div className='order-details-top-inner-section'>
                        <div className='order-details-left-inner-section-container'>
                            <div className='order-details-left-top-containers'>
                                <Link to='/buyer/supplier-details/86756'>
                                    <div className='order-details-top-order-cont'>
                                        <div className='order-details-left-top-main-heading'> Seller Name</div>
                                        <div className='order-details-left-top-main-contents'> {orderDetails?.supplier?.supplier_name || 'Pharmaceuticals Pvt Ltd'}</div>
                                    </div>
                                </Link>
                                <div className='order-details-top-order-cont'>
                                    <div className='order-details-left-top-main-heading'> Order Status</div>
                                    <div className='order-details-left-top-main-contents'> {orderDetails?.order_status || 'In-Transit'}</div>
                                </div>
                                <div className='order-details-top-order-cont'>
                                    <div className='order-details-left-top-main-heading-button'> Tracking</div>
                                    <div className='order-details-left-top-main-contents'> </div>
                                </div>
                            </div>
                            {/* <div className='order-details-left-bottom-containers'>
                                <div className='order-details-left-bottom-vehichle'>
                                    <div className='order-details-left-bottom-vehicle-head'>Vehicle Type</div>
                                    <div className='order-details-left-bottom-vehicle-text'>20 FT Flatbed Open Body</div>
                                </div>
                                <div className='order-details-left-bottom-vehichle-no'>
                                    <div className='order-details-left-bottom-vehichle-no-head'>Total Cost</div>
                                    <div className='order-details-left-bottom-vehichle-no-text'>4000 AED</div>
                                </div>

                            </div> */}
                        </div>
                        {/* <div className='order-details-right-inner-section-container'>
                            <div className='order-details-right-inner-circular-bar-section'>
                                <div className='order-details-right-inner-section-heading'>Order Status</div>

                            </div>
                            <div className='order-details-right-inner-circular-bar-section'>
                                <div className='order-details-right-inner-section-heading'>Tracking</div>

                            </div>
                        </div> */}
                    </div>
                    {/* <div className='order-details-top-bottom-sction'>
                        <div className='order-details-top-bottom-order-sect'>
                            <div className='order-details-top-bottom-order-heading'>Commodity</div>
                            <div className='order-details-top-bottom-order-content'>Steel Plates - 20 Ton</div>
                        </div>
                        <div className='order-details-top-bottom-order-sect'>
                            <div className='order-details-top-bottom-order-heading'>Order Rate</div>
                            <div className='order-details-top-bottom-order-content'>AED 2152/TRWB</div>
                        </div>
                        <div className='order-details-top-bottom-order-sect'>
                            <div className='order-details-top-bottom-order-heading'>Order Date & Time</div>
                            <div className='order-details-top-bottom-order-content'>24/12/2019, 12:00 PM</div>
                        </div>
                    </div> */}


                </div>
                {/* <div className='order-details-right-section'>
                    <div className='order-details-map-container'>
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
            <div className='order-details-assign-driver-section'>
                <AssignDriver orderItems = {orderDetails?.items}/>
            </div>
            {/* end the assign driver section */}
            {/* Start the end section */}
            <div className='order-details-payment-container'>
                <div className='order-details-payment-left-section'>
                    <div className='order-details-payment-terms-cont'>
                        <div className='order-details-payment-first-terms-cont'>
                            <div className='order-details-payment-first-terms-heading'>Payment Terms</div>
                            <div className='order-details-payment-first-terms-text'>{orderDetails?.payment_terms || '20 Days'}</div>
                        </div>
                        <div className='order-details-payment-first-terms-cont'>
                            <div className='order-details-payment-first-terms-heading'>Est. Delivery Time</div>
                            <div className='order-details-payment-first-terms-text'>{orderDetails?.est_delivery_time || '15 Days'}</div>
                        </div>
                    </div>
                    <div className='order-details-payment-detention-cont'>
                        <div className='order-details-payment-detention-head'>Due Invoices</div>
                        <div className='order-details-payment-detention-content'>
                            <div className='order-details-payment-detention-date'>20</div>
                            {/* <div className='order-details-payment-detention-time'>AED 300</div> */}
                        </div>
                    </div>
                    <div className='order-details-payment-remark-cont'>
                        <div className='order-details-payment-remark-head'>Remarks</div>
                        {/* <div className='order-details-payment-remark-text'>Marketing and TV ads</div> */}
                        <div className='order-details-payment-remark-text'>{orderDetails?.remarks ? orderDetails?.remarks : 'N/A'}</div>
                        {/* <div className='order-details-payment-remark-text'>E-marketing maintenance</div> */}
                    </div>
                </div>
                <div className='order-details-payment-right-section'>
                    <div className='order-details-payment-right-section-heading'>Shipping Details</div>
                    <div className='order-details-payment-right-details-row'>
                        <div className='order-details-right-details-row-one'>
                            <div className='order-details-right-pickupdata'>
                                <div className='order-details-right-pickdata-head'>Consignor Name</div>
                                <div className='order-details-right-pickdata-text'>{orderDetails?.shipping_details?.consignor_name || 'Surya Kumar sharma'}</div>
                            </div>
                            <div className='order-details-right-pickupdata'>
                                <div className='order-details-right-pickdata-head'>Phone No.</div>
                                <div className='order-details-right-pickdata-text'>{orderDetails?.shipping_details?.mobile_no || '+971 563658956'}</div>
                            </div>
                            <div className='order-details-right-pickupdata-address'>
                                <div className='order-details-right-pickdata-head'>Address</div>
                                <div className='order-details-right-pickdata-text'>{orderDetails?.shipping_details?.address || 'Financial Center Rd, Along Sheik zayed road, Dubai 22155.'}</div>
                            </div>
                        </div>
                        {/* <hr className='order-details-right-pickupdata-hr' />
                        <div className='order-details-right-details-row-one'>
                            <div className='order-details-right-pickupdata'>
                                <div className='order-details-right-pickdata-head'>Consignor Name</div>
                                <div className='order-details-right-pickdata-text'>Ashok kumar chauhan</div>
                            </div>
                            <div className='order-details-right-pickupdata'>
                                <div className='order-details-right-pickdata-head'>Phone No.</div>
                                <div className='order-details-right-pickdata-text'>+971 562145214</div>
                            </div>
                            <div className='order-details-right-pickupdata-address'>
                                <div className='order-details-right-pickdata-head'>Address</div>
                                <div className='order-details-right-pickdata-text'>Financial Center Rd, Along Sheik zayed road, Dubai 22155.</div>
                            </div>
                        </div> */}
                        {/* <hr className='order-details-right-pickupdata-hr' /> */}
                        {/* <div className='order-details-payment-right-section-heading'>Drop Details</div>
                        <div className='order-details-right-details-row-one'>
                            <div className='order-details-right-pickupdata'>
                                <div className='order-details-right-pickdata-head'>Consignee Name</div>
                                <div className='order-details-right-pickdata-text'>Mustfa Zaved khan</div>
                            </div>
                            <div className='order-details-right-pickupdata'>
                                <div className='order-details-right-pickdata-head'>Phone No.</div>
                                <div className='order-details-right-pickdata-text'>+971 587452154</div>
                            </div>
                            <div className='order-details-right-pickupdata-address'>
                                <div className='order-details-right-pickdata-head'>Address</div>
                                <div className='order-details-right-pickdata-text'>Financial Center Rd, Along Sheik zayed road, Dubai 22155.</div>
                            </div>
                        </div>
                        <hr className='order-details-right-pickupdata-hr' />
                        <div className='order-details-right-details-row-one'>
                            <div className='order-details-right-pickupdata'>
                                <div className='order-details-right-pickdata-head'>Consignee Name</div>
                                <div className='order-details-right-pickdata-text'>John Hancko</div>
                            </div>
                            <div className='order-details-right-pickupdata'>
                                <div className='order-details-right-pickdata-head'>Phone No.</div>
                                <div className='order-details-right-pickdata-text'>+971 585421542</div>
                            </div>
                            <div className='order-details-right-pickupdata-address'>
                                <div className='order-details-right-pickdata-head'>Address</div>
                                <div className='order-details-right-pickdata-text'>Financial Center Rd, Along Sheik zayed road, Dubai 22155.</div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
            {/* end the section */}
        </div>
    )
}

export default OrderDetails