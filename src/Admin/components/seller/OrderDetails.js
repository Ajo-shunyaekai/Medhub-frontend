import React, { useEffect, useState } from 'react';
import '../../style/adminsupplierdetails.css'
import AssignDriver from '../details/AssignDriver';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SellerActiveCodinator from './SellerActiveCodinator';
import SellerActiveInvoiceList from './SellerActiveInvoiceList';
import { postRequestWithToken } from '../../api/Requests';
import { apiRequests } from '../../../api';

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");

    const [orderDetails, setOrderDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [refresh, setRefresh] = useState(false)

    const fetchData = async () => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
            return;
        }
        const obj = {
            order_id  : orderId,
            admin_id  : adminIdSessionStorage || adminIdLocalStorage,
        };
        // postRequestWithToken('admin/order-details', obj, (response) => {
        //     if (response.code === 200) {
        //         setOrderDetails(response.result);
        //     } else {
        //         console.log('error in order details api');
        //     }
        // });
        try {
            // const response = await  apiRequests.postRequest('order/get-specific-order-details', obj)
            // if (response.code === 200) {
            //     setOrderDetails(response.result);
            // }
            postRequestWithToken('order/get-specific-order-details', obj, (response) => {
                if (response.code === 200) {
                    setOrderDetails(response.result);
                } else {
                    console.log('error in order details api');
                }
            });
        } catch (error) {
            console.log('error in order details api');
        }
    }

    useEffect(() => {
        fetchData()
    }, [navigate, orderId]);


    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className='active-order-details-container'>
            <div className='active-order-main-section-container'>
                <div className='active-order-details-conatiner-heading'>Order ID:<span>{orderDetails?.order_id}</span></div>
            </div>
            <div className='active-order-details-section'>
                <div className='active-order-details-left-section'>
                    <div className='active-order-details-top-inner-section'>
                        <div className='active-order-details-left-inner-section-container'>
                            <div className='active-order-details-left-top-containers'>
                                <Link to={`/admin/buyer-details/${orderDetails?.buyer_id}`}>
                                    <div className='active-order-details-top-order-cont'>
                                        <div className='active-order-details-left-top-main-heading'> Buyer Name</div>
                                        <div className='active-order-details-left-top-main-contents'>{orderDetails?.buyer?.buyer_name}</div>
                                    </div>
                                </Link>
                                <div className='active-order-details-top-order-cont'>
                                    <div className='active-order-details-left-top-main-heading'> Order Status</div>
                                    <div className='active-order-details-left-top-main-contents'>
                                    {/* {orderDetails?.status?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} */}
                                    {orderDetails?.status}
                                    </div>
                                </div>
                            </div>
                            <div className='active-order-details-left-bottom-containers'>
                                <div className='buyer-order-details-left-bottom-vehichle'>
                                    <div className='active-order-details-left-bottom-vehicle-head'>Country of Origin</div>
                                    <div className='active-order-details-left-bottom-vehicle-text'>{orderDetails?.buyer?.country_of_origin}</div>
                                </div>
                                <div className='active-order-details-left-bottom-vehichle-no'>
                                    <div className='active-order-details-left-bottom-vehichle-no-head'>Type</div>
                                    <div className='active-order-details-left-bottom-vehichle-no-text'>{orderDetails?.buyer?.buyer_type}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Start the assign driver section */}
            <div className='active-order-details-assign-driver-section'>
                <AssignDriver orderItems={orderDetails?.items} />
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
                    <div className='active-order-details-left-bottom-vehichle-no-text'>12/10/2024 11:00AM to 12:00 PM</div>
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
                    <div className='active-order-details-middle-bottom-vehicle-text'>{orderDetails?.shipment_details?.shipment_details?.total_weight || '6'} Kg</div>
                </div>
                <div className="buyer-order-details-left-top-containers">
                    <Link to={`/buyer/supplier-details/${orderDetails?.supplier_id}`}>
                        <div className="buyer-order-details-top-order-cont">
                            <div className="buyer-order-details-left-top-main-heading">
                                Width
                            </div>
                            <div className="buyer-order-details-left-top-main-contents">
                            {orderDetails?.shipment_details?.shipment_details?.breadth} cm
                            </div>
                        </div>
                    </Link>
                    <div className="buyer-order-details-top-order-cont">
                        <div className="buyer-order-details-left-top-main-heading">
                            Height
                        </div>
                        <div className="buyer-order-details-left-top-main-contents">
                         {orderDetails?.shipment_details?.shipment_details?.height} cm
                        </div>
                    </div>
                    <div className="buyer-order-details-top-order-cont">
                        <div className="buyer-order-details-left-top-main-heading">
                            Length
                        </div>
                        <div className="buyer-order-details-left-top-main-contents">
                        {orderDetails?.shipment_details?.shipment_details?.length} cm
                        </div>
                    </div>
                    <div className="buyer-order-details-top-order-cont">
                        <div className="buyer-order-details-left-top-main-heading">
                            Total Volume
                        </div>
                        <div className="buyer-order-details-left-top-main-contents">
                        {orderDetails?.shipment_details?.shipment_details?.total_volume } L
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
                                            {orderDetails?.shipment_details?.supplier_details?.country},
                                            {orderDetails?.shipment_details?.supplier_details?.state},
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
                                <div className='active-order-details-right-pickdata-text'>{orderDetails?.logistics_details?.drop_location?.name}</div>
                            </div>
                            <div className='active-order-details-right-pickupdata'>
                                <div className='active-order-details-right-pickdata-head'>Phone No.</div>
                                <div className='active-order-details-right-pickdata-text'>{orderDetails?.logistics_details?.drop_location?.mobile}</div>
                            </div>
                            <div className='active-order-details-right-pickupdata-address'>
                                <div className='active-order-details-right-pickdata-head'>Address</div>
                                <div className='active-order-details-right-pickdata-text'>
                                {orderDetails?.logistics_details?.drop_location?.address},
                                        {orderDetails?.logistics_details?.drop_location?.country},
                                        {orderDetails?.logistics_details?.drop_location?.state},
                                        {orderDetails?.logistics_details?.drop_location?.city_district},
                                        {orderDetails?.logistics_details?.drop_location?.pincode}
                                </div>
                            </div>
                        </div>
                    </>
                     )}
                </div>
            </div>
            {/* End the section */}

            {/* Start the assign driver section */}
            {orderDetails?.status === "Completed" &&  (
            <div className='active-order-details-codinator'>
                <SellerActiveCodinator/>
            </div>
            )}
            {/* End the assign driver section */}
            {/* {
                orderDetails?.order_status === 'compla'
            } */}
             {orderDetails?.invoices && orderDetails?.invoices.length > 0 && (
            <div className='active-order-details-invoice-list-section'>
                <SellerActiveInvoiceList invoiceData = {orderDetails?.invoices} />
            </div>
            )}
        </div>
    )
}

export default OrderDetails;