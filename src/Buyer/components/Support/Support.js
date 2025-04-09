import React, { useState } from 'react';
import styles from './support.module.css';
import FaqSupport from './FaqSupport';
import SupportImageUpload from './SupportImageUpload'
import { postRequestWithFile, postRequestWithTokenAndFile } from '../../../api/Requests';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

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
            const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
            const buyerIdLocalStorage = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }
        
            const formData = new FormData();
            formData.append('buyer_id', buyerIdSessionStorage || buyerIdLocalStorage);
            formData.append('subject', subject);
            formData.append('message', message);
            formData.append('support_type', type); // feedback or complaint
            formData.append('usertype', 'buyer');
            images.forEach(file => formData.append(`${type}_image`, file));
        
            postRequestWithTokenAndFile(endpoint, formData, async (response) => {
                if (response.code === 200) {
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
                    endpoint: 'order/submit-feedback',
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
                    endpoint: 'order/submit-complaint',
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

    // const validate = () => {
    //     const errors = {};
    //     if (!orderId) {
    //         setOrderIdError('Order ID is Required');
    //         errors.orderId = true;
    //     } else {
    //         setOrderIdError('');
    //     }
    //     if (!feedback) {
    //         setFeedbackError('Feedback is Required');
    //         errors.feedback = true;
    //     } else {
    //         setFeedbackError('');
    //     }
    //     if (feedbackImages.length === 0) {
    //         setImageError('Please upload at least one image');
    //         errors.image = true;
    //     } else {
    //         setImageError('');
    //     }
    //     return errors;
    // };

    // const compValidate = () => {
    //     const errors = {};
    //     if (!compOrderId) {
    //         setCompOrderIdError('Order ID is Required');
    //         errors.compOrderId = true;
    //     } else {
    //         setCompOrderIdError('');
    //     }
    //     if (!compFeedback) {
    //         setCompFeedbackError('Feedback is Required');
    //         errors.compFeedback = true;
    //     } else {
    //         setCompFeedbackError('');
    //     }
    //     if (compImages.length === 0) {
    //         setCompImageError('Please upload at least one image');
    //         errors.compImage = true;
    //     } else {
    //         setCompImageError('');
    //     }
    //     return errors;
    // };

    // const handleSubmit = (event) => {

    //     const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
    //     const buyerIdLocalStorage = localStorage.getItem("buyer_id");

    //     if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
    //         navigate("/buyer/login");
    //         return;
    //     }

    //     event.preventDefault();
    //     const errors = validate();
    //     if (Object.keys(errors).length === 0) {
    //         // const feedback_images = Array.from(feedbackImages).map(file => file);

    //         const formData = new FormData();

    //         formData.append('buyer_id', buyerIdSessionStorage || buyerIdLocalStorage);
    //         formData.append('order_id', orderId);
    //         formData.append('feedback', feedback);
    //         formData.append('support_type', 'feedback');
    //         formData.append('usertype', 'buyer');
    //         Array.from(feedbackImages).forEach(file => formData.append('feedback_image', file))

    //         postRequestWithTokenAndFile('order/submit-order-feedback', formData, async (response) => {
    //             if (response.code === 200) {
    //                 toast(response.message, { type: "success" });
    //                 setOrderId('')
    //                 setFeedback('')
    //                 setFeedbackImages([])
    //             } else {
    //                 toast(response.message, { type: "error" });
    //             }
    //         })

    //     }
    // };

    // const complaintSubmit = (event) => {
    //     const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
    //     const buyerIdLocalStorage = localStorage.getItem("buyer_id");

    //     if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
    //         navigate("/buyer/login");
    //         return;
    //     }

    //     event.preventDefault();
    //     const errors = compValidate();
    //     if (Object.keys(errors).length === 0) {
    //         const complaint_images = Array.from(compImages).map(file => file);

    //         const formData = new FormData();

    //         formData.append('buyer_id', buyerIdSessionStorage || buyerIdLocalStorage);
    //         formData.append('order_id', compOrderId);
    //         formData.append('complaint', compFeedback);
    //         formData.append('support_type', 'complaint');
    //         formData.append('usertype', 'buyer');
    //         Array.from(compImages).forEach(file => formData.append('complaint_image', file))

    //         postRequestWithTokenAndFile('order/submit-order-complaint', formData, async (response) => {
    //             if (response.code === 200) {
    //                 toast(response.message, { type: "success" });
    //                 setCompOrderId('')
    //                 setCompFeedback('')
    //                 setCompImages([])
    //             } else {
    //                 toast(response.message, { type: "error" });
    //             }
    //         })
    //     }
    // };

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
                <div className={styles['support-page']}>
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
                            <Link to={`/buyer/edit-profile/${sessionStorage.getItem("_id")}`}>
                                <div className={`${styles['support-btn']} ${activeButton === 'profile' && styles.active}`}>
                                    Update Profile
                                </div>
                            </Link>

                        </div>
                        <ToastContainer />
                        {
                            feedbackVisible && (
                                <div className={styles['form-main-container']}>
                                    <div className={styles['form-heading']}>Enquiry Form</div>
                                    <form className={styles['form-main-form-section']} 
                                    // onSubmit={handleSubmit}
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
                                                    // images={feedbackImages}
                                                    // setImages={setFeedbackImages}
                                                    // errorMessage={imageError}
                                                    // clearImageError={clearFeedbackImageError}
                                                    images={feedbackImages}
                                                    setImages={setFeedbackImages}
                                                    errorMessage={imageError}
                                                    clearImageError={clearFeedbackImageError}
                                                    ErrorMessage={setImageError}
                                                />
                                                {imageError && <div className={styles['error-message']}>{imageError}</div>}
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
                                    //  onSubmit={complaintSubmit}
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
                                                    // images={compImages}
                                                    // setImages={setCompImages}
                                                    // errorMessage={compImageError}
                                                    // clearImageError={clearComplaintImageError}
                                                    images={compImages}
                                                    setImages={setCompImages}
                                                    errorMessage={imageError}
                                                    clearImageError={clearComplaintImageError}
                                                    ErrorMessage={setImageError}
                                                />
                                                {compImageError && <div className={styles['error-message']}>{compImageError}</div>}
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
                </div>
                <FaqSupport />
            </div>
        </div>
    );
};

export default Support;
