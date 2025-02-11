import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import "../../SharedComponents/Signup/signup.css";
import styles from "./supplierlogistics.module.css";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import { fetchAddressListRedux } from "../../../../redux/reducers/addressSlice";
import {
  fetchOrderById,
  submitPickupDetails,
} from "../../../../redux/reducers/orderSlice";

const SupplierLogistics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId, supplierId } = useParams();
  const { address, updatedAddress } = useSelector(
    (state) => state?.addressReducer
  );
  const { orderData } = useSelector((state) => state?.orderReducer);
  console.log("ORDERDATA", orderData);
  console.log("supplierId", supplierId);

  const [displayAddress, setDisplayAddress] = useState(address?.[0] || {});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [shrunkContainers, setShrunkContainers] = useState([]);
  const [isRegAddressChecked, setIsRegAddressChecked] = useState(false);
  const [products, setProducts] = useState([]);

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
      billsOfMaterial: [
        {
          productId: "",
          productName: "",
          quantity: "",
          numberOfPackages: "",
        },
      ],
      packages: [
        {
          weight: "",
          dimensions: {
            length: "",
            width: "",
            height: "",
          },
          volume: "",
        },
      ],
      pickupSlot: {
        date: null,
        timeSlot: null,
      },
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
      billsOfMaterial: Yup.array().of(
        Yup.object().shape({
          productId: Yup.string(),
          productName: Yup.string().required("Product name is required"),
          quantity: Yup.number()
            .required("Quantity is required")
            .positive("Quantity must be positive")
            .integer("Quantity must be a whole number"),
          numberOfPackages: Yup.number()
            .required("Number of packages is required")
            .positive("Number of packages must be positive")
            .integer("Must be a whole number"),
        })
      ),

      packages: Yup.array().of(
        Yup.object().shape({
          weight: Yup.number()
            .required("Weight is required")
            .positive("Weight must be positive"),
          dimensions: Yup.object().shape({
            length: Yup.number()
              .required("Length is required")
              .positive("Length must be positive"),
            width: Yup.number()
              .required("Width is required")
              .positive("Width must be positive"),
            height: Yup.number()
              .required("Height is required")
              .positive("Height must be positive"),
          }),
          volume: Yup.number()
            .required("Volume is required")
            .positive("Volume must be positive"),
        })
      ),
      pickupSlot: Yup.object().shape({
        date: Yup.mixed()
          .required("Pickup date is required")
          .test(
            "valid-date",
            "Pickup date is required",
            (value) => value instanceof Date && !isNaN(value)
          ),
        timeSlot: Yup.mixed()
          .required("Pickup time slot is required")
          .test(
            "is-valid-string",
            "Pickup time slot is required",
            (value) => typeof value === "string" && value.trim() !== ""
          ),
      }),
    }),
    // validateOnMount: false,
    // validateOnBlur: true,
    // validateOnChange: false,
    onSubmit: async (values) => {
      try {
        console.log("FOrm", values);
        let apiPayload;

        if (address?.length > 1) {
          console.log("if");
          // Use displayAddress data when using existing address
          apiPayload = {
            order_id: orderId,
            supplier_id: supplierId,
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
            bills_of_material: values.billsOfMaterial.map((bill) => ({
              product_id: bill.productId,
              product_name: bill.productName,
              quantity: bill.quantity,
              quantity: bill.quantity,
              number_of_packages: bill.numberOfPackages,
            })),
            packages: values.packages.map((pkg) => ({
              weight: pkg.weight,
              dimensions: pkg.dimensions,
              volume: pkg.volume,
            })),
            pickup_slot: {
              date: values.pickupSlot.date,
              time_slot: values.pickupSlot.timeSlot,
            },
          };
        } else {
          console.log("else");
          // Use form values when creating new address
          apiPayload = {
            order_id: orderId,
            supplier_id: supplierId,
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
            bills_of_material: values.billsOfMaterial.map((bill) => ({
              product_id: bill.productId,
              product_name: bill.productName,
              quantity: bill.quantity,
              number_of_packages: bill.numberOfPackages,
            })),
            packages: values.packages.map((pkg) => ({
              weight: pkg.weight,
              dimensions: pkg.dimensions,
              volume: pkg.volume,
            })),
            pickup_slot: {
              date: values.pickupSlot.date,
              time_slot: values.pickupSlot.timeSlot,
            },
          };
        }
        console.log("apiPayload", apiPayload);

        const response = await dispatch(
          submitPickupDetails({ obj: apiPayload })
        );

        if (response.meta.requestStatus === "fulfilled") {
          setTimeout(() => {
            navigate(`/supplier/active-orders-details/${orderId}`);
          }, 500);
        }
      } catch (error) {
        toast.error("Something went wrong!");
        console.error("Logistics submission error:", error);
      }
    },
  });

  const handleAddContainer = () => {
    formik.setFieldValue("billsOfMaterial", [
      ...formik.values.billsOfMaterial,
      {
        productId: "",
        productName: "",
        quantity: "",
        numberOfPackages: "",
      },
    ]);
  };

  const handleRemoveContainer = (index) => {
    const newBills = [...formik.values.billsOfMaterial];
    newBills.splice(index, 1);
    formik.setFieldValue("billsOfMaterial", newBills);
  };

  const [packages, setPackages] = useState([
    {
      id: 1,
      weight: "",
      dimensions: { length: "", width: "", height: "" },
      volume: "",
    },
  ]);

  const addPackage = () => {
    formik.setFieldValue("packages", [
      ...formik.values.packages,
      {
        id: formik.values.packages.length + 1,
        weight: "",
        dimensions: { length: "", width: "", height: "" },
        volume: "",
      },
    ]);
  };

  // Function to remove a package
  const removePackage = (id) => {
    formik.setFieldValue(
      "packages",
      formik.values.packages.filter((pkg) => pkg.id !== id)
    );
  };

  // Handle weight and volume input change
  const handleInputChange = (id, field, value) => {
    const updatedPackages = formik.values.packages.map((pkg) =>
      pkg.id === id ? { ...pkg, [field]: value } : pkg
    );
    formik.setFieldValue("packages", updatedPackages);
  };

  // Handle dimension input change
  // const handleDimensionChange = (id, dimension, value) => {
  //   const updatedPackages = formik.values.packages.map((pkg) =>
  //     pkg.id === id
  //       ? { ...pkg, dimensions: { ...pkg.dimensions, [dimension]: value } }
  //       : pkg
  //   );
  //   formik.setFieldValue("packages", updatedPackages);
  // };

  const handleDimensionChange = (id, dimension, value) => {
    const updatedPackages = formik.values.packages.map((pkg) => {
      if (pkg.id === id) {
        // Create new dimensions object with updated dimension
        const newDimensions = {
          ...pkg.dimensions,
          [dimension]: value,
        };

        // Calculate volume if all dimensions are present and are valid numbers
        let volume = "";
        if (
          newDimensions.length &&
          newDimensions.width &&
          newDimensions.height &&
          !isNaN(newDimensions.length) &&
          !isNaN(newDimensions.width) &&
          !isNaN(newDimensions.height)
        ) {
          volume = (
            parseFloat(newDimensions.length) *
            parseFloat(newDimensions.width) *
            parseFloat(newDimensions.height)
          ).toFixed(2);
        }

        // Return updated package with new dimensions and calculated volume
        return {
          ...pkg,
          dimensions: newDimensions,
          volume: volume,
        };
      }
      return pkg;
    });

    // Update both dimensions and volume in formik
    formik.setFieldValue("packages", updatedPackages);
  };

  const quantityOptions = [
    { value: "08:00 AM - 10:00 AM", label: "08:00 AM - 10:00 AM" },
    { value: "10:00 AM  - 12:00 AM", label: "10:00 AM  - 12:00 AM" },
    { value: "12:00 PM - 02:00 PM", label: "12:00 PM - 02:00 PM" },
    { value: "02:00 PM - 04:00 PM", label: "02:00 PM - 04:00 PM" },
    { value: "04:00 AM - 06:00 PM", label: "04:00 AM - 06:00 PM" },
    { value: "06:00 PM - 08:00 PM", label: "06:00 PM - 08:00 PM" },
    { value: "08:00 PM - 10:00 PM", label: "08:00 PM - 10:00 PM" },
  ];

  const productOptions = useMemo(() => {
    if (!orderData?.items) return [];

    return orderData.items.map((item) => ({
      value: item.medicine_id,
      label: item.medicine_name,
      quantity: item.quantity_required,
      strength: item.strength,
    }));
  }, [orderData]);

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

  useEffect(() => {
    dispatch(fetchAddressListRedux(supplierId));
    dispatch(fetchOrderById({ id: orderId }));
    setProducts(
      orderData?.items?.map((product) => ({
        value: product.id,
        label: product.name,
      }))
    );
  }, [dispatch]);

  useEffect(() => {
    if (updatedAddress && Object.values(updatedAddress)?.length > 0) {
      setDisplayAddress(updatedAddress);
    } else if (address && address?.length > 0) {
      setDisplayAddress(address[0]);
    } else {
      setDisplayAddress({});
    }
  }, [updatedAddress, address]);

  console.log("displayAddress", displayAddress);
  console.log("updatedAddress", updatedAddress);
  console.log("ADDRESS", address);
  console.log(
    "rderData?.buyer_logistics_data",
    orderData?.buyer_logistics_data
  );

  const getSelectedProductDetails = (productId) => {
    return orderData?.items?.find((item) => item.medicine_id === productId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.logisticsHeading}>Book Logistics</div>
      {orderData?.buyer_logistics_data &&
        Object.keys(orderData?.buyer_logistics_data).length > 0 && address?.length === 1 && (
          <div className={styles.logisticsCardContainer}>
            <div className={styles.adresssCardContainer}>
              <div className={styles.logisticsMainHeading}>Drop Details</div>
              <div className={styles.nameContainer}>
                <span className={styles.addressText}>
                  {orderData?.buyer_logistics_data?.full_name}
                </span>
                <div className={styles.typeAdresss}>
                  {orderData?.buyer_logistics_data?.address_type}
                </div>
              </div>
              <span className={styles.addressText}>
                {orderData?.buyer_logistics_data?.company_reg_address},{" "}
                {orderData?.buyer_logistics_data?.locality}
              </span>
              <span className={styles.addressText}>
                {orderData?.buyer_logistics_data?.country},{" "}
                {orderData?.buyer_logistics_data?.state},{" "}
                {orderData?.buyer_logistics_data?.city}{" "}
                {orderData?.buyer_logistics_data?.pincode}
              </span>
              <span className={styles.addressText}>
                {orderData?.buyer_logistics_data?.mobile_number}
              </span>
            </div>
            <div className={styles.adresssCardContainer}>
              <div className={styles.logisticsMainHeading}>
                Transport Details
              </div>
              <div className={styles.transportInnerSection}>
                <div className={styles.transportHead}>Mode of Transport</div>
                <div className={styles.transportText}>
                  {orderData?.buyer_logistics_data?.mode_of_transport}
                </div>
              </div>
              {orderData?.buyer_logistics_data?.extra_services?.length > 0 && (
                <div className={styles.transportInnerSection}>
                  <div className={styles.transportHead}>Extra Services</div>
                  <div className={styles.transportText}>
                    {orderData?.buyer_logistics_data?.extra_services?.join(
                      ", "
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      {orderData?.buyer_logistics_data &&
        Object.keys(orderData?.buyer_logistics_data).length > 0 &&
        address?.length > 1 && (
          <div className={styles.logisticsCardContainer}>
            <div className={styles.adresssCardContainer}>
              <div className={styles.logisticsMainHeading}>Drop Details</div>
              <div className={styles.nameContainer}>
                <span className={styles.addressText}>
                  {orderData?.buyer_logistics_data?.full_name}
                </span>
                <div className={styles.typeAdresss}>
                  {orderData?.buyer_logistics_data?.address_type}
                </div>
              </div>
              <span className={styles.addressText}>
                {orderData?.buyer_logistics_data?.company_reg_address},{" "}
                {orderData?.buyer_logistics_data?.locality}
              </span>
              <span className={styles.addressText}>
              {orderData?.buyer_logistics_data?.country},{orderData?.buyer_logistics_data?.state}, {" "}
              {orderData?.buyer_logistics_data?.city} {orderData?.buyer_logistics_data?.pincode}
              </span>
              <span className={styles.addressText}>{orderData?.buyer_logistics_data?.mobile_number}</span>
            </div>
            <div className={styles.adresssCardContainer}>
              <div className={styles.logisticsMainHeading}>
                Transport Details
              </div>
              <div className={styles.transportInnerSection}>
                <div className={styles.transportHead}>Mode of Transport</div>
                <div className={styles.transportText}>
                {orderData?.buyer_logistics_data?.mode_of_transport}
                </div>
              </div>
              {orderData?.buyer_logistics_data?.extra_services?.length > 0 && (
                 <div className={styles.transportInnerSection}>
                 <div className={styles.transportHead}>Extra Services</div>
                 <div className={styles.transportText}>
                 {orderData?.buyer_logistics_data?.extra_services?.join(
                      ", "
                    )}
                 </div>
               </div>
              )}

             
            </div>
            <div className={styles.adresssCardContainer}>
              <div className={styles.pickupHeadSection}>
                <div className={styles.logisticsMainHeading}>
                  Pickup Details
                </div>
                <Link to={`/supplier/logistics-address/${orderId}/${supplierId}`}>
                  <div className={styles.pickupButton}>Change</div>
                </Link>
              </div>
              <div className={styles.nameContainer}>
                <span className={styles.addressText}>{displayAddress?.full_name}</span>
                <div className={styles.typeAdresss}>{displayAddress?.address_type || displayAddress?.type}</div>
              </div>
              <span className={styles.addressText}>
              {displayAddress?.company_reg_address},{" "}
              {displayAddress?.locality}
              </span>
              <span className={styles.addressText}>
              {displayAddress?.country},{displayAddress?.state}, {" "}
              {displayAddress?.city} {displayAddress?.pincode}
              </span>
              <span className={styles.addressText}>{displayAddress?.mobile_number}</span>
            </div>
          </div>
        )}

      <form
        className={styles.formLogistics}
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
            billsOfMaterial: formik.values.billsOfMaterial.map(() => ({
              productId: true,
              productName: true,
              quantity: true,
              numberOfPackages: true,
            })),
            packages: formik.values.packages.map(() => ({
              weight: true,
              dimensions: {
                length: true,
                width: true,
                height: true,
              },
              volume: true,
            })),
            pickupSlot: {
              date: true,
              timeSlot: true,
            },
          });

          if (address?.length > 1) {
            formik.handleSubmit();
          } else {
            if (Object.keys(formik.errors).length === 0) {
              formik.handleSubmit();
            } else {
              console.log("errors", Object.keys(formik.errors));
              toast.error("Please fill all required fields correctly");
            }
          }
        }}
      >
        {address?.length === 1 && (
          <div className={styles.formInnerClass}>
            <div className={styles.innerHeading}>Pickup Details</div>
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
                    { value: "Factory", label: "Factory" },
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
        )}
        <div className={styles.formMaterialContainer}>
          <div className={styles.headBillSection}>
            <div className={styles.innerBillHead}>Bills of Material</div>
            <span
              className={styles.innerAddButton}
              onClick={handleAddContainer}
            >
              Add More
            </span>
          </div>

          {formik.values.billsOfMaterial.map((bill, index) => {
            const selectedProduct = getSelectedProductDetails(bill.productId);

            return (
              <div
                className={`${styles["inner-container"]} ${
                  shrunkContainers.includes(index) ? styles.shrink : ""
                }`}
                key={index}
              >
                <div className={styles.logisticInputSection}>
                  <label className={styles.formLabel}>
                    Product Name<span className={styles.labelstamp}>*</span>
                  </label>

                  <Select
                    options={productOptions}
                    value={productOptions.find(
                      (p) => p.value === bill.productId
                    )}
                    onChange={(option) => {
                      formik.setFieldValue(
                        `billsOfMaterial.${index}.productName`,
                        option.label
                      );
                      formik.setFieldValue(
                        `billsOfMaterial.${index}.productId`,
                        option.value
                      );
                      formik.setFieldValue(
                        `billsOfMaterial.${index}.quantity`,
                        option.quantity
                      );
                      formik.setFieldTouched(
                        `billsOfMaterial.${index}.productName`,
                        false
                      );
                      formik.setFieldTouched(
                        `billsOfMaterial.${index}.quantity`,
                        false
                      );
                    }}
                    onBlur={formik.handleBlur}
                    placeholder="Select the Product"
                  />

                  {formik.touched.billsOfMaterial?.[index]?.productName &&
                    formik.errors.billsOfMaterial?.[index]?.productName && (
                      <div className={styles.errorMessage}>
                        {formik.errors.billsOfMaterial[index].productName}
                      </div>
                    )}
                </div>

                <div className={styles.logisticInputSection}>
                  <label className={styles.formLabel}>
                    Quantity<span className={styles.labelstamp}>*</span>
                  </label>
                  <input
                    className={styles.formInput}
                    type="number"
                    placeholder="Enter Quantity"
                    value={bill.quantity}
                    readOnly // Make the field read-only
                    disabled
                    name={`billsOfMaterial.${index}.quantity`}
                  />
                  {formik.touched.billsOfMaterial?.[index]?.quantity &&
                    formik.errors.billsOfMaterial?.[index]?.quantity && (
                      <div className={styles.errorMessage}>
                        {formik.errors.billsOfMaterial[index].quantity}
                      </div>
                    )}
                </div>

                <div className={styles.logisticInputSection}>
                  <label className={styles.formLabel}>
                    No. of Packages<span className={styles.labelstamp}>*</span>
                  </label>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Enter No. of Packages"
                    value={bill.numberOfPackages}
                    onChange={(e) =>
                      formik.setFieldValue(
                        `billsOfMaterial.${index}.numberOfPackages`,
                        e.target.value
                      )
                    }
                    onBlur={formik.handleBlur}
                    name={`billsOfMaterial.${index}.numberOfPackages`}
                  />
                  {formik.touched.billsOfMaterial?.[index]?.numberOfPackages &&
                    formik.errors.billsOfMaterial?.[index]
                      ?.numberOfPackages && (
                      <div className={styles.errorMessage}>
                        {formik.errors.billsOfMaterial[index].numberOfPackages}
                      </div>
                    )}
                </div>

                {formik.values.billsOfMaterial.length > 1 && (
                  <div
                    className={styles.removeButtons}
                    onClick={() => handleRemoveContainer(index)}
                  >
                    <span className={styles.crossButton}>✖</span>
                  </div>
                )}
              </div>
            );
          })}

          <div className={styles.headBillSection}>
            <div className={styles.innerBillHead}>Package Details</div>
            <span className={styles.innerAddButton} onClick={addPackage}>
              Add More
            </span>
          </div>
          {formik.values.packages.map((pkg, index) => (
            <div key={pkg.id} className={styles["inner-container"]}>
              <div className={styles.logisticesInputSection}>
                <label className={styles.formLabel}>
                  Package Weight<span className={styles.labelstamp}>*</span>
                </label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="Enter Package Weight"
                  autoComplete="off"
                  value={pkg.weight}
                  onChange={(e) =>
                    handleInputChange(pkg.id, "weight", e.target.value)
                  }
                  onBlur={formik.handleBlur}
                />
                {formik.touched.packages?.[index]?.weight &&
                  formik.errors.packages?.[index]?.weight && (
                    <span className="error-text">
                      {formik.errors.packages[index].weight}
                    </span>
                  )}
              </div>

              <div className={styles.logisticesDimensionSection}>
                <label className={styles.formLabel}>
                  Package Dimensions<span className={styles.labelstamp}>*</span>
                </label>
                <div className={styles.dimensionSections}>
                  <input
                    className={styles.formDimensions}
                    type="text"
                    placeholder="Enter Length"
                    autoComplete="off"
                    value={pkg.dimensions.length}
                    onChange={(e) =>
                      handleDimensionChange(pkg.id, "length", e.target.value)
                    }
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.packages?.[index]?.dimensions?.length &&
                    formik.errors.packages?.[index]?.dimensions?.length && (
                      <span className="error-text">
                        {formik.errors.packages[index].dimensions.length}
                      </span>
                    )}
                  <input
                    className={styles.formDimensions}
                    type="text"
                    placeholder="Enter Width"
                    autoComplete="off"
                    value={pkg.dimensions.width}
                    onChange={(e) =>
                      handleDimensionChange(pkg.id, "width", e.target.value)
                    }
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.packages?.[index]?.dimensions?.width &&
                    formik.errors.packages?.[index]?.dimensions?.width && (
                      <span className="error-text">
                        {formik.errors.packages[index].dimensions.width}
                      </span>
                    )}
                  <input
                    className={styles.formDimensions}
                    type="text"
                    placeholder="Enter Height"
                    autoComplete="off"
                    value={pkg.dimensions.height}
                    onChange={(e) =>
                      handleDimensionChange(pkg.id, "height", e.target.value)
                    }
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.packages?.[index]?.dimensions?.height &&
                    formik.errors.packages?.[index]?.dimensions?.height && (
                      <span className="error-text">
                        {formik.errors.packages[index].dimensions.height}
                      </span>
                    )}
                </div>
              </div>

              <div className={styles.logisticesInputSection}>
                <label className={styles.formLabel}>
                  Volume<span className={styles.labelstamp}>*</span>
                </label>
                <input
                  className={styles.formInput}
                  type="number"
                  placeholder="Enter Volume"
                  autoComplete="off"
                  value={pkg.volume || ""}
                  readOnly
                  // onChange={(e) =>
                  //   handleInputChange(pkg.id, "volume", e.target.value)
                  // }
                  onBlur={formik.handleBlur}
                />
                {formik.touched.packages?.[index]?.volume &&
                  formik.errors.packages?.[index]?.volume && (
                    <span className="error-text">
                      {formik.errors.packages[index].volume}
                    </span>
                  )}
              </div>

              {formik.values.packages.length > 1 && (
                <div
                  className={styles.removeButton}
                  onClick={() => removePackage(pkg.id)}
                >
                  <span className={styles.crossButton}>✖</span>
                </div>
              )}
            </div>
          ))}
          <div className={styles.innerHeading}>Pickup Slot</div>
          <div className={styles["inner-container"]}>
            <div className={styles.logisticesInputSection}>
              <label className={styles.formLabel}>
                Preferred Date of Pickup
                <span className={styles.labelstamp}>*</span>
              </label>
              <DatePicker
                className={styles.formInput}
                minDate={new Date()}
                clearIcon={null}
                format="dd/MM/yyyy"
                onChange={(date) =>
                  formik.setFieldValue("pickupSlot.date", date)
                }
                onBlur={formik.handleBlur}
                value={formik.values.pickupSlot.date}
              />
              {formik.touched.pickupSlot?.date &&
                formik.errors.pickupSlot?.date && (
                  <div className={styles.error}>
                    {formik.errors.pickupSlot.date}
                  </div>
                )}
            </div>
            <div className={styles.logisticesInputSection}>
              <label className={styles.formLabel}>
                Preferred Time of Pickup
                <span className={styles.labelstamp}>*</span>
              </label>
              <Select
                options={quantityOptions}
                placeholder="Select Time of Pickup"
                onChange={(option) =>
                  formik.setFieldValue("pickupSlot.timeSlot", option?.value)
                }
                onBlur={formik.handleBlur}
                value={quantityOptions.find(
                  (option) => option.value === formik.values.pickupSlot.timeSlot
                )}
              />
              {formik.touched.pickupSlot?.timeSlot &&
                formik.errors.pickupSlot?.timeSlot && (
                  <div className={styles.error}>
                    {formik.errors.pickupSlot.timeSlot}
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className={styles["logistic-Button-Section"]}>
          <button type="submit" className={styles["logistic-submit"]}>
            Submit
          </button>
          <div className={styles["logistic-cancel"]}>Cancel</div>
        </div>
      </form>
    </div>
    // Start the pickup details container
  );
};

export default SupplierLogistics;
