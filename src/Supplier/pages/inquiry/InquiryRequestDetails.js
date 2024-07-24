import React, { useEffect, useState } from 'react';
import '../../style/inquiryrequestdetails.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import InquiryProductList from './InquiryProductList';
import { FaPlus, FaMinus } from 'react-icons/fa'; 
import { postRequestWithToken } from '../../api/Requests';

const InquiryRequestDetails = () => {
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
        const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
        const supplierIdLocalStorage   = localStorage.getItem("supplier_id");

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
                // setTotalInquiries(response.result.totalItems)
            } else {
               console.log('error in order list api',response);
            }
          })
    },[])

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
                                        <div className='inquiry-details-left-top-main-contents'> Mr. {inquiryDetails?.buyer.buyer_name}</div>
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
                <InquiryProductList items = {inquiryDetails?.items}/>
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
                <a href='mailto:supplier@example.com?subject=Inquiry%20about%20Order%20987456321' className='inquiry-details-cancel-button'>
                    Contact Buyer
                </a>
                <div className='inquiry-details-submit-button'>Submit Quotation</div>
            </div>
        </div>
    );
};

export default InquiryRequestDetails;
