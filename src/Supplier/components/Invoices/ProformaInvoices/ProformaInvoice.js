import React, { useState, useEffect } from "react";
import styles from "../proformainvoice.module.css";
import "../invoiceDesign.css";
import "../../SharedComponents/Signup/signup.css";
import { useNavigate, useParams } from "react-router-dom";
import { postRequestWithToken } from "../../../api/Requests";
import { toast } from "react-toastify";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import {
  phoneValidationRules,
  countryCodes,
} from "../../../../utils/phoneNumberValidation";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import Select, { components } from "react-select";
import { Country, State, City } from "country-state-city";

const ProformaInvoice = ({ socket }) => {
  const { purchaseOrderId } = useParams();
  const navigate = useNavigate();

  const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
  const supplierIdLocalStorage = localStorage.getItem("supplier_id");

  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState();
  const [inquiryDetails, setInquiryDetails] = useState();
  const [orderItems, setOrderItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [requestedAmount, setrequestedAmount] = useState(0);
  const [depostDueDateError, setDepostDueDateError] = useState("");
  const [depostDueDateValue, setDepostDueDateValue] = useState();
  const [dateError, setDateError] = useState("");
  const [dateValue, setDateValue] = useState();
  const [mobileError, setMobileError] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [supplierCountry, setSupplierCountry] = useState(null);
  const [supplierState, setSupplierState] = useState("");
  const [supplierCity, setSupplierCity] = useState("");
  const [formData, setFormData] = useState({
    invoiceDate: "",
    invoiceDueDate: "",
    invoiceNumber: "",
    dueDate: "",
    depositDueDate: "",
    depositRequested: "",
    depositDue: "",
    supplierName: "",
    supplierAddress: "",
    supplierLocality: "",
    supplierLandmark: "",
    supplierCountry: "",
    supplierState: "",
    supplierCity: "",
    supplierPincode: "",
    supplierEmail: "",
    supplierMobile: "",
    newSupplierMobile: "",
    buyerName: "",
    buyerAddress: "",
    buyerLocality: "",
    buyerLandmark: "",
    buyerCountry: "",
    buyerState: "",
    buyerCity: "",
    buyerPincode: "",
    buyerEmail: "",
    buyerMobile: "",
    newBuyerMobile: "",
    orderItems: [],
    paymentTerms: "",
    bankDetails: "",
    totalDueAmount: "",
    totalAmount: "",
  });

  const handlePaymentDueDateChange = (e) => {
    setDateValue(e);
    setDateError(null);
    setFormData((prevState) => ({
      ...prevState,
      dueDate: formatDate(e),
    }));
  };

  const handleDepositDueDateChange = (e) => {
    setDepostDueDateValue(e);
    setDepostDueDateError(null);
    setFormData((prevState) => ({
      ...prevState,
      depositDueDate: formatDate(e),
    }));
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };
  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    setCurrentDate(formattedDate);
    // setValue('invoiceDate', `${day}-${month}-${year}`);

    const generateRandomNumber = () =>
      Math.floor(10000000 + Math.random() * 90000000);
    const generatedInvoiceNumber = generateRandomNumber();

    setFormData((prevState) => ({
      ...prevState,
      invoiceNumber: generatedInvoiceNumber,
      invoiceDate: formattedDate,
    }));

    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 15);
    const dueDay = String(dueDate.getDate()).padStart(2, "0");
    const dueMonth = String(dueDate.getMonth() + 1).padStart(2, "0");
    const dueYear = dueDate.getFullYear();
    const formattedDueDate = `${dueDay}-${dueMonth}-${dueYear}`;
    setDueDate(formattedDueDate);
    // setValue('invoiceDueDate', formattedDueDate);
  }, []);

  useEffect(() => {
    if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
      navigate("/supplier/login");
      return;
    }
    const obj = {
      supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
      purchaseOrder_id: purchaseOrderId,
    };
    postRequestWithToken(
      "purchaseorder/get-po-details",
      obj,
      async (response) => {
        if (response.code === 200) {
          setInquiryDetails(response?.result);
          const data = response.result;
          const formattedSupplierMobile = `${
            data?.supplier_country_code || ""
          }-${data?.supplier_mobile || ""}`;
          const formattedBuyerMobile = `${data?.buyer_country_code || ""}-${
            data?.buyer_mobile || ""
          }`;

          const paymentTermsString =
            response?.result?.enquiry_details[0]?.payment_terms?.join("\n");

          setFormData((prevFormData) => ({
            ...prevFormData,
            poId: data?.purchaseOrder_id,
            description: data?.additional_instructions,
            supplierId: data?.supplier_id,
            supplierName: data?.supplier_name,
            supplierEmail: data?.supplier_email,
            supplierAddress: data?.supplier_address,
            supplierMobile: formattedSupplierMobile,
            supplierContactPersonMobile:
              data?.supplier_details[0]?.contact_person_mobile_no,
            supplierContactPersonCountryCode:
              data?.supplier_details[0]?.contact_person_country_code,
            bankDetails: data?.supplier_details[0]?.bank_details,
            supplierRegNo: data?.supplier_regNo,
            buyerId: data?.buyer_details?.buyer_id,
            buyerName: data?.buyer_name,
            buyerEmail: data?.buyer_email,
            buyerAddress: data?.buyer_address,
            buyerMobile: formattedBuyerMobile,
            buyerRegNo: data?.buyer_regNo,
            orderItems: data?.order_items,
            // totalDueAmount : data?.total_amount,
            totalAmount: data?.total_amount,
            paymentTerms: paymentTermsString,
          }));
          setOrderItems(data?.order_items);
          if (data?.buyer_registered_address) {
            const { country, state, city } = data?.buyer_registered_address;

            const countryObj = Country.getAllCountries().find(
              (c) => c.name === country
            );
            setSelectedCountry(countryObj || "");
            if (countryObj) {
              const stateObj = State.getStatesOfCountry(
                countryObj.isoCode
              ).find((s) => s.name === state);
              setSelectedState(stateObj || "");
            }

            if (selectedState && selectedState.isoCode !== "OTHER") {
              const cityObj = City.getCitiesOfState(
                selectedState.countryCode,
                selectedState.isoCode
              ).find((c) => c.name === city);
              setSelectedCity(cityObj || "");
            }
          }

          if (data?.supplier_registered_address) {
            const { country, state, city } = data?.supplier_registered_address;

            const countryObj = Country.getAllCountries().find(
              (c) => c.name === country
            );
            setSupplierCountry(countryObj || "");
            if (countryObj) {
              const stateObj = State.getStatesOfCountry(
                countryObj.isoCode
              ).find((s) => s.name === state);
              setSupplierState(stateObj || "");
            }

            if (supplierState && supplierState.isoCode !== "OTHER") {
              const cityObj = City.getCitiesOfState(
                supplierState.countryCode,
                supplierState.isoCode
              ).find((c) => c.name === city);
              setSupplierCity(cityObj || "");
            }
          }
        } else {
        }
      }
    );
  }, [navigate, supplierIdSessionStorage, supplierIdLocalStorage]);

  const resetForm = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,

      // supplierId: data?.supplier_id,
      supplierName: "",
      supplierEmail: "",
      supplierAddress: "",
      supplierMobile: "",
      dueDate: "",
      depositRequested: "",
      depositDue: "",
      totalDueAmount: "",
    }));
    setDateValue();
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let newErrors = {};
    let isValid = true;

    if (name === "description") {
      if (value.length > 1000) {
        newErrors.description = "Description cannot exceed 1000 characters";
        isValid = false;
      } else {
        newErrors.description = "";
      }
    }
    if (name === "productName" || name === "dossierStatus") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        isValid = false;
      } else {
        newErrors[name] = "";
      }
    }
    if (name === "totalQuantity" || name === "minPurchaseUnit") {
      if (!/^\d*$/.test(value)) {
        isValid = false;
      } else {
        newErrors[name] = "";
      }
    }
    if (name === "unitTax") {
      if (!/^\d*\.?\d*$/.test(value)) {
        isValid = false;
      } else {
        newErrors.unitTax = "";
      }
    }
    if (isValid) {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
    setErrors((prevState) => ({ ...prevState, ...newErrors }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.supplierName)
      formErrors.supplierName = "Supplier Name is Required";
    if (!formData.supplierEmail)
      formErrors.supplierEmail = "Supplier Email is Required";
    if (!formData.supplierAddress)
      formErrors.supplierAddress = "Supplier Address is Required";
    if (!formData.supplierMobile)
      formErrors.supplierMobile = "Supplier Mobile is Required";
    if (!formData.depositRequested)
      formErrors.depositRequested = "Deposit Requested Amount is Required";
    // if(!formData.depositDue) formErrors.depositDue = 'Deposit Due is Required'
    if (!formData.depositDueDate)
      formErrors.depositDueDate = "Deposit Due Date is Required";
    if (!formData.dueDate) formErrors.dueDate = "Payment Due Date is Required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
      navigate("/supplier/login");
      return;
    }

    if (validateForm()) {
      setLoading(true);
      setDateError("");
      const updatedOrderItems = orderItems?.map((item) => ({
        ...item,
        unit_tax: item?.medicine_details?.general?.unit_tax,
        est_delivery_days: item?.est_delivery_days,
      }));

      const buyerDetails = inquiryDetails?.buyer_details[0];
      const buyerCountryCode = buyerDetails?.contact_person_country_code || "";
      const buyerMobileNumber = buyerDetails?.contact_person_mobile || "";
      const formattedBuyerPhoneNumber = formatPhoneNumber(
        buyerMobileNumber,
        buyerCountryCode
      );
      const supplierDetails = inquiryDetails?.supplier_details[0];
      const supplierCountryCode =
        supplierDetails?.contact_person_country_code || "";
      const supplierMobileNumber =
        supplierDetails?.contact_person_mobile_no || "";
      const formattedSupplierPhoneNumber = formatPhoneNumber(
        supplierMobileNumber,
        supplierCountryCode
      );

      const obj = {
        supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
        enquiry_id: inquiryDetails?.enquiry_id,
        purchaseOrder_id: purchaseOrderId,
        // buyer_id: inquiryDetails?.buyer_id,
        buyer_id: buyerDetails?.buyer_id,
        orderItems: updatedOrderItems,
        data: {
          ...formData,
          // dueDate: formatDate(dateValue),
          newBuyerMobile: formattedBuyerPhoneNumber,
          newSupplierMobile: formattedSupplierPhoneNumber,
        },
        totalAmount: roundedGrandTotalAmount,
      };
      postRequestWithToken(
        "order/create-order",
        obj,
        async (response) => {
          if (response.code === 200) {
            toast(response.message, { type: "success" });

            socket.emit("createOrder", {
              buyerId: inquiryDetails?.buyer_id,
              inquiryId: inquiryDetails?.enquiry_id,
              poId: purchaseOrderId,
              message: `Order Created for ${inquiryDetails?.enquiry_id}`,
              link: process.env.REACT_APP_PUBLIC_URL,
              // send other details if needed
            });
            // setTimeout(() => {
            navigate("/supplier/order/active");
            // }, 500)
            setLoading(false);
          } else {
            setLoading(false);
            toast(response.message, { type: "error" });
          }
          // setLoading(false)
        }
      );
    } else {
      setLoading(false);
      toast("Some Fields are Missing", { type: "error" });
    }
  };

  const handleCountryChange = (selectedOption) => {
    setSupplierCountry(selectedOption);
    setSupplierState("");
    setSupplierCity("");

    if (!selectedOption) {
      setErrors((prevState) => ({
        ...prevState,
        country: "Country is required",
      }));
    } else {
      setErrors((prevState) => ({ ...prevState, country: "" }));
      setFormData({ ...formData, supplierCountry: selectedOption?.name });
    }
  };

  const handleStateChange = (selectedOption) => {
    setSupplierState(selectedOption || "");
    setSupplierCity("");

    if (!selectedOption) {
      setErrors((prevState) => ({
        ...prevState,
        state: "State is required",
      }));
    } else {
      setErrors((prevState) => ({ ...prevState, state: "" }));
      setFormData({ ...formData, supplierState: selectedOption?.name });
    }
  };

  const handleCityChange = (selectedOption) => {
    setSupplierCity(selectedOption || "");

    if (!selectedOption) {
      setErrors((prevState) => ({
        ...prevState,
        city: "City is required",
      }));
    } else {
      setErrors((prevState) => ({ ...prevState, city: "" }));
      setFormData({ ...formData, supplierCity: selectedOption?.name });
    }
  };

  const handleNumberInput = (event) => {
    const { name, value } = event.target;

    // Remove any characters that are not digits or a single decimal point
    let cleanedValue = value.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point is allowed
    if (cleanedValue.split(".").length > 2) {
      cleanedValue = cleanedValue.replace(/\.+$/, ""); // Remove extra decimal points
    }

    // Split into integer and decimal parts
    let [integerPart, decimalPart] = cleanedValue.split(".");

    // Limit the integer part to 9 digits
    if (integerPart.length > 9) {
      integerPart = integerPart.slice(0, 9);
    }

    // Limit the decimal part to 3 digits, if it exists
    if (decimalPart && decimalPart.length > 3) {
      decimalPart = decimalPart.slice(0, 3);
    }

    // Recombine the integer and decimal parts
    cleanedValue =
      decimalPart !== undefined ? `${integerPart}.${decimalPart}` : integerPart;

    // Update state
    setFormData((prevState) => ({
      ...prevState,
      [name]: cleanedValue,
    }));

    if (name == "depositRequested") {
      setrequestedAmount(cleanedValue);
    }
  };

  const grandTotalAmount = orderItems?.reduce((total, item) => {
    return total + (parseFloat(item?.total_amount) || 0);
  }, 0);

  const roundedGrandTotalAmount = parseFloat(grandTotalAmount?.toFixed(2));

  const formatPhoneNumber = (phoneNumber, countryCode) => {
    const cleanedNumber = phoneNumber.replace(/\D/g, "");
    return `+${countryCode}-${cleanedNumber}`;
  };

  const validatePhoneNumber = (phoneNumber, countryCode) => {
    const validationRule = phoneValidationRules[countryCode];
    if (validationRule) {
      return validationRule.test(phoneNumber);
    } else {
      return false;
    }
  };
  const handlePhoneChange = (value, type) => {
    try {
      const phoneNumber = parsePhoneNumberFromString(value);
      if (phoneNumber && phoneNumber.isValid()) {
        const formattedPhoneNumber = phoneNumber.formatInternational();

        setFormData((prevState) => ({
          ...prevState,
          [type]: formattedPhoneNumber,
        }));
      } else {
        console.error("Invalid phone number");
        setFormData((prevState) => ({
          ...prevState,
          [type]: "", // Clear the field if invalid
        }));
      }
    } catch (error) {
      console.error("Error parsing phone number:", error);
      setFormData((prevState) => ({
        ...prevState,
        [type]: "", // Clear the field if an error occurs
      }));
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  useEffect(() => {
    const grandTotalCalc = orderItems?.reduce((accumulator, item) => {
      // setGrandTotal(accumulator + (item?.total_amount || 0))
      return accumulator + (Number.parseInt(item?.total_amount || 0) || 0);
    }, 0);

    setGrandTotal(grandTotalCalc);
    orderItems?.length > 0 &&
      setFormData({
        ...formData,
        totalDueAmount: grandTotalCalc - Number.parseInt(requestedAmount || 0),
      });
  }, [orderItems, requestedAmount, grandTotal]);

  return (
    <div className={styles["create-invoice-container"]}>
      <div className={styles["create-invoice-heading"]}>
        Create Proforma Invoice
      </div>
      <form className={styles["craete-invoice-form"]} onSubmit={handleSubmit}>
        <div className={styles["create-invoice-section"]}>
          <div className={styles["create-invoice-form-heading"]}>Supplier</div>
          <div className={styles["create-invoice-inner-form-container"]}>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Name</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="supplierName"
                placeholder="Enter Name"
                value={formData.supplierName}
                onChange={handleChange}
              />
              {errors.supplierName && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.supplierName}
                </p>
              )}
            </div>

            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Invoice Number
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                placeholder="Enter Invoice Number"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                readOnly
              />
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Invoice Generate Date
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="invoiceDate"
                placeholder="Enter Invoice Generate Date"
                value={currentDate}
                readOnly
              />
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Payment Due Date
              </label>
              <DatePicker
                className={styles["create-invoice-div-input"]}
                onChange={handlePaymentDueDateChange}
                value={dateValue}
                minDate={tomorrow}
                clearIcon={null}
                format="dd/MM/yyyy"
                placeholder="dd/MM/yyyy"
              />
              {errors.dueDate && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.dueDate}
                </p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Deposit Due Date
              </label>

              <DatePicker
                className={styles["create-invoice-div-input"]}
                onChange={handleDepositDueDateChange}
                value={depostDueDateValue}
                minDate={tomorrow}
                clearIcon={null}
                format="dd/MM/yyyy"
                placeholder="dd/MM/yyyy"
              />
              {errors.depositDueDate && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.depositDueDate}
                </p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Deposit Requested Amount
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="depositRequested"
                placeholder="Enter Deposit Requested Amount"
                value={formData.depositRequested}
                min={0}
                max={grandTotal}
                onInput={handleNumberInput}
              />
              {errors.depositRequested && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.depositRequested}
                </p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Total Due Amount
              </label>

              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="totalDueAmount"
                placeholder="Enter Total Due Amount"
                // {...register('totalDueAmount',
                // )}
                readOnly
                value={formData.totalDueAmount}
                onInput={handleNumberInput}
              />
              {errors.totalDueAmount && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.totalDueAmount}
                </p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Email ID
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="supplierEmail"
                placeholder="Enter Email ID"
                value={formData.supplierEmail}
                onChange={handleChange}
                // {...register('supplierEmail', { validate: value => value?.trim() !== '' || 'Supplier email is required' })}
              />
              {errors.supplierEmail && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.supplierEmail}
                </p>
              )}
            </div>

            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Mobile No.
              </label>
              <PhoneInput
                className="signup-form-section-phone-input"
                defaultCountry="uk"
                name="supplierMobile"
                // value={watch('supplierMobile')}
                value={formData.supplierMobile}
                // onChange={handleSupplierPhoneChange}
                onChange={(value) => handlePhoneChange(value, "supplierMobile")}
              />
              {errors.supplierMobile && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.supplierMobile}
                </p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Address
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="supplierAddress"
                placeholder="Enter Address"
                value={formData.supplierAddress}
                onChange={handleChange}
                // {...register('supplierAddress', { validate: value => value?.trim() !== '' || 'Supplier address is required' })}
              />
              {errors.supplierAddress && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.supplierAddress}
                </p>
              )}
            </div>
            {inquiryDetails?.supplier_registered_address && (
              <>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Area/Locality/Road Name
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name="buyerLocality"
                    placeholder="Enter Area/Locality/Road Name"
                    value={formData.supplierLocality}
                    onChange={handleChange}
                    // readOnly
                    // {...register('buyerEmail', { validate: value => value.trim() !== '' || 'Buyer email is required' })}
                  />
                  {errors.buyerEmail && (
                    <p style={{ color: "red" }}>{errors.buyerEmail}</p>
                  )}
                </div>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Landmark
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name="supplierLandmark"
                    placeholder="Enter Landmark"
                    value={formData.supplierLandmark}
                    onChange={handleChange}
                    // readOnly
                    // {...register('buyerEmail', { validate: value => value.trim() !== '' || 'Buyer email is required' })}
                  />
                  {errors.supplierLandmark && (
                    <p style={{ color: "red" }}>{errors.supplierLandmark}</p>
                  )}
                </div>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Country
                  </label>
                  <Select
                    options={Country.getAllCountries()}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.isoCode}
                    value={supplierCountry}
                    onChange={handleCountryChange}
                    placeholder="Select Country"
                    // isDisabled
                  />
                  {errors.buyerEmail && (
                    <p style={{ color: "red" }}>{errors.buyerEmail}</p>
                  )}
                </div>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    State/Province
                  </label>
                  <Select
                    options={
                      supplierCountry
                        ? [
                            ...State.getStatesOfCountry(
                              supplierCountry.isoCode
                            ),
                            { name: "Other", isoCode: "OTHER" },
                          ]
                        : []
                    }
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.isoCode}
                    value={supplierState}
                    onChange={handleStateChange}
                    placeholder="Select State"
                    // isDisabled
                  />
                  {errors.buyerEmail && (
                    <p style={{ color: "red" }}>{errors.buyerEmail}</p>
                  )}
                </div>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    City/Town
                  </label>
                  <Select
                    options={
                      supplierState && supplierState.isoCode !== "OTHER"
                        ? [
                            ...City.getCitiesOfState(
                              supplierState.countryCode,
                              supplierState.isoCode
                            ),
                            { name: "Other" },
                          ]
                        : [{ name: "Other" }]
                    }
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.name}
                    value={supplierCity}
                    onChange={handleCityChange}
                    placeholder="Select City"
                    // isDisabled
                  />
                  {/* {errors.buyerEmail && <p style={{color: 'red'}}>{errors.buyerEmail}</p>} */}
                </div>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Pincode
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name="supplierPincode"
                    placeholder="Enter Pincode"
                    value={formData.supplierPincode}
                    onChange={handleChange}
                    // readOnly
                  />
                  {/* {errors.buyerEmail && <p style={{color: 'red'}}>{errors.buyerEmail}</p>} */}
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles["create-invoice-section"]}>
          <div className={styles["create-invoice-form-heading"]}>Buyer</div>
          <div className={styles["create-invoice-inner-form-container"]}>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Name</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="buyerName"
                placeholder="Enter Name"
                readOnly
                value={formData.buyerName}
                // {...register('buyerName', { validate: value => value?.trim() !== '' || 'Buyer name is required' })}
              />
              {errors.buyerName && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.buyerName}
                </p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Email ID
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="buyerEmail"
                placeholder="Enter Email ID"
                readOnly
                value={formData.buyerEmail}
                // {...register('buyerEmail', { validate: value => value?.trim() !== '' || 'Buyer email is required' })}
              />
              {errors.buyerEmail && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.buyerEmail}
                </p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Mobile No.
              </label>
              <PhoneInput
                className="signup-form-section-phone-input"
                defaultCountry="ae"
                name="phoneinput"
                // value={watch('buyerMobile')}
                value={formData.buyerMobile}
                disabled
                // onChange={handleBuyerPhoneChange}
              />
              {errors.buyerMobile && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.buyerMobile}
                </p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Address
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="buyerAddress"
                placeholder="Enter Address"
                readOnly
                value={formData.buyerAddress}
                // {...register('buyerAddress', { validate: value => value?.trim() !== '' || 'Buyer address is required' })}
              />
              {errors.buyerAddress && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.buyerAddress}
                </p>
              )}
            </div>
            {inquiryDetails?.buyer_registered_address && (
              <>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Area/Locality/Road Name
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name="buyerLocality"
                    placeholder="Enter Area/Locality/Road Name"
                    value={formData.buyerLocality}
                    onChange={handleChange}
                    // readOnly
                  />
                  {errors.buyerEmail && (
                    <p style={{ color: "red" }}>{errors.buyerEmail}</p>
                  )}
                </div>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Landmark
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name="buyerLandmark"
                    placeholder="Enter Locality"
                    value={formData.buyerLandmark}
                    onChange={handleChange}
                    // readOnly
                  />
                  {errors.buyerEmail && (
                    <p style={{ color: "red" }}>{errors.buyerEmail}</p>
                  )}
                </div>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Country
                  </label>
                  <Select
                    options={Country.getAllCountries()}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.isoCode}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    placeholder="Select Country"
                    // isDisabled
                  />
                  {errors.buyerEmail && (
                    <p style={{ color: "red" }}>{errors.buyerEmail}</p>
                  )}
                </div>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    State/Province
                  </label>
                  <Select
                    options={
                      selectedCountry
                        ? [
                            ...State.getStatesOfCountry(
                              selectedCountry.isoCode
                            ),
                            { name: "Other", isoCode: "OTHER" },
                          ]
                        : []
                    }
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.isoCode}
                    value={selectedState}
                    onChange={handleStateChange}
                    placeholder="Select State"
                    // isDisabled
                  />
                  {errors.buyerEmail && (
                    <p style={{ color: "red" }}>{errors.buyerEmail}</p>
                  )}
                </div>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    City/Town
                  </label>
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
                    // isDisabled
                  />
                  {errors.buyerEmail && (
                    <p style={{ color: "red" }}>{errors.buyerEmail}</p>
                  )}
                </div>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Pincode
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name="buyerPincode"
                    placeholder="Enter Pincode"
                    value={formData.buyerPincode}
                    onChange={handleChange}
                    // readOnly
                  />
                  {errors.buyerEmail && (
                    <p style={{ color: "red" }}>{errors.buyerEmail}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles["create-invoice-section"]}>
          {orderItems?.map((item, index) => {
            return (
              <div className={styles["form-item-container"]} key={item.id}>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Product Name
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name={`Qty-${item.id}`}
                    placeholder="Enter Product Name"
                    value={
                      item?.medicine_details?.medicine_name ||
                      item?.medicine_name
                    }
                    readOnly
                  />
                </div>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Quantity
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name={`Qty-${item.id}`}
                    placeholder="Enter Quantity"
                    value={item?.quantity_required}
                    readOnly
                  />
                </div>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Price
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name={`UnitPrice-${item.id}`}
                    placeholder="Enter Price"
                    value={item?.counter_price || item?.target_price}
                    readOnly
                  />
                </div>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Tax%
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name={`UnitPrice-${item.id}`}
                    placeholder="Enter Tax%"
                    value={item?.medicine_details?.unit_tax || 0}
                    readOnly
                  />
                </div>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Total Amount
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name={`TotalAmount-${item.id}`}
                    placeholder="Enter Total Amount"
                    value={item?.total_amount}
                    readOnly
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles["create-invoice-section"]}>
          <div className={styles.createBankSection}>
            <div className={styles["craete-invoice-form"]}>
              <div className={styles["create-invoice-div-textarea"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Payment Terms
                </label>
                <textarea
                  className={styles["create-invoice-div-input"]}
                  name="paymentTerms"
                  rows="4"
                  cols="10"
                  placeholder="Enter Payment Terms"
                  value={formData.paymentTerms}
                  readOnly
                />
              </div>
            </div>
            <div className={styles["craete-invoice-form"]}>
              <div className={styles["create-invoice-div-textarea"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Bank Details
                </label>
                <textarea
                  className={styles["create-invoice-div-input"]}
                  name="bankDetails"
                  rows="4"
                  cols="10"
                  placeholder="Enter Bank Details"
                  value={formData.bankDetails}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles["craete-invoices-button"]}>
          <button
            type="submit"
            className={styles["create-invoices-submit"]}
            disabled={loading}
          >
            {/* Create Proforma Invoice */}
            {loading ? (
              <div className={styles["loading-spinner"]}></div>
            ) : (
              "Create Proforma Invoice"
            )}
          </button>
          <div
            className={styles["create-invoices-cancel"]}
            onClick={handleCancel}
          >
            Cancel
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProformaInvoice;
