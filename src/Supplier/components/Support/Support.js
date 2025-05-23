import React, { useState } from 'react';
import styles from './support.module.css';
import FaqSupport from './FaqSupport';
import SupportImageUpload from './SupportImageUpload';
import { Link, useNavigate } from 'react-router-dom';
import { postRequestWithTokenAndFile } from '../../api/Requests';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Support = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [feedbackVisible, setFeedbackVisible] = useState(true);
    const [complaintVisible, setComplaintVisible] = useState(false);
    const [activeButton, setActiveButton] = useState('enquiry');

    const toggleFeedbackForm = () => {
        setFeedbackVisible(true);
        setComplaintVisible(false);
        setActiveButton('enquiry');
    };

    const toggleComplaintForm = () => {
        setComplaintVisible(true);
        setFeedbackVisible(false);
        setActiveButton('complaint');
    };

    // Feedback form state
    const [subject, setSubject] = useState('');
    const [subjectError, setSubjectError] = useState('');
    const [message, setMessage] = useState('');
    const [messageError, setMessageError] = useState('');
    const [feedbackImages, setFeedbackImages] = useState([]);
    const [imageError, setImageError] = useState('');

    // Complaint form state
    const [compSubject, setCompSubject] = useState('');
    const [compSubjectError, setCompSubjectError] = useState('');
    const [compMessage, setCompMessage] = useState('');
    const [compMessageError, setCompMessageError] = useState('');
    const [compImages, setCompImages] = useState([]);
    const [compImageError, setCompImageError] = useState('');


    const validateForm = (formValues, setErrors) => {
        const { subject, message, images } = formValues;
        const errors = {};
    
        if (!subject) errors.subject = 'Subject is required';
        if (!message) errors.message = 'Message is required';
        if (images.length === 0) errors.images = 'Please upload at least one image';
    
        // Set errors in UI
        setErrors(errors);
    
        return Object.keys(errors).length === 0;
    };

    const submitSupportForm = ({ subject, message, images, type, endpoint, resetForm }) => {
        setLoading(true)
        const supplierId = localStorage?.getItem("supplier_id") || localStorage?.getItem("supplier_id");
        if (!supplierId) {
            localStorage?.clear();
            navigate("/supplier/login");
            return;
        }
    
        const formData = new FormData();
        formData.append('supplier_id', supplierId);
        formData.append('subject', subject);
        formData.append('message', message);
        formData.append('support_type', type); // feedback or complaint
        formData.append('usertype', 'supplier');
        images.forEach(file => formData.append(`${type}_image`, file));
    
        postRequestWithTokenAndFile(endpoint, formData, async (response) => {
            if (response?.code === 200) {
                toast(response.message, { type: "success" });
                resetForm(); // clear form values
                setLoading(false)
            } else {
                setLoading(false)
                toast(response.message, { type: "error" });
            }
        });
    };

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        const formValues = { subject, message, images: feedbackImages };
        const isValid = validateForm(formValues, ({ subject, message, images }) => {
            setSubjectError(subject || '');
            setMessageError(message || '');
            setImageError(images || '');
        });
    
        if (isValid) {
            submitSupportForm({
                subject,
                message,
                images: feedbackImages,
                type: 'feedback',
                endpoint: 'support/submit-feedback',
                resetForm: () => {
                    setSubject('');
                    setMessage('');
                    setFeedbackImages([]);
                },
            });
        } else {
            setLoading(false)
        }
    };
    
    const handleComplaintSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        const formValues = { subject: compSubject, message: compMessage, images: compImages };
        const isValid = validateForm(formValues, ({ subject, message, images }) => {
            setCompSubjectError(subject || '');
            setCompMessageError(message || '');
            setCompImageError(images || '');
        });
    
        if (isValid) {
            submitSupportForm({
                subject: compSubject,
                message: compMessage,
                images: compImages,
                type: 'complaint',
                endpoint: 'support/submit-complaint',
                resetForm: () => {
                    setCompSubject('');
                    setCompMessage('');
                    setCompImages([]);
                },
            });
        } else {
            setLoading(false)
        }
    };
    

    const clearFeedbackImageError = () => {
        setImageError('');
    };

    const clearComplaintImageError = () => {
        setCompImageError('');
    };

    return (
        <div className={styles['support-main-container']}>
            <div className={styles['support-heading']}>Support</div>
            <div className={styles['support-container']}>
                
                    <div className={styles['faq-section']}>
                        <div className={styles['support-btn-container']}>
                            <div onClick={toggleFeedbackForm}>
                                <div className={`${styles['support-btn']} ${activeButton === 'enquiry' && styles.active}`}>
                                    Enquiry
                                </div>
                            </div>
                            <div onClick={toggleComplaintForm}>
                                <div className={`${styles['support-btn']} ${activeButton === 'complaint' && styles.active}`}>
                                    Complaint
                                </div>
                            </div>
                            <Link to={`/supplier/edit-profile/${localStorage?.getItem("_id")}`}>
                                <div className={`${styles['support-btn']} ${activeButton === 'profile' && styles.active}`}>
                                    Update Profile
                                </div>
                                </Link>
                        </div>
                        {
                            feedbackVisible && (
                                <div className={styles['form-main-container']}>
                                    <div className={styles['form-heading']}>Enquiry Form</div>
                                    <form className={styles['form-main-form-section']} 
                                    onSubmit={handleFeedbackSubmit}

                                    >
                                        <div className={styles['form-container']}>
                                            <div className={styles['form-support-main-section']}>
                                                <div className={styles['form-cont-input-sec']}>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter subject"
                                                        className={styles['form-input']}
                                                        value={subject}
                                                        onChange={(e) => { setSubject(e.target.value); setSubjectError('') }}
                                                    />
                                                    {subjectError && <div className={styles['error-message']}>{subjectError}</div>}
                                                </div>

                                                <div className={styles['form-support-textarea']}>
                                                    <textarea
                                                        placeholder="Enter message"
                                                        className={styles['form-textarea']}
                                                        rows={4}
                                                        value={message}
                                                        onChange={(e) => { setMessage(e.target.value); setMessageError('') }}
                                                    />
                                                    {messageError && <div className={styles['error-message']}>{messageError}</div>}
                                                </div>
                                            </div>

                                            <div className={styles['form-support-image']}>
                                                <SupportImageUpload
                                                    images={feedbackImages}
                                                    setImages={setFeedbackImages}
                                                    errorMessage={imageError}
                                                    clearImageError={clearFeedbackImageError}
                                                    ErrorMessage={setImageError}
                                                />
                                                {imageError && <div className={styles['error-message']}>{imageError }</div>}
                                            </div>
                                        </div>
                                        <div className={styles['form-submit-btn-cont']}>
                                            <button 
                                              type="submit" 
                                              className={styles['form-submit-btn']}
                                              disabled={loading}
                                              >
                                                {loading ? (
                                                <div className='loading-spinner'></div>
                                            ) : (
                                                'Submit'
                                            )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )
                        }
                        {
                            complaintVisible && (
                                <div className={styles['form-main-container']}>
                                    <div className={styles['form-heading']}>Complaint Form</div>
                                    <form className={styles['form-main-form-section']} 
                                    onSubmit={handleComplaintSubmit}
                                       >
                                        <div className={styles['form-container']}>
                                            <div className={styles['form-support-main-section']}>
                                                <div className={styles['form-cont-input-sec']}>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter subject"
                                                        className={styles['form-input']}
                                                        value={compSubject}
                                                        onChange={(e) => { setCompSubject(e.target.value); setCompSubjectError('') }}
                                                    />
                                                    {compSubjectError && <div className={styles['error-message']}>{compSubjectError}</div>}
                                                </div>

                                                <div className={styles['form-support-textarea']}>
                                                    <textarea
                                                        placeholder="Enter message"
                                                        className={styles['form-textarea']}
                                                        rows={4}
                                                        value={compMessage}
                                                        onChange={(e) => { setCompMessage(e.target.value); setCompMessageError('') }}
                                                    />
                                                    {compMessageError && <div className={styles['error-message']}>{compMessageError}</div>}
                                                </div>
                                            </div>

                                            <div className={styles['form-support-image']}>
                                                <SupportImageUpload
                                                  
                                                    images={compImages}
                                                    setImages={setCompImages}
                                                    errorMessage={imageError}
                                                    clearImageError={clearComplaintImageError}
                                                    ErrorMessage={setImageError}
                                                />
                                                {compImageError && <div className={styles['error-message']}>{compImageError }</div>}
                                            </div>
                                        </div>
                                        <div className={styles['form-submit-btn-cont']}>
                                            <button 
                                            type="submit" 
                                            className={styles['form-submit-btn']}
                                            disabled={loading}
                                            >
                                                {loading ? (
                                                <div className='loading-spinner'></div>
                                            ) : (
                                                'Submit'
                                            )}
                                           </button>
                                        </div>
                                    </form>
                                </div>
                            )
                        }
                    </div>
               
                <FaqSupport />
            </div>
        </div>
    );
};


export default Support;


