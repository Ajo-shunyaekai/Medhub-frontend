import React, { useEffect, useState } from 'react';
import '../style/detailsrequest.css'
import { Modal } from 'react-responsive-modal';
import { Tooltip as ReactTooltip } from "react-tooltip";
import 'react-responsive-modal/styles.css';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';
import { toast } from 'react-toastify';
import BuyerCustomModal from './BuyerCustomModal';
import { FaFilePdf } from 'react-icons/fa';
import {apiRequests} from '../../api/index'

const DetailsBuyerRequest = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { buyerId } = useParams()
    const navigate = useNavigate()
    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage = localStorage.getItem("admin_id");
    const [open, setOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const openModal = (url) => {
        console.log("Opening URL:", url);
        window.open(url, '_blank');
    };

    const closeModal = () => {
        setOpen(false);
        setPdfUrl(null);
    };
    const extractFileName = (url) => {
        return url.split('/').pop();
    };

    // Assuming `supplierDetails` has arrays like `license_image`, `tax_image`, and `certificate_image`
    const renderFiles = (files, type) => {
        return files?.map((file, index) => {
            if (file.endsWith('.pdf')) {
                // Render a PDF icon with a clickable link
                return (
                    <div key={index} className='buyer-details-pdf-section'>
                        <FaFilePdf
                            size={50}
                            color="red"
                            style={{ cursor: 'pointer' }}
                            onClick={() => openModal(`${process.env.REACT_APP_SERVER_URL}uploads/buyer/${type}/${file}`)}
                        />
                        <div className='pdf-url' onClick={() => openModal(`${process.env.REACT_APP_SERVER_URL}uploads/buyer/${type}/${file}`)}>
                            {extractFileName(file)}
                        </div>
                    </div>
                );
            } else {
                // Render an image
                return (
                    <img
                        key={index}
                        src={`${process.env.REACT_APP_SERVER_URL}uploads/buyer/${type}/${file}`}
                        alt={type}
                        className='buyer-details-document-image'
                    />
                );
            }
        });
    };




    // End the modal and pdf url





    const [loading, setLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false)
    const [buyerDetails, setBuyerDetails] = useState()

    useEffect(()=>{
        const getBuyerDetails = async () => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
            return;
        }
        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            buyer_id: buyerId,
        }
        // postRequestWithToken('admin/get-buyer-details', obj, async (response) => {
        //     if (response.code === 200) {
        //         setBuyerDetails(response.result)
        //     } else {
        //         console.log('error in get-buyer-details api', response);
        //     }
        // })
        // const response = await apiRequests.postRequest(`buyer/get-specific-buyer-details/${buyerId}`, obj);
        // if (response?.code !== 200) {
        //     console.log('error in get-buyer-details api', response);
        //     return;
        // }
        // setBuyerDetails(response?.result);
        try {
            postRequestWithToken(`buyer/get-specific-buyer-details/${buyerId}`, obj, async (response) => {
                if (response.code === 200) {
                    setBuyerDetails(response.result)
                } else {
                    console.log('error in get-buyer-details api', response);
                }
            })
        } catch (error) {
            console.log('error in get-buyer-details api', error);
        }
        }
        getBuyerDetails()
    }, [])

    const handleAcceptReject = (action) => {

        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            buyer_id: buyerId,
            action: action
        }
        if (action === 'accept') {
            setLoading(true)
        } else if (action === 'reject') {
            setRejectLoading(true)
        }


        postRequestWithToken('admin/accept-reject-buyer-registration', obj, async (response) => {
            if (response.code === 200) {

                toast(response.message, { type: 'success' })
                setLoading(false);
                setRejectLoading(false);
                setTimeout(() => {
                    navigate('/admin/buyer-request')
                }, 500)
                // setSupplierDetails(response.result)
            } else {
                setLoading(false);
                setRejectLoading(false);
                console.log('error in accept-reject-supplier api', response);
                toast(response.message, { type: 'error' })
            }
        })
    }
    const handleRejectClick = () => {
        setIsModalOpen(true);
    };

    // const closeModal = () => {
    //     setIsModalOpen(false);
    // };
    return (
        <>
            <div className='buyer-details-container'>
                <div className='buyer-details-inner-conatiner'>
                    <div className='buyer-details-container-heading'>Buyer Request</div>
                    <div className='buyer-details-left-inner-container'>
                        <div className='buyer-details-left-uppar-section'>
                            <div className='buyer-details-uppar-main-logo-section'>
                                <div className='buyer-details-company-logo-container'>
                                    <div className='buyer-details-company-logo-section'>
                                        <img src={`${process.env.REACT_APP_SERVER_URL}uploads/buyer/buyer_images/${buyerDetails?.buyer_image[0]}`} alt='CompanyLogo' />
                                        {/* src={`${process.env.REACT_APP_SERVER_URL}uploads/buyer/buyer_images/${poDetails?.buyer_details[0]?.buyer_image[0]}`} */}
                                    </div>
                                </div>
                                <div className='buyer-details-uppar-right-main-section'>
                                    <div className='buyer-details-uppar-main-containers'>
                                        <div className='buyer-details-upper-section-container'>
                                            <div className='buyer-details-left-uppar-head'>{buyerDetails?.buyer_name}</div>
                                        </div>
                                        <div className='buyer-details-left-inner-section'>
                                            <div className='buyer-details-left-company-type'>
                                                <div className='buyer-details-left-inner-sec-text'>Buyer ID: {buyerDetails?.buyer_id}</div>
                                            </div>
                                            <div className='buyer-details-left-inner-img-container'>
                                            <div className='buyer-details-left-inner-mobile-button'>
                                                    <PhoneInTalkOutlinedIcon
                                                        data-tooltip-id={buyerDetails?.buyer_country_code && buyerDetails?.buyer_mobile ? "my-tooltip-1" : null}
                                                        className='buyer-details-left-inner-icon'
                                                    />
                                                    {buyerDetails?.buyer_country_code && buyerDetails?.buyer_mobile && (
                                                        <ReactTooltip
                                                            id="my-tooltip-1"
                                                            place="bottom"
                                                            effect="solid"
                                                            content={`${buyerDetails.buyer_country_code} ${buyerDetails.buyer_mobile}`}
                                                        />
                                                    )}
                                                </div>
                                                <div className='buyer-details-left-inner-email-button'>
                                                    <MailOutlineIcon
                                                        data-tooltip-id={buyerDetails?.buyer_email ? "my-tooltip-2" : null}
                                                        className='buyer-details-left-inner-icon'
                                                    />
                                                    {buyerDetails?.buyer_email && (
                                                        <ReactTooltip
                                                            id="my-tooltip-2"
                                                            place="bottom"
                                                            effect="solid"
                                                            content={buyerDetails.buyer_email}
                                                        />
                                                    )}
                                                </div>  
                                            </div>
                                        </div>
                                    </div>
                                    <div className='buyer-details-uppar-right-container-section'>
                                        <div className='buyer-details-company-type-section'>
                                            <div className='buyer-details-company-type-sec-head'>Company Type:</div>
                                            <div className='buyer-details-company-type-sec-text'> {buyerDetails?.buyer_type}</div>
                                        </div>
                                        <div className='buyer-details-company-type-section'>
                                            <div className='buyer-details-company-type-sec-head'>Address:</div>
                                            <div className='buyer-details-company-type-sec-text'>{buyerDetails?.buyer_address}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='buyer-details-description-section'>
                            <div className='buyer-details-description-head'>Description</div>
                            <div className='buyer-details-description-content'>{buyerDetails?.description}</div>
                        </div>
                        <div className='buyers-details-section'>
                            <div className='buyer-details-inner-left-section'>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Contact Person Name :</div>
                                    <div className='buyer-details-inner-text'>{buyerDetails?.contact_person_name}</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Designation :</div>
                                    <div className='buyer-details-inner-text'>{buyerDetails?.designation}</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Email ID :</div>
                                    <div className='buyer-details-inner-text'>{buyerDetails?.contact_person_email}</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Mobile No. :</div>
                                    <div className='buyer-details-inner-text'>{buyerDetails?.contact_person_country_code} {buyerDetails?.contact_person_mobile}</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>License No. :</div>
                                    <div className='buyer-details-inner-text'>{buyerDetails?.license_no}</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>License Expiry Date :</div>
                                    <div className='buyer-details-inner-text'>{buyerDetails?.license_expiry_date}</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Tax No. :</div>
                                    <div className='buyer-details-inner-text'>{buyerDetails?.tax_no}</div>
                                </div>

                            </div>
                            <div className='buyer-details-inner-left-section'>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Company Registartion No. :</div>
                                    <div className='buyer-details-inner-text'>COM147852369</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>VAT Registartion No. :</div>
                                    <div className='buyer-details-inner-text'>VAT14785236</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Approx. Yearly Purchase :<br /> Value</div>
                                    <div className='buyer-details-inner-text'>{buyerDetails?.approx_yearly_purchase_value}</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Country of Origin :</div>
                                    <div className='buyer-details-inner-text'>{buyerDetails?.country_of_origin}</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Country of Operation :</div>
                                    <div className='buyer-details-inner-text'>{buyerDetails?.country_of_operation?.join(', ')}</div>
                                </div>

                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Interested In :</div>
                                    <div className='buyer-details-inner-text'>{buyerDetails?.interested_in?.join(', ')}</div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='buyer-details-card-section'>
                        <div className='buyer-details-uppar-card-section'>
                            <div className='buyer-details-uppar-card-inner-section'>
                                <div className='buyer-details-card-container'>
                                    <div className='buyer-details-company-logo-heading'>Trade License</div>
                                    <div className='buyer-details-company-img-container'>
                                        {renderFiles(buyerDetails?.license_image, 'license_images')}
                                    </div>
                                </div>
                                <div className='buyer-details-card-container'>
                                    <div className='buyer-details-company-logo-heading'>Tax Certificate</div>
                                    <div className='buyer-details-company-img-container'>
                                        {renderFiles(buyerDetails?.tax_image, 'tax_images')}
                                    </div>
                                </div>
                                <div className='buyer-details-card-container'>
                                    <div className='buyer-details-company-logo-heading'>Certificate</div>
                                    <div className='buyer-details-company-img-container'>
                                        {renderFiles(buyerDetails?.certificate_image, 'certificate_images')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Modal for PDF viewing */}
                        <Modal open={open} onClose={closeModal} center>
                            {pdfUrl ? (
                                <iframe
                                    src={pdfUrl}
                                    style={{ width: '500px', height: '500px', border: 'none' }}
                                    title="PDF Viewer"
                                />
                            ) : (
                                <p>Unable to load the PDF. Check the URL or try again later.</p>
                            )}
                        </Modal>
                    </div>

                    <div className='buyer-details-container'>
                        {/* Rest of your JSX content */}
                        <div className='buyer-details-button-containers'>
                            <div
                                className='buyer-details-button-accept'
                                onClick={() => handleAcceptReject('accept')}
                                disabled={loading}
                            >

                                {loading ? (
                                    <div className='loading-spinner'></div>
                                ) : (
                                    'Accept'
                                )}
                            </div>
                            <div
                                className='buyer-details-button-reject'
                                //  onClick={handleRejectClick}
                                onClick={() => handleAcceptReject('reject')}
                                disabled={rejectLoading}
                            >
                                {rejectLoading ? (
                                    <div className='loading-spinner'></div>
                                ) : (
                                    'Reject'
                                )}
                            </div>
                        </div>

                        {isModalOpen && (
                            <BuyerCustomModal onClose={closeModal} />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailsBuyerRequest




