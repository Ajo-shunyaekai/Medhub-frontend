import React, { useEffect, useState } from 'react';
import './orderdetails.css';
import ActiveAssignDriver from './details/ActiveAssignDriver';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import OrderCustomModal from './OrderCustomModal';
import ActiveInvoiceList from './ActiveInvoiceList';
import { apiRequests } from '../../../api';
import Loader from '../SharedComponents/Loader/Loader';

const ActiveOrdersDetails = ({ socket }) => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true); // Set loading to true before fetching data
        const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
        const supplierIdLocalStorage = localStorage?.getItem("supplier_id");

        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            localStorage?.clear();
            navigate("/supplier/login");
            setLoading(false); // Stop loading if redirected
            return;
        }

        const obj = {
            order_id: orderId,
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage
        };
        try {
            const response = await apiRequests.getRequest(`order/get-specific-order-details/${orderId}`, obj);
            if (response?.code === 200) {
                setOrderDetails(response.result);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Set loading to false after fetching data
        }
    };

    useEffect(() => {
        fetchData();
    }, [orderId, navigate, refresh]);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    // Show loader while loading
    if (loading) {
        return <Loader />;
    }

    // If orderDetails is not loaded yet, show a message
    if (!orderDetails) {
        return <div>No order details available.</div>;
    }

    return (
        <div className='active-order-details-container'>
            <div className='active-order-main-section-container'>
                <div className='active-order-details-conatiner-heading'>
                    <span>Order ID: {orderDetails?.order_id || 'N/A'}</span>
                    {/* {orderDetails?.items?.length > 0 && (
                        <span className='active-details-medicine-details'>
                            {orderDetails.items.map((item, index) => (
                                <React.Fragment key={item._id || index}>
                                    <span>{item.medicine_name}</span>
                                    {index < orderDetails.items.length - 1 && " || "}
                                </React.Fragment>
                            ))}
                        </span>
                    )} */}
                    {/* {orderDetails?.buyer_id && orderDetails?.buyer?.buyer_name && (
                        <Link className='active-order-details-link-tag' to={`/supplier/buyer-details/${orderDetails.buyer_id}`}>
                            <span className='active-details-purchsed-by'>Purchased By: </span>
                            <span className='active-details-Buyer-name'>{orderDetails.buyer.buyer_name}</span>
                        </Link>
                    )} */}
                </div>
                {orderDetails?.status === "Shipment Details Submitted" && orderDetails?.invoice_status === "Invoice Created" && (
                    <Link to={`/supplier/create-invoice/${orderDetails.order_id}`}>
                        <div className='active-order-main-create-invoice'>Create Invoice</div>
                    </Link>
                )}
            </div>
            <div className='active-order-details-section'>
                <div className='active-order-details-left-section'>
                    <div className='active-order-details-top-inner-section'>
                        <div className='active-order-details-left-inner-section-container'>
                            <div className='active-order-details-left-top-containers'>

                                 {orderDetails?.buyer_id && orderDetails?.buyer?.buyer_name && (
                        <Link className='active-order-details-top-order-cont' to={`/supplier/buyer-details/${orderDetails.buyer_id}`}>
                            <span className='details-payment-inner-text'>Purchased By </span>
                            <span className='details-payment-content'>{orderDetails.buyer.buyer_name}</span>
                        </Link>
                    )}
                                {orderDetails?.buyer?.country_of_origin && (
                                    <div className='active-order-details-top-order-cont'>
                                        <div className='details-payment-inner-text'>Country of Origin</div>
                                        <div className='details-payment-content'>{orderDetails.buyer.country_of_origin}</div>
                                    </div>
                                )}
                                {/* {orderDetails?.buyer?.buyer_type && (
                                    <div className='active-order-details-top-order-cont'>
                                        <div className='details-payment-inner-text'>Company Type</div>
                                        <div className='details-payment-content'>{orderDetails.buyer.buyer_type}</div>
                                    </div>
                                )} */}
                                {orderDetails?.status && (
                                    <div className='active-order-details-top-order-cont'>
                                        <div className='details-payment-inner-text'>Order Status</div>
                                        <div className='details-payment-content'>{orderDetails.status}</div>
                                    </div>
                                )}
                                {orderDetails?.status === 'Awaiting Details from Supplier' && orderDetails?.supplier?._id && (
                                    <div className='active-order-details-top-order-cont'>
                                        <Link to={`/supplier/logistics-form/${orderId}/${orderDetails.supplier._id}`}>
                                            <div className='active-order-details-left-top-main-heading-button'>
                                                Submit Pickup Details
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assign Driver Section */}
            {orderDetails?.items?.length > 0 && (
                <div className='active-order-details-assign-driver-section'>
                    <ActiveAssignDriver productList={orderDetails.items} />
                </div>
            )}

            {/* Payment and Address Section */}
            {(orderDetails?.payment_terms?.length > 0 || orderDetails?.status === 'Completed') && (
                <div className='details-address-container'>
                    {orderDetails?.payment_terms?.length > 0 && (
                        <div className='details-payment-container'>
                            <span className='details-payment-heading'>Payment</span>
                            <div className='details-payment-section'>
                                <div className='details-payment-inner-section'>
                                    <div className='details-payment-inner-text'>Payment Terms</div>
                                    <ul className='details-payment-ul'>
                                        {orderDetails.payment_terms.map((data, i) => (
                                            <li key={i} className='details-payment-content'>
                                                <MdOutlineKeyboardDoubleArrowRight className="icon" /> {data}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {orderDetails?.status === 'Completed' && orderDetails?.total_amount_paid !== undefined && orderDetails?.total_due_amount !== undefined && (
                                    <div className='details-payment-inner-section'>
                                        <div className='details-payment-inner-text'>Payment Status</div>
                                        <div className='details-payment-content'>
                                            {orderDetails.total_amount_paid === orderDetails.total_due_amount
                                                ? '100% Done'
                                                : `${Math.round((orderDetails.total_amount_paid / orderDetails.total_due_amount) * 100)}% Completed`}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {orderDetails?.supplier_logistics_data && Object.keys(orderDetails.supplier_logistics_data).length > 0 && (
                        <div className='details-add-container'>
                            <span className='details-payment-heading'>Pickup Details</span>
                            <div className='details-address-section'>
                                {orderDetails.supplier_logistics_data.full_name && (
                                    <span className='details-address-text'>
                                        {orderDetails.supplier_logistics_data.full_name}
                                        {orderDetails.supplier_logistics_data.address_type && (
                                            <span className='details-type-address'>{orderDetails.supplier_logistics_data.address_type}</span>
                                        )}
                                    </span>
                                )}
                                {orderDetails.supplier_logistics_data.company_reg_address && (
                                    <span className='details-address-text'>
                                        {orderDetails.supplier_logistics_data.company_reg_address}, {orderDetails.supplier_logistics_data.locality}, 
                                        {orderDetails.supplier_logistics_data.city}, {orderDetails.supplier_logistics_data.state}, 
                                        {orderDetails.supplier_logistics_data.country}
                                        {orderDetails.supplier_logistics_data.pincode && `, ${orderDetails.supplier_logistics_data.pincode}`}
                                    </span>
                                )}
                                {orderDetails.supplier_logistics_data.mobile_number && (
                                    <span className='details-address-text'>{orderDetails.supplier_logistics_data.mobile_number}</span>
                                )}
                            </div>
                        </div>
                    )}

                    {orderDetails?.buyer_logistics_data && Object.keys(orderDetails.buyer_logistics_data).length > 0 && (
                        <div className='details-add-container'>
                            <span className='details-payment-heading'>Drop Details</span>
                            <div className='details-address-section'>
                                {orderDetails.buyer_logistics_data.full_name && (
                                    <span className='details-address-text'>
                                        {orderDetails.buyer_logistics_data.full_name}
                                        {orderDetails.buyer_logistics_data.address_type && (
                                            <span className='details-type-address'>{orderDetails.buyer_logistics_data.address_type}</span>
                                        )}
                                    </span>
                                )}
                                {orderDetails.buyer_logistics_data.company_reg_address && (
                                    <span className='details-address-text'>
                                        {orderDetails.buyer_logistics_data.company_reg_address}, {orderDetails.buyer_logistics_data.locality}, 
                                        {orderDetails.buyer_logistics_data.city}, {orderDetails.buyer_logistics_data.state}, 
                                        {orderDetails.buyer_logistics_data.country}
                                        {orderDetails.buyer_logistics_data.pincode && `, ${orderDetails.buyer_logistics_data.pincode}`}
                                    </span>
                                )}
                                {orderDetails.buyer_logistics_data.mobile_number && (
                                    <span className='details-address-text'>{orderDetails.buyer_logistics_data.mobile_number}</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Transport Details Section */}
            {(orderDetails?.buyer_logistics_data || orderDetails?.supplier_logistics_data) && (
                <div className='active-order-details-left-bottom-containers'>
                    {orderDetails?.buyer_logistics_data && (
                        <div className='active-order-details-left-bottom-vehichle'>
                            <span className='active-order-transportation-heading'>Transport Details</span>
                            <div className='transport-container'>
                                {orderDetails.buyer_logistics_data.mode_of_transport && (
                                    <div className='active-order-details-transportation'>
                                        <div className='details-payment-inner-text'>Mode of Transport</div>
                                        <div className='details-payment-content'>{orderDetails.buyer_logistics_data.mode_of_transport}</div>
                                    </div>
                                )}
                                {orderDetails.buyer_logistics_data.extra_services?.length > 0 && (
                                    <div className='active-order-details-transportation'>
                                        <div className='details-payment-inner-text'>Extra Services</div>
                                        <div className='details-payment-content'>{orderDetails.buyer_logistics_data.extra_services.join(', ')}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {orderDetails?.supplier_logistics_data?.pickup_date || orderDetails?.supplier_logistics_data?.pickup_time ? (
                        <div className='active-order-details-left-bottom-vehichle-no'>
                            <span className='active-order-transportation-heading'>Pickup Slot</span>
                            <div className='transport-container'>
                                {orderDetails.supplier_logistics_data.pickup_date && (
                                    <div className='active-order-details-transportation'>
                                        <div className='details-payment-inner-text'>Preferred Date of Pickup</div>
                                        <div className='details-payment-content'>
                                            {new Date(orderDetails.supplier_logistics_data.pickup_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                )}
                                {orderDetails.supplier_logistics_data.pickup_time && (
                                    <div className='active-order-details-transportation'>
                                        <div className='details-payment-inner-text'>Preferred Time of Pickup</div>
                                        <div className='details-payment-content'>{orderDetails.supplier_logistics_data.pickup_time}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            )}

            {/* Bills of Material and Package Details */}
            {orderDetails?.supplier_logistics_data?.package_information && (
                <div className='active-order-details-middle-bottom-containers'>
                    {orderDetails.supplier_logistics_data.package_information.total_no_of_packages && (
                        <div className='active-order-details-left-middle-vehichle-no'>
                            <span className='active-order-transportation-heading'>Bills of Material</span>
                            <div className='active-order-details-transportation'>
                                <div className='details-payment-inner-text'>No. of Packages</div>
                                <div className='details-payment-content'>{orderDetails.supplier_logistics_data.package_information.total_no_of_packages}</div>
                            </div>
                        </div>
                    )}
                    {orderDetails.supplier_logistics_data.package_information?.package_details?.[0] && (
                        <div className='active-details-package-container'>
                            <span className='active-order-transportation-heading'>Package Details</span>
                            <div className="buyer-order-details-left-top-containers">
                                {orderDetails.supplier_logistics_data.package_information.package_details[0].weight && (
                                    <div className="buyer-order-details-top-order-cont">
                                        <div className="details-payment-inner-text">Total Packages Weight</div>
                                        <div className="details-payment-content">
                                            {orderDetails.supplier_logistics_data.package_information.package_details[0].weight} Kg
                                        </div>
                                    </div>
                                )}
                                {orderDetails.supplier_logistics_data.package_information.package_details[0].dimensions?.width && (
                                    <div className="buyer-order-details-top-order-cont">
                                        <div className="details-payment-inner-text">Width</div>
                                        <div className="details-payment-content">
                                            {orderDetails.supplier_logistics_data.package_information.package_details[0].dimensions.width} cm
                                        </div>
                                    </div>
                                )}
                                {orderDetails.supplier_logistics_data.package_information.package_details[0].dimensions?.height && (
                                    <div className="buyer-order-details-top-order-cont">
                                        <div className="details-payment-inner-text">Height</div>
                                        <div className="details-payment-content">
                                            {orderDetails.supplier_logistics_data.package_information.package_details[0].dimensions.height} cm
                                        </div>
                                    </div>
                                )}
                                {orderDetails.supplier_logistics_data.package_information.package_details[0].dimensions?.length && (
                                    <div className="buyer-order-details-top-order-cont">
                                        <div className="details-payment-inner-text">Length</div>
                                        <div className="details-payment-content">
                                            {orderDetails.supplier_logistics_data.package_information.package_details[0].dimensions.length} cm
                                        </div>
                                    </div>
                                )}
                                {orderDetails.supplier_logistics_data.package_information.package_details[0].dimensions?.volume && (
                                    <div className="buyer-order-details-top-order-cont">
                                        <div className="details-payment-inner-text">Total Volume</div>
                                        <div className="details-payment-content">
                                            {orderDetails.supplier_logistics_data.package_information.package_details[0].dimensions.volume} L
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Invoice List Section */}
            {orderDetails?.invoices?.length > 0 && (
                <div className='active-order-details-invoice-list-section'>
                    <ActiveInvoiceList invoiceData={orderDetails.invoices} />
                </div>
            )}

            {/* Modal Component */}
            {orderDetails?.buyer && orderDetails?.buyer_id && (
                <OrderCustomModal
                    show={showModal}
                    onClose={closeModal}
                    buyerData={orderDetails.buyer}
                    logiscticsData={orderDetails.buyer_logistics_data}
                    orderId={orderId}
                    buyerId={orderDetails.buyer_id}
                    setRefresh={setRefresh}
                    socket={socket}
                />
            )}
        </div>
    );
};

export default ActiveOrdersDetails;