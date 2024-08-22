import React, { useEffect, useState } from 'react';
import '../style/detailsrequest.css'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import CompanyLogo from '../assest/companylogo.png'
import TradeLicense from '../assest/certificate.jpg'
import TaxCertificate from '../assest/tax-certificate.jpg'
import Certificate from '../assest/Medical_certificate.jpg'
import { useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';
import { toast } from 'react-toastify';


const SupplierRequestDetails = () => {
    const {supplierId} = useParams()
    const navigate    = useNavigate()
    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");
    const [supplierDetails, setSupplierDetails] = useState()

    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
            return;
        }
        const obj = {
            admin_id  : adminIdSessionStorage || adminIdLocalStorage ,
            supplier_id  : supplierId,
        }
        postRequestWithToken('admin/get-supplier-details', obj, async (response) => {
            if (response.code === 200) {
                setSupplierDetails(response.result)
            } else {
               console.log('error in get-supplier-details api',response);
            }
        })
    },[])

    const handleAcceptReject = (action) => {
        const obj = {
            admin_id  : adminIdSessionStorage || adminIdLocalStorage ,
            supplier_id  : supplierId,
            action
        }

        postRequestWithToken('admin/accept-reject-supplier-registration', obj, async (response) => {
            if (response.code === 200) {
                toast(response.message, {type: 'success'})
                setTimeout(() => {
                    navigate('/admin/seller-request')
                },1000)
                
                // setSupplierDetails(response.result)
            } else {
               console.log('error in accept-reject-supplier api',response);
               toast(response.message, {type: 'error'})
            }
        })
    }
    return (
        <>
            <div className='buyer-details-container'>
                <div className='buyer-details-inner-conatiner'>
                    <div className='buyer-details-container-heading'>Supplier Request</div>
                    <div className='buyer-details-left-inner-container'>
                        <div className='buyer-details-left-uppar-section'>
                            <div className='buyer-details-uppar-main-logo-section'>
                                <div className='buyer-details-company-logo-container'>
                                    <div className='buyer-details-company-logo-section'>
                                        <img src={`${process.env.REACT_APP_SERVER_URL}uploads/supplier/supplierImage_files/${supplierDetails?.supplier_image[0]}`} alt='CompanyLogo' />
                                        {/* src={`${process.env.REACT_APP_SERVER_URL}uploads/buyer/buyer_images/${poDetails?.buyer_details[0]?.buyer_image[0]}`} */}
                                    </div>
                                </div>
                                <div className='buyer-details-uppar-right-main-section'>
                                    <div className='buyer-details-uppar-main-containers'>
                                        <div className='buyer-details-upper-section-container'>
                                            <div className='buyer-details-left-uppar-head'>{supplierDetails?.supplier_name}</div>
                                        </div>
                                        <div className='buyer-details-left-inner-section'>
                                            <div className='buyer-details-left-company-type'>
                                                <div className='buyer-details-left-inner-sec-text'>Supplier ID: {supplierDetails?.supplier_id}</div>
                                            </div>
                                            <div className='buyer-details-left-inner-img-container'>
                                                <div className='buyer-details-left-inner-mobile-button'>
                                                    <PhoneInTalkOutlinedIcon className='buyer-details-left-inner-icon' />
                                                    <span className='tooltip buyer-tooltip'>{supplierDetails?.supplier_country_code} {supplierDetails?.supplier_mobile}</span>
                                                </div>
                                                <div className='buyer-details-left-inner-email-button'>
                                                    <MailOutlineIcon className='buyer-details-left-inner-icon' />
                                                    <span className='tooltip buyer-tooltip'>{supplierDetails?.supplier_email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='buyer-details-uppar-right-container-section'>
                                        <div className='buyer-details-company-type-section'>
                                            <div className='buyer-details-company-type-sec-head'>Company Type:</div>
                                            <div className='buyer-details-company-type-sec-text'> {supplierDetails?.supplier_type}</div>
                                        </div>
                                        <div className='buyer-details-company-type-section'>
                                            <div className='buyer-details-company-type-sec-head'>Address:</div>
                                            <div className='buyer-details-company-type-sec-text'>{supplierDetails?.supplier_address}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='buyer-details-description-section'>
                            <div className='buyer-details-description-head'>Description</div>
                            <div className='buyer-details-description-content'>{supplierDetails?.description}</div>
                        </div>
                        <div className='buyers-details-section'>
                            <div className='buyer-details-inner-left-section'>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Contact Person Name :</div>
                                    <div className='buyer-details-inner-text'>{supplierDetails?.contact_person_name}</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Designation :</div>
                                    <div className='buyer-details-inner-text'>{supplierDetails?.designation}</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Email ID :</div>
                                    <div className='buyer-details-inner-text'>{supplierDetails?.contact_person_email}</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Mobile No. :</div>
                                    <div className='buyer-details-inner-text'>{supplierDetails?.contact_person_country_code} {supplierDetails?.contact_person_mobile_no}</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>License No. :</div>
                                    <div className='buyer-details-inner-text'>{supplierDetails?.license_no}</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>License Expiry Date :</div>
                                    <div className='buyer-details-inner-text'>{supplierDetails?.license_expiry_date}</div>
                                </div>
                            </div>
                            <div className='buyer-details-inner-left-section'>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Tax No. :</div>
                                    <div className='buyer-details-inner-text'>{supplierDetails?.tax_no}</div>
                                </div>
                                {/* <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Approx. Yearly Purchase :<br /> Value</div>
                                    <div className='buyer-details-inner-text'>{supplierDetails?.approx_yearly_purchase_value}</div>
                                </div> */}
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Country of Origin :</div>
                                    <div className='buyer-details-inner-text'>{supplierDetails?.country_of_origin}</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Country of Operation :</div>
                                    <div className='buyer-details-inner-text'>{supplierDetails?.country_of_operation?.join(', ')}</div>
                                </div>

                                {/* <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Interested In :</div>
                                    <div className='buyer-details-inner-text'>{supplierDetails?.interested_in?.join(', ')}</div>
                                </div> */}
                            </div>

                        </div>
                    </div>
                    <div className='buyer-details-card-section'>
                        <div className='buyer-details-uppar-card-section'>
                            <div className='buyer-details-uppar-card-inner-section'>
                                <div className='buyer-details-card-container'>
                                    <div className='buyer-details-company-logo-heading'>Trade License</div>
                                    <div className='buyer-details-company-img-container'>
                                        <img 
                                        // src={TradeLicense} 
                                        src={`${process.env.REACT_APP_SERVER_URL}uploads/supplier/license_image/${supplierDetails?.license_image[0]}`}
                                        alt='License' />
                                    </div>
                                </div>
                                <div className='buyer-details-card-container'>
                                    <div className='buyer-details-company-logo-heading'>Tax Certificate</div>
                                    <div className='buyer-details-company-img-container'>
                                        <img 
                                        // src={TaxCertificate} 
                                        src={`${process.env.REACT_APP_SERVER_URL}uploads/supplier/tax_image/${supplierDetails?.tax_image[0]}`}
                                        alt='Tax' />
                                    </div>
                                </div>
                                <div className='buyer-details-card-container'>
                                    <div className='buyer-details-company-logo-heading'>Certificate</div>
                                    <div className='buyer-details-company-img-container'>
                                        <img 
                                        // src={Certificate} 
                                        src={`${process.env.REACT_APP_SERVER_URL}uploads/supplier/certificate_image/${supplierDetails?.certificate_image[0]}`}
                                        alt='Certificate' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='buyer-details-button-containers'>
                        <div className='buyer-details-button-reject' onClick={() => {handleAcceptReject('reject')}}>Reject</div>
                        <div className='buyer-details-button-accept' onClick={() => {handleAcceptReject('accept')}}>Accept</div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default SupplierRequestDetails




