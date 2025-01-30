import React, { useEffect, useState } from 'react';
import '../../assest/style/productDetails.css'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { postRequest, postRequestWithToken } from '../../api/Requests';
import SecondaryCountryDetails from './SecondaryCountryDetails';
import { toast } from 'react-toastify';


const EditUpdateSecondaryDetails = ({socket}) => {
    const [showModal, setShowModal] = useState(false);

    const { medicineId } = useParams()
    const navigate    = useNavigate()
    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage   = localStorage.getItem("admin_id");

    const [medicineDetails, setMedicineDetails] = useState()
    const [medId, setMedId] = useState(medicineId)
    const [invoiceImage, setInvoiceImage] = useState([])

    const [loading, setLoading]             = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false)

    const handleDownloadPDF = () => {
        const input = document.getElementById('invoice-section');

        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('invoice.pdf');
            })
            .catch((error) => {
                console.error('Error generating PDF', error);
            });
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const closeModal = (e) => {
        if (e.target.classList.contains('market-close')) {
            setShowModal(false);
        }
    };

    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
            return;
        }

        const obj = {
            medicine_id : medicineId,
            admin_id    : adminIdSessionStorage || adminIdLocalStorage ,
            // buyer_id    :supplierIdSessionStorage || supplierIdLocalStorage 
        }

        postRequestWithToken('admin/get-edit-medicine_details', obj, async (response) => {
            if (response.code === 200) {
                setMedicineDetails(response?.result)
                setInvoiceImage(response?.result?.invoice_image[0])
            } else {
                console.log('error in med details api');
            }
        })
    }, [])

    const handleAcceptReject = (action) => {
        const obj = {
            admin_id               : adminIdSessionStorage || adminIdLocalStorage ,
            medicine_id            : medicineId ,
            supplier_id            : medicineDetails?.supplier.supplier_id,
            supplier_email         : medicineDetails?.supplier.supplier_email,
            supplier_name          : medicineDetails?.supplier.supplier_name,
            supplier_contact_email : medicineDetails?.supplier.contact_person_email,
            action
        }

        if(action === 'accept') {
            setLoading(true)
        } else if(action === 'reject') {
            setRejectLoading(true)
        }

        postRequestWithToken('admin/accept-reject-edit-medicine', obj, async (response) => {
            if (response.code === 200) {
                toast(response.message, {type: 'success'})
                setLoading(false);
                setRejectLoading(false);

                let message 
                if(action === 'accept') {
                    message = 'Your listing has been approved!'
                } else if(action === 'reject') {
                    message = 'Your listing has been disapproved!'
                }
                socket.emit('updateMedicineEditRequest', {
                    supplierId : medicineDetails?.supplier.supplier_id,
                    message    : message,
                    link       : process.env.REACT_APP_PUBLIC_URL
                });
                setTimeout(() => {
                    navigate('/admin/product-update-requests/secondary')
                },500)
            } else {
                setLoading(false);
                setRejectLoading(false);
               console.log('error in accept-reject-supplier api',response);
               toast(response.message, {type: 'error'})
            }
        })
    }

    return (
        <>
            {console.log("showModal state:", showModal)}
            <div className='main-product-details-container'>
                <div className="product-details-cover">
                    <div className='product-details-container-main'>
                        <div className="product-details-section-one">
                            <div className="product-details-sec-one-left">
                                <h4>
                                    {medicineDetails?.medicine_name} <span className='product-details-stength'> ({medicineDetails?.strength || '50mg'})</span>
                                </h4>
                                {/* <p className="font-semibold text-[12px] leading-[21px] md:text-[16px] md:leading-[28px] text-gray-700 m-0">
                                    {medicineDetails?.composition}
                                </p> */}
                            </div>
                            <div className="product-details-sec-one-right">
                                {/* <button className='product-details-send-btn'>Accept</button> */}
                                <div 
                                className='buyer-details-button-reject' 
                                onClick={() => {handleAcceptReject('reject')}}
                                disabled={rejectLoading}
                                >
                                        {rejectLoading ? (
                                        <div className='loading-spinner'></div> 
                                    ) : (
                                        'Reject'
                                    )}
                                </div>
                                <div 
                                className='buyer-details-button-accept' 
                                onClick={() => {handleAcceptReject('accept')}}
                                disabled={loading}
                               >
                                         {loading ? (
                                         <div className='loading-spinner'></div> 
                                     ) : (
                                         'Accept'
                                     )}
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="product-details-wrapper">
                        <div className='product-details-container'>
                            <div className="product-details-section-two">
                                <div className="product-details-sec-two-left">
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Purchased on :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.purchased_on}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Country Available in :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.country_available_in?.join(', ')}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Total Quantity :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.total_quantity}</div>
                                    </div>
                                </div>
                                <div className="product-details-sec-two-left">
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Unit Price :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.unit_price || '5'} USD</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Minimum Purchase :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.min_purchase_unit}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Condition :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.condition}</div>
                                    </div>
                                </div>
                                <div className="product-details-sec-two-button-cont">
                                    <div className='product-details-view-button-invoice' onClick={toggleModal}>
                                        <span className='view-purchase-invoice-button-sec'>View Purchase Invoice</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='product-details-container'>
                            <div className="product-details-section-two">
                                <div className="product-details-sec-two-left">
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Shipping Time :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.shipping_time}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Dossier Type :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.dossier_type}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Dossier Status :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.dossier_status}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Type of Form :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.type_of_form}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Tax% :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.unit_tax}%</div>
                                    </div>
                                </div>
                                <div className="product-details-sec-two-left">
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Product Category :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.medicine_category}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Shelf Life :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.shelf_life} Months</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Country of Origin :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.country_of_origin}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>GMP Approvals :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.gmp_approvals}</div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* start the stocked on container */}
                        <div className='product-details-container'>
                            <div className="product-details-stockedin-section-main-container">
                                <div className='product-stockedin-head'>Stocked In</div>
                                <div className='product-stockedin-head-section'>
                                    <div className='product-stockedin-head-country'>Countries</div>
                                    <div className='product-stockedin-head-country'>Quantity</div>
                                </div>
                                {medicineDetails?.stockedIn_details?.map((item, index) => (
                                    <div className='product-stockedin-head-section' key={index}>
                                        <div className='product-stockedin-head-country-name'>
                                            {item.stocked_in_country}
                                        </div>
                                        <div className='product-stockedin-head-qty-name'>
                                            {item.stocked_quantity} {item.stocked_in_type}
                                        </div>
                                    </div>
                                ))}


                            </div>
                        </div>
                        {/* end the stocked on container */}
                        <div className='product-details-container'>
                            <div className="product-details-section-two-img">
                                {medicineDetails?.medicine_image?.map((image, j) => (
                                    <div className="product-details-sec-img-left" key={j}>
                                        <img src={`${process.env.REACT_APP_SERVER_URL}uploads/medicine/product_files/${image}`} alt={`${image.medicine_name} ${j}`} className="responsive-image" />
                                    </div>

                                ))}
                            </div>
                        </div>

                        <div className='product-details-container'>
                            <div className="product-range-container">
                                <div className="product-range-heading">Quantity</div>
                                <div className="product-range-heading">Unit Price</div>
                                {/* <div className="product-range-heading">Total Price</div> */}
                                <div className="product-range-heading">Est. Delivery Time</div>
                            </div>

                            {
                                medicineDetails?.inventory_info?.map((info, k) => {
                                    return (
                                        <div className="product-range-details">
                                            <div className="product-range-text"> <input className="product-range-input" type=" text"
                                                value={info?.quantity}
                                            /> </div>
                                            <div className="product-range-text"><input className="product-range-input" type="text"
                                                // value={info?.unit_price}
                                                value={
                                                    info?.unit_price
                                                        ? info.unit_price.toLowerCase().includes('usd')
                                                            ? info.unit_price.replace(/usd/i, 'USD')
                                                            : `${info.unit_price} USD`
                                                        : ''
                                                }
                                            />
                                            </div>
                                            {/* <div className="product-range-text"><input className="product-range-input"
                                                type="text"
                                                value={
                                                    info?.total_price
                                                        ? info.total_price.toLowerCase().includes('usd')
                                                            ? info.total_price.replace(/usd/i, 'USD')
                                                            : `${info.total_price} USD`
                                                        : ''
                                                }
                                            />
                                            </div> */}
                                            <div className="product-range-text"> <input className="product-range-input" type="text"
                                                // value={info?.est_delivery_days} 
                                                value={
                                                    info?.est_delivery_days
                                                        ? info.est_delivery_days.toLowerCase().includes('days')
                                                            ? info.est_delivery_days.replace(/days/i, 'Days')
                                                            : `${info.est_delivery_days} Days`
                                                        : ''
                                                }
                                            />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>


                        <div className='product-details-container'>
                            <div className="product-details-country-section">
                                <div className="product-details-county">
                                    <div className='product-details-four-left-text'>Registered in :</div>
                                    <div className='product-details-four-right-text'> <SecondaryCountryDetails countryData={medicineDetails?.registered_in} /></div>
                                </div>
                                <div className="product-details-county">
                                    <div className='product-details-four-left-text'>Tags :</div>
                                    <div className='product-details-four-right-text'>{medicineDetails?.tags}</div>
                                </div>
                                <div className="product-details-county">
                                    <div className='product-details-four-left-text'>Available for :</div>
                                    <div className='product-details-four-right-text'>{medicineDetails?.available_for}</div>
                                </div>
                                {/* <div className="product-details-county">
                                    <div className='product-details-four-left-text'>Comments :</div>
                                    <div className='product-details-four-right-text'>
                                       {medicineDetails?.description}
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <div className='product-details-containers'>
                            <div className="product-details-mfg-container">
                                <div className="product-details-mfg-heading">Product Description</div>
                                <div className="product-details-mfg-details">{medicineDetails?.supplier?.description}</div>
                            </div>
                        </div>

                        {/* start the manufacturue details */}
                        <div className='product-details-container'>
                            <div className="product-details-section-two">
                                <div className="product-details-sec-two-left">
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Manufacturer Name :</div>
                                        <div className='product-details-two-right-text'>Medicine Pvt. Ltd.</div>
                                    </div>
                                </div>
                                <div className="product-details-sec-two-left">
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Country of Origin :</div>
                                        <div className='product-details-two-right-text'>India</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end the manufacturer details */}
                        <div className='product-details-containers'>
                            <div className="product-details-mfg-container">
                                <div className="product-details-mfg-heading">About Manufacturer</div>
                                <div className="product-details-mfg-details">{medicineDetails?.supplier?.description}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {showModal && (
                    <div className="market-modal">
                        <div className="market-modal-content">
                            <span className="market-close" onClick={closeModal}>&times;</span>
                            <div id="invoice-section" style={{ backgroundColor: 'transparent' }}>
                                <iframe
                                    // src={`${Invoice}#toolbar=0&navpanes=0&scrollbar=0`}
                                    src={`${process.env.REACT_APP_SERVER_URL}uploads/medicine/invoice_image/${invoiceImage}#toolbar=0&navpanes=0&scrollbar=0`}
                                    style={{ border: 'none' }}
                                    width="100%"
                                    height="500px"
                                    title="Invoice"
                                />
                            </div>
                            {/* <div className='invoice-download-button-container'>
                                <button id="invoice-download-button" onClick={handleDownloadPDF}>Download Invoice</button>
                            </div> */}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default EditUpdateSecondaryDetails;