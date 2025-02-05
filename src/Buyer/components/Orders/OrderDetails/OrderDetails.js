import React, { useEffect, useState } from 'react';
import './orderdetails.css';
import AssignDriver from './AssignDriver';
import CustomModal from './CustomOrderModal'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../../../../api/Requests';
import moment from 'moment-timezone';
import BuyerActiveCodinator from './BuyerActiveCodinator';
import OrderInvoiceList from './OrderInvoiceList';
import { toast } from 'react-toastify';
import { apiRequests } from '../../../../api';

const OrderDetails = ({ socket }) => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const buyerIdSessionStorage = sessionStorage.getItem('buyer_id');
    const buyerIdLocalStorage = localStorage.getItem('buyer_id');

    const [loading, setLoading] = useState(false);
    const [activeButton, setActiveButton] = useState('1h');
    const [orderDetails, setOrderDetails] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate('/buyer/login');
            return;
        }
        const obj = {
            order_id: orderId,
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
        };
        // postRequestWithToken('buyer/order/order-details', obj, (response) => {
        //     if (response.code === 200) {
        //         setOrderDetails(response.result);
        //     } else {
        //         console.log('error in order details api');
        //     }
        // });
        try {
            const response = await apiRequests.getRequest(`order/get-specific-order-details/${orderId}`, obj)
            if (response.code === 200) {
                setOrderDetails(response.result);
            }
            // postRequestWithToken(`order/get-specific-order-details/${orderId}`, obj, (response) => {
            //     if (response.code === 200) {
            //         setOrderDetails(response.result);
            //     } else {
            //         console.log('error in order details api');
            //     }
            // });
        } catch (error) {
            console.log('error in order details api');
        }
    }

    useEffect(() => {
        fetchData()
    }, [navigate, orderId]);

    const handleButtonClick = (value) => {
        setActiveButton(value);
    };

    const onClose = () => {
        setIsModalOpen(false)
        setLoading(false)
    }

    const handleModalSubmit = (data) => {
        console.log('Modal Data:', data);
        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate('/buyer/login');
            return;
        }
        setLoading(true)
        let type = '';
        if (data.doorToDoor) {
            type = 'door to door';
        } else if (data.customClearance) {
            type = 'custom clearance';
        }

        // Create the logistics_details object
        const logisticsDetails = {
            door_to_door: data.doorToDoor,
            custom_clearance: data.customClearance,
            prefered_mode: data.transportMode,
            drop_location: {
                name: data.dropLocation.name,
                email: data.dropLocation.email,
                mobile: data.dropLocation.contact,
                address: data.dropLocation.address,
                country: data.dropLocation.country,
                city_district: data.dropLocation.cityDistrict,
                state: data.dropLocation.state,
                pincode: data.dropLocation.pincode
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
                postRequestWithToken('buyer/order/order-details', obj, (response) => {
                    if (response.code === 200) {
                        toast('Logistics Details Submitted Successfully', { type: 'success' })

                        socket.emit('bookLogistics', {
                            supplierId: orderDetails?.supplier_id,
                            orderId: orderId,
                            message: `Logistics Booking Request for ${orderId}`,
                            link: process.env.REACT_APP_PUBLIC_URL
                            // send other details if needed
                        });
                        setOrderDetails(response.result);
                        onClose()
                        setLoading(false)

                    } else {
                        setLoading(false)
                        toast(response.message, { type: 'error' })
                        console.log('error in order details api');
                    }
                });
            } else {
                setLoading(false)
                toast(response.message, { type: 'error' })
                console.log('Error updating order status');
            }
        });
    };

    return (
        <div className="buyers-order-details-container">
            <div className="buyers-order-details-conatiner-heading">
                <span>Order ID:  {orderDetails?.order_id || '987456321'}</span>
                <span className='buyers-active-details-medicine-details'>
                    {orderDetails?.items?.map((item, index) => (
                        <React.Fragment key={item._id || index}>
                            <span> {item.medicine_name} ({item.strength}) </span>
                            {index < orderDetails.items.length - 1 && " || "}
                        </React.Fragment>
                    ))}
                </span>
                <Link className='buyers-active-order-details-link-tag' to={`/buyer/supplier-details/${orderDetails?.supplier_id}`}>
                    <span className='buyers-active-details-purchsed-by'>Sold By: </span><span className='buyers-active-details-Buyer-name'>{orderDetails?.supplier?.supplier_name ||
                        'Pharmaceuticals Pvt Ltd'}</span>
                </Link>
            </div>
            <div className="buyers-order-details-section">
                <div className="buyers-order-details-left-section">
                    <div className="buyers-order-details-top-inner-section">
                        <div className="buyers-order-details-left-inner-section-container">
                            <div className="buyers-order-details-left-top-containers">
                                <div className="buyers-order-details-top-order-cont">
                                    <div className="buyers-order-details-left-top-main-heading">
                                        Date & Time
                                    </div>
                                    <div className="buyers-order-details-left-top-main-contents">
                                        {moment(orderDetails?.created_at).tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss')}
                                    </div>
                                </div>


                                <div className="buyers-order-details-top-order-cont">
                                    <div className="buyers-order-details-left-top-main-heading">
                                        Company Type
                                    </div>
                                    <div className="buyers-order-details-left-top-main-contents">
                                        {orderDetails?.supplier.supplier_type}
                                    </div>
                                </div>




                                <div className="buyers-order-details-top-order-cont">
                                    <div className="buyers-order-details-left-top-main-heading">
                                        Order Status
                                    </div>
                                    <div className="buyers-order-details-left-top-main-contents">
                                        {/* {orderDetails?.status?.charAt(0)?.toUpperCase() + orderDetails?.status?.slice(1) } */}
                                        {orderDetails?.status}
                                    </div>
                                </div>
                                {
                                    orderDetails?.status === 'Active' ?

                                        <div className="buyers-order-details-top-order-cont">
                                            <Link to='/buyer/logistics-form'>

                                            <div
                                                className="buyers-order-details-left-top-main-heading-button"
                                                // onClick={() => setIsModalOpen(true)}
                                            >
                                                Book Logistics
                                            </div>

                                            <div className="buyer-order-details-left-top-main-contents"></div>

                                            </Link>

                                        </div> : ''
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* start the assign driver section */}
            <div className="buyers-order-details-assign-driver-section">
                <AssignDriver orderItems={orderDetails?.items} />
            </div>
            {/* end the assign driver section */}
            {/* start the main component heading */}

            {/* {orderDetails?.shipment_details && Object.keys(orderDetails?.shipment_details).length > 0 && (
            <> */}

            {orderDetails?.coordinators && Object.keys(orderDetails?.coordinators).length > 0 && (
                <div className='buyers-order-details-left-bottom-containers'>
                    <div className='buyers-order-details-left-bottom-vehichle'>
                        <div className='buyers-order-details-left-bottom-vehicle-head'>Cost</div>
                        <div className='buyers-order-details-left-bottom-vehicle-text'>12 USD</div>
                    </div>
                    <div className='buyers-order-details-left-bottom-vehichle-no'>
                        <div className='buyers-order-details-left-bottom-vehichle-no-head'>Shipment Price</div>
                        <div className='buyers-order-details-left-bottom-vehichle-no-text'>8 USD</div>
                    </div>
                    <div className='buyers-order-details-left-bottom-vehichle-no'>
                        <div className='buyers-order-details-left-bottom-vehichle-no-head'>Shipment Time</div>
                        <div className='buyers-order-details-left-bottom-vehichle-no-text'>12:00 PM</div>
                    </div>
                    <div className='buyers-order-details-left-bottom-vehichle-no'>
                        <div className='buyers-order-details-left-bottom-vehichle-no-head'>Preferred Time of Pickup</div>
                        <div className='buyers-order-details-left-bottom-vehichle-no-text'>{orderDetails?.shipment_details?.supplier_details?.prefered_pickup_time}</div>
                    </div>
                </div>
            )}
            {/* end the main component heading */}
            {/* start the main component heading */}
            {orderDetails?.shipment_details && Object.keys(orderDetails?.shipment_details).length > 0 && (
                <div className='buyers-order-details-middle-bottom-containers'>
                    <div className='buyers-order-details-left-middle-vehichle-no'>
                        <div className='buyers-order-details-middle-bottom-vehicle-head'>No. of Packages</div>
                        <div className='buyers-order-details-middle-bottom-vehicle-text'>{orderDetails?.shipment_details?.shipment_details?.no_of_packages || '5'}</div>
                    </div>
                    <div className='buyers-order-details-left-middle-vehichle-no'>
                        <div className='buyers-order-details-middle-bottom-vehicle-head'>Total Weight</div>
                        <div className='buyers-order-details-middle-bottom-vehicle-text'>{orderDetails?.shipment_details?.shipment_details?.total_weight || '4'} Kg</div>
                    </div>
                    <div className="buyers-order-details-left-top-containers">
                        <Link to={`/buyer/supplier-details/${orderDetails?.supplier_id}`}>
                            <div className="buyers-order-details-top-order-cont">
                                <div className="buyers-order-details-left-top-main-heading">
                                    Width
                                </div>
                                <div className="buyers-order-details-left-top-main-contents">
                                    {orderDetails?.shipment_details?.shipment_details?.breadth || '4'} cm
                                </div>
                            </div>
                        </Link>
                        <div className="buyers-order-details-top-order-cont">
                            <div className="buyers-order-details-left-top-main-heading">
                                Height
                            </div>
                            <div className="buyers-order-details-left-top-main-contents">
                                {orderDetails?.shipment_details?.shipment_details?.height || '4'} cm
                            </div>
                        </div>
                        <div className="buyers-order-details-top-order-cont">
                            <div className="buyers-order-details-left-top-main-heading">
                                Length
                            </div>
                            <div className="buyers-order-details-left-top-main-contents">
                                {orderDetails?.shipment_details?.shipment_details?.length || '4'} cm
                            </div>
                        </div>
                        <div className="buyers-order-details-top-order-cont">
                            <div className="buyers-order-details-left-top-main-heading">
                                Volume
                            </div>
                            <div className="buyers-order-details-left-top-main-contents">
                                {orderDetails?.shipment_details?.shipment_details?.total_volume || '4'} L
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* end the main component heading */}
            {/* </>

            {/* Start the end section */}
            <div className="buyers-order-details-payment-container">

                {/* {orderDetails?.status === 'Shipment Details Submitted' || orderDetails?.status === 'Completed' && ( */}
                <div className="buyers-order-details-payment-left-section">
                    <div className="buyers-order-details-payment-terms-cont">
                        <div className="buyers-order-details-payment-first-terms-cont">
                            <div className="buyers-order-details-payment-first-terms-heading">
                                Payment Terms
                            </div>
                            <div className="buyers-order-details-payment-first-terms-text">
                                <ul className="buyers-order-details-payment-ul-section">
                                    {orderDetails?.enquiry?.payment_terms?.map((data, i) => (
                                        <li key={i} className="buyers-order-details-payment-li-section">
                                            {data}.
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* )} */}
                <div className='buyers-order-details-pickup-sec-container'>


                    {/* {orderDetails?.shipment_details && Object.keys(orderDetails?.shipment_details).length > 0 && ( */}

                    {/* {(orderDetails?.shipment_details && Object.keys(orderDetails?.shipment_details).length > 0) ||
                 (orderDetails?.supplier_logistics_data && Object.keys(orderDetails?.supplier_logistics_data).length > 0) && ( */}

                    {(orderDetails?.shipment_details?.supplier_details &&
                        Object.keys(orderDetails.shipment_details.supplier_details).length > 0) ||
                        (orderDetails?.supplier_logistics_data &&
                            Object.keys(orderDetails?.supplier_logistics_data).length > 0) ? (
                        <div className='buyers-order-details-payment-right-section'>
                            <div className='buyers-order-details-payment-right-section-heading'>Pickup Details</div>
                            <div className='buyers-order-details-payment-right-details-row'>
                                <div className='buyers-order-details-right-details-row-one'>
                                    <div className='buyers-order-details-right-pickupdata'>
                                        <div className='buyers-order-details-right-pickdata-head'>Consignor Name</div>
                                        <div className='buyers-order-details-right-pickdata-text'>
                                            {orderDetails?.shipment_details?.supplier_details?.name ||
                                                orderDetails?.supplier_logistics_data?.full_name}
                                        </div>
                                    </div>
                                    <div className='buyers-order-details-right-pickupdata'>
                                        <div className='buyers-order-details-right-pickdata-head'>Phone No.</div>
                                        <div className='buyers-order-details-right-pickdata-text'>
                                            {orderDetails?.shipment_details?.supplier_details?.mobile ||
                                                orderDetails?.supplier_logistics_data?.mobile_number}
                                        </div>
                                    </div>
                                    <div className='buyers-order-details-right-pickupdata-address'>
                                        <div className='buyers-order-details-right-pickdata-head'>Address</div>
                                        <div className='buyers-order-details-right-pickdata-text'>
                                            {orderDetails?.shipment_details?.supplier_details?.address ||
                                                `${orderDetails?.supplier_logistics_data?.house_name}, ${orderDetails?.supplier_logistics_data?.locality}, 
                         ${orderDetails?.supplier_logistics_data?.city}, ${orderDetails?.supplier_logistics_data?.state}, 
                         ${orderDetails?.supplier_logistics_data?.country}, ${orderDetails?.supplier_logistics_data?.pincode}.`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        // )}
                    ) : null}
                    {(orderDetails?.logistics_details || orderDetails?.buyer_logistics_data) && (
                        <>
                            <hr className='buyers-order-details-right-pickupdata-hr' />
                            <div className='buyers-order-details-payment-right-section'>
                                <div className='buyers-order-details-payment-right-section-heading'>Drop Details</div>
                                <div className='buyers-order-details-right-details-row-one'>
                                    <div className='buyers-order-details-right-pickupdata'>
                                        <div className='buyers-order-details-right-pickdata-head'>Consignee Name</div>
                                        <div className='buyers-order-details-right-pickdata-text'>
                                            {orderDetails?.logistics_details?.drop_location?.name || orderDetails?.buyer_logistics_data?.full_name}
                                        </div>
                                    </div>
                                    <div className='buyers-order-details-right-pickupdata'>
                                        <div className='buyers-order-details-right-pickdata-head'>Phone No.</div>
                                        <div className='buyers-order-details-right-pickdata-text'>
                                            {orderDetails?.logistics_details?.drop_location?.mobile || orderDetails?.buyer_logistics_data?.mobile_number}
                                        </div>
                                    </div>
                                    <div className='buyers-order-details-right-pickupdata-address'>
                                        <div className='buyers-order-details-right-pickdata-head'>Address</div>
                                        <div className='buyers-order-details-right-pickdata-text'>
                                            {orderDetails?.logistics_details?.drop_location?.address || orderDetails?.buyer_logistics_data?.house_name},
                                            {orderDetails?.logistics_details?.drop_location?.country || orderDetails?.buyer_logistics_data?.locality},
                                            {orderDetails?.logistics_details?.drop_location?.state || orderDetails?.buyer_logistics_data?.country},
                                            {orderDetails?.logistics_details?.drop_location?.city_district || orderDetails?.buyer_logistics_data?.state},
                                            {orderDetails?.logistics_details?.drop_location?.pincode || orderDetails?.buyer_logistics_data?.pincode}.</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

            </div>
            {/* end the section */}
            {/* Start the assign driver section */}
            {/* {orderDetails?.coordinators && Object.keys(orderDetails?.coordinators).length > 0 && ( */}
            {orderDetails?.status === "Completed" && (
                <div className='buyers-order-details-codinator-section-cont'>
                    <BuyerActiveCodinator productList={orderDetails?.items} />
                </div>
            )}

            {/* {
                orderDetails?.order_status === 'completed' ?
             } */}
            {orderDetails?.invoices && orderDetails?.invoices.length > 0 && (
                <div className='buyers-order-details-invoice-list-section'>
                    <OrderInvoiceList invoiceData={orderDetails?.invoices} />
                </div>
            )}
            {/* End the assign driver section */}
            <CustomModal
                isOpen={isModalOpen}
                // onClose={() => setIsModalOpen(false)}
                // onClose={onClose}
                setIsModalOpen={setIsModalOpen}
                onSubmit={handleModalSubmit}
                setLoading={setLoading}
                loading={loading}
            />
        </div>
    );
};

export default OrderDetails;
