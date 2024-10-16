import React, { useEffect, useState } from 'react';
import '../../style/sellerfeedback.css'
import 'react-responsive-modal/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../../api/Requests';
import { toast } from 'react-toastify';
import Image1 from '../../assest/certificate.jpg'
import Image2 from '../../assest/tax-certificate.jpg'
import Image3 from '../../assest/certificate.jpg'
import Image4 from '../../assest/tax-certificate.jpg'
import Image5 from '../../assest/certificate.jpg'
import Image6 from '../../assest/tax-certificate.jpg'
const BuyerComplaintDetails = () => {
    const { supplierId } = useParams()
    const navigate = useNavigate()
    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage = localStorage.getItem("admin_id");
    const [supplierDetails, setSupplierDetails] = useState()
    const staticImages = [Image1, Image2,Image3,Image4,Image5,Image6];


    const renderStaticImages = () => {
        return staticImages.map((image, index) => (
            <img
                key={index}
                src={image}
                alt={`Static Image ${index + 1}`}
                className='seller-details-document-image'
            />
        ));
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
            supplier_id: supplierId,
        }
        postRequestWithToken('admin/get-supplier-details', obj, async (response) => {
            if (response.code === 200) {
                setSupplierDetails(response.result)
            } else {
                console.log('error in get-supplier-details api', response);
            }
        })
    }, [])

    const handleAcceptReject = (action) => {
        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            supplier_id: supplierId,
            action
        }

        postRequestWithToken('admin/accept-reject-supplier-registration', obj, async (response) => {
            if (response.code === 200) {
                toast(response.message, { type: 'success' })
                setTimeout(() => {
                    navigate('/admin/seller-request')
                }, 1000)

                // setSupplierDetails(response.result)
            } else {
                console.log('error in accept-reject-supplier api', response);
                toast(response.message, { type: 'error' })
            }
        })
    }
    return (
        <>
            <div className='seller-details-container'>
                <div className='seller-details-inner-conatiner'>
                    <div className='seller-details-container-heading'>Complaint Details</div>
                    <div className='seller-details-left-inner-container'>
                        <div className='seller-details-left-uppar-section'>
                            <div className='seller-details-uppar-main-logo-section'>
                                <div className='seller-details-uppar-right-main-section'>
                                    <div className='seller-details-uppar-right-container-section'>
                                        <div className='seller-details-company-type-section'>
                                            <div className='seller-details-company-type-sec-head'>Buyer ID :</div>
                                            <div className='seller-details-company-type-sec-text'>1234567</div>
                                        </div>
                                        <div className='seller-details-company-type-section'>
                                            <div className='seller-details-company-type-sec-head'>Buyer Name :</div>
                                            <div className='seller-details-company-type-sec-text'>Parmaceuticals Pvt. Ltd.</div>
                                        </div>
                                    </div>
                                    <div className='seller-details-uppar-right-container-section'>
                                        <div className='seller-details-company-type-section'>
                                            <div className='seller-details-company-type-sec-head'>Order ID :</div>
                                            <div className='seller-details-company-type-sec-text'>ORD123456</div>
                                        </div>
                                        <div className='seller-details-company-type-section'>
                                            <div className='seller-details-company-type-sec-head'>Date:</div>
                                            <div className='seller-details-company-type-sec-text'>12/12/2025</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='seller-details-description-section'>
                            <div className='seller-details-description-head'>Complaint Description</div>
                            <div className='seller-details-description-content'>The Gurgaon real estate market and business climate are intertwined. The presence of big businesses and industries fuels demand for office space, housing, and retail space. It has caused a boom in Gurgaon’s real estate sector, with continually rising housing prices.

                                In Gurgaon, the corporate environment and the real estate market coexist in a symbiotic connection. The availability of high-quality real estate supports businesses, and the demand for real estate promotes the industry. You will find numerous types of pharma companies in Gurgaon.</div>
                        </div>
                    </div>
                    <div className='seller-details-card-section'>
                        <div className='seller-details-uppar-card-section'>
                            <div className='seller-details-uppar-card-inner-section'>
                                <div className='seller-details-card-container'>
                                    <div className='seller-details-company-logo-heading'>Images</div>
                                    <div className='seller-details-company-img-container'>
                                        {renderStaticImages()}
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

export default BuyerComplaintDetails