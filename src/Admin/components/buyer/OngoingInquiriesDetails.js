import React, { useEffect, useState } from "react";
import "../../style/ongoinginquiriesdetails.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment-timezone";
import { toast } from "react-toastify";
import InquiryOngoingList from "./InquiryOngoingList";
import InquiryProductList from "./InquiryProductList";
import { postRequestWithToken } from "../../api/Requests";


const OngoingInquiriesDetails = () => {
  const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");

    const { inquiryId } = useParams()
    const navigate = useNavigate();
    const [paymentTerms, setPaymentTerms] = useState(['']);

    const [loading, setLoading] = useState(false);
    const [inquiryDetails, setInquiryDetails] = useState()

    const handleAddTerm = () => {
        setPaymentTerms([...paymentTerms, '']);
    };

    const handleTermChange = (index, value) => {
        const updatedTerms = [...paymentTerms];
        updatedTerms[index] = value;
        setPaymentTerms(updatedTerms);
    };

    const handleRemoveTerm = (index) => {
        const updatedTerms = paymentTerms.filter((_, i) => i !== index);
        setPaymentTerms(updatedTerms);
    };

    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
            return;
        }

        const obj = {
            admin_id   : adminIdSessionStorage || adminIdLocalStorage,
            enquiry_id : inquiryId
        }

        postRequestWithToken('admin/get-inquiry-details', obj, async (response) => {
            if (response.code === 200) {
                setInquiryDetails(response?.result)
            } else {
                console.log('error in order list api', response);
            }
        })
    }, [])

    const dateToDisplay = 
    inquiryDetails?.quotation_items_created_at || 
    inquiryDetails?.quotation_items_updated_at || 
    inquiryDetails?.created_at || 
    moment().toISOString();
  
    const formattedDate = moment(dateToDisplay)
      .tz("Asia/Kolkata")
      .format("DD/MM/YYYY HH:mm:ss");

    const [acceptChecked, setAcceptChecked] = useState(false)
    const [counterChecked, setCounterChecked] = useState(false)
    const [quotationItems, setQuotationItems] = useState([])

    const email = inquiryDetails?.buyer?.contact_person_email; // This could also be derived from props or context
    const subject = `Inquiry about Inquiry ${inquiryDetails?.enquiry_id || 'unknown'}`; // Ensure inquiryId is included if it's available

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
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
                  to={`/admin/supplier-details/${inquiryDetails?.supplier.supplier_id}`}
                >
                  <div className="ongoing-details-top-order-cont">
                    <div className="ongoing-details-left-top-main-heading">
                      {" "}
                      Supplier Name
                    </div>
                    <div className="ongoing-details-left-top-main-contents">
                      {inquiryDetails?.supplier.supplier_name}
                    </div>
                  </div>
                </Link>
                <div className="ongoing-details-top-order-cont">
                  <div className="ongoing-details-left-top-main-heading">
                    Type
                  </div>
                  <div className="ongoing-details-left-top-main-contents">
                  {inquiryDetails?.supplier.supplier_type}
                  </div>
                </div>
                <div className="ongoing-details-top-order-cont">
                  <div className="ongoing-details-left-top-main-heading">
                    {" "}
                    Date & Time
                  </div>
                  <div className="ongoing-details-left-top-main-contents">
                       {formattedDate}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Start the return enquiry section */}
      {inquiryDetails?.quotation_items?.length > 0 ? (
        <div className="ongoing-details-assign-driver-section">
          <InquiryProductList  
             inquiryDetails = {inquiryDetails}
             items={inquiryDetails?.items}
            //  quotationItems = {inquiryDetails?.quotation_items}
             setAcceptChecked={setAcceptChecked}
             setCounterChecked={setCounterChecked}
             setQuotationItems={setQuotationItems}
             quotationItems={inquiryDetails?.quotation_items}
          />
        </div>
         ) : (
          ""
        )}

        {inquiryDetails?.quotation_items?.length > 0 &&
             inquiryDetails?.payment_terms?.length > 0 ? (
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
         ) : (
          ""
        )}
      {/* start the assign driver section */}
      <div className="inquiries-details-assign-driver-section">
        <InquiryOngoingList 
           items={inquiryDetails?.items}
           inquiryDetails={inquiryDetails}
        />
      </div>
    </div>
  );
};

export default OngoingInquiriesDetails;