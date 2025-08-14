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
import { useNavigate } from "react-router-dom";
import { fetchProductsList } from "../../../../redux/reducers/productSlice";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import BidHistoryList from "./BidHistoryList";
import Select from 'react-select'
import { Tooltip } from "react-tooltip";

const BidDetails = () => {
  const { id, itemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const participantId = localStorage.getItem("_id");
  const [participatingDetails, setParticipatingeDetails] = useState({});
  const { bidDetails, loading } = useSelector(
    (state) => state?.bidReducer || {}
  );
  const [productList, setProductList] = useState([]);
  const [itemDetails, setItemDetails] = useState({});
  const [fieldsArray, setFieldsArray] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Set initial value of isEditing to false
  // const [loading, setLoading] = useState(false);

  // Initial values for the form fields
  const [initialValues, setInitialValues] = useState({
    amount: "",
    timeLine: "",
    tnc:"",
    productName:"",
    productId:""
  });

  //to handle cancel, manage seperate state with initial value
  const [savedValue, setSavedValue] = useState({amount:"",timeLine:"",tnc:"",productName:"",productId:""});

  /* select option added */
 /*  const option = [
    { value: '2332', label: 'Paracetamol'},
    { value: '2331', label: 'Algoliptin'},
    { value: '2330', label: 'Crocin'},
    { value: '2335', label: 'Crocin Tablet'},
  ] */
  
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
    productName: Yup.string()
      .required("Product Name is required.")
  });

  // Formik form initialization
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      
      try {
        const obj = {
          participantId: participantId,
          supplier_id: localStorage.getItem('supplier_id'),
          amount: Number(values.amount),
          tnc: values.tnc,
          productName: values.productName,
          productId: values.productId,
          timeLine: Number(values.timeLine),
          bidId: id,
          itemId: itemId,
        };
        
        dispatch(updateBidProductDetails(obj)).then((response) => {
          if (response?.meta.requestStatus === "fulfilled") {
            // setLoading(false);
            dispatch(fetchBidById(`bid/${id}`));
            setSavedValue(values);

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
        productName: participatingDetails?.productName,
        productId: participatingDetails?.productId
      });

      setSavedValue({
        amount: participatingDetails?.amount,
        timeLine: participatingDetails?.timeLine,
        tnc: participatingDetails?.tnc,
        productName: participatingDetails?.productName,
        productId: participatingDetails?.productId
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

  const handleCancel = () => {
    if(participatingDetails){
      setIsEditing(false);
      formik.setValues(savedValue);
    }
    else{
      setSavedValue({amount:"",timeLine:"",tnc:"",productName:""});
      formik.setValues(savedValue);
    }
  }

  const allFieldsEmpty = Object.values(formik.values).every(
    (value) => value === ""
  );

  const isDisabled = !participatingDetails && allFieldsEmpty;

  //api for fetching productId and name
  
  useEffect(() => {
      const supplierIdSessionStorage = localStorage?.getItem("_id");
      const supplierIdLocalStorage = localStorage?.getItem("_id");
  
      if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
        localStorage?.clear();
        navigate("/buyer/login");
        return;
      }
      const fetchData = async () => {
        try {
          const supplierId =
            localStorage?.getItem("_id") ||
            localStorage?.getItem("_id");
          if (!supplierId) {
            localStorage?.clear();
            navigate("/supplier/login");
            return;
          }
  
          const fetchProducts = async () => {
            // setLoading(true);
            const response = await dispatch(
              fetchProductsList({
                url: `product/for-dd?supplier_id=${supplierId}&showDuplicate=false`,
              })
            );
            if (response.meta.requestStatus === "fulfilled") {
              setProductList(response?.payload?.products || []);
              // setLoading(false);
            }
          };
          fetchProducts();
        } catch (error) {
          console.error("Error fetching products:", error.message);
        } finally {
          // setLoading(false);
        }
      };
      fetchData();
    }, []);

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
                      <div className={isEditing?styles.newFieldForm : styles.fieldForm}>
                        {/* select product name */}
                        {
                          isEditing && (
                            <div className={isEditing?styles.fieldDiv:styles.newFieldDiv}>
                          <label className={styles.fieldFormLabel}>
                            {getFieldLabel("Product Name")}
                            {isEditing && (
                              <span className={styles.labelStamp}>*</span>
                            )}
                          </label>
                          <Select
                          options={productList || []}
                          value={
                            formik.values.productId
                              ? { label: formik.values.productName, value: formik.values.productId }
                              : null
                          }
                          onChange={(selectedOption) => {
                            formik.setFieldValue("productName", selectedOption?.label || "");
                            formik.setFieldValue("productId", selectedOption?.value || "");
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              width: '100%',
                              padding:'3.3px',
                              outline: 'none',
                              border: 'none',
                              backgroundColor: '#ffffff !important',
                              fontSize: '0.825rem',
                              color: '#5e565f !important',
                              borderRadius: '4px',
                              cursor:"pointer !important",
                              boxShadow:
                                'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,' +
                                'rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
                            }),
                            placeholder: (base) => ({
                              ...base,
                              color: '#5e565f !important', 
                              fontSize: '0.825rem',
                              fontWeight: '400 !important'
                            }),
                            option: (base, state) => ({
                              ...base,
                              color:'#5e565f !important',
                              fontSize: '0.825rem',
                              padding: '10px',
                            }),

                          }}
                          placeholder='select product name from column'
                          />

                          {formik?.errors.productName && formik?.touched.productName && (
                              <div className={styles.fieldError}>
                                {formik?.errors.productName}
                              </div>
                          )}
                        </div>
                          )
                        }
                        {/* Enter Bid Price */}
                        {
                          isEditing && (
                            <div className={isEditing?styles.fieldDiv:styles.newFieldDiv}>
                              <label className={styles.fieldFormLabel}>
                                {getFieldLabel("Bid Price")}
                                {isEditing && (
                                  <span className={styles.labelStamp}>*</span>
                                )}
                              </label>
                              <div className={isEditing?styles.newFieldFormDiv:styles.fieldFormDiv}>
                                <input
                                  name="amount"
                                  type="numeric"
                                  placeholder="Enter Bid Price"
                                  value={isEditing?(formik?.values.amount||""):(`${formik?.values.amount} USD`) }
                                  onBlur={formik?.handleBlur}
                                  onChange={formik?.handleChange}
                                  disabled={!isEditing}
                                  className={isEditing ? styles.fieldFormInput: styles.fieldFormNonEditInput}
                                />
                                {formik?.errors.amount && formik?.touched.amount && (
                                  <div className={styles.fieldError}>
                                    {formik?.errors.amount}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        }
                        {/* Enter Timeline */}
                        {
                          isEditing && (
                             <div className={isEditing?styles.fieldDiv:styles.newFieldDiv}>
                                <label className={styles.fieldFormLabel}>
                                  {getFieldLabel("Timeline")}
                                  {isEditing && (
                                    <span className={styles.labelStamp}>*</span>
                                  )}
                                </label>
                                <div className={isEditing?styles.newFieldFormDiv:styles.fieldFormDiv}>
                                  <input
                                    name="timeLine"
                                    type="numeric"
                                    placeholder="Enter the expected delivery duration (in days)"
                                    value={isEditing?(formik?.values.timeLine || ""):(`${formik?.values?.timeLine} Days`)}
                                    onBlur={formik?.handleBlur}
                                    onChange={formik?.handleChange}
                                    disabled={!isEditing}
                                    className={isEditing ? styles.fieldFormInput: styles.fieldFormNonEditInput}
                                  />
                                  {formik?.errors.timeLine &&
                                    formik?.touched.timeLine && (
                                      <div className={styles.fieldError}>
                                        {formik?.errors.timeLine}
                                      </div>
                                  )}
                                </div>
                             </div>
                          )
                        }

                        {/* product name para*/}
                        {
                          !isEditing && (
                            <div className={styles.newFieldDiv}>
                              <p className={styles.generalInfoLabel}>Submitted Product Name</p>
                              <p className={styles.generalInfoValue}>{formik.values.productName}</p>
                            </div>
                          )
                        }

                        {/* submitted bid price para */}
                        {
                          !isEditing && (
                            <div className={styles.newFieldDiv}>
                              <p className={styles.generalInfoLabel}>Submitted Bid Price</p>
                              <p className={styles.generalInfoValue}>{formik.values.amount}</p>
                            </div>
                          )
                        }


                      </div>
                      
                      <div className={isEditing?styles.newFieldForm : styles.fieldForm}>
                        {/* submitted bid timeline para */}
                        {
                          !isEditing && (
                            <div className={styles.newFieldDiv}>
                              <p className={styles.generalInfoLabel}>Submitted Bid Timeline</p>
                              <p className={styles.generalInfoValue}>{formik.values.timeLine}</p>
                            </div>
                          )
                        }
                        {/* submitted tnc */}
                        {
                          !isEditing && (
                            <div className={styles.newFieldDiv}>
                              <p className={styles.generalInfoLabel}>Submitted Terms And Condition</p>
                              <p className={styles.generalInfoValue}>
                                {formik.values.tnc.length > 100 ? (
                                  <div>
                                    <span>{formik.values.tnc.substring(0,150) + "..."}</span>
                                    <span id="tnc-tooltip" className={styles.viewmoreSpan}>view more</span>
                                    <Tooltip
                                    content={formik?.values?.tnc}
                                    anchorId="tnc-tooltip"
                                    place="bottom-start"
                                    delayHide={500}
                                    className={styles.toolTip}
                                    />
                                  </div>
                                ) : (
                                  formik.values.tnc
                                )}
                              </p>

                            </div>
                          )
                        }
                        {
                          isEditing && (
                          <div className={ isEditing?styles.fieldDiv2:styles.editingFalseFieldDiv2}>
                          <label className={styles.fieldFormLabel}>
                            {getFieldLabel("Terms And Condition")}
                            {isEditing && (
                              <span className={styles.labelStamp}>*</span>
                            )}
                          </label>
                         {
                          isEditing? (
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
                          )
                          :
                          (
                            <p className={styles.tncPara}>{savedValue.tnc}</p>
                          )
                         }
                          {formik?.touched?.tnc && formik?.errors?.tnc && (
                            <span className={styles.error}>
                              {formik?.errors?.tnc}
                            </span>
                          )}
                        </div>
                          )
                        }
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
                            className={`${styles.fieldCancelButton} ${isDisabled ? styles.disabledCancel : styles.disabledNotCancel}`}
                            disabled={isDisabled}
                            onClick={handleCancel}
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
