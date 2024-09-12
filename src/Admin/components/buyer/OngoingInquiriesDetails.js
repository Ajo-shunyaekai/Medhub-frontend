import React, { useEffect, useState } from "react";
import "../../style/ongoinginquiriesdetails.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment-timezone";
import { toast } from "react-toastify";
import InquiryOngoingList from "./InquiryOngoingList";
import InquiryProductList from "./InquiryProductList";


const OngoingInquiriesDetails = () => {
  const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
  const buyerIdLocalStorage = localStorage.getItem("buyer_id");

  const { inquiryId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [inquiryDetails, setInquiryDetails] = useState();

  const email = inquiryDetails?.supplier?.contact_person_email;
  const subject = `Inquiry about Inquiry ${inquiryDetails?.enquiry_id || "unknown"
    }`;
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  const dateToDisplay = 
  inquiryDetails?.quotation_items_created_at || 
  inquiryDetails?.quotation_items_updated_at || 
  inquiryDetails?.created_at || 
  moment().toISOString();

  const formattedDate = moment(dateToDisplay)
    .tz("Asia/Kolkata")
    .format("DD/MM/YYYY HH:mm:ss");

  useEffect(() => {
    const obj = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      enquiry_id: inquiryId,
    };
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
    const obj = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      enquiry_id: inquiryId,
      item_id: item._id,
      new_status: status,
    };
  };

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
                  to={`#`}
                >
                  <div className="ongoing-details-top-order-cont">
                    <div className="ongoing-details-left-top-main-heading">
                      {" "}
                      Supplier Name
                    </div>
                    <div className="ongoing-details-left-top-main-contents">
                      {" "}
                     Pharmaceuticals Pharmacy Private Limited
                    </div>
                  </div>
                </Link>
                <div className="ongoing-details-top-order-cont">
                  <div className="ongoing-details-left-top-main-heading">
                    Type
                  </div>
                  <div className="ongoing-details-left-top-main-contents">
                  Manufacturer
                  </div>
                </div>
                <div className="ongoing-details-top-order-cont">
                  <div className="ongoing-details-left-top-main-heading">
                    {" "}
                    Date & Time
                  </div>
                  <div className="ongoing-details-left-top-main-contents">
                       {/* {formattedDate} */}
                       12/10/2024 05:00PM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Start the return enquiry section */}
        <div className="ongoing-details-assign-driver-section">
          <InquiryProductList/>
        </div>
        <div className="ongoing-details-payment-pending-container">
          <div className="ongoing-details-paymen-pending-right-section">
            <div className="ongoing-details-payment-first-terms-containers">
              <div class="table-assign-driver-heading">Payment Terms</div>
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
      {/* start the assign driver section */}
      <div className="inquiries-details-assign-driver-section">
        <InquiryOngoingList />
      </div>
    </div>
  );
};

export default OngoingInquiriesDetails;