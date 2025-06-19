import React, { useState, useEffect } from "react";
import styles from "./createInvoice.module.css";
import '../SharedComponents/Signup/signup.css';
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useNavigate, useParams } from "react-router-dom";
import { postRequestWithToken } from "../../api/Requests";
import { toast } from "react-toastify";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { apiRequests } from "../../../api";

const CreateInvoice = ({ socket }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState();
  const [orderDetails, setOrderDetails] = useState(null);
  const [formData, setFormData] = useState({
    orderId: "",
    purchaseOrderId: "",
    enquiryId: "",
    invoiceNo: "",
    invoiceDate: "",
    supplierId: "",
    supplierName: "",
    supplierEmail: "",
    supplierCountry: null,
    supplierAddress: "",
    supplierArea: "",
    supplierLandmark: "",
    supplierState: null,
    supplierCity: null,
    supplierPincode: "",
    supplierMobile: "",
    supplierContactPersonMobile: "",
    supplierContactPersonCountryCode: "",
    supplierVatRegNo: "",
    buyerId: "",
    buyerName: "",
    buyerEmail: "",
    buyerCountry: null,
    buyerAddress: "",
    buyerArea: "",
    buyerLandmark: "",
    buyerState: null,
    buyerCity: null,
    buyerPincode: "",
    buyerMobile: "",
    buyerContactPersonMobile: "",
    buyerContactPersonCountryCode: "",
    buyerVatRegNo: "",
    orderItems: [],
    vatPercentage: "",
    totalPayableAmount: "",
    bankName: "",
    accountNo: "",
    sortCode: "",
    grandTotal: "",
  });

  const [errors, setErrors] = useState({});
  const [supplierCountry, setSupplierCountry] = useState(null);
  const [supplierState, setSupplierState] = useState(null);
  const [supplierCity, setSupplierCity] = useState(null);
  const [buyerCountry, setBuyerCountry] = useState(null);
  const [buyerState, setBuyerState] = useState(null);
  const [buyerCity, setBuyerCity] = useState(null);

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    setCurrentDate(formattedDate);

    const generateRandomNumber = () => Math.floor(10000000 + Math.random() * 90000000);
    const generatedInvoiceNumber = generateRandomNumber();
    setInvoiceNumber(generatedInvoiceNumber);

    setFormData((prevState) => ({
      ...prevState,
      invoiceNo: generatedInvoiceNumber,
      invoiceDate: formattedDate,
    }));
  }, [orderId]);

  useEffect(() => {
    const getOrderDetails = async () => {
      const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
      const supplierIdLocalStorage = localStorage?.getItem("supplier_id");

      if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
        localStorage?.clear();
        navigate("/supplier/login");
        return;
      }

      const obj = {
        order_id: orderId,
        supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
      };

      try {
        const response = await apiRequests.getRequest(
          `order/get-specific-order-details/${orderId}`,
          obj
        );
        if (response?.code === 200) {
          setOrderDetails(response.result);
          const data = response.result;

          const formattedSupplierMobile = `${
            data.supplier?.supplier_country_code || ""
          }-${data.supplier?.supplier_mobile || ""}`;
          const formattedBuyerMobile = `${
            data.buyer?.buyer_country_code || ""
          }-${data.buyer?.buyer_mobile || ""}`;

          // Parse bank details
          const bankDetailsArray = data?.supplier?.bank_details?.split(",") || [];
          const [bankName, accountNo, sortCode] = bankDetailsArray.map((v) => v.trim());

          // Supplier Country, State, City
          const supplierCountryOption = Country.getAllCountries().find(
            (c) => c.name === data?.supplier_logistics_data?.country
          );
          const supplierStateOption = supplierCountryOption
            ? State.getStatesOfCountry(supplierCountryOption.isoCode).find(
                (s) => s.name === data?.supplier_logistics_data?.state
              ) || { name: "Other", isoCode: "OTHER" }
            : null;
          const supplierCityOption =
            supplierStateOption && supplierStateOption.isoCode !== "OTHER"
              ? City.getCitiesOfState(
                  supplierCountryOption.isoCode,
                  supplierStateOption.isoCode
                ).find((c) => c.name === data?.supplier_logistics_data?.city) || {
                  name: "Other",
                }
              : { name: "Other" };

          // Buyer Country, State, City
          const buyerCountryOption = Country.getAllCountries().find(
            (c) => c.name === data?.buyer_logistics_data?.country
          );
          const buyerStateOption = buyerCountryOption
            ? State.getStatesOfCountry(buyerCountryOption.isoCode).find(
                (s) => s.name === data?.buyer_logistics_data?.state
              ) || { name: "Other", isoCode: "OTHER" }
            : null;
          const buyerCityOption =
            buyerStateOption && buyerStateOption.isoCode !== "OTHER"
              ? City.getCitiesOfState(
                  buyerCountryOption.isoCode,
                  buyerStateOption.isoCode
                ).find((c) => c.name === data?.buyer_logistics_data?.city) || {
                  name: "Other",
                }
              : { name: "Other" };

          setSupplierCountry(supplierCountryOption);
          setSupplierState(supplierStateOption);
          setSupplierCity(supplierCityOption);
          setBuyerCountry(buyerCountryOption);
          setBuyerState(buyerStateOption);
          setBuyerCity(buyerCityOption);

          setFormData((prevFormData) => ({
            ...prevFormData,
            orderId: data.order_id,
            purchaseOrderId: data.purchaseOrder_id,
            enquiryId: data.enquiry_id,
            supplierId: data.supplier_id,
            supplierName: data?.supplier?.supplier_name,
            supplierEmail: data?.supplier_email,
            supplierCountry: supplierCountryOption
              ? { label: supplierCountryOption.name, value: supplierCountryOption.isoCode }
              : null,
            supplierAddress: data?.supplier?.supplier_address,
            supplierArea: data?.supplier_logistics_data?.locality || "",
            supplierLandmark: data?.supplier_logistics_data?.land_mark || "",
            supplierState: supplierStateOption
              ? { label: supplierStateOption.name, value: supplierStateOption.isoCode }
              : null,
            supplierCity: supplierCityOption
              ? { label: supplierCityOption.name, value: supplierCityOption.name }
              : null,
            supplierPincode: data?.supplier_logistics_data?.pincode || "",
            supplierMobile: formattedSupplierMobile,
            supplierContactPersonMobile: data?.supplier?.contact_person_mobile_no,
            supplierContactPersonCountryCode: data?.supplier?.contact_person_country_code,
            supplierVatRegNo: data?.supplier?.vat_reg_no,
            buyerId: data.buyer_id,
            buyerName: data?.buyer?.buyer_name,
            buyerEmail: data?.buyer?.buyer_email,
            buyerCountry: buyerCountryOption
              ? { label: buyerCountryOption.name, value: buyerCountryOption.isoCode }
              : null,
            buyerAddress: data?.buyer?.buyer_address,
            buyerArea: data?.buyer_logistics_data?.locality || "",
            buyerLandmark: data?.buyer_logistics_data?.land_mark || "",
            buyerState: buyerStateOption
              ? { label: buyerStateOption.name, value: buyerStateOption.isoCode }
              : null,
            buyerCity: buyerCityOption
              ? { label: buyerCityOption.name, value: buyerCityOption.name }
              : null,
            buyerPincode: data?.buyer_logistics_data?.pincode || "",
            buyerMobile: formattedBuyerMobile,
            buyerContactPersonMobile: data?.buyer?.contact_person_mobile,
            buyerContactPersonCountryCode: data?.buyer?.contact_person_country_code,
            buyerVatRegNo: data?.buyer?.vat_reg_no,
            orderItems: data?.items,
            grandTotal: data?.pending_amount,
            bankName: bankName || "",
            accountNo: accountNo || "",
            sortCode: sortCode || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    getOrderDetails();
  }, [orderId, navigate]);

  const handleCountryChange = (option, type) => {
    if (type === "supplier") {
      setSupplierCountry(option);
      setSupplierState(null);
      setSupplierCity(null);
      setFormData((prevState) => ({
        ...prevState,
        supplierCountry: option ? { label: option.name, value: option.isoCode } : null,
        supplierState: null,
        supplierCity: null,
      }));
      setErrors((prevState) => ({ ...prevState, supplierCountry: "" }));
    } else {
      setBuyerCountry(option);
      setBuyerState(null);
      setBuyerCity(null);
      setFormData((prevState) => ({
        ...prevState,
        buyerCountry: option ? { label: option.name, value: option.isoCode } : null,
        buyerState: null,
        buyerCity: null,
      }));
      setErrors((prevState) => ({ ...prevState, buyerCountry: "" }));
    }
  };

  const handleStateChange = (option, type) => {
    if (type === "supplier") {
      setSupplierState(option);
      setSupplierCity(null);
      setFormData((prevState) => ({
        ...prevState,
        supplierState: option ? { label: option.name, value: option.isoCode } : null,
        supplierCity: null,
      }));
      setErrors((prevState) => ({ ...prevState, supplierState: "" }));
    } else {
      setBuyerState(option);
      setBuyerCity(null);
      setFormData((prevState) => ({
        ...prevState,
        buyerState: option ? { label: option.name, value: option.isoCode } : null,
        buyerCity: null,
      }));
      setErrors((prevState) => ({ ...prevState, buyerState: "" }));
    }
  };

  const handleCityChange = (option, type) => {
    if (type === "supplier") {
      setSupplierCity(option);
      setFormData((prevState) => ({
        ...prevState,
        supplierCity: option ? { label: option.name, value: option.name } : null,
      }));
      setErrors((prevState) => ({ ...prevState, supplierCity: "" }));
    } else {
      setBuyerCity(option);
      setFormData((prevState) => ({
        ...prevState,
        buyerCity: option ? { label: option.name, value: option.name } : null,
      }));
      setErrors((prevState) => ({ ...prevState, buyerCity: "" }));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let newErrors = {};
    let isValid = true;

    if (name === "bankName") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        isValid = false;
        newErrors.bankName = "";
      } else if (value.length > 30) {
        isValid = false;
        newErrors.bankName = "";
      } else {
        newErrors.bankName = "";
      }
    }

    if (name === "accountNo" || name === "sortCode") {
      if (!/^[a-zA-Z0-9]*$/.test(value)) {
        isValid = false;
        newErrors[name] = "";
      } else if (value.length > 20) {
        isValid = false;
        newErrors[name] = "";
      } else {
        newErrors[name] = "";
      }
    }

    if (name === "totalPayableAmount") {
      if (!/^\d{0,8}(\.\d{0,3})?$/.test(value)) {
        isValid = false;
        newErrors.totalPayableAmount = "";
      } else {
        newErrors.totalPayableAmount = "";
      }
    }

    if (name === "supplierPincode" || name === "buyerPincode") {
      if (!/^\d{5,10}$/.test(value)) {
        isValid = false;
        newErrors[name] = "";
      } else {
        newErrors[name] = "";
      }
    }

    if (isValid) {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
    setErrors((prevState) => ({ ...prevState, ...newErrors }));
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formData.supplierName) formErrors.supplierName = "Supplier Name is Required";
    if (!formData.supplierEmail) formErrors.supplierEmail = "Supplier Email is Required";
    if (!formData.supplierAddress) formErrors.supplierAddress = "Supplier Address is Required";
    if (!formData.supplierArea) formErrors.supplierArea = "Supplier Area/Locality is Required";
    // if (!formData.supplierLandmark) formErrors.supplierLandmark = "Supplier Landmark is Required";
    if (!formData.supplierCountry) formErrors.supplierCountry = "Supplier Country is Required";
    if (!formData.supplierState) formErrors.supplierState = "Supplier State is Required";
    if (!formData.supplierCity) formErrors.supplierCity = "Supplier City is Required";
    if (!formData.supplierPincode) formErrors.supplierPincode = "Supplier Pincode is Required";
    if (!formData.supplierMobile) formErrors.supplierMobile = "Supplier Mobile is Required";
    if (!formData.supplierVatRegNo) formErrors.supplierVatRegNo = "Supplier VAT Reg No. is Required";

    if (!formData.buyerName) formErrors.buyerName = "Buyer Name is Required";
    if (!formData.buyerEmail) formErrors.buyerEmail = "Buyer Email is Required";
    if (!formData.buyerAddress) formErrors.buyerAddress = "Buyer Address is Required";
    if (!formData.buyerArea) formErrors.buyerArea = "Buyer Area/Locality is Required";
    // if (!formData.buyerLandmark) formErrors.buyerLandmark = "Buyer Landmark is Required";
    if (!formData.buyerCountry) formErrors.buyerCountry = "Buyer Country is Required";
    if (!formData.buyerState) formErrors.buyerState = "Buyer State is Required";
    if (!formData.buyerCity) formErrors.buyerCity = "Buyer City is Required";
    // if (!formData.buyerPincode) formErrors.buyerPincode = "Buyer Pincode is Required";
    if (!formData.buyerMobile) formErrors.buyerMobile = "Buyer Mobile is Required";
    if (!formData.buyerVatRegNo) formErrors.buyerVatRegNo = "Buyer VAT Reg No. is Required";

    if (!formData.bankName) formErrors.bankName = "Bank Name is Required";
    if (!formData.accountNo) formErrors.accountNo = "Account Number is Required";
    if (!formData.sortCode) formErrors.sortCode = "Sort Code is Required";
    if (!formData.totalPayableAmount) formErrors.totalPayableAmount = "Total Payable Amount is Required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
    const supplierIdLocalStorage = localStorage?.getItem("supplier_id");

    if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
      localStorage?.clear();
      navigate("/supplier/login");
      return;
    }
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      postRequestWithToken(
        "invoice/create-invoice",
        formData,
        async (response) => {
          if (response?.code === 200) {
            toast(response.message, { type: "success" });
            socket.emit("createInvoice", {
              buyerId: formData?.buyerId,
              orderId: orderId,
              message: `Invoice Created for ${orderId}`,
              link: process.env.REACT_APP_PUBLIC_URL,
            });
            setTimeout(() => {
              navigate("/supplier/invoice/pending");
              setLoading(false);
            }, 500);
          } else {
            setLoading(false);
            toast(response.message, { type: "error" });
          }
        }
      );
    }
  };

  const resetForm = () => {
    setFormData({
      orderId: "",
      purchaseOrderId: "",
      enquiryId: "",
      invoiceNo: invoiceNumber,
      invoiceDate: currentDate,
      supplierId: "",
      supplierName: "",
      supplierEmail: "",
      supplierCountry: null,
      supplierAddress: "",
      supplierArea: "",
      supplierLandmark: "",
      supplierState: null,
      supplierCity: null,
      supplierPincode: "",
      supplierMobile: "",
      supplierContactPersonMobile: "",
      supplierContactPersonCountryCode: "",
      supplierVatRegNo: "",
      buyerId: "",
      buyerName: "",
      buyerEmail: "",
      buyerCountry: null,
      buyerAddress: "",
      buyerArea: "",
      buyerLandmark: "",
      buyerState: null,
      buyerCity: null,
      buyerPincode: "",
      buyerMobile: "",
      buyerContactPersonMobile: "",
      buyerContactPersonCountryCode: "",
      buyerVatRegNo: "",
      orderItems: [],
      vatPercentage: "",
      totalPayableAmount: "",
      bankName: "",
      accountNo: "",
      sortCode: "",
      grandTotal: "",
    });
    setSupplierCountry(null);
    setSupplierState(null);
    setSupplierCity(null);
    setBuyerCountry(null);
    setBuyerState(null);
    setBuyerCity(null);
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
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

  const totalPayableAmount = formData?.orderItems?.reduce(
    (total, item) => total + parseFloat(item.total_amount || 0),
    0
  );

  return (
    <div className={styles["create-invoice-container"]}>
      <div className={styles["create-invoice-heading"]}>Create Invoice</div>
      <form className={styles["craete-invoice-form"]} onSubmit={handleSubmit}>
        {/* Supplier Section */}
        <div className={styles["create-invoice-section"]}>
          <div className={styles["create-invoice-form-heading"]}>Supplier</div>
          <div className={styles["create-invoice-inner-form-container"]}>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Name*</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="supplierName"
                placeholder="Enter Supplier Name"
                value={formData.supplierName}
                onChange={handleChange}
              />
              {errors.supplierName && <p style={{ color: "red" }}>{errors.supplierName}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Invoice Number*</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                placeholder="Enter Invoice Number"
                name="invoiceNumber"
                value={invoiceNumber}
                readOnly
              />
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Invoice Generate Date*</label>
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
              <label className={styles["create-invoice-div-label"]}>Email ID*</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="supplierEmail"
                placeholder="Enter Email ID"
                value={formData.supplierEmail}
                onChange={handleChange}
              />
              {errors.supplierEmail && <p style={{ color: "red" }}>{errors.supplierEmail}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Mobile No.*</label>
              <PhoneInput
                className="signup-form-section-phone-input"
                defaultCountry="uk"
                name="phoneinput"
                value={formData.supplierMobile}
                onChange={(value) => handlePhoneChange(value, "supplierMobile")}
              />
              {errors.supplierMobile && <p style={{ color: "red" }}>{errors.supplierMobile}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Address*</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="supplierAddress"
                placeholder="Enter Address"
                value={formData.supplierAddress}
                onChange={handleChange}
              />
              {errors.supplierAddress && <p style={{ color: "red" }}>{errors.supplierAddress}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Area/Locality/Road Name*</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="supplierArea"
                placeholder="Enter Area/Locality"
                value={formData.supplierArea}
                onChange={handleChange}
              />
              {errors.supplierArea && <p style={{ color: "red" }}>{errors.supplierArea}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Landmark*</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="supplierLandmark"
                placeholder="Enter Landmark"
                value={formData.supplierLandmark}
                onChange={handleChange}
              />
              {errors.supplierLandmark && <p style={{ color: "red" }}>{errors.supplierLandmark}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Country*</label>
              <Select
                options={Country.getAllCountries()}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.isoCode}
                value={supplierCountry}
                onChange={(option) => handleCountryChange(option, "supplier")}
                placeholder="Select Country"
              />
              {errors.supplierCountry && <p style={{ color: "red" }}>{errors.supplierCountry}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>State/Province*</label>
              <Select
                options={
                  supplierCountry
                    ? [...State.getStatesOfCountry(supplierCountry.isoCode), { name: "Other", isoCode: "OTHER" }]
                    : []
                }
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.isoCode}
                value={supplierState}
                onChange={(option) => handleStateChange(option, "supplier")}
                placeholder="Select State"
              />
              {errors.supplierState && <p style={{ color: "red" }}>{errors.supplierState}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>City/Town*</label>
              <Select
                options={
                  supplierState && supplierState.isoCode !== "OTHER"
                    ? [...City.getCitiesOfState(supplierCountry.isoCode, supplierState.isoCode), { name: "Other" }]
                    : [{ name: "Other" }]
                }
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.name}
                value={supplierCity}
                onChange={(option) => handleCityChange(option, "supplier")}
                placeholder="Select City"
              />
              {errors.supplierCity && <p style={{ color: "red" }}>{errors.supplierCity}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Pincode*</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="supplierPincode"
                placeholder="Enter Pincode"
                value={formData.supplierPincode}
                onChange={handleChange}
              />
              {errors.supplierPincode && <p style={{ color: "red" }}>{errors.supplierPincode}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>GST/VAT Reg No.*</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="supplierVatRegNo"
                placeholder="Enter GST/VAT Reg No"
                value={formData.supplierVatRegNo}
                onChange={handleChange}
              />
              {errors.supplierVatRegNo && <p style={{ color: "red" }}>{errors.supplierVatRegNo}</p>}
            </div>
          </div>
        </div>

        {/* Buyer Section */}
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
                readOnly
                value={formData.buyerName}
              />
              {errors.buyerName && <p style={{ color: "red" }}>{errors.buyerName}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Email ID*</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="buyerEmail"
                placeholder="Enter Email ID"
                readOnly
                value={formData.buyerEmail}
              />
              {errors.buyerEmail && <p style={{ color: "red" }}>{errors.buyerEmail}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Mobile No.*</label>
              <PhoneInput
                className="signup-form-section-phone-input"
                defaultCountry="ae"
                name="phoneinput"
                value={formData.buyerMobile}
                disabled
              />
              {errors.buyerMobile && <p style={{ color: "red" }}>{errors.buyerMobile}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Address*</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="buyerAddress"
                placeholder="Enter Address"
                readOnly
                value={formData.buyerAddress}
              />
              {errors.buyerAddress && <p style={{ color: "red" }}>{errors.buyerAddress}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Area/Locality/Road Name*</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="buyerArea"
                placeholder="Enter Area/Locality"
                value={formData.buyerArea}
                readOnly
              />
              {errors.buyerArea && <p style={{ color: "red" }}>{errors.buyerArea}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Landmark</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="buyerLandmark"
                placeholder="Enter Landmark"
                value={formData.buyerLandmark}
                readOnly
              />
              {errors.buyerLandmark && <p style={{ color: "red" }}>{errors.buyerLandmark}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Country*</label>
              <Select
                options={Country.getAllCountries()}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.isoCode}
                value={buyerCountry}
                onChange={(option) => handleCountryChange(option, "buyer")}
                placeholder="Select Country"
                isDisabled={true}
              />
              {errors.buyerCountry && <p style={{ color: "red" }}>{errors.buyerCountry}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>State/Province*</label>
              <Select
                options={
                  buyerCountry
                    ? [...State.getStatesOfCountry(buyerCountry.isoCode), { name: "Other", isoCode: "OTHER" }]
                    : []
                }
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.isoCode}
                value={buyerState}
                onChange={(option) => handleStateChange(option, "buyer")}
                placeholder="Select State"
                isDisabled={true}
              />
              {errors.buyerState && <p style={{ color: "red" }}>{errors.buyerState}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>City/Town*</label>
              <Select
                options={
                  buyerState && buyerState.isoCode !== "OTHER"
                    ? [...City.getCitiesOfState(buyerCountry.isoCode, buyerState.isoCode), { name: "Other" }]
                    : [{ name: "Other" }]
                }
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.name}
                value={buyerCity}
                onChange={(option) => handleCityChange(option, "buyer")}
                placeholder="Select City"
                isDisabled={true}
              />
              {errors.buyerCity && <p style={{ color: "red" }}>{errors.buyerCity}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Pincode</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="buyerPincode"
                placeholder="Enter Pincode"
                value={formData.buyerPincode}
                readOnly
              />
              {errors.buyerPincode && <p style={{ color: "red" }}>{errors.buyerPincode}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>GST/VAT Reg No.*</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="buyerVatRegNo"
                placeholder="Enter GST/VAT Reg No"
                value={formData.buyerVatRegNo}
                readOnly
              />
              {errors.buyerVatRegNo && <p style={{ color: "red" }}>{errors.buyerVatRegNo}</p>}
            </div>
          </div>
        </div>

        {/* Order Items Section */}
        <div className={styles["create-invoice-section"]}>
          {formData?.orderItems?.map((item, index) => (
            <div className={styles["form-item-container"]} key={item.id}>
              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>Product Name*</label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name={`ProductName-${item.id}`}
                  placeholder="Enter Product Name"
                  value={item?.medicine_name}
                  readOnly
                />
              </div>
              <div className={styles["create-invoice-div-container"]}>
                <label className={styles["create-invoice-div-label"]}>Quantity*</label>
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
                <label className={styles["create-invoice-div-label"]}>Price*</label>
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
                <label className={styles["create-invoice-div-label"]}>Tax%*</label>
                <input
                  className={styles["create-invoice-div-input"]}
                  type="text"
                  name={`Tax-${item.id}`}
                  placeholder="Enter Tax%"
                  value={item?.unit_tax}
                  readOnly
                />
              </div>
            </div>
          ))}
          <div className={styles["create-invoice-div-container"]}>
            <label className={styles["create-invoice-div-label"]}>Total Payable Amount*</label>
            <input
              className={styles["create-invoice-div-input"]}
              type="text"
              name="totalPayableAmount"
              placeholder="Enter Total Payable Amount"
              value={formData.totalPayableAmount}
              onChange={handleChange}
            />
            {errors.totalPayableAmount && (
              <p style={{ color: "red", fontSize: "12px" }}>{errors.totalPayableAmount}</p>
            )}
          </div>
        </div>

        {/* Bank Details Section */}
        <div className={styles["create-invoice-section"]}>
          <div className={styles["create-invoice-inner-form-container"]}>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Name of Bank*</label>
              <textarea
                className={styles["create-invoice-div-input"]}
                type="text"
                name="bankName"
                placeholder="Enter Name of Bank"
                value={formData.bankName}
                onChange={handleChange}
              />
              {errors.bankName && <p style={{ color: "red", fontSize: "12px" }}>{errors.bankName}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Account Number*</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="accountNo"
                placeholder="Enter Account Number"
                value={formData.accountNo}
                onChange={handleChange}
              />
              {errors.accountNo && <p style={{ color: "red", fontSize: "12px" }}>{errors.accountNo}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Sort Code*</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="sortCode"
                placeholder="Enter Sort Code"
                value={formData.sortCode}
                onChange={handleChange}
              />
              {errors.sortCode && <p style={{ color: "red", fontSize: "12px" }}>{errors.sortCode}</p>}
            </div>
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className={styles["craete-invoices-button"]}>
          <button
            type="submit"
            className={styles["create-invoices-submit"]}
            disabled={loading}
          >
            {loading ? <div className="loading-spinner"></div> : "Create Invoice"}
          </button>
          <div className={styles["create-invoices-cancel"]} onClick={handleCancel}>
            Cancel
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;