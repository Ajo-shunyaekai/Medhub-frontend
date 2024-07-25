import React, { useEffect, useState } from 'react';
import productDetails from '../style/productDetails.css';
import para from '../assest/para.webp'
import CountryDetails from '../components/sections/CountryDetails';
import ProductDetailsCard from './ProductDetailsCard';
import { Link, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { medicineId } = useParams();

  const [details, setDetails] = useState();
  const [medId, setMedId] = useState(medicineId);
  const [supplierId, setSupplierId] = useState();
  const [medicineName, setMedicineName] = useState();
  const [newMedicineName, setNewMedicineName] = useState();
  const [similarMedicinesList, setSimilarMedicinesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState();
  const itemsPerPage = 2;

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState({});
  const [quantityRequired, setQuantityRequired] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [errors, setErrors] = useState({});

  const hasInventoryInfo = details && details.inventory_info && details.inventory_info.length > 0;

  const options = hasInventoryInfo
    ? details.inventory_info.map((item, index) => ({
        value: index,
        label: item.quantity
      }))
    : [];

  useEffect(() => {
    if (hasInventoryInfo) {
      setSelectedOption(options[0]);
      setSelectedDetails(details.inventory_info[0]);
    }
  }, [details]);

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setSelectedDetails(details.inventory_info[selectedOption.value]);
  };

  useEffect(() => {
    const buyerIdSessionStorage = sessionStorage.getItem('buyer_id');
    const buyerIdLocalStorage = localStorage.getItem('buyer_id');

    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      navigate('/buyer/login');
      return;
    }

    const obj = {
      medicine_id: medId,
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage
    };

    postRequestWithToken('buyer/medicine/medicine-details', obj, async (response) => {
      if (response.code === 200) {
        setDetails(response.result);
        setMedicineName(response.result.medicine_name);
        setSupplierId(response.result.supplier_id);
      } else {
        console.log('error in med details api');
      }
    });
  }, [medId]);

  useEffect(() => {
    const obj = {
      medicine_id: medicineId,
      supplier_id: supplierId,
      medicine_type: 'new',
      status: 1,
      pageNo: currentPage,
      pageSize: itemsPerPage
    };
    postRequestWithToken('buyer/medicine/other-medicine-list', obj, async (response) => {
      if (response.code === 200) {
        setSimilarMedicinesList(response.result);
        setTotalItems(response.result.totalItems);
      } else {
        console.log('error in similar-medicine-list api');
      }
    });
  }, [medicineName, medId, currentPage]);

  const handleMedicineClick = (newMedicineId, newMedicine) => {
    setMedId(newMedicineId);
    setNewMedicineName(newMedicine);
    navigate(`/buyer/medicine-details/${newMedicineId}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const validateInputs = () => {
    let formErrors = {};
    if (!quantityRequired || isNaN(quantityRequired) || quantityRequired <= 0) {
      formErrors.quantityRequired = 'Please enter a valid quantity.';
    }
    if (!targetPrice || isNaN(targetPrice) || targetPrice <= 0) {
      formErrors.targetPrice = 'Please enter a valid target price.';
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleAddToList = async (e) => {
    e.preventDefault();
    
    if (validateInputs()) {
      const obj = {
        medicine_id: medId,
        supplier_id : supplierId,
        buyer_id: sessionStorage.getItem('buyer_id') || localStorage.getItem('buyer_id'),
        quantity_required: quantityRequired,
        target_price: targetPrice,
        quantity: selectedDetails.quantity,  // Assuming 'quantity' is the correct property
        unit_price: selectedDetails.unit_price,
        est_delivery_time: selectedDetails.est_delivery_days  // Assuming 'est_delivery_days' holds the correct information
      };
      console.log(obj);

      postRequestWithToken('buyer/add-to-list', obj, async (response) => {
        if (response.code === 200) {
          toast(response.message, { type: "success" });
          setTimeout(() => {
            navigate('/buyer/send-inquiry')
        }, 1000);
           
        } else {
          console.log('error in similar-medicine-list api');
        }
      });
      
    //   try {
    //     const response = await postRequestWithToken('buyer/medicine/add-to-list', obj);
    //     if (response.code === 200) {
    //       navigate('/buyer/send-inquiry');
    //     } else {
    //       console.log('Error in add to list API:', response.message);
    //     }
    //   } catch (error) {
    //     console.error('API request failed:', error);
    //   }
    }
  };
  

  return (
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
                  <img src={`${process.env.REACT_APP_SERVER_URL}uploads/medicine/product_files/${image}`} alt={`${details?.medicine_name} ${j}`} className="responsive-image" />
                </div>
              ))}
            </div>
          </div>

          <div className='product-details-container'>
            <div className="product-details-country-section">
              <div className="product-details-county">
                <div className='product-details-four-left-text'>Registered in :</div>
                <div className='product-details-four-right-text'>
                  <CountryDetails countryData = {details?.registered_in} />
                </div>
              </div>
              <div className="product-details-county">
                <div className='product-details-four-left-text'>Tags :</div>
                <div className='product-details-four-right-text'>{details?.tags}</div>
              </div>
              <div className="product-details-county">
                <div className='product-details-four-left-text'>Available for  :</div>
                <div className='product-details-four-right-text'>{details?.available_for}</div>
              </div>
              <div className="product-details-county">
                <div className='product-details-four-left-text'>Comments :</div>
                <div className='product-details-four-right-text'>{details?.description}</div>
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
                <Select className="product-range-select-fields" options={options} value={selectedOption} onChange={handleSelectChange} />
              </div>
              <div className="product-range-text">
                <input className="product-range-input" type="text" value={selectedDetails.unit_price} readOnly />
              </div>
              <div className="product-range-text">
                <input className="product-range-input" type="text" value={selectedDetails.est_delivery_days} readOnly />
              </div>
              <div className="product-range-text">
                <input className="product-range-input" type="text" placeholder='Enter Qty Req.' value={quantityRequired} onChange={(e) => setQuantityRequired(e.target.value)} />
                {errors.quantityRequired && <div className="error">{errors.quantityRequired}</div>}
              </div>
              <div className="product-range-text">
                <input className="product-range-input" type="text" placeholder='Enter Target Price' value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} />
                {errors.targetPrice && <div className="error">{errors.targetPrice}</div>}
              </div>
            </div>

          </div>
          <div className='product-details-main-button-section'>
            <div className='product-details-cancel-button'>Cancel</div>
            <button className='product-details-list-button' onClick={handleAddToList}>Add to List</button>
          </div>

          <div className='product-details-card-container'>
            <ProductDetailsCard
              similarMedicines={similarMedicinesList}
              onMedicineClick={handleMedicineClick}
              totalItems={totalItems}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
