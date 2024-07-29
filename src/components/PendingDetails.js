import React, { useEffect, useState } from 'react';
import Orderdetails from '../style/orderdetails.css'
import WorldMap from "react-svg-worldmap";
import OrderDetailsCircularBar from './chart/OrderDetailsCircularBar';
import { Link } from 'react-router-dom';
import ProductList from './details/ProductList';
import { useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';

const PendingDetails = () => {
    const navigate    = useNavigate()
    const { orderId } = useParams()

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
            <div className='order-details-conatiner-heading'>Order ID: <span>{orderDetails?.order_id}</span></div>
            <div className='order-details-section'>
                <div className='order-details-left-section'>
                    <div className='order-details-top-inner-section'>
                        <div className='order-details-left-inner-section-container'>
                            <div className='order-details-left-top-containers'>
                            <Link to={`/buyer/supplier-details/${orderDetails?.supplier_id}`}>
                                <div className='order-details-top-order-cont'>
                                    <div className='order-details-left-top-main-heading'> Seller Name</div>
                                    <div className='order-details-left-top-main-contents'> {orderDetails?.supplier?.supplier_name}</div>
                                </div>
                                </Link>
                                <div className='order-details-top-order-cont'>
                                    <div className='order-details-left-top-main-heading'> Type</div>
                                    <div className='order-details-left-top-main-contents'>Manufacturer</div>
                                </div>
                                <div className='order-details-top-order-cont'>
                                    <div className='order-details-left-top-main-heading'> Order Status</div>
                                    <div className='order-details-left-top-main-contents'> {orderDetails?.order_status}</div>
                                </div>
                            </div>    
                        </div> 
                    </div>
                </div>
            </div>
          
            <div className='order-details-assign-driver-section'>
                <ProductList orderItems = {orderDetails?.items}/>
            </div>
            
            {/* <div className='order-details-payment-container'>
                <div className='order-details-payment-left-section'>
                    <div className='order-details-payment-terms-cont'>
                        <div className='order-details-payment-first-terms-cont'>
                            <div className='order-details-payment-first-terms-heading'>Payment Terms</div>
                            <div className='order-details-payment-first-terms-text'>{orderDetails?.payment_terms}</div>
                        </div>
                        <div className='order-details-payment-first-terms-cont'>
                            <div className='order-details-payment-first-terms-heading'>Est. Delivery Time</div>
                            <div className='order-details-payment-first-terms-text'>{orderDetails?.est_delivery_time}</div>
                        </div>
                    </div>
                    <div className='order-details-payment-detention-cont'>
                        <div className='order-details-payment-detention-head'>Due Invoices</div>
                        <div className='order-details-payment-detention-content'>
                            <div className='order-details-payment-detention-date'>20</div>
                            
                        </div>
                    </div>
                    <div className='order-details-payment-remark-cont'>
                        <div className='order-details-payment-remark-head'>Remarks</div>
                        
                        <div className='order-details-payment-remark-text'>{orderDetails?.remarks ? orderDetails?.remarks : 'N/A'}</div>
                        
                    </div>
                </div>
                <div className='order-details-payment-right-section'>
                    <div className='order-details-payment-right-section-heading'>Shipping Details</div>
                    <div className='order-details-payment-right-details-row'>
                        <div className='order-details-right-details-row-one'>
                            <div className='order-details-right-pickupdata'>
                                <div className='order-details-right-pickdata-head'>Consignor Name</div>
                                <div className='order-details-right-pickdata-text'>{orderDetails?.shipping_details?.consignor_name}</div>
                            </div>
                            <div className='order-details-right-pickupdata'>
                                <div className='order-details-right-pickdata-head'>Phone No.</div>
                                <div className='order-details-right-pickdata-text'>{orderDetails?.shipping_details?.mobile_no}</div>
                            </div>
                            <div className='order-details-right-pickupdata-address'>
                                <div className='order-details-right-pickdata-head'>Address</div>
                                <div className='order-details-right-pickdata-text'>{orderDetails?.shipping_details?.address}</div>
                            </div>
                        </div>
                        
                        
                        
                    </div>
                </div>
            </div> */}

            <div className='order-details-payment-pending-container'>
                <div className='order-details-payment-pending-left-section'>
                    <div className='order-details-payment-pending-terms-cont'>
                        <div className='order-details-payment-pending-first-terms-cont'>
                            <div className='order-details-payment-first-terms-heading'>Est. Delivery Time</div>
                            <div className='order-details-payment-first-terms-text'>15 Days</div>
                        </div>
                    </div>
                </div>
                <div className='order-details-paymen-pending-right-section'>
                    <div className='order-details-payment-first-terms-containers'>
                        <div className='order-details-payment-first-terms-heading'>Payment Terms</div>
                        <div className='order-details-payment-first-terms-text'>
                            <ul className='order-details-payment-ul-section'>
                                <li className='order-details-payment-li-section'>30% advance payment 70% on delivery.</li>
                                <li className='order-details-payment-li-section'>50% advance payment 50% on delivery.</li>
                                <li className='order-details-payment-li-section'>70% advance payment 30% on delivery.</li>
                                <li className='order-details-payment-li-section'>100% advance payment.</li>
                                <li className='order-details-payment-li-section'>100% payment on delivery.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className='pending-order-button-section'>
                <a href='mailto:supplier@example.com?subject=Inquiry%20about%20Order%20987456321' className='pending-order-contact-order'>
                    Contact Supplier
                </a>
                <Link to='/buyer/Create-PO'>
                    <div className='pending-order-create-order'>Create Purchased Order</div>
                </Link>
            </div>

           
        </div>
    )
}

export default PendingDetails