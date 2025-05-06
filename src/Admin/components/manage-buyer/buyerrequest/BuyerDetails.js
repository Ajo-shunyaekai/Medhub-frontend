import React, { useEffect, useState } from 'react';
import '../../../assets/style/detailsrequest.css'
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import {Link, useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../../../api/Requests';
import { toast } from 'react-toastify';
import { FaFilePdf, FaFileWord } from 'react-icons/fa';
import { apiRequests } from '../../../../api/index';
import moment from 'moment/moment';
const BuyerDetails = () => {
    const { buyerId } = useParams()
    const navigate = useNavigate()
    const adminIdSessionStorage = localStorage?.getItem("admin_id");
    const adminIdLocalStorage = localStorage?.getItem("admin_id");
    const [buyerDetails, setBuyerDetails] = useState()
    const [open, setOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const openModal = (url) => {
        window.open(url, '_blank');
    };

    const closeModal = () => {
        setOpen(false);
        setPdfUrl(null);
    };
    const extractFileName = (url) => {
        return url.split('/')?.pop();
    };



    const renderFiles = (files, type, hasDate = false) => {
        if (!files) return null;

        return files.map((item, index) => {
            const serverUrl = process.env.REACT_APP_SERVER_URL;
            let file, date;
            if (hasDate) {
                file = item.file;
                date = item.date;
            } else {
                file = item;
            }

            if (file?.endsWith('.pdf')) {
                return (
                    <div key={index} className='buyer-details-pdf-section'>
                        <FaFilePdf
                            size={50}
                            color="red"
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.open(`${serverUrl}uploads/buyer/${type}/${file}`, '_blank')}
                        />
                        <div
                            className='pdf-url'
                            onClick={() => window.open(`${serverUrl}uploads/buyer/${type}/${file}`, '_blank')}
                        >
                            {extractFileName(file)}
                        </div>
                        {hasDate && date && (
                            <div className='certificate-expiry-date'>
                                Expiry Date: {new Date(date).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                );
            } else if (
                file?.endsWith('.vnd.openxmlformats-officedocument.wordprocessingml.document') ||
                file?.endsWith('.docx')
            ) {
                const docxFileName = file.replace(
                    '.vnd.openxmlformats-officedocument.wordprocessingml.document',
                    '.docx'
                );
                const docxUrl = `${serverUrl}uploads/buyer/${type}/${docxFileName}`;

                return (
                    <div key={index} className='buyer-details-docx-section'>
                        <FaFileWord
                            size={50}
                            color="blue"
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.open(docxUrl, '_blank')}
                        />
                        <div>
                            <div className='docx-url' onClick={() => window.open(docxUrl, '_blank')}>
                                {extractFileName(docxFileName)}
                            </div>
                            {hasDate && date && (
                                <div className='expiry-date'>
                                    Expiry Date: {new Date(date).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div key={index} className='buyer-details-image-section'>
                        <img
                            src={`${serverUrl}uploads/buyer/${type}/${file}`}
                            alt={type}
                            className='buyer-details-document-image'
                        />
                        {hasDate && date && (
                            <div className='expiry-date'>
                                Expiry Date: {new Date(date).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                );
            }
        });
    };
    useEffect(() => {
        const getBuyerDetails = async () => {
            if (!adminIdSessionStorage && !adminIdLocalStorage) {
                localStorage?.clear();
                navigate("/admin/login");
                return;
            }
            const obj = {
                admin_id: adminIdSessionStorage || adminIdLocalStorage,
                buyer_id: buyerId,
            }

            try {
                const response = await apiRequests.getRequest(`buyer/get-specific-buyer-details/${buyerId}`, obj);
                if (response?.code !== 200) {
                    return;
                }
                setBuyerDetails(response?.result);
            } catch (error) {
            }
        }
        getBuyerDetails()
    }, [])

    const handleAcceptReject = (action) => {
        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            buyer_id: buyerId,
            action
        }

        postRequestWithToken('admin/accept-reject-buyer-registration', obj, async (response) => {
            if (response?.code === 200) {

                toast(response.message, { type: 'success' })
                setTimeout(() => {
                    navigate('/admin/buyer-request')
                }, 1000)
                
            } else {
                toast(response.message, { type: 'error' })
            }
        })
    }
    return (
       
            <div className='buyer-details-container'>
                <div className='buyer-details-inner-conatiner'>
                    <div className='buyer-details-edit-button-container'>
                        <div className='buyer-details-container-heading'>Buyer ID: {buyerDetails?.buyer_id}</div>
                        {buyerDetails?.account_status !== 2 && (
                            <>
                                <Link to={`/admin/edit-details/buyer/${buyerDetails?._id}`}>
                                    <span className='buyer-details-edit-button'>Edit</span>
                                </Link>
                            </>
                        )}
                    </div>
                    <div className='buyer-details-left-inner-container'>
                        <div className='buyer-details-left-uppar-section'>
                            <div className='buyer-details-uppar-main-logo-section'>
                                <div className='buyer-details-company-logo-container'>
                                    <div className='buyer-details-company-logo-section'>
                                        {/* src={`${process.env.REACT_APP_SERVER_URL}uploads/buyer/buyer_images/${poDetails?.buyer_details?.[0]?.buyer_image?.[0]}`} */}

                                    </div>
                                </div>
                                <div className='buyer-details-uppar-right-main-section'>
                                    <div className='buyer-details-uppar-main-containers'>

                                        <div className='buyer-details-left-inner-section'>
                                            <div className='buyer-details-upper-section-container'>
                                                <div className='buyer-details-left-uppar-head'>{buyerDetails?.buyer_name}</div>
                                                <a className='buyer-details-left-uppar-head' href={buyerDetails?.websiteAddress} target="_blank" rel="noopener noreferrer">
                                                {buyerDetails?.websiteAddress}
                                            </a>
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
                                                    <a href={`mailto:${buyerDetails?.contact_person_email}`} target="_blank" rel="noopener noreferrer">
                                                        <MailOutlineIcon
                                                            data-tooltip-id={buyerDetails?.contact_person_email ? "my-tooltip-2" : null}
                                                            className='buyer-details-left-inner-icon'
                                                        />
                                                    </a>
                                                    {buyerDetails?.contact_person_email && (
                                                        <ReactTooltip
                                                            id="my-tooltip-2"
                                                            place="bottom"
                                                            effect="solid"
                                                            content={buyerDetails.contact_person_email}
                                                        />
                                                    )}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className='buyer-details-uppar-right-container-section'>
                                        <div className='buyer-details-account-container-section'>
                                            <div className='buyer-details-inner-section'>
                                                <div className='buyer-details-inner-head'>Account Status :</div>
                                                <div
                                                    className='buyer-details-button-text'
                                                    style={{
                                                        backgroundColor:
                                                            buyerDetails?.account_status === 0
                                                                ? 'orange'
                                                                : buyerDetails?.account_status === 1
                                                                    ? 'green'
                                                                    : 'red',
                                                    }}
                                                >
                                                    {buyerDetails?.account_status === 0
                                                        ? 'Pending'
                                                        : buyerDetails?.account_status === 1
                                                            ? 'Active'
                                                            : 'Inactive'}
                                                </div>
                                            </div>

                                            <div className='buyer-details-inner-section'>
                                                <div className='buyer-details-inner-head'>Company Type:</div>
                                                <div className='buyer-details-inner-text'>{buyerDetails?.buyer_type}</div>
                                            </div>

                                        </div>
                                        <div className='buyer-details-company-type-section'>
                                            <div className='buyer-details-company-type-sec-head'>Address:</div>
                                            <div className='buyer-details-company-type-sec-text'>
                                                {buyerDetails?.buyer_address} {buyerDetails?.registeredAddress?.locality}
                                            </div>
                                            <div className='buyer-details-company-type-sec-text'>
                                                {buyerDetails?.registeredAddress?.land_mark || ''} {buyerDetails?.registeredAddress?.country} {buyerDetails?.registeredAddress?.state || ''} {buyerDetails?.registeredAddress?.city || ''}
                                            </div>
                                            <div className='buyer-details-company-type-sec-text'>
                                                {buyerDetails?.registeredAddress?.pincode || ''}
                                            </div>
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
                                    <div className='buyer-details-inner-head'>Account Creation Date :</div>
                                    <div className='buyer-details-inner-text'>
                                        {moment(buyerDetails?.createdAt).format("DD-MM-YYYY")}
                                    </div>
                                </div>
                                {buyerDetails?.account_status !== 2 && (
                                    <>
                                        <div className='buyer-details-inner-section'>
                                            <div className='buyer-details-inner-head'>Last Log-in Date :</div>
                                            <div className='buyer-details-inner-text'>
                                                {moment(buyerDetails?.last_login).format("DD-MM-YYYY")}
                                            </div>
                                        </div>
                                    </>


                                )}
                              
                            </div>
                            <div className='buyer-details-inner-left-section'>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>
                                        {buyerDetails?.account_status === 1 ? "Account Approved Date:" : buyerDetails?.account_status === 2 ? "Account Rejected Date:" : ""}
                                    </div>
                                    <div className='buyer-details-inner-text'>
                                        {buyerDetails?.account_status === 1
                                            ? buyerDetails?.account_accepted_date
                                            : buyerDetails?.account_status === 2
                                                ? buyerDetails?.account_rejected_date
                                                : " "}
                                    </div>
                                </div>
                                {buyerDetails?.account_status !== 2 && (
                                    <>
                                        <div className='buyer-details-inner-section'>
                                            <div className='buyer-details-inner-head'>
                                                Log-in frequency over <br />last 90 days:
                                            </div>
                                            <div className='buyer-details-inner-text'>
                                                {buyerDetails?.loginFrequencyLast90Days}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className='buyers-details-section'>
                            <div className='buyer-details-inner-left-section'>

                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Medhub Global Sales Representative:</div>
                                    <div className='buyer-details-inner-text'>
                                        {buyerDetails?.sales_person_name}
                                    </div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Company Registartion No. :</div>
                                    <div className='buyer-details-inner-text'>{buyerDetails?.registration_no}</div>
                                </div>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>GST/VAT Registration No. :</div>
                                    <div className='buyer-details-inner-text'>{buyerDetails?.vat_reg_no}</div>
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
                            <div className='buyer-details-inner-left-section'>
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>Business/Trade Activity Code :</div>
                                    <div className='buyer-details-inner-text'>{buyerDetails?.registration_no}</div>
                                </div>


                                {buyerDetails?.license_no && buyerDetails?.license_expiry_date && (
                                    <>
                                        <div className='buyer-details-inner-section'>
                                            <div className='buyer-details-inner-head'>License No. :</div>
                                            <div className='buyer-details-inner-text'>{buyerDetails?.license_no}</div>
                                        </div>


                                        <div className='buyer-details-inner-section'>
                                            <div className='buyer-details-inner-head'>License Expiry Date :</div>
                                            <div className='buyer-details-inner-text'>{buyerDetails?.license_expiry_date}</div>
                                        </div>
                                    </>
                                )}

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
                            </div>
                        </div>
                    </div>
                    <div className='buyer-details-card-section'>
                        <div className='buyer-details-uppar-card-section'>
                            <div className='buyer-details-uppar-card-inner-section'>
                                {
                                    buyerDetails?.buyer_type === 'Medical Practitioner' && (
                                        <div className='buyer-details-card-container'>
                                            <div className='buyer-details-company-logo-heading'>Medical Practitioner Document</div>
                                            <div className='buyer-details-company-img-container'>
                                                {renderFiles(buyerDetails?.medical_certificate, 'medical_practitioner_images')}
                                            </div>
                                        </div>
                                    )
                                }
                                <div className='buyer-details-card-container'>
                                    <div className='buyer-details-company-logo-heading'>Trade License</div>
                                    <div className='buyer-details-company-img-container'>
                                        {renderFiles(buyerDetails?.license_image, 'license_images')}
                                    </div>
                                </div>
                                <div className='buyer-details-card-container'>
                                    <div className='buyer-details-company-logo-heading'>Certificate</div>
                                    <div className='buyer-details-company-img-container'>
                                        {renderFiles(
                                            buyerDetails?.certificateFileNDate?.length > 0
                                                ? buyerDetails?.certificateFileNDate
                                                : buyerDetails?.certificate_image,
                                            'certificate_images',
                                            buyerDetails?.certificateFileNDate?.length > 0
                                        )}
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

                    <div className='buyer-details-button-containers'>
                       

                    </div>
                </div>
            </div>
       
    )
}

export default BuyerDetails




