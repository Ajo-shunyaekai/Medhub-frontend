import React, { useEffect, useState } from 'react';
import '../style/orderdetails.css';
import AssignDriver from './details/AssignDriver';
import CustomModal from './CustomOrderModal'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';
import moment from 'moment-timezone';
import BuyerActiveCodinator from './BuyerActiveCodinator';

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const buyerIdSessionStorage = sessionStorage.getItem('buyer_id');
    const buyerIdLocalStorage = localStorage.getItem('buyer_id');

    const [activeButton, setActiveButton] = useState('1h');
    const [orderDetails, setOrderDetails] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
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
        console.log('Modal Data:', data);
        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate('/buyer/login');
            return;
        }
        let type = '';
        if (data.doorToDoor) {
            type = 'door to door';
        } else if (data.customClearance) {
            type = 'custom clearance';
        }

        // Create the logistics_details object
        const logisticsDetails = {
            type: type,
            prefered_mode: data.transportMode,
            drop_location: {
                name: data.dropLocation.name,
                mobile: data.dropLocation.contact,
                address: data.dropLocation.address
            },
            status: 'pending'
        };
        const obj = {
            order_id: orderId,
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
            supplier_id: orderDetails?.supplier_id,
            status: 'Awaiting Details from Supplier',
            logistics_details: [logisticsDetails],
        };

        postRequestWithToken('buyer/order/book-logistics', obj, (response) => {
            if (response.code === 200) {
                // setOrderDetails((prevDetails) => ({
                //     ...prevDetails,
                //     order_status : 'Awaiting Details from Seller',
                // }));
                postRequestWithToken('buyer/order/order-details', obj, (response) => {
                    if (response.code === 200) {
                        setOrderDetails(response.result);
                    } else {
                        console.log('error in order details api');
                    }
                });
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
                                        {orderDetails?.status}
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
                                        {moment(orderDetails?.created_at).tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss')}
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
            </div>
            {/* end the main component heading */}
            {/* start the main component heading */}
            <div className='active-order-details-middle-bottom-containers'>
                <div className='active-order-details-left-middle-vehichle-no'>
                    <div className='active-order-details-middle-bottom-vehicle-head'>Preferred Time of Pickup</div>
                    <div className='active-order-details-middle-bottom-vehicle-text'>09-08-2024 14:00 PM</div>
                </div>
                <div className='active-order-details-left-middle-vehichle-no'>
                    <div className='active-order-details-middle-bottom-vehicle-head'>No. of Packages</div>
                    <div className='active-order-details-middle-bottom-vehicle-text'>18</div>
                </div>
                <div className='active-order-details-left-middle-vehichle-no'>
                    <div className='active-order-details-middle-bottom-vehicle-head'>Total Weight</div>
                    <div className='active-order-details-middle-bottom-vehicle-text'>4 Kg</div>
                </div>
            </div>
            {/* end the main component heading */}
            <div className="buyer-order-details-left-top-containers">
                <Link to={`/buyer/supplier-details/${orderDetails?.supplier_id}`}>
                    <div className="buyer-order-details-top-order-cont">
                        <div className="buyer-order-details-left-top-main-heading">
                            Width
                        </div>
                        <div className="buyer-order-details-left-top-main-contents">
                            12 cm
                        </div>
                    </div>
                </Link>
                <div className="buyer-order-details-top-order-cont">
                    <div className="buyer-order-details-left-top-main-heading">
                        Height
                    </div>
                    <div className="buyer-order-details-left-top-main-contents">
                        20 cm 
                    </div>
                </div>
                <div className="buyer-order-details-top-order-cont">
                    <div className="buyer-order-details-left-top-main-heading">
                        length
                    </div>
                    <div className="buyer-order-details-left-top-main-contents">
                        12cm
                    </div>
                </div>
            </div>
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
            {/* end the section */}
            {/* Start the assign driver section */}
            <div className='buyer-order-details-codinator-section-cont'>
                <BuyerActiveCodinator productList={orderDetails?.items} />
            </div>
            {/* End the assign driver section */}
            <CustomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
};

export default OrderDetails;
