import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import '../../../assets/style/detailsrequest.css';
import { Modal } from 'react-responsive-modal';
import moment from 'moment/moment';
import 'react-responsive-modal/styles.css';
import { Tooltip as ReactTooltip } from "react-tooltip";
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../../../api/Requests';
import { toast } from 'react-toastify';
import { FaFilePdf, FaFileWord } from 'react-icons/fa';
import SupplierCustomModal from './SupplierCustomModal';
import { apiRequests } from '../../../../api/index';
const SupplierRequestDetails = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [supplierDetails, setSupplierDetails] = useState();
    const { supplierId } = useParams();
    const navigate = useNavigate();
    const adminIdSessionStorage = localStorage?.getItem("admin_id");
    const adminIdLocalStorage = localStorage?.getItem("admin_id");
    const [loading, setLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [salesPersonName, setSalesPersonName] = useState("");
    const [isEditable, setIsEditable] = useState(false);

    const handleEditClick = () => {
        setIsEditable(true);
    };

    const handleChange = (e) => {
        setSalesPersonName(e.target.value);
    };


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
        const serverUrl = process.env.REACT_APP_SERVER_URL;
        if (!files || files.length === 0) {
            return <p>No files available.</p>;
        }
        const isObjectArray = files[0] && typeof files[0] === 'object' && 'file' in files[0];

        return files.map((item, index) => {
            const file = isObjectArray ? item.file : item;
            const date = isObjectArray ? item.date : null;
            if (file?.endsWith('.pdf')) {
                return (
                    <div key={`${file}-${index}`} className='buyer-details-pdf-section'>
                        <FaFilePdf
                            size={50}
                            color="red"
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.open(`${serverUrl}uploads/supplier/${type}/${file}`, '_blank')}
                        />
                        <div>
                            <div
                                className='pdf-url'
                                onClick={() => window.open(`${serverUrl}uploads/supplier/${type}/${file}`, '_blank')}
                            >
                                {extractFileName(file)}
                            </div>
                            {hasDate && date && (
                                <div className='expiry-date'>
                                    Expiry Date: {new Date(date).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>
                );
            }
            else if (
                file?.endsWith('.vnd.openxmlformats-officedocument.wordprocessingml.document') ||
                file?.endsWith('.docx')
            ) {
                const docxFileName = file.replace(
                    '.vnd.openxmlformats-officedocument.wordprocessingml.document',
                    '.docx'
                );
                const docxUrl = `${serverUrl}uploads/supplier/${type}/${docxFileName}`;
                return (
                    <div key={`${file}-${index}`} className='buyer-details-docx-section'>
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
            }
            else {
                return (
                    <div key={`${file}-${index}`}>
                        <img
                            src={`${serverUrl}uploads/supplier/${type}/${file}`}
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
        const getSupplierdetails = async () => {
            if (!adminIdSessionStorage && !adminIdLocalStorage) {
                localStorage?.clear();
                navigate("/admin/login");
                return;
            }

            const obj = {
                admin_id: adminIdSessionStorage || adminIdLocalStorage,
                supplier_id: supplierId,
            };
            try {
                const response = await apiRequests.getRequest(`supplier/get-specific-supplier-details/${supplierId}`, obj);
                if (response?.code !== 200) {
                    return;
                }
                setSupplierDetails(response?.result);
                setSalesPersonName(response?.result?.sales_person_name)

            } catch (error) {
            }
        }
        getSupplierdetails()
    }, [adminIdSessionStorage, adminIdLocalStorage, supplierId, navigate,]);

    const handleRejectClick = () => {
        setIsModalOpen(true);
    };
    const handleAcceptReject = (action) => {
        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            supplier_id: supplierId,
            action: action,
            sales_person_name: salesPersonName
        }
        if (!salesPersonName || salesPersonName === '') {
            return toast('Sales Person is required', { type: 'error' });
        }

        if (action === 'accept') {
            setLoading(true)
        } else if (action === 'reject') {
            setRejectLoading(true)
        }

        postRequestWithToken('admin/accept-reject-supplier-registration', obj, async (response) => {
            if (response?.code === 200) {
                setLoading(false);
                setRejectLoading(false);
                toast(response.message, { type: 'success' })
                setTimeout(() => {
                    navigate('/admin/supplier-request')
                }, 1000)
            } else {
                setLoading(false);
                toast(response.message, { type: 'error' })
            }
        })
    }

    return (

        <div className='buyer-details-container'>
            <div className='buyer-details-inner-conatiner'>
                <div className='buyer-details-container-heading'>Supplier ID: {supplierDetails?.supplier_id}</div>
                <div className='buyer-details-left-inner-container'>
                    <div className='buyer-details-left-uppar-section'>
                        <div className='buyer-details-uppar-main-logo-section'>
                            <div className='buyer-details-company-logo-container'>
                                <div className='buyer-details-company-logo-section'>
                                    <img
                                        src={`${process.env.REACT_APP_SERVER_URL}uploads/supplier/supplierImage_files/${supplierDetails?.supplier_image[0]}`}
                                        alt='CompanyLogo'
                                    />
                                </div>
                            </div>
                            <div className='buyer-details-uppar-right-main-section'>
                                <div className='buyer-details-uppar-main-containers'>

                                    <div className='buyer-details-left-inner-section'>
                                        <div className='buyer-details-upper-section-container'>
                                            <div className='buyer-details-left-uppar-head'>{supplierDetails?.supplier_name}</div>

                                            <a className='buyer-details-left-uppar-head' href={supplierDetails?.websiteAddress} target="_blank" rel="noopener noreferrer">
                                                {supplierDetails?.websiteAddress}
                                            </a>


                                        </div>
                                        <div className='buyer-details-left-inner-img-container'>
                                            <div className='buyer-details-left-inner-mobile-button'>
                                                <PhoneInTalkOutlinedIcon
                                                    data-tooltip-id={supplierDetails?.supplier_country_code && supplierDetails?.supplier_mobile ? "my-tooltip-1" : null}
                                                    className='buyer-details-left-inner-icon'
                                                />
                                                {supplierDetails?.supplier_country_code && supplierDetails?.supplier_mobile && (
                                                    <ReactTooltip
                                                        id="my-tooltip-1"
                                                        place="bottom"
                                                        effect="solid"
                                                        content={`${supplierDetails.supplier_country_code} ${supplierDetails.supplier_mobile}`}
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
                                                        supplierDetails?.account_status === 0
                                                            ? 'orange'
                                                            : supplierDetails?.account_status === 1
                                                                ? 'green'
                                                                : 'red',
                                                }}
                                            >
                                                {supplierDetails?.account_status === 0
                                                    ? 'Pending'
                                                    : supplierDetails?.account_status === 1
                                                        ? 'Active'
                                                        : 'Inactive'}
                                            </div>
                                        </div>
                                        <div className='buyer-details-inner-section'>
                                            <div className='buyer-details-inner-head'>Account Creation Date :</div>
                                            <div className='buyer-details-inner-text'>
                                                {moment(supplierDetails?.createdAt).format("DD-MM-YYYY")}
                                            </div>
                                        </div>
                                        <div className='buyer-details-inner-section'>
                                            <div className='buyer-details-inner-head'>Company Type:</div>
                                            <div className='buyer-details-inner-text'> {supplierDetails?.supplier_type}</div>
                                        </div>


                                    </div>
                                    <div className='buyer-details-company-type-section'>
                                        <div className='buyer-details-company-type-sec-head'>Address:</div>
                                        <div className='buyer-details-company-type-sec-text'>{supplierDetails?.supplier_address} {supplierDetails?.registeredAddress?.locality} {supplierDetails?.registeredAddress?.land_mark} </div>
                                        <div className='buyer-details-company-type-sec-text'> {supplierDetails?.registeredAddress?.country} {supplierDetails?.registeredAddress?.state} {supplierDetails?.registeredAddress?.city} {supplierDetails?.registeredAddress?.pincode}</div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='buyer-details-bank-container'>
                        <div className='buyer-details-bank-section'>
                            <div className='buyer-details-description-head'>Description</div>
                            <div className='buyer-details-description-content'>{supplierDetails?.description}</div>
                        </div>
                        <div className='buyer-details-bank-section'>
                            <div className='buyer-details-description-head'>Bank Details</div>
                            <div className='buyer-details-description-content'>
                                {supplierDetails?.bank_details?.split('\r\n').map((line, index) => (
                                    <div key={index}>{line}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='buyers-details-section'>
                        <div className='buyer-details-inner-left-section'>
                            <div className="buyer-details-inner-section">
                                <div className="buyer-details-inner-head">
                                    Medhub Global Sales Representative :
                                    <FaEdit className="edit-icon" onClick={handleEditClick} />
                                </div>
                                <div className="buyer-details-inner-text">
                                    {isEditable ? (
                                        <input
                                            type="text"
                                            defaultValue={supplierDetails?.sales_person_name}
                                            onChange={handleChange}
                                            className="editable-details"
                                            placeholder="Enter Medhub Global Sales Representative"
                                        />
                                    ) : (
                                        <span>{supplierDetails?.sales_person_name}</span>
                                    )}
                                </div>
                            </div>
                            <div className='buyer-details-inner-section'>
                                <div className='buyer-details-inner-head'>Company Registration No. :</div>
                                <div className='buyer-details-inner-text'>{supplierDetails?.registration_no}</div>
                            </div>
                            <div className='buyer-details-inner-section'>
                                <div className='buyer-details-inner-head'>GST/VAT Registration No :</div>
                                <div className='buyer-details-inner-text'>{supplierDetails?.vat_reg_no}</div>
                            </div>
                            <div className='buyer-details-inner-section'>
                                <div className='buyer-details-inner-head'>Country of Origin :</div>
                                <div className='buyer-details-inner-text'>{supplierDetails?.country_of_origin}</div>
                            </div>
                            <div className='buyer-details-inner-section'>
                                <div className='buyer-details-inner-head'>Country of Operation :</div>
                                <div className='buyer-details-inner-text'>{supplierDetails?.country_of_operation?.join(', ')}</div>
                            </div>
                            <div className='buyer-details-inner-section'>
                                <div className='buyer-details-inner-head'>Category you Trade in :</div>
                                <div className='buyer-details-inner-text'>{supplierDetails?.categories?.join(', ')}</div>
                            </div>

                            <div className='buyer-details-inner-section'>
                                <div className='buyer-details-inner-head'>Tags :</div>
                                <div className='buyer-details-inner-text'>{supplierDetails?.tags}</div>
                            </div>



                        </div>
                        <div className='buyer-details-inner-left-section'>
                            <div className='buyer-details-inner-section'>
                                <div className='buyer-details-inner-head'>Business/Trade Activity Code :</div>
                                <div className='buyer-details-inner-text'>{supplierDetails?.activity_code || '-'}</div>
                            </div>

                            {/* Conditionally render License No. */}
                            {supplierDetails?.license_no && (
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>License No. :</div>
                                    <div className='buyer-details-inner-text'>{supplierDetails?.license_no}</div>
                                </div>
                            )}

                            {/* Conditionally render License Expiry Date */}
                            {supplierDetails?.license_expiry_date && (
                                <div className='buyer-details-inner-section'>
                                    <div className='buyer-details-inner-head'>License Expiry Date :</div>
                                    <div className='buyer-details-inner-text'>{supplierDetails?.license_expiry_date}</div>
                                </div>
                            )}

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
                                <div className='buyer-details-inner-text'>
                                    {supplierDetails?.contact_person_country_code} {supplierDetails?.contact_person_mobile_no}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='buyer-details-card-section'>
                    <div className='buyer-details-uppar-card-section'>
                        <div className='buyer-details-uppar-card-inner-section'>
                            {
                                supplierDetails?.supplier_type === 'Medical Practitioner' && (
                                    <div className='buyer-details-card-container'>
                                        <div className='buyer-details-company-logo-heading'>Medical Practitioner Document</div>
                                        <div className='buyer-details-company-img-container'>
                                            {renderFiles(supplierDetails?.medical_certificate, 'medical_practitioner_image')}
                                        </div>
                                    </div>
                                )
                            }
                            {/* Trade License */}
                            <div className='buyer-details-card-container'>
                                <div className='buyer-details-company-logo-heading'>Trade License</div>
                                <div className='buyer-details-company-img-container'>
                                    {renderFiles(supplierDetails?.license_image, 'license_image')}
                                </div>
                            </div>
                            {/* Certificate */}
                            <div className='buyer-details-card-container'>
                                <div className='buyer-details-company-logo-heading'>Certificate</div>
                                <div className='buyer-details-company-img-container'>
                                    {renderFiles(
                                        supplierDetails?.certificateFileNDate?.length > 0
                                            ? supplierDetails?.certificateFileNDate
                                            : supplierDetails?.certificate_image,
                                        'certificate_image',
                                        supplierDetails?.certificateFileNDate?.length > 0
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
                        <div className='buyer-details-button-reject'
                            // onClick={handleRejectClick}
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
                        <SupplierCustomModal onClose={closeModal} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupplierRequestDetails;

