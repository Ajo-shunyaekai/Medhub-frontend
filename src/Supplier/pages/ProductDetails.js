import React, { useEffect, useState } from 'react';
import '../style/productDetails.css';
import para from '../assest/para.webp'
import CountryDetails from '../pages/CountryDetails';
import { Link, useParams } from 'react-router-dom';
import { postRequest } from '../api/Requests';
import Select from 'react-select';


const ProductDetails = () => {

    const { medicineId } = useParams()

    const [medicineDetails, setMedicineDetails] = useState()
    const [medId, setMedId] = useState(medicineId)

    const hasInventoryInfo = medicineDetails && medicineDetails?.inventory_info && medicineDetails?.inventory_info.length > 0;
  
    // Generate options array based on inventory_info
    const options = hasInventoryInfo ? medicineDetails?.inventory_info.map((item, index) => ({
      value: index,
      label: item.quantity
    })) : [];
    
    // Use state to manage selected option and corresponding details
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [selectedDetails, setSelectedDetails] = useState(hasInventoryInfo ? medicineDetails?.inventory_info[0] : {});
  
    useEffect(() => {
      if (hasInventoryInfo) {
        setSelectedOption(options[0]);
        setSelectedDetails(medicineDetails?.inventory_info[0]);
      }
    }, [medicineDetails?.inventory_info]);
  
    const handleSelectChange = (selectedOption) => {
      setSelectedOption(selectedOption);
      setSelectedDetails(medicineDetails?.inventory_info[selectedOption.value]);
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
                setMedicineDetails(response.result)
            } else {
               console.log('error in med details api');
            }
          })
    },[])

    return (
        <>
            <div className='main-product-details-container'>


                <div className="product-details-cover">

                    <div className='product-details-container-main'>
                        <div className="product-details-section-one">
                            <div className="product-details-sec-one-left">
                                <h4 >
                                {medicineDetails?.medicine_name} <span className='product-details-stength'> ({medicineDetails?.strength || '5000mg'})</span>
                                </h4>
                                <p class="font-semibold text-[12px] leading-[21px] md:text-[16px] md:leading-[28px] text-gray-700 m-0">
                                    {medicineDetails?.composition}
                                </p>
                            </div>
                            <Link to={`/supplier/edit-product/${medicineDetails?.medicine_id}`}>
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

                        {/* <div className='product-details-container'>
                            <div className="product-range-container">
                                <div className="product-range-heading">Quantity</div>
                                <div className="product-range-heading">Unit Price</div>
                                <div className="product-range-heading">Total Price</div>
                                <div className="product-range-heading">Est. Delivery Time</div>
                            </div>

                            
                            <div className="product-range-details">
                                <div className="product-range-text"> <input className="product-range-input" type=" text" value='0 to 500' /> </div>
                                <div className="product-range-text"><input className="product-range-input" type="text" value="24 AED" /> </div>
                                <div className="product-range-text"><input className="product-range-input" type="text" value="399 AED" /> </div>
                                <div className="product-range-text"> <input className="product-range-input" type="text" value="10 Days" /></div>
                            </div>

                            <div className="product-range-details">
                                <div className="product-range-text"> <input className="product-range-input" type=" text" value='500 to 1000' /> </div>
                                <div className="product-range-text"><input className="product-range-input" type="text" value="22 AED" /> </div>
                                <div className="product-range-text"><input className="product-range-input" type="text" value="340 AED" /> </div>
                                <div className="product-range-text"> <input className="product-range-input" type="text" value="14 Days" /></div>
                            </div>

                            <div className="product-range-details">
                                <div className="product-range-text"> <input className="product-range-input" type=" text" value='1000 to 2000' /> </div>
                                <div className="product-range-text"><input className="product-range-input" type="text" value="20 AED" /> </div>
                                <div className="product-range-text"><input className="product-range-input" type="text" value="300 AED" /> </div>
                                <div className="product-range-text"> <input className="product-range-input" type="text" value="16 Days" /></div>
                            </div>

                            <div className="product-range-details">
                                <div className="product-range-text"> <input className="product-range-input" type=" text" value='2000 to 5000' /> </div>
                                <div className="product-range-text"><input className="product-range-input" type="text" value="18 AED" /> </div>
                                <div className="product-range-text"><input className="product-range-input" type="text" value="280 AED" /> </div>
                                <div className="product-range-text"> <input className="product-range-input" type="text" value="18 Days" /></div>
                            </div>


                        </div> */}
                         <div className='product-details-container'>
                                    <div className="product-range-container">
                                    <div className="product-range-heading">Quantity</div>
                                    <div className="product-range-heading">Unit Price</div>
                                    <div className="product-range-heading">Total Price</div>
                                    <div className="product-range-heading">Est. Delivery Time</div>
                                    </div>

                                       {
                                            medicineDetails?.inventory_info?.map((info,k) => {
                                                return (
                                                    <div className="product-range-details">
                                                        <div className="product-range-text"> <input className="product-range-input" type=" text" value={info.quantity} /> </div>
                                                        <div className="product-range-text"><input className="product-range-input" type="text" value="24 AED" /> </div>
                                                        <div className="product-range-text"><input className="product-range-input" type="text" value={info.unit_price} /> </div>
                                                        <div className="product-range-text"> <input className="product-range-input" type="text" value={info.est_delivery_days} /></div>
                                                    </div>
                                                )
                                            })
                                        }
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
                                <div className="product-details-mfg-heading">{medicineDetails?.supplier?.supplier_name }</div>
                                <div className="product-details-mfg-details">{medicineDetails?.supplier?.description}</div>
                            </div>

                        </div>
                        {/* end the ecommerce card */}
                    </div>
                </div>
            </div>
        </>
    )
}
export default ProductDetails