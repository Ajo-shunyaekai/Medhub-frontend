import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cross from "../../../assets/images/Icon.svg";
import { useNavigate } from "react-router-dom";
import Select, { components } from "react-select";
import countryList from "react-select-country-list";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Information from "../../../assets/images/infomation.svg";
import { Country, State, City } from "country-state-city";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import CertificateUploader from "./CertificateUploader";
import "./signup.css";
import styles from "./SupplierSignUp.module.css";
import logo from "../../../assets/images/logo.svg";
import SuccessModal from "./SuccessModal";
import ImageUploader from "./ImageUploader";
import { apiRequests } from "../../../../api/index";
import { toast } from "react-toastify";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import TermsAndConditions from "../../../../Policies/Terms&Conditions";
import categoryArrays from "../../../../utils/Category";

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

const SupplierSignUp = ({ socket }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showTnC, setShowTnC] = useState(false);
  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [countries, setCountries] = useState([]);
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyCountryCode, setCompanyCountryCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [resetUploaders, setResetUploaders] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedCompanyType, setSelectedCompanyType] = useState(null);
  const [addressType, setAddressType] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [tradeLicensePreviews, setTradeLicensePreviews] = useState([]);
  const [file, setfile] = useState([]);
  const [certificatePreviews, setcertificatePreviews] = useState([]);
  const [medicalPractitionerPreview, setMedicalPractiotionerPreview] = useState(
    []
  );
  const [logoPreviews, setlogoPreviews] = useState([]);
  const [category, setCategory] = useState([]);
  const [cNCFileArray, setCNCFileArray] = useState([]);
  const [cNCFileError, setCNCFileError] = useState([]);
  const [certificateFileNDate, setCertificateFileNDate] = useState([
    { file: null, date: null },
  ]);
  const [selectedYear, setSelectedYear] = useState(null);

  const handleYearChange = (date) => {
    formData.yrFounded = date.getFullYear();
    setSelectedYear(date);
  };

  const handleDateChange = (date, index) => {
    const updatedSections = [...certificateFileNDate];
    updatedSections[index].date = date;
    setCertificateFileNDate(updatedSections);
  };

  const addNewSection = (e) => {
    e.preventDefault();
    certificateFileNDate?.length < 4 &&
      setCertificateFileNDate((prev) => [...prev, { file: null, date: null }]);
  };

  const removeSection = (index) => {
    if (certificateFileNDate.length > 1) {
      const updatedSections = certificateFileNDate.filter(
        (_, i) => i !== index
      );
      setCertificateFileNDate(updatedSections);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`taxImage_${index}`];
        delete newErrors[`date_${index}`];
        return newErrors;
      });
    }
  };

  const defaultFormData = {
    companyType: "",
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    websiteAddress: "",
    salesPersonName: "",
    contactPersonName: "",
    designation: "",
    email: "",
    mobile: "",
    bankdetails: "",
    delivertime: "",
    tags: "",
    categories: [],
    originCountry: "",
    operationCountries: [],
    companyLicenseNo: "",
    yrFounded: "",
    annualTurnover: "",
    companyLicenseExpiry: "",
    companyTaxNo: "",
    description: "",
    activityCode: "",
    taxImage: null,
    taxImageType: "tax",
    logoImage: null,
    logoImageType: "logo",
    licenseImage: null,
    licenseImageType: "license",
    certificateImage: null,
    certificateImageType: "certificate",
    medicalCertificateImage: null,
    medicalCertificateType: "medicalCertificate",
    terms: "",
    date: null,
    registrationNo: "",
    vatRegistrationNo: "",
    locality: "",
    landMark: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    usertype: "Supplier",
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setSelectedState("");
    setSelectedCity("");
    if (!selectedOption) {
      setErrors((prevState) => ({
        ...prevState,
        country: "Country is required",
      }));
    } else {
      setErrors((prevState) => ({ ...prevState, country: "" }));
      setFormData({ ...formData, country: selectedOption });
    }
  };

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption || "");
    setSelectedCity("");
    if (!selectedOption) {
      setErrors((prevState) => ({
        ...prevState,
        state: "State is required",
      }));
    } else {
      setErrors((prevState) => ({ ...prevState, state: "" }));
      setFormData({ ...formData, state: selectedOption });
    }
  };

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption || "");
    if (!selectedOption) {
      setErrors((prevState) => ({
        ...prevState,
        city: "City is required",
      }));
    } else {
      setErrors((prevState) => ({ ...prevState, city: "" }));
      setFormData({ ...formData, city: selectedOption });
    }
  };

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    const options = countryList().getData();
    setCountries(options);
  }, []);

  useEffect(() => {
    const categoryOptions = categoryArrays?.map((cat) => ({
      value: cat.name,
      label: cat.name,
    }));
    setCategory(categoryOptions);
  }, []);

  const companyTypeOptions = [
    { value: "manufacturer", label: "Manufacturer" },
    { value: "distributor", label: "Distributor" },
    { value: "service provider", label: "Service Provider" },
    { value: "medical practitioner", label: "Medical Practitioner" },
  ];

  const handleCompanyTypeChange = (selectedOption) => {
    setSelectedCompanyType(selectedOption);
    setFormData((prevState) => ({ ...prevState, companyType: selectedOption }));
    if (!selectedOption) {
      setErrors((prevState) => ({
        ...prevState,
        companyType: "Company Type is Required",
      }));
    } else {
      setErrors((prevState) => ({ ...prevState, companyType: "" }));
    }
  };

  const handleImageUpload = (hasImage, file, imageType) => {
    setFormData((prevState) => ({
      ...prevState,
      [`${imageType}Image`]: null,
    }));
    setTimeout(() => {
      setFormData((prevState) => ({
        ...prevState,
        [`${imageType}Image`]: hasImage ? file : null,
      }));
    }, 0);
    setErrors((prevState) => ({
      ...prevState,
      [`${imageType}Image`]:
        !hasImage && !file ? `${imageType} image is Required` : "",
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const alphanumericNoSpaceRegex = /^[a-zA-Z0-9]*$/;
    const numericRegex = /^[0-9]*$/; // Only digits

    // Handle license expiry date validation
    if (name === "companyLicenseExpiry") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      if (value.length === 10) {
        const [day, month, year] = value?.split("-").map(Number);
        const inputDate = new Date(year, month - 1, day);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        inputDate.setHours(0, 0, 0, 0);
        if (
          inputDate.getFullYear() === year &&
          inputDate.getMonth() === month - 1 &&
          inputDate.getDate() === day
        ) {
          if (inputDate <= currentDate) {
            setErrors((prevState) => ({
              ...prevState,
              companyLicenseExpiry: "License expiry date must be a future date",
            }));
          } else {
            setErrors((prevState) => ({
              ...prevState,
              companyLicenseExpiry: "",
            }));
          }
        } else {
          setErrors((prevState) => ({
            ...prevState,
            companyLicenseExpiry: "Please enter a valid date",
          }));
        }
      }
      return;
    }

    // Bank details validation
    if (name === "bankdetails") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      let errorMessage = "";
      if (!value.trim()) {
        errorMessage = "Please enter bank details";
      }
      setErrors((prevState) => ({
        ...prevState,
        bankdetails: errorMessage,
      }));
      return;
    }

    // Relaxed validations to allow copy-paste
    if (
      (name === "companyName" ||
        name === "companyEmail" ||
        name === "email" ||
        name === "locality" ||
        name === "landMark") &&
      value.length > 50
    ) {
      setErrors((prevState) => ({
        ...prevState,
        [name]: `Maximum 50 characters allowed`,
      }));
      return;
    }

    if (name === "companyAddress" && value.length > 150) {
      setErrors((prevState) => ({
        ...prevState,
        [name]: `Maximum 150 characters allowed`,
      }));
      return;
    }

    if ((name === "tags" || name === "activityCode") && value.length > 60) {
      setErrors((prevState) => ({
        ...prevState,
        [name]: `Maximum 60 characters allowed`,
      }));
      return;
    }

    if (
      ["vatRegistrationNo", "companyLicenseNo", "companyTaxNo"].includes(name)
    ) {
      if (value.length > 16) {
        setErrors((prevState) => ({
          ...prevState,
          [name]: `Maximum 16 characters allowed`,
        }));
        return;
      }
      if (!alphanumericNoSpaceRegex.test(value)) {
        setErrors((prevState) => ({
          ...prevState,
          [name]: `Only alphanumeric characters allowed`,
        }));
        return;
      }
    }

    if (["registrationNo"].includes(name)) {
      if (value.length >= 20) {
        setErrors((prevState) => ({
          ...prevState,
          [name]: `Maximum 20 characters allowed`,
        }));
        return;
      }
      if (!alphanumericNoSpaceRegex.test(value)) {
        setErrors((prevState) => ({
          ...prevState,
          [name]: `Only alphanumeric characters allowed`,
        }));
        return;
      }
    }

    if (name === "description" && value.length > 2000) {
      setErrors((prevState) => ({
        ...prevState,
        description: "Description cannot exceed 2000 characters",
      }));
      return;
    }

    // Relaxed validation for contactPersonName, designation, salesPersonName to allow special characters
    if (
      (name === "contactPersonName" ||
        name === "designation" ||
        name === "salesPersonName") &&
      value.length > 50
    ) {
      setErrors((prevState) => ({
        ...prevState,
        [name]: `Maximum 50 characters allowed`,
      }));
      return;
    }

    if (name === "delivertime" && !/^\d{0,3}$/.test(value)) {
      setErrors((prevState) => ({
        ...prevState,
        delivertime: `Only up to 3 digits allowed`,
      }));
      return;
    }

    if (name === "pincode" && !/^[A-Za-z0-9-]{0,8}$/.test(value)) {
      setErrors((prevState) => ({
        ...prevState,
        pincode: `Only alphanumeric characters and hyphens allowed (max 8)`,
      }));
      return;
    }

    if (name === "annualTurnover") {
      if (!numericRegex.test(value)) {
        setErrors((prevState) => ({
          ...prevState,
          annualTurnover: "",
        }));
        return;
      }
    }

    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevState) => ({ ...prevState, [name]: "" }));
  };

  const handlePhoneChange = (name, value) => {
    setErrors((prevState) => ({ ...prevState, [name]: "" }));
    try {
      const phoneNumber = parsePhoneNumber(value);
      if (phoneNumber && isValidPhoneNumber(value)) {
        const countryCode = phoneNumber.countryCallingCode;
        const nationalNumber = phoneNumber.nationalNumber;
        const formattedNumber = `+${countryCode} ${nationalNumber}`;
        setFormData((prevState) => ({ ...prevState, [name]: formattedNumber }));
      } else {
        setErrors((prevState) => ({
          ...prevState,
          [name]: "Invalid phone number",
        }));
      }
    } catch (error) {
      setErrors((prevState) => ({
        ...prevState,
        [name]: "",
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = async () => {
    let formErrors = {};

    if (!formData.companyType)
      formErrors.companyType = "Company Type is Required";
    if (!formData.companyName)
      formErrors.companyName = "Company Name is Required";
    if (!formData.companyAddress)
      formErrors.companyAddress = "Company Address is Required";
    if (formData.companyEmail && !validateEmail(formData.companyEmail))
      formErrors.companyEmail = "Invalid Company Email ID";
    try {
      if (!companyPhone) {
        formErrors.companyPhone = "Company Phone No. is Required";
      } else {
        const companyPhoneNumber = parsePhoneNumber(companyPhone);
        if (!companyPhoneNumber || !isValidPhoneNumber(companyPhone)) {
          formErrors.companyPhone = "Invalid Company Phone Number";
        }
      }
      if (!mobile) {
        formErrors.mobile = "Mobile No. is Required";
      } else {
        const mobileNumber = parsePhoneNumber(mobile);
        if (!mobileNumber || !isValidPhoneNumber(mobile)) {
          formErrors.mobile = "Invalid Mobile Number";
        }
      }
    } catch (error) {
      formErrors.companyPhone = "Invalid Phone Number Format";
      formErrors.mobile = "Invalid Phone Number Format";
    }
    if (!formData.contactPersonName)
      formErrors.contactPersonName = "Contact Person Name is Required";
    if (!formData.designation)
      formErrors.designation = "Designation is Required";
    if (!formData.email) formErrors.email = "Email ID is Required";
    if (formData.email && !validateEmail(formData.email))
      formErrors.email = "Invalid Email ID";
    if (!formData.originCountry)
      formErrors.originCountry = "Country of Origin is Required";
    if (!formData.operationCountries.length)
      formErrors.operationCountries = "Country of Operation is Required";
    if (!formData.categories.length)
      formErrors.categories = "Trade In Category is Required";
    if (!formData.bankdetails)
      formErrors.bankdetails = "Bank Details are Required";
    if (!formData.description)
      formErrors.description = "Description is Required";
    if (formData.description.length > 1000)
      formErrors.description = "Description cannot exceed 1000 characters";
    if (!formData.logoImage) formErrors.logoImage = "Logo Image is Required";
    if (!formData.licenseImage)
      formErrors.licenseImage = "License Image is Required";
    if (
      selectedCompanyType?.value === "medical practitioner" &&
      !formData.medicalCertificateImage
    ) {
      formErrors.medicalCertificateImage =
        "Medical Certificate Image is Required";
    }
    if (!formData.registrationNo)
      formErrors.registrationNo = "Registration No. is Required";
    if (!formData.vatRegistrationNo)
      formErrors.vatRegistrationNo = "GST/VAT Registration No. is Required";
    if (!formData.activityCode)
      formErrors.activityCode = "Business/Trade Activity is Required";
    if (!formData.locality) formErrors.locality = "Locality is Required";
    if (!formData.country) formErrors.country = "Country is Required";
    if (selectedCompanyType?.value !== "service provider") {
      if (
        Array.isArray(certificateFileNDate) &&
        certificateFileNDate.length > 0
      ) {
        const fileErrors = [];
        certificateFileNDate.forEach((item, index) => {
          if (!item.file) {
            fileErrors.push(`File is required for entry ${index + 1}`);
            const fileErrorArr = cNCFileError || [];
            fileErrorArr[index] = `File is required.`;
            setCNCFileError(fileErrorArr);
          } else {
            const fileErrorArr = cNCFileError || [];
            fileErrorArr[index] = "";
            setCNCFileError(fileErrorArr);
          }
        });
        if (fileErrors.length > 0) {
          formErrors.certificateFileNDate = fileErrors.join(", ");
        }
      }
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  useEffect(() => {
    if (resetUploaders) {
      setResetUploaders(false);
    }
  }, [resetUploaders]);

  const handleCloseModal = () => setShowModal(false);
  const handleCountryOriginChange = (selectedOption) => {
    setFormData({ ...formData, originCountry: selectedOption.label });
    if (!selectedOption) {
      setErrors((prevState) => ({
        ...prevState,
        originCountry: "Country of Origin is Required",
      }));
    } else {
      setErrors((prevState) => ({ ...prevState, originCountry: "" }));
    }
  };

  const handleOperationCountriesChange = (selectedOptions) => {
    const selectedLabels = selectedOptions?.map((option) => option.label) || [];
    setFormData({
      ...formData,
      operationCountries: selectedOptions,
    });
    setErrors((prevState) => ({
      ...prevState,
      operationCountries:
        selectedLabels.length === 0 ? "Country of Operation is Required" : "",
    }));
  };

  const handleCategoriesChange = (selectedOptions) => {
    const selectedLabels = selectedOptions?.map((option) => option.label) || [];
    setFormData({
      ...formData,
      categories: selectedOptions,
    });
    setErrors((prevState) => ({
      ...prevState,
      categories:
        selectedLabels.length === 0 ? "Trade In Category is Required" : "",
    }));
  };

  const getDropdownButtonLabel = ({ placeholderButtonLabel, value }) => {
    if (value && value.length) {
      return value.map((country) => country.label).join(", ");
    }
    return placeholderButtonLabel;
  };

  const handleCancel = () => {
    localStorage?.clear();
    navigate("/supplier/login");
  };

  const handleResetForm = () => {
    setFormData(defaultFormData);
    setErrors({});
    setIsChecked(false);
    setCompanyPhone("");
    setMobile("");
    setSelectedCompanyType(null);
    setResetUploaders(true);
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
  };

  const handleSubmit = async () => {
    const isFormValid = await validateForm();
    if (isFormValid) {
      if (!isChecked) {
        toast("You must agree to the terms and conditions", { type: "error" });
        return;
      }
      setLoading(true);
      const formDataToSend = new FormData();
      const countryLabels =
        formData.operationCountries.map((country) =>
          country ? country.label : ""
        ) || [];
      const categoryLabels =
        formData.categories?.map((category) =>
          category ? category.label : ""
        ) || [];

      formDataToSend.append("supplier_type", formData.companyType?.label);
      formDataToSend.append("supplier_name", formData.companyName);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("supplier_address", formData.companyAddress);
      formDataToSend.append("website_address", formData.websiteAddress);
      formDataToSend.append("supplier_mobile_no", formData.companyPhone);
      formDataToSend.append("license_no", formData.companyLicenseNo);
      formDataToSend.append(
        "license_expiry_date",
        formData.companyLicenseExpiry
      );
      formDataToSend.append("country_of_origin", formData.originCountry);
      formDataToSend.append("sales_person_name", formData.salesPersonName);
      formDataToSend.append("contact_person_name", formData.contactPersonName);
      formDataToSend.append("designation", formData.designation);
      formDataToSend.append("bank_details", formData.bankdetails);
      formDataToSend.append("tags", formData.tags);
      formDataToSend.append("estimated_delivery_time", formData.delivertime);
      formDataToSend.append("contact_person_mobile", formData.mobile);
      formDataToSend.append("contact_person_email", formData.email);
      formDataToSend.append("registration_no", formData.registrationNo);
      formDataToSend.append("vat_reg_no", formData.vatRegistrationNo);
      countryLabels.forEach((item) =>
        formDataToSend.append("country_of_operation", item)
      );
      categoryLabels.forEach((item) =>
        formDataToSend.append("categories", item)
      );
      formDataToSend.append("tax_no", formData.companyTaxNo);
      formDataToSend.append("activity_code", formData.activityCode);
      formDataToSend.append("locality", formData.locality);
      formDataToSend.append("land_mark", formData.landMark);
      formDataToSend.append("country", formData.country?.name);
      formDataToSend.append("state", formData.state?.name || "");
      formDataToSend.append("city", formData.city?.name || "");
      formDataToSend.append("pincode", formData.pincode);
      formDataToSend.append("usertype", formData.usertype);
      formDataToSend.append("annualTurnover", formData.annualTurnover);
      formDataToSend.append("yrFounded", formData.yrFounded);

      (Array.isArray(formData.logoImage) ? formData.logoImage : []).forEach(
        (file) => formDataToSend.append("supplier_image", file)
      );
      (Array.isArray(formData.licenseImage)
        ? formData.licenseImage
        : []
      ).forEach((file) => formDataToSend.append("license_image", file));
      (Array.isArray(formData.taxImage) ? formData.taxImage : []).forEach(
        (file) => formDataToSend.append("tax_image", file)
      );
      (Array.isArray(cNCFileArray) ? cNCFileArray : []).forEach((file) =>
        formDataToSend.append("certificate_image", file)
      );
      if (selectedCompanyType?.value === "medical practitioner") {
        (Array.isArray(formData.medicalCertificateImage)
          ? formData.medicalCertificateImage
          : []
        ).forEach((file) =>
          formDataToSend.append("medical_practitioner_image", file)
        );
      }

      const certificateFileNDateUpdated = JSON.stringify(
        certificateFileNDate?.map((section) => ({
          date: section?.date || "",
          file: Array.isArray(section?.file)
            ? section?.file?.[0]
            : section?.file || "",
        })) || [{ date: "", file: "" }]
      );
      formDataToSend.append(
        "certificateFileNDate",
        certificateFileNDateUpdated
      );

      try {
        const response = await apiRequests?.postRequestWithFile(
          `auth/register`,
          formDataToSend,
          "Supplier"
        );
        if (response?.code !== 200) {
          setLoading(false);
          toast(response.message, { type: "error" });
          return;
        }
        handleResetForm();
        setShowModal(true);
        setLoading(false);
        setMedicalPractiotionerPreview([]);
        socket.emit("supplierRegistration", {
          adminId: process.env.REACT_APP_ADMIN_ID,
          message: `New Supplier Registration Request `,
          link: process.env.REACT_APP_PUBLIC_URL,
        });
      } catch (error) {
        setLoading(false);
        toast(error.message, { type: "error" });
      }
    } else {
      setLoading(false);
      toast("Some Fields are Missing", { type: "error" });
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleSubmit();
  };

  const parseDateString = (dateString) => {
    const [day, month, year] = dateString?.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  return (
    <>
      {showTnC ? (
        <TermsAndConditions
          setShowTnC={setShowTnC}
          showTnC={showTnC}
          isChecked={isChecked}
          setIsChecked={setIsChecked}
        />
      ) : (
        <>
          <div className={styles.signupContainer}>
            <div className={styles.signupLogoSection}>
              <img src={logo} alt="Signup Logo" />
            </div>
            <div className={styles.signupFormSection}>
              <div className={styles.signupFormSectionHeading}>
                Supplier Registration
              </div>
              <form
                className={styles.signupFormContainer}
                onSubmit={handleFormSubmit}
              >
                <div className={styles.signupFormSectionContainer}>
                  <div className={styles.signupInnerHeading}>
                    Company Details
                  </div>
                  <div className={styles.signupFormInnerDivSection}>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Company Type<span className={styles.labelStamp}>*</span>
                      </label>
                      <Select
                        value={selectedCompanyType}
                        onChange={handleCompanyTypeChange}
                        options={companyTypeOptions}
                      />
                      {errors.companyType && (
                        <div className={styles.signupErrors}>
                          {errors.companyType}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Company Name<span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.signupTooltipClass}>
                        <input
                          className={styles.signupFormSectionInput}
                          type="text"
                          name="companyName"
                          placeholder="Enter Company Name"
                          value={formData.companyName}
                          onChange={handleChange}
                        />
                        <span
                          className={styles.emailInfoIcon}
                          data-tooltip-id="company-name-tooltip"
                          data-tooltip-content="Provide your legal entity name, matching with the company registration certificate."
                        >
                          <img
                            src={Information}
                            className={styles.tooltipIcons}
                            alt="information"
                          />
                        </span>
                        <Tooltip id="company-name-tooltip" />
                      </div>
                      {errors.companyName && (
                        <div className={styles.signupErrors}>
                          {errors.companyName}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Company Registration Number
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <input
                        className={styles.signupFormSectionInput}
                        type="text"
                        name="registrationNo"
                        placeholder="Enter Company Registration Number"
                        value={formData.registrationNo}
                        onChange={handleChange}
                      />
                      {errors.registrationNo && (
                        <div className={styles.signupErrors}>
                          {errors.registrationNo}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        GST/VAT Registration Number
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.signupTooltipClass}>
                        <input
                          className={styles.signupFormSectionInput}
                          type="text"
                          name="vatRegistrationNo"
                          placeholder="Enter GST/VAT Registration Number"
                          value={formData.vatRegistrationNo}
                          onChange={handleChange}
                        />
                        <span
                          className={styles.emailInfoIcon}
                          data-tooltip-id="company-name-tooltip"
                          data-tooltip-content="Provide your GST/VAT Registration Number"
                        >
                          <img
                            src={Information}
                            className={styles.tooltipIcons}
                            alt="information"
                          />
                        </span>
                        <Tooltip id="company-name-tooltip" />
                      </div>
                      {errors.vatRegistrationNo && (
                        <div className={styles.signupErrors}>
                          {errors.vatRegistrationNo}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Company Website
                      </label>
                      <input
                        className={styles.signupFormSectionInput}
                        type="text"
                        name="websiteAddress"
                        placeholder="Enter Company's Website"
                        value={formData.websiteAddress}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Company Phone No.
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <PhoneInput
                        className={styles.signupFormSectionPhoneInput}
                        defaultCountry="gb"
                        name="companyPhone"
                        value={companyPhone}
                        onChange={(value) => {
                          handlePhoneChange("companyPhone", value);
                          setCompanyPhone(value);
                        }}
                      />
                      {errors.companyPhone && (
                        <div className={styles.signupErrors}>
                          {errors.companyPhone}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Company Billing Address
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <input
                        className={styles.signupFormSectionInput}
                        type="text"
                        name="companyAddress"
                        placeholder="Enter Company Billing Address"
                        value={formData.companyAddress}
                        onChange={handleChange}
                      />
                      {errors.companyAddress && (
                        <div className={styles.signupErrors}>
                          {errors.companyAddress}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Area/Locality/Road Name
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <input
                        className={styles.signupFormSectionInput}
                        type="text"
                        name="locality"
                        placeholder="Enter Area/Locality/Road Name"
                        value={formData.locality}
                        onChange={handleChange}
                      />
                      {errors.locality && (
                        <div className={styles.signupErrors}>
                          {errors.locality}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Landmark
                      </label>
                      <input
                        className={styles.signupFormSectionInput}
                        type="text"
                        name="landMark"
                        placeholder="Enter Landmark"
                        value={formData.landMark}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Country<span className={styles.labelStamp}>*</span>
                      </label>
                      <Select
                        options={Country.getAllCountries()}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.isoCode}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        placeholder="Select Country"
                      />
                      {errors.country && (
                        <div className={styles.signupErrors}>
                          {errors.country}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
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
                      />
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
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
                      />
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Pincode/Postcode
                      </label>
                      <input
                        className={styles.signupFormSectionInput}
                        type="text"
                        name="pincode"
                        placeholder="Enter Pincode/Postcode"
                        value={formData.pincode}
                        onChange={handleChange}
                      />
                      {errors.pincode && (
                        <div className={styles.signupErrors}>
                          {errors.pincode}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Medhub Global Sales Representative
                      </label>
                      <div className={styles.signupTooltipClass}>
                        <input
                          className={styles.signupFormSectionInput}
                          type="text"
                          name="salesPersonName"
                          placeholder="Enter Medhub Global Sales Representative"
                          value={formData.salesPersonName}
                          onChange={handleChange}
                        />
                        <span
                          className={styles.emailInfoIcon}
                          data-tooltip-id="company-name-tooltip"
                          data-tooltip-content="Provide Medhub Global Sales Representative Name"
                        >
                          <img
                            src={Information}
                            className={styles.tooltipIcons}
                            alt="information"
                          />
                        </span>
                        <Tooltip id="company-name-tooltip" />
                      </div>
                      {errors.salesPersonName && (
                        <div className={styles.signupErrors}>
                          {errors.salesPersonName}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Country of Origin
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <Select
                        className={styles.signupFormsSectionsSelect}
                        options={countries}
                        value={countries.find(
                          (option) => option.value === formData.originCountry
                        )}
                        onChange={handleCountryOriginChange}
                      />
                      {errors.originCountry && (
                        <div className={styles.signupErrors}>
                          {errors.originCountry}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Country of Operation
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      {countries.length > 0 && (
                        <MultiSelectDropdown
                          className={`${styles.customMultiSelect} ${styles.signupFormsSectionsSelect}`}
                          options={countries}
                          value={formData.operationCountries}
                          onChange={handleOperationCountriesChange}
                          getDropdownButtonLabel={getDropdownButtonLabel}
                          style={{ width: "100%!important" }}
                        />
                      )}
                      {errors.operationCountries && (
                        <div className={styles.signupErrors}>
                          {errors.operationCountries}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Trading Categories
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      {category.length > 0 && (
                        <MultiSelectDropdown
                          className={`${styles.customMultiSelect} ${styles.signupFormsSectionsSelect}`}
                          options={category}
                          value={formData.categories}
                          onChange={handleCategoriesChange}
                          getDropdownButtonLabel={getDropdownButtonLabel}
                          style={{ width: "100%!important" }}
                        />
                      )}
                      {errors.categories && (
                        <div className={styles.signupErrors}>
                          {errors.categories}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Tags
                      </label>
                      <input
                        className={styles.signupFormSectionInput}
                        type="text"
                        name="tags"
                        placeholder="Enter Tags (comma separated)"
                        value={formData.tags}
                        onChange={handleChange}
                      />
                      {errors.tags && (
                        <div className={styles.signupErrors}>{errors.tags}</div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Company License No.
                      </label>
                      <input
                        className={styles.signupFormSectionInput}
                        type="text"
                        name="companyLicenseNo"
                        placeholder="Enter License No."
                        value={formData.companyLicenseNo}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        License Expiry/Renewal Date
                      </label>
                      <DatePicker
                        className={styles.signupFormSectionInput}
                        selected={
                          formData.companyLicenseExpiry
                            ? parseDateString(formData.companyLicenseExpiry)
                            : null
                        }
                        onChange={(date) => {
                          const formattedDate = date
                            ? date.toLocaleDateString("en-GB")
                            : "";
                          handleChange({
                            target: {
                              name: "companyLicenseExpiry",
                              value: formattedDate,
                            },
                          });
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/MM/yyyy"
                        minDate={new Date()}
                        showYearDropdown
                        scrollableYearDropdown
                        disabledKeyboardNavigation={false}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                    </div>

                      <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Annual Turnover
                      </label>
                      <input
                        className={styles.signupFormSectionInput}
                        type="number"
                        name="annualTurnover"
                        placeholder="Enter Annual Turnover in USD"
                        value={formData.annualTurnover}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Year Company Founded
                      </label>
                      <DatePicker
                        className={styles.signupFormSectionInput}
                        selected={selectedYear}
                        name="yrFounded"
                        onChange={handleYearChange}
                        placeholderText="Select Year Company Founded"
                        showYearPicker
                        dateFormat="yyyy"
                        maxDate={new Date()}
                      />
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        About Company
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.signupTooltipClass}>
                        <textarea
                          className={styles.signupFormSectionInput}
                          name="description"
                          rows="2"
                          cols="50"
                          placeholder="Enter Description"
                          value={formData.description}
                          onChange={handleChange}
                        />
                        <span
                          className={styles.infoIcon}
                          data-tooltip-id="about-company-tooltip"
                          data-tooltip-content="Provide a brief description about your company."
                        >
                          <img
                            src={Information}
                            className={styles.tooltipIcons}
                            alt="information"
                          />
                        </span>
                        <Tooltip id="about-company-tooltip" />
                      </div>
                      {errors.description && (
                        <div className={styles.signupErrors}>
                          {errors.description}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Annual Turnover
                      </label>
                      <input
                        className={styles.signupFormSectionInput}
                        type="text"
                        name="annualTurnover"
                        placeholder="Enter Annual Turnover in USD"
                        value={formData.annualTurnover}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Year Company Founded
                      </label>
                      <DatePicker
                        className={styles.signupFormSectionInput}
                        selected={selectedYear}
                        name="yrFounded"
                        onChange={handleYearChange}
                        placeholderText="Select Year Company Founded"
                        showYearPicker
                        dateFormat="yyyy"
                        maxDate={new Date()}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Bank Details<span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.signupTooltipClass}>
                        <textarea
                          className={styles.signupFormSectionInput}
                          type="text"
                          name="bankdetails"
                          rows="2"
                          cols="50"
                          placeholder="Enter Bank Details (Bank Name, Account Number, IFSC Code)"
                          value={formData.bankdetails}
                          onChange={handleChange}
                        />
                        <span
                          className={styles.infoIcon}
                          data-tooltip-id="bank-details-tooltip"
                          data-tooltip-content="Provide the following information: Bank Name, Account Number, IFSC Code (comma separated)"
                        >
                          <img
                            src={Information}
                            className={styles.tooltipIcons}
                            alt="information"
                          />
                        </span>
                        <Tooltip id="bank-details-tooltip" />
                      </div>
                      {errors.bankdetails && (
                        <div className={styles.signupErrors}>
                          {errors.bankdetails}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Business/Trade Activity Code
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <textarea
                        className={styles.signupFormSectionInput}
                        name="activityCode"
                        rows="2"
                        cols="50"
                        placeholder="Enter Business/Trade Activity Code"
                        value={formData.activityCode}
                        onChange={handleChange}
                      />
                      {errors.activityCode && (
                        <div className={styles.signupErrors}>
                          {errors.activityCode}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.signupFormSectionContainer}>
                  <div className={styles.signupInnerHeading}>
                    Contact Details
                  </div>
                  <div className={styles.signupFormInnerDivSection}>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Contact Name<span className={styles.labelStamp}>*</span>
                      </label>
                      <input
                        className={styles.signupFormSectionInput}
                        type="text"
                        name="contactPersonName"
                        placeholder="Enter Contact Name"
                        value={formData.contactPersonName}
                        onChange={handleChange}
                      />
                      {errors.contactPersonName && (
                        <div className={styles.signupErrors}>
                          {errors.contactPersonName}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Email ID<span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.signupTooltipClass}>
                        <input
                          className={styles.signupFormSectionInput}
                          type="text"
                          name="email"
                          placeholder="Enter Email ID"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <span
                          className={styles.emailInfoIcon}
                          data-tooltip-id="email-tooltip"
                          data-tooltip-content="Enter a valid email address for communication."
                        >
                          <img
                            src={Information}
                            className={styles.tooltipIcons}
                            alt="information"
                          />
                        </span>
                        <Tooltip id="email-tooltip" />
                      </div>
                      {errors.email && (
                        <div className={styles.signupErrors}>
                          {errors.email}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Mobile No.<span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.signupTooltipClass}>
                        <PhoneInput
                          className={styles.signupFormSectionPhoneInput}
                          defaultCountry="gb"
                          name="mobile"
                          value={mobile}
                          onChange={(value) => {
                            handlePhoneChange("mobile", value);
                            setMobile(value);
                          }}
                        />
                        <span
                          className={styles.emailInfoIcon}
                          data-tooltip-id="mobile-tooltip"
                          data-tooltip-content="Provide your mobile number, including the country code."
                        >
                          <img
                            src={Information}
                            className={styles.tooltipIcons}
                            alt="information"
                          />
                        </span>
                        <Tooltip id="mobile-tooltip" />
                      </div>
                      {errors.mobile && (
                        <div className={styles.signupErrors}>
                          {errors.mobile}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Designation<span className={styles.labelStamp}>*</span>
                      </label>
                      <div className={styles.signupTooltipClass}>
                        <input
                          className={styles.signupFormSectionInput}
                          type="text"
                          name="designation"
                          placeholder="Enter Designation"
                          value={formData.designation}
                          onChange={handleChange}
                        />
                        <span
                          className={styles.emailInfoIcon}
                          data-tooltip-id="designation-tooltip"
                          data-tooltip-content="Mention your professional designation."
                        >
                          <img
                            src={Information}
                            className={styles.tooltipIcons}
                            alt="information"
                          />
                        </span>
                        <Tooltip id="designation-tooltip" />
                      </div>
                      {errors.designation && (
                        <div className={styles.signupErrors}>
                          {errors.designation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.signupFormSectionContainer}>
                  <div className={styles.signupInnerHeading}>Documents</div>
                  <div className={styles.signupFormInnerDivSection}>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Upload Company Logo
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <ImageUploader
                        onUploadStatusChange={handleImageUpload}
                        filePreviews={logoPreviews}
                        setFilePreviews={setlogoPreviews}
                        imageType="logo"
                        reset={resetUploaders}
                        allowMultiple={false}
                        showTooltip={true}
                        tooltipMessage="Only JPEG and PNG image formats are allowed."
                      />
                      {errors.logoImage && (
                        <div className={styles.signupErrors}>
                          {errors.logoImage}
                        </div>
                      )}
                    </div>
                    <div className={styles.signupFormSectionDiv}>
                      <label className={styles.signupFormSectionLabel}>
                        Upload Trade License
                        <span className={styles.labelStamp}>*</span>
                      </label>
                      <ImageUploader
                        onUploadStatusChange={handleImageUpload}
                        filePreviews={tradeLicensePreviews}
                        setFilePreviews={setTradeLicensePreviews}
                        imageType="license"
                        reset={resetUploaders}
                        allowMultiple={true}
                        showTooltip={true}
                        tooltipMessage="Only PDF and Docx formats are allowed."
                      />
                      {errors.licenseImage && (
                        <div className={styles.signupErrors}>
                          {errors.licenseImage}
                        </div>
                      )}
                    </div>
                    {selectedCompanyType?.value !== "service provider" && (
                      <div className={styles.signupDocumentSection}>
                        <div className={styles.signupAddButtonSection}>
                          <button
                            className={styles.signupDocumentHead}
                            onClick={(e) => addNewSection(e)}
                          >
                            Add
                          </button>
                        </div>
                        {certificateFileNDate.map((section, index) => (
                          <div
                            key={index}
                            className={styles.documentInnerSection}
                          >
                            <div className={styles.signupFormSectionDiv}>
                              <label className={styles.signupFormSectionLabel}>
                                Upload Certificate
                                <span className={styles.labelStamp}>*</span>
                              </label>
                              <CertificateUploader
                                onUploadStatusChange={(status) =>
                                  handleImageUpload(status, index)
                                }
                                filePreviews={section.file}
                                setFilePreviews={(files) =>
                                  setfile(files, index)
                                }
                                reset={resetUploaders}
                                allowMultiple={false}
                                showTooltip={true}
                                tooltipMessage="Certificate could be any company based compliance certificates: ISO, Heath and Safety, WDA."
                                certificateFileNDate={certificateFileNDate}
                                setCertificateFileNDate={
                                  setCertificateFileNDate
                                }
                                cNCFileArray={cNCFileArray}
                                setCNCFileArray={setCNCFileArray}
                                cNCFileError={cNCFileError}
                                setCNCFileError={setCNCFileError}
                                mainIndex={index}
                              />
                              {cNCFileError?.[index] && (
                                <div className={styles.signupErrors}>
                                  {cNCFileError?.[index]}
                                </div>
                              )}
                            </div>
                            <div className={styles.signupFormSectionDiv}>
                              <label className={styles.signupFormSectionLabel}>
                                Expiry Date
                              </label>
                              <DatePicker
                                className={styles.signupFormSectionInput}
                                selected={section.date}
                                onChange={(date) =>
                                  handleDateChange(date, index)
                                }
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/MM/yyyy"
                                minDate={new Date()}
                                showYearDropdown
                                scrollableYearDropdown
                                disabledKeyboardNavigation={false}
                                onKeyDown={(e) => {
                                  e.preventDefault();
                                }}
                              />
                            </div>
                            {certificateFileNDate.length > 1 && (
                              <div
                                onClick={() => removeSection(index)}
                                className={styles.signupCrossButton}
                              >
                                <img
                                  src={Cross}
                                  alt="cross"
                                  className={styles.crossIcon}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedCompanyType?.value === "medical practitioner" && (
                      <div className={styles.signupFormSectionDiv}>
                        <label className={styles.signupFormSectionLabel}>
                          Upload a Medical Practitioner Certificate
                          <span className={styles.labelStamp}>*</span>
                        </label>
                        <ImageUploader
                          onUploadStatusChange={handleImageUpload}
                          filePreviews={medicalPractitionerPreview}
                          setFilePreviews={setMedicalPractiotionerPreview}
                          imageType="medicalCertificate"
                          reset={resetUploaders}
                          allowMultiple={true}
                        />
                        {errors.medicalCertificateImage && (
                          <div className={styles.signupErrors}>
                            {errors.medicalCertificateImage}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className={styles.signupFormSectionCheckbox}>
                    <div
                      className={styles.termsCondition}
                      onClick={() => setShowTnC(true)}
                    >
                      Terms & Conditions
                      <span className={styles.labelStamp}>*</span>
                    </div>
                  </div>
                </div>
                <div className={styles.signupFormContButton}>
                  <button
                    type="submit"
                    className={styles.signupFormButtonSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className={styles.loadingSpinner}></div>
                    ) : (
                      "Submit"
                    )}
                  </button>
                  <div
                    className={styles.signupFormButtonCancel}
                    onClick={handleCancel}
                  >
                    Cancel
                  </div>
                </div>
              </form>
            </div>
          </div>
          <SuccessModal show={showModal} handleClose={handleCloseModal} />
        </>
      )}
    </>
  );
};

export default SupplierSignUp;
