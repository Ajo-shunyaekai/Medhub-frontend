import React, { useEffect, useState } from 'react';
import '../style/orderdetails.css'
import ActiveAssignDriver from '../pages/details/ActiveAssignDriver';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';
import OrderCustomModal from './OrderCustomModal';
import ActiveCodinator from './ActiveCodinator';
import ActiveInvoiceList from './ActiveInvoiceList';

const ActiveOrdersDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [orderDetails, setOrderDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
        const supplierIdLocalStorage = localStorage.getItem("supplier_id");

        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }

        const obj = {
            order_id: orderId,
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage
        };

        postRequestWithToken('buyer/order/supplier-order-details', obj, (response) => {
            if (response.code === 200) {
                setOrderDetails(response.result);
            } else {
                console.log('error in order details api');
            }
        });
    }, [orderId, navigate]);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className='active-order-details-container'>
            <div className='active-order-details-conatiner-heading'>Order ID:<span>{orderDetails?.order_id}</span></div>
            <div className='active-order-details-section'>
                <div className='active-order-details-left-section'>
                    <div className='active-order-details-top-inner-section'>
                        <div className='active-order-details-left-inner-section-container'>
                            <div className='active-order-details-left-top-containers'>
                                <Link to={`/supplier/buyer-details/${orderDetails?.buyer_id}`}>
                                    <div className='active-order-details-top-order-cont'>
                                        <div className='active-order-details-left-top-main-heading'> Buyer Name</div>
                                        <div className='active-order-details-left-top-main-contents'> {orderDetails?.buyer?.buyer_name || 'MedicalLink Globals'}</div>
                                    </div>
                                </Link>
                                <div className='active-order-details-top-order-cont'>
                                    <div className='active-order-details-left-top-main-heading'> Order Status</div>
                                    <div className='active-order-details-left-top-main-contents'> {orderDetails?.order_status}</div>
                                </div>
                                <div className='active-order-details-top-order-cont'>
                                    <div
                                        className='active-order-details-left-top-main-heading-button'
                                        onClick={openModal}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Submit Details
                                    </div>
                                </div>
                            </div>
                            <div className='active-order-details-left-bottom-containers'>
                                <div className='active-order-details-left-bottom-vehichle'>
                                    <div className='active-order-details-left-bottom-vehicle-head'>Country of Origin</div>
                                    <div className='active-order-details-left-bottom-vehicle-text'>{orderDetails?.country_of_origin || 'India'}</div>
                                </div>
                                <div className='active-order-details-left-bottom-vehichle-no'>
                                    <div className='active-order-details-left-bottom-vehichle-no-head'>Type</div>
                                    <div className='active-order-details-left-bottom-vehichle-no-text'>End User</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Start the assign driver section */}
            <div className='active-order-details-assign-driver-section'>
                <ActiveAssignDriver productList={orderDetails?.items} />
            </div>
            {/* End the assign driver section */}
            {/* start the main component heading */}
            <div className='active-order-details-left-bottom-containers'>
                <div className='active-order-details-left-bottom-vehichle'>
                    <div className='active-order-details-left-bottom-vehicle-head'>Commodity</div>
                    <div className='active-order-details-left-bottom-vehicle-text'>Steel Plates - 20 Ton</div>
                </div>
                <div className='active-order-details-left-bottom-vehichle-no'>
                    <div className='active-order-details-left-bottom-vehichle-no-head'>Order Rate</div>
                    <div className='active-order-details-left-bottom-vehichle-no-text'>AED 2152/TRWB</div>
                </div>
                <div className='active-order-details-left-bottom-vehichle-no'>
                    <div className='active-order-details-left-bottom-vehichle-no-head'>Pickup Date & Time</div>
                    <div className='active-order-details-left-bottom-vehichle-no-text'>24/12/2019, 12:00 PM</div>
                </div>
            </div>
            {/* end the main component heading */}
            {/* Start the end section */}
            <div className='active-order-details-payment-container'>
                <div className='active-order-details-payment-left-section'>
                    <div className='active-order-details-payment-terms-cont'>
                        <div className='active-order-details-payment-first-terms-cont'>
                            <div className='active-order-details-payment-detention-head'>Payment Status</div>
                            <div className='active-order-details-payment-detention-content'>
                                <div className='active-order-details-payment-detention-date'>70% payment done</div>
                            </div>
                        </div>
                        <div className='active-order-details-payment-first-terms-cont'>
                            <div className='active-order-details-payment-first-terms-heading'>Est. Delivery Time</div>
                            <div className='active-order-details-payment-first-terms-text'>14 Days</div>
                        </div>
                    </div>
                    <div className='active-order-details-payment-detention-cont'>
                        <div className='active-order-details-payment-first-terms-heading'>Payment Terms</div>
                        <div className='active-order-details-payment-first-terms-text'>
                            <ul className='active-order-details-payment-ul-section'>
                                <li className='active-order-details-payment-li-section'>30% advance payment 70% on delivery.</li>
                                <li className='active-order-details-payment-li-section'>50% advance payment 50% on delivery.</li>
                                <li className='active-order-details-payment-li-section'>70% advance payment 30% on delivery.</li>
                                <li className='active-order-details-payment-li-section'>100% advance payment.</li>
                                <li className='active-order-details-payment-li-section'>100% payment on delivery.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='active-order-details-payment-right-section'>
                    <div className='active-order-details-payment-right-section-heading'>Pickup Details</div>
                    <div className='active-order-details-payment-right-details-row'>
                        <div className='active-order-details-right-details-row-one'>
                            <div className='active-order-details-right-pickupdata'>
                                <div className='active-order-details-right-pickdata-head'>Consignor Name</div>
                                <div className='active-order-details-right-pickdata-text'>Surya Kumar Sharma</div>
                            </div>
                            <div className='active-order-details-right-pickupdata'>
                                <div className='active-order-details-right-pickdata-head'>Phone No.</div>
                                <div className='active-order-details-right-pickdata-text'>+971 563658956</div>
                            </div>
                            <div className='active-order-details-right-pickupdata-address'>
                                <div className='active-order-details-right-pickdata-head'>Address</div>
                                <div className='active-order-details-right-pickdata-text'>Financial Center Rd, Along Sheik Zayed Road, Dubai 22155.</div>
                            </div>
                        </div>
                    </div>
                    <hr className='active-order-details-right-pickupdata-hr' />
                    <div className='active-order-details-payment-right-section-heading'>Drop Details</div>
                    <div className='active-order-details-right-details-row-one'>
                        <div className='active-order-details-right-pickupdata'>
                            <div className='active-order-details-right-pickdata-head'>Consignee Name</div>
                            <div className='active-order-details-right-pickdata-text'>Mustfa Zaved khan</div>
                        </div>
                        <div className='active-order-details-right-pickupdata'>
                            <div className='active-order-details-right-pickdata-head'>Phone No.</div>
                            <div className='active-order-details-right-pickdata-text'>+971 587452154</div>
                        </div>
                        <div className='active-order-details-right-pickupdata-address'>
                            <div className='active-order-details-right-pickdata-head'>Address</div>
                            <div className='active-order-details-right-pickdata-text'>Financial Center Rd, Along Sheik zayed road, Dubai 22155.</div>
                        </div>
                    </div>
                </div>
            </div>
            {/* End the section */}
            {/* Start the assign driver section */}
            <div className='active-order-details-codinator'>
                <ActiveCodinator productList={orderDetails?.items} />
            </div>
            {/* End the assign driver section */}
            <div className='active-order-details-invoice-list-section'>
                <ActiveInvoiceList />
            </div>
            {/* Modal Component */}
            <OrderCustomModal show={showModal} onClose={closeModal} />
        </div>
    )
}

export default ActiveOrdersDetails;
