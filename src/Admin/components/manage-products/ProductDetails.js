import React, { useEffect, useState } from 'react';
import '../../assest/style/productDetails.css'
import CountryDetails from '../shared-components/Country/CountryDetails';
import { Link, useParams } from 'react-router-dom';
import { postRequest } from '../../api/Requests';
import { apiRequests } from '../../../api';

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
       const fetchData = async () => { 
            // const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
            // const supplierIdLocalStorage   = localStorage.getItem("supplier_id");
 
            // if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            // navigate("/supplier/login");
            // return;
            // }
 
            const obj = {
                medicine_id: medId,
                // buyer_id    :supplierIdSessionStorage || supplierIdLocalStorage 
            }
 
            // postRequest('buyer/medicine/medicine-details', obj, async (response) => {
            //     if (response.code === 200) {
            //         setMedicineDetails(response.result.data)
            //     } else {
            //         console.log('error in med details api');
            //     }
            // })
            try {
                const response = await apiRequests.getRequest(`medicine/get-specific-medicine-details/${medId}`, obj)
                if(response?.code !== 200){
                    return
                }
                setMedicineDetails(response.result)
                // postRequest(`medicine/get-specific-medicine-details/${medId}`, obj, async (response) => {
                //     if (response.code === 200) {
                //         setMedicineDetails(response.result)
                //     } else {
                //         console.log('error in med details api');
                //     }
                // })
            } catch (error) {
                console.log('error in medicine list api',error);
            }
        }
        fetchData()
    }, [])

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
                                {/* <p class="font-semibold text-[12px] leading-[21px] md:text-[16px] md:leading-[28px] text-gray-700 m-0">
                                    {medicineDetails?.composition}
                                </p> */}
                            </div>
                            {/* <Link to={`/supplier/edit-product/${medicineDetails?.medicine_id}`}>
                                <div className="product-details-sec-one-right">
                                    <button className='product-details-send-btn'>Accept</button>
                                </div>
                               
                            </Link> */}

                        </div>
                    </div>

                    <div className="product-details-wrapper">
                        {/* <div className='product-details-containers'>
                            <div className="product-details-mfg-container">
                                <div className="product-details-mfg-heading">Reason for Rejecting the Product</div>

                                <div className="product-details-mfg-details">{medicineDetails?.description}</div>
                            </div>

                        </div> */}
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
                                        <div className='product-details-two-left-text'> Unit Tax :</div>
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
                                <div className='product-stockedin-head'>Stocked in</div>
                                <div className='product-stockedin-head-section'>
                                    <div className='product-stockedin-head-country'>Countries</div>
                                    <div className='product-stockedin-head-country'>Quantity</div>
                                </div>
                                <>
                                    {
                                        medicineDetails?.stockedIn_details?.map((item, index) => (
                                            <div className='product-stockedin-head-section' key={index}>
                                                <div className='product-stockedin-head-country-name'>{item?.stocked_in_country}</div>
                                                <div className='product-stockedin-head-qty-name'>
                                                    {item.stocked_quantity} {item.stocked_in_type}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </>
                            </div>
                        </div>
                        {/* end the stocked on container */}
                        <div className='product-details-container'>
                            <div className="product-details-section-two-img">
                                {medicineDetails?.medicine_image?.map((image, j) => (
                                    <div className="product-details-sec-img-left" key={j}>
                                        <img src={`${process.env.REACT_APP_SERVER_URL}uploads/medicine/product_files/${image}`}
                                            alt={`${image.medicine_name} ${j}`} className="responsive-image" />
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
                                    <div className='product-details-four-right-text'> <CountryDetails countryData={medicineDetails?.registered_in} /></div>
                                </div>
                                <div className="product-details-county">
                                    <div className='product-details-four-left-text'>Tags :</div>
                                    <div className='product-details-four-right-text'>{medicineDetails?.tags?.join(', ')}</div>
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
                                <div className="product-details-mfg-details">{medicineDetails?.description}</div>
                            </div>

                        </div>
                        {/* start the manufacturue details */}
                        <div className='product-details-container'>
                            <div className="product-details-section-two">
                                <div className="product-details-sec-two-left">
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Manufacturer Name :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.manufacturer_name}</div>
                                    </div>
                                </div>
                                <div className="product-details-sec-two-left">
                                    <div className="product-details-two">
                                        <div className='product-details-two-left-text'>Country of Origin :</div>
                                        <div className='product-details-two-right-text'>{medicineDetails?.manufacturer_country_of_origin}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end the manufacturer details */}
                        <div className='product-details-containers'>
                            <div className="product-details-mfg-container">
                                <div className="product-details-mfg-heading">About Manufacturer</div>
                                <div className="product-details-mfg-details">{medicineDetails?.manufacturer_description}</div>
                            </div>


                        </div>
                        {/* end the ecommerce card */}
                    </div>

                </div>


            </div>
            {/* <div className='buyer-details-button-containers'>
                <div className="product-details-sec-one-right">
                    <button className='product-details-send-btn'>Accept</button>
                </div>
                <div className="product-details-sec-one-right">
                    <button className='product-details-send-btn'>Reject</button>
                </div>

            </div> */}
        </>
    )
}

export default ProductDetails