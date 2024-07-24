import React, { useState } from 'react';
import '../../style/inquiryrequestdetails.css';
import { Link } from 'react-router-dom';
import InquiryProductList from './InquiryProductList';
import { FaPlus, FaMinus } from 'react-icons/fa'; // Import the minus icon

const InquiryRequestDetails = () => {
    const [paymentTerms, setPaymentTerms] = useState(['']); // Start with one empty input field

    const handleAddTerm = () => {
        setPaymentTerms([...paymentTerms, '']); // Add a new empty input field
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

    return (
        <div className='inquiry-details-container'>
            <div className='inquiry-details-conatiner-heading'>Inquiry ID:<span>987456321</span></div>
            <div className='inquiry-details-section'>
                <div className='inquiry-details-left-section'>
                    <div className='inquiry-details-top-inner-section'>
                        <div className='inquiry-details-left-inner-section-container'>
                            <div className='inquiry-details-left-top-containers'>
                                <Link to='/buyer-details'>
                                    <div className='inquiry-details-top-inquiry-cont'>
                                        <div className='inquiry-details-left-top-main-heading'> Buyer Name</div>
                                        <div className='inquiry-details-left-top-main-contents'> Mr. Abdul Shaikh</div>
                                    </div>
                                </Link>
                                <div className='inquiry-details-top-inquiry-cont'>
                                    <div className='inquiry-details-left-top-main-heading'>Type</div>
                                    <div className='inquiry-details-left-top-main-contents'>Distributor</div>
                                </div>
                                <div className='inquiry-details-top-inquiry-cont'>
                                    <div className='inquiry-details-left-top-main-heading'>Country of Origin</div>
                                    <div className='inquiry-details-left-top-main-contents'>UAE</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='inquiry-details-assign-driver-section'>
                <InquiryProductList />
            </div>
            <div className='inquiry-details-payment-container'>
                <div className='inquiry-details-payment-left-section'>
                    <div className='inquiry-details-payment-detention-cont'>
                        <div className='inquiry-details-payment-first-terms-heading'>Est Delivery Time</div>
                        <div className='inquiry-details-payment-first-terms-text'>25 Days</div>
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
