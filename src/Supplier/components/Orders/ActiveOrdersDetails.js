import React, { useEffect, useState } from 'react';
import './orderdetails.css'
import ActiveAssignDriver from './details/ActiveAssignDriver';
import { Link, useNavigate, useParams } from 'react-router-dom';
import OrderCustomModal from './OrderCustomModal';
import ActiveCodinator from './ActiveCodinator';
import ActiveInvoiceList from './ActiveInvoiceList';
import { apiRequests } from '../../../api';

const ActiveOrdersDetails = ({ socket }) => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [orderDetails, setOrderDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [refresh, setRefresh] = useState(false)

    const fetchData = async () => {
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
        try {
            const response = await apiRequests.getRequest(`order/get-specific-order-details/${orderId}`, obj)
            if (response.code === 200) {
                setOrderDetails(response.result);
            }
        } catch (error) {
            console.log('error in order details api');
        }
    }

    useEffect(() => {
        fetchData()
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
                <div className='active-order-details-conatiner-heading'>
                    <span>Order ID: {orderDetails?.order_id} </span>
                    <span className='active-details-medicine-details'>
                        {orderDetails?.items?.map((item, index) => (
                            <React.Fragment key={item._id || index}>
                                <span> {item.medicine_name} ({item.strength}) </span>
                                {index < orderDetails.items.length - 1 &&  " || "}
                            </React.Fragment>
                        ))}
                    </span>
                    <Link className='active-order-details-link-tag' to={`/supplier/buyer-details/${orderDetails?.buyer_id}`}>
                        <span className='active-details-purchsed-by'>Purchased By: </span><span className='active-details-Buyer-name'>{orderDetails?.buyer?.buyer_name}</span>
                    </Link>
                </div>
                {orderDetails?.status === "Shipment Details Submitted" && orderDetails?.invoice_status === "Invoice Created" && (
                    <Link to={`/supplier/create-invoice/${orderDetails?.order_id}`}>
                        <div className='active-order-main-create-invoice'>Create Invoice</div>
                    </Link>
                )}
            </div>
            <div className='active-order-details-section'>
                <div className='active-order-details-left-section'>
                    <div className='active-order-details-top-inner-section'>
                        <div className='active-order-details-left-inner-section-container'>
                            <div className='active-order-details-left-top-containers'>

                                <div className='active-order-details-top-order-cont'>
                                    <div className='active-order-details-left-top-main-heading'>Country of Origin</div>
                                    <div className='active-order-details-left-top-main-contents'> {orderDetails?.buyer?.country_of_origin}</div>
                                </div>
                                <div className='active-order-details-top-order-cont'>
                                    <div className='active-order-details-left-top-main-heading'>Company Type</div>
                                    <div className='active-order-details-left-top-main-contents'>{orderDetails?.buyer?.buyer_type}</div>
                                </div>
                                <div className='active-order-details-top-order-cont'>
                                    <div className='active-order-details-left-top-main-heading'> Order Status</div>
                                    <div className='active-order-details-left-top-main-contents'>
                                        {orderDetails?.status}
                                    </div>
                                </div>
                                {
                                    orderDetails?.status === 'Awaiting Details from Supplier' ?
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
            {/* {orderDetails?.shipment_details && Object.keys(orderDetails?.shipment_details).length > 0 && ( */}
            {/*             
            {(orderDetails?.shipment_details && Object.keys(orderDetails?.shipment_details).length > 0) ||
                 (orderDetails?.supplier_logistics_data && Object.keys(orderDetails?.supplier_logistics_data).length > 0) && ( */}

            {(orderDetails?.shipment_details?.supplier_details &&
                Object.keys(orderDetails.shipment_details.supplier_details).length > 0) ||
                (orderDetails?.supplier_logistics_data &&
                    Object.keys(orderDetails?.supplier_logistics_data).length > 0) ? (
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
                                    {orderDetails?.shipment_details?.shipment_details?.breadth || '2'} cm
                                </div>
                            </div>
                        </Link>
                        <div className="buyer-order-details-top-order-cont">
                            <div className="buyer-order-details-left-top-main-heading">
                                Height
                            </div>
                            <div className="buyer-order-details-left-top-main-contents">
                                {orderDetails?.shipment_details?.shipment_details?.height || '5'} cm
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
                                {orderDetails?.shipment_details?.shipment_details?.total_volume || '30'} L
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
            {/* end the main component heading */}
            {/* Start the end section */}
            <div className='active-order-details-payment-container'>
                <div className='active-order-details-payment-left-section'>
                    <div className='active-order-details-payment-terms-cont'>
                        {/* {orderDetails?.status === 'Shipment Details Submitted' || orderDetails?.status === 'Completed' && ( */}
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
                        {/* )} */}
                        {orderDetails?.status === 'Completed' && (
                            <div className='active-order-details-payment-first-terms-cont'>
                                <div className='active-order-details-payment-detention-head'>Payment Status</div>
                                <div className='active-order-details-payment-detention-content'>
                                    <div className='active-order-details-payment-detention-date'>{orderDetails?.order_status === 'completed' ? '100% Done' : '60% Completed'}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>


                {/* {orderDetails?.shipment_details && Object.keys(orderDetails?.shipment_details).length > 0 && ( */}

                {/* {(orderDetails?.shipment_details && Object.keys(orderDetails?.shipment_details).length > 0) ||
                     (orderDetails?.supplier_logistics_data && Object.keys(orderDetails?.supplier_logistics_data).length > 0) && ( */}

                <div className='order-details-pickup-sec-container'>
                    {(orderDetails?.shipment_details?.supplier_details &&
                        Object.keys(orderDetails.shipment_details.supplier_details).length > 0) ||
                        (orderDetails?.supplier_logistics_data &&
                            Object.keys(orderDetails?.supplier_logistics_data).length > 0) ? (
                        <div className='active-order-details-payment-right-section'>
                            <div className='active-order-details-payment-right-section-heading'>Pickup Details</div>
                            <div className='active-order-details-payment-right-details-row'>
                                <div className='active-order-details-right-details-row-one'>
                                    <div className='active-order-details-right-pickupdata'>
                                        <div className='active-order-details-right-pickdata-head'>Consignor Name</div>
                                        <div className='active-order-details-right-pickdata-text'>
                                            {orderDetails?.shipment_details?.supplier_details?.name ||
                                                orderDetails?.supplier_logistics_data?.full_name}
                                        </div>
                                    </div>
                                    <div className='active-order-details-right-pickupdata'>
                                        <div className='active-order-details-right-pickdata-head'>Phone No.</div>
                                        <div className='active-order-details-right-pickdata-text'>
                                            {orderDetails?.shipment_details?.supplier_details?.mobile ||
                                                orderDetails?.supplier_logistics_data?.mobile_number}
                                        </div>
                                    </div>
                                    <div className='active-order-details-right-pickupdata-address'>
                                        <div className='active-order-details-right-pickdata-head'>Address</div>
                                        <div className='active-order-details-right-pickdata-text'>
                                            {orderDetails?.shipment_details?.supplier_details?.address ||
                                                `${orderDetails?.supplier_logistics_data?.house_name}, ${orderDetails?.supplier_logistics_data?.locality}, 
                        ${orderDetails?.supplier_logistics_data?.city}, ${orderDetails?.supplier_logistics_data?.state}, 
                        ${orderDetails?.supplier_logistics_data?.country}, ${orderDetails?.supplier_logistics_data?.pincode}.`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {(orderDetails?.logistics_details || orderDetails?.buyer_logistics_data) && (
                        <>
                            <hr className='active-order-details-right-pickupdata-hr' />
                            <div className='active-order-details-payment-right-section'>
                                <div className='active-order-details-payment-right-section-heading'>Drop Details</div>
                                <div className='active-order-details-right-details-row-one'>
                                    <div className='active-order-details-right-pickupdata'>
                                        <div className='active-order-details-right-pickdata-head'>Consignee Name</div>
                                        <div className='active-order-details-right-pickdata-text'>
                                            {orderDetails?.logistics_details?.drop_location?.name || orderDetails?.buyer_logistics_data?.full_name}
                                        </div>
                                    </div>
                                    <div className='active-order-details-right-pickupdata'>
                                        <div className='active-order-details-right-pickdata-head'>Phone No.</div>
                                        <div className='active-order-details-right-pickdata-text'>
                                            {orderDetails?.logistics_details?.drop_location?.mobile || orderDetails?.buyer_logistics_data?.mobile_number}
                                        </div>
                                    </div>
                                    <div className='active-order-details-right-pickupdata-address'>
                                        <div className='active-order-details-right-pickdata-head'>Address</div>
                                        <div className='active-order-details-right-pickdata-text'>
                                            {orderDetails?.logistics_details?.drop_location?.address || orderDetails?.buyer_logistics_data?.house_name},
                                            {orderDetails?.logistics_details?.drop_location?.country || orderDetails?.buyer_logistics_data?.locality},
                                            {orderDetails?.logistics_details?.drop_location?.state || orderDetails?.buyer_logistics_data?.country},
                                            {orderDetails?.logistics_details?.drop_location?.city_district || orderDetails?.buyer_logistics_data?.state},
                                            {orderDetails?.logistics_details?.drop_location?.pincode || orderDetails?.buyer_logistics_data?.pincode}.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </div>
            {/* End the section */}
            {/* Start the assign driver section */}
            {/* {orderDetails?.coordinators && Object.keys(orderDetails?.coordinators).length > 0 && ( */}
            {orderDetails?.status === "Completed" && (
                <div className='active-order-details-codinator'>
                    <ActiveCodinator productList={orderDetails?.items} />
                </div>
            )}
            {/* End the assign driver section */}
            {/* {
                orderDetails?.order_status === 'compla'
            } */}
            {orderDetails?.invoices && orderDetails?.invoices.length > 0 && (
                <div className='active-order-details-invoice-list-section'>
                    <ActiveInvoiceList invoiceData={orderDetails?.invoices} />
                </div>
            )}
            {/* Modal Component */}
            <OrderCustomModal
                show={showModal}
                onClose={closeModal}
                buyerData={orderDetails?.buyer}
                logiscticsData={orderDetails?.logistics_details}
                orderId={orderId}
                buyerId={orderDetails?.buyer_id}
                setRefresh={setRefresh}
                socket={socket}
            />
        </div>
    )
}

export default ActiveOrdersDetails;
