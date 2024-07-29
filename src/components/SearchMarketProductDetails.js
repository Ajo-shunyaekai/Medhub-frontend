import React, { useEffect, useState } from 'react';
import '../style/searchdetails.css';
import SearchMarketDetailsCard from './SearchMarketDetailsCard';
import SearchFilterSection from './SearchFilterSection';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SupplierPurchaseInvoice from './pay/SupplierPurchaseInvoice'
import { useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';

const SearchMarketProductDetails = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate              = useNavigate();
    const { medicineId }        = useParams()

    const [details, setDetails]                           = useState()
    const [medId, setMedId]                               = useState(medicineId)
    const [supplierId, setSupplierId]                     = useState()
    const [medicineName, setMedicineName]                 = useState()
    const [newMedicineName, setNewMedicineName]           = useState()
    const [similarMedicinesList, setSimilarMedicinesList] = useState([])
    const [countryAvailableIn, setCountryAvailableIn]     = useState([])

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

    //filter state variables
    const [priceRange, setPriceRange]     = useState([])
    const [deliveryTime, setDeliveryTime] = useState([])
    const [stockedIn, setStockedIn]       = useState([])
    const [totalQuantity, setTotalQuantity] = useState([])
    const [reset, setReset] = useState()

    const handleReset = () => {
        setPriceRange([])
        setDeliveryTime([])
        setStockedIn([])
        setTotalQuantity([])
    }

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
                setDetails(response?.result?.data)
                setMedicineName(response?.result?.data?.medicine_name)
                setCountryAvailableIn(response?.result?.countryAvailable)
                setSupplierId(response.result?.supplier_id)
            } else {
               console.log('error in med details api');
            }
          })
    },[medId])

    useEffect(() => {
        const obj = {

            medicine_id   : medicineId, 
            medicine_type : 'secondary market',
            status : 1,
            // supplier_id   : supplierId,
            medicine_name : medicineName,
            price_range  : priceRange,
            delivery_time : deliveryTime,
            in_stock  :stockedIn,
            quantity_range : totalQuantity,
            pageNo: 1,
            pageSize: 3
            // medicine_name : medicineName
        }
        postRequestWithToken('buyer/medicine/similar-medicine-list', obj, async (response) => {
            if (response.code === 200) {
                setSimilarMedicinesList(response.result)
                setTotalitems(response.result.totalItems)
            } else {
               console.log('error in similar-medicine-list api');
            }
          })
    },[medicineName,medId, currentPage, priceRange, deliveryTime, stockedIn, totalQuantity])

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className='main-search-details-container'>
                <div className="search-details-cover">
                    <div className='search-details-container-main'>
                        <div className="search-details-section-one">
                            <div className="search-details-sec-one-left">
                                <h4 >
                                    {details?.medicine_name} <span className='search-details-stength'>(500mg)</span>
                                </h4>
                                <p class="font-semibold text-[12px] leading-[21px] md:text-[16px] md:leading-[28px] text-gray-700 m-0">
                                    {details?.composition}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* start the basic product details */}
                    <div className="search-details-wrapper">
                        <div className='product-details-container'>
                            <div className="product-details-section-two">
                                <div className="product-details-sec-two-left">
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Purchased on :</div>
                                        <div className='product-details-two-right-text'>{details?.purchased_on}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Product category :</div>
                                        <div className='product-details-two-right-text'>{details?.medicine_category}</div>
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
                                        <div className='product-details-two-left-text'>GMP approvals :</div>
                                        <div className='product-details-two-right-text'>{details?.gmp_approvals}</div>
                                    </div>
                                    {/* <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Country available in :</div>
                                        <div className='product-details-two-right-text'>UAE</div>
                                    </div> */}
                                  
                                </div>
                                <div className="product-details-sec-two-left">
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Country of origin :</div>
                                        <div className='product-details-two-right-text'>{details?.country_of_origin}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Type of form :</div>
                                        <div className='product-details-two-right-text'>{details?.type_of_form}</div>
                                    </div>
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Shelf life :</div>
                                        <div className='product-details-two-right-text'>{details?.shelf_life}</div>
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
                        {/* End the product basic details */}
                        {/* Start the description section */}
                        <div className='search-details-containers'>
                            <div className="search-details-mfg-container">
                                <div className="search-details-mfg-heading">Description</div>
                                <div className="search-details-mfg-details">{details?.description}</div>
                            </div>
                        </div>
                        {/* End the description section */}
                        {/* Start the filter section */}
                        <div className='search-filter-section'>
                            <SearchFilterSection 
                                countryAvailable = {countryAvailableIn}
                                handlePriceRange = {setPriceRange}
                                handleDeliveryTime = {setDeliveryTime}
                                handleStockedIn = {setStockedIn}
                                handleQuantity = {setTotalQuantity}
                                handleReset = {handleReset}
                            />
                        </div>
                        {/* End the filter section */}
                        {/* start the ecommerce card */}
                        <div className='search-details-card-container'>
                            <SearchMarketDetailsCard 
                                similarMedicines = {similarMedicinesList}
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
    )
}
export default SearchMarketProductDetails
