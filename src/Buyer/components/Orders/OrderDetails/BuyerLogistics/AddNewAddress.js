import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { PhoneInput } from "react-international-phone";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./logistics.module.css";
import { addAddress } from "../../../../../redux/reducers/addressSlice";
import { toast } from "react-toastify";

const AddNewAddress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId, buyerId } = useParams();
  const [addressType, setAddressType] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const handleChange = (e) => {
    setAddressType(e.target.value);
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      mobileNumber: "",
      companyAddress: "",
      locality: "",
      landmark: "",
      country: null,
      state: null,
      city: null,
      pincode: "",
      addressType: "",
      transportMode: "",
      extraServices: [],
      useRegisteredAddress: false,
    },
    validationSchema: Yup.object().shape({
      fullName: Yup.string()
        .min(2, "Name is too short")
        .max(50, "Name is too long")
        .required("Full name is required"),
      mobileNumber: Yup.string()
        .required("Mobile number is required")
        .test("is-valid-phone", "Invalid phone number", (value) => {
          try {
            const phoneNumber = parsePhoneNumber(value);

            // Validate phone number and return true if it's valid, false if not
            return phoneNumber && phoneNumber.isValid();
          } catch (error) {
            // If parsing fails, mark it as invalid
            return false;
          }
        }),
      companyAddress: Yup.string().required("Company address is required"),
      locality: Yup.string().required("Locality/Town is required"),
      landmark: Yup.string(),
      country: Yup.mixed().required("Country is required"),
      state: Yup.mixed(),
      city: Yup.mixed(),
      pincode: Yup.string()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(4, "Must be at least 4 digits")
        .max(10, "Must be at most 10 digits"),
      addressType: Yup.string().required("Address type is required"),
      transportMode: Yup.string().required("Mode of transport is required"),
      extraServices: Yup.array().of(Yup.string()),
     
    }),
    onSubmit: async (values) => {
      try {
        
          console.log("Form submitted:", values);
          const apiPayload = {
            order_id: orderId,
            buyer_id: buyerId,
            full_name: values?.fullName,
            mobile_number: values?.mobileNumber,
            company_reg_address: values?.companyAddress,
            locality: values?.locality,
            land_mark: values?.landmark,
            city: values?.city?.label || values?.city,
            state: values?.state?.label || values?.state,
            country: values?.country?.label || values?.country,
            pincode: values?.pincode,
            address_type: values?.addressType,
            mode_of_transport: values?.transportMode,
            extra_services: values?.extraServices,
          };
          // Add your API call here
          const response = await dispatch(addAddress({ obj: apiPayload }));
       
      } catch (error) {
        toast.error("Something went wrong!");
      }
    },
  });

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null);
    setSelectedCity(null);
    formik.setFieldValue("country", selectedOption);
  };

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    setSelectedCity(null);
    formik.setFieldValue("state", selectedOption);
  };

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    formik.setFieldValue("city", selectedOption);
  };

  const handlePhoneChange = (name, value) => {
    try {
      const phoneNumber = parsePhoneNumber(value);
      if (phoneNumber && phoneNumber.isValid()) {
        const formattedNumber = phoneNumber.formatInternational();
        formik.setFieldValue(name, formattedNumber);
        formik.setFieldError(name, "");
      } else {
        formik.setFieldValue(name, value);
        formik.setFieldError(name, "Invalid phone number");
      }
    } catch (error) {
      formik.setFieldValue(name, value);
      formik.setFieldError(name, "Invalid phone number");
    }
  };

  const handleExtraServicesChange = (event) => {
    const { value, checked } = event.target;
    const currentServices = formik.values.extraServices;

    if (checked) {
      formik.setFieldValue("extraServices", [...currentServices, value]);
    } else {
      formik.setFieldValue(
        "extraServices",
        currentServices.filter((service) => service !== value)
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logisticsHeading}>Add New Address</div>

      <form
        className={styles.formLogistics}
        onSubmit={(e) => {
          e.preventDefault();

          if (Object.keys(formik.errors).length === 0) {
            formik.handleSubmit();
          } else {
            toast.error("Please fill the required fields correctly.");
          }
        }}
      >
        <div className={styles.formInnerClass}>
          <div className={styles["inner-container"]}>
            <div className={styles.logisticesInputSection}>
              <label className={styles.formLabel}>
                Full Name<span className={styles.labelstamp}>*</span>
              </label>

              <input
                className={styles.formInput}
                type="text"
                placeholder="Enter your full name"
                autoComplete="off"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
              />
              {formik.errors.fullName && (
                <span className={styles.error_message_formik}>
                  {formik.errors.fullName}
                </span>
              )}
            </div>
            <div className={styles.logisticesInputSection}>
              <label className={styles.formLabel}>
                Mobile Number<span className={styles.labelstamp}>*</span>
              </label>
              <PhoneInput
                className="signup-form-section-phone-input"
                defaultCountry={
                  Country.getAllCountries()?.filter(
                    (country) =>
                      country?.phonecode?.replace("+", "") ===
                      address?.[0]?.mobile_number?.replace("+", "")
                  )?.[0]?.isoCode
                }
                name="mobileNumber"
                value={formik.values.mobileNumber}
                onChange={(value) => {
                  handlePhoneChange("mobileNumber", value);
                  //   setMobile(value);
                }}
              />
              {formik.errors.mobileNumber && (
                <span className={styles.error_message_formik}>
                  {formik.errors.mobileNumber}
                </span>
              )}
            </div>
            <div className={styles.logisticesInputSection}>
              <label className={styles.formLabel}>
                Company Billing Address
                <span className={styles.labelstamp}>*</span>
              </label>
              <input
                className={styles.formInput}
                type="text"
                placeholder="House No, Building, Street, Area"
                autoComplete="off"
                name="companyAddress"
                value={formik.values.companyAddress}
                onChange={formik.handleChange}
              />
              {formik.errors.companyAddress && (
                <span className={styles.error_message_formik}>
                  {formik.errors.companyAddress}
                </span>
              )}
            </div>
            <div className={styles.logisticesInputSection}>
              <label className={styles.formLabel}>
                Locality/Town<span className={styles.labelstamp}>*</span>
              </label>
              <input
                className={styles.formInput}
                type="text"
                placeholder="Enter Locality/Road Name"
                autoComplete="off"
                name="locality"
                value={formik.values.locality}
                onChange={formik.handleChange}
              />
              {formik.errors.locality && (
                <span className={styles.error_message_formik}>
                  {formik.errors.locality}
                </span>
              )}
            </div>
            <div className={styles.logisticesInputSection}>
              <label className={styles.formLabel}>Landmark</label>
              <input
                className={styles.formInput}
                type="text"
                placeholder="Enter Landmark"
                autoComplete="off"
                name="landmark"
                value={formik.values.landmark}
                onChange={formik.handleChange}
              />
            </div>
            <div className={styles.logisticesInputSection}>
              <label className={styles.formLabel}>
                Country<span className={styles.labelstamp}>*</span>
              </label>
              <Select
                options={[
                  ...Country.getAllCountries().map((country) => ({
                    value: country.isoCode,
                    label: country.name,
                  })),
                  { value: "OTHER", label: "Other" },
                ]}
                value={selectedCountry} // Use selectedCountry here
                placeholder="Select Country"
                name="country"
                onChange={handleCountryChange}
              />
              {formik.errors.country && (
                <span className={styles.error_message_formik}>
                  {formik.errors.country}
                </span>
              )}
            </div>
            <div className={styles.logisticesInputSection}>
              <label className={styles.formLabel}>State</label>
              <Select
                options={
                  selectedCountry
                    ? [
                        ...State.getStatesOfCountry(selectedCountry.value).map(
                          (state) => ({
                            value: state.isoCode,
                            label: state.name,
                          })
                        ),
                        { value: "OTHER", label: "Other" }, // Add "Other" option here
                      ]
                    : []
                }
                value={selectedState}
                onChange={handleStateChange}
                placeholder="Select State"
              />
              {formik.errors.state && (
                <span className={styles.error_message_formik}>
                  {formik.errors.state}
                </span>
              )}
            </div>
            <div className={styles.logisticesInputSection}>
              <label className={styles.formLabel}>City</label>
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
                onChange={setSelectedCity}
                placeholder="Select City"
              />
            </div>
            <div className={styles.logisticesInputSection}>
              <label className={styles.formLabel}>Pincode</label>
              <input
                className={styles.formInput}
                type="text"
                placeholder="Enter your pincode"
                autoComplete="off"
                value={formik.values.pincode}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          <div className={styles.addressContainer}>
            <div className={styles.innerHeading}>
              Type of Address<span className={styles.labelstamp}>*</span>
            </div>
            <div className={styles.radioInnerContainer}>
              {[
                { value: "Warehouse", label: "Ware House" },
                { value: "Shop", label: "Shop" },
                { value: "Other", label: "Other" },
              ].map((mode) => (
                <div key={mode.value} className={styles.radioGroup}>
                  <input
                    className={styles.radioInput}
                    type="radio"
                    name="addressType"
                    value={mode.value}
                    checked={formik.values.addressType === mode.value}
                    onChange={formik.handleChange}
                  />
                  <label className={styles.radioLabel}>
                    <span className={styles.radioSpan}>{mode.label}</span>
                  </label>
                </div>
              ))}
              {formik.errors.addressType && (
                <span className={styles.error_message_formik}>
                  {formik.errors.addressType}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className={styles["logistic-Button-Section"]}>
          <button
            type="submit"
            className={styles["logistic-submit"]}
            disabled={formik.isSubmitting}
          >
            Save Address
          </button>
          <div className={styles["logistic-cancel"]}>Cancel</div>
        </div>
      </form>
    </div>
  );
};

export default AddNewAddress;
