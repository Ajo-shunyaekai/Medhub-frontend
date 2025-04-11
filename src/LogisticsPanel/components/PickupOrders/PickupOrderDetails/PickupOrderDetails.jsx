import React, { useEffect, useState } from "react";
import styles from "./PickupOrderDetails.module.css";
// import ProductList from "./LogisticsProductList";
import { Link, useNavigate, useParams } from "react-router-dom";
import { postRequestWithToken } from "../../../../api/Requests";
import { toast } from "react-toastify";
import moment from "moment";
import { apiRequests } from "../../../../api";

const PickupOrderDetails = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const partnerIdSessionStorage = localStorage.getItem("partner_id");
  const partnerIdLocalStorage = localStorage.getItem("partner_id");

  const [loading, setLoading] = useState(false);
  const [requestDetails, setRequestDetails] = useState();
  const [pickupDate, setPickupDate] = useState(null);
  const [pickupTime, setPickupTime] = useState(null);

  const handleAccept = async () => {
    if (!partnerIdSessionStorage && !partnerIdLocalStorage) {
      navigate("/logistics/login");
      return;
    }
    setLoading(true);
    const obj = {
      logisticsId: requestId,
      orderId: requestDetails?.orderId,
      partner_id: partnerIdSessionStorage || partnerIdLocalStorage,
      pickup_date: pickupDate,
      pickup_time: pickupTime,
    };

    try {
      const response = await apiRequests.postRequest(
        `logistics/update-logistics-details`,
        obj
      );
      if (response.code === 200) {
        setTimeout(() => {
          navigate("/logistics/order");
          setLoading(true);
        }, 500);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error in update-logistics-details api");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const fetchData = async () => {
    if (!partnerIdSessionStorage && !partnerIdLocalStorage) {
      navigate("/logistics/login");
      return;
    }
    const obj = {
      logistics_id: requestId,
      partner_id: partnerIdSessionStorage || partnerIdLocalStorage,
    };

    try {
      const response = await apiRequests.getRequest(
        `logistics/get-logistics-details/${requestId}`,
        obj
      );
      if (response.code === 200) {
        setRequestDetails(response.result);
        setPickupDate(
          response?.result?.orderDetails?.supplier_logistics_data?.pickup_date
            ? moment(
                response?.result?.orderDetails.supplier_logistics_data
                  .pickup_date
              ).format("DD-MM-YYYY")
            : null
        );
        setPickupTime(
          response?.result?.orderDetails?.supplier_logistics_data?.pickup_time
        );
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
      {/* <div className={styles.logisticsSection}>
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
              {requestDetails?.buyerDetails?.contact_person_mobile}
            </span>
          </div>
        </div>
      </div> */}
      {/* Start the table product details name */}
      {/* <ProductList
        productList={
          requestDetails?.orderDetails?.supplier_logistics_data
            ?.bill_of_material?.products
        }
      /> */}
      {/* End the table product details name */}
      {/* start the logistics section */}
      <div className={styles.logisticsSection}>
        <div className={styles.logisticsDropContainer}>
          <div className={styles.logisticsCompanySection}>
            <span className={styles.logisticsCompanyHead}>Drop Details</span>
            <span className={styles.logisticsText}>
              {requestDetails?.orderDetails?.buyer_logistics_data?.full_name}{" "}
              {/* <span className={styles.logisticsAddress}>
                {
                  requestDetails?.orderDetails?.buyer_logistics_data
                    ?.address_type
                }
              </span> */}
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
              <span className={styles.logisticsAddText}>
                {
                  requestDetails?.orderDetails?.buyer_logistics_data
                    ?.mode_of_transport
                }
              </span>
            </div>
            <div className={styles.logisticsAddContainer}>
              <span className={styles.logisticsAddHead}>Extra Services</span>
              <span className={styles.logisticsAddText}>
                {requestDetails?.orderDetails?.buyer_logistics_data?.extra_services?.join(
                  ", "
                )}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.logisticsDropContainer}>
          <div className={styles.logisticsCompanySection}>
            <span className={styles.logisticsCompanyHead}>Pickup Details</span>
            <span className={styles.logisticsText}>
              {requestDetails?.orderDetails?.supplier_logistics_data?.full_name}{" "}
              {/* <span className={styles.logisticsAddress}>
                {
                  requestDetails?.orderDetails?.supplier_logistics_data
                    ?.address_type
                }
              </span> */}
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
              <span className={styles.logisticsAddText}>{pickupDate}</span>
            </div>
            <div className={styles.logisticsAddContainer}>
              <span className={styles.logisticsAddHead}>
                Preferred Time of Pickup
              </span>
              <span className={styles.logisticsAddText}>{pickupTime}</span>
            </div>
          </div>
        </div>
      </div>
      {/* end the logistics section */}

      {/* start the package details */}
      <div className={styles.packageMainContainer}>
        <div className={styles.packageMainHeading}>Package Details</div>
        {requestDetails?.orderDetails?.supplier_logistics_data?.package_information?.package_details?.map(
          (packageDetail, index) => (
            <div key={index} className={styles.packageConatiner}>
              <div className={styles.packageWeight}>
                <div className={styles.logisticsAddHead}>Package Weight</div>
                <span className={styles.logisticsAddText}>
                  {packageDetail?.weight || "N/A"}
                </span>
              </div>
              <div className={styles.packageDimension}>
                <div className={styles.packageDimensionSEction}>
                  <div className={styles.logisticsAddHead}>Height</div>
                  <span className={styles.logisticsAddText}>
                    {packageDetail?.dimensions?.height || "N/A"}
                  </span>
                </div>
                <div className={styles.packageDimensionSEction}>
                  <div className={styles.logisticsAddHead}>Width</div>
                  <span className={styles.logisticsAddText}>
                    {packageDetail?.dimensions?.width || "N/A"}
                  </span>
                </div>
                <div className={styles.packageDimensionSEction}>
                  <div className={styles.logisticsAddHead}>Length</div>
                  <span className={styles.logisticsAddText}>
                    {packageDetail?.dimensions?.length || "N/A"}
                  </span>
                </div>
              </div>
              <div className={styles.packageWeight}>
                <div className={styles.logisticsAddHead}>Total Volume</div>
                <span className={styles.logisticsAddText}>
                  {packageDetail?.dimensions?.volume || "N/A"}
                </span>
              </div>
            </div>
          )
        )}

        {/* <div className={styles.packageConatiner}>
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
        </div> */}
      </div>

      {/* start the logistics section */}
      {requestDetails?.status === "pending" && (
        <div className={styles.logisticsButtonContainer}>
          <button className={styles.logisticsAccept} onClick={handleAccept}>
            {loading ? <div className="loading-spinner"></div> : "Accept"}
          </button>
          <buttton className={styles.logisticsCancel} onClick={handleCancel}>
            Cancel
          </buttton>
        </div>
      )}

      {/* end the package details */}
    </div>
  );
};

export default PickupOrderDetails;
