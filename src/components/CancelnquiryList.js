import React, { useEffect, useState } from 'react';
import styles from '../style/cancelinquiry.module.css';
import CancelProductList from './CancelProductList';
import { useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';


const CancelInquiryList = () => {
    const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
   const buyerIdLocalStorage = localStorage.getItem("buyer_id");

    const { inquiryId } = useParams();
    const navigate      = useNavigate();
console.log(inquiryId);
    const [inquiryDetails, setInquiryDetails] = useState();
    const [selectedReasons, setSelectedReasons] = useState({
        unavailableProduct: false,
        incorrectPricing: false,
        delayedResponse: false,
        betterOption: false,
        changeRequirement: false,
        other: false,
    });
    const [text, setText] = useState('');

    const handleChanged = (event) => {
        setText(event.target.value);
    };
    const handleChange = (e) => {
        setSelectedReasons({
            ...selectedReasons,
            [e.target.name]: e.target.checked,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Selected Reasons:', selectedReasons);
        console.log('comment:', text);

        const obj = {
            buyer_id    : buyerIdSessionStorage || buyerIdLocalStorage,
            enquiry_id  : inquiryId,
            supplier_id : inquiryDetails?.supplier?.supplier_id,
            reason      : selectedReasons,
            comment     : text
        };
    };

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
            } else {
              console.log("error in order list api", response);
            }
          }
        );
      }, []);

    return (
        <>

            <div className={styles['cancel-inquiry-main-section']}>
                <div className={styles['cancel-inquiry-heading']}>Cancel Inquiries</div>
                {/* start the assign driver section */}
                <div className="ongoing-details-assign-driver-section">
                    <CancelProductList items = {inquiryDetails?.items} inquiryDetails={inquiryDetails}/>
                </div>
                {/* end the assign driver section */}
                <div className={styles['form-main-section-container']}>
                    <div className={styles['form-main-content-section']}>
                        <div className={styles['form-cancel-heading']}>Reason for Cancel Inquiries</div>
                        <div className={styles['form-cancel-text']}>Please tell us correct reason for Inquiries. This information is only used to improve our service</div>
                    </div>
                    <form onSubmit={handleSubmit} className={styles.formcontainer}>
                        <div className={styles['form-select-reason-head']}>Select Reason<span className={styles['red-bullet']}>*</span></div>
                        <div className={styles['form-main-container']}>
                            <div className={styles.checkboxContainer}>
                                <label className={styles.label}>
                                    <input
                                        type="checkbox"
                                        name="unavailableProduct"
                                        checked={selectedReasons.unavailableProduct}
                                        onChange={handleChange}
                                        className={styles['cancel-inquiry-input']}
                                    />
                                    <span className={styles['cancel-inquiry-text']}> Unavailable Medicine </span>
                                </label>
                            </div>
                            <div className={styles.checkboxContainer}>
                                <label className={styles.label}>
                                    <input
                                        type="checkbox"
                                        name="incorrectPricing"
                                        checked={selectedReasons.incorrectPricing}
                                        onChange={handleChange}
                                        className={styles['cancel-inquiry-input']}
                                    />
                                    <span className={styles['cancel-inquiry-text']}> Incorrect Pricing </span>
                                </label>
                            </div>
                            <div className={styles.checkboxContainer}>
                                <label className={styles.label}>
                                    <input
                                        type="checkbox"
                                        name="delayedResponse"
                                        checked={selectedReasons.delayedResponse}
                                        onChange={handleChange}
                                        className={styles['cancel-inquiry-input']}
                                    />
                                    <span className={styles['cancel-inquiry-text']}>Delayed Response </span>

                                </label>
                            </div>
                            <div className={styles.checkboxContainer}>
                                <label className={styles.label}>
                                    <input
                                        type="checkbox"
                                        name="betterOption"
                                        checked={selectedReasons.betterOption}
                                        onChange={handleChange}
                                        className={styles['cancel-inquiry-input']}
                                    />
                                    <span className={styles['cancel-inquiry-text']}>Found a Better Option</span>

                                </label>
                            </div>
                            <div className={styles.checkboxContainer}>
                                <label className={styles.label}>
                                    <input
                                        type="checkbox"
                                        name="changeRequirement"
                                        checked={selectedReasons.changeRequirement}
                                        onChange={handleChange}
                                        className={styles['cancel-inquiry-input']}
                                    />
                                    <span className={styles['cancel-inquiry-text']}>Change in Requirement</span>

                                </label>
                            </div>
                            <div className={styles.checkboxContainer}>
                                <label className={styles.label}>
                                    <input
                                        type="checkbox"
                                        name="other"
                                        checked={selectedReasons.other}
                                        onChange={handleChange}
                                        className={styles['cancel-inquiry-input']}
                                    />
                                    <span className={styles['cancel-inquiry-text']}>Inquiries By Mistake</span>

                                </label>
                            </div>
                            <div className={styles.textboxcontainer}>
                                <textarea
                                    className={styles['form-textarea']}
                                    id="inquiryReason"
                                    value={text}
                                    onChange={handleChanged}
                                    placeholder="Additional Comments"
                                    rows="5"
                                    cols="100"
                                />
                            </div>
                        </div>
                        <div className={styles.buttonContainer}>
                            <button type="submit" className={styles.submitButton}>Cancel</button>
                            {/* <button type="button" className={styles.cancelButton}>Cancel</button> */}
                        </div>


                    </form>
                </div>
            </div>
        </>
    );
};

export default CancelInquiryList;
