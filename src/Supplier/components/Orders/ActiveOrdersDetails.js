import React, { useEffect, useState } from 'react';
import './orderdetails.css'
import ActiveAssignDriver from './details/ActiveAssignDriver';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
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
        const supplierIdSessionStorage = localStorage.getItem("supplier_id");
        const supplierIdLocalStorage = localStorage.getItem("supplier_id");

        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            localStorage.clear();
            navigate("/supplier/login");
            return;
        }

        const obj = {
            order_id: orderId,
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage
        };
        try {
            const response = await apiRequests.getRequest(`order/get-specific-order-details/${orderId}`, obj)
            if (response?.code === 200) {
                setOrderDetails(response.result);
            }
        } catch (error) {
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
                                {index < orderDetails.items.length - 1 && " || "}
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
                                    <div className='details-payment-inner-text'>Country of Origin</div>
                                    <div className='details-payment-content'> {orderDetails?.buyer?.country_of_origin}</div>
                                </div>
                                <div className='active-order-details-top-order-cont'>
                                    <div className='details-payment-inner-text'>Company Type</div>
                                    <div className='details-payment-content'>{orderDetails?.buyer?.buyer_type}</div>
                                </div>
                                <div className='active-order-details-top-order-cont'>
                                    <div className='details-payment-inner-text'> Order Status</div>
                                    <div className='details-payment-content'>
                                        {orderDetails?.status}
                                    </div>
                                </div>
                                {
                                    orderDetails?.status === 'Awaiting Details from Supplier' ?
                                        <div className='active-order-details-top-order-cont'>
                                            <Link to={`/supplier/logistics-form/${orderId}/${orderDetails?.supplier?._id}`}>
                                                <div
                                                    className='active-order-details-left-top-main-heading-button'
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    Submit Details
                                                </div>
                                            </Link>
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

            {/* Start the end section */}
            <div className='details-address-container'>
                <div className='details-payment-container'>
                    <span className='details-payment-heading'>Payment</span>
                    <div className='details-payment-section'>
                        <div className='details-payment-inner-section'>
                            <span className='details-payment-inner-text'>Payment Terms</span>
                            <ul className='details-payment-ul'>
                                {
                                    orderDetails?.enquiry?.payment_terms?.map((data, i) => {
                                        return (
                                            <li className='details-payment-content'> <MdOutlineKeyboardDoubleArrowRight className="icon" /> {data}.</li>
                                        )
                                    })
                                }

                            </ul>
                        </div>

                        {orderDetails?.status === 'Completed' && (
                            <div className='details-payment-inner-section'>
                                <span className='details-payment-inner-text'>Payment Status</span>
                                <div className='details-payment-content'>{orderDetails?.order_status === 'completed' ? '100% Done' : '60% Completed'}</div>
                            </div>
                        )}
                    </div>
                </div>

                {(orderDetails?.shipment_details?.supplier_details &&
                    Object.keys(orderDetails.shipment_details.supplier_details).length > 0) ||
                    (orderDetails?.supplier_logistics_data &&
                        Object.keys(orderDetails?.supplier_logistics_data).length > 0) ? (
                    <div className='details-add-container'>
                        <span className='details-payment-heading'>Pickup Details</span>
                        <div className='details-address-section'>
                            <span className='details-address-text'>{orderDetails?.shipment_details?.supplier_details?.name ||
                                orderDetails?.supplier_logistics_data?.full_name}
                                <span className='details-type-address'>Warehouse</span>

                            </span>

                            <span className='details-address-text'>
                                {orderDetails?.shipment_details?.supplier_details?.address ||
                                    `${orderDetails?.supplier_logistics_data?.house_name}, ${orderDetails?.supplier_logistics_data?.locality}, 
                        ${orderDetails?.supplier_logistics_data?.city}, ${orderDetails?.supplier_logistics_data?.state}, 
                        ${orderDetails?.supplier_logistics_data?.country}, ${orderDetails?.supplier_logistics_data?.pincode}.`}
                            </span>

                            <span className='details-address-text'> {orderDetails?.shipment_details?.supplier_details?.mobile ||
                                orderDetails?.supplier_logistics_data?.mobile_number}</span>
                        </div>
                    </div>
                ) : null}
                {(orderDetails?.logistics_details || orderDetails?.buyer_logistics_data) && (
                    <div className='details-add-container'>
                        <span className='details-payment-heading'>Drop Details</span>
                        <div className='details-address-section'>
                            <span className='details-address-text'> {orderDetails?.logistics_details?.drop_location?.name || orderDetails?.buyer_logistics_data?.full_name}
                                <span className='details-type-address'>Warehouse</span>

                            </span>

                            <span className='details-address-text'>
                                {orderDetails?.logistics_details?.drop_location?.address || orderDetails?.buyer_logistics_data?.house_name},
                                {orderDetails?.logistics_details?.drop_location?.country || orderDetails?.buyer_logistics_data?.locality},
                            </span>
                            <span className='details-address-text'>
                                {orderDetails?.logistics_details?.drop_location?.state || orderDetails?.buyer_logistics_data?.country},
                                {orderDetails?.logistics_details?.drop_location?.city_district || orderDetails?.buyer_logistics_data?.state},
                                {orderDetails?.logistics_details?.drop_location?.pincode || orderDetails?.buyer_logistics_data?.pincode}.
                            </span>

                            <span className='details-address-text'>  {orderDetails?.logistics_details?.drop_location?.mobile || orderDetails?.buyer_logistics_data?.mobile_number}</span>





                        </div>
                    </div>
                )}
            </div>
            {/* End the section */}

            {/* start the main component heading */}
            {/* {orderDetails?.coordinators && Object.keys(orderDetails?.coordinators).length > 0 && ( */}
            <div className='active-order-details-left-bottom-containers'>
                <div className='active-order-details-left-bottom-vehichle'>
                    <span className='active-order-transportation-heading'>Transport Details</span>
                    <div className='transport-container'>
                        <div className='active-order-details-transportation'>
                            <div className='details-payment-inner-text'>Mode of Transport</div>
                            <div className='details-payment-content'>Air Cargo</div>
                        </div>
                        <div className='active-order-details-transportation'>
                            <div className='details-payment-inner-text'>Extra Services</div>
                            <div className='details-payment-content'>8 USD</div>
                        </div>
                    </div>
                </div>
                <div className='active-order-details-left-bottom-vehichle-no'>
                    <span className='active-order-transportation-heading'>Pickup Slot</span>
                    <div className='transport-container'>
                        <div className='active-order-details-transportation'>
                            <div className='details-payment-inner-text'>Preferred Date of Pickup</div>
                            <div className='details-payment-content'>12:00 PM</div>
                        </div>
                        <div className='active-order-details-transportation'>

                            <div className='details-payment-inner-text'>Preferred Time of Pickup</div>
                            <div className='details-payment-content'>{orderDetails?.shipment_details?.supplier_details?.prefered_pickup_time}</div>

                        </div>
                    </div>
                </div>

            </div>
            {(orderDetails?.shipment_details?.supplier_details &&
                Object.keys(orderDetails.shipment_details.supplier_details).length > 0) ||
                (orderDetails?.supplier_logistics_data &&
                    Object.keys(orderDetails?.supplier_logistics_data).length > 0) ? (
                <div className='active-order-details-middle-bottom-containers'>
                    <div className='active-order-details-left-middle-vehichle-no'>
                        <span className='active-order-transportation-heading'>Bills of Material</span>
                        <div className='active-order-details-transportation'>
                            <div className='details-payment-inner-text'>No. of Packages</div>
                            <div className='details-payment-content'>{orderDetails?.shipment_details?.shipment_details?.no_of_packages || '5'}</div>
                        </div>
                    </div>
                    <div className='active-details-package-container'>
                        <span className='active-order-transportation-heading'>Package Details</span>
                        <div className="buyer-order-details-left-top-containers">

                            <div className="buyer-order-details-top-order-cont">
                                <div className="details-payment-inner-text">
                                    Total Packages Weight
                                </div>
                                <div className="details-payment-content">
                                    {orderDetails?.shipment_details?.shipment_details?.total_weight || '6'} Kg
                                </div>
                            </div>
                            <Link to={`/buyer/supplier-details/${orderDetails?.supplier_id}`}>
                                <div className="buyer-order-details-top-order-cont">
                                    <div className="details-payment-inner-text">
                                        Width
                                    </div>
                                    <div className="details-payment-content">
                                        {orderDetails?.shipment_details?.shipment_details?.breadth || '2'} cm
                                    </div>
                                </div>
                            </Link>
                            <div className="buyer-order-details-top-order-cont">
                                <div className="details-payment-inner-text">
                                    Height
                                </div>
                                <div className="details-payment-content">
                                    {orderDetails?.shipment_details?.shipment_details?.height || '5'} cm
                                </div>
                            </div>
                            <div className="buyer-order-details-top-order-cont">
                                <div className="details-payment-inner-text">
                                    Length
                                </div>
                                <div className="details-payment-content">
                                    {orderDetails?.shipment_details?.shipment_details?.length || '3'} cm
                                </div>
                            </div>
                            <div className="buyer-order-details-top-order-cont">
                                <div className="details-payment-inner-text">
                                    Total Volume
                                </div>
                                <div className="details-payment-content">
                                    {orderDetails?.shipment_details?.shipment_details?.total_volume || '30'} L
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
            {/* end the main component heading */}

            {/* Start the assign driver section */}
            {/* {orderDetails?.coordinators && Object.keys(orderDetails?.coordinators).length > 0 && ( */}
            {/* {orderDetails?.status === "Completed" && (
                <div className='active-order-details-codinator'>
                    <ActiveCodinator productList={orderDetails?.items} />
                </div>
            )} */}
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
