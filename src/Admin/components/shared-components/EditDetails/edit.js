import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import "../../../assets/style/react-input-phone.css"
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
import "./edit.css";
import styles from "./edit.module.css";
import { Formik, Form, Field, useFormik, FormikProvider } from "formik";
import DatePicker from "react-date-picker";
import moment from "moment";
import { MdClose } from "react-icons/md";
import {
  buyererOptions,
  initialValues,
  setInitFormValues,
  supplierOptions,
  validationSchema,
} from "./helper";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import { parsePhoneNumberFromString, AsYouType } from "libphonenumber-js";
import { fetchOtherUserData } from "../../../../redux/reducers/userDataSlice";

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

const Edit = () => {
  const { userType, id } = useParams();
  const dispatch = useDispatch();
  const { otherUserDetails } = useSelector((state) => state.userReducer);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Custom submit handler with e.preventDefault()
    },
  });

  useEffect(() => {
    userType && id && dispatch(fetchOtherUserData({ userType, id }));
  }, [id]);

  useEffect(() => {
    setInitFormValues(formik, otherUserDetails);
  }, [otherUserDetails]);

  // State for country, state, city selection
  const [mobile, setMobile] = useState("");
  const [category, setCategory] = useState([]);

  // Country list for select
  const countries = countryList()?.getData();

  // Populate category options from categoryArrays
  useEffect(() => {
    const categoryOptions = categoryArrays?.map((cat) => ({
      value: cat.name,
      label: cat.name,
    }));
    setCategory(categoryOptions || []);
  }, []);

  // Placeholder for dropdown button label
  const getDropdownButtonLabel = ({ value }) => {
    if (!value || value?.length === 0) return "Select...";
    return value?.map((item) => item.label)?.join(", ");
  };

  // Define handlePhoneChange inside Formik to access setFieldValue
  const handlePhoneChange = (name, value) => {
   
    formik.setFieldError(name, "");

    try {
      const phoneNumber = parsePhoneNumber(value);

      if (phoneNumber && isValidPhoneNumber(value)) {
        const countryCode = phoneNumber.countryCallingCode;
        const nationalNumber = phoneNumber.nationalNumber;
        const formattedNumber = `+${countryCode} ${nationalNumber}`;

        // Also update Formik field value (if you're syncing both)
        formik.setFieldValue(name, formattedNumber);
      } else {
        const errorMsg = "Invalid phone number";

        // Set both local error and Formik error
        formik.setFieldError(name, errorMsg);
      }
    } catch (error) {
      // In case of parsing errors
      formik.setFieldError(name, "Invalid phone format");
    }
  };

  return (
    <div className={styles?.container}>
      <div className={styles?.headContainer}>
        <span className={styles?.heading}>Edit Details</span>
      </div>
      <FormikProvider value={formik}>
        <form className={styles?.form}>
          <div className={styles?.section}>
            <span className={styles?.formHead}>Company Details</span>
            <div className={styles?.formSection}>
              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Company Type<span className={styles?.labelStamp}>*</span>
                </label>
                <Select
                  className={styles?.formSelect}
                  options={
                    userType === "supplier" ? supplierOptions : buyererOptions
                  }
                  name={
                    userType === "supplier" ? "supplier_type" : "buyer_type"
                  }
                  placeholder="Select Company Type"
                  value={(userType === "supplier"
                    ? supplierOptions
                    : buyererOptions
                  )?.find(
                    (option) =>
                      option?.value ===
                      (userType === "supplier"
                        ? formik?.values?.supplier_type
                        : formik?.values?.buyer_type)
                  )}
                  onChange={(option) => {
                    formik?.setFieldValue(
                      userType === "supplier" ? "supplier_type" : "buyer_type",
                      option?.value
                    );
                  }}
                />
                {userType === "supplier"
                  ? formik?.touched?.supplier_type &&
                    formik?.errors?.supplier_type && (
                      <span className={styles?.error}>
                        {formik?.errors?.supplier_type}
                      </span>
                    )
                  : formik?.touched?.buyer_type &&
                    formik?.errors?.buyer_type && (
                      <span className={styles?.error}>
                        {formik?.errors?.buyer_type}
                      </span>
                    )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Company Name<span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Company Name"
                  name={
                    userType === "supplier" ? "supplier_name" : "buyer_name"
                  }
                  value={
                    userType === "supplier"
                      ? formik?.values?.supplier_name
                      : formik?.values?.buyer_name
                  }
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {userType === "supplier"
                  ? formik?.touched?.supplier_name &&
                    formik?.errors?.supplier_name && (
                      <span className={styles?.error}>
                        {formik?.errors?.supplier_name}
                      </span>
                    )
                  : formik?.touched?.buyer_name &&
                    formik?.errors?.buyer_name && (
                      <span className={styles?.error}>
                        {formik?.errors?.buyer_name}
                      </span>
                    )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Company Registration No.
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Company Registration No."
                  name="registration_no"
                  value={formik?.values?.registration_no}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.registration_no &&
                  formik?.errors?.registration_no && (
                    <span className={styles?.error}>
                      {formik?.errors?.registration_no}
                    </span>
                  )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  GST/VAT Registration No
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter GST/VAT Registration No"
                  name="vat_reg_no"
                  value={formik?.values?.vat_reg_no}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.vat_reg_no && formik?.errors?.vat_reg_no && (
                  <span className={styles?.error}>
                    {formik?.errors?.vat_reg_no}
                  </span>
                )}
              </div>

              {userType === "buyer" && (
                <div className={styles?.productContainer}>
                  <label className={styles?.formLabel}>
                    Company Email ID
                    <span className={styles?.labelStamp}>*</span>
                  </label>
                  <Field
                    className={styles?.formInput}
                    type="text"
                    placeholder="Enter Company Email ID"
                    name="buyer_email"
                    value={formik?.values?.buyer_email}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                  />
                  {formik?.touched?.buyer_email &&
                    formik?.errors?.buyer_email && (
                      <span className={styles?.error}>
                        {formik?.errors?.buyer_email}
                      </span>
                    )}
                </div>
              )}

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Company Phone No.
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <PhoneInput
                  defaultCountry="us"
                  name="buyer_mobile"
                  value={formik?.values?.buyer_mobile}
                  onChange={(value) => handlePhoneChange("buyer_mobile", value)}
                />
                {formik?.touched?.buyer_mobile &&
                  formik?.errors?.buyer_mobile && (
                    <span className={styles?.error}>
                      {formik?.errors?.buyer_mobile}
                    </span>
                  )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Company Billing Address
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Company Billing Address"
                  name={
                    userType === "supplier"
                      ? "supplier_address"
                      : "buyer_address"
                  }
                  value={
                    userType === "supplier"
                      ? formik?.values?.supplier_address
                      : formik?.values?.buyer_address
                  }
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {userType === "supplier"
                  ? formik?.touched?.supplier_address &&
                    formik?.errors?.supplier_address && (
                      <span className={styles?.error}>
                        {formik?.errors?.supplier_address}
                      </span>
                    )
                  : formik?.touched?.buyer_address &&
                    formik?.errors?.buyer_address && (
                      <span className={styles?.error}>
                        {formik?.errors?.buyer_address}
                      </span>
                    )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Area/Locality/Road Name
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Area/Locality/Road Name"
                  name="locality"
                  value={formik?.values?.locality}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.locality && formik?.errors?.locality && (
                  <span className={styles?.error}>
                    {formik?.errors?.locality}
                  </span>
                )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>Landmark</label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Landmark"
                  name="land_mark"
                  value={formik?.values?.land_mark}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Country
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Select
                  options={Country?.getAllCountries()}
                  getOptionLabel={(option) => option?.name}
                  getOptionValue={(option) => option?.isoCode}
                  name="country"
                  value={Country?.getAllCountries()?.find(
                    (country) => country?.name == formik?.values?.country
                  )}
                  onChange={(country) => {
                    formik?.setFieldValue("country", country?.name);
                    formik?.setFieldValue("state", "");
                    formik?.setFieldValue("city", "");
                  }}
                  placeholder="Select Country"
                />
                {formik?.touched?.country && formik?.errors?.country && (
                  <span className={styles?.error}>
                    {formik?.errors?.country}
                  </span>
                )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>State/Province</label>
                <Select
                  options={
                    Country?.getAllCountries()?.find(
                      (country) => country?.name == formik?.values?.country
                    )
                      ? [
                          ...State.getStatesOfCountry(
                            Country?.getAllCountries()?.find(
                              (country) =>
                                country?.name == formik?.values?.country
                            )?.isoCode
                          ),
                          { name: "Other", isoCode: "OTHER" },
                        ]
                      : []
                  }
                  getOptionLabel={(option) => option?.name}
                  getOptionValue={(option) => option?.isoCode}
                  value={[
                    ...State.getStatesOfCountry(
                      Country?.getAllCountries()?.find(
                        (country) => country?.name == formik?.values?.country
                      )?.isoCode
                    ),
                    { name: "Other", isoCode: "OTHER" },
                  ]?.find((state) => state?.name == formik?.values?.state)}
                  onChange={(state) => {
                    formik?.setFieldValue("state", state?.name);
                    formik?.setFieldValue("city", "");
                  }}
                  placeholder="Select State"
                />
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>City/Town</label>
                <Select
                  options={
                    [
                      ...State.getStatesOfCountry(
                        Country?.getAllCountries()?.find(
                          (country) => country?.name == formik?.values?.country
                        )?.isoCode
                      ),
                      { name: "Other", isoCode: "OTHER" },
                    ]?.find((state) => state?.name == formik?.values?.state) &&
                    [
                      ...State.getStatesOfCountry(
                        Country?.getAllCountries()?.find(
                          (country) => country?.name == formik?.values?.country
                        )?.isoCode
                      ),
                      { name: "Other", isoCode: "OTHER" },
                    ]?.find((state) => state?.name == formik?.values?.state)
                      .isoCode !== "OTHER"
                      ? [
                          ...City.getCitiesOfState(
                            [
                              ...State.getStatesOfCountry(
                                Country?.getAllCountries()?.find(
                                  (country) =>
                                    country?.name == formik?.values?.country
                                )?.isoCode
                              ),
                              { name: "Other", isoCode: "OTHER" },
                            ]?.find(
                              (state) => state?.name == formik?.values?.state
                            )?.countryCode,
                            [
                              ...State.getStatesOfCountry(
                                Country?.getAllCountries()?.find(
                                  (country) =>
                                    country?.name == formik?.values?.country
                                )?.isoCode
                              ),
                              { name: "Other", isoCode: "OTHER" },
                            ]?.find(
                              (state) => state?.name == formik?.values?.state
                            )?.isoCode
                          ),
                          { name: "Other" },
                        ]
                      : [{ name: "Other" }]
                  }
                  getOptionLabel={(option) => option?.name}
                  getOptionValue={(option) => option?.name}
                  value={[
                    ...City.getCitiesOfState(
                      [
                        ...State.getStatesOfCountry(
                          Country?.getAllCountries()?.find(
                            (country) =>
                              country?.name == formik?.values?.country
                          )?.isoCode
                        ),
                        { name: "Other", isoCode: "OTHER" },
                      ]?.find((state) => state?.name == formik?.values?.state)
                        ?.countryCode,
                      [
                        ...State.getStatesOfCountry(
                          Country?.getAllCountries()?.find(
                            (country) =>
                              country?.name == formik?.values?.country
                          )?.isoCode
                        ),
                        { name: "Other", isoCode: "OTHER" },
                      ]?.find((state) => state?.name == formik?.values?.state)
                        ?.isoCode
                    ),
                    { name: "Other" },
                  ]?.find((city) => city?.name == formik?.values?.city)}
                  onChange={(city) => {
                    formik?.setFieldValue("city", city?.name);
                  }}
                  placeholder="Select City"
                />
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>Pincode/Postcode</label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Pincode/Postcode"
                  name="pincode"
                  value={formik?.values?.pincode}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>Medhub Global Sales Representative</label>
                <Field
                  applause
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Medhub Global Sales Representative Name"
                  name="sales_person_name"
                  value={formik?.values?.sales_person_name}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Country of Origin
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Select
                  className="signup-forms-sections-select"
                  options={countries}
                  value={countries?.find(
                    (option) =>
                      option.label === formik?.values?.country_of_origin
                  )}
                  onChange={(option) => {
                    formik?.setFieldValue("country_of_origin", option?.label);
                  }}
                />
                {formik?.touched?.country_of_origin &&
                  formik?.errors?.country_of_origin && (
                    <span className={styles?.error}>
                      {formik?.errors?.country_of_origin}
                    </span>
                  )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Country of Operation
                </label>
                {countries?.length > 0 && (
                  <MultiSelectDropdown
                    className="signup-forms-sections-select custom-multi-select"
                    options={countries}
                    value={
                      formik.values?.country_of_operation?.map((country) =>
                        countries?.find((c) => c.label === country)
                      ) || []
                    }
                    onChange={(selectedOptions) => {
                      const selectedValues = selectedOptions?.map(
                        (option) => option.label
                      );
                      formik.setFieldValue(
                        "country_of_operation",
                        selectedValues
                      );
                    }}
                    getDropdownButtonLabel={getDropdownButtonLabel}
                    style={{ width: "100%!important" }}
                  />
                )}
                {formik?.touched?.country_of_operation &&
                  formik?.errors?.country_of_operation && (
                    <span className={styles?.error}>
                      {formik.errors.country_of_operation}
                    </span>
                  )}
              </div>

              {userType === "buyer" && (
                <div className={styles?.productContainer}>
                  <label className={styles?.formLabel}>
                    Approx. Yearly Purchase Value
                  </label>
                  <Field
                    className={styles?.formInput}
                    type="text"
                    placeholder="Enter Approx. Yearly Purchase Value"
                    name="approx_yearly_purchase_value"
                    value={formik?.values?.approx_yearly_purchase_value}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                  />
                </div>
              )}

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>Company License No.</label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Company License No."
                  name="license_no"
                  value={formik?.values?.license_no}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  License Expiry/Renewal Date
                </label>
                <DatePicker
                  className={styles?.formInput}
                  name="license_expiry_date"
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                  value={formik?.values?.license_expiry_date}
                  minDate={new Date()}
                  format="dd/MM/yyyy"
                  placeholder="dd/MM/yyyy"
                  clearIcon={null}
                />
              </div>

              {userType === "supplier" && (
                <div className={styles?.productContainer}>
                  <label className={styles?.formLabel}>
                    Tags
                    <span className={styles?.labelStamp}>*</span>
                  </label>
                  <Field
                    className={styles?.formInput}
                    type="text"
                    placeholder="Enter Tags"
                    name="tags"
                    value={formik?.values?.tags}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                  />
                  {formik?.touched?.tags && formik?.errors?.tags && (
                    <span className={styles?.error}>
                      {formik?.errors?.tags}
                    </span>
                  )}
                </div>
              )}

              {userType === "buyer" && (
                <div className={styles?.productContainer}>
                  <label className={styles?.formLabel}>Interested in</label>
                  {category.length > 0 && (
                    <MultiSelectDropdown
                      className="signup-forms-sections-select custom-multi-select"
                      options={category}
                      value={
                        formik.values?.interested_in?.map((cat) =>
                          category?.find((c) => c.label === cat)
                        ) || []
                      }
                      onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions?.map(
                          (option) => option.label
                        );
                        formik.setFieldValue("interested_in", selectedValues);
                      }}
                      getDropdownButtonLabel={getDropdownButtonLabel}
                      style={{ width: "100%!important" }}
                    />
                  )}
                  {formik?.touched?.interested_in &&
                    formik?.errors?.interested_in && (
                      <span className={styles?.error}>
                        {formik.errors.interested_in}
                      </span>
                    )}
                </div>
              )}

              {userType === "supplier" && (
                <div className={styles?.productContainer}>
                  <label className={styles?.formLabel}>
                    Categories you Trade In
                    <span className={styles?.labelStamp}>*</span>
                  </label>
                  {category?.length > 0 && (
                    <MultiSelectDropdown
                      className="signup-forms-sections-select custom-multi-select"
                      options={category}
                      value={
                        formik.values?.categories?.map((cat) =>
                          category?.find((c) => c.label === cat)
                        ) || []
                      }
                      onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions?.map(
                          (option) => option.label
                        );
                        formik.setFieldValue("categories", selectedValues);
                      }}
                      getDropdownButtonLabel={getDropdownButtonLabel}
                      style={{ width: "100%!important" }}
                    />
                  )}
                  {formik?.touched?.categories &&
                    formik?.errors?.categories && (
                      <span className={styles?.error}>
                        {formik?.errors?.categories}
                      </span>
                    )}
                </div>
              )}

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  About Company
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  as="textarea"
                  className={styles?.formInput}
                  placeholder="Enter About Company"
                  name="description"
                  value={formik?.values?.description}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.description &&
                  formik?.errors?.description && (
                    <span className={styles?.error}>
                      {formik?.errors?.description}
                    </span>
                  )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Bank Details
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  as="textarea"
                  className={styles?.formInput}
                  placeholder="Enter Bank Details"
                  name="bank_details"
                  value={formik?.values?.bank_details}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.bank_details &&
                  formik?.errors?.bank_details && (
                    <span className={styles?.error}>
                      {formik?.errors?.bank_details}
                    </span>
                  )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Business/Trade Activity Code
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  as="textarea"
                  className={styles?.formInput}
                  placeholder="Enter Business/Trade Activity Code"
                  name="activity_code"
                  value={formik?.values?.activity_code}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.activity_code &&
                  formik?.errors?.activity_code && (
                    <span className={styles?.error}>
                      {formik?.errors?.activity_code}
                    </span>
                  )}
              </div>
            </div>
          </div>

          <div className={styles?.section}>
            <span className={styles?.formHead}>Contact Details</span>
            <div className={styles?.formSection}>
              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Contact Name<span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Contact Name"
                  name="contact_person_name"
                  value={formik?.values?.contact_person_name}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.contact_person_name &&
                  formik?.errors?.contact_person_name && (
                    <span className={styles?.error}>
                      {formik?.errors?.contact_person_name}
                    </span>
                  )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Email ID
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Contact Name"
                  name="contact_person_email"
                  value={formik?.values?.contact_person_email}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.contact_person_email &&
                  formik?.errors?.contact_person_email && (
                    <span className={styles?.error}>
                      {formik?.errors?.contact_person_email}
                    </span>
                  )}
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Mobile No.
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <PhoneInput
                  className="signup-form-section-phone-input"
                  defaultCountry="gb"
                  name="mobile"
                  value={mobile}
                  onChange={(value) => {
                    handlePhoneChange("mobile", value);
                    setMobile(value);
                  }}
                />
                
                <span className={styles?.error}>
                  
                </span>
             
              </div>

              <div className={styles?.productContainer}>
                <label className={styles?.formLabel}>
                  Designation
                  <span className={styles?.labelStamp}>*</span>
                </label>
                <Field
                  className={styles?.formInput}
                  type="text"
                  placeholder="Enter Designation"
                  name="designation"
                  value={formik?.values?.designation}
                  onChange={formik?.handleChange}
                  onBlur={formik?.handleBlur}
                />
                {formik?.touched?.designation &&
                  formik?.errors?.designation && (
                    <span className={styles?.error}>
                      {formik?.errors?.designation}
                    </span>
                  )}
              </div>
            </div>
          </div>

          <div className={styles?.section}>
            <div className={styles?.formHeadSection}>
              <span className={styles?.formHead}>Certificate</span>
              <span
                className={styles?.formAddButton}
                onClick={() => {
                  if (formik?.values?.certificateFileNDate?.length < 4) {
                    formik?.setFieldValue("certificateFileNDate", [
                      ...formik?.values?.certificateFileNDate,
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

            {formik?.values?.certificateFileNDate?.map((ele, index) => (
              <div
                key={`certification_${index}`}
                className={styles?.formSection}
              >
                <Field name={`certificateFileNDate.${index}.file`}>
                  {({ field }) => (
                    <EditCertificate
                      fieldInputName={`certificateFileNDate.${index}.file`}
                      setFieldValue={formik?.setFieldValue}
                      initialValues={formik?.values}
                      label="Upload Certificate"
                      selectedFile={ele.file}
                      preview={ele.preview}
                      fileIndex={index}
                      isEdit={false}
                    />
                  )}
                </Field>
                <span className={styles?.error}>
                  {formik?.touched?.certificateFileNDate?.[index]?.file &&
                    formik?.errors?.certificateFileNDate?.[index]?.file}
                </span>

                <div className={styles?.productContainer}>
                  <label className={styles?.formLabel}>Date of Expiry</label>
                  <div className={styles?.tooltipContainer}>
                    <DatePicker
                      className={styles?.formDate}
                      clearIcon={null}
                      format="dd/MM/yyyy"
                      placeholder="dd/MM/yyyy"
                      name={`certificateFileNDate.${index}.date`}
                      value={ele.date ? new Date(ele.date) : null}
                      minDate={new Date()}
                      onChange={(date) => {
                        formik?.setFieldValue(
                          `certificateFileNDate.${index}.date`,
                          date
                        );
                        formik?.setFieldTouched(
                          `certificateFileNDate.${index}.date`,
                          true,
                          true
                        );
                      }}
                      onBlur={formik?.handleBlur}
                      disabledDate={(current) =>
                        current && current < moment()?.endOf("day")
                      }
                    />
                  </div>
                  <span className={styles?.error}>
                    {formik?.touched?.certificateFileNDate?.[index]?.date &&
                      formik?.errors?.certificateFileNDate?.[index]?.date}
                  </span>
                </div>

                {formik?.values?.certificateFileNDate?.length > 1 && (
                  <div
                    className={styles?.formCloseSection}
                    onClick={() => {
                      formik?.setFieldValue(
                        `certificateFileNDate.${index}.file`,
                        []
                      );
                      formik?.setFieldValue(
                        `certificateFileNDate.${index}.date`,
                        ""
                      );
                      formik?.setFieldValue(
                        `certificateFileNDate.${index}.preview`,
                        false
                      );

                      const updatedList =
                        formik?.values?.certificateFileNDate.filter(
                          (_, elindex) => elindex !== index
                        );
                      const updatedList2 =
                        formik?.values?.complianceFile.filter(
                          (_, elindex) => elindex !== index
                        );
                      formik?.setFieldValue(
                        "certificateFileNDate",
                        updatedList
                      );
                      formik?.setFieldValue("complianceFile", updatedList2);
                    }}
                  >
                    <span className={styles?.formclose}>
                      <MdClose className={styles?.icon} />
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles?.section}>
            <span className={styles?.formHead}>Documents</span>
            <div className={styles?.formSection}>
              <EditFile
               
                maxFiles={4 - (formik?.values?.safetyDatasheet?.length || 0)}
                fieldInputName="safetyDatasheetNew"
                oldFieldName="safetyDatasheet"
                existingFiles={formik?.values?.safetyDatasheet}
                setFieldValue={formik?.setFieldValue}
                initialValues={formik?.values}
                label="Upload Company Logo"
                acceptTypes={{
                  "image/png": [],
                  "image/jpeg": [],
                  "image/jpg": [],
                  "application/pdf": [],
                }}
              />

              <EditFile
          
                maxFiles={4 - (formik?.values?.healthHazardRating?.length || 0)}
                fieldInputName="healthHazardRatingNew"
                oldFieldName="healthHazardRating"
                existingFiles={formik?.values?.healthHazardRating}
                setFieldValue={formik?.setFieldValue}
                initialValues={formik?.values}
                label="Upload Trade License"
                acceptTypes={{
                  "image/png": [],
                  "image/jpeg": [],
                  "image/jpg": [],
                  "application/pdf": [],
                }}
              />

              {(userType === "supplier"
                ? formik?.values?.supplier_type
                : formik?.values?.buyer_type) === "Medical Practitioner" && (
                <EditFile
                 
                  maxFiles={
                    4 - (formik?.values?.environmentalImpact?.length || 0)
                  }
                  fieldInputName="environmentalImpactNew"
                  oldFieldName="environmentalImpact"
                  existingFiles={formik?.values?.environmentalImpact}
                  setFieldValue={formik?.setFieldValue}
                  initialValues={formik?.values}
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

          <div className={styles?.buttonContainer}>
            <button type="button" className={styles?.buttonCancel}>
              Cancel
            </button>
            <button type="submit" className={styles?.buttonSubmit}>
              Submit
            </button>
          </div>
        </form>
      </FormikProvider>
    </div>
  );
};

export default Edit;
