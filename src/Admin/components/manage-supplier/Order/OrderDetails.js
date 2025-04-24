import React, { useEffect, useState } from "react";
import styles from "../../../assets/style/orderdetails.module.css";
import AssignDriver from "../../shared-components/details/AssignDriver";
import { Link, useNavigate, useParams } from "react-router-dom";
import SellerActiveCodinator from "./SellerActiveCodinator";
import SellerActiveInvoiceList from "./SellerActiveInvoiceList";
import { apiRequests } from "../../../../api";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const adminIdSessionStorage = localStorage.getItem("admin_id");
  const adminIdLocalStorage = localStorage.getItem("admin_id");
  const [orderDetails, setOrderDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    if (!adminIdSessionStorage && !adminIdLocalStorage) {
      localStorage.clear();
      navigate("/admin/login");
      return;
    }
    const obj = {
      order_id: orderId,
      admin_id: adminIdSessionStorage || adminIdLocalStorage,
    };
    try {
      const response = await apiRequests.getRequest(
        `order/get-specific-order-details/${orderId}`,
        obj
      );
      if (response?.code === 200) {
        setOrderDetails(response.result);
      } else {
        console.error("Unexpected response code:", response?.code);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate, orderId]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.Container}>
      {orderDetails && (
        <div className={styles.mainContainer}>
          <span className={styles.mainHead}>Order ID: {orderDetails?.order_id}</span>
          {orderDetails?.items?.length > 0 && (
            <span className={styles.medicineText}>
              {orderDetails.items.map((item, index) => (
                <React.Fragment key={item._id || index}>
                  {item.medicine_name}
                  {index < orderDetails.items.length - 1 && " || "}
                </React.Fragment>
              ))}
            </span>
          )}
          {orderDetails?.buyer_id && orderDetails?.buyer?.buyer_name && (
            <Link to={`/admin/buyer-details/${orderDetails?.buyer_id}`}>
              <span className={styles.medicineText}>
                Purchased By: {orderDetails?.buyer?.buyer_name}
              </span>
            </Link>
          )}
        </div>
      )}

      {orderDetails && (
        <div className={styles.detailsContainer}>
          {orderDetails?.buyer?.country_of_origin && (
            <div className={styles.detailSection}>
              <div className={styles.heading}>Country of Origin</div>
              <div className={styles.content}>
                {orderDetails?.buyer?.country_of_origin}
              </div>
            </div>
          )}
          {orderDetails?.buyer?.buyer_type && (
            <div className={styles.detailSection}>
              <div className={styles.heading}>Company Type</div>
              <div className={styles.content}>
                {orderDetails?.buyer?.buyer_type}
              </div>
            </div>
          )}
          {orderDetails?.status && (
            <div className={styles.detailSection}>
              <div className={styles.heading}>Order Status</div>
              <div className={styles.content}>{orderDetails?.status}</div>
            </div>
          )}
        </div>
      )}

      {/* Assign Driver Section */}
      {orderDetails?.items?.length > 0 && (
        <div className={styles.driverSection}>
          <AssignDriver orderItems={orderDetails?.items} />
        </div>
      )}

      {/* Payment and Pickup/Drop Details */}
      {(orderDetails?.payment_terms?.length > 0 ||
        orderDetails?.status === "Completed" ||
        orderDetails?.buyer_logistics_data ||
        orderDetails?.supplier) && (
        <div className={styles.paymentContainer}>
          {(orderDetails?.payment_terms?.length > 0 ||
            orderDetails?.status === "Completed") && (
            <div className={styles.paymentInnerContainer}>
              <span className={styles.mainHeading}>Payment</span>
              {orderDetails?.payment_terms?.length > 0 && (
                <div className={styles.paymentSection}>
                  <div className={styles.heading}>Payment Terms</div>
                  <div className={styles.content}>
                    <ul className={styles.paymentUlSection}>
                      {orderDetails?.payment_terms.map((data, i) => (
                        <li key={i} className={styles.paymentText}>
                          {data}.
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {orderDetails?.status === "Completed" &&
                orderDetails?.invoices?.length > 0 && (
                  <div className={styles.paymentSection}>
                    <div className={styles.heading}>Payment Status</div>
                    <div className={styles.content}>
                      {orderDetails?.invoices.every(
                        (invoice) => invoice.payment_status === "paid"
                      )
                        ? "100% Done"
                        : "60% Completed"}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Pickup Details */}
          {orderDetails?.supplier && (
            <div className={styles.pickupSection}>
              <span className={styles.mainHeading}>Pickup Details</span>
              <div className={styles.pickupInnerSection}>
                {orderDetails?.supplier?.supplier_name && (
                  <div className={styles.content}>
                    {orderDetails?.supplier?.supplier_name}
                  </div>
                )}
                {orderDetails?.supplier_address && (
                  <div className={styles.content}>
                    {orderDetails?.supplier_address}
                  </div>
                )}
                {orderDetails?.supplier_mobile && (
                  <div className={styles.content}>
                    {orderDetails?.supplier_mobile}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Drop Details */}
          {(orderDetails?.buyer_logistics_data || orderDetails?.shipment_details?.buyer_details) && (
            <div className={styles.pickupSection}>
              <span className={styles.mainHeading}>Drop Details</span>
              <div className={styles.pickupInnerSection}>
                {(orderDetails?.buyer_logistics_data?.full_name || orderDetails?.shipment_details?.buyer_details?.name) && (
                  <div className={styles.content}>
                    {orderDetails?.buyer_logistics_data?.full_name || orderDetails?.shipment_details?.buyer_details?.name}
                  </div>
                )}
                {(orderDetails?.buyer_logistics_data?.mobile_number || orderDetails?.shipment_details?.buyer_details?.mobile) && (
                  <div className={styles.content}>
                    {orderDetails?.buyer_logistics_data?.mobile_number || orderDetails?.shipment_details?.buyer_details?.mobile}
                  </div>
                )}
                {(orderDetails?.buyer_logistics_data?.company_reg_address ||
                  orderDetails?.buyer_logistics_data?.country ||
                  orderDetails?.buyer_logistics_data?.state ||
                  orderDetails?.buyer_logistics_data?.city ||
                  orderDetails?.buyer_logistics_data?.pincode ||
                  orderDetails?.shipment_details?.buyer_details?.address) && (
                  <div className={styles.content}>
                    {orderDetails?.buyer_logistics_data?.company_reg_address || orderDetails?.shipment_details?.buyer_details?.address}
                    {orderDetails?.buyer_logistics_data?.company_reg_address && ", "}
                    {orderDetails?.buyer_logistics_data?.locality}
                    {orderDetails?.buyer_logistics_data?.locality && ", "}
                    {orderDetails?.buyer_logistics_data?.country || orderDetails?.shipment_details?.buyer_details?.country}
                    {orderDetails?.buyer_logistics_data?.country && ", "}
                    {orderDetails?.buyer_logistics_data?.state || orderDetails?.shipment_details?.buyer_details?.state}
                    {orderDetails?.buyer_logistics_data?.state && ", "}
                    {orderDetails?.buyer_logistics_data?.city || orderDetails?.shipment_details?.buyer_details?.ciyt_disctrict}
                    {(orderDetails?.buyer_logistics_data?.pincode || orderDetails?.shipment_details?.buyer_details?.pincode) &&
                      `, ${orderDetails?.buyer_logistics_data?.pincode || orderDetails?.shipment_details?.buyer_details?.pincode}`}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Transport Details */}
      {(orderDetails?.buyer_logistics_data || orderDetails?.logistics_details) && (
        <div className={styles.transportContainer}>
          <div className={styles.transportSection}>
            <span className={styles.mainHeading}>Transport Details</span>
            <div className={styles.transportInnerSection}>
              {(orderDetails?.buyer_logistics_data?.mode_of_transport || orderDetails?.logistics_details?.prefered_mode) && (
                <div className={styles.detailsInnerSection}>
                  <div className={styles.heading}>Mode of Transport</div>
                  <div className={styles.content}>
                    {orderDetails?.buyer_logistics_data?.mode_of_transport || orderDetails?.logistics_details?.prefered_mode}
                  </div>
                </div>
              )}
              {orderDetails?.buyer_logistics_data?.extra_services && (
                <div className={styles.detailsInnerSection}>
                  <div className={styles.heading}>Extra Services</div>
                  <div className={styles.content}>
                    {orderDetails?.buyer_logistics_data?.extra_services.length > 0
                      ? orderDetails?.buyer_logistics_data?.extra_services.join(", ")
                      : "None"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Shipment Details */}
      {orderDetails?.shipment_details && (
        <div className={styles.materialContainer}>
          {(orderDetails?.shipment_details?.shipment_details?.no_of_packages ||
            orderDetails?.shipment_details?.package_information?.total_no_of_packages ||
            orderDetails?.shipment_details?.pickup_date ||
            orderDetails?.shipment_details?.pickup_time) && (
            <div className={styles.billSection}>
              <span className={styles.mainHeading}>Bills of Material</span>
              {(orderDetails?.shipment_details?.package_information?.total_no_of_packages ||
                orderDetails?.shipment_details?.shipment_details?.no_of_packages) && (
                <div className={styles.detailSection}>
                  <div className={styles.heading}>No. of Packages</div>
                  <div className={styles.content}>
                    {orderDetails?.shipment_details?.package_information?.total_no_of_packages ||
                      orderDetails?.shipment_details?.shipment_details?.no_of_packages}
                  </div>
                </div>
              )}
              {orderDetails?.shipment_details?.pickup_date && (
                <div className={styles.detailSection}>
                  <div className={styles.heading}>Pickup Date</div>
                  <div className={styles.content}>
                    {orderDetails?.shipment_details?.pickup_date}
                  </div>
                </div>
              )}
              {orderDetails?.shipment_details?.pickup_time && (
                <div className={styles.detailSection}>
                  <div className={styles.heading}>Pickup Time</div>
                  <div className={styles.content}>
                    {orderDetails?.shipment_details?.pickup_time}
                  </div>
                </div>
              )}
            </div>
          )}
          {(orderDetails?.shipment_details?.shipment_details?.total_weight ||
            orderDetails?.shipment_details?.shipment_details?.breadth ||
            orderDetails?.shipment_details?.shipment_details?.height ||
            orderDetails?.shipment_details?.shipment_details?.length ||
            orderDetails?.shipment_details?.shipment_details?.total_volume ||
            orderDetails?.shipment_details?.package_information?.package_details) && (
            <div className={styles.volumeContainers}>
              <span className={styles.mainHeading}>Package Details</span>
              <div className={styles.volumeSections}>
                {(orderDetails?.shipment_details?.package_information?.package_details?.[0]?.weight ||
                  orderDetails?.shipment_details?.shipment_details?.total_weight) && (
                  <div className={styles.detailSection}>
                    <div className={styles.heading}>Total Packages Weight</div>
                    <div className={styles.content}>
                      {orderDetails?.shipment_details?.package_information?.package_details?.[0]?.weight ||
                        orderDetails?.shipment_details?.shipment_details?.total_weight} Kg
                    </div>
                  </div>
                )}
                {(orderDetails?.shipment_details?.package_information?.package_details?.[0]?.dimensions?.width ||
                  orderDetails?.shipment_details?.shipment_details?.breadth) &&
                  orderDetails?.supplier_id && (
                    <Link to={`/buyer/supplier DETAILS/${orderDetails?.supplier_id}`}>
                      <div className={styles.detailSection}>
                        <div className={styles.heading}>Width</div>
                        <div className={styles.content}>
                          {orderDetails?.shipment_details?.package_information?.package_details?.[0]?.dimensions?.width ||
                            orderDetails?.shipment_details?.shipment_details?.breadth} cm
                        </div>
                      </div>
                    </Link>
                  )}
                {(orderDetails?.shipment_details?.package_information?.package_details?.[0]?.dimensions?.height ||
                  orderDetails?.shipment_details?.shipment_details?.height) && (
                  <div className={styles.detailSection}>
                    <div className={styles.heading}>Height</div>
                    <div className={styles.content}>
                      {orderDetails?.shipment_details?.package_information?.package_details?.[0]?.dimensions?.height ||
                        orderDetails?.shipment_details?.shipment_details?.height} cm
                    </div>
                  </div>
                )}
                {(orderDetails?.shipment_details?.package_information?.package_details?.[0]?.dimensions?.length ||
                  orderDetails?.shipment_details?.shipment_details?.length) && (
                  <div className={styles.detailSection}>
                    <div className={styles.heading}>Length</div>
                    <div className={styles.content}>
                      {orderDetails?.shipment_details?.package_information?.package_details?.[0]?.dimensions?.length ||
                        orderDetails?.shipment_details?.shipment_details?.length} cm
                    </div>
                  </div>
                )}
                {(orderDetails?.shipment_details?.package_information?.package_details?.[0]?.dimensions?.volume ||
                  orderDetails?.shipment_details?.shipment_details?.total_volume) && (
                  <div className={styles.detailSection}>
                    <div className={styles.heading}>Total Volume</div>
                    <div className={styles.content}>
                      {orderDetails?.shipment_details?.package_information?.package_details?.[0]?.dimensions?.volume ||
                        orderDetails?.shipment_details?.shipment_details?.total_volume} L
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Coordinator Section */}
      {orderDetails?.status === "Completed" && (
        <div className={styles.coordinatorSection}>
          {orderDetails?.coordinators ? (
            <SellerActiveCodinator coordinators={orderDetails?.coordinators} />
          ) : (
            <span className={styles.content}>No coordinators assigned</span>
          )}
        </div>
      )}

      {/* Invoice List Section */}
      <div className={styles.invoiceListSection}>
        {orderDetails?.invoices?.length > 0 ? (
          <SellerActiveInvoiceList invoiceData={orderDetails?.invoices} />
        ) : (
          <span className={styles.content}>No invoices available</span>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;