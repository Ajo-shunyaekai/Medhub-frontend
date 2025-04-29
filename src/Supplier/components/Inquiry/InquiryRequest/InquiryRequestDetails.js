import React, { useEffect, useState } from 'react';
import '../inquiryrequestdetails.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import InquiryProductList from './InquiryProductList';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { postRequestWithToken } from '../../../api/Requests';
import { toast } from 'react-toastify';
import { apiRequests } from '../../../../api';

const InquiryRequestDetails = ({ socket }) => {
  const supplierIdSessionStorage = localStorage?.getItem('supplier_id');
  const supplierIdLocalStorage = localStorage?.getItem('supplier_id');
  const { inquiryId } = useParams();
  const navigate = useNavigate();
  const [paymentTerms, setPaymentTerms] = useState(['']);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [inquiryDetails, setInquiryDetails] = useState(null); // Explicitly null
  const [acceptChecked, setAcceptChecked] = useState(false);
  const [counterChecked, setCounterChecked] = useState(false);
  const [quotationItems, setQuotationItems] = useState([]);

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
    const fetchData = async () => {
      if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
        localStorage.clear();
        navigate('/supplier/login');
        return;
      }

      setLoading(true);
      const obj = {
        supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
        enquiry_id: inquiryId,
      };

      try {
        const response = await apiRequests.getRequest(
          `enquiry/get-specific-enquiry-details/${inquiryId}`,
          obj
        );
        if (response?.code !== 200) {
          toast('Failed to fetch inquiry details', { type: 'error' });
          setLoading(false);
          return;
        }
        setInquiryDetails({
          ...response?.result,
          items: response?.result?.items || [], // Fallback empty array
          quotation_items: response?.result?.quotation_items || [], // Fallback empty array
        });
      } catch (error) {
        toast('Error fetching inquiry details', { type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [inquiryId, navigate, supplierIdSessionStorage, supplierIdLocalStorage]);

  const email = inquiryDetails?.buyer?.contact_person_email;
  const subject = `Inquiry about Inquiry ${inquiryDetails?.enquiry_id || 'unknown'}`;
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  const handleSubmitQuotation = () => {
    if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
      localStorage.clear();
      navigate('/supplier/login');
      return;
    }

    if (quotationItems.length !== inquiryDetails?.items.length) {
      return toast('Please Accept or Enter the Counter Price to Proceed', { type: 'error' });
    }

    if (paymentTerms.length === 0 || paymentTerms.every((term) => term.trim() === '')) {
      return toast('Payment Term is Required', { type: 'error' });
    }

    const validationErrors = quotationItems.some(
      (item) => !item.accepted && item.counterPrice === undefined
    );

    if (validationErrors) {
      toast('Counter Price must be Provided for Items that are not Accepted.', {
        type: 'error',
      });
      return;
    }

    setLoading(true);
    const transformedQuotationItems = quotationItems?.map((item) => ({
      itemId: item._id,
      product_id: item.product_id,
      est_delivery_days: item.est_delivery_days,
      counter_price: item.counterPrice?.toString(),
      unit_price: item.unit_price,
      unit_tax: item.unit_tax,
      quantity_required: item.quantity_required,
      target_price: item.target_price,
      accepted: item.accepted,
    }));

    const obj = {
      supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
      buyer_id: inquiryDetails?.buyer.buyer_id,
      enquiry_id: inquiryDetails?.enquiry_id,
      quotation_details: transformedQuotationItems,
      payment_terms: paymentTerms,
    };

    postRequestWithToken('enquiry/submit-quotation', obj, async (response) => {
      if (response?.code === 200) {
        toast(response.message, { type: 'success' });

        socket.emit('submitQuotation', {
          buyerId: inquiryDetails?.buyer.buyer_id,
          message: 'You’ve received a quote from the supplier!',
          link: process.env.REACT_APP_PUBLIC_URL,
        });

        setTimeout(() => {
          navigate('/supplier/inquiry-purchase-orders/ongoing');
        }, 300);
      } else {
        toast(response.message, { type: 'error' });
      }
      setLoading(false);
    });
  };

  return (
    <div className="inquiry-details-container">
      <div className="inquiry-details-conatiner-heading">
        Inquiry ID: <span>{inquiryDetails?.enquiry_id || 'Loading...'}</span>
      </div>
      {loading || !inquiryDetails ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="inquiry-details-section">
            <div className="inquiry-details-left-section">
              <div className="inquiry-details-top-inner-section">
                <div className="inquiry-details-left-inner-section-container">
                  <div className="inquiry-details-left-top-containers">
                    <Link to={`/supplier/buyer-details/${inquiryDetails?.buyer.buyer_id}`}>
                      <div className="inquiry-details-top-inquiry-cont">
                        <div className="inquiry-details-left-top-main-heading"> Buyer Name</div>
                        <div className="inquiry-details-left-top-main-contents">
                          {inquiryDetails?.buyer.buyer_name}
                        </div>
                      </div>
                    </Link>
                    <div className="inquiry-details-top-inquiry-cont">
                      <div className="inquiry-details-left-top-main-heading">Type</div>
                      <div className="inquiry-details-left-top-main-contents">
                        {inquiryDetails?.buyer?.buyer_type}
                      </div>
                    </div>
                    <div className="inquiry-details-top-inquiry-cont">
                      <div className="inquiry-details-left-top-main-heading">Country of Origin</div>
                      <div className="inquiry-details-left-top-main-contents">
                        {inquiryDetails?.buyer?.country_of_origin}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="inquiry-details-assign-driver-section">
            <InquiryProductList
              inquiryDetails={inquiryDetails}
              items={inquiryDetails?.items || []}
              quotation={inquiryDetails?.quotation_items || []}
              setAcceptChecked={setAcceptChecked}
              setCounterChecked={setCounterChecked}
              setQuotationItems={setQuotationItems}
              quotationItems={quotationItems}
            />
          </div>
          <div className="inquiry-details-payment-container">
            <div className="inquiry-details-payment-left-section">
              {inquiryDetails?.enquiry_status !== 'Quotation submitted' &&
                inquiryDetails?.enquiry_status !== 'cancelled' &&
                inquiryDetails?.enquiry_status !== 'PO created' && (
                  <div className="inquiry-details-payment-detention-cont">
                    <div className="inquiry-details-payment-first-terms-heading">
                      <span className="inquiry-details-payment-terms">Payment Terms</span>
                      <FaPlus className="add-term-icon" onClick={handleAddTerm} />
                    </div>
                    <div className="inquiry-details-payment-first-terms-text">
                      {paymentTerms.map((term, index) => (
                        <div key={index} className="inquiry-details-payment-section">
                          <input
                            className="inquiry-details-payment-sec-input"
                            type="text"
                            value={term}
                            onChange={(e) => handleTermChange(index, e.target.value)}
                            placeholder="Enter payment term"
                          />
                          {paymentTerms.length > 1 && (
                            <FaMinus
                              className="remove-term-icon"
                              onClick={() => handleRemoveTerm(index)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
          <div className="inquiry-details-button-section">
            {inquiryDetails?.enquiry_status === 'pending' && (
              <>
                <button
                  className="inquiry-details-submit-button"
                  onClick={handleSubmitQuotation}
                  disabled={loading}
                >
                  {loading ? <div className="loading-spinner"></div> : 'Submit Quotation'}
                </button>
                <a href={mailtoLink} className="inquiry-details-cancel-button">
                  Contact Buyer
                </a>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default InquiryRequestDetails;