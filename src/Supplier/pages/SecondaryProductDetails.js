import React, { useEffect, useState } from 'react';
import '../style/productDetails.css';
import para from '../assest/para.webp';
import CountryDetails from '../pages/CountryDetails';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SupplierPurchaseInvoice from './invoice/SupplierPurchaseInvoice';
import { Link, useParams } from 'react-router-dom';
import { postRequest } from '../api/Requests';

const SecondaryProductDetails = () => {
    const [showModal, setShowModal] = useState(false);

    const { medicineId } = useParams()

    const [medicineDetails, setMedicineDetails] = useState()
    const [medId, setMedId] = useState(medicineId)

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
        // const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
        // const supplierIdLocalStorage   = localStorage.getItem("supplier_id");

        // if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
        // navigate("/supplier/login");
        // return;
        // }
        
        const obj = {
            medicine_id : medId,
            // buyer_id    :supplierIdSessionStorage || supplierIdLocalStorage 
        }
        
        postRequest('buyer/medicine/medicine-details', obj, async (response) => {
            if (response.code === 200) {
                setMedicineDetails(response?.result?.data)
            } else {
               console.log('error in med details api');
            }
          })
    },[])

   
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
                                <p className="font-semibold text-[12px] leading-[21px] md:text-[16px] md:leading-[28px] text-gray-700 m-0">
                                {medicineDetails?.composition}
                                </p>
                            </div>
                          <Link to={`/supplier/edit-secondary-product/${medicineDetails?.medicine_id}`}>
                            <div className="product-details-sec-one-right">
                                <button className='product-details-send-btn'>Edit</button>
                            </div>
                            </Link>
                            
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
                                        <div className='product-details-two-left-text'>Country available in :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.country_available_in?.join(', ')}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Total quantity :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.total_quantity}</div>
                                    </div>
                                </div>
                                <div className="product-details-sec-two-left">
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Unit price :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.unit_price}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Minimum purchase :</div>
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
                                        <div className='product-details-two-left-text'>Shipping time :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.shipping_time}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Dossier type :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.dossier_type}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Dossier status :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.dossier_status}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Type of form :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.type_of_form}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Stocked in :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.stocked_in?.join(', ')}</div>
                                    </div>
                                </div>
                                <div className="product-details-sec-two-left">
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Product category :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.medicine_category}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Shelf life :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.shelf_life}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Country of origin :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.country_of_origin}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>GMP approvals :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.gmp_approvals}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Unit tax :</div>
                                        <div className='product-details-two-right-text'>5%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='product-details-container'>
                            {/* <div className="product-details-section-two-img">
                                <div className="product-details-sec-img-left">
                                    <img src={para} alt="" className="responsive-image" />
                                </div>
                                <div className="product-details-sec-img-left">
                                    <img src={para} alt="" className="responsive-image" />
                                </div>
                                <div className="product-details-sec-img-left">
                                    <img src={para} alt="" className="responsive-image" />
                                </div>
                                <div className="product-details-sec-img-left">
                                    <img src={para} alt="" className="responsive-image" />
                                </div>
                            </div> */}
                            <div className="product-details-section-two-img"> 
                                        {medicineDetails?.medicine_image?.map((image, j) => (
                                            <div className="product-details-sec-img-left" key={j}>
                                                <img src={`${process.env.REACT_APP_SERVER_URL}uploads/medicine/product_files/${image}`} alt={`${image.medicine_name} ${j}`} className="responsive-image" />
                                            </div>
                                
                                        ))}
                                 </div>
                        </div>
                        <div className='product-details-container'>
                            <div className="product-details-country-section">
                                <div className="product-details-county">
                                    <div className='product-details-four-left-text'>Registered in :</div>
                                    <div className='product-details-four-right-text'> <CountryDetails countryData = {medicineDetails?.registered_in}/></div>
                                </div>
                                <div className="product-details-county">
                                    <div className='product-details-four-left-text'>Tags :</div>
                                    <div className='product-details-four-right-text'>{medicineDetails?.tags}</div>
                                </div>
                                <div className="product-details-county">
                                    <div className='product-details-four-left-text'>Available for :</div>
                                    <div className='product-details-four-right-text'>{medicineDetails?.available_for}</div>
                                </div>
                                <div className="product-details-county">
                                    <div className='product-details-four-left-text'>Comments :</div>
                                    <div className='product-details-four-right-text'>
                                       {medicineDetails?.description}
                                    </div>
                                </div>
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
                                <div className="product-details-mfg-heading">Manufacturer Description</div>
                                <div className="product-details-mfg-details">{medicineDetails?.supplier?.description}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {showModal && (
                    <div className="market-modal">
                        <div className="market-modal-content">
                            <span className="market-close" onClick={closeModal}>&times;</span>
                            <div id="invoice-section">
                                <SupplierPurchaseInvoice />
                            </div>
                            <div className='invoice-download-button-container'>
                                <button id="invoice-download-button" onClick={handleDownloadPDF}>Download Invoice</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default SecondaryProductDetails;
