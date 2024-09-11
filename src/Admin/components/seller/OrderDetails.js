import React, { useEffect, useState } from 'react';
import '../../style/adminsupplierdetails.css'
import AssignDriver from '../details/AssignDriver';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SellerActiveCodinator from './SellerActiveCodinator';
import SellerActiveInvoiceList from './SellerActiveInvoiceList';

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [orderDetails, setOrderDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
        const supplierIdLocalStorage = localStorage.getItem("supplier_id");

        const obj = {
            order_id: orderId,
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage
        };
    }, [orderId, navigate, refresh]);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className='active-order-details-container'>
            <div className='active-order-main-section-container'>
                <div className='active-order-details-conatiner-heading'>Order ID:<span>14785552</span></div>
            </div>
            <div className='active-order-details-section'>
                <div className='active-order-details-left-section'>
                    <div className='active-order-details-top-inner-section'>
                        <div className='active-order-details-left-inner-section-container'>
                            <div className='active-order-details-left-top-containers'>
                                <Link to={`/supplier/buyer-details/${orderDetails?.buyer_id}`}>
                                    <div className='active-order-details-top-order-cont'>
                                        <div className='active-order-details-left-top-main-heading'> Buyer Name</div>
                                        <div className='active-order-details-left-top-main-contents'>Pharmaceuticals</div>
                                    </div>
                                </Link>
                                <div className='active-order-details-top-order-cont'>
                                    <div className='active-order-details-left-top-main-heading'> Order Status</div>
                                    <div className='active-order-details-left-top-main-contents'>
                                        Shipment Details Submitted
                                    </div>
                                </div>
                            </div>
                            <div className='active-order-details-left-bottom-containers'>
                                <div className='buyer-order-details-left-bottom-vehichle'>
                                    <div className='active-order-details-left-bottom-vehicle-head'>Country of Origin</div>
                                    <div className='active-order-details-left-bottom-vehicle-text'>{orderDetails?.country_of_origin || 'India'}</div>
                                </div>
                                <div className='active-order-details-left-bottom-vehichle-no'>
                                    <div className='active-order-details-left-bottom-vehichle-no-head'>Type</div>
                                    <div className='active-order-details-left-bottom-vehichle-no-text'>{orderDetails?.buyer?.buyer_type || 'End User'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Start the assign driver section */}
            <div className='active-order-details-assign-driver-section'>
                <AssignDriver productList={orderDetails?.items} />
            </div>
            {/* End the assign driver section */}
            {/* start the main component heading */}
            <div className='active-order-details-left-bottom-containers'>
                <div className='active-order-details-left-bottom-vehichle'>
                    <div className='active-order-details-left-bottom-vehicle-head'>Cost</div>
                    <div className='active-order-details-left-bottom-vehicle-text'>12 USD</div>
                </div>
                <div className='active-order-details-left-bottom-vehichle-no'>
                    <div className='active-order-details-left-bottom-vehichle-no-head'>Shipment Price</div>
                    <div className='active-order-details-left-bottom-vehichle-no-text'>8 USD</div>
                </div>
                <div className='active-order-details-left-bottom-vehichle-no'>
                    <div className='active-order-details-left-bottom-vehichle-no-head'>Shipment Time</div>
                    <div className='active-order-details-left-bottom-vehichle-no-text'>12:00 PM</div>
                </div>
                <div className='active-order-details-left-bottom-vehichle-no'>
                    <div className='active-order-details-left-bottom-vehichle-no-head'>Preferred Time of Pickup</div>
                    <div className='active-order-details-left-bottom-vehichle-no-text'>12/10/2024 11:00AM to 12:00 PM</div>
                </div>
            </div>
            {/* end the main component heading */}
            {/* start the main component heading */}
            <div className='active-order-details-middle-bottom-containers'>
                <div className='active-order-details-left-middle-vehichle-no'>
                    <div className='active-order-details-middle-bottom-vehicle-head'>No. of Packages</div>
                    <div className='active-order-details-middle-bottom-vehicle-text'>{orderDetails?.shipment_details?.shipment_details?.no_of_packages || '5'}</div>
                </div>
                <div className='active-order-details-left-middle-vehichle-no'>
                    <div className='active-order-details-middle-bottom-vehicle-head'>Total Weight</div>
                    <div className='active-order-details-middle-bottom-vehicle-text'>{orderDetails?.shipment_details?.shipment_details?.total_weight || '6'} Kg</div>
                </div>
                <div className="buyer-order-details-left-top-containers">
                    <Link to={`/buyer/supplier-details/${orderDetails?.supplier_id}`}>
                        <div className="buyer-order-details-top-order-cont">
                            <div className="buyer-order-details-left-top-main-heading">
                                Width
                            </div>
                            <div className="buyer-order-details-left-top-main-contents">
                                14 cm
                            </div>
                        </div>
                    </Link>
                    <div className="buyer-order-details-top-order-cont">
                        <div className="buyer-order-details-left-top-main-heading">
                            Height
                        </div>
                        <div className="buyer-order-details-left-top-main-contents">
                            14 cm
                        </div>
                    </div>
                    <div className="buyer-order-details-top-order-cont">
                        <div className="buyer-order-details-left-top-main-heading">
                            Length
                        </div>
                        <div className="buyer-order-details-left-top-main-contents">
                            14 cm
                        </div>
                    </div>
                    <div className="buyer-order-details-top-order-cont">
                        <div className="buyer-order-details-left-top-main-heading">
                            Total Volume
                        </div>
                        <div className="buyer-order-details-left-top-main-contents">
                            426 L
                        </div>
                    </div>
                </div>
            </div>
            {/* end the main component heading */}
            {/* Start the end section */}
            <div className='active-order-details-payment-container'>
                <div className='active-order-details-payment-left-section'>
                    <div className='active-order-details-payment-terms-cont'>
                        <div className='active-order-details-payment-first-terms-cont'>
                            <div className='active-order-details-payment-first-terms-heading'>Payment Terms</div>
                            <div className='active-order-details-payment-first-terms-text'>
                                <ul className='active-order-details-payment-ul-section'>
                                    <li className='active-order-details-payment-li-section'>39% Advance Payment</li>
                                </ul>
                            </div>
                        </div>
                        {/* )} */}
                        <div className='active-order-details-payment-first-terms-cont'>
                            <div className='active-order-details-payment-detention-head'>Payment Status</div>
                            <div className='active-order-details-payment-detention-content'>
                                <div className='active-order-details-payment-detention-date'>30% Already Paid</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='active-order-details-payment-right-section'>
                    <>
                        <div className='active-order-details-payment-right-section-heading'>Pickup Details</div>
                        <div className='active-order-details-payment-right-details-row'>
                            <div className='active-order-details-right-details-row-one'>
                                <div className='active-order-details-right-pickupdata'>
                                    <div className='active-order-details-right-pickdata-head'>Consignor Name</div>
                                    <div className='active-order-details-right-pickdata-text'>Shivanshi Tripathi</div>
                                </div>
                                <div className='active-order-details-right-pickupdata'>
                                    <div className='active-order-details-right-pickdata-head'>Phone No.</div>
                                    <div className='active-order-details-right-pickdata-text'>+971 147852369</div>
                                </div>
                                <div className='active-order-details-right-pickupdata-address'>
                                    <div className='active-order-details-right-pickdata-head'>Address</div>
                                    <div className='active-order-details-right-pickdata-text'> C-12 Birlagram Nagda (M.P) Pincode: 456331
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    <>
                        <hr className='active-order-details-right-pickupdata-hr' />
                        <div className='active-order-details-payment-right-section-heading'>Drop Details</div>
                        <div className='active-order-details-right-details-row-one'>
                            <div className='active-order-details-right-pickupdata'>
                                <div className='active-order-details-right-pickdata-head'>Consignee Name</div>
                                <div className='active-order-details-right-pickdata-text'>Sachin Saxena</div>
                            </div>
                            <div className='active-order-details-right-pickupdata'>
                                <div className='active-order-details-right-pickdata-head'>Phone No.</div>
                                <div className='active-order-details-right-pickdata-text'>+971 147852369</div>
                            </div>
                            <div className='active-order-details-right-pickupdata-address'>
                                <div className='active-order-details-right-pickdata-head'>Address</div>
                                <div className='active-order-details-right-pickdata-text'>
                                    House No. 476 Udyog Vihar Phase 5 Sector 19 Gurugram Haryana Pincode: 122016
                                </div>
                            </div>
                        </div>
                    </>
                </div>
            </div>
            {/* End the section */}

            {/* Start the assign driver section */}
            <div className='active-order-details-codinator'>
                <SellerActiveCodinator/>
            </div>
            {/* End the assign driver section */}
            {/* {
                orderDetails?.order_status === 'compla'
            } */}
            <div className='active-order-details-invoice-list-section'>
                <SellerActiveInvoiceList />
            </div>
        </div>
    )
}

export default OrderDetails;