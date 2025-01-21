import React, { useEffect, useState } from 'react';
import '../ByProduct/buyproduct.css';
import { Link, useNavigate } from 'react-router-dom';
import Search from '../../../assest/images/Buy/search-icon.svg'
import Generics from '../../../assest/images/Buy/generics.svg'
import Orignals from '../../../assest/images/Buy/orignals.svg'
import Biosimilars from '../../../assest/images/Buy/biosimilars.svg'
import MedicalDevices from '../../../assest/images/Buy/medicaldevices.svg'
import Nutraceutical from '../../../assest/images/Buy/neutraceutical.svg'
import Arrow from '../../../assest/images/Buy/arrow.svg'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Pagination from 'react-js-pagination';
import { postRequestWithToken } from '../../../../api/Requests';
import Loader from '../../SharedComponents/Loader/Loader';
import { toast } from 'react-toastify';
import { apiRequests } from '../../../../api';

const Buy2ndMarket = ({active, filterCategory, setFilterCategory}) => {
    const navigate = useNavigate()
    
    const [loading, setLoading] = useState(true);
    const [medicineList, setMedicineList] = useState([])
    const [inputValue, setInputValue]     = useState('')
    const [searchKey, setSearchKey]       = useState(null)
    // const [filterCategory, setFilterCategory] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalitems] = useState()
    const itemsPerPage = 6;
    // const active = 'product';
 
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
 
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
 
    const handleCategoryFilter = (category) => {
        setFilterCategory(category)
    }
 
    useEffect(() => {
        const fetchData = async () => {
 
            const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
            const buyerIdLocalStorage   = localStorage.getItem("buyer_id");
    
            if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
            }
    
            const obj = {
                buyer_id: buyerIdSessionStorage|| buyerIdLocalStorage,
                medicine_type : 'secondary market',
                medicine_status :'accepted',
                category_name : filterCategory,
                searchKey: searchKey,
                pageNo : currentPage, 
                pageSize : itemsPerPage
             }
    
            if(active === 'market') {
                postRequestWithToken('buyer/medicine/medicine-list', obj, async (response) => {
                    if (response.code === 200) {
                        setMedicineList(response.result.data)
                        setTotalitems(response.result.totalItems)
                    } else {
                        toast(response.message, {type:'error'})
                       console.log('error in medicine list api',response);
                    }
                    setLoading(false);
                })
                try {
                    const response = await apiRequests.getRequest(`medicine/get-all-medicines-list?pageNo=${currentPage}&pageSize=${itemsPerPage}&medicine_type=${'secondary market'}&medicine_status=${'accepted'}&searchKey=${searchKey}&category_name=${filterCategory}`)
                    if(response?.code !== 200){
                    return
                    }
                    setMedicineList(response.result.data)
                    setTotalitems(response.result.totalItems)
                    // postRequestWithToken(`medicine/get-all-medicines-list?pageNo=${currentPage}&pageSize=${itemsPerPage}&medicine_type=${'secondary market'}&medicine_status=${'accepted'}&searchKey=${searchKey}&category_name=${filterCategory}`, obj, async (response) => {
                    //     if (response.code === 200) {
                    //         setMedicineList(response.result.data)
                    //         setTotalitems(response.result.totalItems)
                    //     } else {
                    //         toast(response.message, {type:'error'})
                    //         console.log('error in medicine list api',response);
                    //     }
                    // })
                } catch (error) {
                      console.log('error in medicine list api',error);
                } finally{
                  setLoading(false);
                }
            }
        }
        fetchData()
    },[searchKey, currentPage, filterCategory])
   
    return (
        <>
        {loading ? (
                     <Loader />
                ) : (
            <div className='byproduct-product-main-section-container'>
            <div className='byproduct-seller-main-heading'>Lorem Ipsum is simply dummy text</div>
                <div className='byproduct-seller-pharma-card'>
                    <div className='byproduct-seller-card' onClick={() => handleCategoryFilter('Generics')}>
                        <div className='byproduct-seller-card-img'>
                            <img className='byproduct-seller-img-one' src={Generics} />
                        </div>
                        <div className='byproduct-seller-card-head'>Generics</div>
                        <div className='byproduct-seller-card-content'>Lorem ipsum is placeholder text
                            commonly used in the graphic,</div>
                        <div className='byproduct-seller-arrow-img'>
                            <img src={Arrow} />
                        </div>
                    </div>
                    <div className='byproduct-seller-card' onClick={() => handleCategoryFilter('Originals')}>
                        <div className='byproduct-seller-card-img'>
                            <img className='byproduct-seller-img-two' src={Orignals} />
                        </div>
                        <div className='byproduct-seller-card-head'>Originals</div>
                        <div className='byproduct-seller-card-content'>Lorem ipsum is placeholder text
                            commonly used in the graphic,</div>
                        <div className='byproduct-seller-arrow-img'>
                            <img src={Arrow} />
                        </div>
                    </div>
                    <div className='byproduct-seller-card' onClick={() => handleCategoryFilter('Biosimilars')}>
                        <div className='byproduct-seller-card-img'>
                            <img className='byproduct-seller-img-three' src={Biosimilars} />
                        </div>
                        <div className='byproduct-seller-card-head'>Biosimilars</div>
                        <div className='byproduct-seller-card-content'>Lorem ipsum is placeholder text
                            commonly used in the graphic,</div>
                        <div className='byproduct-seller-arrow-img'>
                            <img src={Arrow} />
                        </div>
                    </div>
                    <div className='byproduct-seller-card' onClick={() => handleCategoryFilter('Medical Devices')}>
                        <div className='byproduct-seller-card-img'>
                            <img className='byproduct-seller-img-four' src={MedicalDevices} />
                        </div>
                        <div className='byproduct-seller-card-head'>Medical Devices</div>
                        <div className='byproduct-seller-card-content'>Lorem ipsum is placeholder text
                            commonly used in the graphic,</div>
                        <div className='byproduct-seller-arrow-img'>
                            <img src={Arrow} />
                        </div>
                    </div>
                    <div className='byproduct-seller-card' onClick={() => handleCategoryFilter('Nutraceutical')}>
                        <div className='byproduct-seller-card-img'>
                            <img className='byproduct-seller-img-five' src={Nutraceutical} />
                        </div>
                        <div className='byproduct-seller-card-head'>Nutraceutical</div>
                        <div className='byproduct-seller-card-content'>Lorem ipsum is placeholder text
                            commonly used in the graphic,</div>
                        <div className='byproduct-seller-arrow-img'>
                            <img src={Arrow} />
                        </div>
                    </div>
                </div>
                <div className='byproduct-seller-search-container'>
                    <input className='byproduct-seller-search-input' type='text' placeholder='Search Product'
                    onChange={(e) => handleInputChange(e)}
                    onKeyDown={handleKeyDown}
                     />
                    <div className='byproduct-seller-search' onClick={() => handleProductSearch() }>
                        <img className='byproduct-seller-search-icon' src={Search} />
                        Search
                    </div>
                </div>
                <div className='byproduct-product-main-container'>
                     {  
                       medicineList && medicineList.length > 0 ? (
                        medicineList?.map((medicine, i) => {
                            console.log('medicine',medicine);
                            const firstImage = Array.isArray(medicine?.medicine_image) ? medicine.medicine_image[0] : null;
                            return (
                                <div className='byproduct-product-card-section'>
                                <div className='byproduct-product-card-first-section-right'>
                                    <div className='byproduct-product-card-first-medicine-image'>
                                        <img  src={`${process.env.REACT_APP_SERVER_URL}uploads/medicine/product_files/${firstImage}`}  alt="Medicine" /> 
                                    </div>
                                    <div className='byproduct-product-card-first-button-container'>
                                        <Link to={`/buyer/Search-Market-Product-Details/${medicine.medicine_id}`}>
                                            <div className='byproduct-product-card-first-send-button'>
                                                View Details
                                            </div>
                                        </Link>
                                    </div>
                                </div>
        
                                <div className='byproduct-product-card-first-section'>
                                    <div className='byproduct-product-card-first-left'>
                                        <div className='byproduct-product-card-first-copmany-name'>{medicine.medicine_name}</div>
                                        <div className='byproduct-product-card-first-copmany-description'>{medicine.strength.includes('mg') ? medicine.strength : `${medicine.strength}mg` }</div>
                                    </div>
                                    <div className='byproduct-product-card-second-section'>
                                        <div className='byproduct-product-card-second-head'>Country of Origin</div>
                                        <div className='byproduct-product-card-second-text'>{medicine.country_of_origin}</div>
                                    </div>
                                    <div className='byproduct-product-card-second-section'>
                                        <div className='byproduct-product-card-second-head'>Stocked in</div>
                                        <div className='byproduct-product-card-second-text'>{medicine.stocked_in?.join(', ')}</div>
                                    </div>
                                    <div className='byproduct-product-card-second-section'>
                                        <div className='byproduct-product-card-second-head'>Dossier Type</div>
                                        <div className='byproduct-product-card-second-text'>{medicine.dossier_type}</div>
                                    </div>
                                    <div className='byproduct-product-card-second-section'>
                                        <div className='byproduct-product-card-second-head'>Dossier Status</div>
                                        <div className='byproduct-product-card-second-text'>{medicine.dossier_status}</div>
                                    </div>
                                    <div className='byproduct-product-card-second-section'>
                                        <div className='byproduct-product-card-second-head'>GMP Approvals</div>
                                        <div className='byproduct-product-card-second-text'>{medicine.gmp_approvals}</div>
                                    </div>
        
                                </div>
                            </div>
                            )
                        })
                       ) : 'not data found'
                    }


                </div>
                <div className='byproduct-product-pagination-section'>
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
            </div>
        )}
        </>
    );
}

export default Buy2ndMarket;
