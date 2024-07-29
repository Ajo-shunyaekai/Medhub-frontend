import React, { useEffect, useState } from 'react';
import '../../style/inquiryrequestdetails.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import InquiryProductList from './InquiryProductList';
import { FaPlus, FaMinus } from 'react-icons/fa'; 
import { postRequestWithToken } from '../../api/Requests';
import { toast } from 'react-toastify';

const InquiryRequestDetails = () => {
    const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
    const supplierIdLocalStorage   = localStorage.getItem("supplier_id");

    const {inquiryId} = useParams()
    const navigate = useNavigate();
    const [paymentTerms, setPaymentTerms] = useState(['']); 

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
        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
        navigate("/supplier/login");
        return;
        }
       
        const obj = {
            supplier_id  : supplierIdSessionStorage || supplierIdLocalStorage,
            enquiry_id   : inquiryId
        }

        postRequestWithToken('supplier/enquiry/enquiry-details', obj, async (response) => {
            if (response.code === 200) {
                setInquiryDetails(response?.result)
            } else {
               console.log('error in order list api',response);
            }
          })
    },[])

    const [acceptChecked, setAcceptChecked] = useState(false)
    const [counterChecked, setCounterChecked] = useState(false)
    const [quotationItems, setQuotationItems] = useState([])

    const email = inquiryDetails?.buyer?.contact_person_email; // This could also be derived from props or context
    const subject = `Inquiry about Inquiry ${inquiryDetails?.enquiry_id || 'unknown'}`; // Ensure inquiryId is included if it's available

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    const handleSubmitQuotation = () => {
        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }

        if(quotationItems.length !== inquiryDetails?.items.length) {
            return toast('Please accept or enter the counter price to proceed', {type: 'error'})
        }
       
        if (paymentTerms.length === 0 || paymentTerms.every(term => term.trim() === '')) {
            return toast('Payment term is required', { type: 'error' });
        }
        const validationErrors = quotationItems.some(item => !item.accepted && item.counterPrice === undefined);

        if (validationErrors) {
            toast('Counter price must be provided for items that are not accepted.', {type: 'error'})
            return;
        }

        const transformedQuotationItems = quotationItems.map(item => ({
            itemId            : item._id,
            medicine_id       : item.medicine_id,
            est_delivery_days : item.est_delivery_days,
            counter_price     : item.counterPrice,
            unit_price        : item.unit_price,
            quantity_required : item.quantity_required,
            target_price      : item.target_price,
            accepted          : item.accepted
        }));
        
        const obj = {
            supplier_id       : supplierIdSessionStorage || supplierIdLocalStorage,
            buyer_id          : inquiryDetails?.buyer.buyer_id,
            enquiry_id        : inquiryDetails?.enquiry_id,
            quotation_details : transformedQuotationItems,
            payment_terms     : paymentTerms
        }

        postRequestWithToken('supplier/enquiry/submit-quotation', obj, async (response) => {
            if (response.code === 200) {
               toast(response.message, {type: 'success'})
               setTimeout(() => {
                navigate('/supplier/inquiry-purchase-orders/ongoing')
              }, 1000);
               
            } else {
                toast(response.message, {type: 'error'})
               console.log('error in enquiry/submit-quotation api',response);
            }
          })
    }

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
                                        <div className='inquiry-details-left-top-main-contents'>{inquiryDetails?.buyer.buyer_name}</div>
                                    </div>
                                </Link>
                                <div className='inquiry-details-top-inquiry-cont'>
                                    <div className='inquiry-details-left-top-main-heading'>Type</div>
                                    <div className='inquiry-details-left-top-main-contents'>{inquiryDetails?.buyer?.buyer_type}</div>
                                </div>
                                <div className='inquiry-details-top-inquiry-cont'>
                                    <div className='inquiry-details-left-top-main-heading'>Country of Origin</div>
                                    <div className='inquiry-details-left-top-main-contents'>{inquiryDetails?.buyer?.country_of_origin}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='inquiry-details-assign-driver-section'>
                <InquiryProductList 
                    items = {inquiryDetails?.items} 
                    setAcceptChecked = {setAcceptChecked}
                    setCounterChecked = {setCounterChecked}
                    setQuotationItems = {setQuotationItems}
                    quotationItems={quotationItems}
                />
            </div>
            <div className='inquiry-details-payment-container'>
                <div className='inquiry-details-payment-left-section'>
                    <div className='inquiry-details-payment-detention-cont'>
                        <div className='inquiry-details-payment-first-terms-heading'>Est Delivery Time</div>
                        <div className='inquiry-details-payment-first-terms-text'>{inquiryDetails?.supplier?.estimated_delivery_time}</div>
                    </div>
                    <div className='inquiry-details-payment-detention-cont'>
                        <div className='inquiry-details-payment-first-terms-heading'><span className='inquiry-details-payment-terms'>Payment Terms</span>
                            <FaPlus
                                className='add-term-icon'
                                onClick={handleAddTerm}
                            />
                        </div>
                        <div className='inquiry-details-payment-first-terms-text'>
                            {paymentTerms.map((term, index) => (
                                <div key={index} className='inquiry-details-payment-section'>
                                    <input
                                        className='inquiry-details-payment-sec-input'
                                        type='text'
                                        value={term}
                                        onChange={(e) => handleTermChange(index, e.target.value)}
                                        placeholder='Enter payment term'
                                    />
                                    {paymentTerms.length > 1 && (
                                        <FaMinus
                                            className='remove-term-icon'
                                            onClick={() => handleRemoveTerm(index)}
                                        />
                                    )}
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
            <div className='inquiry-details-button-section'>
                <a href={mailtoLink} className='inquiry-details-cancel-button'>
                    Contact Buyer
                </a>
                <div className='inquiry-details-submit-button' onClick={handleSubmitQuotation}>Submit Quotation</div>
            </div>
        </div>
    );
};

export default InquiryRequestDetails;
