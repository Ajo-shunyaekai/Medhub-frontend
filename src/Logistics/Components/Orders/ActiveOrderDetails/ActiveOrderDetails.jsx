//242 line

import React, { useEffect, useState } from 'react';
import './ActiveOrderDetail.css';
import ActiveAssignDriver from '../Details/ActiveAssignDriver';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { apiRequests } from '../../../../api/index'; 
import Loader from '../../SharedComponents/Loader/Loader';

const ActiveOrderDetails = ({socket}) => {

    //242 line

  const { logisticsId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        //setLoading(true); // Set loading to true before fetching data
        const logisticIdSessionStorage = localStorage?.getItem("partner_id");
        const logisticIdLocalStorage = localStorage?.getItem("partner_id");

         if (!logisticIdSessionStorage && !logisticIdLocalStorage) {
            localStorage?.clear();
            navigate("/logistic/login");
            setLoading(false); // Stop loading if redirected
            return;
        } 

        const obj = {
            order_id: logisticsId,
            partner_id: logisticIdSessionStorage || logisticIdLocalStorage
        };
        try {
            const response = await apiRequests.getRequest(`logistics/get-logistics-details/${logisticsId}`, obj);
            console.log(response);
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
    }, [logisticsId, navigate, refresh]);
    
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
                    <span>Logistic ID: {orderDetails?.logistics_id || 'N/A'}</span>
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
                    <Link to={`/logistic/create-invoice/${orderDetails.order_id}`}>
                        <div className='active-order-main-create-invoice'>Create Invoice</div>
                    </Link>
                )}
            </div>
            <div className='active-order-details-section'>
                <div className='active-order-details-left-section'>
                    <div className='active-order-details-top-inner-section'>
                        <div className='active-order-details-left-inner-section-container'>
                            <div className='active-order-details-left-top-containers'>

                        {orderDetails?.orderDetails?.buyer_id && orderDetails?.orderDetails?.buyer_name && (
                        <Link className='active-order-details-top-order-cont' to={`/supplier/buyer-details/${orderDetails.buyer_id}`}>
                            <span className='details-payment-inner-text'>Purchased By </span>
                            <span className='details-payment-content'>{orderDetails.orderDetails.buyer_name}</span>
                        </Link>
                    )}
                                {orderDetails?.orderDetails?.buyer_country && (
                                    <div className='active-order-details-top-order-cont'>
                                        <div className='details-payment-inner-text'>Country of Origin</div>
                                        <div className='details-payment-content'>{orderDetails.orderDetails.buyer_country }</div>
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
                                        {/* <Link to={`/supplier/logistics-form/${orderId}/${orderDetails.supplier._id}`}>
                                            <div className='active-order-details-left-top-main-heading-button'>
                                                Submit Pickup Details
                                            </div>
                                        </Link> */}
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

            {/* supplier */}
            {(orderDetails?.orderDetails?.buyer_logistics_data || orderDetails?.orderDetails?.supplier_logistics_data) && (
                <div className='details-address-container'>
                    {orderDetails?.orderDetails?.buyer_logistics_data?.extra_services?.length > 0 && (
                        <div className='details-payment-container'>
                            <span className='details-payment-heading'>Transport Details</span>
                            <div className='details-payment-section'>
                                <div className='details-payment-inner-section'>
                                    <div className='details-payment-inner-text'>Mode of Transport</div>
                                    <ul className='details-payment-ul'>
                                        <li className='details-payment-content'>
                                            {/* <MdOutlineKeyboardDoubleArrowRight className="icon" /> */} {orderDetails?.orderDetails?.buyer_logistics_data?.mode_of_transport}
                                        </li>
                                    </ul>
                                    
                                        
                               </div>

                            </div>
                        </div>
                    )}
                    {/* supplier details */}
                    {orderDetails?.supplierDetails && Object.keys(orderDetails.supplierDetails).length > 0 && (
                        <div className='details-add-container'>
                            <span className='details-payment-heading'>Supplier Details</span>
                            <div className='details-address-section'>
                                {orderDetails.supplierDetails.supplier_name && (
                                    <span className='details-address-text'>
                                        {orderDetails.supplierDetails.supplier_name}
                                        {orderDetails.supplierDetails.supplier_type && (
                                            <span className='details-type-address'>{orderDetails.supplierDetails.supplier_type}</span>
                                        )}
                                    </span>
                                )}
                                {orderDetails.supplierDetails.contact_person_name && (
                                    <span className='details-address-text'>
                                        {orderDetails.supplierDetails.contact_person_name}
                                    </span>
                                )}
                                {orderDetails.supplierDetails.contact_person_email && (
                                    <span className='details-address-text'>
                                        {orderDetails.supplierDetails.contact_person_email}
                                    </span>
                                )}

                                {(orderDetails.supplierDetails.contact_person_mobile_no)&& (
                                    <span className='details-address-text'>{orderDetails.orderDetails.supplier_logistics_data.mobile_number}</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* pickup details */}
                    {orderDetails?.orderDetails?.supplier_logistics_data && Object.keys(orderDetails.orderDetails.supplier_logistics_data).length > 0 && (
                        <div className='details-add-container'>
                            <span className='details-payment-heading'>Pickup Details</span>
                            <div className='details-address-section'>
                                {orderDetails.orderDetails.supplier_logistics_data.full_name && (
                                    <span className='details-address-text'>
                                        {orderDetails.orderDetails.supplier_logistics_data.full_name}
                                        {orderDetails.orderDetails.supplier_logistics_data.address_type && (
                                            <span className='details-type-address'>{orderDetails.orderDetails.supplier_logistics_data.address_type}</span>
                                        )}
                                    </span>
                                )}
                                {orderDetails.orderDetails.supplier_logistics_data.company_reg_address && (
                                    <span className='details-address-text'>
                                        {orderDetails.orderDetails.supplier_logistics_data.company_reg_address}, {orderDetails.orderDetails.supplier_logistics_data.locality}, 
                                        {orderDetails.orderDetails.supplier_logistics_data.city}, {orderDetails.orderDetails.supplier_logistics_data.state}, 
                                        {orderDetails.orderDetails.supplier_logistics_data.country}
                                        {orderDetails.orderDetails.supplier_logistics_data.pincode && `, ${orderDetails.orderDetails.supplier_logistics_data.pincode}`}
                                    </span>
                                )}
                                {orderDetails.orderDetails.supplier_logistics_data.mobile_number && (
                                    <span className='details-address-text'>{orderDetails.orderDetails.supplier_logistics_data.mobile_number}</span>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            )}

            {/* fix from here */}

            {/* Buyer section*/}
            {(orderDetails?.orderDetails?.buyer_logistics_data || orderDetails?.orderDetails?.supplier_logistics_data) && (
                <div className='details-address-container'>
                    {orderDetails?.orderDetails?.buyer_logistics_data?.extra_services?.length > 0 && (
                        <div className='details-payment-container'>
                            <span className='details-payment-heading'>Additional Services</span>
                            <div className='details-payment-section'>
                                <div className='details-payment-inner-section'>
                                    <div className='details-payment-inner-text'>Extra Services</div>
                                        <ul className='details-payment-ul'>
                                            {
                                                orderDetails.orderDetails.buyer_logistics_data.extra_services.map((data,i)=> (
                                                  <li key={i} className='details-payment-content'>
                                                  {/* <MdOutlineKeyboardDoubleArrowRight className="icon" /> */}{data}
                                                 </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
{/*                                 {orderDetails?.status === 'Completed' && orderDetails?.total_amount_paid !== undefined && orderDetails?.total_due_amount !== undefined && (
                                    <div className='details-payment-inner-section'>
                                        <div className='details-payment-inner-text'>Payment Status</div>
                                        <div className='details-payment-content'>
                                            {orderDetails.total_amount_paid === orderDetails.total_due_amount
                                                ? '100% Done'
                                                : `${Math.round((orderDetails.total_amount_paid / orderDetails.total_due_amount) * 100)}% Completed`}
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        </div>
                    )}

                    {/* Buyer Details */}
                    {orderDetails?.buyerDetails && Object.keys(orderDetails.buyerDetails).length > 0 && (
                        <div className='details-add-container'>
                            <span className='details-payment-heading'>Buyer Details</span>
                            <div className='details-address-section'>
                                {orderDetails.buyerDetails.buyer_name && (
                                    <span className='details-address-text'>
                                        {orderDetails.buyerDetails.buyer_name}
                                        {orderDetails.buyerDetails.buyer_type && (
                                            <span className='details-type-address'>{orderDetails.buyerDetails.buyer_type}</span>
                                        )}
                                    </span>
                                )}

                                {orderDetails.buyerDetails.contact_person_name && (
                                    <span className='details-address-text'>
                                        {orderDetails.buyerDetails.contact_person_name}
                                    </span>
                                )}
                                {orderDetails.buyerDetails.contact_person_email && (
                                    <span className='details-address-text'>
                                        {orderDetails.buyerDetails.contact_person_email}
                                    </span>
                                )}

                                {orderDetails.buyerDetails.contact_person_mobile && (
                                    <span className='details-address-text'>{orderDetails.buyerDetails.contact_person_country_code}{" "}{orderDetails.buyerDetails.contact_person_mobile}</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Drop Details */}
                    {orderDetails?.orderDetails?.buyer_logistics_data && Object.keys(orderDetails.orderDetails.buyer_logistics_data).length > 0 && (
                        <div className='details-add-container'>
                            <span className='details-payment-heading'>Drop Details</span>
                            <div className='details-address-section'>
                                {orderDetails.orderDetails.buyer_logistics_data.full_name && (
                                    <span className='details-address-text'>
                                        {orderDetails.orderDetails.buyer_logistics_data.full_name}
                                        {orderDetails.orderDetails.buyer_logistics_data.address_type && (
                                            <span className='details-type-address'>{orderDetails.orderDetails.buyer_logistics_data.address_type}</span>
                                        )}
                                    </span>
                                )}
                                {orderDetails.orderDetails.buyer_logistics_data.company_reg_address && (
                                    <span className='details-address-text'>
                                        {orderDetails.orderDetails.buyer_logistics_data.company_reg_address}, {orderDetails.orderDetails.buyer_logistics_data.locality}, 
                                        {orderDetails.orderDetails.buyer_logistics_data.city}, {orderDetails.orderDetails.buyer_logistics_data.state}, 
                                        {orderDetails.orderDetails.buyer_logistics_data.country}
                                        {orderDetails.orderDetails.buyer_logistics_data.pincode && `, ${orderDetails.orderDetails.buyer_logistics_data.pincode}`}
                                    </span>
                                )}
                                {orderDetails.orderDetails.buyer_logistics_data.mobile_number && (
                                    <span className='details-address-text'>{orderDetails.orderDetails.buyer_logistics_data.mobile_number}</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Transport Details Section */}
       {/*      {(orderDetails?.buyer_logistics_data || orderDetails?.supplier_logistics_data) && (
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
 */}
            {/* Bills of Material and Package Details */}
            {orderDetails?.orderDetails?.supplier_logistics_data?.package_information && (
                <div className='active-order-details-middle-bottom-containers'>
                    {orderDetails.orderDetails.supplier_logistics_data.package_information.total_no_of_packages && (
                        <div className='active-order-details-left-middle-vehichle-no'>
                            <span className='active-order-transportation-heading'>Bills of Material</span>
                            <div className='active-order-details-transportation'>
                                <div className='details-payment-inner-text'>No. of Packages</div>
                                <div className='details-payment-content'>{orderDetails.orderDetails.supplier_logistics_data.package_information.total_no_of_packages}</div>
                            </div>
                        </div>
                    )}
                    {orderDetails.orderDetails.supplier_logistics_data.package_information?.package_details?.[0] && (
                        <div className='active-details-package-container'>
                            <span className='active-order-transportation-heading'>Package Details</span>
                            <div className="buyer-order-details-left-top-containers">
                                {orderDetails.orderDetails.supplier_logistics_data.package_information.package_details[0].weight && (
                                    <div className="buyer-order-details-top-order-cont">
                                        <div className="details-payment-inner-text">Total Packages Weight</div>
                                        <div className="details-payment-content">
                                            {orderDetails.orderDetails.supplier_logistics_data.package_information.package_details[0].weight} Kg
                                        </div>
                                    </div>
                                )}
                                {orderDetails.orderDetails.supplier_logistics_data.package_information.package_details[0].dimensions?.width && (
                                    <div className="buyer-order-details-top-order-cont">
                                        <div className="details-payment-inner-text">Width</div>
                                        <div className="details-payment-content">
                                            {orderDetails.orderDetails.supplier_logistics_data.package_information.package_details[0].dimensions.width} cm
                                        </div>
                                    </div>
                                )}
                                {orderDetails.orderDetails.supplier_logistics_data.package_information.package_details[0].dimensions?.height && (
                                    <div className="buyer-order-details-top-order-cont">
                                        <div className="details-payment-inner-text">Height</div>
                                        <div className="details-payment-content">
                                            {orderDetails.orderDetails.supplier_logistics_data.package_information.package_details[0].dimensions.height} cm
                                        </div>
                                    </div>
                                )}
                                {orderDetails.orderDetails.supplier_logistics_data.package_information.package_details[0].dimensions?.length && (
                                    <div className="buyer-order-details-top-order-cont">
                                        <div className="details-payment-inner-text">Length</div>
                                        <div className="details-payment-content">
                                            {orderDetails.orderDetails.supplier_logistics_data.package_information.package_details[0].dimensions.length} cm
                                        </div>
                                    </div>
                                )}
                                {orderDetails.orderDetails.supplier_logistics_data.package_information.package_details[0].dimensions?.volume && (
                                    <div className="buyer-order-details-top-order-cont">
                                        <div className="details-payment-inner-text">Total Volume</div>
                                        <div className="details-payment-content">
                                            {orderDetails.orderDetails.supplier_logistics_data.package_information.package_details[0].dimensions.volume} L
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Invoice List Section */}
       {/*      {orderDetails?.invoices?.length > 0 && (
                <div className='active-order-details-invoice-list-section'>
                    <ActiveInvoiceList invoiceData={orderDetails.invoices} />
                </div>
            )} */}

            {/* Modal Component */}
          {/*   {orderDetails?.buyer && orderDetails?.buyer_id && (
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
            )} */}
        </div>
  )
}

export default ActiveOrderDetails