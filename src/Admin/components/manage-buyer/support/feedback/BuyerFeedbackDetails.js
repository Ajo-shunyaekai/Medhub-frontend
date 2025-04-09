import React, { useEffect, useState } from 'react';
import '../../../../assets/style/sellerfeedback.css'
import 'react-responsive-modal/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../../../../api/Requests';
import { toast } from 'react-toastify';
import moment from 'moment-timezone';

const BuyerFeedbackDetails = () => {
    const { supportId } = useParams()
    const navigate = useNavigate()
    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage = localStorage.getItem("admin_id");
    const [supplierDetails, setSupplierDetails] = useState()


    const renderImages = () => {
        if (supplierDetails?.support_image?.length > 0) {
            // Render dynamic images
            return supplierDetails.support_image.map((image, index) => (
                <img
                    key={index}
                    src={`${process.env.REACT_APP_SERVER_URL}uploads/buyer/order/feedback_images/${image}`}
                    alt={`Support Image ${index + 1}`}
                    className="seller-details-document-image"
                />
            ));
        }
    };


    
    // const renderFiles = (files, type) => {
    //     return files?.map((file, index) => (
    //         <img
    //             key={index}
    //             src={`${process.env.REACT_APP_SERVER_URL}uploads/supplier/${type}/${file}`}
    //             alt={type}
    //             className='seller-details-document-image'
    //         />
    //     ));
    // };
    // End the modal and pdf url
    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
            return;
        }
        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            support_id: supportId,
        }
        postRequestWithToken('admin/get-support-details', obj, async (response) => {
            if (response.code === 200) {
                setSupplierDetails(response.result)
            } else {
            }
        })
    }, [])

    const handleAcceptReject = (action) => {
        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            supplier_id: supportId,
            action
        }

        postRequestWithToken('admin/accept-reject-supplier-registration', obj, async (response) => {
            if (response.code === 200) {
                toast(response.message, { type: 'success' })
                setTimeout(() => {
                    navigate('/admin/supplier-request')
                }, 1000)

                // setSupplierDetails(response.result)
            } else {
                toast(response.message, { type: 'error' })
            }
        })
    }
    return (
        <>
            <div className='seller-details-container'>
                <div className='seller-details-inner-conatiner'>
                    <div className='seller-details-container-heading'>Feedback Details</div>
                    <div className='seller-details-left-inner-container'>
                        <div className='seller-details-left-uppar-section'>
                            <div className='seller-details-uppar-main-logo-section'>
                                <div className='seller-details-uppar-right-main-section'>
                                    <div className='seller-details-uppar-right-container-section'>
                                        <div className='seller-details-company-type-section'>
                                            <div className='seller-details-company-type-sec-head'>Buyer ID :</div>
                                            <div className='seller-details-company-type-sec-text'>{supplierDetails?.user_id}</div>
                                        </div>
                                        <div className='seller-details-company-type-section'>
                                            <div className='seller-details-company-type-sec-head'>Buyer Name :</div>
                                            <div className='seller-details-company-type-sec-text'>{supplierDetails?.buyer?.buyer_name}</div>
                                        </div>
                                    </div>
                                    <div className='seller-details-uppar-right-container-section'>
                                        <div className='seller-details-company-type-section'>
                                            <div className='seller-details-company-type-sec-head'>Subject :</div>
                                            <div className='seller-details-company-type-sec-text'>{supplierDetails?.subject || 'N/A'}</div>
                                        </div>
                                        <div className='seller-details-company-type-section'>
                                            <div className='seller-details-company-type-sec-head'>Date:</div>
                                            <div className='seller-details-company-type-sec-text'>
                                            {moment(supplierDetails?.created_at).tz('Asia/Kolkata').format('DD-MM-YYYY')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='seller-details-description-section'>
                            <div className='seller-details-description-head'>Message</div>
                            <div className='seller-details-description-content'>{supplierDetails?.reason || 'N/A'}</div>
                        </div>
                    </div>
                    <div className='seller-details-card-section'>
                        <div className='seller-details-uppar-card-section'>
                            <div className='seller-details-uppar-card-inner-section'>
                                <div className='seller-details-card-container'>
                                    <div className='seller-details-company-logo-heading'>Images</div>
                                    <div className='seller-details-company-img-container'>
                                      {renderImages()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BuyerFeedbackDetails
