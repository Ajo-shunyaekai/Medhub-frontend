import React, { useEffect, useState } from 'react';
import '../../style/buy.css'
import { Link, useNavigate } from 'react-router-dom';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import Search from '../../assest/Buy/search-icon.svg'
import Verified from '../../assest/verified-icon.svg'
import { postRequestWithToken } from '../../api/Requests';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import Loader from '../Loader';
import { toast } from 'react-toastify';
import { apiRequests } from '../../api'

const BuySeller = ({active}) => {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true);
    const [openDropdown, setOpenDropdown]   = useState(null);
    const [supplierList, setSupplierList]   = useState([])
    const [inputValue, setInputValue]       = useState('');
    const [searchKey, setSearchKey]         = useState('')
    const [countryOrigin, setCountryOrigin] = useState()
    const [filterCountry, setFilterCountry] = useState('')

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems]   = useState()
    const itemsPerPage = 4

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value)

        if (e.target.value === '') {
            setSearchKey('');
        }
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

    const handleCountry = (country) => {
        setFilterCountry(country)
    }

    const toggleDropdown = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    useEffect(() => {
        const fetchData = async ()=>{
            try {
                const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
                const buyerIdLocalStorage   = localStorage.getItem("buyer_id");
        
                if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
                navigate("/buyer/login");
                return;
                }
        
                if(active === 'seller') {
                    const obj = {
                        buyer_id  : buyerIdSessionStorage || buyerIdLocalStorage,
                        searchKey : searchKey,
                        filterCountry,
                        pageNo : currentPage,
                        pageSize : itemsPerPage
                    }
        
                    // postRequestWithToken('buyer/supplier-list', obj, async (response) => {
                    //     if (response.code === 200) {
                    //         setSupplierList(response.result.suppliers)
                    //         setTotalItems(response.result.totalItems)
                    //     } else {
                    //         toast(response.message, {type:'error'})
                    //     console.log('error in supplier list api',response);
                    //     }
                    //     setLoading(false);
                    // })

                   
                    // const response = await apiRequests.postRequest(`supplier/get-all-suppliers-list`, obj);
                    // if (response?.code !== 200) {
                    //     toast(response.message, {type:'error'})
                    //     console.log('error in supplier list api',response);
                    //     return;
                    // }

                    // setSupplierList(response.result.data)
                    // setTotalItems(response.result.totalItems)
                    postRequestWithToken('supplier/get-all-suppliers-list', obj, async (response) => {
                        if (response.code == 200) {
                            setSupplierList(response.result.data)
                            setTotalItems(response.result.totalItems)
                        } else {
                            toast(response.message, {type:'error'})
                        console.log('error in supplier list api',response);
                        }
                    })
                    
                }
            } catch (error) {
                console.log(`Error : ${error}`)
            } finally{
                setLoading(false);
            }
        }
        fetchData()
    },[searchKey, filterCountry, currentPage])

    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        navigate("/buyer/login");
        return;
        }

        const obj = {
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
            
        }
        postRequestWithToken('buyer/supplier/get-filter-values', obj, async (response) => {
            if (response.code === 200) {
                setCountryOrigin(response.result[0].country)
            } else {
               console.log('error in get filter values api',response);
            }
          })
    },[])

    return (
        <>
            {loading ? (
                     <Loader />
                ) : (
                    <>
            {/* start the search container code */}
            <div className='buy-seller-search-container'>
                <input className='buy-seller-search-input' type='text' placeholder='Search Seller' 
                onChange={(e) => handleInputChange(e)}
                onKeyDown={handleKeyDown}
                />
                <div className='buy-seller-search' onClick={() => handleProductSearch() }>
                    <img className='buy-seller-search-icon' src={Search} />
                    Search
                </div>
            </div>
            {/* start the filter section code */}
            <div className='buy-seller-filter-container'>
                <ul className='buy-seller-filter-ul'>
                    <li className='buy-seller-filter-drop' onClick={() => toggleDropdown('form')}>
                        Form {openDropdown === 'form' ? <FaAngleUp /> : <FaAngleDown />}
                        {openDropdown === 'form' && (
                            <ul className='buy-seller-inner-dropdown'>
                                <li>Option 1</li>
                                <li>Option 2</li>
                            </ul>
                        )}
                    </li>
                    <li className='buy-seller-filter-drop' onClick={() => toggleDropdown('recommendedUse')}>
                        Recommended Use {openDropdown === 'recommendedUse' ? <FaAngleUp /> : <FaAngleDown />}
                        {openDropdown === 'recommendedUse' && (
                            <ul className='buy-seller-inner-dropdown'>
                                <li>Option A</li>
                                <li>Option B</li>
                            </ul>
                        )}
                    </li>
                    <li className='buy-seller-filter-drop' onClick={() => toggleDropdown('countryOfOrigin')}>
                        Country of Origin {openDropdown === 'countryOfOrigin' ? <FaAngleUp /> : <FaAngleDown />}
                        {openDropdown === 'countryOfOrigin' && (
                            <ul className='buy-seller-inner-dropdown'>
                                {/* <li>Country 1</li>
                                <li>Country 2</li> */}
                                {countryOrigin?.map((country, i) => (
                                  <li key={i} onClick={() => handleCountry(country)}>{country}</li>
                                ))}  
                            </ul>
                        )}
                    </li>
                    <li className='buy-seller-filter-drop' onClick={() => toggleDropdown('gmpApprovals')}>
                        GMP Approvals {openDropdown === 'gmpApprovals' ? <FaAngleUp /> : <FaAngleDown />}
                        {openDropdown === 'gmpApprovals' && (
                            <ul className='buy-seller-inner-dropdown'>
                                <li>GMP Approved</li>
                                <li>Not GMP Approved</li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
            {/* start the card section code */}
            <div className='buy-seller-company-card-section'>
                 
                 {
                    supplierList && supplierList.length > 0 ? (
                    supplierList?.map((supplier,i) => {
                        return (
                        <div className='buy-seller-company-cards'>
                        <div className='buy-seller-company-container'>
                            <div className='buy-seller-copmany-contents'>
                                <div className='buy-seller-copmany-name'>{supplier.supplier_name}</div>
                                <div className='buy-seller-company-name-text'>
                                <img src={Verified} className='buy-seller-name-images' />
                                Verified
                                </div>
                            </div>
                            <div className='buy-seller-copmany-img'>
                                {/* <img src={card1} /> */}
                                <img src={`${process.env.REACT_APP_SERVER_URL}uploads/supplier/supplierImage_files/${supplier.supplier_image[0]}`} />
                            </div>
                        </div>
                        <div className='buy-seller-company-content-section'>
                            <div className='buy-seller-company-country-name'>Tax No.</div>
                            <div className='buy-seller-company-counrty-flag'>{supplier.tax_no || 'TX0324234'}</div>
                        </div>
                        <div className='buy-seller-company-content-section'>
                            <div className='buy-seller-company-country-name'>Country of Origin</div>
                            <div className='buy-seller-company-counrty-flag'>{supplier.country_of_origin}</div>
                        </div>
                        <div className='buy-seller-company-description'>
                            <div className='buy-seller-company-description-text'>Description</div>
                            <div className='buy-seller-company-short-description'>
                                {/* {supplier.description} */}
                                {supplier.description ? 
                                    (supplier.description.length > 20 ? 
                                        `${supplier.description.substring(0, 60)}...` : 
                                        supplier.description) : 
                                    'No description available'}
                            </div>
                        </div>
                        <Link to={`/buyer/supplier-details/${supplier.supplier_id}`}>
                            <div className='buy-seller-company-card-button'>
                                <div className='buy-seller-company-view'> View Details</div>
                                {/* <img className='buy-seller-copmany-arrowcard' src={ArrowCard} /> */}
                            </div>
                        </Link>
                        </div >
                        )
                        
                    })
                    ) : 'No data found'
                }

            </div>

            <div className='buy-seller-pagination-container'>
                <div className='pagi-container'>
                    <Pagination
                        activePage={currentPage}
                        itemsCountPerPage={itemsPerPage}
                        totalItemsCount={totalItems}
                        pageRangeDisplayed={5}
                        onChange={handlePageChange}
                        itemClass="page-item"
                        linkClass="page-link"
                        prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                            nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                        hideFirstLastPages={true}
                    />
                    <div className='pagi-total'>
                        Total Items: {totalItems}
                    </div>
                </div>
            </div>
            </>
        )}
        </>
    )
}

export default BuySeller