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
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const adminId = localStorage.getItem("admin_id");
    if (!adminId) {
      localStorage.clear();
      navigate("/admin/login");
      return;
    }

    try {
      const obj = { order_id: orderId, admin_id: adminId };
      const response = await apiRequests.getRequest(
        `order/get-specific-order-details/${orderId}`,
        obj
      );

      if (response?.code === 200) {
        setOrderDetails(response.result);
      } else {
        setError("Failed to fetch order details. Please try again.");
        console.error("Failed to fetch order details:", response?.message);
      }
    } catch (error) {
      setError("An error occurred while fetching order details.");
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate, orderId]);

  if (error) {
    return <div className={styles.Container}>{error}</div>;
  }

  if (!orderDetails) {
    return <div className={styles.Container}>Loading...</div>;
  }

  return (
    <div className={styles.Container}>
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
            <div className={styles.content}>{orderDetails?.buyer?.buyer_type}</div>
          </div>
        )}
        {orderDetails?.status && (
          <div className={styles.detailSection}>
            <div className={styles.heading}>Order Status</div>
            <div className={styles.content}>{orderDetails?.status}</div>
          </div>
        )}
      </div>

      {orderDetails?.items?.length > 0 && (
        <div className={styles.driverSection}>
          <AssignDriver orderItems={orderDetails?.items} />
        </div>
      )}

      {(orderDetails?.payment_terms?.length > 0 ||
        orderDetails?.status === "Completed" ||
        orderDetails?.buyer_logistics_data ||
        orderDetails?.supplier_logistics_data) && (
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
                        : `${Math.round(
                            (orderDetails?.invoices.filter(
                              (invoice) => invoice.payment_status === "paid"
                            ).length /
                              orderDetails?.invoices.length) *
                              100
                          )}% Completed`}
                    </div>
                  </div>
                )}
            </div>
          )}

          {orderDetails?.supplier_logistics_data && (
            <div className={styles.pickupSection}>
              <span className={styles.mainHeading}>Pickup Details</span>
              <div className={styles.pickupInnerSection}>
                {orderDetails?.supplier_logistics_data?.full_name && (
                  <div className={styles.content}>
                    {orderDetails?.supplier_logistics_data?.full_name}
                    <span className={styles.details}>{orderDetails?.supplier_logistics_data?.address_type}</span>
                  </div>
                )}
                {(orderDetails?.supplier_logistics_data?.company_reg_address ||
                  orderDetails?.supplier_logistics_data?.locality ||
                  orderDetails?.supplier_logistics_data?.land_mark ||
                  orderDetails?.supplier_logistics_data?.country ||
                  orderDetails?.supplier_logistics_data?.state ||
                  orderDetails?.supplier_logistics_data?.city ||
                  orderDetails?.supplier_logistics_data?.pincode) && (
                  <div className={styles.content}>
                    {orderDetails?.supplier_logistics_data?.company_reg_address || ""}
                    {orderDetails?.supplier_logistics_data?.locality &&
                      `, ${orderDetails?.supplier_logistics_data?.locality}`}
                    {orderDetails?.supplier_logistics_data?.land_mark &&
                      `, ${orderDetails?.supplier_logistics_data?.land_mark}`}
                    {orderDetails?.supplier_logistics_data?.city &&
                      `, ${orderDetails?.supplier_logistics_data?.city}`}
                    {orderDetails?.supplier_logistics_data?.state &&
                      `, ${orderDetails?.supplier_logistics_data?.state}`}
                    {orderDetails?.supplier_logistics_data?.country &&
                      `, ${orderDetails?.supplier_logistics_data?.country}`}
                    {orderDetails?.supplier_logistics_data?.pincode &&
                      `, ${orderDetails?.supplier_logistics_data?.pincode}`}
                  </div>
                )}
                 {orderDetails?.supplier_logistics_data?.mobile_number && (
                  <div className={styles.content}>
                    {orderDetails?.supplier_logistics_data?.mobile_number}
                  </div>
                )}
               
              </div>
            </div>
          )}

          {(orderDetails?.buyer_logistics_data ||
            orderDetails?.logistics_details?.drop_location) && (
            <div className={styles.pickupSection}>
              <span className={styles.mainHeading}>Drop Details</span>
              <div className={styles.pickupInnerSection}>
                {(orderDetails?.buyer_logistics_data?.full_name ||
                  orderDetails?.logistics_details?.drop_location?.name) && (
                  <div className={styles.content}>
                    {orderDetails?.buyer_logistics_data?.full_name ||
                      orderDetails?.logistics_details?.drop_location?.name}
                       <span className={styles.details}>{orderDetails?.buyer_logistics_data?.address_type}</span>
                  </div>
                )}
                {(orderDetails?.buyer_logistics_data?.mobile_number ||
                  orderDetails?.logistics_details?.drop_location?.mobile) && (
                  <div className={styles.content}>
                    {orderDetails?.buyer_logistics_data?.mobile_number ||
                      orderDetails?.logistics_details?.drop_location?.mobile}
                  </div>
                )}
                {(orderDetails?.buyer_logistics_data?.company_reg_address ||
                  orderDetails?.logistics_details?.drop_location?.address) && (
                  <div className={styles.content}>
                    {orderDetails?.buyer_logistics_data?.company_reg_address ||
                      orderDetails?.logistics_details?.drop_location?.address}
                    {orderDetails?.buyer_logistics_data?.locality &&
                      `, ${orderDetails?.buyer_logistics_data?.locality}`}
                    {orderDetails?.buyer_logistics_data?.land_mark &&
                      `, ${orderDetails?.buyer_logistics_data?.land_mark}`}
                    {orderDetails?.buyer_logistics_data?.city &&
                      `, ${orderDetails?.buyer_logistics_data?.city}`}
                    {orderDetails?.buyer_logistics_data?.state &&
                      `, ${orderDetails?.buyer_logistics_data?.state}`}
                    {orderDetails?.buyer_logistics_data?.country &&
                      `, ${orderDetails?.buyer_logistics_data?.country}`}
                    {orderDetails?.buyer_logistics_data?.pincode &&
                      `, ${orderDetails?.buyer_logistics_data?.pincode}`}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.transportContainer}>
        {(orderDetails?.buyer_logistics_data ||
          orderDetails?.logistics_details) && (
          <div className={styles.transportSection}>
            <span className={styles.mainHeading}>Transport Details</span>
            <div className={styles.transportInnerSection}>
              {(orderDetails?.buyer_logistics_data?.mode_of_transport ||
                orderDetails?.logistics_details?.prefered_mode) && (
                <div className={styles.detailsInnerSection}>
                  <div className={styles.heading}>Mode of Transport</div>
                  <div className={styles.content}>
                    {orderDetails?.buyer_logistics_data?.mode_of_transport ||
                      orderDetails?.logistics_details?.prefered_mode}
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
        )}

        {(orderDetails?.supplier_logistics_data?.pickup_date ||
          orderDetails?.supplier_logistics_data?.pickup_time) && (
          <div className={styles.transportSection}>
            <span className={styles.mainHeading}>Pickup Slot</span>
            <div className={styles.transportInnerSection}>
              {orderDetails?.supplier_logistics_data?.pickup_date && (
                <div className={styles.detailsInnerSection}>
                  <div className={styles.heading}>Preferred Pickup Date:</div>
                  <div className={styles.content}>
                    {new Date(
                      orderDetails?.supplier_logistics_data?.pickup_date
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                </div>
              )}
              {orderDetails?.supplier_logistics_data?.pickup_time && (
                <div className={styles.detailsInnerSection}>
                  <div className={styles.heading}>Preferred Pickup Time:</div>
                  <div className={styles.content}>
                    {orderDetails?.supplier_logistics_data?.pickup_time}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {orderDetails?.supplier_logistics_data?.package_information && (
        <div className={styles.materialContainer}>
          <div className={styles.billSection}>
            <span className={styles.mainHeading}>Bills of Material</span>
            {orderDetails?.supplier_logistics_data?.package_information
              ?.total_no_of_packages && (
              <div className={styles.detailSection}>
                <div className={styles.heading}>No. of Packages</div>
                <div className={styles.content}>
                  {
                    orderDetails?.supplier_logistics_data?.package_information
                      ?.total_no_of_packages
                  }
                </div>
              </div>
            )}
          </div>
          {orderDetails?.supplier_logistics_data?.package_information
            ?.package_details && (
            <div className={styles.volumeContainers}>
              <span className={styles.mainHeading}>Package Details</span>
              <div className={styles.volumeSections}>
                {orderDetails?.supplier_logistics_data?.package_information
                  ?.package_details[0]?.weight && (
                  <div className={styles.detailSection}>
                    <div className={styles.heading}>Total Packages Weight</div>
                    <div className={styles.content}>
                      {
                        orderDetails?.supplier_logistics_data?.package_information
                          ?.package_details[0]?.weight
                      }{" "}
                      Kg
                    </div>
                  </div>
                )}
                {orderDetails?.supplier_logistics_data?.package_information
                  ?.package_details[0]?.dimensions?.width && (
                  <div className={styles.detailSection}>
                    <div className={styles.heading}>Width</div>
                    <div className={styles.content}>
                      {
                        orderDetails?.supplier_logistics_data?.package_information
                          ?.package_details[0]?.dimensions?.width
                      }{" "}
                      cm
                    </div>
                  </div>
                )}
                {orderDetails?.supplier_logistics_data?.package_information
                  ?.package_details[0]?.dimensions?.height && (
                  <div className={styles.detailSection}>
                    <div className={styles.heading}>Height</div>
                    <div className={styles.content}>
                      {
                        orderDetails?.supplier_logistics_data?.package_information
                          ?.package_details[0]?.dimensions?.height
                      }{" "}
                      cm
                    </div>
                  </div>
                )}
                {orderDetails?.supplier_logistics_data?.package_information
                  ?.package_details[0]?.dimensions?.length && (
                  <div className={styles.detailSection}>
                    <div className={styles.heading}>Length</div>
                    <div className={styles.content}>
                      {
                        orderDetails?.supplier_logistics_data?.package_information
                          ?.package_details[0]?.dimensions?.length
                      }{" "}
                      cm
                    </div>
                  </div>
                )}
                {orderDetails?.supplier_logistics_data?.package_information
                  ?.package_details[0]?.dimensions?.volume && (
                  <div className={styles.detailSection}>
                    <div className={styles.heading}>Total Volume</div>
                    <div className={styles.content}>
                      {
                        orderDetails?.supplier_logistics_data?.package_information
                          ?.package_details[0]?.dimensions?.volume
                      }{" "}
                      L
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {orderDetails?.status === "Completed" && (
        <div className={styles.coordinatorSection}>
          {orderDetails?.coordinators ? (
            <SellerActiveCodinator coordinators={orderDetails?.coordinators} />
          ) : (
            <span className={styles.content}>No coordinators assigned</span>
          )}
        </div>
      )}

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