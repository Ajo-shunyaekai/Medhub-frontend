import React, { useEffect, useState } from 'react';
import productDetails from '../style/productDetails.css';
import para from '../assest/para.webp'
import CountryDetails from '../components/sections/CountryDetails';
import ProductDetailsCard from './ProductDetailsCard';
import { Link, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';


const ProductDetails = () => {
    // const options = [
    //     { value: '0 to 500',   label: '0 to 500' },
    //     { value: '500 to 1000', label: '500 to 1000' },
    //     { value: '1000 to 2000', label: '1000 to 2000' },
    //     { value: '2000 to 5000', label: '2000 to 5000' }
    // ];
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

    const hasInventoryInfo = details && details?.inventory_info && details.inventory_info.length > 0;
  
    // Generate options array based on inventory_info
    const options = hasInventoryInfo ? details?.inventory_info.map((item, index) => ({
      value: index,
      label: item.quantity
    })) : [];
    
    // Use state to manage selected option and corresponding details
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [selectedDetails, setSelectedDetails] = useState(hasInventoryInfo ? details?.inventory_info[0] : {});
  
    useEffect(() => {
      if (hasInventoryInfo) {
        setSelectedOption(options[0]);
        setSelectedDetails(details?.inventory_info[0]);
      }
    }, [details?.inventory_info]);
  
    const handleSelectChange = (selectedOption) => {
      setSelectedOption(selectedOption);
      setSelectedDetails(details?.inventory_info[selectedOption.value]);
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
                setDetails(response.result)
                setMedicineName(response.result?.medicine_name)
                setSupplierId(response.result?.supplier_id)
            } else {
               console.log('error in med details api');
            }
          })
    },[medId, medicineName])

    useEffect(() => {
        const obj = {

            medicine_id   : medicineId, 
            supplier_id   : supplierId,
            medicine_type : 'new',
            status        : 1,
            pageNo          : currentPage, 
            pageSize        : itemsPerPage
            // medicine_name : medicineName
        }
        postRequestWithToken('buyer/medicine/other-medicine-list', obj, async (response) => {
            if (response.code === 200) {
                setSimilarMedicinesList(response.result)
                setTotalitems(response.result.totalItems)
            } else {
               console.log('error in similar-medicine-list api');
            }
          })
    },[medicineName,medId, currentPage])

    const handleMedicineClick = (newMedicineId, newMedicine) => {
        
        setMedId(newMedicineId)
        setNewMedicineName(newMedicine)
        navigate(`/buyer/medicine-details/${newMedicineId}`);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className='main-product-details-container'>

            {/* {
                details?.map((data,i) => { */}
                    {/* const strengths = details.inventory.strength?.join(', '); */}
                    {/* return ( */}
                        <div className="product-details-cover">

                            <div className='product-details-container-main'>
                                <div className="product-details-section-one">
                                    <div className="product-details-sec-one-left">
                                        <h4 >
                                        {details?.medicine_name} <span className='product-details-stength'> ({details?.strength})</span>
                                        </h4>
                                        <p class="font-semibold text-[12px] leading-[21px] md:text-[16px] md:leading-[28px] text-gray-700 m-0">
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
                                                <div className='product-details-two-left-text'>Type of form :</div>
                                                <div className='product-details-two-right-text'>{details?.type_of_form}</div>
                                            </div>
                                            <div className="product-details-two">
                                                <div className='product-details-two-left-text'>Total quantity :</div>
                                                <div className='product-details-two-right-text'>{details?.total_quantity}</div>
                                            </div>
                                            
                                        </div>
                                        <div className="product-details-sec-two-left">
                                        <div className="product-details-two">
                                                <div className='product-details-two-left-text'>Stocked in :</div>
                                                <div className='product-details-two-right-text'>{details?.stocked_in?.join(', ')}</div>
                                        </div>
                                          <div className="product-details-two">
                                            <div className='product-details-two-left-text'>Shelf life :</div>
                                            <div className='product-details-two-right-text'>{details?.shelf_life}</div>
                                          </div>
                                            <div className="product-details-two">
                                                <div className='product-details-two-left-text'>Country of origin :</div>
                                                <div className='product-details-two-right-text'>{details?.supplier?.country_of_origin}</div>
                                            </div>
                                            <div className="product-details-two">
                                                <div className='product-details-two-left-text'>GMP approvals :</div>
                                                <div className='product-details-two-right-text'>{details?.gmp_approvals}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='product-details-container'>
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
                                            <div className='product-details-four-right-text'> <CountryDetails countryData = {details?.registered_in} /></div>
                                        </div>
                                        <div className="product-details-county">
                                            <div className='product-details-four-left-text'>Tags :</div>
                                            <div className='product-details-four-right-text'>{details?.tags.join(", ")}</div>
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
                                        <div className="product-details-mfg-heading">{details?.supplier?.supplier_name}</div>
                                        <div className="product-details-mfg-details">{details?.supplier?.description}</div>
                                    </div>

                                </div>

                                <div className='product-details-company-section'>
                                    <div className='product-details-company-conatiner'>
                                        <div className='product-details-inner-company'>
                                            <div className='product-details-inner-copmany-head'>Supplier Name :</div>
                                            <div className='product-details-inner-copmany-text'>{details?.supplier?.supplier_name}</div>
                                        </div>
                                        <div className='product-details-inner-company'>
                                            <div className='product-details-inner-copmany-head'>License No. :</div>
                                            <div className='product-details-inner-copmany-text'>{details?.supplier?.license_no}</div>
                                        </div>
                                     
                                    </div>
                                    <div className='product-details-company-conatiner'>
                                        <div className='product-details-inner-company'>
                                            <div className='product-details-inner-copmany-head'>Address :</div>
                                            <div className='product-details-inner-copmany-text'>{details?.supplier?.supplier_address}</div>
                                        </div>
                                        <div className='product-details-inner-company'>
                                            <div className='product-details-inner-copmany-head'>Payment Terms :</div>
                                            <div className='product-details-inner-copmany-text'>{details?.supplier?.payment_terms}</div>
                                        </div>
                                        
                                    </div>
                                </div>

                                
                            <div className='product-details-container'>
                            <div className="product-range-container">
                                <div className="product-range-heading">Quantity</div>
                                <div className="product-range-heading">Unit Price</div>
                                <div className="product-range-heading">Est. Delivery Time</div>
                                <div className="product-range-heading">Quantity Required</div>
                                <div className="product-range-heading">Target Price</div>
                                
                            </div>

                            <div className="product-range-details">
                                <div className="product-range-select">
                                    <Select className="product-range-select-fields" options={options}  value={selectedOption}   onChange={handleSelectChange} />
                                </div>
                                <div className="product-range-text"><input className="product-range-input" type="text" value={selectedDetails.unit_price} readOnly /> </div>
                                <div className="product-range-text"><input className="product-range-input" type="text"value={selectedDetails.est_delivery_days}  readOnly /></div>
                                <div className="product-range-text"><input className="product-range-input" type="text" placeholder='Enter Qty Req.' /> </div>
                                <div className="product-range-text"><input className="product-range-input" type="text" placeholder='Enter Target Price' /> </div>
                               
                            </div>
                             
                        </div>
                        {/* Start the button container */}
                        <div className='product-details-main-button-section'>
                            <div className='product-details-cancel-button'>Cancel</div>
                              <Link to='/buyer/send-inquiry'>
                            <div className='product-details-list-button'>Add to List</div>
                            </Link>
                        </div>
                        {/* End the button container */}
                                {/* start the ecommerce card */}
                                <div className='product-details-card-container'>
                                    <ProductDetailsCard 
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
                  {/* ) */}
                {/* })
            } */}
            </div>
        </>
    )
}
export default ProductDetails