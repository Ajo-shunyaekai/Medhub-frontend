import React from 'react'
import styles from './bidDetails.module.css'
import { useParams } from 'react-router-dom'
import RenderProductFiles from '../../Buy/Details/RenderFiles';
 
const BidDetails = () => {
 
  const {id} = useParams();
  
  
 
  return (
    <div className={styles.container}>
        <span className={styles.heading}>Bid Details</span>
 
        {/* Bid detail header section */}
        <div className={styles.section}>
          <div className={styles.mainUpparContainer}>
            <div className={styles.InnerContainer}>
              <span className={styles.medicineName}>
               Bid ID : {id}
              </span>
    {/*           <Link
                to={`/supplier/edit-product/${id}`}
                className={styles.editButton}
              >
                Edit
              </Link> */}
            </div>
          </div>
 
          {/* Bid detail General Information Section */}
          <div className={styles.mainContainer}>
              <div className={styles.headingSecContainer}>
                <span className={styles.innerHead}>General Information</span>{" "}
        {/*          {productDetail?.updatedAt && (
                  <span className={styles.medicineHead2}>
                    (Last Modified Date:{" "}
                    {moment(productDetail?.updatedAt || new Date()).format(
                      "DD/MM/YYYY"
                    )}
                    )
                  </span>
                )} */}
              </div>
              <div className={styles.innerSection}>
                <div className={styles.mainSection}>
                    
                    {/* Bid starting Date */}
                    <div className={styles.InnerContainer}>
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Bid Starting Date</span>
                        <span className={styles.medicineText}>
                            03-08-2025
                        </span> 
                      </div>
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Bid Ending Date</span>
                        <span className={styles.medicineText}>
                            03-09-2025
                        </span> 
                      </div>
                    </div>
                    
                    {/* Bid Desc */}
                    <div className={styles.InnerContainer}>
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Bidding Description</span>
                        <span className={styles.medicineText}>
                            This section provides historical reference information on the countries with which the United States has had diplomatic relations. The articles in this section are listed below. An asterisk indicates former countries, previously recognized by the United States, that have been dissolved or superseded by other states.
                        </span>
                      </div>
                    </div>
                </div>
              </div>        
          </div>
 
 
 
          {/* Product Information */}
          <div className={styles.mainContainer}>
            <div className={styles.headingSecContainer}>
              <span className={styles.innerHead}>Product Information</span>
            </div>
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                    <div className={styles.InnerContainer}>
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Bid Type</span>
                        <span className={styles.medicineText}>
                          Product
                        </span> 
                      </div>
                      <div className={styles.medicinesSection}>
                        <span className={styles.medicineHead}>Item Name</span>
                        <span className={styles.medicineText}>
                            Paracetamol
                        </span> 
                      </div>
                    </div>
              </div>
            </div>
            {/* category & sub category */}
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.InnerContainer}>
                  <div className={styles.medicinesSection}>
                    <span className={styles.medicineHead}>Item Category</span>
                    <span className={styles.medicineText}>
                        Alternative Medicines
                    </span> 
                  </div>
                  <div className={styles.medicinesSection}>
                    <span className={styles.medicineHead}>Item Sub Category</span>
                    <span className={styles.medicineText}>
                        Ayurvedic
                    </span> 
                  </div>
                </div>
              </div>
            </div>
 
            {/* UPC & Brand Name */}
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.InnerContainer}>
                  <div className={styles.medicinesSection}>
                    <span className={styles.medicineHead}>UPC (Universal Product Code)</span>
                    <span className={styles.medicineText}>
                        PARA120
                    </span> 
                  </div>
                  <div className={styles.medicinesSection}>
                    <span className={styles.medicineHead}>Brand Name</span>
                    <span className={styles.medicineText}>
                        Cipla
                    </span> 
                  </div>
                </div>
              </div>
            </div>
 
            {/* Open for & From Countries */}
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.InnerContainer}>
                  <div className={styles.medicinesSection}>
                    <span className={styles.medicineHead}>Open For</span>
                    <span className={styles.medicineText}>
                        Manufacturer
                    </span> 
                  </div>
                  <div className={styles.medicinesSection}>
                    <span className={styles.medicineHead}>From Countries</span>
                    <span className={styles.medicineText}>
                        Afghanistan
                    </span> 
                  </div>
                </div>
              </div>
            </div>
            
            {/* country of destination & state of destination */}
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.InnerContainer}>
                  <div className={styles.medicinesSection}>
                    <span className={styles.medicineHead}>Country of Destination</span>
                    <span className={styles.medicineText}>
                        Afghanistan
                    </span> 
                  </div>
                  <div className={styles.medicinesSection}>
                    <span className={styles.medicineHead}>State of Destination</span>
                    <span className={styles.medicineText}>
                        Afghanistan
                    </span> 
                  </div>
                </div>
              </div>
            </div>
 
            {/* quantity required and target price */}
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.InnerContainer}>
                  <div className={styles.medicinesSection}>
                    <span className={styles.medicineHead}>Quantity Required</span>
                    <span className={styles.medicineText}>
                        10
                    </span> 
                  </div>
                  <div className={styles.medicinesSection}>
                    <span className={styles.medicineHead}>Target Price</span>
                    <span className={styles.medicineText}>
                        500
                    </span> 
                  </div>
                </div>
              </div>
            </div>
 
            {/* Expected delievery duration & Item Description */}
            <div className={styles.innerSection}>
              <div className={styles.mainSection}>
                <div className={styles.InnerContainer}>
                  <div className={styles.medicinesSection}>
                    <span className={styles.medicineHead}>Expected Delivery duration</span>
                    <span className={styles.medicineText}>
                        10
                    </span> 
                  </div>
                  <div className={styles.medicinesSection}>
                    <span className={styles.medicineHead}>Item Description</span>
                    <span className={styles.medicineText}>
                        quantityFromquantityFromquantityFrom
                    </span> 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
 
                  {/* Document */}
          <div className={styles.mainContainer}>
            <span className={styles.innerHead}>Bid Documents</span>
            <div className={styles.innerComplianceSection}>
              <div className={styles.additionalUploadSection}>
                <span className={styles.medicineHead}>Product Catalogue</span>
                <div className={styles.additionalImageSection}>
                    {/* <RenderProductFiles
                      files={productDetail?.documents?.catalogue}
                    /> */}
                  </div>
              </div>
              <div className={styles.additionalUploadSection}>
                <span className={styles.medicineHead}>Product Catalogue</span>
                <div className={styles.additionalImageSection}>
                    {/* <RenderProductFiles
                      files={productDetail?.documents?.catalogue}
                    /> */}
                  </div>
              </div>
              <div className={styles.additionalUploadSection}>
                <span className={styles.medicineHead}>Product Catalogue</span>
                <div className={styles.additionalImageSection}>
                    {/* <RenderProductFiles
                      files={productDetail?.documents?.catalogue}
                    /> */}
                  </div>
              </div>
              <div className={styles.additionalUploadSection}>
                <span className={styles.medicineHead}>Product Catalogue</span>
                <div className={styles.additionalImageSection}>
                    {/* <RenderProductFiles
                      files={productDetail?.documents?.catalogue}
                    /> */}
                  </div>
              </div>
            </div>
          </div>
 
        <div className={styles.bottomMargin}></div>
 
 
    </div>
  )
}
 
export default BidDetails