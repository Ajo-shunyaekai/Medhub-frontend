import React, { useEffect, useState } from "react";
import styles from "./createBid.module.css";
import "../../../../Supplier/components/Products/AddProduct/addproduct.css";
import "../../../../Supplier/components/SharedComponents/Signup/signup.css";
import { Field, Form, Formik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import DatePicker from "react-date-picker";
import { toast } from "react-toastify";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import {
  bidTypeOptions,
  bidValidationSchema,
  countryOptions,
  docReqOptions,
  initialValues,
  openForOptions,
  stateOptions,
} from "../helper";
import { categoriesData } from "../../../../utils/Category";
import Select, { components } from "react-select";
import countryList from "react-select-country-list";
import CreatableSelect from "react-select/creatable";
import { useNavigate } from "react-router-dom";
import DocumentUpload from "../FileUpload";
import { addBid } from "../../../../redux/reducers/bidSlice";
import { useDispatch } from "react-redux";
 
const getDropdownButtonLabel = ({ placeholderButtonLabel, value }) => {
  if (value && value.length) {
    return value.map((country) => country.label).join(", ");
  }
  return placeholderButtonLabel;
};
 
const MultiSelectOption = ({ children, ...props }) => (
  <components.Option {...props}>
    <input type="checkbox" checked={props.isSelected} onChange={() => null} />{" "}
    <label>{children}</label>
  </components.Option>
);
 
const MultiSelectDropdown = ({ options, value, onChange }) => {
  return (
    <Select
      options={options}
      isMulti
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      components={{ Option: MultiSelectOption }}
      onChange={onChange}
      value={value}
    />
  );
};
 
const CreateBid = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
 
  /** ---------- CATEGORY + SUBCATEGORY STATE -------------- */
  const [categoryOptions, setCategoryOptions] = useState(
    categoriesData?.map((c) => ({ label: c.name, value: c.name })) || []
  );
 
  const [subcategoryMap, setSubcategoryMap] = useState(() => {
    const map = {};
    categoriesData?.forEach((c) => {
      map[c.name] = c.subCategories.map((s) => s.name);
    });
    return map;
  });
 
  /** ---------- HELPERS -------------- */
  const getSubCategories = (categoryName) =>
    (subcategoryMap[categoryName] || []).map((s) => ({
      value: s,
      label: s,
    }));
 
  const removeFormSection = (index, setFieldValue, values, sectionName) => {
    const updated = values[sectionName].filter((_, i) => i !== index);
    setFieldValue(sectionName, updated);
  };
 
  const handleChangeFormSectionDetails = (
    idx,
    key,
    setFieldValue,
    values,
    newVal,
    sectionName
  ) => {
    const cloned = [...values[sectionName]];
    cloned[idx][key] = newVal;
    setFieldValue(sectionName, cloned);
  };
 
  /** ---------- UseEffects -------------- */
 
  useEffect(() => {
    const options = countryList().getData();
    setCountries(options);
  }, []);
 
  const handleCancel = () => {
    navigate("/buyer/bid");
  };
 
  /** ---------- RENDER -------------- */
  return (
    <div className={styles.container}>
      <div className={styles.headContainer}>
        <span className={styles.heading}>Create Bid</span>
      </div>
 
      <Formik
        initialValues={initialValues}
        validationSchema={bidValidationSchema}
        onSubmit={(values) => {
          try {
            setLoading(true);
            // Create a new FormData object
            const formData = new FormData();
 
            // Append fields as usual
            Object.keys(values).forEach((key) => {
              const value = values[key];
              if (key != "documents" || key != "additionalDetails") {
                if (Array.isArray(value)) {
                  // Append array items under the same key
                  value.forEach((item, index) => {
                    // If it's a file, append it with its index (to ensure uniqueness)
                    if (item instanceof File) {
                      formData.append(key, item); // appends the file
                    } else {
                      formData.append(key, item); // appends non-file array items
                    }
                  });
                } else {
                  formData.append(key, value); // Append regular fields
                }
              }
            });
 
            const documentsUpdated = JSON.stringify(
              values?.documents?.map((section) => ({
                name: section?.name || "",
                document: section?.document?.[0] || "",
              })) || [
                {
                  name: "",
                  document: "",
                },
              ]
            );
            const documentsUpdated2 = values?.documents?.map((section) => ({
              name: section?.name || "",
              document: section?.document?.[0] || "",
            })) || [
              {
                name: "",
                document: "",
              },
            ];
 
            if (
              JSON.stringify(values?.bidDocs) !=
              JSON.stringify(documentsUpdated2?.map((file) => file?.document))
            ) {
              // fisetFieldValue("bidDocs", []);
              documentsUpdated2?.forEach((file) =>
                formData.append("bidDocs", file?.document)
              );
            }
 
            const additionalDetailsUpdated = JSON.stringify(
              values?.additionalDetails?.map((section) => ({
                ...section,
                fromCountries:
                  section?.fromCountries?.length > 0
                    ? section?.fromCountries?.map((country) => country?.label)
                    : [] || [],
              }))
            );
 
            formData.append("documents", documentsUpdated);
            formData.append("userId", localStorage?.getItem("_id"));
            formData.append("additionalDetails", additionalDetailsUpdated);
            formData.append("userType", "Buyer");
            // formData.append("status", "Active");
 
            dispatch(addBid(formData)).then((response) => {
              if (response?.meta.requestStatus === "fulfilled") {
                setLoading(false);
                navigate(-1);
              }
            });
          } catch (error) {
            toast.error(error);
          } finally {
            setLoading(false);
          }
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          setFieldValue,
          setFieldTouched,
          touched,
          errors,
        }) => (
          <Form className={styles.form}>
            {/* ---------- General Info ---------- */}
            <div className={styles.section}>
              {console.log("ERRORS ", errors)}
              {console.log("values ", values)}
              <span className={styles.formHead}>General Information</span>
              <div className={styles.formSection}>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Bid Start Date<span className={styles.labelStamp}>*</span>
                  </label>
                  <DatePicker
                    className={styles.formDate}
                    clearIcon={null}
                    format="dd/MM/yyyy"
                    placeholder="dd/MM/yyyy"
                    name="startDate"
                    value={values.startDate}
                    minDate={new Date()}
                    onChange={(date) => {
                      setFieldValue("startDate", date);
                    }}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                  {touched?.startDate && errors?.startDate && (
                    <span className={styles.error}>{errors?.startDate}</span>
                  )}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Bid End Date<span className={styles.labelStamp}>*</span>
                  </label>
                  <DatePicker
                    className={styles.formDate}
                    clearIcon={null}
                    format="dd/MM/yyyy"
                    placeholder="dd/MM/yyyy"
                    name="endDate"
                    value={values.endDate}
                    minDate={
                      values.startDate ? new Date(values.startDate) : new Date()
                    }
                    onChange={(date) => {
                      setFieldValue("endDate", date);
                    }}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                  {touched?.endDate && errors?.endDate && (
                    <span className={styles.error}>{errors?.endDate}</span>
                  )}
                </div>
              </div>
              <div className={styles.formSection}>
                <div className={styles.productTextContainer}>
                  <label className={styles.formLabel}>
                    Bid Description<span className={styles.labelStamp}>*</span>
                  </label>
                  <textarea
                    className={styles.formInput}
                    name="description"
                    rows={5}
                    placeholder="Enter Description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched?.description && errors?.description && (
                    <span className={styles.error}>{errors?.description}</span>
                  )}
                </div>
              </div>
            </div>
 
            {/* ---------- Requirement Documents ---------- */}
            <div className={styles.section}>
              <div className={styles.Stocksection}>
                <div className={styles.formHeadSection}>
                  <span className={styles.formHead}>Requirement Documents</span>
                  <span
                    className={styles.formAddButton}
                    onClick={() =>
                      setFieldValue("documents", [
                        ...values.documents,
                        {
                          name: undefined,
                          document: [],
                        },
                      ])
                    }
                  >
                    Add More
                  </span>
                </div>
 
                {values.documents.map((section, index) => {
                  return (
                    <>
                      <div
                        key={`stocked_${index}`}
                        className={styles.stockedContainer2}
                      >
                        <div className={styles.stockedSection}>
                          {/* ----- Document Name ------ */}
                          <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                              Document Name
                              <span className={styles.labelStamp}>*</span>
                            </label>
                            <input
                              className={styles.formInput}
                              name={`additionalDetails.${index}.name`}
                              value={section.name}
                              placeholder={`Enter Document Name`}
                              onChange={(e) =>
                                handleChangeFormSectionDetails(
                                  index,
                                  "name",
                                  setFieldValue,
                                  values,
                                  e.target.value,
                                  "documents"
                                )
                              }
                            />
 
                            {touched?.documents?.[index]?.name &&
                              errors?.documents?.[index]?.name && (
                                <span className={styles.error}>
                                  {errors?.documents[index].name}
                                </span>
                              )}
                          </div>
 
                          {/* ----- Document File ------ */}
                          {/* File Upload Section */}
                          <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                              Upload Document
                              <span className={styles.labelStamp}>*</span>
                            </label>
                            <Field name={`documents.${index}.document`}>
                              {({ field }) => (
                                <DocumentUpload
                                  fieldInputName={`documents.${index}.document`}
                                  setFieldValue={setFieldValue}
                                  name={`documents.${index}.document`}
                                  initialValues={values}
                                  // label="Upload Document"
                                  selectedFile={section?.document}
                                  preview={section?.preview}
                                  fileIndex={index}
                                  isEdit={false}
                                />
                              )}
                            </Field>
 
                            {touched?.documents?.[index]?.document &&
                              errors?.documents?.[index]?.document && (
                                <span className={styles.error}>
                                  {errors?.documents[index].document}
                                </span>
                              )}
                          </div>
                        </div>
 
                        {/* ---- Remove Section Button ---- */}
                        <div className={styles.formclosebutton}>
                          <CloseIcon
                            className={styles.iconClose}
                            onClick={() => {
                              // Clear form values before removing the row
                              setFieldValue(`documents.${index}.document`, {});
                              setFieldValue(`documents.${index}.name`, "");
                              setFieldValue(
                                `documents.${index}.preview`,
                                false
                              );
 
                              // Remove the row from the array
                              const updatedList = values.documents.filter(
                                (_, elindex) => elindex !== index
                              );
                              const updatedList2 = values.bidDocs.filter(
                                (_, elindex) => elindex !== index
                              );
                              setFieldValue("documents", updatedList);
                              setFieldValue("bidDocs", updatedList2);
                            }}
                          />
                        </div>
                      </div>
                      {values?.documents?.length > 1 &&
                        index != values?.documents?.length - 1 && (
                          <div className={styles.stockedContainer3}></div>
                        )}
                    </>
                  );
                })}
              </div>
            </div>
 
            {/* ---------- Add Products / Services ---------- */}
            <div className={styles.section}>
              <div className={styles.Stocksection}>
                <div className={styles.formHeadSection}>
                  <span className={styles.formHead}>
                    Add Product or Services
                  </span>
                  <span
                    className={styles.formAddButton}
                    onClick={() =>
                      setFieldValue("additionalDetails", [
                        ...values.additionalDetails,
                        {
                          type: undefined,
                          category: undefined,
                          subCategory: undefined,
                          name: undefined,
                          description: undefined,
                          upc: undefined,
                          brand: undefined,
                          quantity: undefined,
                          targetPrice: undefined,
                          country: undefined,
                          selectedCountry: undefined,
                          state: undefined,
                          openFor: undefined,
                          fromCountries: [],
                          delivery: undefined,
                        },
                      ])
                    }
                  >
                    Add More
                  </span>
                </div>
 
                {values.additionalDetails.map((section, index) => {
                  const subCategoryOptions = getSubCategories(section.category);
 
                  return (
                    <>
                      <div
                        key={`stocked_${index}`}
                        className={styles.stockedContainer2}
                      >
                        <div className={styles.stockedSection}>
                          {/* ----- Bid Type ------ */}
                          <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                              Select Bid Type
                              <span className={styles.labelStamp}>*</span>
                            </label>
                            <Select
                              className={styles.formSelect}
                              options={bidTypeOptions}
                              value={
                                bidTypeOptions.find(
                                  (o) => o.value === section.type
                                ) || null
                              }
                              onChange={(opt) =>
                                handleChangeFormSectionDetails(
                                  index,
                                  "type",
                                  setFieldValue,
                                  values,
                                  opt?.value || "",
                                  "additionalDetails"
                                )
                              }
                              name={`additionalDetails.${index}.type`}
                              onBlur={() =>
                                setFieldTouched(
                                  `additionalDetails.${index}.type`,
                                  true
                                )
                              }
                            />
                            {touched?.additionalDetails?.[index]?.type &&
                              errors?.additionalDetails?.[index]?.type && (
                                <span className={styles.error}>
                                  {errors?.additionalDetails[index].type}
                                </span>
                              )}
                          </div>
 
                          {/* ----- Product / Service Name ------ */}
                          <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                              {section.type || "Item"} Name
                              <span className={styles.labelStamp}>*</span>
                            </label>
                            <input
                              className={styles.formInput}
                              value={section.name}
                              placeholder={`Enter ${
                                section.type || "Item"
                              } Name`}
                              onChange={(e) =>
                                handleChangeFormSectionDetails(
                                  index,
                                  "name",
                                  setFieldValue,
                                  values,
                                  e.target.value,
                                  "additionalDetails"
                                )
                              }
                            />
                            {touched?.additionalDetails?.[index]?.name &&
                              errors?.additionalDetails?.[index]?.name && (
                                <span className={styles.error}>
                                  {errors?.additionalDetails[index].name}
                                </span>
                              )}
                          </div>
 
                          {/* ----- Product / Service CATEGORY (Creatable) ------ */}
                          <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                              {section.type || "Item"} Category
                              <span className={styles.labelStamp}>*</span>
                            </label>
                            <CreatableSelect
                              className={styles.formSelect}
                              options={categoryOptions}
                              placeholder="Select or Create Category"
                              value={
                                categoryOptions.find(
                                  (o) => o.value === section.category
                                ) || null
                              }
                              onChange={(opt, meta) => {
                                if (meta.action === "create-option" && opt) {
                                  setCategoryOptions((prev) => [
                                    ...prev,
                                    { label: opt.value, value: opt.value },
                                  ]);
                                  setSubcategoryMap((prev) => ({
                                    ...prev,
                                    [opt.value]: [],
                                  }));
                                }
                                handleChangeFormSectionDetails(
                                  index,
                                  "category",
                                  setFieldValue,
                                  values,
                                  opt?.value || "",
                                  "additionalDetails"
                                );
                                // reset subCategory when category changes
                                handleChangeFormSectionDetails(
                                  index,
                                  "subCategory",
                                  setFieldValue,
                                  values,
                                  "",
                                  "additionalDetails"
                                );
                              }}
                              name={`additionalDetails.${index}.category`}
                              onBlur={() =>
                                setFieldTouched(
                                  `additionalDetails.${index}.category`,
                                  true
                                )
                              }
                            />
                            {touched?.additionalDetails?.[index]?.category &&
                              errors?.additionalDetails?.[index]?.category && (
                                <span className={styles.error}>
                                  {errors?.additionalDetails[index].category}
                                </span>
                              )}
                          </div>
 
                          {/* ----- Product / Service Sub Category (Creatable) ------ */}
                          <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                              {section.type || "Item"} Sub Category
                              <span className={styles.labelStamp}>*</span>
                            </label>
                            <CreatableSelect
                              className={styles.formSelect}
                              placeholder="Select or Create Sub Category"
                              options={subCategoryOptions}
                              value={
                                section.subCategory
                                  ? {
                                      label: section.subCategory,
                                      value: section.subCategory,
                                    }
                                  : null
                              }
                              onChange={(opt, meta) => {
                                const selectedCategory = section.category;
                                const newVal = opt?.value || "";
                                if (
                                  meta.action === "create-option" &&
                                  selectedCategory
                                ) {
                                  setSubcategoryMap((prev) => {
                                    const current =
                                      prev[selectedCategory] || [];
                                    return current.includes(newVal)
                                      ? prev
                                      : {
                                          ...prev,
                                          [selectedCategory]: [
                                            ...current,
                                            newVal,
                                          ],
                                        };
                                  });
                                }
 
                                handleChangeFormSectionDetails(
                                  index,
                                  "subCategory",
                                  setFieldValue,
                                  values,
                                  newVal,
                                  "additionalDetails"
                                );
                              }}
                              name={`additionalDetails.${index}.subCategory`}
                              isDisabled={!section.category}
                            />
                            {touched?.additionalDetails?.[index]?.subCategory &&
                              errors?.additionalDetails?.[index]
                                ?.subCategory && (
                                <span className={styles.error}>
                                  {errors?.additionalDetails[index].subCategory}
                                </span>
                              )}
                          </div>
 
                          {/* ----- UPC (Universal Product Code) ------ */}
                          <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                              UPC (Universal Product Code)
                              <span className={styles.labelStamp}>*</span>
                            </label>
                            <input
                              className={styles.formInput}
                              value={section.upc}
                              placeholder={`Enter ${
                                section.type || "Item"
                              } UPC`}
                              onChange={(e) =>
                                handleChangeFormSectionDetails(
                                  index,
                                  "upc",
                                  setFieldValue,
                                  values,
                                  e.target.value,
                                  "additionalDetails"
                                )
                              }
                            />
                            {touched?.additionalDetails?.[index]?.upc &&
                              errors?.additionalDetails?.[index]?.upc && (
                                <span className={styles.error}>
                                  {errors?.additionalDetails[index].upc}
                                </span>
                              )}
                          </div>
 
                          {/* ----- Brand Name ------ */}
                          <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                              Brand Name
                              <span className={styles.labelStamp}>*</span>
                            </label>
                            <input
                              className={styles.formInput}
                              value={section.brand}
                              placeholder={`Enter Brand Name`}
                              onChange={(e) =>
                                handleChangeFormSectionDetails(
                                  index,
                                  "brand",
                                  setFieldValue,
                                  values,
                                  e.target.value,
                                  "additionalDetails"
                                )
                              }
                            />
                            {touched?.additionalDetails?.[index]?.brand &&
                              errors?.additionalDetails?.[index]?.brand && (
                                <span className={styles.error}>
                                  {errors?.additionalDetails[index].brand}
                                </span>
                              )}
                          </div>
 
                          {/* ----- Open For ------ */}
                          <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                              Open For
                              <span className={styles.labelStamp}>*</span>
                            </label>
                            <Select
                              className={styles.formSelect}
                              options={openForOptions}
                              value={
                                openForOptions.find(
                                  (o) => o.value === section.openFor
                                ) || null
                              }
                              onChange={(opt) =>
                                handleChangeFormSectionDetails(
                                  index,
                                  "openFor",
                                  setFieldValue,
                                  values,
                                  opt?.value || "",
                                  "additionalDetails"
                                )
                              }
                              name={`additionalDetails.${index}.openFor`}
                              onBlur={() =>
                                setFieldTouched(
                                  `additionalDetails.${index}.openFor`,
                                  true
                                )
                              }
                            />
                            {touched?.additionalDetails?.[index]?.openFor &&
                              errors?.additionalDetails?.[index]?.openFor && (
                                <span className={styles.error}>
                                  {errors?.additionalDetails[index].openFor}
                                </span>
                              )}
                          </div>
 
                          {/* ----- From Countries ------ */}
                          <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                              From Countries
                              <span className={styles.labelStamp}>*</span>
                            </label>
                            {countries.length > 0 && (
                              <MultiSelectDropdown
                                className={`${styles.customMultiSelect} ${styles.signupFormsSectionsSelect}`}
                                options={countries}
                                value={section.fromCountries}
                                onBlur={() =>
                                  setFieldTouched(
                                    `additionalDetails.${index}.fromCountries`,
                                    true
                                  )
                                }
                                onChange={(opt) =>
                                  handleChangeFormSectionDetails(
                                    index,
                                    "fromCountries",
                                    setFieldValue,
                                    values,
                                    opt,
                                    "additionalDetails"
                                  )
                                }
                                getDropdownButtonLabel={getDropdownButtonLabel}
                                style={{ width: "100%!important" }}
                              />
                            )}
                            {touched?.additionalDetails?.[index]
                              ?.fromCountries &&
                              errors?.additionalDetails?.[index]
                                ?.fromCountries && (
                                <span className={styles.error}>
                                  {
                                    errors?.additionalDetails[index]
                                      .fromCountries
                                  }
                                </span>
                              )}
                          </div>
 
                          {/* ----- Country of Destination ------ */}
                          <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                              Country of Destination
                              <span className={styles.labelStamp}>*</span>
                            </label>
                            <Select
                              className={styles.formSelect}
                              options={countryOptions}
                              value={
                                countryOptions.find(
                                  (o) => o.value === section.country
                                ) || null
                              }
                              onChange={(opt) => {
                                handleChangeFormSectionDetails(
                                  index,
                                  "country",
                                  setFieldValue,
                                  values,
                                  opt?.value || "",
                                  "additionalDetails"
                                );
                                handleChangeFormSectionDetails(
                                  index,
                                  "selectedCountry",
                                  setFieldValue,
                                  values,
                                  opt?.isoCode || "",
                                  "additionalDetails"
                                );
                              }}
                              name={`additionalDetails.${index}.country`}
                              onBlur={() =>
                                setFieldTouched(
                                  `additionalDetails.${index}.country`,
                                  true
                                )
                              }
                            />
                            {touched?.additionalDetails?.[index]?.country &&
                              errors?.additionalDetails?.[index]?.country && (
                                <span className={styles.error}>
                                  {errors?.additionalDetails[index].country}
                                </span>
                              )}
                          </div>
 
                          {/* ----- State of Destination ------ */}
                          <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                              State of Destination
                              <span className={styles.labelStamp}>*</span>
                            </label>
                            <Select
                              className={styles.formSelect}
                              options={stateOptions(section.selectedCountry)}
                              value={
                                stateOptions(section.selectedCountry).find(
                                  (o) => o.value === section.state
                                ) || null
                              }
                              onChange={(opt) =>
                                handleChangeFormSectionDetails(
                                  index,
                                  "state",
                                  setFieldValue,
                                  values,
                                  opt?.value || "",
                                  "additionalDetails"
                                )
                              }
                              name={`additionalDetails.${index}.state`}
                              onBlur={() =>
                                setFieldTouched(
                                  `additionalDetails.${index}.state`,
                                  true
                                )
                              }
                            />
                            {touched?.additionalDetails?.[index]?.state &&
                              errors?.additionalDetails?.[index]?.state && (
                                <span className={styles.error}>
                                  {errors?.additionalDetails[index].state}
                                </span>
                              )}
                          </div>
 
                          {/* ----- Certification Required ------ */}
                          <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                              Select Certification Required
                              <span className={styles.labelStamp}>*</span>
                            </label>
                            <Select
                              className={styles.formSelect}
                              options={docReqOptions}
                              value={
                                docReqOptions.find(
                                  (o) => o.value === section.docReq
                                ) || null
                              }
                              onChange={(opt) =>
                                handleChangeFormSectionDetails(
                                  index,
                                  "docReq",
                                  setFieldValue,
                                  values,
                                  opt?.value || "",
                                  "additionalDetails"
                                )
                              }
                              name={`additionalDetails.${index}.docReq`}
                              onBlur={() =>
                                setFieldTouched(
                                  `additionalDetails.${index}.docReq`,
                                  true
                                )
                              }
                            />
                            {touched?.additionalDetails?.[index]?.docReq &&
                              errors?.additionalDetails?.[index]?.docReq && (
                                <span className={styles.error}>
                                  {errors?.additionalDetails[index].docReq}
                                </span>
                              )}
                          </div>
 
                          {/* ----- Certification Name ------ */}
                          {section?.docReq == "Yes" && (
                            <div className={styles.productContainer}>
                              <label className={styles.formLabel}>
                                Certification Name
                                <span className={styles.labelStamp}>*</span>
                              </label>
                              <input
                                className={styles.formInput}
                                name={`additionalDetails.${index}.certificateName`}
                                value={section.certificateName}
                                placeholder={`Add comma(,) to add multiple Certification Name`}
                                onChange={(e) =>
                                  handleChangeFormSectionDetails(
                                    index,
                                    "certificateName",
                                    setFieldValue,
                                    values,
                                    e.target.value,
                                    "additionalDetails"
                                  )
                                }
                              />
                              {touched?.additionalDetails?.[index]
                                ?.certificateName &&
                                errors?.additionalDetails?.[index]
                                  ?.certificateName && (
                                  <span className={styles.error}>
                                    {
                                      errors?.additionalDetails[index]
                                        .certificateName
                                    }
                                  </span>
                                )}
                            </div>
                          )}
 
                          {/* ----- Quantity Required ------ */}
                          <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                              Quantity Required
                              <span className={styles.labelStamp}>*</span>
                            </label>
                            <input
                              className={styles.formInput}
                              value={section.quantity}
                              placeholder={`Enter Quantity Required`}
                              onChange={(e) =>
                                handleChangeFormSectionDetails(
                                  index,
                                  "quantity",
                                  setFieldValue,
                                  values,
                                  e.target.value.replace(/\D/g, ""), // Allow only numbers
                                  "additionalDetails"
                                )
                              }
                            />
                            {touched?.additionalDetails?.[index]?.quantity &&
                              errors?.additionalDetails?.[index]?.quantity && (
                                <span className={styles.error}>
                                  {errors?.additionalDetails[index].quantity}
                                </span>
                              )}
                          </div>
 
                          {/* ----- Target Price ------ */}
                          <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                              Target Price
                              <span className={styles.labelStamp}>*</span>
                            </label>
                            <input
                              className={styles.formInput}
                              value={section.targetPrice}
                              placeholder={`Enter Target Price`}
                              onChange={(e) =>
                                handleChangeFormSectionDetails(
                                  index,
                                  "targetPrice",
                                  setFieldValue,
                                  values,
                                  e.target.value.replace(/\D/g, ""), // Allow only numbers
                                  "additionalDetails"
                                )
                              }
                            />
                            {touched?.additionalDetails?.[index]?.targetPrice &&
                              errors?.additionalDetails?.[index]
                                ?.targetPrice && (
                                <span className={styles.error}>
                                  {errors?.additionalDetails[index].targetPrice}
                                </span>
                              )}
                          </div>
 
                          {/* ----- Expected Delivery duration ------ */}
                          <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                              Expected Delivery Duration
                              <span className={styles.labelStamp}>*</span>
                            </label>
                            <input
                              className={styles.formInput}
                              value={section.delivery}
                              onBlur={() =>
                                setFieldTouched(
                                  `additionalDetails.${index}.openFor`,
                                  true
                                )
                              }
                              placeholder={`Enter Expected Delivery Duration (in days)`}
                              onChange={(e) =>
                                handleChangeFormSectionDetails(
                                  index,
                                  "delivery",
                                  setFieldValue,
                                  values,
                                  e.target.value.replace(/\D/g, ""), // Allow only numbers
                                  "additionalDetails"
                                )
                              }
                            />
                            {touched?.additionalDetails?.[index]?.delivery &&
                              errors?.additionalDetails?.[index]?.delivery && (
                                <span className={styles.error}>
                                  {errors?.additionalDetails[index].delivery}
                                </span>
                              )}
                          </div>
 
                          {/* ----- Product / Service Description ------ */}
                          <div className={styles.productTextContainer2}>
                            <label className={styles.formLabel}>
                              {section.type || "Item"} Description
                              <span className={styles.labelStamp}>*</span>
                            </label>
                            <textarea
                              className={styles.formInput}
                              rows={5}
                              name={`additionalDetails.${index}.description`}
                              placeholder={`Enter ${
                                section.type || "Item"
                              } Description`}
                              value={section.description}
                              onBlur={() =>
                                setFieldTouched(
                                  `additionalDetails.${index}.description`,
                                  true
                                )
                              }
                              onChange={(e) =>
                                handleChangeFormSectionDetails(
                                  index,
                                  "description",
                                  setFieldValue,
                                  values,
                                  e?.target?.value,
                                  "additionalDetails"
                                )
                              }
                            />
                            {touched?.additionalDetails?.[index]?.description &&
                              errors?.additionalDetails?.[index]
                                ?.description && (
                                <span className={styles.error}>
                                  {
                                    errors?.additionalDetails?.[index]
                                      ?.description
                                  }
                                </span>
                              )}
                          </div>
                        </div>
 
                        {/* ---- Remove Section Button ---- */}
                        <div className={styles.formclosebutton}>
                          <CloseIcon
                            className={styles.iconClose}
                            onClick={() =>
                              removeFormSection(
                                index,
                                setFieldValue,
                                values,
                                "additionalDetails"
                              )
                            }
                          />
                        </div>
                      </div>
                      {values?.additionalDetails?.length > 1 &&
                        index != values?.additionalDetails?.length - 1 && (
                          <div className={styles.stockedContainer3}></div>
                        )}
                    </>
                  );
                })}
              </div>
            </div>
 
            {/* ---------- Buttons ---------- */}
            <div className={styles.buttonContainer}>
              <button
                className={styles.buttonSubmit}
                type="submit"
                disabled={loading}
              >
                {loading ? <div className="loading-spinner"></div> : "Submit"}
              </button>
              <button
                className={styles.buttonCancel}
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
 
export default CreateBid;