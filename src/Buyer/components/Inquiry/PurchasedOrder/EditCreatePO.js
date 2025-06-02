import React, { useEffect, useState } from "react";
import styles from "../createInvoice.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { postRequestWithToken } from "../../../../api/Requests";
import { toast } from "react-toastify";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import "../../../assets/style/react-input-phone.css";
import Select from "react-select";
import { Country, State, City } from "country-state-city";

const countryCodes = [
  "+1", // USA, Canada
  "+7", // Russia, Kazakhstan
  "+20", // Egypt
  "+27", // South Africa
  "+30", // Greece
  "+31", // Netherlands
  "+32", // Belgium
  "+33", // France
  "+34", // Spain
  "+36", // Hungary
  "+39", // Italy
  "+40", // Romania
  "+41", // Switzerland
  "+43", // Austria
  "+44", // UK
  "+45", // Denmark
  "+46", // Sweden
  "+47", // Norway
  "+48", // Poland
  "+49", // Germany
  "+51", // Peru
  "+52", // Mexico
  "+53", // Cuba
  "+54", // Argentina
  "+55", // Brazil
  "+56", // Chile
  "+57", // Colombia
  "+58", // Venezuela
  "+60", // Malaysia
  "+61", // Australia
  "+62", // Indonesia
  "+63", // Philippines
  "+64", // New Zealand
  "+65", // Singapore
  "+66", // Thailand
  "+81", // Japan
  "+82", // South Korea
  "+84", // Vietnam
  "+86", // China
  "+90", // Turkey
  "+91", // India
  "+92", // Pakistan
  "+93", // Afghanistan
  "+94", // Sri Lanka
  "+95", // Myanmar
  "+98", // Iran
  "+212", // Morocco
  "+213", // Algeria
  "+216", // Tunisia
  "+218", // Libya
  "+220", // Gambia
  "+221", // Senegal
  "+222", // Mauritania
  "+223", // Mali
  "+224", // Guinea
  "+225", // Côte d'Ivoire
  "+226", // Burkina Faso
  "+227", // Niger
  "+228", // Togo
  "+229", // Benin
  "+230", // Mauritius
  "+231", // Liberia
  "+232", // Sierra Leone
  "+233", // Ghana
  "+234", // Nigeria
  "+235", // Chad
  "+236", // Central African Republic
  "+237", // Cameroon
  "+238", // Cape Verde
  "+239", // São Tomé and Príncipe
  "+240", // Equatorial Guinea
  "+241", // Gabon
  "+242", // Republic of the Congo
  "+243", // Democratic Republic of the Congo
  "+244", // Angola
  "+245", // Guinea-Bissau
  "+246", // British Indian Ocean Territory
  "+247", // Ascension Island
  "+248", // Seychelles
  "+249", // Sudan
  "+250", // Rwanda
  "+251", // Ethiopia
  "+252", // Somalia
  "+253", // Djibouti
  "+254", // Kenya
  "+255", // Tanzania
  "+256", // Uganda
  "+257", // Burundi
  "+258", // Mozambique
  "+260", // Zambia
  "+261", // Madagascar
  "+262", // Réunion, Mayotte
  "+263", // Zimbabwe
  "+264", // Namibia
  "+265", // Malawi
  "+266", // Lesotho
  "+267", // Botswana
  "+268", // Eswatini
  "+269", // Comoros
  "+290", // Saint Helena
  "+291", // Eritrea
  "+292", // South Sudan
  "+293", // Nauru
  "+294", // Seychelles
  "+295", // French Guiana
  "+296", // Saint Pierre and Miquelon
  "+297", // Aruba
  "+298", // Faroe Islands
  "+299", // Greenland
  "+350", // Gibraltar
  "+351", // Portugal
  "+352", // Luxembourg
  "+353", // Ireland
  "+354", // Iceland
  "+355", // Albania
  "+356", // Malta
  "+357", // Cyprus
  "+358", // Finland
  "+359", // Bulgaria
  "+370", // Lithuania
  "+371", // Latvia
  "+372", // Estonia
  "+373", // Moldova
  "+374", // Armenia
  "+375", // Belarus
  "+376", // Andorra
  "+377", // Monaco
  "+378", // San Marino
  "+379", // Vatican City
  "+380", // Ukraine
  "+381", // Serbia
  "+382", // Montenegro
  "+383", // Kosovo
  "+385", // Croatia
  "+386", // Slovenia
  "+387", // Bosnia and Herzegovina
  "+388", // Yugoslavia
  "+389", // North Macedonia
  "+390", // Vatican City
  "+391", // San Marino
  "+392", // Andorra
  "+393", // Monaco
  "+394", // Kosovo
  "+395", // Vatican City
  "+396", // San Marino
  "+397", // Andorra
  "+398", // Monaco
  "+399", // Kosovo
  "+971", // UAE
  "+1869", // Saint Kitts and Nevis
  "+1876", // Jamaica
  "+1954", // Venezuela
];

const phoneValidationRules = {
  1: /^\d{10}$/, // USA/Canada: 10 digits
  44: /^(\d{10}|\d{11})$/, // UK: 10 or 11 digits
  33: /^\d{10}$/, // France: 10 digits
  49: /^\d{11,14}$/, // Germany: 11 to 14 digits
  91: /^[6-9]\d{9}$/, // India: 10 digits, starts with 6-9
  81: /^\d{10}$/, // Japan: 10 digits
  82: /^\d{10}$/, // South Korea: 10 digits
  61: /^(\d{9}|\d{10})$/, // Australia: 9 or 10 digits
  971: /^\d{7,9}$/, // UAE: 7 to 9 digits
  55: /^\d{10,11}$/, // Brazil: 10 or 11 digits
  27: /^\d{10}$/, // South Africa: 10 digits
  52: /^\d{10}$/, // Mexico: 10 digits
  46: /^\d{6,11}$/, // Sweden: 6 to 11 digits
  34: /^\d{9}$/, // Spain: 9 digits
  64: /^\d{9}$/, // New Zealand: 9 digits
  39: /^\d{10}$/, // Italy: 10 digits
  53: /^\d{8}$/, // Cuba: 8 digits
  20: /^\d{10}$/, // Egypt: 10 digits
  90: /^\d{10}$/, // Turkey: 10 digits
  7: /^(\d{10}|\d{11})$/, // Russia: 10 or 11 digits
  60: /^\d{9,10}$/, // Malaysia: 9 or 10 digits
  62: /^\d{10,13}$/, // Indonesia: 10 to 13 digits
  63: /^\d{10}$/, // Philippines: 10 digits
  86: /^\d{11}$/, // China: 11 digits
  98: /^\d{10}$/, // Iran: 10 digits
  92: /^\d{10}$/, // Pakistan: 10 digits
  94: /^\d{10}$/, // Sri Lanka: 10 digits
  41: /^\d{10}$/, // Switzerland: 10 digits
  47: /^\d{8}$/, // Norway: 8 digits
  48: /^\d{9}$/, // Poland: 9 digits
  30: /^\d{10}$/, // Greece: 10 digits
  31: /^\d{10}$/, // Netherlands: 10 digits
  32: /^\d{9}$/, // Belgium: 9 digits
  35: /^\d{8,9}$/, // Portugal: 8 or 9 digits
  36: /^\d{9}$/, // Hungary: 9 digits
  37: /^\d{8}$/, // Moldova: 8 digits
  38: /^\d{9}$/, // Slovenia: 9 digits
  40: /^\d{10}$/, // Romania: 10 digits
  42: /^\d{9}$/, // Slovakia: 9 digits
  43: /^\d{10}$/, // Austria: 10 digits
  45: /^\d{8}$/, // Denmark: 8 digits
  50: /^\d{10}$/, // Mongolia: 10 digits
  51: /^\d{9}$/, // Peru: 9 digits
  54: /^\d{10}$/, // Argentina: 10 digits
  56: /^\d{9}$/, // Chile: 9 digits
  57: /^\d{10}$/, // Colombia: 10 digits
  58: /^\d{11}$/, // Venezuela: 11 digits
  65: /^\d{8}$/, // Singapore: 8 digits
  66: /^\d{9,10}$/, // Thailand: 9 or 10 digits
  84: /^\d{10}$/, // Vietnam: 10 digits
  93: /^\d{9}$/, // Afghanistan: 9 digits
  992: /^\d{9}$/, // Tajikistan: 9 digits
  993: /^\d{9}$/, // Turkmenistan: 9 digits
  994: /^\d{9}$/, // Azerbaijan: 9 digits
  995: /^\d{9}$/, // Georgia: 9 digits
  996: /^\d{9}$/, // Kyrgyzstan: 9 digits
  998: /^\d{9}$/, // Uzbekistan: 9 digits
  213: /^\d{9}$/, // Algeria: 9 digits
  216: /^\d{8}$/, // Tunisia: 8 digits
  218: /^\d{9}$/, // Libya: 9 digits
  220: /^\d{7}$/, // Gambia: 7 digits
  221: /^\d{9}$/, // Senegal: 9 digits
  222: /^\d{8}$/, // Mauritania: 8 digits
  223: /^\d{8}$/, // Mali: 8 digits
  224: /^\d{9}$/, // Guinea: 9 digits
  225: /^\d{8}$/, // Côte d'Ivoire: 8 digits
  226: /^\d{8}$/, // Burkina Faso: 8 digits
  227: /^\d{8}$/, // Niger: 8 digits
  228: /^\d{8}$/, // Togo: 8 digits
  229: /^\d{8}$/, // Benin: 8 digits
  230: /^\d{7}$/, // Mauritius: 7 digits
  231: /^\d{7}$/, // Liberia: 7 digits
  232: /^\d{8}$/, // Sierra Leone: 8 digits
  233: /^\d{10}$/, // Ghana: 10 digits
  234: /^\d{10}$/, // Nigeria: 10 digits
  235: /^\d{8}$/, // Chad: 8 digits
  236: /^\d{8}$/, // Central African Republic: 8 digits
  237: /^\d{9}$/, // Cameroon: 9 digits
  238: /^\d{7}$/, // Cape Verde: 7 digits
  239: /^\d{7}$/, // São Tomé and Príncipe: 7 digits
};

const EditCreatePO = ({ socket }) => {
  const { purchaseOrderId } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    purchaseOrderId: "",
    poDate: "",
    poNumber: "",
    description: "",
    poStatus: "",
    buyerId: "",
    buyerName: "",
    buyerAddress: "",
    buyerEmail: "",
    buyerMobile: "",
    buyerCountryCode: "",
    buyerContactPersonMobile: "",
    buyerContactPersonCountryCode: "",
    buyerRegNo: "",
    buyerLocality: "",
    buyerLandmark: "",
    buyerCountry: "",
    buyerState: "",
    buyerCity: "",
    buyerPincode: "",
    supplierId: "",
    supplierName: "",
    supplierEmail: "",
    supplierAddress: "",
    supplierMobile: "",
    supplierCountryCode: "",
    supplierContactPersonMobile: "",
    supplierContactPersonCountryCode: "",
    supplierRegNo: "",
    supplierLocality: "",
    supplierLandmark: "",
    supplierCountry: "",
    supplierState: "",
    supplierCity: "",
    supplierPincode: "",
    orderItems: [],
  });

  const [loading, setLoading] = useState(false);
  const [poDetails, setPoDetails] = useState();
  const [selectedBuyerCountry, setSelectedBuyerCountry] = useState(null);
  const [selectedBuyerState, setSelectedBuyerState] = useState(null);
  const [selectedBuyerCity, setSelectedBuyerCity] = useState(null);
  const [selectedSupplierCountry, setSelectedSupplierCountry] = useState(null);
  const [selectedSupplierState, setSelectedSupplierState] = useState(null);
  const [selectedSupplierCity, setSelectedSupplierCity] = useState(null);

  const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
  const buyerIdLocalStorage = localStorage?.getItem("buyer_id");

  useEffect(() => {
    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      localStorage?.clear();
      navigate("/buyer/login");
      return;
    }
    const obj = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      purchaseOrder_id: purchaseOrderId,
    };
    postRequestWithToken(
      "purchaseorder/get-po-details",
      obj,
      async (response) => {
        if (response?.code === 200) {
          setPoDetails(response.result);
          const data = response.result;
          const formattedSupplierMobile = `${
            data?.supplier_country_code || ""
          }-${data?.supplier_mobile || ""}`;
          const formattedBuyerMobile = `${data.buyer_country_code || ""}-${
            data.buyer_mobile || ""
          }`;

          const buyerCountry = Country.getAllCountries().find(
            (country) => country.name === data.buyer_registered_address?.country
          );
          const supplierCountry = Country.getAllCountries().find(
            (country) => country.name === data.supplier_registered_address?.country
          );

          const buyerState = buyerCountry
            ? State.getStatesOfCountry(buyerCountry.isoCode).find(
                (state) => state.name === data.buyer_registered_address?.state
              ) || { name: "Other", isoCode: "OTHER" }
            : null;

          const supplierState = supplierCountry
            ? State.getStatesOfCountry(supplierCountry.isoCode).find(
                (state) => state.name === data.supplier_registered_address?.state
              ) || { name: "Other", isoCode: "OTHER" }
            : null;

          const buyerCity =
            buyerState && buyerState.isoCode !== "OTHER"
              ? City.getCitiesOfState(buyerCountry.isoCode, buyerState.isoCode).find(
                  (city) => city.name === data.buyer_registered_address?.city
                ) || { name: "Other" }
              : { name: data.buyer_registered_address?.city || "Other" };

          const supplierCity =
            supplierState && supplierState.isoCode !== "OTHER"
              ? City.getCitiesOfState(supplierCountry.isoCode, supplierState.isoCode).find(
                  (city) => city.name === data.supplier_registered_address?.city
                ) || { name: "Other" }
              : { name: data.supplier_registered_address?.city || "Other" };

          setSelectedBuyerCountry(buyerCountry || null);
          setSelectedBuyerState(buyerState || null);
          setSelectedBuyerCity(buyerCity || null);
          setSelectedSupplierCountry(supplierCountry || null);
          setSelectedSupplierState(supplierState || null);
          setSelectedSupplierCity(supplierCity || null);

          setFormData((prevFormData) => ({
            ...prevFormData,
            poId: data.purchaseOrder_id,
            poDate: data.po_date,
            poNumber: data.po_number,
            description: data.additional_instructions,
            supplierId: data.supplier_id,
            supplierName: data?.supplier_name,
            supplierEmail: data?.supplier_email,
            supplierAddress: data?.supplier_address,
            supplierMobile: formattedSupplierMobile,
            supplierContactPersonMobile: data?.supplier?.contact_person_mobile_no,
            supplierContactPersonCountryCode:
              data?.supplier?.contact_person_country_code,
            supplierRegNo: data?.supplier_regNo,
            supplierLocality: data?.supplier_registered_address?.locality || "",
            supplierLandmark: data?.supplier_registered_address?.land_mark || "",
            supplierCountry: data?.supplier_registered_address?.country || "",
            supplierState: data?.supplier_registered_address?.state || "",
            supplierCity: data?.supplier_registered_address?.city || "",
            supplierPincode: data?.supplier_registered_address?.pincode || "",
            buyerId: data.buyer_id,
            buyerName: data?.buyer_name,
            buyerEmail: data?.buyer_email,
            buyerAddress: data?.buyer_address,
            buyerMobile: formattedBuyerMobile,
            buyerRegNo: data?.buyer_regNo,
            buyerLocality: data?.buyer_registered_address?.locality || "",
            buyerLandmark: data?.buyer_registered_address?.land_mark || "",
            buyerCountry: data?.buyer_registered_address?.country || "",
            buyerState: data?.buyer_registered_address?.state || "",
            buyerCity: data?.buyer_registered_address?.city || "",
            buyerPincode: data?.buyer_registered_address?.pincode || "",
            orderItems: data?.items,
          }));
        } else {
        }
      }
    );
  }, [navigate, buyerIdSessionStorage, buyerIdLocalStorage, purchaseOrderId]);

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
    if (name === "buyerRegNo") {
      if (!/^[a-zA-Z0-9]{0,20}$/.test(value)) {
        newErrors.buyerRegNo = "";
        isValid = false;
      } else {
        newErrors.buyerRegNo = "";
      }
    }
    if (name === "buyerPincode" || name === "supplierPincode") {
      if (!/^\d{5,10}$/.test(value)) {
        newErrors[name] = "Pincode must be 5 to 10 digits";
        isValid = false;
      } else {
        newErrors[name] = "";
      }
    }
    if (name === "buyerLocality" || name === "supplierLocality") {
      if (!value) {
        newErrors[name] = "Area/Locality/Road Name is required";
        isValid = false;
      } else {
        newErrors[name] = "";
      }
    }
    if (isValid) {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
    setErrors((prevState) => ({ ...prevState, ...newErrors }));
  };

  const handleBuyerCountryChange = (selectedOption) => {
    setSelectedBuyerCountry(selectedOption);
    setSelectedBuyerState(null);
    setSelectedBuyerCity(null);
    setFormData((prevState) => ({
      ...prevState,
      buyerCountry: selectedOption ? selectedOption.name : "",
      buyerState: "",
      buyerCity: "",
    }));
    setErrors((prevState) => ({ ...prevState, buyerCountry: "" }));
  };

  const handleBuyerStateChange = (selectedOption) => {
    setSelectedBuyerState(selectedOption);
    setSelectedBuyerCity(null);
    setFormData((prevState) => ({
      ...prevState,
      buyerState: selectedOption ? selectedOption.name : "",
      buyerCity: "",
    }));
    setErrors((prevState) => ({ ...prevState, buyerState: "" }));
  };

  const handleBuyerCityChange = (selectedOption) => {
    setSelectedBuyerCity(selectedOption);
    setFormData((prevState) => ({
      ...prevState,
      buyerCity: selectedOption ? selectedOption.name : "",
    }));
    setErrors((prevState) => ({ ...prevState, buyerCity: "" }));
  };

  const handleSupplierCountryChange = (selectedOption) => {
    setSelectedSupplierCountry(selectedOption);
    setSelectedSupplierState(null);
    setSelectedSupplierCity(null);
    setFormData((prevState) => ({
      ...prevState,
      supplierCountry: selectedOption ? selectedOption.name : "",
      supplierState: "",
      supplierCity: "",
    }));
  };

  const handleSupplierStateChange = (selectedOption) => {
    setSelectedSupplierState(selectedOption);
    setSelectedSupplierCity(null);
    setFormData((prevState) => ({
      ...prevState,
      supplierState: selectedOption ? selectedOption.name : "",
      supplierCity: "",
    }));
  };

  const handleSupplierCityChange = (selectedOption) => {
    setSelectedSupplierCity(selectedOption);
    setFormData((prevState) => ({
      ...prevState,
      supplierCity: selectedOption ? selectedOption.name : "",
    }));
  };

  const resetForm = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      buyerName: "",
      buyerEmail: "",
      buyerAddress: "",
      buyerMobile: "",
      buyerRegNo: "",
      buyerLocality: "",
      buyerLandmark: "",
      buyerCountry: "",
      buyerState: "",
      buyerCity: "",
      buyerPincode: "",
    }));
    setSelectedBuyerCountry(null);
    setSelectedBuyerState(null);
    setSelectedBuyerCity(null);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.buyerName) formErrors.buyerName = "Buyer Name is Required";
    if (!formData.buyerEmail) formErrors.buyerEmail = "Buyer Email is Required";
    if (!formData.buyerAddress)
      formErrors.buyerAddress = "Buyer Address is Required";
    if (!formData.buyerMobile)
      formErrors.buyerMobile = "Buyer Mobile is Required";
    if (!formData.buyerRegNo)
      formErrors.buyerRegNo = "Buyer VAT Reg No. is Required";
    if (!formData.buyerLocality)
      formErrors.buyerLocality = "Area/Locality/Road Name is Required";
    if (!formData.buyerCountry)
      formErrors.buyerCountry = "Country is Required";
    if (!formData.buyerPincode)
      formErrors.buyerPincode = "Pincode is Required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      localStorage?.clear();
      navigate("/buyer/login");
      return;
    }
    if (validateForm()) {
      setLoading(true);
      const supplierId =
        poDetails?.supplier_id || poDetails?.supplier_details[0]?.supplier_id;
      const enquiryId = poDetails?.enquiry_id;

      const obj = {
        buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
        purchaseOrder_id: purchaseOrderId,
        supplier_id: supplierId,
        enquiry_id: enquiryId,
        data: formData,
      };

      postRequestWithToken("purchaseorder/edit-po", obj, async (response) => {
        if (response?.code === 200) {
          toast(response.message, { type: "success" });
          socket.emit("editPO", {
            supplierId: poDetails?.supplier_id,
            inquiryId: enquiryId,
            message: `PO Edited for ${enquiryId}`,
            link: process.env.REACT_APP_PUBLIC_URL,
          });
          setTimeout(() => {
            navigate("/buyer/enquiry/purchased-order");
            setLoading(true);
          }, 1000);
        } else {
          setLoading(false);
          toast(response.message, { type: "error" });
        }
      });
    } else {
      setLoading(false);
      toast("Some Fields are Missing", { type: "error" });
    }
  };

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
    let countryCode = "";
    let mobileNumber = value;
    let isValidNumber = false;

    for (let code of countryCodes) {
      if (value?.startsWith(code)) {
        countryCode = code.replace("+", "");
        mobileNumber = value.substring(code.length);
        break;
      }
    }

    if (countryCode && mobileNumber) {
      isValidNumber = validatePhoneNumber(mobileNumber, countryCode);

      if (isValidNumber) {
        const formattedPhoneNumber = formatPhoneNumber(
          mobileNumber,
          countryCode
        );

        setFormData((prevState) => ({
          ...prevState,
          [type]: formattedPhoneNumber,
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [type]: "",
        }));
        console.error(
          "Invalid phone number format for the specified country code"
        );
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [type]: "",
      }));
      console.error("Invalid phone number format or unknown country code");
    }
  };

  return (
    <div className={styles["create-invoice-container"]}>
      <div className={styles["create-invoice-heading"]}>
        Edit Purchase Order
      </div>
      <form
        className={styles["create-po-main-form-container"]}
        onSubmit={handleSubmit}
      >
        <div className={styles["create-invoice-section"]}>
          <div className={styles["create-invoice-form-heading"]}>Buyer</div>
          <div className={styles["craete-invoice-form"]}>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Name*</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="buyerName"
                placeholder="Enter Name"
                value={formData.buyerName}
                onChange={handleChange}
              />
              {errors.buyerName && (
                <p style={{ color: "red" }}>{errors.buyerName}</p>
              )}
            </div>
             <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Company Registration Number*
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="buyerRegNo"
                placeholder="Enter Company Registration Number"
                value={formData.buyerRegNo}
                onChange={handleChange}
              />
              {errors.buyerRegNo && (
                <p style={{ color: "red" }}>{errors.buyerRegNo}</p>
              )}
            </div>
              <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Email ID*
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="email"
                name="buyerEmail"
                placeholder="Enter Email ID"
                value={formData.buyerEmail}
                onChange={handleChange}
              />
              {errors.buyerEmail && (
                <p style={{ color: "red" }}>{errors.buyerEmail}</p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Mobile Number*
              </label>
              <PhoneInput
                className="signup-form-section-phone-input"
                defaultCountry="ae"
                name="buyerMobile"
                placeholder="Enter Mobile No."
                value={formData.buyerMobile}
                onChange={(value) => handlePhoneChange(value, "buyerMobile")}
              />
              {errors.buyerMobile && (
                <p style={{ color: "red" }}>{errors.buyerMobile}</p>
              )}
            </div>
           
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
               Billing Address*
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="buyerAddress"
                placeholder="Enter Address"
                value={formData.buyerAddress}
                onChange={handleChange}
              />
              {errors.buyerAddress && (
                <p style={{ color: "red" }}>{errors.buyerAddress}</p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Area/Locality/Road Name*
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="buyerLocality"
                placeholder="Enter Area/Locality/Road Name"
                value={formData.buyerLocality}
                onChange={handleChange}
              />
              {errors.buyerLocality && (
                <p style={{ color: "red" }}>{errors.buyerLocality}</p>
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
                placeholder="Enter Landmark"
                value={formData.buyerLandmark}
                onChange={handleChange}
              />
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Country*
              </label>
              <Select
                options={Country.getAllCountries()}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.isoCode}
                value={selectedBuyerCountry}
                onChange={handleBuyerCountryChange}
                placeholder="Select Country"
              />
              {errors.buyerCountry && (
                <p style={{ color: "red" }}>{errors.buyerCountry}</p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                State/Province
              </label>
              <Select
                options={
                  selectedBuyerCountry
                    ? [
                        ...State.getStatesOfCountry(selectedBuyerCountry.isoCode),
                        { name: "Other", isoCode: "OTHER" },
                      ]
                    : []
                }
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.isoCode}
                value={selectedBuyerState}
                onChange={handleBuyerStateChange}
                placeholder="Select State"
              />
              {errors.buyerState && (
                <p style={{ color: "red" }}>{errors.buyerState}</p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                City/Town
              </label>
              <Select
                options={
                  selectedBuyerState && selectedBuyerState.isoCode !== "OTHER"
                    ? [
                        ...City.getCitiesOfState(
                          selectedBuyerCountry.isoCode,
                          selectedBuyerState.isoCode
                        ),
                        { name: "Other" },
                      ]
                    : [{ name: "Other" }]
                }
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.name}
                value={selectedBuyerCity}
                onChange={handleBuyerCityChange}
                placeholder="Select City"
              />
              {errors.buyerCity && (
                <p style={{ color: "red" }}>{errors.buyerCity}</p>
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
              />
              {errors.buyerPincode && (
                <p style={{ color: "red" }}>{errors.buyerPincode}</p>
              )}
            </div>
          
          </div>
        </div>
        <div className={styles["create-invoice-section"]}>
          <div className={styles["create-invoice-form-heading"]}>Supplier</div>
          <div className={styles["craete-invoice-form"]}>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                PO Date*
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="poDate"
                value={formData.poDate}
                readOnly
              />
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                PO Number*
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="poNumber"
                value={formData.poNumber}
                readOnly
              />
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>Name*</label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="supplierName"
                placeholder="Enter Name"
                value={formData.supplierName}
                readOnly
              />
              {errors.supplierName && <p>{errors.supplierName.message}</p>}
            </div>
             <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Company Registration Number*
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="supplierRegNo"
                placeholder="Enter Company Registration Number"
                readOnly
                value={formData.supplierRegNo}
              />
              {errors.supplierRegNo && <p>{errors.supplierRegNo.message}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Email ID*
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="email"
                name="supplierEmail"
                placeholder="Enter Email ID"
                value={formData.supplierEmail}
                readOnly
              />
              {errors.supplierEmail && <p>{errors.supplierEmail.message}</p>}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Mobile Number*
              </label>
              <PhoneInput
                className="signup-form-section-phone-input"
                defaultCountry="ae"
                name="supplierMobile"
                value={formData.supplierMobile}
                disabled
                placeholder="Enter Mobile No."
              />
              {errors.supplierMobile && <p>{errors.supplierMobile.message}</p>}
            </div>
           
            {/* <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
               Billing Address*
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="supplierAddress"
                placeholder="Enter Address"
                value={formData.supplierAddress}
                readOnly
              />
              {errors.supplierAddress && (
                <p>{errors.supplierAddress.message}</p>
              )}
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Area/Locality/Road Name*
              </label>
              <input
                className={styles["create-invoice-div-input"]}
                type="text"
                name="supplierLocality"
                placeholder="Enter Area/Locality/Road Name"
                value={formData.supplierLocality}
                readOnly
              />
              {errors.supplierLocality && (
                <p style={{ color: "red" }}>{errors.supplierLocality}</p>
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
                readOnly
              />
            </div> */}
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                Country*
              </label>
              <Select
                options={Country.getAllCountries()}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.isoCode}
                value={selectedSupplierCountry}
                onChange={handleSupplierCountryChange}
                placeholder="Select Country"
                isDisabled
              />
            </div>
            {/* <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                State/Province
              </label>
              <Select
                options={
                  selectedSupplierCountry
                    ? [
                        ...State.getStatesOfCountry(selectedSupplierCountry.isoCode),
                        { name: "Other", isoCode: "OTHER" },
                      ]
                    : []
                }
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.isoCode}
                value={selectedSupplierState}
                onChange={handleSupplierStateChange}
                placeholder="Select State"
                isDisabled
              />
            </div>
            <div className={styles["create-invoice-div-container"]}>
              <label className={styles["create-invoice-div-label"]}>
                City/Town
              </label>
              <Select
                options={
                  selectedSupplierState && selectedSupplierState.isoCode !== "OTHER"
                    ? [
                        ...City.getCitiesOfState(
                          selectedSupplierCountry.isoCode,
                          selectedSupplierState.isoCode
                        ),
                        { name: "Other" },
                      ]
                    : [{ name: "Other" }]
                }
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.name}
                value={selectedSupplierCity}
                onChange={handleSupplierCityChange}
                placeholder="Select City"
                isDisabled
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
                readOnly
              />
              {errors.supplierPincode && (
                <p style={{ color: "red" }}>{errors.supplierPincode}</p>
              )}
            </div> */}
            
          </div>
        </div>

        <div className={styles["create-invoice-section"]}>
          <div className={styles["create-invoice-add-item-cont"]}>
            <div className={styles["create-invoice-form-heading"]}>
              Order Details
            </div>
          </div>
          {poDetails?.order_items?.map((item, index) => (
            <div className={styles["form-item-container"]} key={item._id}>
              <div className={styles["craete-invoice-form"]}>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Item Name
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name={`orderItems[${index}].productName`}
                    placeholder="Item Name"
                    value={
                      item?.medicine_details?.medicine_name ||
                      item?.medicine_name
                    }
                    readOnly
                  />
                  {errors.orderItems?.[index]?.productName && (
                    <p>{errors.orderItems[index].productName.message}</p>
                  )}
                </div>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Quantity
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name={`orderItems[${index}].quantity`}
                    placeholder="Enter Quantity"
                    value={item?.quantity_required}
                    readOnly
                  />
                  {errors.orderItems?.[index]?.quantity && (
                    <p>{errors.orderItems[index].quantity.message}</p>
                  )}
                </div>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Price
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name={`orderItems[${index}].unitPrice`}
                    placeholder="Enter Price"
                    value={item?.counter_price || item?.target_price}
                    readOnly
                  />
                  {errors.orderItems?.[index]?.unitPrice && (
                    <p>{errors.orderItems[index].unitPrice.message}</p>
                  )}
                </div>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Tax%
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name={`orderItems[${index}].unitTax`}
                    placeholder="Enter Unit Tax"
                    value={item?.medicine_details?.general?.unit_tax || 0}
                    readOnly
                  />
                  {errors.orderItems?.[index]?.unitTax && (
                    <p>{errors.orderItems[index].unitTax.message}</p>
                  )}
                </div>
                <div className={styles["create-invoice-div-container"]}>
                  <label className={styles["create-invoice-div-label"]}>
                    Total Amount
                  </label>
                  <input
                    className={styles["create-invoice-div-input"]}
                    type="text"
                    name={`orderItems[${index}].totalAmount`}
                    placeholder="Enter Total Amount"
                    value={item?.total_amount}
                    readOnly
                  />
                  {errors.orderItems?.[index]?.totalAmount && (
                    <p>{errors.orderItems[index].totalAmount.message}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles["create-invoice-section"]}>
          <div className={styles["create-invoice-form-heading"]}>
            Additional Instructions
          </div>
          <div className={styles["craete-invoice-form"]}>
            <div className={styles["create-invoice-div-textarea"]}>
              <label className={styles["create-invoice-div-label"]}>
                Description
              </label>
              <textarea
                className={styles["create-invoice-div-input"]}
                name="description"
                rows="4"
                cols="10"
                placeholder="Enter Description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className={styles["craete-invoices-button"]}>
          <button
            type="submit"
            className={styles["create-invoices-submit"]}
            disabled={loading}
          >
            {loading ? <div className="loading-spinner"></div> : "Edit"}
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

export default EditCreatePO;