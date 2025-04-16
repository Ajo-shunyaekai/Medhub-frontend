import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-tooltip/dist/react-tooltip.css";
import countryList from "react-select-country-list";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Country, State, City } from "country-state-city";
import categoryArrays from "../../../../utils/Category";
import EditCertificate from "./EditCertificate";
import EditFile from "./EditFile";
import './edit.css';
import styles from "./edit.module.css";
import { Formik, Form, Field } from "formik";
import DatePicker from "react-date-picker";
import * as Yup from "yup";
import moment from "moment";
import { MdClose } from "react-icons/md";

// MultiSelectOption Component
const MultiSelectOption = ({ children, ...props }) => (
  <components.Option {...props}>
    <input type="checkbox" checked={props.isSelected} onChange={() => null} />{" "}
    <label>{children}</label>
  </components.Option>
);

// MultiSelectDropdown Component
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

// Define options arrays
const Options = [
  { value: "manufacturer", label: "Manufacturer" },
  { value: "distributor", label: "Distributor" },
  { value: "medical practitioner", label: "Medical Practitioner" },
];

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  cNCFileNDate: Yup.array()
    .of(
      Yup.object().shape({
        file: Yup.mixed().required("File is required"),
        date: Yup.date()
          .required("Date is required")
          .min(new Date(), "Date must be in the future"),
      })
    )
    .min(1, "At least one certificate is required"),
  safetyDatasheetNew: Yup.array().max(4, "Maximum 4 files allowed"),
  healthHazardRatingNew: Yup.array().max(4, "Maximum 4 files allowed"),
  environmentalImpactNew: Yup.array().max(4, "Maximum 4 files allowed"),
  licenseExpiry: Yup.date()
    .nullable()
    .min(new Date(), "License Expiry Date must be in the future"),
});

const Edit = ({ productDetail, id }) => {
  // State for form data
  const [formData, setFormData] = useState({
    originCountry: "",
    operationCountries: [],
    categories: [],
  });

  // State for country, state, city selection
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [mobile, setMobile] = useState("");
  const [category, setCategory] = useState([]);
  const [companyType, setCompanyType] = useState(null);
  const [userType, setUserType] = useState("");

  // Country list for select
  const countries = countryList().getData();

  // Determine user type from URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("/admin/edit-details/supplier")) {
      setUserType("supplier");
    } else if (path.includes("/admin/edit-details/buyer")) {
      setUserType("buyer");
    }
  }, []);

  // Populate category options from categoryArrays
  useEffect(() => {
    const categoryOptions = categoryArrays?.map((cat) => ({
      value: cat.name,
      label: cat.name,
    }));
    setCategory(categoryOptions || []);
  }, []);

  // Handlers for form changes
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedState(null);
    setSelectedCity(null);
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedCity(null);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  const handleCountryOriginChange = (option) => {
    setFormData({ ...formData, originCountry: option ? option.value : "" });
  };

  const handleOperationCountriesChange = (selectedOptions) => {
    setFormData({ ...formData, operationCountries: selectedOptions });
  };

  const handleCategoriesChange = (selectedOptions) => {
    setFormData({ ...formData, categories: selectedOptions });
  };

  // Placeholder for dropdown button label
  const getDropdownButtonLabel = ({ value }) => {
    if (!value || value.length === 0) return "Select...";
    return value.map((item) => item.label).join(", ");
  };

  // Initial values for the form
  const initialValues = {
    cNCFileNDate: [
      {
        file: [],
        date: "",
        preview: false,
      },
    ],
    complianceFile: [],
    complianceFileNew: [],
    safetyDatasheet: [],
    safetyDatasheetNew: [],
    healthHazardRating: [],
    healthHazardRatingNew: [],
    environmentalImpact: [],
    environmentalImpactNew: [],
    phoneNumber: "",
    mobile: "",
    companyName: "",
    companyRegistrationNo: "",
    gstVatNo: "",
    billingAddress: "",
    areaLocality: "",
    landmark: "",
    pincode: "",
    salesPersonName: "",
    licenseNo: "",
    licenseExpiry: null,
    tags: "",
    aboutCompany: "",
    bankDetails: "",
    tradeActivityCode: "",
    contactName: "",
    email: "",
    designation: "",
    yearlyPurchaseValue: "",
  };

  return (
    <div className={styles.container}>
      <div className={styles.headContainer}>
        <span className={styles.heading}>Edit Details</span>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log("Form submitted:", values, "ID:", id);
          // Handle form submission here, you can use `id` for your logic
        }}
      >
        {({ values, setFieldValue, setFieldTouched, touched, errors, handleBlur }) => {
          // Define handlePhoneChange inside Formik to access setFieldValue
          const handlePhoneChange = (name, value) => {
            setMobile(value);
            setFieldValue(name, value);
          };

          return (
            <Form className={styles.form}>
              <div className={styles.section}>
                <span className={styles.formHead}>Company Details</span>
                <div className={styles.formSection}>
                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Company Type<span className={styles?.labelStamp}>*</span>
                    </label>
                    <Select
                      className={styles.formSelect}
                      options={Options}
                      placeholder="Select Company Type"
                      onChange={(option) => setCompanyType(option)}
                    />
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Company Name<span className={styles?.labelStamp}>*</span>
                    </label>
                    <Field
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Company Name"
                      name="companyName"
                    />
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Company Registration No.
                      <span className={styles?.labelStamp}>*</span>
                    </label>
                    <Field
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Company Registration No."
                      name="companyRegistrationNo"
                    />
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      GST/VAT Registration No<span className={styles?.labelStamp}>*</span>
                    </label>
                    <Field
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter GST/VAT Registration No"
                      name="gstVatNo"
                    />
                    {touched.gstVatNo && errors.gstVatNo && (
                      <span className={styles.error}>{errors.gstVatNo}</span>
                    )}
                  </div>

                  {userType !== "supplier" && (
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Company Email ID
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <Field
                        className={styles.formInput}
                        type="text"
                        placeholder="Enter Company Email ID"
                        name="email"
                      />
                    </div>
                  )}

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Company Phone No.
                      <span className={styles?.labelStamp}>*</span>
                    </label>
                    <PhoneInput
                      defaultCountry="us"
                      name="phoneNumber"
                      value={values.phoneNumber}
                      onChange={(value) => handlePhoneChange("phoneNumber", value)}
                    />
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Company Billing Address
                      <span className={styles?.labelStamp}>*</span>
                    </label>
                    <Field
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Company Billing Address"
                      name="billingAddress"
                    />
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Area/Locality/Road Name
                      <span className={styles?.labelStamp}>*</span>
                    </label>
                    <Field
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Area/Locality/Road Name"
                      name="areaLocality"
                    />
                    {touched.areaLocality && errors.areaLocality && (
                      <span className={styles.error}>{errors.areaLocality}</span>
                    )}
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>Landmark</label>
                    <Field
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Landmark"
                      name="landmark"
                    />
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Country
                      <span className={styles?.labelStamp}>*</span>
                    </label>
                    <Select
                      options={Country.getAllCountries()}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.isoCode}
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      placeholder="Select Country"
                    />
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>State/Province</label>
                    <Select
                      options={
                        selectedCountry
                          ? [
                            ...State.getStatesOfCountry(selectedCountry.isoCode),
                            { name: "Other", isoCode: "OTHER" },
                          ]
                          : []
                      }
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.isoCode}
                      value={selectedState}
                      onChange={handleStateChange}
                      placeholder="Select State"
                    />
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>City/Town</label>
                    <Select
                      options={
                        selectedState && selectedState.isoCode !== "OTHER"
                          ? [
                            ...City.getCitiesOfState(
                              selectedState.countryCode,
                              selectedState.isoCode
                            ),
                            { name: "Other" },
                          ]
                          : [{ name: "Other" }]
                      }
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.name}
                      value={selectedCity}
                      onChange={handleCityChange}
                      placeholder="Select City"
                    />
                    {touched.city && errors.city && (
                      <span className={styles.error}>{errors.city}</span>
                    )}
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>Pincode/Postcode</label>
                    <Field
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Pincode/Postcode"
                      name="pincode"
                    />
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>Sales Person Name</label>
                    <Field
 applause
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Sales Person Name"
                      name="salesPersonName"
                    />
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Country of Origin
                      <span className={styles?.labelStamp}>*</span>
                    </label>
                    <Select
                      className="signup-forms-sections-select"
                      options={countries}
                      value={countries.find(
                        (option) => option.value === formData.originCountry
                      )}
                      onChange={handleCountryOriginChange}
                    />
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>Country of Operation</label>
                    {countries.length > 0 && (
                      <MultiSelectDropdown
                        className="signup-forms-sections-select custom-multi-select"
                        options={countries}
                        value={formData.operationCountries}
                        onChange={handleOperationCountriesChange}
                        getDropdownButtonLabel={getDropdownButtonLabel}
                        style={{ width: "100%!important" }}
                      />
                    )}
                    {touched.operationCountries && errors.operationCountries && (
                      <span className={styles.error}>{errors.operationCountries}</span>
                    )}
                  </div>

                  {userType !== "supplier" && (
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Approx. Yearly Purchase Value
                      </label>
                      <Field
                        className={styles.formInput}
                        type="text"
                        placeholder="Enter Approx. Yearly Purchase Value"
                        name="yearlyPurchaseValue"
                      />
                    </div>
                  )}

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>Company License No.</label>
                    <Field
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Company License No."
                      name="licenseNo"
                    />
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      License Expiry / Renewal Date
                    </label>
                    <DatePicker
                      className={styles.formInput}
                      onChange={(date) => setFieldValue("licenseExpiry", date)}
                      value={values.licenseExpiry}
                      minDate={new Date()}
                      format="dd/MM/yyyy"
                      placeholder="dd/MM/yyyy"
                      clearIcon={null}
                    />
                    {touched.licenseExpiry && errors.licenseExpiry && (
                      <span className={styles.error}>{errors.licenseExpiry}</span>
                    )}
                  </div>

                  {userType !== "buyer" && (
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Tags
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      <Field
                        className={styles.formInput}
                        type="text"
                        placeholder="Enter Tags"
                        name="tags"
                      />
                    </div>
                  )}

                  {userType !== "supplier" && (
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Interested in
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      {category.length > 0 && (
                        <MultiSelectDropdown
                          className="signup-forms-sections-select custom-multi-select"
                          options={category}
                          value={formData.categories}
                          onChange={handleCategoriesChange}
                          getDropdownButtonLabel={getDropdownButtonLabel}
                          style={{ width: "100%!important" }}
                        />
                      )}
                      {touched.categories && errors.categories && (
                        <span className={styles.error}>{errors.categories}</span>
                      )}
                    </div>
                  )}

                  {userType !== "buyer" && (
                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>
                        Categories you Trade In
                        <span className={styles?.labelStamp}>*</span>
                      </label>
                      {category.length > 0 && (
                        <MultiSelectDropdown
                          className="signup-forms-sections-select custom-multi-select"
                          options={category}
                          value={formData.categories}
                          onChange={handleCategoriesChange}
                          getDropdownButtonLabel={getDropdownButtonLabel}
                          style={{ width: "100%!important" }}
                        />
                      )}
                      {touched.categories && errors.categories && (
                        <span className={styles.error}>{errors.categories}</span>
                      )}
                    </div>
                  )}

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      About Company
                      <span className={styles?.labelStamp}>*</span>
                    </label>
                    <Field
                      as="textarea"
                      className={styles.formInput}
                      placeholder="Enter About Company"
                      name="aboutCompany"
                    />
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Bank Details
                      <span className={styles?.labelStamp}>*</span>
                    </label>
                    <Field
                      as="textarea"
                      className={styles.formInput}
                      placeholder="Enter Bank Details"
                      name="bankDetails"
                    />
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Business/Trade Activity Code
                      <span className={styles?.labelStamp}>*</span>
                    </label>
                    <Field
                      as="textarea"
                      className={styles.formInput}
                      placeholder="Enter Business/Trade Activity Code"
                      name="tradeActivityCode"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <span className={styles.formHead}>Contact Details</span>
                <div className={styles.formSection}>
                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Contact Name<span className={styles?.labelStamp}>*</span>
                    </label>
                    <Field
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Contact Name"
                      name="contactName"
                    />
                    {touched.contactName && errors.contactName && (
                      <span className={styles.error}>{errors.contactName}</span>
                    )}
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Email ID
                      <span className={styles?.labelStamp}>*</span>
                    </label>
                    <div className={styles.tooltipContainer}>
                      <Field
                        className={styles.formInput}
                        type="text"
                        placeholder="Enter Email ID"
                        name="email"
                      />
                    </div>
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Mobile No.
                      <span className={styles?.labelStamp}>*</span>
                    </label>
                    <PhoneInput
                      defaultCountry="gb"
                      name="mobile"
                      value={values.mobile}
                      onChange={(value) => handlePhoneChange("mobile", value)}
                    />
                  </div>

                  <div className={styles.productContainer}>
                    <label className={styles.formLabel}>
                      Designation
                      <span className={styles?.labelStamp}>*</span>
                    </label>
                    <Field
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Designation"
                      name="designation"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.formHeadSection}>
                  <span className={styles.formHead}>Certificate</span>
                  <span
                    className={styles.formAddButton}
                    onClick={() => {
                      if (values.cNCFileNDate.length < 4) {
                        setFieldValue("cNCFileNDate", [
                          ...values.cNCFileNDate,
                          {
                            file: [],
                            date: "",
                            preview: false,
                          },
                        ]);
                      }
                    }}
                  >
                    Add More
                  </span>
                </div>

                {values.cNCFileNDate.map((ele, index) => (
                  <div key={`certification_${index}`} className={styles.formSection}>
                    <Field name={`cNCFileNDate.${index}.file`}>
                      {({ field }) => (
                        <EditCertificate
                          fieldInputName={`cNCFileNDate.${index}.file`}
                          setFieldValue={setFieldValue}
                          initialValues={values}
                          label="Upload Certificate"
                          selectedFile={ele.file}
                          preview={ele.preview}
                          fileIndex={index}
                          isEdit={false}
                        />
                      )}
                    </Field>
                    <span className={styles.error}>
                      {touched.cNCFileNDate?.[index]?.file &&
                        errors.cNCFileNDate?.[index]?.file}
                    </span>

                    <div className={styles.productContainer}>
                      <label className={styles.formLabel}>Date of Expiry</label>
                      <div className={styles.tooltipContainer}>
                        <DatePicker
                          className={styles.formDate}
                          clearIcon={null}
                          format="dd/MM/yyyy"
                          placeholder="dd/MM/yyyy"
                          name={`cNCFileNDate.${index}.date`}
                          value={ele.date ? new Date(ele.date) : null}
                          minDate={new Date()}
                          onChange={(date) => {
                            setFieldValue(`cNCFileNDate.${index}.date`, date);
                            setFieldTouched(`cNCFileNDate.${index}.date`, true, true);
                          }}
                          onBlur={handleBlur}
                          disabledDate={(current) =>
                            current && current < moment().endOf("day")
                          }
                        />
                      </div>
                      <span className={styles.error}>
                        {touched.cNCFileNDate?.[index]?.date &&
                          errors.cNCFileNDate?.[index]?.date}
                      </span>
                    </div>

                    {values.cNCFileNDate.length > 1 && (
                      <div
                        className={styles.formCloseSection}
                        onClick={() => {
                          setFieldValue(`cNCFileNDate.${index}.file`, []);
                          setFieldValue(`cNCFileNDate.${index}.date`, "");
                          setFieldValue(`cNCFileNDate.${index}.preview`, false);

                          const updatedList = values.cNCFileNDate.filter(
                            (_, elindex) => elindex !== index
                          );
                          const updatedList2 = values.complianceFile.filter(
                            (_, elindex) => elindex !== index
                          );
                          setFieldValue("cNCFileNDate", updatedList);
                          setFieldValue("complianceFile", updatedList2);
                        }}
                      >
                        <span className={styles.formclose}>
                          <MdClose className={styles.icon} />
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.section}>
                <span className={styles.formHead}>Documents</span>
                <div className={styles.formSection}>
                  <EditFile
                    productDetails={productDetail}
                    maxFiles={4 - (values.safetyDatasheet?.length || 0)}
                    fieldInputName="safetyDatasheetNew"
                    oldFieldName="safetyDatasheet"
                    existingFiles={values.safetyDatasheet}
                    setFieldValue={setFieldValue}
                    initialValues={values}
                    label="Upload Company Logo"
                    acceptTypes={{
                      "image/png": [],
                      "image/jpeg": [],
                      "image/jpg": [],
                      "application/pdf": [],
                    }}
                  />

                  <EditFile
                    productDetails={productDetail}
                    maxFiles={4 - (values.healthHazardRating?.length || 0)}
                    fieldInputName="healthHazardRatingNew"
                    oldFieldName="healthHazardRating"
                    existingFiles={values.healthHazardRating}
                    setFieldValue={setFieldValue}
                    initialValues={values}
                    label="Upload Trade License"
                    acceptTypes={{
                      "image/png": [],
                      "image/jpeg": [],
                      "image/jpg": [],
                      "application/pdf": [],
                    }}
                  />

                  {companyType?.value === "medical practitioner" && (
                    <EditFile
                      productDetails={productDetail}
                      maxFiles={4 - (values.environmentalImpact?.length || 0)}
                      fieldInputName="environmentalImpactNew"
                      oldFieldName="environmentalImpact"
                      existingFiles={values.environmentalImpact}
                      setFieldValue={setFieldValue}
                      initialValues={values}
                      label="Upload Medical Practitioner Certificate"
                      acceptTypes={{
                        "image/png": [],
                        "image/jpeg": [],
                        "image/jpg": [],
                        "application/pdf": [],
                      }}
                    />
                  )}
                </div>
              </div>

              <div className={styles.buttonContainer}>
                <button type="button" className={styles.buttonCancel}>
                  Cancel
                </button>
                <button type="submit" className={styles.buttonSubmit}>
                  Submit
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Edit;