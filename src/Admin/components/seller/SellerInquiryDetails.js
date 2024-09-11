import React, { useEffect, useState } from 'react';
import '../../style/sellerinquirydetails.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../../api/Requests';
import SellerInquiryProductList from './SellerInquiryProductList';

const SellerInquiryDetails = () => {
    const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
    const supplierIdLocalStorage = localStorage.getItem("supplier_id");

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
        // if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
        //     navigate("/supplier/login");
        //     return;
        // }

        const obj = {
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
            enquiry_id: inquiryId
        }

        postRequestWithToken('supplier/enquiry/enquiry-details', obj, async (response) => {
            if (response.code === 200) {
                setInquiryDetails(response?.result)
            } else {
                console.log('error in order list api', response);
            }
        })
    }, [])

    const [acceptChecked, setAcceptChecked] = useState(false)
    const [counterChecked, setCounterChecked] = useState(false)
    const [quotationItems, setQuotationItems] = useState([])

    const email = inquiryDetails?.buyer?.contact_person_email; // This could also be derived from props or context
    const subject = `Inquiry about Inquiry ${inquiryDetails?.enquiry_id || 'unknown'}`; // Ensure inquiryId is included if it's available

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    return (
        <div className='inquiry-details-container'>
            <div className='inquiry-details-conatiner-heading'>Inquiry ID: <span>{inquiryDetails?.enquiry_id}</span></div>
            <div className='inquiry-details-section'>
                <div className='inquiry-details-left-section'>
                    <div className='inquiry-details-top-inner-section'>
                        <div className='inquiry-details-left-inner-section-container'>
                            <div className='inquiry-details-left-top-containers'>
                                <Link to={`/supplier/buyer-details/${inquiryDetails?.buyer.buyer_id}`}>
                                    <div className='inquiry-details-top-inquiry-cont'>
                                        <div className='inquiry-details-left-top-main-heading'> Buyer Name</div>
                                        <div className='inquiry-details-left-top-main-contents'>MediLab Pharmacy</div>
                                    </div>
                                </Link>
                                <div className='inquiry-details-top-inquiry-cont'>
                                    <div className='inquiry-details-left-top-main-heading'>Type</div>
                                    <div className='inquiry-details-left-top-main-contents'>End User</div>
                                </div>
                                <div className='inquiry-details-top-inquiry-cont'>
                                    <div className='inquiry-details-left-top-main-heading'>Country of Origin</div>
                                    <div className='inquiry-details-left-top-main-contents'>United Arab Emirates</div>
                                  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='inquiry-details-assign-driver-section'>
                <SellerInquiryProductList
                    inquiryDetails = {inquiryDetails}
                    items={inquiryDetails?.items}
                    quotation = {inquiryDetails?.quotation_items}
                    setAcceptChecked={setAcceptChecked}
                    setCounterChecked={setCounterChecked}
                    setQuotationItems={setQuotationItems}
                    quotationItems={quotationItems}
                />
            </div>
           
            <div className='inquiry-details-payment-container'>
                <div className='inquiry-details-payment-left-section'>
                    <div className='inquiry-details-payment-detention-cont'>                 
                        <div className='inquiry-details-payment-sections'>
                            <span className='inquiry-details-payment-terms'>Payment Terms</span>
                            <ul className='inquiry-details-ul'>
                                <li className='inquiry-details-li'>30% Advance Payment</li>
                                <li className='inquiry-details-li'>70% After Delivery</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className='inquiry-details-button-section'>
                {inquiryDetails?.enquiry_status === 'pending' && (
                <>
                    <div 
                    className='inquiry-details-submit-button' 
                    // onClick={handleSubmitQuotation}
                    disabled={loading}
                    >
                        {/* Submit Quotation */}
                        {loading ? (
                                <div className='loading-spinner'></div> 
                            ) : (
                                'Submit Quotation'
                            )}
                    </div>
                    <a href={mailtoLink} className='inquiry-details-cancel-button'>
                        Contact Buyer
                    </a>
                </>
            )}

            </div>
        </div>
    );
};

export default SellerInquiryDetails;