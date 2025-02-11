import React, { useEffect, useState } from "react";
import styles from "./logisticsdetails.module.css";
import ProductList from "./LogisticsProductList";
import { Link, useNavigate, useParams } from "react-router-dom";
import { postRequestWithToken } from "../../../../api/Requests";
import { toast } from "react-toastify";
import moment from "moment";
import { apiRequests } from "../../../../api";

const LogisticsDetails = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const partnerIdSessionStorage = sessionStorage.getItem("partner_id");
  const partnerIdLocalStorage = localStorage.getItem("partner_id");

  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState("1h");
  const [requestDetails, setRequestDetails] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    if (!partnerIdSessionStorage && !partnerIdLocalStorage) {
      navigate("/buyer/login");
      return;
    }
    const obj = {
      logistics_id: requestId,
      buyer_id: partnerIdSessionStorage || partnerIdLocalStorage,
    };

    try {
      const response = await apiRequests.getRequest(
        `logistics/get-logistics-details/${requestId}`,
        obj
      );
      if (response.code === 200) {
        setRequestDetails(response.result);
      }
    } catch (error) {
      console.log("error in order details api");
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate, requestId]);
  return (
    <div className={styles.container}>
      <div className={styles.MainHead}>
        Request ID : {requestDetails?.logistics_id}
      </div>
      <div className={styles.logisticsSection}>
        <div className={styles.logisticsCompanySection}>
          <span className={styles.logisticsCompanyHead}>Supplier Details:</span>
          <div className={styles.logisticsInnerSection}>
            <span className={styles.logisticsInnerHead}>Company Name:</span>
            <span className={styles.logisticsInnerText}>
              {requestDetails?.supplierDetails?.supplier_name}
            </span>
          </div>
          <div className={styles.logisticsInnerSection}>
            <span className={styles.logisticsInnerHead}>Company Type:</span>
            <span className={styles.logisticsInnerText}>
              {requestDetails?.supplierDetails?.supplier_type}
            </span>
          </div>
          <div className={styles.logisticsInnerSection}>
            <span className={styles.logisticsInnerHead}>Contact Name:</span>
            <span className={styles.logisticsInnerText}>
              {requestDetails?.supplierDetails?.contact_person_name}
            </span>
          </div>
          <div className={styles.logisticsInnerSection}>
            <span className={styles.logisticsInnerHead}>Email ID:</span>
            <span className={styles.logisticsInnerText}>
              {requestDetails?.supplierDetails?.contact_person_email}
            </span>
          </div>
          <div className={styles.logisticsInnerSection}>
            <span className={styles.logisticsInnerHead}>Phone No:</span>
            <span className={styles.logisticsInnerText}>
              {requestDetails?.supplierDetails?.contact_person_country_code}{" "}
              {requestDetails?.supplierDetails?.contact_person_mobile_no}
            </span>
          </div>
        </div>

        <div className={styles.logisticsCompanySection}>
          <span className={styles.logisticsCompanyHead}>Buyer Details:</span>
          <div className={styles.logisticsInnerSection}>
            <span className={styles.logisticsInnerHead}>Company Name:</span>
            <span className={styles.logisticsInnerText}>
              {requestDetails?.buyerDetails?.buyer_name}
            </span>
          </div>
          <div className={styles.logisticsInnerSection}>
            <span className={styles.logisticsInnerHead}>Company Type:</span>
            <span className={styles.logisticsInnerText}>
              {requestDetails?.buyerDetails?.buyer_type}
            </span>
          </div>
          <div className={styles.logisticsInnerSection}>
            <span className={styles.logisticsInnerHead}>Contact Name:</span>
            <span className={styles.logisticsInnerText}>
              {requestDetails?.buyerDetails?.contact_person_name}
            </span>
          </div>
          <div className={styles.logisticsInnerSection}>
            <span className={styles.logisticsInnerHead}>Email ID:</span>
            <span className={styles.logisticsInnerText}>
              {requestDetails?.buyerDetails?.contact_person_email}
            </span>
          </div>
          <div className={styles.logisticsInnerSection}>
            <span className={styles.logisticsInnerHead}>Phone No:</span>
            <span className={styles.logisticsInnerText}>
              {requestDetails?.buyerDetails?.contact_person_country_code}{" "}
              {requestDetails?.supplierDetails?.contact_person_mobile}
            </span>
          </div>
        </div>
      </div>
      {/* Start the table product details name */}
      <ProductList />
      {/* End the table product details name */}
      {/* start the logistics section */}
      <div className={styles.logisticsSection}>
        <div className={styles.logisticsDropContainer}>
          <div className={styles.logisticsCompanySection}>
            <span className={styles.logisticsCompanyHead}>Drop Details</span>
            <span className={styles.logisticsText}>
              {requestDetails?.orderDetails?.buyer_logistics_data?.full_name}{" "}
              <span className={styles.logisticsAddress}>
                {
                  requestDetails?.orderDetails?.buyer_logistics_data
                    ?.address_type
                }
              </span>
            </span>
            <span className={styles.logisticsText}>
              {
                requestDetails?.orderDetails?.buyer_logistics_data
                  ?.mobile_number
              }
            </span>
            <span className={styles.logisticsText}>
              {
                requestDetails?.orderDetails?.buyer_logistics_data
                  ?.company_reg_address
              }{" "}
              {requestDetails?.orderDetails?.buyer_logistics_data?.locality}{" "}
              {requestDetails?.orderDetails?.buyer_logistics_data?.land_mark}
            </span>
            <span className={styles.logisticsText}>
              {requestDetails?.orderDetails?.buyer_logistics_data?.city}{" "}
              {requestDetails?.orderDetails?.buyer_logistics_data?.state}{" "}
              {requestDetails?.orderDetails?.buyer_logistics_data?.country}{" "}
              {requestDetails?.orderDetails?.buyer_logistics_data?.pincode}
            </span>
          </div>
          <div className={styles.logisticsAddSec}>
            <div className={styles.logisticsAddContainer}>
              <span className={styles.logisticsAddHead}>Mode of Transport</span>
              <span className={styles.logisticsAddText}>{requestDetails?.orderDetails?.buyer_logistics_data?.mode_of_transport}</span>
            </div>
            <div className={styles.logisticsAddContainer}>
              <span className={styles.logisticsAddHead}>Extra Services</span>
              <span className={styles.logisticsAddText}>{requestDetails?.orderDetails?.buyer_logistics_data?.extra_services?.join(', ')}</span>
            </div>
          </div>
        </div>
        <div className={styles.logisticsDropContainer}>
          <div className={styles.logisticsCompanySection}>
            <span className={styles.logisticsCompanyHead}>Pickup Details</span>
            <span className={styles.logisticsText}>
            {
                requestDetails?.orderDetails?.supplier_logistics_data
                  ?.full_name
              }{" "}
              <span className={styles.logisticsAddress}>{requestDetails?.orderDetails?.supplier_logistics_data?.address_type}</span>
            </span>
            <span className={styles.logisticsText}>
            {
                requestDetails?.orderDetails?.buyer_logistics_data
                  ?.mobile_number
              }
            </span>
            <span className={styles.logisticsText}>
            {
                requestDetails?.orderDetails?.buyer_logistics_data
                  ?.company_reg_address
              }{" "}
              {requestDetails?.orderDetails?.buyer_logistics_data?.locality}{" "}
              {requestDetails?.orderDetails?.buyer_logistics_data?.land_mark}
            </span>
            <span className={styles.logisticsText}>
            {requestDetails?.orderDetails?.buyer_logistics_data?.city}{" "}
              {requestDetails?.orderDetails?.buyer_logistics_data?.state}{" "}
              {requestDetails?.orderDetails?.buyer_logistics_data?.country}{" "}
              {requestDetails?.orderDetails?.buyer_logistics_data?.pincode}
            </span>
          </div>
          <div className={styles.logisticsAddSec}>
            <div className={styles.logisticsAddContainer}>
              <span className={styles.logisticsAddHead}>
                Preferred Date of Pickup
              </span>
              <span className={styles.logisticsAddText}>

              {requestDetails?.orderDetails?.supplier_logistics_data?.pickup_date 
    ? moment(requestDetails.orderDetails.supplier_logistics_data.pickup_date).format("DD-MM-YYYY") 
    : "N/A"}
                </span>
            </div>
            <div className={styles.logisticsAddContainer}>
              <span className={styles.logisticsAddHead}>
                Preferred Time of Pickup
              </span>
              <span className={styles.logisticsAddText}>{requestDetails?.orderDetails?.supplier_logistics_data?.pickup_time}</span>
            </div>
          </div>
        </div>
      </div>
      {/* end the logistics section */}

      {/* start the package details */}
      <div className={styles.packageMainContainer}>
        <div className={styles.packageMainHeading}>Package Details</div>
        <div className={styles.packageConatiner}>
          <div className={styles.packageWeight}>
            <div className={styles.logisticsAddHead}>Package Weight</div>
            <span className={styles.logisticsAddText}>500</span>
          </div>
          <div className={styles.packageDimension}>
            <div className={styles.packageDimensionSEction}>
              <div className={styles.logisticsAddHead}>Height</div>
              <span className={styles.logisticsAddText}>100</span>
            </div>
            <div className={styles.packageDimensionSEction}>
              <div className={styles.logisticsAddHead}>Width</div>
              <span className={styles.logisticsAddText}>100</span>
            </div>
            <div className={styles.packageDimensionSEction}>
              <div className={styles.logisticsAddHead}>Length</div>
              <span className={styles.logisticsAddText}>50</span>
            </div>
          </div>
          <div className={styles.packageWeight}>
            <div className={styles.logisticsAddHead}>Total Volume</div>
            <span className={styles.logisticsAddText}>1500</span>
          </div>
        </div>
      </div>

      {/* start the logistics section */}
      <div className={styles.logisticsButtonContainer}>
        <button className={styles.logisticsAccept}>Accept </button>
        <buttton className={styles.logisticsCancel}>Cancel</buttton>
      </div>
      {/* end the package details */}
    </div>
  );
};

export default LogisticsDetails;
