import React, { useEffect, useState } from 'react';
import '../style/searchdetails.css';
import Search from '../assest/Buy/search-icon.svg'
import SearchDetailsCard from './SearchDetailsCard';
import SearchFilterSection from './SearchFilterSection';
import { useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';
import { apiRequests } from '../api';
// import Search from '../assest/Buy/search-icon.svg';

const SearchsearchDetails = () => {
    const { medicineId } = useParams()
    const navigate       = useNavigate();

    const [details, setDetails]                           = useState()
    const [medId, setMedId]                               = useState(medicineId)
    const [supplierId, setSupplierId]                     = useState()
    const [medicineName, setMedicineName]                 = useState()
    const [similarMedicinesList, setSimilarMedicinesList] = useState([])
    const [countryAvailableIn, setCountryAvailableIn]     = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalitems]   = useState()
    const itemsPerPage = 2;

    //filter state variables
    const [priceRange, setPriceRange]       = useState([])
    const [deliveryTime, setDeliveryTime]   = useState([])
    const [stockedIn, setStockedIn]         = useState([])
    const [totalQuantity, setTotalQuantity] = useState([])
    const [reset, setReset]                 = useState()
    //searchkey
    const [inputValue, setInputValue] = useState('')
    const [searchKey, setSearchKey]   = useState(null)

    const handleInputChange = (e) => {
        const input = e.target.value;
        // if(input.length <= 10) {
            setInputValue(e.target.value)

        if (e.target.value === '') {
            setSearchKey('');
        }
        // }
        
    }

    const handleProductSearch = () => {
        setSearchKey(inputValue)
        setCurrentPage(1)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleProductSearch();
        }
    };

    const handleReset = () => {
        setPriceRange([])
        setDeliveryTime([])
        setStockedIn([])
        setTotalQuantity([])
    }

    useEffect(() => {
        const fetchData = async () => {
            const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
            const buyerIdLocalStorage = localStorage.getItem("buyer_id");

            if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
                navigate("/buyer/login");
                return;
            }

            const obj = {
                medicine_id: medId,
                buyer_id: buyerIdSessionStorage || buyerIdLocalStorage
            }

            // postRequestWithToken('buyer/medicine/medicine-details', obj, async (response) => {
            //     if (response.code === 200) {
            //         setDetails(response?.result?.data)
            //         setCountryAvailableIn(response?.result?.countryAvailable)
            //         setMedicineName(response.result?.data?.medicine_name)
            //         setSupplierId(response.result?.supplier_id)
            //     } else {
            //         console.log('error in med details api');
            //     }
            // })
            try {
                // const response = await apiRequests.postRequest('medicine/get-specific-medicine-details', obj)
                // if(response?.code !== 200){
                //     return
                // }
                // setDetails(response?.result?.data)
                // setCountryAvailableIn(response?.result?.countryAvailable)
                // setMedicineName(response.result?.data?.medicine_name)
                // setSupplierId(response.result?.supplier_id)
                postRequestWithToken('medicine/get-specific-medicine-details', obj, async (response) => {
                    if (response.code === 200) {
                        setDetails(response?.result)
                        setCountryAvailableIn(response?.result?.countryAvailable)
                        setMedicineName(response.result?.medicine_name)
                        setSupplierId(response.result?.supplier_id)
                    } else {
                        console.log('error in med details api');
                    }
                })
            } catch (error) {
                console.log('error in medicine list api',error);
            }
        }
        fetchData()
    }, [medId])

    useEffect(() => {
        const obj = {
            medicine_id    : medicineId,
            medicine_type  : 'new',
            medicine_name  : medicineName,
            status         : 1,
            searchKey      : searchKey,
            price_range    : priceRange,
            delivery_time  : deliveryTime,
            in_stock       : stockedIn,
            quantity_range : totalQuantity,
            pageNo         : currentPage,
            pageSize       : itemsPerPage
            // supplier_id   : supplierId
        }
        postRequestWithToken('buyer/medicine/similar-medicine-list', obj, async (response) => {
            if (response.code === 200) {
                setSimilarMedicinesList(response.result)
                setTotalitems(response.result.totalItems)
            } else {
                console.log('error in similar-medicine-list api');
            }
        })
    }, [medicineName, medId, currentPage, priceRange, deliveryTime, stockedIn, totalQuantity, searchKey])

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
                                    {details?.medicine_name}
                                    <span className='search-details-stength'>
                                        {/* ({details?.strength}) */}
                                        ({details?.strength}{details?.strength && !details.strength.toLowerCase().includes('mg') && 'mg'})
                                    </span>
                                </h4>
                                <p class="font-semibold text-[12px] leading-[21px] md:text-[16px] md:leading-[28px] text-gray-700 m-0">
                                    {details?.composition}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* start the basic product details */}
                    <div className="search-details-wrapper">
                        <div className='search-details-container'>
                            <div className="search-details-section-two">
                                <div className="search-details-sec-two-left">
                                    <div className="search-details-two">
                                        <div className='search-details-two-left-text'>Product Category :</div>
                                        <div className='search-details-two-right-text'>{details?.medicine_category}</div>
                                    </div>
                                    <div className="search-details-two">
                                        <div className='search-details-two-left-text'>Dossier Type :</div>
                                        <div className='search-details-two-right-text'>{details?.dossier_type}</div>
                                    </div>
                                    <div className="search-details-two">
                                        <div className='search-details-two-left-text'>Dossier Status :</div>
                                        <div className='search-details-two-right-text'>{details?.dossier_status}</div>
                                    </div>
                                    <div className="search-details-two">
                                        <div className='search-details-two-left-text'>Country of Origin :</div>
                                        <div className='search-details-two-right-text'>{details?.country_of_origin}</div>
                                    </div>
                                </div>
                                <div className="search-details-sec-two-left">
                                    <div className="search-details-two">
                                        <div className='search-details-two-left-text'>Type of Form :</div>
                                        <div className='search-details-two-right-text'>{details?.type_of_form}</div>
                                    </div>
                                    <div className="search-details-two">
                                        <div className='search-details-two-left-text'>Shelf Life :</div>
                                        <div className='search-details-two-right-text'>{details?.shelf_life}</div>
                                    </div>
                                    <div className="search-details-two">
                                        <div className='search-details-two-left-text'>GMP Approvals :</div>
                                        <div className='search-details-two-right-text'>{details?.gmp_approvals}</div>
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
                        <div className='search-details-container'>
                            <div className="search-details-mfg-heading">Manufacturer Details</div>
                            <div className="search-details-section-two">
                                <div className="search-details-sec-two-left">
                                    <div className="search-details-two">
                                        <div className='search-details-two-left-text'>Name :</div>
                                        <div className='search-details-two-right-text'>{details?.manufacturer_name}</div>
                                    </div>
                                </div>
                                <div className="search-details-sec-two-left">
                                    <div className="search-details-two">
                                        <div className='search-details-two-left-text'>Country of Origin :</div>
                                        <div className='search-details-two-right-text'>{details?.manufacturer_country_of_origin}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='search-details-containers'>
                            <div className="search-details-mfg-container">
                                <div className="search-details-mfg-heading">About Manufacturer</div>
                                <div className="search-details-mfg-details">{details?.manufacturer_description}.</div>
                            </div>
                        </div>
                        {/* start the search container code */}
                        <div className='search-product-search-details'>
                            <div className='buy-seller-search-container'>
                                <input className='buy-seller-search-input' type='text'
                                    placeholder='Search Product'
                                    onChange={(e) => handleInputChange(e)}
                                    onKeyDown={handleKeyDown}
                                />
                                <div className='buy-seller-search' onClick={() => handleProductSearch()} >
                                    <img className='buy-seller-search-icon' src={Search} alt='img' />
                                    Search
                                </div>
                            </div>
                            
                            <div className='search-filter-section'>
                                <SearchFilterSection
                                    countryAvailable   = {countryAvailableIn}
                                    handlePriceRange   = {setPriceRange}
                                    handleDeliveryTime = {setDeliveryTime}
                                    handleStockedIn    = {setStockedIn}
                                    handleQuantity     = {setTotalQuantity}
                                    handleReset        = {handleReset}
                                />
                            </div>
                            {/* End the filter section */}
                            {/* start the ecommerce card */}
                            <div className='search-details-card-main-section-cont'>
                                <div className='search-details-card-containers-heading'>Suppliers List</div>
                                <div className='search-details-card-container'>
                                    <SearchDetailsCard
                                        similarMedicines = {similarMedicinesList}
                                        totalItems       = {totalItems}
                                        currentPage      = {currentPage}
                                        itemsPerPage     = {itemsPerPage}
                                        handlePageChange = {handlePageChange}
                                    />
                                </div>
                            </div>
                            {/* end the ecommerce card */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default SearchsearchDetails

