import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import styles from "./bidProductDetails.module.css";
import { fetchBidById } from "../../../../redux/reducers/bidSlice";
import ProductList from "./ProductList";

const BidDetails = ({socket}) => {
  
  const { id, itemId } = useParams();
  const dispatch = useDispatch();

  const { bidDetails } = useSelector((state) => state?.bidReducer || {});
  const [itemDetails, setItemDetails] = useState({});
  const [fieldsArray, setFieldsArray] = useState([]);

  const getFieldName = (name) => {
    switch (name) {
      case "type":
        return "Bid Type";
      case "category":
        return "Category";
      case "subCategory":
        return "Sub Category";
      case "name":
        return "Name";
      case "description":
        return "Description";
      case "upc":
        return "UPC (Universal Product Code)";
      case "brand":
        return "Brand Name";
      case "quantity":
        return "Quantity Required";
      case "targetPrice":
        return "Target Price";
      // case "country":
      //   return "Country of Destination";
      // case "state":
      //   return "State of Destination";
      case "docReq":
        return "Certification Required";
      case "certificateName":
        return "Certification Name";
      case "openFor":
        return "Open For";
      // case "fromCountries":
      //   return "From Countries";
      case "delivery":
        return "Expected Delivery Duration";
      default:
        return name;
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchBidById(`bid/${id}`));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (bidDetails?.additionalDetails?.length && itemId) {
      const foundItem = bidDetails.additionalDetails.find(
        (item) => item?.itemId?.toString() === itemId?.toString()
      );
      setItemDetails(foundItem || {});
    }
  }, [bidDetails, itemId]);

  useEffect(() => {
    const details = Object.entries(itemDetails);
    setFieldsArray(details || []);
  }, [itemDetails]);

  return (
    <div className={styles.container}>
      <span className={styles.heading}>
        Bid {itemDetails?.type ? itemDetails.type : "Item"} Details
      </span>

      {/* Header */}
      <div className={styles.section}>
        <div className={styles.mainUpparContainer}>
          <div className={styles.InnerContainer}>
            <span className={styles.medicineName}>
              Bid {itemDetails?.type ? itemDetails?.type : "Item"} ID :{" "}
              {bidDetails?.bid_id} -{" "}
              {itemDetails?.type
                ? itemDetails.type === "Product"
                  ? "PDT"
                  : "SRV"
                : "ITEM"}
              -{itemDetails?.itemId}
            </span>
          </div>
        </div>

        {/* Dynamic General Info from fieldsArray */}
        <div className={styles.mainContainer}>
          {/* <div className={styles.headingSecContainer}>
            <span className={styles.innerHead}>General Information</span>
          </div> */}

          <div className={styles.innerSection}>
            <div className={styles.mainSection}>
              <div
                className={`${styles.InnerContainer} ${styles.generalInfoSection}`}
              >
                {fieldsArray.map(([key, value]) => {
                  if (
                    key === "_id" ||
                    key === "itemId" ||
                    key === "description" ||
                    key === "country" ||
                    key === "fromCountries" ||
                    key === "state" ||
                    key === "participants" ||
                    key === "totalBidsCount"
                  )
                    return null;

                  return (
                    <div
                      className={`${styles.medicinesSection} ${styles.generalInfoField}`}
                      key={key}
                    >
                      <span className={styles.generalInfoLabel}>
                        {getFieldName(key)}
                      </span>
                      <span className={styles.generalInfoValue}>
                        {Array.isArray(value)
                          ? value.join(", ")
                          : key == "delivery" ||
                            key == "Expected Delivery Duration"
                          ? String(value) + " Days"
                          : key == "targetPrice"
                          ? String(value) + " USD"
                          : String(value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={styles.mainContainer}>
          <div className={styles.innerSection}>
            <div className={styles.mainSection}>
              <div className={styles.innerSection2}>
                <div className={styles.mainSection2}>
                  <div className={styles.InnerContainer2}>
                    <div className={styles.medicinesSection2}>
                      <span className={styles.medicineHead2}>
                        {itemDetails?.type} Description
                      </span>
                      <span className={styles.medicineText2}>
                        {itemDetails?.description || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product List */}
        <span className={styles.innerHead3}>Bidders List</span>
        <ProductList socket = {socket}/>
      </div>

      <div className={styles.bottomMargin}></div>
    </div>
  );
};

export default BidDetails;
