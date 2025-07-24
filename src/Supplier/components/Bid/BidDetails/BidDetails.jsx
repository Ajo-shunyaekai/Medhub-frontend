import React from "react";
import styles from "./bidDetails.module.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
// import RenderProductFiles from "../../Buy/Details/RenderFiles";
import { fetchBidById } from "../../../../redux/reducers/bidSlice";
import moment from "moment";
import RenderProductFiles from "../../../../Buyer/components/Buy/Details/RenderFiles";
import ProductList from "./ProductList";
import { getTimeRemaining } from "../helper";

const BidDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { bidDetails } = useSelector((state) => state?.bidReducer || {});

  useEffect(() => {
    if (id) {
      dispatch(fetchBidById(`bid/${id}`));
    }
  }, [id]);


  return (
    <div className={styles.container}>
      <span className={styles.heading}>Bid Details</span>

      {/* Bid detail header section */}
      <div className={styles.section}>
        <div className={styles.mainUpparContainer}>
          <div className={styles.InnerContainer}>
            <span className={styles.medicineName}>
              Bid ID : {bidDetails?.bid_id}
            </span>

            {bidDetails?.status && (
              <div className={styles.bidStatusCont}>
                <div className={styles?.bidStatusHead}>Bid Status</div>
                <div className={styles?.bidStatusText}>
                  {bidDetails.status.charAt(0).toUpperCase() +
                    bidDetails.status.slice(1)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bid detail General Information Section */}
        <div className={styles.mainContainer}>
          <span className={styles.innerHead}>General Information</span>
          <div className={styles.innerComplianceSection}>
            <div className={styles.additionalUploadSection3}>
              <span className={styles.medicineHead5}>Bid Starting Date</span>
              <span className={styles.medicineText4}>
                {moment(bidDetails?.general?.startDate || new Date()).format(
                  "DD/MM/YYYY"
                )}
              </span>
            </div>
            <div className={styles.additionalUploadSection3}>
              <span className={styles.medicineHead3}>Bid End Date</span>
              <span className={styles.medicineText3}>
                {moment(bidDetails?.general?.endDate || new Date()).format(
                  "DD/MM/YYYY"
                )}
              </span>
            </div>
            <div className={styles.additionalUploadSection3}>
              <span className={styles.medicineHead3}>Time Remaining</span>
              <span className={styles.medicineText3}>
                {
                  getTimeRemaining(bidDetails?.general?.startDate, bidDetails?.general?.startTime, 
                  bidDetails?.general?.endDate, bidDetails?.general?.endTime  
                )}
              </span>
            </div>
            <div className={styles.additionalUploadSection3}>
              <span className={styles.medicineHead4}>Country of Destination</span>
              <span className={styles.medicineText3}>
                {bidDetails?.general?.country || "N/A"}
              </span>
            </div>
            <div className={styles.additionalUploadSection3}>
              <span className={styles.medicineHead3}>State of Destination</span>
              <span className={styles.medicineText3}>
                {bidDetails?.general?.state || "N/A"}
              </span>
            </div>
            <div className={styles.additionalUploadSection3}>
              <span className={styles.medicineHead3}>From Countries</span>
              <span className={styles.medicineText3}>
                {bidDetails?.general?.fromCountries?.join(", ") || "N/A"}
              </span>
            </div>
            
          </div>
        </div>
        <div className={styles.mainContainer}>
          <div className={styles.innerSection}>
            <div className={styles.mainSection}>
              <div className={styles.innerSection2}>
                <div className={styles.mainSection2}>
                  <div className={styles.InnerContainer2}>
                    <div className={styles.medicinesSection2}>
                      <span className={styles.medicineHead2}>
                        Bid Description
                      </span>
                      <span className={styles.medicineText2}>
                        {bidDetails?.general?.description}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document */}
        <div className={styles.mainContainer}>
          <span className={styles.innerHead}>Requirement Documents</span>
          <div className={styles.innerComplianceSection}>
            {bidDetails?.general?.documents?.map((item, index) => {
              return (
                <div
                  className={styles.additionalUploadSection}
                  key={item?._id || index}
                >
                  <div className={styles.additionalImageSection}>
                    <RenderProductFiles files={[item?.document]} />
                  </div>
                  <span className={styles.medicineHead}>{item?.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Product Information */}
        {bidDetails?.additionalDetails?.length > 0 && (
          <>
            <span className={styles.innerHead3}>Bid Products/Services</span>
          </>
        )}
        <ProductList/>
      </div>

      <div className={styles.bottomMargin}></div>
    </div>
  );
};

export default BidDetails;
