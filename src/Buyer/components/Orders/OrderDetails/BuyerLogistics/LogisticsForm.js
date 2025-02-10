import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { PhoneInput } from "react-international-phone";
import styles from "./logistics.module.css";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import Loader from "../../../../components/SharedComponents/Loader/Loader";
import { fetchAddressListRedux } from "../../../../../redux/reducers/addressSlice";
import { bookLogistics } from "../../../../../redux/reducers/orderSlice";

const LogisticsForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId, buyerId } = useParams();
  const { address, updatedAddress } = useSelector(
    (state) => state?.addressReducer
  );

  const [displayAddress, setDisplayAddress] = useState(address?.[0] || {});
  const [addressType, setAddressType] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isRegAddressChecked, setIsRegAddressChecked] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selected, setSelected] = useState(true);

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
      ...(address?.length === 1 && {
        fullName: Yup.string()
          .min(2, "Name is too short")
          .max(50, "Name is too long")
          .required("Full name is required"),
        mobileNumber: Yup.string()
          .required("Mobile number is required")
          .test("is-valid-phone", "Invalid phone number", (value) => {
            try {
              const phoneNumber = parsePhoneNumber(value);
              return phoneNumber && phoneNumber.isValid();
            } catch (error) {
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
      }),
      transportMode: Yup.string().required("Mode of transport is required"),
      extraServices: Yup.array().of(Yup.string()),
    }),
    onSubmit: async (values) => {
      try {
        let apiPayload;

        if (address?.length > 1) {
          // Use displayAddress data when using existing address
          apiPayload = {
            order_id: orderId,
            buyer_id: buyerId,
            full_name: displayAddress?.full_name,
            mobile_number: displayAddress?.mobile_number,
            company_reg_address: displayAddress?.company_reg_address,
            locality: displayAddress?.locality,
            land_mark: displayAddress?.land_mark,
            city: displayAddress?.city,
            state: displayAddress?.state,
            country: displayAddress?.country,
            pincode: displayAddress?.pincode,
            address_type: displayAddress?.type || displayAddress?.address_type,
            mode_of_transport: values.transportMode,
            extra_services: values.extraServices,
          };
        } else {
          // Use form values when creating new address
          apiPayload = {
            order_id: orderId,
            buyer_id: buyerId,
            full_name: values.fullName,
            mobile_number: values.mobileNumber,
            company_reg_address: values.companyAddress,
            locality: values.locality,
            land_mark: values.landmark,
            city: values.city?.label || values.city,
            state: values.state?.label || values.state,
            country: values.country?.label || values.country,
            pincode: values.pincode,
            address_type: values.addressType,
            mode_of_transport: values.transportMode,
            extra_services: values.extraServices,
          };
        }

        const response = await dispatch(bookLogistics({ obj: apiPayload }));

        if (response.meta.requestStatus === "fulfilled") {
          setTimeout(() => {
            navigate(`/buyer/order-details/${orderId}`);
          }, 500);
        }
      } catch (error) {
        toast.error("Something went wrong!");
        console.error("Logistics submission error:", error);
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

  const resetForminlValues = (address) => {
    const initialCountryValue = address?.[0]?.country
      ? {
          value: Country.getAllCountries().find(
            (country) => country.name === address?.[0]?.country
          )?.isoCode,
          label: address?.[0]?.country,
        }
      : null;

    const initialStateValue = address?.[0]?.state
      ? {
          value: State.getStatesOfCountry(
            address?.[0]?.country || selectedCountry?.value
          ).find((state) => state.name === address?.[0]?.state)?.isoCode,
          label: address?.[0]?.state,
        }
      : null;

    const initialCityValue = address?.[0]?.city
      ? {
          value: City.getCitiesOfState(
            address?.[0]?.state || selectedState?.value
          ).find((city) => city.name === address?.[0]?.city)?.name,
          label: address?.[0]?.city,
        }
      : null;
    // Use setValues to update Formik form values
    formik.setValues({
      ...formik.values,
      fullName: address?.[0]?.full_name || "",
      mobileNumber: address?.[0]?.mobile_number || "",
      companyAddress: address?.[0]?.company_reg_address || "",
      locality: address?.[0]?.locality || "",
      landmark: address?.[0]?.land_mark || "",
      country: address?.[0]?.country || null,
      state: address?.[0]?.state || null,
      city: address?.[0]?.city || null,
      pincode: address?.[0]?.pincode || "",
      addressType: address?.[0]?.type || "",
      transportMode: address.transportMode || "",
      extraServices: address.extraServices || [],
      useRegisteredAddress: true,
    });

    setSelectedCountry(initialCountryValue);
    setSelectedState(initialStateValue);
    setSelectedCity(initialCityValue);
  };

  const handlSameAsRegisteredAddress = async (event) => {
    const isChecked = event.target.checked;
    setIsRegAddressChecked(!isRegAddressChecked);
    console.log("Function calleds", event.target.checked);
    try {
      if (isChecked) {
        console.log("addressData", address);
        resetForminlValues(address);
      } else {
        formik.setValues({
          ...formik.values,
          fullName: "",
          mobileNumber: "",
          companyAddress: "",
          locality: "",
          landmark: "",
          country: null,
          state: null,
          city: address?.[0]?.city || null,
          pincode: "",
          addressType: "",
          transportMode: "",
          extraServices: [],
          useRegisteredAddress: true,
        });

        setSelectedCountry(null);
        setSelectedState(null);
        setSelectedCity(null);
      }
    } catch (error) {
      toast.error("Failed to fetch user address details.");
    } finally {
      // setIsLoading(false);
    }
  };
  console.log("ADDRESS", address);

  useEffect(() => {
    dispatch(fetchAddressListRedux(buyerId));
  }, [dispatch]);

  useEffect(() => {
    if (updatedAddress && Object.values(updatedAddress).length > 0) {
      setDisplayAddress(updatedAddress);
    } else if (address && address?.length > 0) {
      setDisplayAddress(address[0]);
    } else {
      setDisplayAddress({});
    }
  }, [updatedAddress, address]);

  console.log("displayAddress", displayAddress);
  console.log("updatedAddress", updatedAddress);

  return (
    <div className={styles.container}>
      <div className={styles.logisticsHeading}>Book Logistics</div>

      <form
        className={styles.formLogistics}
        // onSubmit={(e) => {
        //   e.preventDefault();

        //   if (Object.keys(formik.errors).length === 0) {
        //     formik.handleSubmit();
        //   } else {
        //     toast.error("Please fill the required fields correctly.");
        //   }
        // }}
        onSubmit={(e) => {
          e.preventDefault();
          formik.setTouched({
            fullName: true,
            mobileNumber: true,
            companyAddress: true,
            locality: true,
            landmark: true,
            country: true,
            state: true,
            city: true,
            pincode: true,
            addressType: true,
            transportMode: true,
            extraServices: true,
          });
          // Check if transport mode is selected
          if (!formik.values.transportMode) {
            toast.error("Please select a mode of transport");
            return;
          }

          if (address?.length > 1) {
            // For existing address, just submit
            formik.handleSubmit();
          } else {
            // For new address, check all validations
            if (Object.keys(formik.errors).length === 0) {
              formik.handleSubmit();
            } else {
              toast.error("Please fill all required fields correctly");
            }
          }
        }}
      >
        {address?.length === 1 ? (
          <div className={styles.formInnerClass}>
            <div className={styles.innerHeading}>Drop Details</div>
            <div
              className={styles.checkboxSection}
              onChange={handlSameAsRegisteredAddress}
            >
              <input
                type="checkbox"
                id="termsCheckbox"
                className={styles.checkboxInput}
              />
              <label htmlFor="termsCheckbox" className={styles.checkboxLabel}>
                Same as registered address
              </label>
            </div>
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
                  onBlur={formik.handleBlur}
                  disabled={isRegAddressChecked}
                />
                {formik.touched.fullName && formik.errors.fullName && (
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
                  }}
                  onBlur={formik.handleBlur}
                  disabled={isRegAddressChecked}
                />
                {formik.touched.mobileNumber && formik.errors.mobileNumber && (
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
                  placeholder="Enter Company Billing Address"
                  autoComplete="off"
                  name="companyAddress"
                  value={formik.values.companyAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isRegAddressChecked}
                />
                {formik.touched.companyAddress &&
                  formik.errors.companyAddress && (
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
                  onBlur={formik.handleBlur}
                  disabled={isRegAddressChecked}
                />
                {formik.touched.locality && formik.errors.locality && (
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
                  disabled={isRegAddressChecked}
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
                  onBlur={formik.handleBlur}
                  isDisabled={isRegAddressChecked}
                />
                {formik.touched.country && formik.errors.country && (
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
                          ...State.getStatesOfCountry(
                            selectedCountry.value
                          ).map((state) => ({
                            value: state.isoCode,
                            label: state.name,
                          })),
                          { value: "OTHER", label: "Other" }, // Add "Other" option here
                        ]
                      : []
                  }
                  value={selectedState}
                  onChange={handleStateChange}
                  placeholder="Select State"
                  isDisabled={isRegAddressChecked}
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
                    selectedState
                      ? [
                          ...City.getCitiesOfState(
                            selectedCountry.value,
                            selectedState.value
                          ).map((city) => ({
                            value: city.name,
                            label: city.name,
                          })),
                          { value: "Other", label: "Other" }, // Add "Other" option here
                        ]
                      : []
                  }
                  value={selectedCity}
                  placeholder="Select City"
                  onChange={handleCityChange}
                  isDisabled={isRegAddressChecked}
                />
              </div>
              <div className={styles.logisticesInputSection}>
                <label className={styles.formLabel}>Pincode</label>
                <input
                  className={styles.formInput}
                  type="text"
                  name="pincode"
                  placeholder="Enter your pincode"
                  autoComplete="off"
                  value={formik.values.pincode}
                  onChange={formik.handleChange}
                  disabled={isRegAddressChecked}
                />
              </div>
            </div>
            {!isRegAddressChecked && (
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
                        onBlur={formik.handleBlur}
                      />
                      <label className={styles.radioLabel}>
                        <span className={styles.radioSpan}>{mode.label}</span>
                      </label>
                    </div>
                  ))}
                  {formik.touched.addressType && formik.errors.addressType && (
                    <span className={styles.error_message_formik}>
                      {formik.errors.addressType}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : address?.length > 1 ? (
          <div className={styles.cardContainer}>
            <div className={styles.cardHeadSection}>
              <span className={styles.cardHeading}>Drop Details</span>
              <Link to={`/buyer/logistics-address/${buyerId}`}>
                <span className={styles.cardButton}>Change</span>
              </Link>
            </div>
            <div className={styles.cardInnerContainer}>
              <span className={styles.cardText}>
                {displayAddress?.full_name}
                <span className={styles.cardType}>
                  {displayAddress?.type || displayAddress?.address_type}
                </span>
              </span>
              <span className={styles.cardText}>
                {displayAddress?.company_reg_address}
              </span>
              <span className={styles.cardText}>
                {displayAddress?.locality} {displayAddress?.locality}
              </span>
              <span className={styles.cardText}>
                {displayAddress?.city} {displayAddress?.state}{" "}
                {displayAddress?.country}
              </span>
              <span className={styles.cardText}>{displayAddress?.pincode}</span>
            </div>
          </div>
        ) : null}

        <div className={styles.formInnerClass}>
          <div className={styles.addressContainer}>
            <div className={styles.innerHeading}>
              Mode of Transport<span className={styles.labelstamp}>*</span>
            </div>

            <div className={styles.radioInnerContainer}>
              {[
                {
                  value: "Air Cargo",
                  label: "Air Cargo",
                  description: "(Fastest Delivery & High Charges)",
                },
                {
                  value: "Sea Freight",
                  label: "Sea Freight",
                  description: "(Faster Delivery & Comparatively Low Charges)",
                },
                {
                  value: "Road Freight",
                  label: "Road Freight",
                  description: "(Delivery & Lower Charges)",
                },
                {
                  value: "Logistices",
                  label: "Ask the Logistics Partner to Recommend",
                  description: "",
                },
              ].map((mode) => (
                <div key={mode.value} className={styles.radioGroup}>
                  <input
                    className={styles.radioInput}
                    type="radio"
                    name="transportMode"
                    value={mode.value}
                    checked={formik.values.transportMode === mode.value}
                    onChange={formik.handleChange}
                  />
                  <label className={styles.radioLabel}>
                    <span className={styles.radioSpan}>{mode.label}</span>
                    {mode.description && (
                      <span className={styles.radioText}>
                        {mode.description}
                      </span>
                    )}
                  </label>
                </div>
              ))}
              {formik.errors.transportMode && (
                <span className={styles.error_message_formik}>
                  {formik.errors.transportMode}
                </span>
              )}
            </div>
          </div>
          <div className={styles.addressContainer}>
            <div className={styles.innerHeading}>Extra Services</div>

            <div className={styles.radioInnerContainer}>
              {[
                { value: "Door to Door", label: "Door to Door" },
                { value: "Port to Port", label: "Port to Port" },
                { value: "Custom Clearance", label: "Custom Clearance" },
              ].map((service) => (
                <div key={service.value} className={styles.radioGroup}>
                  <input
                    className={styles.radioInput}
                    type="checkbox"
                    name="extraServices"
                    value={service.value}
                    checked={formik.values.extraServices.includes(
                      service.value
                    )}
                    onChange={handleExtraServicesChange}
                  />
                  <label className={styles.formLabel}>{service.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles["logistic-Button-Section"]}>
          <button
            type="submit"
            className={styles["logistic-submit"]}
            disabled={formik.isSubmitting}
          >
            Request Supplier for Further Details
          </button>
          <div className={styles["logistic-cancel"]}>Cancel</div>
        </div>
      </form>
    </div>
  );
};

export default LogisticsForm;
