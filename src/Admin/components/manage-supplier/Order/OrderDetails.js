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
  const [refresh, setRefresh] = useState(false);

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
      }
    } catch (error) { }
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
      <div className={styles.mainContainer}>
        <span className={styles.mainHead}>Order ID: {orderDetails?.order_id}</span>
        <span className={styles.medicineText}>
          {orderDetails?.items?.map((item, index) => (
            <React.Fragment key={item._id || index}>
              {item.medicine_name} ({item.strength})
              {index < orderDetails.items.length - 1 && " || "}
            </React.Fragment>
          ))}
        </span>
        <Link
          to={`/admin/buyer-details/${orderDetails?.buyer_id}`}>
          <span className={styles.medicineText}>Purchased By: {orderDetails?.supplier?.supplier_name || "Pharmaceuticals Pvt Ltd"} </span>
        </Link>
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.detailSection}>
          <div className={styles.heading}>Country of Origin</div>
          <div className={styles.content}>
            {orderDetails?.buyer?.country_of_origin}
          </div>
        </div>
        <div className={styles.detailSection}>
          <div className={styles.heading}>Company Type</div>
          <div className={styles.content}>
            {orderDetails?.buyer?.buyer_type}
          </div>
        </div>
        <div className={styles.detailSection}>
          <div className={styles.heading}>Order Status</div>
          <div className={styles.content}>
            {orderDetails?.status}
          </div>
        </div>
      </div>

      {/* Assign Driver Section */}
      <div className={styles.driverSection}>
        <AssignDriver orderItems={orderDetails?.items} />
      </div>
      {/* Payment and Pickup/Drop Details */}
      <div className={styles.paymentContainer}>
        <div className={styles.paymentInnerContainer}>
          <span className={styles.mainHeading}>Payment</span>
          <div className={styles.paymentSection}>
            <div className={styles.heading}>Payment Terms</div>
            <div className={styles.content}>
              <ul className={styles.paymentUlSection}>
                {orderDetails?.enquiry?.payment_terms?.map((data, i) => (
                  <li key={i} className={styles.paymentText}>
                    {data}.
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {orderDetails?.status === "Completed" && (
            <div className={styles.paymentSection}>
              <div className={styles.heading}>Payment Status</div>
              <div className={styles.content}>
                {orderDetails?.order_status === "completed" ? "100% Done" : "60% Completed"}
              </div>
            </div>
          )}
        </div>

        {orderDetails?.shipment_details && Object.keys(orderDetails?.shipment_details).length > 0 && (
          <div className={styles.pickupSection}>
            <span className={styles.mainHeading}>Pickup Details</span>
            <div className={styles.pickupInnerSection}>
              <div className={styles.content}>
                {orderDetails?.shipment_details?.supplier_details?.name}<span></span>
              </div>
              <div className={styles.content}>
                {orderDetails?.shipment_details?.supplier_details?.address},
                {orderDetails?.shipment_details?.supplier_details?.country},
                {orderDetails?.shipment_details?.supplier_details?.state},
                {orderDetails?.shipment_details?.supplier_details?.ciyt_disctrict},
                {orderDetails?.shipment_details?.supplier_details?.pincode}.
              </div>
              <div className={styles.content}>
                {orderDetails?.shipment_details?.supplier_details?.mobile}
              </div>
            </div>
          </div>
        )}

        {orderDetails?.logistics_details && (
          <>
            <div className={styles.pickupSection}>
              <span className={styles.mainHeading}>Drop Details</span>
              <div className={styles.pickupInnerSection}>
                <div className={styles.content}>
                  {orderDetails?.logistics_details?.drop_location?.name}
                </div>
                <div className={styles.content}>
                  {orderDetails?.logistics_details?.drop_location?.mobile}
                </div>
                <div className={styles.content}>
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
      {/* Cost and Shipment Details */}
      {/* {orderDetails?.coordinators && Object.keys(orderDetails?.coordinators).length > 0 && ( */}
      <div className={styles.transportContainer}>
        <div className={styles.transportSection}>
          <span className={styles.mainHeading}>Transport Details</span>
          <div className={styles.transportInnerSection}>
          <div className={styles.detailsInnerSection}>
            <div className={styles.heading}>Mode of Transport</div>
            <div className={styles.content}>12 USD</div>
          </div>
          <div className={styles.detailsInnerSection}>
            <div className={styles.heading}>Extra Services</div>
            <div className={styles.content}>8 USD</div>
          </div>
          </div>
        </div>
        <div className={styles.transportSection}>
          <span className={styles.mainHeading}>Pickup Slot</span>
          <div className={styles.transportInnerSection}>
          <div className={styles.detailsInnerSection}>
            <div className={styles.heading}>Preferred Date of Pickup</div>
            <div className={styles.content}>12:00 PM</div>
          </div>
          <div className={styles.detailsInnerSection}>
            <div className={styles.heading}>Preferred Time of Pickup</div>
            <div className={styles.content}>12/10/2024 11:00AM to 12:00 PM</div>
          </div>
          </div>
        </div>
      </div>
      {/* )} */}

      {/* Shipment Details */}
      {orderDetails?.shipment_details && Object.keys(orderDetails?.shipment_details).length > 0 && (
        <div className={styles.materialContainer}>
          <div className={styles.billSection}>
            <span className={styles.mainHeading}>Bills of Material</span>
            <div className={styles.detailSection}>
              <div className={styles.heading}>No. of Packages</div>
              <div className={styles.content}>
                {orderDetails?.shipment_details?.shipment_details?.no_of_packages || "5"}
              </div>
            </div>
          </div>
          <div className={styles.volumeContainers}>
            <span className={styles.mainHeading}>Package Details</span>
            <div className={styles.volumeSections}>
            <div className={styles.detailSection}>
              <div className={styles.heading}>Total Packages Weight</div>
              <div className={styles.content}>
                {orderDetails?.shipment_details?.shipment_details?.total_weight || "6"} Kg
              </div>
            </div>

            <Link to={`/buyer/supplier-details/${orderDetails?.supplier_id}`}>
              <div className={styles.detailSection}>
                <div className={styles.heading}>Width</div>
                <div className={styles.content}>
                  {orderDetails?.shipment_details?.shipment_details?.breadth} cm
                </div>
              </div>
            </Link>
            <div className={styles.detailSection}>
              <div className={styles.heading}>Height</div>
              <div className={styles.content}>
                {orderDetails?.shipment_details?.shipment_details?.height} cm
              </div>
            </div>
            <div className={styles.detailSection}>
              <div className={styles.heading}>Length</div>
              <div className={styles.content}>
                {orderDetails?.shipment_details?.shipment_details?.length} cm
              </div>
            </div>
            <div className={styles.detailSection}>
              <div className={styles.heading}>Total Volume</div>
              <div className={styles.content}>
                {orderDetails?.shipment_details?.shipment_details?.total_volume} L
              </div>
            </div>
            </div>
          </div>
        </div>
      )}



      {/* Coordinator Section */}
      {
        orderDetails?.status === "Completed" && (
          <div className={styles.coordinatorSection}>
            <SellerActiveCodinator />
          </div>
        )
      }

      {/* Invoice List Section */}
      {
        orderDetails?.invoices && orderDetails?.invoices.length > 0 && (
          <div className={styles.invoiceListSection}>
            <SellerActiveInvoiceList invoiceData={orderDetails?.invoices} />
          </div>
        )
      }
    </div >
  );
};

export default OrderDetails;