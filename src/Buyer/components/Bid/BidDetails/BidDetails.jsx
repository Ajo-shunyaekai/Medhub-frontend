import React from "react";
import styles from "./bidDetails.module.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
// import RenderProductFiles from "../../Buy/Details/RenderFiles";
import { fetchBidById } from "../../../../redux/reducers/bidSlice";
import moment from "moment";
import RenderProductFiles from "../../../../Buyer/components/Buy/Details/RenderFiles";

const BidDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { bidToUpdate } = useSelector((state) => state?.bidReducer || {});

  useEffect(() => {
    if (id) {
      dispatch(fetchBidById(`bid/${id}`));
    }
  }, [id]);

  const getTimeRemaining = (endDate, endTime = "00:00") => {
    if (!endDate) return "";

    // Combine end date and time (time is expected in "HH:mm" format)
    const combinedEnd = moment(`${endDate}T${endTime}`, "YYYY-MM-DDTHH:mm");

    const now = moment();
    const duration = moment.duration(combinedEnd.diff(now));

    if (duration.asMilliseconds() <= 0) return "Expired";

    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();

    const parts = [];
    if (days > 0) parts.push(`${days} Day${days !== 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} Hour${hours !== 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} Min${minutes !== 1 ? "s" : ""}`);

    return parts.join(" ");
  };

  return (
    <div className={styles.container}>
      <span className={styles.heading}>Bid Details</span>

      {/* Bid detail header section */}
      <div className={styles.section}>
        <div className={styles.mainUpparContainer}>
          <div className={styles.InnerContainer}>
            <span className={styles.medicineName}>
              Bid ID : {bidToUpdate?.bid_id}
            </span>

            {bidToUpdate?.status && (
              <div className={styles.bidStatusCont}>
                <div className={styles?.bidStatusHead}>Bid Status</div>
                <div className={styles?.bidStatusText}>
                  {bidToUpdate.status.charAt(0).toUpperCase() +
                    bidToUpdate.status.slice(1)}
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
              <span className={styles.medicineHead3}>Bid Starting Date</span>
              <span className={styles.medicineText3}>
                {moment(bidToUpdate?.general?.startDate || new Date()).format(
                  "DD/MM/YYYY"
                )}
              </span>
            </div>
            <div className={styles.additionalUploadSection3}>
              <span className={styles.medicineHead3}>Bid End Date</span>
              <span className={styles.medicineText3}>
                {moment(bidToUpdate?.general?.endDate || new Date()).format(
                  "DD/MM/YYYY"
                )}
              </span>
            </div>
            <div className={styles.additionalUploadSection3}>
              <span className={styles.medicineHead3}>Time Remaining</span>
              <span className={styles.medicineText3}>
                {getTimeRemaining(bidToUpdate?.general?.startDate)}
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
                        {bidToUpdate?.general?.description}
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
            {bidToUpdate?.general?.documents?.map((item, index) => {
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
        {bidToUpdate?.additionalDetails?.length > 0 && (
          <>
            <span className={styles.innerHead3}>Bid Item Details</span>
          </>
        )}
        {bidToUpdate?.additionalDetails?.map((item, index) => (
          <div className={styles.mainContainer}>
            {/* <span className={styles.innerHead}>Bid Item Details</span> */}
            <>
              <div className={styles.headingSecContainer}>
                <span className={styles.innerHead2}>
                  {index + 1}
                  {". "}
                  {item?.type?.charAt(0)?.toUpperCase() + item?.type?.slice(1)}
                  {" - "}
                  {item?.name}
                </span>
              </div>
              <div className={styles.innerSection}>
                <div className={styles.mainSection}>
                  <div className={styles.InnerContainer}>
                    <div className={styles.medicinesSection}>
                      <span className={styles.medicineHead}>Bid Type</span>
                      <span className={styles.medicineText}>{item.type}</span>
                    </div>
                    <div className={styles.medicinesSection}>
                      <span className={styles.medicineHead}>
                        {item?.type || "Item"} Name
                      </span>
                      <span className={styles.medicineText}>{item.name}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* category & sub category */}
              <div className={styles.innerSection}>
                <div className={styles.mainSection}>
                  <div className={styles.InnerContainer}>
                    <div className={styles.medicinesSection}>
                      <span className={styles.medicineHead}>
                        {item?.type || "Item"} Category
                      </span>
                      <span className={styles.medicineText}>
                        {item.category}
                      </span>
                    </div>
                    <div className={styles.medicinesSection}>
                      <span className={styles.medicineHead}>
                        {item?.type || "Item"} Sub Category
                      </span>
                      <span className={styles.medicineText}>
                        {item.subCategory}
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
                      <span className={styles.medicineHead}>
                        UPC (Universal Product Code)
                      </span>
                      <span className={styles.medicineText}>{item.upc}</span>
                    </div>
                    <div className={styles.medicinesSection}>
                      <span className={styles.medicineHead}>Brand Name</span>
                      <span className={styles.medicineText}>{item.brand}</span>
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
                        {item.openFor}
                      </span>
                    </div>
                    <div className={styles.medicinesSection}>
                      <span className={styles.medicineHead}>
                        From Countries
                      </span>
                      <span className={styles.medicineText}>
                        {item.fromCountries?.join(", ")}
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
                      <span className={styles.medicineHead}>
                        Country of Destination
                      </span>
                      <span className={styles.medicineText}>
                        {item.country}
                      </span>
                    </div>
                    <div className={styles.medicinesSection}>
                      <span className={styles.medicineHead}>
                        State of Destination
                      </span>
                      <span className={styles.medicineText}>{item.state}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* quantity required and target price */}
              <div className={styles.innerSection}>
                <div className={styles.mainSection}>
                  <div className={styles.InnerContainer}>
                    <div className={styles.medicinesSection}>
                      <span className={styles.medicineHead}>
                        Quantity Required
                      </span>
                      <span className={styles.medicineText}>
                        {item.quantity}
                      </span>
                    </div>
                    <div className={styles.medicinesSection}>
                      <span className={styles.medicineHead}>Target Price</span>
                      <span className={styles.medicineText}>
                        {item.targetPrice} USD
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expected delievery duration & {item?.type || "Item" }Description */}
              <div className={styles.innerSection}>
                <div className={styles.mainSection}>
                  <div className={styles.InnerContainer}>
                    <div className={styles.medicinesSection}>
                      <span className={styles.medicineHead}>
                        Expected Delivery Duration
                      </span>
                      <span className={styles.medicineText}>
                        {item.targetPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.innerSection2}>
                <div className={styles.mainSection2}>
                  <div className={styles.InnerContainer2}>
                    <div className={styles.medicinesSection2}>
                      <span className={styles.medicineHead24}>
                        {item?.type || "Item"} Description
                      </span>
                      <span className={styles.medicineText2}>
                        {item.description}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </div>
        ))}
      </div>

      <div className={styles.bottomMargin}></div>
    </div>
  );
};

export default BidDetails;
