import React, { useEffect, useState } from 'react';
import '../style/orderdetails.css';
import AssignDriver from './details/AssignDriver';
import CustomModal from './CustomOrderModal'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';
import moment from 'moment-timezone';
import BuyerActiveCodinator from './BuyerActiveCodinator';
import OrderInvoiceList from './OrderInvoiceList';
import { toast } from 'react-toastify';
import { apiRequests } from '../api';

const OrderDetails = ({socket}) => {
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
            door_to_door: data.doorToDoor ,
            custom_clearance: data.customClearance,
            prefered_mode: data.transportMode,
            drop_location: {
                name: data.dropLocation.name,
                email: data.dropLocation.email,
                mobile: data.dropLocation.contact,
                address: data.dropLocation.address,
                country: data.dropLocation.country,
                city_district : data.dropLocation.cityDistrict,
                state : data.dropLocation.state,
                pincode : data.dropLocation.pincode
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
                        toast('Logistics Details Submitted Successfully', {type:'success'})

                        socket.emit('bookLogistics', {
                            supplierId : orderDetails?.supplier_id, 
                            orderId    : orderId,
                            message    : `Logistics Booking Request for ${orderId}`,
                            link       : process.env.REACT_APP_PUBLIC_URL
                            // send other details if needed
                        });
                        setOrderDetails(response.result);
                        onClose()
                        setLoading(false)
                        
                    } else {
                        setLoading(false)
                        toast(response.message, {type:'error'})
                        console.log('error in order details api');
                    }
                });
            } else {
                setLoading(false)
                toast(response.message, {type:'error'})
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
                                        {/* {orderDetails?.status?.charAt(0)?.toUpperCase() + orderDetails?.status?.slice(1) } */}
                                        {orderDetails?.status}
                                    </div>
                                </div>
                                {
                                    orderDetails?.status === 'Active' ?
                                    <div className="buyer-order-details-top-order-cont">
                                    <div
                                        className="buyer-order-details-left-top-main-heading-button"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        Book Logistics
                                    </div>
                                    <div className="buyer-order-details-left-top-main-contents"></div>
                                </div> : ''
                                }
                                
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
                                       Company Type
                                    </div>
                                    <div className="buyer-order-details-left-bottom-vehichle-no-text">
                                        {orderDetails?.supplier.supplier_type}
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

            {/* {orderDetails?.shipment_details && Object.keys(orderDetails?.shipment_details).length > 0 && (
            <> */}

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
                    <div className='active-order-details-middle-bottom-vehicle-text'>{orderDetails?.shipment_details?.shipment_details?.total_weight || '4'} Kg</div>
                </div>
                <div className="buyer-order-details-left-top-containers">
                <Link to={`/buyer/supplier-details/${orderDetails?.supplier_id}`}>
                    <div className="buyer-order-details-top-order-cont">
                        <div className="buyer-order-details-left-top-main-heading">
                           Width
                        </div>
                        <div className="buyer-order-details-left-top-main-contents">
                            {orderDetails?.shipment_details?.shipment_details?.breadth || '4'} cm
                        </div>
                    </div>
                </Link>
                <div className="buyer-order-details-top-order-cont">
                    <div className="buyer-order-details-left-top-main-heading">
                        Height
                    </div>
                    <div className="buyer-order-details-left-top-main-contents">
                        {orderDetails?.shipment_details?.shipment_details?.height || '4'} cm 
                    </div>
                </div>
                <div className="buyer-order-details-top-order-cont">
                    <div className="buyer-order-details-left-top-main-heading">
                        Length
                    </div>
                    <div className="buyer-order-details-left-top-main-contents">
                    {orderDetails?.shipment_details?.shipment_details?.length || '4'} cm
                    </div>
                </div>
                <div className="buyer-order-details-top-order-cont">
                    <div className="buyer-order-details-left-top-main-heading">
                        Volume
                    </div>
                    <div className="buyer-order-details-left-top-main-contents">
                    {orderDetails?.shipment_details?.shipment_details?.total_volume || '4'} L
                    </div>
                </div>
            </div>
            </div>
            )}
            {/* end the main component heading */}
            {/* </>

            {/* Start the end section */}
            <div className="buyer-order-details-payment-container">

            {/* {orderDetails?.status === 'Shipment Details Submitted' || orderDetails?.status === 'Completed' && ( */}
                <div className="buyer-order-details-payment-left-section">
                    <div className="buyer-order-details-payment-terms-cont">
                    <div className="buyer-order-details-payment-first-terms-cont">
                        <div className="buyer-order-details-payment-first-terms-heading">
                        Payment Terms
                        </div>
                        <div className="buyer-order-details-payment-first-terms-text">
                        <ul className="buyer-order-details-payment-ul-section">
                            {orderDetails?.enquiry?.payment_terms?.map((data, i) => (
                            <li key={i} className="buyer-order-details-payment-li-section">
                                {data}.
                            </li>
                            ))}
                        </ul>
                        </div>
                    </div>
                    </div>
                </div>
                {/* )} */}
                
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
                                    <div className='active-order-details-right-pickdata-text'>{orderDetails?.logistics_details?.drop_location?.name}</div>
                                </div>
                                <div className='active-order-details-right-pickupdata'>
                                    <div className='active-order-details-right-pickdata-head'>Phone No.</div>
                                    <div className='active-order-details-right-pickdata-text'>{orderDetails?.logistics_details?.drop_location?.mobile}</div>
                                </div>
                                <div className='active-order-details-right-pickupdata-address'>
                                    <div className='active-order-details-right-pickdata-head'>Address</div>
                                    <div className='active-order-details-right-pickdata-text'>
                                        {orderDetails.logistics_details.drop_location.address},
                                        {orderDetails.logistics_details.drop_location.country}, 
                                        {orderDetails.logistics_details.drop_location.state}, 
                                        {orderDetails.logistics_details.drop_location.city_district}, 
                                        {orderDetails.logistics_details.drop_location.pincode}.</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {/* end the section */}
            {/* Start the assign driver section */}
            {/* {orderDetails?.coordinators && Object.keys(orderDetails?.coordinators).length > 0 && ( */}
            {orderDetails?.status === "Completed" &&  (
            <div className='buyer-order-details-codinator-section-cont'>
                <BuyerActiveCodinator productList={orderDetails?.items} />
            </div>
            )}

             {/* {
                orderDetails?.order_status === 'completed' ?
             } */}
             {orderDetails?.invoices && orderDetails?.invoices.length > 0 &&(
             <div className='buyer-order-details-invoice-list-section'>
                <OrderInvoiceList invoiceData = {orderDetails?.invoices} />
            </div>
             )}
            {/* End the assign driver section */}
            <CustomModal
                isOpen={isModalOpen}
                // onClose={() => setIsModalOpen(false)}
                // onClose={onClose}
                setIsModalOpen = {setIsModalOpen}
                onSubmit={handleModalSubmit}
                setLoading ={setLoading}
                loading = {loading}
            />
        </div>
    );
};

export default OrderDetails;
