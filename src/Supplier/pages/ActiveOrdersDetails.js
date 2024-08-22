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
    const [refresh, setRefresh] = useState(false)

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
    }, [orderId, navigate, refresh]);

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
                                    <div className='active-order-details-left-top-main-contents'> {orderDetails?.status.charAt(0).toUpperCase() + orderDetails?.status.slice(1)}</div>
                                </div>
                                {
                                    orderDetails?.status === 'Awaiting details from supplier' ?
                                        <div className='active-order-details-top-order-cont'>
                                            <div
                                                className='active-order-details-left-top-main-heading-button'
                                                onClick={openModal}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Submit Details
                                            </div>
                                        </div> : ''
                                }

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
                <ActiveAssignDriver productList={orderDetails?.items} />
            </div>
            {/* End the assign driver section */}
            {/* start the main component heading */}
            {orderDetails?.coordinators && Object.keys(orderDetails?.coordinators).length > 0 && (
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
                        <div className='active-order-details-left-bottom-vehichle-no-text'>{orderDetails?.shipment_details?.supplier_details?.prefered_pickup_time}</div>
                    </div>
                </div>
            )}
            {/* end the main component heading */}
            {/* start the main component heading */}
            {orderDetails?.shipment_details && Object.keys(orderDetails?.shipment_details).length > 0 && (
                <div className='active-order-details-middle-bottom-containers'>
                    <div className='active-order-details-left-middle-vehichle-no'>
                        <div className='active-order-details-middle-bottom-vehicle-head'>No. of Packages</div>
                        <div className='active-order-details-middle-bottom-vehicle-text'>{orderDetails?.shipment_details?.shipment_details?.no_of_packages || '5'}</div>
                    </div>
                    <div className='active-order-details-left-middle-vehichle-no'>
                        <div className='active-order-details-middle-bottom-vehicle-head'>Total Weight</div>
                        <div className='active-order-details-middle-bottom-vehicle-text'>{orderDetails?.shipment_details?.shipment_details?.total_weight} Kg</div>
                    </div>
                    <div className="buyer-order-details-left-top-containers">
                        <Link to={`/buyer/supplier-details/${orderDetails?.supplier_id}`}>
                            <div className="buyer-order-details-top-order-cont">
                                <div className="buyer-order-details-left-top-main-heading">
                                    Width
                                </div>
                                <div className="buyer-order-details-left-top-main-contents">
                                    {orderDetails?.shipment_details?.shipment_details?.breadth || '2'} cm
                                </div>
                            </div>
                        </Link>
                        <div className="buyer-order-details-top-order-cont">
                            <div className="buyer-order-details-left-top-main-heading">
                                Height
                            </div>
                            <div className="buyer-order-details-left-top-main-contents">
                                {orderDetails?.shipment_details?.shipment_details?.height || '6'} cm
                            </div>
                        </div>
                        <div className="buyer-order-details-top-order-cont">
                            <div className="buyer-order-details-left-top-main-heading">
                                Length
                            </div>
                            <div className="buyer-order-details-left-top-main-contents">
                                {orderDetails?.shipment_details?.shipment_details?.length || '3'} cm
                            </div>
                        </div>
                        <div className="buyer-order-details-top-order-cont">
                            <div className="buyer-order-details-left-top-main-heading">
                                Total Volume
                            </div>
                            <div className="buyer-order-details-left-top-main-contents">
                                {orderDetails?.shipment_details?.shipment_details?.length || '3'} cm
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* end the main component heading */}
            {/* Start the end section */}
            <div className='active-order-details-payment-container'>
                <div className='active-order-details-payment-left-section'>
                    <div className='active-order-details-payment-terms-cont'>                    
                        <div className='active-order-details-payment-first-terms-cont'>
                            <div className='active-order-details-payment-first-terms-heading'>Payment Terms</div>
                            <div className='active-order-details-payment-first-terms-text'>
                                <ul className='active-order-details-payment-ul-section'>
                                    {
                                        orderDetails?.enquiry?.payment_terms?.map((data, i) => {
                                            return (
                                                <li className='active-order-details-payment-li-section'>{data}.</li>
                                            )


                                        })
                                    }

                                </ul>
                            </div>
                        </div>
                        <div className='active-order-details-payment-first-terms-cont'>
                            <div className='active-order-details-payment-detention-head'>Payment Status</div>
                            <div className='active-order-details-payment-detention-content'>
                                <div className='active-order-details-payment-detention-date'>{orderDetails?.order_status === 'completed' ? '100% Done' : '60% Completed'}</div>
                            </div>
                        </div>
                    </div>
                    {/* <div className='active-order-details-payment-detention-cont'>
                        <div className='active-order-details-payment-first-terms-heading'>Payment Terms</div>

                    </div> */}
                </div>
                <div className='active-order-details-payment-right-section'>

                    {orderDetails?.shipment_details && Object.keys(orderDetails?.shipment_details).length > 0 && (
                        <>
                            <div className='active-order-details-payment-right-section-heading'>Pickup Details</div>
                            <div className='active-order-details-payment-right-details-row'>
                                <div className='active-order-details-right-details-row-one'>
                                    <div className='active-order-details-right-pickupdata'>
                                        <div className='active-order-details-right-pickdata-head'>Consignor Name</div>
                                        <div className='active-order-details-right-pickdata-text'>{orderDetails?.shipment_details?.supplier_details?.name}</div>
                                    </div>
                                    <div className='active-order-details-right-pickupdata'>
                                        <div className='active-order-details-right-pickdata-head'>Phone No.</div>
                                        <div className='active-order-details-right-pickdata-text'>{orderDetails?.shipment_details?.supplier_details?.mobile}</div>
                                    </div>
                                    <div className='active-order-details-right-pickupdata-address'>
                                        <div className='active-order-details-right-pickdata-head'>Address</div>
                                        <div className='active-order-details-right-pickdata-text'>
                                            {orderDetails?.shipment_details?.supplier_details?.address},
                                            {orderDetails?.shipment_details?.supplier_details?.ciyt_disctrict},
                                            {orderDetails?.shipment_details?.supplier_details?.pincode}.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {orderDetails?.logistics_details && (
                        <>
                            <hr className='active-order-details-right-pickupdata-hr' />
                            <div className='active-order-details-payment-right-section-heading'>Drop Details</div>
                            <div className='active-order-details-right-details-row-one'>
                                <div className='active-order-details-right-pickupdata'>
                                    <div className='active-order-details-right-pickdata-head'>Consignee Name</div>
                                    <div className='active-order-details-right-pickdata-text'>{orderDetails.logistics_details.drop_location.name}</div>
                                </div>
                                <div className='active-order-details-right-pickupdata'>
                                    <div className='active-order-details-right-pickdata-head'>Phone No.</div>
                                    <div className='active-order-details-right-pickdata-text'>{orderDetails.logistics_details.drop_location.mobile}</div>
                                </div>
                                <div className='active-order-details-right-pickupdata-address'>
                                    <div className='active-order-details-right-pickdata-head'>Address</div>
                                    <div className='active-order-details-right-pickdata-text'>{orderDetails.logistics_details.drop_location.address}</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {/* End the section */}
            {/* Start the assign driver section */}
            {orderDetails?.coordinators && Object.keys(orderDetails?.coordinators).length > 0 && (
                <div className='active-order-details-codinator'>
                    <ActiveCodinator productList={orderDetails?.items} />
                </div>
            )}
            {/* End the assign driver section */}
            {/* {
                orderDetails?.order_status === 'compla'
            } */}
            {orderDetails?.coordinators && Object.keys(orderDetails?.coordinators).length > 0 && (
                <div className='active-order-details-invoice-list-section'>
                    <ActiveInvoiceList />
                </div>
            )}
            {/* Modal Component */}
            <OrderCustomModal
                show={showModal}
                onClose={closeModal}
                buyerData={orderDetails?.buyer}
                orderId={orderId}
                buyerId={orderDetails?.buyer_id}
                setRefresh={setRefresh}
            />
        </div>
    )
}

export default ActiveOrdersDetails;
