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
import { parsePhoneNumberFromString } from "libphonenumber-js";
import Select from "react-select";
import { Country, State, City } from "country-state-city";

const ProformaInvoice = ({ socket }) => {
  const { purchaseOrderId } = useParams();
  const navigate = useNavigate();

  const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
  const supplierIdLocalStorage = localStorage?.getItem("supplier_id");

  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState();
  const [inquiryDetails, setInquiryDetails] = useState();
  const [orderItems, setOrderItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [requestedAmount, setRequestedAmount] = useState(0);
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
    setDateValue(dueDate);
    setFormData((prevState) => ({
      ...prevState,
      dueDate: formattedDueDate,
    }));
  }, []);

  useEffect(() => {
    if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
      localStorage?.clear();
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
        if (response?.code === 200) {
          setInquiryDetails(response?.result);
          const data = response.result;
          const formattedSupplierMobile = `${
            data?.supplier_country_code || ""
          }${data?.supplier_mobile || ""}`;
          const formattedBuyerMobile = `${
            data?.buyer_country_code || ""
          }${data?.buyer_mobile || ""}`;
          const paymentTermsString =
            data?.enquiry_details[0]?.payment_terms?.join("\n") || "";

          setFormData((prevFormData) => ({
            ...prevFormData,
            poId: data?.purchaseOrder_id,
            description: data?.additional_instructions || "",
            supplierId: data?.supplier_id,
            supplierName: data?.supplier_name || "",
            supplierEmail: data?.supplier_email || "",
            supplierAddress: data?.supplier_address || "",
            supplierLocality: data?.supplier_registered_address?.locality || "",
            supplierLandmark: data?.supplier_registered_address?.land_mark || "",
            supplierCountry: data?.supplier_registered_address?.country || "",
            supplierState: data?.supplier_registered_address?.state || "",
            supplierCity: data?.supplier_registered_address?.city || "",
            supplierPincode: data?.supplier_registered_address?.pincode || "",
            supplierMobile: formattedSupplierMobile,
            supplierContactPersonMobile:
              data?.supplier_details[0]?.contact_person_mobile_no || "",
            supplierContactPersonCountryCode:
              data?.supplier_details[0]?.contact_person_country_code || "",
            bankDetails: data?.supplier_details[0]?.bank_details || "",
            supplierRegNo: data?.supplier_regNo || "",
            buyerId: data?.buyer_details[0]?.buyer_id || "",
            buyerName: data?.buyer_name || "",
            buyerEmail: data?.buyer_email || "",
            buyerAddress: data?.buyer_address || "",
            buyerLocality: data?.buyer_registered_address?.locality || "",
            buyerLandmark: data?.buyer_registered_address?.land_mark || "",
            buyerCountry: data?.buyer_registered_address?.country || "",
            buyerState: data?.buyer_registered_address?.state || "",
            buyerCity: data?.buyer_registered_address?.city || "",
            buyerPincode: data?.buyer_registered_address?.pincode || "",
            buyerMobile: formattedBuyerMobile,
            buyerRegNo: data?.buyer_regNo || "",
            orderItems: data?.order_items || [],
            totalAmount: data?.total_amount || "",
            paymentTerms: paymentTermsString,
          }));
          setOrderItems(data?.order_items || []);

          // Set supplier address fields
          if (data?.supplier_registered_address) {
            const { country, state, city } = data.supplier_registered_address;
            const countryObj = Country.getAllCountries().find(
              (c) => c.name === country
            );
            setSupplierCountry(countryObj || null);
            if (countryObj) {
              const stateObj = State.getStatesOfCountry(
                countryObj.isoCode
              ).find((s) => s.name === state);
              setSupplierState(stateObj || { name: "Other", isoCode: "OTHER" });
              if (stateObj && stateObj.isoCode !== "OTHER") {
                const cityObj = City.getCitiesOfState(
                  stateObj.countryCode,
                  stateObj.isoCode
                ).find((c) => c.name === city);
                setSupplierCity(cityObj || { name: "Other" });
              } else {
                setSupplierCity({ name: "Other" });
              }
            }
          }

          // Set buyer address fields
          if (data?.buyer_registered_address) {
            const { country, state, city } = data.buyer_registered_address;
            const countryObj = Country.getAllCountries().find(
              (c) => c.name === country
            );
            setSelectedCountry(countryObj || null);
            if (countryObj) {
              const stateObj = State.getStatesOfCountry(
                countryObj.isoCode
              ).find((s) => s.name === state);
              setSelectedState(stateObj || { name: "Other", isoCode: "OTHER" });
              if (stateObj && stateObj.isoCode !== "OTHER") {
                const cityObj = City.getCitiesOfState(
                  stateObj.countryCode,
                  stateObj.isoCode
                ).find((c) => c.name === city);
                setSelectedCity(cityObj || { name: "Other" });
              } else {
                setSelectedCity({ name: "Other" });
              }
            }
          }
        } else {
          toast(response.message, { type: "error" });
        }
      }
    );
  }, [navigate, supplierIdSessionStorage, supplierIdLocalStorage, purchaseOrderId]);

  const resetForm = () => {
    setFormData({
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
    setDateValue(null);
    setDepostDueDateValue(null);
    setSelectedCountry(null);
    setSelectedState("");
    setSelectedCity("");
    setSupplierCountry(null);
    setSupplierState("");
    setSupplierCity("");
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
    if (!formData.depositDueDate)
      formErrors.depositDueDate = "Deposit Due Date is Required";
    if (!formData.dueDate) formErrors.dueDate = "Payment Due Date is Required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
      localStorage?.clear();
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
        buyer_id: buyerDetails?.buyer_id,
        orderItems: updatedOrderItems,
        data: {
          ...formData,
          newBuyerMobile: formattedBuyerPhoneNumber,
          newSupplierMobile: formattedSupplierPhoneNumber,
        },
        totalAmount: roundedGrandTotalAmount,
      };
      postRequestWithToken(
        "order/create-order",
        obj,
        async (response) => {
          if (response?.code === 200) {
            toast(response.message, { type: "success" });
            socket.emit("createOrder", {
              buyerId: inquiryDetails?.buyer_id,
              inquiryId: inquiryDetails?.enquiry_id,
              poId: purchaseOrderId,
              message: `Order Created for ${inquiryDetails?.enquiry_id}`,
              link: process.env.REACT_APP_PUBLIC_URL,
            });
            navigate("/supplier/order/active");
            setLoading(false);
          } else {
            setLoading(false);
            toast(response.message, { type: "error" });
          }
        }
      );
    } else {
      setLoading(false);
      toast("Some Fields are Missing", { type: "error" });
    }
  };

  const handleCountryChange = (selectedOption, type) => {
    if (type === "buyer") {
      setSelectedCountry(selectedOption);
      setSelectedState("");
      setSelectedCity("");
      setFormData((prev) => ({
        ...prev,
        buyerCountry: selectedOption?.name || "",
      }));
    } else {
      setSupplierCountry(selectedOption);
      setSupplierState("");
      setSupplierCity("");
      setFormData((prev) => ({
        ...prev,
        supplierCountry: selectedOption?.name || "",
      }));
    }
  };

  const handleStateChange = (selectedOption, type) => {
    if (type === "buyer") {
      setSelectedState(selectedOption || "");
      setSelectedCity("");
      setFormData((prev) => ({
        ...prev,
        buyerState: selectedOption?.name || "",
      }));
    } else {
      setSupplierState(selectedOption || "");
      setSupplierCity("");
      setFormData((prev) => ({
        ...prev,
        supplierState: selectedOption?.name || "",
      }));
    }
  };

  const handleCityChange = (selectedOption, type) => {
    if (type === "buyer") {
      setSelectedCity(selectedOption || "");
      setFormData((prev) => ({
        ...prev,
        buyerCity: selectedOption?.name || "",
      }));
    } else {
      setSupplierCity(selectedOption || "");
      setFormData((prev) => ({
        ...prev,
        supplierCity: selectedOption?.name || "",
      }));
    }
  };

  const handleNumberInput = (event) => {
    const { name, value } = event.target;
    let cleanedValue = value.replace(/[^0-9.]/g, "");
    if (cleanedValue?.split(".").length > 2) {
      cleanedValue = cleanedValue.replace(/\.+$/, "");
    }
    let [integerPart, decimalPart] = cleanedValue?.split(".");
    if (integerPart.length > 9) {
      integerPart = integerPart.slice(0, 9);
    }
    if (decimalPart && decimalPart.length > 3) {
      decimalPart = decimalPart.slice(0, 3);
    }
    cleanedValue =
      decimalPart !== undefined ? `${integerPart}.${decimalPart}` : integerPart;
    setFormData((prevState) => ({
      ...prevState,
      [name]: cleanedValue,
    }));
    if (name === "depositRequested") {
      setRequestedAmount(cleanedValue);
    }
  };

  const grandTotalAmount = orderItems?.reduce((total, item) => {
    return total + (parseFloat(item?.total_amount) || 0);
  }, 0);

  const roundedGrandTotalAmount = parseFloat(grandTotalAmount?.toFixed(2));

  const formatPhoneNumber = (phoneNumber, countryCode) => {
    const cleanedNumber = phoneNumber.replace(/\D/g, "");
    return `+${countryCode}${cleanedNumber}`;
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
        setFormData((prevState) => ({
          ...prevState,
          [type]: "",
        }));
      }
    } catch (error) {
      console.error("Error parsing phone number:", error);
      setFormData((prevState) => ({
        ...prevState,
        [type]: "",
      }));
    }
  };

  const tomorrow = new Date();
  tomorrow?.setDate(tomorrow?.getDate() + 1);

  useEffect(() => {
    const grandTotalCalc = orderItems?.reduce((accumulator, item) => {
      return accumulator + (Number.parseInt(item?.total_amount || 0) || 0);
    }, 0);
    setGrandTotal(grandTotalCalc);
    setFormData((prev) => ({
      ...prev,
      totalDueAmount: grandTotalCalc - Number.parseInt(requestedAmount || 0),
    }));
  }, [orderItems, requestedAmount]);

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
              <label className={styles["create-invoice-div-label"]}>Name*</label>
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
                Invoice Number*
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
                Invoice Generate Date*
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
                Payment Due Date*
              </label>
              <DatePicker
                className={styles["create-invoice-div-input"]}
                onChange={handlePaymentDueDateChange}
                value={dateValue}
                minDate={tomorrow}
                clearIcon={null}
                format="dd/MM/yyyy"
                placeholder="dd/MM/yyyy"
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
              />
              {errors.dueDate && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.dueDate}
                </p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Deposit Due Date*
              </label>
              <DatePicker
                className={styles["create-invoice-div-input"]}
                onChange={handleDepositDueDateChange}
                value={depostDueDateValue}
                minDate={tomorrow}
                clearIcon={null}
                format="dd/MM/yyyy"
                placeholder="dd/MM/yyyy"
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
              />
              {errors.depositDueDate && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.depositDueDate}
                </p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Deposit Requested Amount*
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
                Total Due Amount*
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="totalDueAmount"
                placeholder="Enter Total Due Amount"
                readOnly
                value={formData.totalDueAmount}
              />
              {errors.totalDueAmount && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.totalDueAmount}
                </p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Email ID*
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="supplierEmail"
                placeholder="Enter Email ID"
                value={formData.supplierEmail}
                onChange={handleChange}
              />
              {errors.supplierEmail && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.supplierEmail}
                </p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Mobile No.*
              </label>
              <PhoneInput
                className="signup-form-section-phone-input"
                defaultCountry="uk"
                name="supplierMobile"
                value={formData.supplierMobile}
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
                Address*
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="supplierAddress"
                placeholder="Enter Address"
                value={formData.supplierAddress}
                onChange={handleChange}
              />
              {errors.supplierAddress && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.supplierAddress}
                </p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Area/Locality/Road Name
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="supplierLocality"
                placeholder="Enter Area/Locality/Road Name"
                value={formData.supplierLocality}
                onChange={handleChange}
              />
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
              />
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
                onChange={(option) => handleCountryChange(option, "supplier")}
                placeholder="Select Country"
              />
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                State/Province
              </label>
              <Select
                options={
                  supplierCountry
                    ? [
                        ...State.getStatesOfCountry(supplierCountry.isoCode),
                        { name: "Other", isoCode: "OTHER" },
                      ]
                    : []
                }
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.isoCode}
                value={supplierState}
                onChange={(option) => handleStateChange(option, "supplier")}
                placeholder="Select State"
              />
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
                onChange={(option) => handleCityChange(option, "supplier")}
                placeholder="Select City"
              />
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
              />
            </div>
          </div>
        </div>
        <div className={styles["create-invoice-section"]}>
          <div className={styles["create-invoice-form-heading"]}>Buyer</div>
          <div className={styles["create-invoice-inner-form-container"]}>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Name*</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="buyerName"
                placeholder="Enter Name"
                value={formData.buyerName}
                readOnly
              />
              {errors.buyerName && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.buyerName}
                </p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Email ID*
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="buyerEmail"
                placeholder="Enter Email ID"
                value={formData.buyerEmail}
                readOnly
              />
              {errors.buyerEmail && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.buyerEmail}
                </p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Mobile No.*
              </label>
              <PhoneInput
                className="signup-form-section-phone-input"
                defaultCountry="ae"
                name="buyerMobile"
                value={formData.buyerMobile}
                disabled
              />
              {errors.buyerMobile && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.buyerMobile}
                </p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Address*
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="buyerAddress"
                placeholder="Enter Address"
                value={formData.buyerAddress}
                readOnly
              />
              {errors.buyerAddress && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.buyerAddress}
                </p>
              )}
            </div>
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
              />
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Landmark
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="buyerLandmark"
                placeholder="Enter Landmark"
                value={formData.buyerLandmark}
                onChange={handleChange}
              />
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
                onChange={(option) => handleCountryChange(option, "buyer")}
                placeholder="Select Country"
              />
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                State/Province
              </label>
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
                onChange={(option) => handleStateChange(option, "buyer")}
                placeholder="Select State"
              />
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
                onChange={(option) => handleCityChange(option, "buyer")}
                placeholder="Select City"
              />
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
              />
            </div>
          </div>
        </div>
        <div className={styles["create-invoice-section"]}>
          {orderItems?.map((item, index) => (
            <div className={styles["form-item-container"]} key={item._id}>
              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Product Name*
                </label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name={`productName-${item._id}`}
                  placeholder="Enter Product Name"
                  value={
                    item?.medicine_details?.general?.name || item?.medicine_name
                  }
                  readOnly
                />
              </div>
              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Quantity*
                </label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name={`quantity-${item._id}`}
                  placeholder="Enter Quantity"
                  value={item?.quantity_required}
                  readOnly
                />
              </div>
              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Price*
                </label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name={`unitPrice-${item._id}`}
                  placeholder="Enter Price"
                  value={item?.unit_price || item?.target_price}
                  readOnly
                />
              </div>
              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Tax%*
                </label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name={`unitTax-${item._id}`}
                  placeholder="Enter Tax%"
                  value={item?.medicine_details?.general?.unit_tax || item?.unit_tax || 0}
                  readOnly
                />
              </div>
              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Total Amount*
                </label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name={`totalAmount-${item._id}`}
                  placeholder="Enter Total Amount"
                  value={item?.total_amount}
                  readOnly
                />
              </div>
            </div>
          ))}
        </div>
        <div className={styles["create-invoice-section"]}>
          <div className={styles.createBankSection}>
            <div className={styles["craete-invoice-form"]}>
              <div className={styles["create-invoice-div-textarea"]}>
                <label className={styles["create-invoice-div-label"]}>
                  Payment Terms*
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
                  Bank Details*
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