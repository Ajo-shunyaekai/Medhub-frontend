import React, { useEffect, useState } from 'react';
import '../style/orderdetails.css';
import AssignDriver from './details/AssignDriver';
import CustomModal from './CustomOrderModal'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';
import moment from 'moment-timezone';

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [activeButton, setActiveButton] = useState('1h');
    const [orderDetails, setOrderDetails] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem('buyer_id');
        const buyerIdLocalStorage = localStorage.getItem('buyer_id');

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate('/buyer/login');
            return;
        }

        const obj = {
            order_id: orderId,
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
        };

        postRequestWithToken('buyer/order/order-details', obj, (response) => {
            if (response.code === 200) {
                setOrderDetails(response.result);
            } else {
                console.log('error in order details api');
            }
        });
    }, [navigate, orderId]);

    const handleButtonClick = (value) => {
        setActiveButton(value);
    };

    const handleModalSubmit = (data) => {
        // Handle the data from the modal
        console.log('Modal Data:', data);

        // Update order status (Assuming we have an API to update the order status)
        const updateData = {
            order_id: orderId,
            status: 'Awaiting Details from Seller',
            logistics_details: data,
        };

        postRequestWithToken('buyer/order/update-status', updateData, (response) => {
            if (response.code === 200) {
                // Update the orderDetails state with the new status
                setOrderDetails((prevDetails) => ({
                    ...prevDetails,
                    order_status: 'Awaiting Details from Seller',
                }));
            } else {
                console.log('Error updating order status');
            }
        });
    };

    return (
        <div className="buyer-order-details-container">
            <div className="buyer-order-details-conatiner-heading">
                Order ID: <span>{orderDetails?.order_id || '987456321'}</span>
            </div>
            <div className="buyer-order-details-section">
                <div className="buyer-order-details-left-section">
                    <div className="buyer-order-details-top-inner-section">
                        <div className="buyer-order-details-left-inner-section-container">
                            <div className="buyer-order-details-left-top-containers">
                                <Link to={`/buyer/supplier-details/${orderDetails?.supplier_id}`}>
                                    <div className="buyer-order-details-top-order-cont">
                                        <div className="buyer-order-details-left-top-main-heading">
                                            Seller Name
                                        </div>
                                        <div className="buyer-order-details-left-top-main-contents">
                                            {orderDetails?.supplier?.supplier_name ||
                                                'Pharmaceuticals Pvt Ltd'}
                                        </div>
                                    </div>
                                </Link>
                                <div className="buyer-order-details-top-order-cont">
                                    <div className="buyer-order-details-left-top-main-heading">
                                        Order Status
                                    </div>
                                    <div className="buyer-order-details-left-top-main-contents">
                                        {orderDetails?.order_status || 'In-Transit'}
                                    </div>
                                </div>
                                <div className="buyer-order-details-top-order-cont">
                                    <div
                                        className="buyer-order-details-left-top-main-heading-button"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        Book Logistics
                                    </div>
                                    <div className="buyer-order-details-left-top-main-contents"></div>
                                </div>
                            </div>
                            <div className="buyer-order-details-left-bottom-containers">
                                <div className="buyer-order-details-left-bottom-vehichle">
                                    <div className="buyer-order-details-left-bottom-vehicle-head">
                                        Date & Time
                                    </div>
                                    <div className="buyer-order-details-left-bottom-vehicle-text">
                                        {moment(orderDetails?.created_at)
                                            .tz('Asia/Kolkata')
                                            .format('DD-MM-YYYY HH:mm')}
                                    </div>
                                </div>
                                <div className="buyer-order-details-left-bottom-vehichle-no">
                                    <div className="buyer-order-details-left-bottom-vehichle-no-head">
                                        Payment Status
                                    </div>
                                    <div className="buyer-order-details-left-bottom-vehichle-no-text">
                                        30% payment done.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* start the assign driver section */}
            <div className="buyer-order-details-assign-driver-section">
                <AssignDriver orderItems={orderDetails?.items} />
            </div>
            {/* end the assign driver section */}
            {/* Start the end section */}
            <div className="buyer-order-details-payment-container">
                <div className="buyer-order-details-payment-left-section">
                    <div className="buyer-order-details-payment-terms-cont">
                        <div className="buyer-order-details-payment-first-terms-cont">
                            <div className="buyer-order-details-payment-first-terms-heading">
                                Payment Terms
                            </div>
                            <div className="buyer-order-details-payment-first-terms-text">
                                <ul className="buyer-order-details-payment-ul-section">
                                    <li className="buyer-order-details-payment-li-section">
                                        30% advance payment 70% on delivery.
                                    </li>
                                    <li className="buyer-order-details-payment-li-section">
                                        50% advance payment 50% on delivery.
                                    </li>
                                    <li className="buyer-order-details-payment-li-section">
                                        70% advance payment 30% on delivery.
                                    </li>
                                    <li className="buyer-order-details-payment-li-section">
                                        100% advance payment.
                                    </li>
                                    <li className="buyer-order-details-payment-li-section">
                                        100% payment on delivery.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="buyer-order-details-payment-right-section">
                    <div className="buyer-order-details-payment-right-section-heading">
                        Shipping Details
                    </div>
                    <div className="buyer-order-details-payment-right-details-row">
                        <div className="buyer-order-details-right-details-row-one">
                            <div className="buyer-order-details-right-pickupdata">
                                <div className="buyer-order-details-right-pickdata-head">
                                    Consignor Name
                                </div>
                                <div className="buyer-order-details-right-pickdata-text">
                                    {orderDetails?.shipping_details?.consignor_name ||
                                        'Surya Kumar sharma'}
                                </div>
                            </div>
                            <div className="buyer-order-details-right-pickupdata">
                                <div className="buyer-order-details-right-pickdata-head">Phone No.</div>
                                <div className="buyer-order-details-right-pickdata-text">
                                    {orderDetails?.shipping_details?.mobile_no ||
                                        '+971 563658956'}
                                </div>
                            </div>
                            <div className="buyer-order-details-right-pickupdata-address">
                                <div className="buyer-order-details-right-pickdata-head">Address</div>
                                <div className="buyer-order-details-right-pickdata-text">
                                    {orderDetails?.shipping_details?.address ||
                                        'Financial Center Rd, Along Sheik zayed road, Dubai 22155.'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* end the section */}
            <CustomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
};

export default OrderDetails;
