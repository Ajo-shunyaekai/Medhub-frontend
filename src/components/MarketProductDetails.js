import React, { useEffect, useState } from 'react';
import '../style/productDetails.css';
import para from '../assest/para.webp';
import CountryDetails from '../components/sections/CountryDetails';
import ProductDetailsCard from './ProductDetailsCard';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SupplierPurchaseInvoice from './pay/SupplierPurchaseInvoice';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SecondaryProductDetails from './SecondaryProductDetails';
import { postRequestWithToken } from '../api/Requests';


const MarketProductDetails = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate              = useNavigate();
    const { medicineId }        = useParams()

    const [details, setDetails]                           = useState()
    const [medId, setMedId]                               = useState(medicineId)
    const [supplierId, setSupplierId]                     = useState()
    const [medicineName, setMedicineName]                 = useState()
    const [newMedicineName, setNewMedicineName]           = useState()
    const [similarMedicinesList, setSimilarMedicinesList] = useState([])

    const [currentPage, setCurrentPage]   = useState(1);
    const [totalItems, setTotalitems]     = useState()
    const itemsPerPage = 2;

    const handleDownloadPDF = () => {
        const input = document.getElementById('invoice-section'); 

        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

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
        if (e.target.className === 'modal') {
            setShowModal(false);
        }
    };

    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        navigate("/buyer/login");
        return;
        }
        
        const obj = {
            medicine_id : medId,
            buyer_id    : buyerIdSessionStorage || buyerIdLocalStorage
        }
        
        postRequestWithToken('buyer/medicine/medicine-details', obj, async (response) => {
            if (response.code === 200) {
                setDetails(response.result?.data)
                setMedicineName(response.result?.data?.medicine_name)
                setSupplierId(response.result?.data?.supplier_id)
            } else {
               console.log('error in med details api');
            }
          })
    },[medId])

    useEffect(() => {
        const obj = {

            medicine_id   : medicineId, 
            supplier_id   : supplierId,
            medicine_type : 'secondary market',
            status : 1,
            pageNo: 1,
            pageSize: 3
            // medicine_name : medicineName
        }
        postRequestWithToken('buyer/medicine/other-medicine-list', obj, async (response) => {
            if (response.code === 200) {
                setSimilarMedicinesList(response?.result?.data)
                setTotalitems(response.result.totalItems)
            } else {
               console.log('error in similar-medicine-list api');
            }
          })
    },[medicineName,medId, currentPage])

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleMedicineClick = (newMedicineId, newMedicine) => {
        setMedId(newMedicineId)
        setNewMedicineName(newMedicine)
        navigate(`/buyer/market-product-details/${newMedicineId}`);
    };

    return (
        <>
            <div className='main-product-details-container'>
                <div className="product-details-cover">
                    <div className='product-details-container-main'>
                        <div className="product-details-section-one">
                            <div className="product-details-sec-one-left">
                                <h4>
                                {details?.medicine_name} <span className='product-details-stength'> ({details?.strength})</span>
                                </h4>
                                <p className="font-semibold text-[12px] leading-[21px] md:text-[16px] md:leading-[28px] text-gray-700 m-0">
                                    {details?.composition}
                                </p>
                            </div>
                            {/* <div className="product-details-sec-one-right">
                                <button className='product-details-send-btn'>Send Inquiry</button>
                            </div> */}
                        </div>
                    </div>

                    <div className="product-details-wrapper">
                        <div className='product-details-container'>
                            <div className="product-details-section-two">
                                <div className="product-details-sec-two-left">
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Purchased on :</div>
                                        <div className='product-details-two-right-text'>{details?.purchased_on}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Country available in :</div>
                                        <div className='product-details-two-right-text'>{details?.country_available_in?.join(', ')}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Total Quantity :</div>
                                        <div className='product-details-two-right-text'>{details?.total_quantity}</div>
                                    </div>
                                </div>
                                <div className="product-details-sec-two-left">
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Unit price :</div>
                                        <div className='product-details-two-right-text'>{details?.unit_price}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Minimum purchase :</div>
                                        <div className='product-details-two-right-text'>{details?.min_purchase_unit} Unit</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Condition :</div>
                                        <div className='product-details-two-right-text'>{details?.condition}</div>
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
                                        <div className='product-details-two-right-text'>{details?.shipping_time}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Dossier type :</div>
                                        <div className='product-details-two-right-text'>{details?.dossier_type}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Dossier status :</div>
                                        <div className='product-details-two-right-text'>{details?.dossier_status}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Type of form :</div>
                                        <div className='product-details-two-right-text'>{details?.type_of_form}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Stocked in :</div>
                                        <div className='product-details-two-right-text'>{details?.stocked_in}</div>
                                    </div>
                                </div>
                                <div className="product-details-sec-two-left">
                                <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Product category :</div>
                                        <div className='product-details-two-right-text'>{details?.medicine_category}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Shelf life :</div>
                                        <div className='product-details-two-right-text'>{details?.shelf_life}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Country of origin :</div>
                                        <div className='product-details-two-right-text'>{details?.country_of_origin}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>GMP approvals :</div>
                                        <div className='product-details-two-right-text'>{details?.gmp_approvals}</div>
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
                                         {details?.medicine_image?.map((image, j) => (
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
                                    <div className='product-details-four-right-text'> <CountryDetails countryData = {details?.registered_in}/></div>
                                </div>
                                <div className="product-details-county">
                                    <div className='product-details-four-left-text'>Tags :</div>
                                    <div className='product-details-four-right-text'>{details?.tags?.join(', ')}</div>
                                </div>
                                <div className="product-details-county">
                                    <div className='product-details-four-left-text'>Available for :</div>
                                    <div className='product-details-four-right-text'>{details?.available_for}</div>
                                </div>
                                <div className="product-details-county">
                                    <div className='product-details-four-left-text'>Comments :</div>
                                    <div className='product-details-four-right-text'>
                                       {details?.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='product-details-containers'>
                            <div className="product-details-mfg-container">
                                <div className="product-details-mfg-heading">About Supplier #{details?.supplier?.supplier_id}</div>
                                <div className="product-details-mfg-details">{details?.supplier?.description}</div>
                            </div>
                        </div>
                        <div className='product-details-company-section'>
                            <div className='product-details-company-conatiner'>
                                <div className='product-details-inner-company'>
                                    <Link to='/buyer/supplier-details'>
                                        <div className='product-details-inner-copmany-head'>Supplier name :</div>
                                        <div className='product-details-inner-copmany-text'>{details?.supplier?.supplier_name}</div>
                                    </Link>
                                </div>
                                <div className='product-details-inner-company'>
                                    <div className='product-details-inner-copmany-head'>License no. :</div>
                                    <div className='product-details-inner-copmany-text'>{details?.supplier?.license_no}</div>
                                </div>
                                
                            </div>
                            <div className='product-details-company-conatiner'>
                            <div className='product-details-inner-company'>
                                    <div className='product-details-inner-copmany-head'>Address :</div>
                                    <div className='product-details-inner-copmany-text'>{details?.supplier?.supplier_address}</div>
                                </div>
                                <div className='product-details-inner-company'>
                                    <div className='product-details-inner-copmany-head'>Payment terms :</div>
                                    <div className='product-details-inner-copmany-text'>{details?.supplier?.payment_terms}</div>
                                </div>
                            </div>
                        </div>
                        <div className='product-details-main-button-section'>
                            <div className='product-details-cancel-button'>Cancel</div>
                              <Link to='/buyer/send-inquiry'>
                            <div className='product-details-list-button'>Add to List</div>
                            </Link>
                        </div>
                        {/* start the ecommerce card */}
                        <div className='product-details-card-container'>
                            {/* <ProductDetailsCard /> */}
                            <SecondaryProductDetails 
                                similarMedicines = {similarMedicinesList}
                                onMedicineClick={handleMedicineClick} 
                                totalItems = {totalItems}
                                currentPage = {currentPage}
                                itemsPerPage = {itemsPerPage}
                                handlePageChange = {handlePageChange}
                            />
                        </div>
                        {/* end the ecommerce card */}
                    </div>
                </div>
                {showModal && (
                <div className="market-modal" onClick={closeModal}>
                    <div className="market-modal-content">
                        <span className="market-close" onClick={toggleModal}>&times;</span>
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

export default MarketProductDetails;
