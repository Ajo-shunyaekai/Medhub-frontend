

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import '../../SharedComponents/Signup/signup.css'
import styles from "./productdetail.module.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetail } from "../../../../redux/reducers/productSlice";
import RenderProductFiles from "../RenderProductFiles";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import CloseIcon from "../../../assets/images/Icon.svg";
import moment from "moment";

const ProductDetails = () => {
 const { id } = useParams();
   const dispatch = useDispatch();
   const { productDetail } = useSelector((state) => state?.productReducer || {});
   const [modalIsOpen, setModalIsOpen] = useState(false);
   const pdfFile =
     productDetail?.secondaryMarketDetails?.purchaseInvoiceFile?.[0] ||
     productDetail?.data?.[0]?.secondaryMarketDetails?.purchaseInvoiceFile?.[0];
   const pdfUrl = pdfFile
     ? pdfFile?.startsWith("http")
       ? pdfFile
       : `${process.env.REACT_APP_SERVER_URL}/uploads/products/${pdfFile}`
     : "https://morth.nic.in/sites/default/files/dd12-13_0.pdf";
 
   useEffect(() => {
     if (id) {
       dispatch(fetchProductDetail(`product/${id}`));
     }
   }, [id]);
 
   const getCategoryData = (property) => {
     if (!productDetail?.category) return null;
     return productDetail[productDetail.category]?.[property];
   };
 
   const formatDate = (dateString) => {
     if (!dateString) return ""; // Handle empty or undefined dates
 
     const dateObj = new Date(dateString);
     if (isNaN(dateObj)) return ""; // Handle invalid dates
 
     const day = String(dateObj.getDate()).padStart(2, "0");
     const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are 0-based
     const year = dateObj.getFullYear();
 
     return `${day}-${month}-${year}`;
   };
 
   const fallbackImageUrl =
     "https://medhub.shunyaekai.com/uploads/fallbackImage.jpg";
 
   // Utility to check if URL ends with image extension
   const isImageExtension = (fileName) => {
     return /\.(png|jpe?g|gif|bmp|webp)$/i.test(fileName);
   };
 const openPurchaseInvoice = () => {
     if (pdfFile) {
       window.open(pdfUrl, "_blank");
     } else {
       alert("No purchase invoice file available.");
     }
   };
  return (
    <div className={styles.container}>
      <h3 className={styles.mainHead}>Product ID: 723542634</h3>
      <span className={styles.medicineHeading}>Paracetamol</span>
      <div className={styles.upperSection}>
        {productDetail?.category && (
        <span className={styles.mainText}> {productDetail?.category
                      ?.replace(/([a-z])([A-Z])/g, "$1 $2")
                      ?.replace(/\b\w/g, (char) => char.toUpperCase())} &gt; </span>
         )}
          {productDetail?.[productDetail?.category]?.subCategory && (
        <span className={styles.mainText}>   {productDetail?.[productDetail?.category]?.subCategory}{" "} &gt; </span>

         )}
          {productDetail?.[productDetail?.category]?.anotherCategory && (
        <span className={styles.mainText}> {productDetail?.[productDetail?.category]?.anotherCategory}{" "} </span>
         )}
      </div>
      <div className='row' style={{marginTop:"20px"}}>

        {/* Start Image Container */}
        <div className={`col-lg-4 ${styles.stickyLeft}`}>
          <div className={styles.imageContainer}>
            <div className={styles.imageSection}>
              <img src={mainImage} alt='image' />
            </div>
            <div className={styles.multiSection}>
              <img src={Image1} alt='image' onClick={() => handleThumbnailClick(Image1)} />
              <img src={Image2} alt='image' onClick={() => handleThumbnailClick(Image2)} />
              <img src={Image3} alt='image' onClick={() => handleThumbnailClick(Image3)} />
            </div>
          </div>
        </div>
        {/* End image container */}

        {/* Start Content Container */}
        <div className={`col-lg-8 ${styles.mainContainers}`}>
          <div className={styles.mainContainer}>
             {/* start short description */}
               {productDetail?.general?.aboutManufacturer && (
            <div className={styles.mainContent}>
              <span className={styles.mainHeading}>Short Description</span>
              <span className={styles.mainTexting}>
                {productDetail?.general?.aboutManufacturer}
              </span>
            </div>
             )}
             {/* END short description */}
              {/* start GENERAL INFORMATION */}
            <div className={styles.innerMainContainer}>
                 <span className={styles.mainHeading}>General Information</span>
                 <div className={styles.mainSectionContainer}>
              <div className={styles.innerContainer}>
              
                <div className={styles.contentSection}>
                  <span className={styles.headSec}>Product Total Quantity</span>
                  <span className={styles.textSec}>6235453</span>
                </div>

                  <div className={styles.contentSection}>
                  <span className={styles.headSec}>Part/Model No.</span>
                  <span className={styles.textSec}>6235453</span>
                </div>
                <div className={styles.contentSection}>
                  <span className={styles.headSec}>UPC</span>
                  <span className={styles.textSec}>76767</span>
                </div>
                <div className={styles.contentSection}>
                  <span className={styles.headSec}>Brand Name</span>
                  <span className={styles.textSec}>Pharmaceuticals</span>
                </div>
                <div className={styles.contentSection}>
                  <span className={styles.headSec}>Product Type/Form</span>
                  <span className={styles.textSec}>Tablet</span>
                </div>
                <div className={styles.contentSection}>
                  <span className={styles.headSec}>Product Volume</span>
                  <span className={styles.textSec}>60 Cube</span>
                </div>
                <div className={styles.contentSection}>
                  <span className={styles.headSec}>Product Dimension</span>
                  <span className={styles.textSec}>69 Kg</span>
                </div>
                <div className={styles.contentSection}>
                  <span className={styles.headSec}>Product Weights</span>
                  <span className={styles.textSec}>20 Km</span>
                </div>
              </div>
              <div className={styles.innerContainer}>
                <div className={styles.contentSection}>
                  <span className={styles.headSec}>Product Tax%</span>
                  <span className={styles.textSec}>62%</span>
                </div>
                <div className={styles.contentSection}>
                  <span className={styles.headSec}>Product Packaging Type</span>
                  <span className={styles.textSec}>699</span>
                </div>
                <div className={styles.contentSection}>
                  <span className={styles.headSec}>Product Packaging Material</span>
                  <span className={styles.textSec}>Minerals</span>
                </div>
                <div className={styles.contentSection}>
                  <span className={styles.headSec}>Storage Conditions</span>
                  <span className={styles.textSec}>Used</span>
                </div>
                <div className={styles.contentSection}>
                  <span className={styles.headSec}>Manufacturer Name</span>
                  <span className={styles.textSec}>Cencore Private Limited</span>
                </div>
                <div className={styles.contentSection}>
                  <span className={styles.headSec}>Manufacturer Country of Origin</span>
                  <span className={styles.textSec}>United Arab Emirates</span>
                </div>
              </div>
              </div>
            </div>
            {/* END GENERAL INFORMATION */}
          </div>

          {/* START INVENTORY */}
          <div className={styles.pricingContainer}>
            <span className={styles.mainHeading}>Inventory</span>
            <div className={styles.mainSectionContainer}>
            <div className={styles.innerContainer}>
              <div className={styles.contentSection}>
                <span className={styles.headSec}>SKU</span>
                <span className={styles.textSec}>6235453</span>
              </div>
              <div className={styles.contentSection}>
                <span className={styles.headSec}>Date of Manufacturer</span>
                <span className={styles.textSec}>76767</span>
              </div>
            </div>
            <div className={styles.innerContainer}>
              <div className={styles.contentSection}>
                <span className={styles.headSec}>Stock</span>
                <span className={styles.textSec}>62%</span>
              </div>
              <div className={styles.contentSection}>
                <span className={styles.headSec}>Stocked in Countries</span>
                <span className={styles.textSec}>India, Souch Africa, United Arab Emirates</span>
              </div>
            </div>
            </div>
          </div>
          {/* END INVENTORY */}
          {/* STRAT PRODUCT PRICING */}
           <div className={styles.stickyRight}>
            <span className={styles.categoryHeading}>Product Pricing</span>
            <div className={styles.pricingSection}>
          <div className={styles.inputContainer}>
              <label className={styles.labelName}>Quantity*</

label>
             <Select
        classNamePrefix="select"
        options={options}
        defaultValue={options[0]}
      />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.labelName}>Cost per Product*</label>
            <input className={styles.inputFormat} type='text' placeholder='Enter Product' />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.labelName}>Est. Delivery Time*</label>
            <input className={styles.inputFormat} type='text' placeholder='Enter Time' />
          </div>
          </div>
        </div>

        {/* END PRODUCT PRICING */}

        {/* START STOCKED IN DETAILS */}
          <div className={styles.countryContainer}>
            <span className={styles.mainHeading}>Stocked in Details</span>
            <div className={styles.countrySection}>
              <span className={styles.headCountry}>Country Where Stock Trades</span>
              <span className={styles.textCountryHead}>Stock Quantity</span>
            </div>
            <div className={styles.countrySection}>
              <span className={styles.headCountry}>Mumbai</span>
              <span className={styles.textCountry}>69900</span>
            </div>
            </div>

            {/* END STOCKED IN DETAILS */}

            {/* START ALTERNATIVE MEDICINES */}
          <div className={styles.categoryContainer}>
            <span className={styles.categoryHeading}>Alternative Medicines</span>
            <div className={styles.categorySection}>
              <div className={styles.categoryContent}>
                <span className={styles.categoryHead}>Shelf Life / Expiry</span>
                <span className={styles.categoryText}>2 years</span>
              </div>
              <div className={styles.categoryContent}>
                <span className={styles.categoryHead}>Compositions / Ingredients</span>
                <span className={styles.categoryText}>Paracetamol 500mg</span>
              </div>
              <div className={styles.categoryContent}>
                <span className={styles.categoryHead}>Purpose</span>
                <span className={styles.categoryText}>Pain relief, fever reduction</span>
              </div>
              <div className={styles.categoryContent}>
                <span className={styles.categoryHead}>Health Claims</span>
                <span className={styles.categoryText}>Effective for mild to moderate pain</span>
              </div>
            </div>
          </div>
          {/* END ALTERNATIVE MEDICINES */}


          {/* START DENTAL PRODUCTS */}
          <div className={styles.categoryContainer}>
            <span className={styles.categoryHeading}>Dental Products</span>
            <div className={styles.categorySection}>
              <div className={styles.categoryContent}>
                <span className={styles.categoryHead}>Shelf Life / Expiry</span>
                <span className={styles.categoryText}>3 years</span>
              </div>
              <div className={styles.categoryContent}>
                <span className={styles.categoryHead}>Product Material</span>
                <span className={styles.categoryText}>Pharmaceutical grade</span>
              </div>
              <div className={styles.categoryContent}>
                <span className={styles.categoryHead}>Target Condition</span>
                <b className={styles.categoryText}>Dental pain</b>
              </div>
              <div className={styles.categoryContent}>
                <span className={styles.categoryHead}>Usage Rate</span>
                <span className={styles.categoryText}>1 tablet every 6 hours</span>
              </div>
              <div className={styles.categoryContent}>
                <span className={styles.categoryHead}>Purpose</span>
                <span className={styles.categoryText}>Pain relief</span>
              </div>
              <div className={styles.categoryContent}>
                <span className={styles.categoryHead}>Maintenance Notes</span>
                <span className={styles.categoryText}>Store in cool, dry place</span>
              </div>
              <div className={styles.categoryContent}>
                <span className={styles.categoryHead}>Compatible Equipment</span>
                <span className={styles.categoryText}>None</span>
              </div>
            </div>
          </div>

          {/* END DENTAL PRODUCTS */}

            {/* Start Diagnostic & Monitoring Devices */}

              <div className={styles.categoryContainer}>
                <span className={styles.categoryHeading}>Diagnostic & Monitoring Devices</span>
                <div className={styles.categorySection}>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Diagnostic Function</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Flow Rate</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Concentration</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Measurement Range</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Noise Level</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Usage Rate</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Maintenance Notes</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Compatible Equipment</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Specification</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Performance Testing Report</span>
                    <span className={styles.categoryText}></span>
                  </div>
                </div>
              </div>


              {/* End diagnostic & Monitoring devices */}

              {/* Start Disinfection & Hygiene supplies */}

              <div className={styles.categoryContainer}>
                <span className={styles.categoryHeading}>Disinfection & Hygiene Supplies</span>
                <div className={styles.categorySection}>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Shelf life / Expiry</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Composition & Ingredients</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Concentration</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Formulation</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Fragrance</span>
                    <span className={styles.categoryText}></span>
                  </div>
                </div>
              </div>


              {/* End Disinfection & Hygiene supplies */}


              {/* Start Emgergency & First Aid Supplies*/}

              <div className={styles.categoryContainer}>
                <span className={styles.categoryHeading}>Emergency & First Aid Supplies</span>
                <div className={styles.categorySection}>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Shelf Life & Expiry</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Composition & Ingredients</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Product Longevity</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Foldability</span>
                    <span className={styles.categoryText}></span>
                  </div>
                </div>
              </div>
              {/* End Start Emgergency & First Aid Supplies */}



              {/* Start Eye care supplies*/}
              <div className={styles.categoryContainer}>
                <span className={styles.categoryHeading}>Eye Care Supplies</span>
                <div className={styles.categorySection}>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Frame</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Lens</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Lens Material</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Diameter</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Lens Power</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Base Curve</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Color Options</span>
                    <span className={styles.categoryText}></span>
                  </div>


                </div>
              </div>

              {/* End Eye care supplies*/}





              {/* Start healthcare IT solution */}
              <div className={styles.categoryContainer}>
                <span className={styles.categoryHeading}>Healthcare IT Solution</span>
                <div className={styles.categorySection}>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Scalability Info</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>License</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Add-ons</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>User Access</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Key Features</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Core Functionalities</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Interoperability</span>
                    <span className={styles.categoryText}></span>
                  </div>


                </div>
              </div>


              {/* End health care IT solution */}


              {/* Start home healthcare Products */}
              <div className={styles.categoryContainer}>
                <span className={styles.categoryHeading}>Home Healthcare Products</span>
                <div className={styles.categorySection}>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Shelf Life / Expiry</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Flow Rate</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Concentration</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Max-weight Capacity</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Grip Type</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Battery Type</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Battery Size</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Color Options</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Foldability</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Locking Mechanism</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Type of Support</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Performance Testing Report</span>
                    <span className={styles.categoryText}></span>
                  </div>
                </div>
              </div>
              {/* End home healthcare Products */}

              {/* Start hospital & clinic supplies */}
              <div className={styles.categoryContainer}>
                <span className={styles.categoryHeading}>Hospital & Clinic Supplies</span>
                <div className={styles.categorySection}>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Thickness</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Product Material</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Purpose</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Chemical Resistance</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Powdered</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Texture</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Shelf Life / Expiry</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Sterilized</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Adhesiveness</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Absorbency</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Elasticity</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Fluid Resistance</span>
                    <span className={styles.categoryText}></span>
                  </div>
                </div>
              </div>
              {/* End hospital & clinic supplies */}

              {/* Start laboratory supplies */}
              <div className={styles.categoryContainer}>
                <span className={styles.categoryHeading}>Laboratory Supplies</span>
                <div className={styles.categorySection}>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Physical State </span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Hazard Classification</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Shape</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Coating</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Purpose</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>CAS No.</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Grade</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Concentration</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Connectivity</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Magnification Range</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Objective Lenses</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Power Source</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Resolution</span>
                    <span className={styles.categoryText}></span>
                  </div>
                </div>
              </div>
              {/* End laboratory supplies */}

              {/* Start medical consumables & disposables */}
              <div className={styles.categoryContainer}>
                <span className={styles.categoryHeading}>Medical Consumables & Disposables</span>
                <div className={styles.categorySection}>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Thickness</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Product Material</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Filteration Type</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Purpose</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Chemical Resistance</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Shape</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Coating</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Powdered</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Texture</span>
                    <span className={styles.categoryText}></span>
                  </div>




                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Shelf Life / Expiry</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Allergens</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Sterilized</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Filteration Efficiency</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Breathability</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Layer Count</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Fluid Resistance</span>
                    <span className={styles.categoryText}></span>
                  </div>
                </div>
              </div>
              {/* End medical consumables & disposables */}



              {/* Start medical Equipment & Devices */}
              <div className={styles.categoryContainer}>
                <span className={styles.categoryHeading}>Medical Equipment & Devices</span>
                <div className={styles.categorySection}>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Interoperability</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Laser Type</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Cooling System</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Spot Size</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Diagnostic Functions</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Performance Testing Report</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Specification</span>
                    <span className={styles.categoryText}></span>
                  </div>


                </div>
              </div>
              {/* End medical Equipment & Devices */}


              {/* Start nutrition & dietary products  */}
              <div className={styles.categoryContainer}>
                <span className={styles.categoryHeading}>Nutrition & Dietary Products</span>
                <div className={styles.categorySection}>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Dairy Free</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Flavor Options</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Amino Acid Profile</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Fat Content</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Health Benefit</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Purpose</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Composition & Ingredients</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Additives & Sweeteners</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Vegan</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Shelf Life / Expiry</span>
                    <span className={styles.categoryText}></span>
                  </div>
                </div>
              </div>


              {/* End nutrition & dietary products */}



              {/* start orthopedic supplies */}

              <div className={styles.categoryContainer}>
                <span className={styles.categoryHeading}>Orthopedic Supplies</span>
                <div className={styles.categorySection}>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Strength</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Moisture Resistance</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Purpose</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Target Condition</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Coating</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Sterilized</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Elasticity</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Absorbency</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Breathability</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Color Options</span>
                    <span className={styles.categoryText}></span>
                  </div>
                </div>
              </div>
              {/* end orthopedic supplies */}



              {/* start Pharmaceuticals */}
              <div className={styles.categoryContainer}>
                <span className={styles.categoryHeading}>Pharmaceuticals</span>
                <div className={styles.categorySection}>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Generic Name</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Drug Class</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Strength</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>OTC Classification</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Composition / Ingredients</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Formulation</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Purpose</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Drug Administration Route</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Controlled Substance</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Shelf Life / Expiry</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Side effects & Warnings</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Allergens</span>
                    <span className={styles.categoryText}></span>
                  </div>

                </div>
              </div>
              {/* end Pharmaceuticals */}



              {/* start skin hair & cosmetic supplies */}
              <div className={styles.categoryContainer}>
                <span className={styles.categoryHeading}>Skin Hair & Cosmetic Supplies</span>
                <div className={styles.categorySection}>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>SPF</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Fragrance</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Strength</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Elasticity</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Adhesiveness</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Thickness</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>OTC Classification</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Formulation</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Composition / Ingredients</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Purpose</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Target Condition</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Drug Administration Route</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Drug Class</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Concentration</span>
                    <span className={styles.categoryText}></span>
                  </div>



                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Moisturizers </span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Filler Type</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Vegan</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Cruelty-Free</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Controlled Substance</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Dermatologist Tested</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Pediatrician Recommended</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Side Effect & Warnings</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Allergens</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Shelf Life / Expiry</span>
                    <span className={styles.categoryText}></span>
                  </div>
                </div>
              </div>
              {/* end skin hair & cosmetic supplies */}


              {/* start vital health & wellness */}

              <div className={styles.categoryContainer}>
                <span className={styles.categoryHeading}>Vital Health and Wellness</span>
                <div className={styles.categorySection}>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Generic Name</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Strength</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>OTC Classification</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Health Benefit</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Composition / Ingredients</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Formulation</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Purpose</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Drug Administration Route</span>
                    <span className={styles.categoryText}></span>
                  </div>
                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Drug Class</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Additives & Sweeteners</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Controlled Substance</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Vegan</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Cruelty-Free</span>
                    <span className={styles.categoryText}></span>
                  </div>

                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Shelf Life / Expiry</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Side Effect & Warning</span>
                    <span className={styles.categoryText}></span>
                  </div>


                  <div className={styles.categoryContent}>
                    <span className={styles.categoryHead}>Allergens</span>
                    <span className={styles.categoryText}></span>
                  </div>
                </div>
              </div>
              {/* end vital health & wellness */}



          {/* START PRODUCT DESCRIPTION */}
          <div className={styles.descriptionContainer}>
            <span className={styles.categoryHeading}>Product Description</span>
            <div className={styles.descriptionContent}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              <br /><br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              <br /><br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </div>
          </div>

          {/* END PRODUCT DESCRIPTION */}
          
          {/* START COMPLAINCES & CERTIFICATION */}
          <div className={styles.complianceContainer}>
            <span className={styles.categoryHeading}>Compliances & Certification</span>
             <div className={styles.mainSectionContainer}>
            <div className={styles.compliance}>
              <span className={styles.fileName}>Product.filename</span>
              <span className={styles.expiryName}>12-12-2025</span>
            </div>
             <div className={styles.compliance}>
              <span className={styles.fileName}>Product.filename</span>
              <span className={styles.expiryName}>12-12-2025</span>
            </div>
             <div className={styles.compliance}>
              <span className={styles.fileName}>Product.filename</span>
              <span className={styles.expiryName}>12-12-2025</span>
            </div>
             <div className={styles.compliance}>
              <span className={styles.fileName}>Product.filename</span>
              <span className={styles.expiryName}>12-12-2025</span>
            </div>
          </div>
          </div>
          {/* END COMPLAINCES & CERTIFICATION */}

          {/* START HEALTH & SAFETY */}
          <div className={styles.complianceContainer}>
            <span className={styles.categoryHeading}>Health & Safety</span>
            <div className={styles.fileContainer}>
               <span className={styles.fileHeading}>Safety Datasheet</span>
               <div className={styles.fileSection}>
              <div className={styles.compliance}>
                <span className={styles.fileName}>Product.filename</span>
                
              </div>
              <div className={styles.compliance}>
                <span className={styles.fileName}>Product.filename</span>
                
              </div>
              <div className={styles.compliance}>
                <span className={styles.fileName}>Product.filename</span>
               
              </div>
              <div className={styles.compliance}>
                <span className={styles.fileName}>Product.filename</span>
               
              </div>
            </div>
            </div>
            <div className={styles.fileContainer}>
               <span className={styles.fileHeading}>Health Hazard Rating</span>
               <div className={styles.fileSection}>
              <div className={styles.compliance}>
                <span className={styles.fileName}>Product.filename</span>
               
              </div>
              <div className={styles.compliance}>
                <span className={styles.fileName}>Product.filename</span>
               
              </div>
              <div className={styles.compliance}>
                <span className={styles.fileName}>Product.filename</span>
             
              </div>
              <div className={styles.compliance}>
                <span className={styles.fileName}>Product.filename</span>
                
              </div>
              </div>
            </div>
              <div className={styles.fileContainer}>
                  <span className={styles.fileHeading}>Environmental Impact</span>
                   <div className={styles.fileSection}>
              <div className={styles.compliance}>
                <span className={styles.fileName}>Product.filename</span>
               
              </div>
              <div className={styles.compliance}>
                <span className={styles.fileName}>Product.filename</span>
           
              </div>
              <div className={styles.compliance}>
                <span className={styles.fileName}>Product.filename</span>
               
              </div>
              <div className={styles.compliance}>
                <span className={styles.fileName}>Product.filename</span>
               
              </div>
              </div>
            </div>
          </div>

          {/* END HEALTH & SAFETY */}

          {/* START ADDITIONAL INFORMATION */}
          <div className={styles.additionalContainer}>
            <span className={styles.categoryHeading}>Additional Information</span>
            <div className={styles.categoryContent}>
              <span className={styles.categoryHead}>Warranty</span>
              <span className={styles.categoryText}>45 Months</span>
            </div>
            <div className={styles.categoryContent}>
              <span className={styles.categoryHead}>Other Information</span>
              <span className={styles.categoryText}>None</span>
            </div>
              <div className={styles.compliance}>
                <span className={styles.categoryHeading}>User Guidelines</span>
                <span className={styles.fileName}>Product.filename</span>
               
              </div>
            </div>
             {/* END ADDITIONAL INFORMATION */}
          </div>
       {/* End content container */}
      </div>
    </div>
  );
};

export default ProductDetails;