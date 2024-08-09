import React, { useEffect, useState } from "react";
import "../style/ongoingdetails.css";
import OnGoingList from "./OnGoingList";
import { Link, useNavigate, useParams } from "react-router-dom";
import { postRequestWithToken } from "../api/Requests";
import moment from "moment-timezone";
import ProductList from "./details/ProductList";
import { toast } from "react-toastify";

const OnGoingInquiriesDetails = () => {
  const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
  const buyerIdLocalStorage = localStorage.getItem("buyer_id");

  const { inquiryId } = useParams();
  const navigate      = useNavigate();

  const [inquiryDetails, setInquiryDetails] = useState();
  const [acceptedItems, setAcceptedItems]   = useState([]);
  const [rejectedItems, setRejectedItems]   = useState([]);

  const email = inquiryDetails?.supplier?.contact_person_email;
  const subject = `Inquiry about Inquiry ${
    inquiryDetails?.enquiry_id || "unknown"
  }`;
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  useEffect(() => {
    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      navigate("/buyer/login");
      return;
    }
    const obj = {
      buyer_id   : buyerIdSessionStorage || buyerIdLocalStorage,
      enquiry_id : inquiryId,
    };
    postRequestWithToken("buyer/enquiry/enquiry-details", obj, async (response) => {
        if (response.code === 200) {
          setInquiryDetails(response?.result);
          const acceptedItems = [];
          const rejectedItems = [];

          response?.result?.quotation_items?.forEach((item) => {
            if (item.status === "accepted") {
              acceptedItems.push(item);
            } else if (item.status === "rejected") {
              rejectedItems.push(item);
            }
          });
          setAcceptedItems(acceptedItems);
          setRejectedItems(rejectedItems);

          sessionStorage.setItem("acceptedQuotationItems",JSON.stringify(acceptedItems));
          sessionStorage.setItem("rejectedQuotationItems",JSON.stringify(rejectedItems));
        } else {
          console.log("error in order list api", response);
        }
      }
    );
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("acceptedQuotationItems");
      sessionStorage.removeItem("rejectedQuotationItems");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleAccept = (item, status) => {
    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      navigate("/buyer/login");
      return;
    }
    const obj = {
      buyer_id   : buyerIdSessionStorage || buyerIdLocalStorage,
      enquiry_id : inquiryId,
      item_id    : item._id,
      new_status : status,
    };
    postRequestWithToken("buyer/enquiry/accept-reject-quotation", obj, async (response) => {
        if (response.code === 200) {
          toast(response.message, { type: "success" });
          postRequestWithToken("buyer/enquiry/enquiry-details", obj, async (response) => {
              if (response.code === 200) {
                setInquiryDetails(response?.result);
                setAcceptedItems((prevItems) => {
                  const updatedItems = [...prevItems, item];
                  sessionStorage.setItem("acceptedQuotationItems", JSON.stringify(updatedItems));
                  return updatedItems;
                });
                setRejectedItems((prevItems) => {
                  const updatedItems = prevItems.filter(
                    (rejItem) => rejItem._id !== item._id
                  );
                  sessionStorage.setItem("rejectedQuotationItems", JSON.stringify(updatedItems)
                  );
                  return updatedItems;
                });
              } else {
                console.log("error in order list api", response);
              }
            }
          );
        } else {
          toast(response.message, { type: "error" });
          console.log("error in accept-reject-quotation api", response);
        }
      }
    );
  };

  const handleReject = (item, status) => {
    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      navigate("/buyer/login");
      return;
    }
    const obj = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      enquiry_id: inquiryId,
      item_id: item._id,
      new_status: status,
    };
    postRequestWithToken(
      "buyer/enquiry/accept-reject-quotation",
      obj,
      async (response) => {
        if (response.code === 200) {
          toast(response.message, { type: "success" });
          postRequestWithToken(
            "buyer/enquiry/enquiry-details",
            obj,
            async (response) => {
              if (response.code === 200) {
                setInquiryDetails(response?.result);
                setRejectedItems((prevItems) => {
                  const updatedItems = [...prevItems, item];
                  sessionStorage.setItem(
                    "rejectedQuotationItems",
                    JSON.stringify(updatedItems)
                  );
                  return updatedItems;
                });
                setAcceptedItems((prevItems) => {
                  const updatedItems = prevItems.filter(
                    (accItem) => accItem._id !== item._id
                  );
                  sessionStorage.setItem(
                    "acceptedQuotationItems",
                    JSON.stringify(updatedItems)
                  );
                  return updatedItems;
                });
              } else {
                console.log("error in order list api", response);
              }
            }
          );
        } else {
          toast(response.message, { type: "error" });
          console.log("error in accept-reject-quotation api", response);
        }
      }
    );
  };

  const hasPendingItems = inquiryDetails?.items?.some(item => item.status === 'pending');

  const handleCancel = () => {
    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      navigate("/buyer/login");
      return;
    }
    const obj = {
      buyer_id   : buyerIdSessionStorage || buyerIdLocalStorage,
      enquiry_id : inquiryId,
    };

    postRequestWithToken("buyer/enquiry/cancel-enquiry", obj, async (response) => {
        if (response.code === 200) {
          toast(response.message, { type: "success" });
          setInquiryDetails((prevDetails) => ({
            ...prevDetails,
            status: 'cancelled', 
            items: prevDetails.items.map(item => ({
              ...item,
              status: 'cancelled' 
            }))
          }));
          
        } else {
          toast(response.message, { type: "error" });
          console.log("error in cancel-enquiry api", response);
        }
      }
    );

  }

  return (
    <div className="ongoing-details-container">
      <div className="ongoing-details-conatiner-heading">
        Inquiry ID: <span>{inquiryDetails?.enquiry_id}</span>
      </div>
      <div className="ongoing-details-section">
        <div className="ongoing-details-left-section">
          <div className="ongoing-details-top-inner-section">
            <div className="ongoing-details-left-inner-section-container">
              <div className="ongoing-details-left-top-containers">
                <Link
                  to={`/buyer/supplier-details/${inquiryDetails?.supplier?.supplier_id}`}
                >
                  <div className="ongoing-details-top-order-cont">
                    <div className="ongoing-details-left-top-main-heading">
                      {" "}
                      Supplier Name
                    </div>
                    <div className="ongoing-details-left-top-main-contents">
                      {" "}
                      {inquiryDetails?.supplier?.supplier_name}
                    </div>
                  </div>
                </Link>
                <div className="ongoing-details-top-order-cont">
                  <div className="ongoing-details-left-top-main-heading">
                    Type
                  </div>
                  <div className="ongoing-details-left-top-main-contents">
                    {inquiryDetails?.supplier?.supplier_type || "Manufacturer"}
                  </div>
                </div>
                <div className="ongoing-details-top-order-cont">
                  <div className="ongoing-details-left-top-main-heading">
                    {" "}
                    Date & Time
                  </div>
                  <div className="ongoing-details-left-top-main-contents">
                    {moment(inquiryDetails?.created_at)
                      .tz("Asia/Kolkata")
                      .format("DD/MM/YYYY HH:mm:ss")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* start the assign driver section */}
      <div className="ongoing-details-assign-driver-section">
        <OnGoingList items={inquiryDetails?.items} />
      </div>
      {/* end the assign driver section */}
      {/* start the button container */}
      <div className="ongoing-enguiries-details-button-sec">
        {hasPendingItems && (
            <div className="ongoing-enguiries-details-buttons" onClick={handleCancel}>
              Cancel Inquiries
            </div>
          )}
      </div>
      {/* end the button container */}
      {/* Start the return enquiry section */}
<<<<<<< Updated upstream
      {inquiryDetails?.quotation_items?.length > 0 ? (
        <div className="order-details-assign-driver-section">
=======
      {inquiryDetails?.quotation_items.length > 0 ? (
        <div className="ongoing-details-assign-driver-section">
>>>>>>> Stashed changes
          <ProductList
            quotationItems={inquiryDetails?.quotation_items}
            handleAccept={handleAccept}
            handleReject={handleReject}
          />
        </div>
      ) : (
        ""
      )}

      {inquiryDetails?.quotation_items?.length > 0 &&
      inquiryDetails?.payment_terms?.length > 0 ? (
        <div className="ongoing-details-payment-pending-container">
          <div className="ongoing-details-payment-pending-left-section">
            <div className="ongoing-details-payment-pending-terms-cont">
              <div className="ongoing-details-payment-pending-first-terms-cont">
                <div className="ongoing-details-payment-first-terms-heading">
                  Est. Delivery Time
                </div>
                <div className="ongoing-details-payment-first-terms-text">
                  {inquiryDetails?.supplier?.estimated_delivery_time}
                </div>
              </div>
            </div>
          </div>
          <div className="ongoing-details-paymen-pending-right-section">
            <div className="ongoing-details-payment-first-terms-containers">
              <div className="ongoing-details-payment-first-terms-heading">
                Payment Terms
              </div>
              <div className="ongoing-details-payment-first-terms-text">
                <ul className="ongoing-details-payment-ul-section">
                  {inquiryDetails?.payment_terms?.map((terms, i) => {
                    return (
                      <li className="ongoing-details-payment-li-section">
                        {terms}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {inquiryDetails?.quotation_items?.length > 0 &&
      inquiryDetails?.payment_terms?.length > 0 ? (
        <div className="pending-order-button-section">
         
          {acceptedItems.length > 0 ? (
            <Link to={`/buyer/Create-PO/${inquiryId}`}>
              <div className="pending-order-create-order">
                Create Purchased Order
              </div>
            </Link>
          ) : (
            <div className="pending-order-create-order">
              Create Purchased Order
            </div>
          )}
           <a href={mailtoLink} className="pending-order-contact-order">
            Contact Supplier
          </a>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default OnGoingInquiriesDetails;
