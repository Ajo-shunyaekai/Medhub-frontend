import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import styles from "./bidProductDetails.module.css";
import {
  updateBidProductDetails,
  fetchBidById,
} from "../../../../redux/reducers/bidSlice";
import ProductList from "./ProductList";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import BidHistoryList from "./BidHistoryList";

const BidDetails = () => {
  const { id, itemId } = useParams();
  const dispatch = useDispatch();
  const participantId = localStorage.getItem("_id");
  const [participatingDetails, setParticipatingeDetails] = useState({});
  const { bidDetails, loading } = useSelector(
    (state) => state?.bidReducer || {}
  );
  const [itemDetails, setItemDetails] = useState({});
  const [fieldsArray, setFieldsArray] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Set initial value of isEditing to false
  // const [loading, setLoading] = useState(false);

  // Initial values for the form fields
  const [initialValues, setInitialValues] = useState({
    amount: "",
    timeLine: "",
  });

  // Validation schema using Yup
  const validationSchema = Yup.object({
    amount: Yup.number()
      .typeError("Price Must be a number")
      .positive("Price must be a positive")
      .required("Price is required"),
    timeLine: Yup.number()
      .required("Timeline is required.")
      .typeError("Timeline must be a number")
      .positive("Timeline must be a positive")
      .integer("Timeline must be an integer"),
  });

  // Formik form initialization
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      try {
        const obj = {
          participantId: participantId,
          amount: Number(values.amount),
          tnc: values.tnc,
          timeLine: Number(values.timeLine),
          bidId: id,
          itemId: itemId,
        };
        dispatch(updateBidProductDetails(obj)).then((response) => {
          if (response?.meta.requestStatus === "fulfilled") {
            // setLoading(false);
            dispatch(fetchBidById(`bid/${id}`));
          }
        });

        setInitialValues(values);
      } catch (error) {
        toast.error(error);
      } finally {
        // setLoading(false);
      }
    },
  });

  // Helper function to display field names
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
      case "docReq":
        return "Certification Required";
      case "certificateName":
        return "Certification Name";
      case "openFor":
        return "Open For";
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
      const foundItem = bidDetails?.additionalDetails?.find(
        (item) =>
          item?.itemId?.toString()?.toLowerCase() ===
          itemId?.toString()?.toLowerCase()
      );
      setItemDetails(foundItem || {});
      const participatingDetails = foundItem?.participants?.find(
        (item) =>
          item?.id?.toString()?.toLowerCase() ===
          participantId?.toString()?.toLowerCase()
      );
      setParticipatingeDetails(participatingDetails);
    }
  }, [bidDetails, itemId]);

  useEffect(() => {
    const details = Object.entries(itemDetails);
    setFieldsArray(details || []);
  }, [itemDetails]);

  useEffect(() => {
    if (participatingDetails && Object.keys(participatingDetails)?.length > 0) {
      formik?.setValues({
        amount: participatingDetails?.amount,
        timeLine: participatingDetails?.timeLine,
        tnc: participatingDetails?.tnc,
      });
      setIsEditing(false); // If participatingDetails are found, editing is disabled
    } else {
      setIsEditing(true); // If participatingDetails are empty, allow editing
    }
  }, [participatingDetails]);

  const getFieldLabel = (fieldName) => {
    if (
      !participatingDetails ||
      Object.keys(participatingDetails).length === 0
    ) {
      return `Enter ${fieldName}`;
    }
    if (!isEditing) {
      return `Submitted ${fieldName}`;
    }
    return `Edit ${fieldName}`;
  };

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
                : "ITEM"}{" "}
              -{itemDetails?.itemId}
            </span>
          </div>
        </div>

        {/* Dynamic General Info from fieldsArray */}
        <div className={styles.mainContainer}>
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

        {/* Form */}
        <div className={styles.mainContainer}>
          <div className={styles.innerSection}>
            <div className={styles.mainSection}>
              <div className={styles.innerSection2}>
                <div className={styles.mainSection2}>
                  <div className={styles.fieldHeadingDiv}>
                    <span className={styles.fieldHeading}>
                      Participate in Bid
                    </span>
                    {participatingDetails &&
                      Object.keys(participatingDetails).length > 0 &&
                      !isEditing && (
                        <div
                          onClick={() => setIsEditing(true)}
                          className={styles.fieldSubmitButton}
                        >
                          Edit
                        </div>
                      )}
                  </div>
                  <div className={styles.InnerContainer2}>
                    <form
                      className={styles.fieldSection}
                      onSubmit={formik?.handleSubmit}
                    >
                      <div className={styles.fieldForm}>
                        <div className={styles.fieldDiv}>
                          <label className={styles.fieldFormLabel}>
                            {getFieldLabel("Bid Price")}
                            {isEditing && (
                              <span className={styles.labelStamp}>*</span>
                            )}
                          </label>
                          <input
                            name="amount"
                            type="numeric"
                            placeholder="Enter Bid Price"
                            className={styles.fieldFormInput}
                            value={formik?.values.amount}
                            onBlur={formik?.handleBlur}
                            onChange={formik?.handleChange}
                            disabled={!isEditing}
                          />
                          {formik?.errors.amount && formik?.touched.amount && (
                            <div className={styles.fieldError}>
                              {formik?.errors.amount}
                            </div>
                          )}
                        </div>
                        <div className={styles.fieldDiv}>
                          <label className={styles.fieldFormLabel}>
                            {getFieldLabel("Timeline")}
                            {isEditing && (
                              <span className={styles.labelStamp}>*</span>
                            )}
                          </label>
                          <input
                            name="timeLine"
                            type="numeric"
                            placeholder="Enter the expected delivery duration (in days)"
                            className={styles.fieldFormInput}
                            value={formik?.values.timeLine}
                            onBlur={formik?.handleBlur}
                            onChange={formik?.handleChange}
                            disabled={!isEditing}
                          />
                          {formik?.errors.timeLine &&
                            formik?.touched.timeLine && (
                              <div className={styles.fieldError}>
                                {formik?.errors.timeLine}
                              </div>
                            )}
                        </div>
                      </div>
                      <div className={styles.fieldForm}>
                        <div className={styles.fieldDiv2}>
                          <label className={styles.fieldFormLabel}>
                            {getFieldLabel("Terms And Condition")}
                            {isEditing && (
                              <span className={styles.labelStamp}>*</span>
                            )}
                          </label>
                          <textarea
                            className={styles.formInput}
                            rows={5}
                            name={`tnc`}
                            placeholder={`Enter Terms And Condition`}
                            value={formik?.values?.tnc}
                            onBlur={formik?.handleBlur}
                            onChange={formik?.handleChange}
                            disabled={!isEditing}
                          />
                          {formik?.touched?.tnc && formik?.errors?.tnc && (
                            <span className={styles.error}>
                              {formik?.errors?.tnc}
                            </span>
                          )}
                        </div>
                      </div>

                      {isEditing && (
                        <div className={styles.fieldBtnDiv}>
                          <button
                            type="submit"
                            className={styles.fieldSubmitButton}
                            disabled={loading}
                          >
                            {loading ? (
                              <div className={styles.loadingSpinner}></div>
                            ) : (
                              "Submit"
                            )}
                          </button>
                          <button
                            type="button"
                            className={styles.fieldCancelButton}
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Product List */}
      {participatingDetails?.history?.length > 0 && (
        <>
          <span className={styles.innerHead3}>Bid History</span>
          <BidHistoryList />
        </>
      )}

      <div className={styles.bottomMargin}></div>
    </div>
  );
};

export default BidDetails;
